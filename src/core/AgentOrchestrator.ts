/**
 * MASTER AGENT ORCHESTRATOR
 * Central coordination system for all 52 agents in the production chain
 * Manages execution flow, dependencies, approvals, and chain sequencing
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import {
  AGENT_REGISTRY,
  CHAIN_REGISTRY,
  ORCHESTRATION_SETTINGS,
  AGENT_CLASS_MAPPING,
  AgentConfig,
  ChainConfig,
  AgentStatus,
  ChainStatus,
  getAgentsByChain,
  getAgentDependencies,
  getChainExecutionOrder
} from '../config/orchestration-config';
import { ProductionQueue, getProductionQueue, QueueItem } from './ProductionQueue';
import { AgentMonitor, getAgentMonitor } from './AgentMonitor';

// Workflow State
export interface WorkflowState {
  id: string;
  status: 'running' | 'paused' | 'stopped' | 'completed' | 'error';
  currentChainId: number;
  currentAgentId: string | null;
  startedAt: number;
  pausedAt?: number;
  completedAt?: number;
  cycleCount: number;
  data: Record<string, any>;
  approvals: Record<string, ApprovalState>;
  errors: WorkflowError[];
}

// Approval State
export interface ApprovalState {
  agentId: string;
  requestedAt: number;
  approvedAt?: number;
  rejectedAt?: number;
  approvedBy?: string;
  data: any;
  status: 'pending' | 'approved' | 'rejected' | 'timeout';
}

// Workflow Error
export interface WorkflowError {
  timestamp: number;
  agentId: string;
  chainId: number;
  error: string;
  stack?: string;
  recovered: boolean;
}

// Agent Instance
interface AgentInstance {
  id: string;
  config: AgentConfig;
  instance: any;
  status: AgentStatus;
  lastResult?: any;
}

// Execution Context
export interface ExecutionContext {
  workflowId: string;
  chainId: number;
  agentId: string;
  correlationId: string;
  data: Record<string, any>;
  previousResults: Record<string, any>;
  metadata: Record<string, any>;
}

// Chain Execution Result
interface ChainExecutionResult {
  chainId: number;
  success: boolean;
  results: Record<string, any>;
  errors: WorkflowError[];
  duration: number;
}

/**
 * Master Agent Orchestrator
 * The brain of the 52-agent production system
 */
export class AgentOrchestrator extends EventEmitter {
  private queue: ProductionQueue;
  private monitor: AgentMonitor;
  private agents: Map<string, AgentInstance> = new Map();
  private workflows: Map<string, WorkflowState> = new Map();
  private chainStatus: Map<number, ChainStatus> = new Map();
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private executionLoop: NodeJS.Timeout | null = null;
  private pendingApprovals: Map<string, ApprovalState> = new Map();

  constructor() {
    super();
    this.queue = getProductionQueue();
    this.monitor = getAgentMonitor();
    this.initializeChainStatus();
    this.setupEventListeners();
  }

  /**
   * Initialize chain statuses
   */
  private initializeChainStatus(): void {
    for (const chainId of getChainExecutionOrder()) {
      this.chainStatus.set(chainId, 'active');
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Queue events
    this.queue.on('itemCompleted', (item: QueueItem, result: any) => {
      this.handleItemCompleted(item, result);
    });

    this.queue.on('itemFailed', (item: QueueItem, error: string) => {
      this.handleItemFailed(item, error);
    });

    this.queue.on('itemDead', (item: QueueItem) => {
      this.handleItemDead(item);
    });

    // Monitor events
    this.monitor.on('criticalAlert', (alert: any) => {
      this.handleCriticalAlert(alert);
    });
  }

  /**
   * Initialize all agents
   */
  public async initialize(): Promise<void> {
    console.log('Initializing Agent Orchestrator...');

    for (const [agentId, config] of Object.entries(AGENT_REGISTRY)) {
      try {
        // Dynamic import of agent class
        const className = AGENT_CLASS_MAPPING[agentId];
        if (!className) {
          console.warn(`No class mapping for agent: ${agentId}`);
          continue;
        }

        // Create agent instance placeholder
        // In production, this would dynamically import and instantiate the agent
        this.agents.set(agentId, {
          id: agentId,
          config,
          instance: null, // Will be loaded on demand
          status: 'idle'
        });

        this.monitor.updateStatus(agentId, 'idle');
      } catch (error: any) {
        console.error(`Failed to initialize agent ${agentId}:`, error.message);
      }
    }

    this.monitor.start();
    this.emit('initialized', { agentCount: this.agents.size });
    console.log(`Orchestrator initialized with ${this.agents.size} agents`);
  }

  /**
   * Load agent instance dynamically
   */
  private async loadAgent(agentId: string): Promise<any> {
    const agentData = this.agents.get(agentId);
    if (!agentData) {
      throw new Error(`Unknown agent: ${agentId}`);
    }

    if (agentData.instance) {
      return agentData.instance;
    }

    try {
      const className = AGENT_CLASS_MAPPING[agentId];
      // Dynamic import based on agent class name
      const module = await import(`../agents/${className}`);
      const AgentClass = module[className] || module.default;

      if (!AgentClass) {
        throw new Error(`Agent class not found: ${className}`);
      }

      agentData.instance = new AgentClass();
      this.agents.set(agentId, agentData);

      return agentData.instance;
    } catch (error: any) {
      console.error(`Failed to load agent ${agentId}:`, error.message);
      throw error;
    }
  }

  /**
   * Start the orchestrator
   */
  public async start(): Promise<string> {
    if (this.isRunning) {
      throw new Error('Orchestrator is already running');
    }

    const workflowId = uuidv4();
    const workflow: WorkflowState = {
      id: workflowId,
      status: 'running',
      currentChainId: 1,
      currentAgentId: null,
      startedAt: Date.now(),
      cycleCount: 0,
      data: {},
      approvals: {},
      errors: []
    };

    this.workflows.set(workflowId, workflow);
    this.isRunning = true;
    this.isPaused = false;

    // Start the execution loop
    this.startExecutionLoop(workflowId);

    this.emit('workflowStarted', workflow);
    console.log(`Workflow ${workflowId} started`);

    return workflowId;
  }

  /**
   * Start the main execution loop
   */
  private startExecutionLoop(workflowId: string): void {
    this.executionLoop = setInterval(async () => {
      if (!this.isRunning || this.isPaused) return;

      const workflow = this.workflows.get(workflowId);
      if (!workflow || workflow.status !== 'running') return;

      try {
        await this.processNextStep(workflow);
      } catch (error: any) {
        console.error('Execution loop error:', error.message);
        this.recordError(workflow, 'orchestrator', 0, error);
      }
    }, 1000);
  }

  /**
   * Process next step in the workflow
   */
  private async processNextStep(workflow: WorkflowState): Promise<void> {
    const chainId = workflow.currentChainId;
    const chain = CHAIN_REGISTRY[chainId];

    if (!chain || !chain.enabled) {
      // Move to next chain
      await this.advanceToNextChain(workflow);
      return;
    }

    // Check chain status
    const status = this.chainStatus.get(chainId);
    if (status === 'paused' || status === 'stopped') {
      return;
    }

    // Check for pending approvals
    if (status === 'waiting_approval') {
      await this.checkApprovals(workflow);
      return;
    }

    // Get next agent to execute
    const nextAgent = this.getNextAgentToExecute(workflow, chain);
    if (!nextAgent) {
      // Chain complete, move to next
      await this.completeChain(workflow, chainId);
      return;
    }

    // Execute the agent
    await this.executeAgent(workflow, nextAgent);
  }

  /**
   * Get the next agent to execute in the chain
   */
  private getNextAgentToExecute(workflow: WorkflowState, chain: ChainConfig): string | null {
    for (const agentId of chain.agents) {
      const agent = AGENT_REGISTRY[agentId];
      if (!agent || !agent.enabled) continue;

      // Check if already completed in this cycle
      if (workflow.data[`${agentId}_completed`]) {
        continue;
      }

      // Check dependencies
      const dependencies = getAgentDependencies(agentId);
      const dependenciesMet = dependencies.every(dep =>
        workflow.data[`${dep.id}_completed`]
      );

      if (dependenciesMet) {
        return agentId;
      }
    }

    return null;
  }

  /**
   * Execute an agent
   */
  private async executeAgent(workflow: WorkflowState, agentId: string): Promise<void> {
    const agent = AGENT_REGISTRY[agentId];
    if (!agent) return;

    workflow.currentAgentId = agentId;
    this.monitor.recordExecutionStart(agentId);
    this.emit('agentExecutionStarted', { workflowId: workflow.id, agentId });

    const startTime = Date.now();

    try {
      // Check if approval is required
      if (agent.requiresApproval) {
        await this.requestApproval(workflow, agentId);
        return;
      }

      // Build execution context
      const context = this.buildExecutionContext(workflow, agentId);

      // Execute the agent
      const result = await this.runAgent(agentId, context);

      // Store results
      for (const output of agent.outputs) {
        if (result[output] !== undefined) {
          workflow.data[output] = result[output];
        }
      }

      workflow.data[`${agentId}_completed`] = true;
      workflow.data[`${agentId}_result`] = result;

      const duration = Date.now() - startTime;
      this.monitor.recordExecutionComplete(agentId, duration, true);

      this.emit('agentExecutionCompleted', {
        workflowId: workflow.id,
        agentId,
        result,
        duration
      });

    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.monitor.recordExecutionComplete(agentId, duration, false, error.message);
      this.recordError(workflow, agentId, agent.chainId, error);

      // Check if should retry
      if (agent.retryLimit > 0) {
        await this.handleAgentError(workflow, agentId, error);
      } else {
        throw error;
      }
    }
  }

  /**
   * Run agent with timeout
   */
  private async runAgent(agentId: string, context: ExecutionContext): Promise<any> {
    const agent = AGENT_REGISTRY[agentId];
    if (!agent) {
      throw new Error(`Unknown agent: ${agentId}`);
    }

    // Load agent instance
    const instance = await this.loadAgent(agentId);

    // Execute with timeout
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Agent ${agentId} timed out after ${agent.timeout}ms`));
      }, agent.timeout);

      try {
        let result;

        // Check for common execution methods
        if (typeof instance.execute === 'function') {
          result = await instance.execute(context.data, context);
        } else if (typeof instance.run === 'function') {
          result = await instance.run(context.data, context);
        } else if (typeof instance.process === 'function') {
          result = await instance.process(context.data, context);
        } else {
          // Default: call the agent as a function or use analyze method
          if (typeof instance.analyze === 'function') {
            result = await instance.analyze(context.data);
          } else {
            result = await instance(context.data, context);
          }
        }

        clearTimeout(timeout);
        resolve(result || {});
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  /**
   * Build execution context for agent
   */
  private buildExecutionContext(workflow: WorkflowState, agentId: string): ExecutionContext {
    const agent = AGENT_REGISTRY[agentId];

    // Gather input data from previous agents
    const data: Record<string, any> = {};
    for (const input of agent.inputs) {
      if (workflow.data[input] !== undefined) {
        data[input] = workflow.data[input];
      }
    }

    // Get previous results
    const previousResults: Record<string, any> = {};
    for (const depId of agent.dependencies) {
      if (workflow.data[`${depId}_result`]) {
        previousResults[depId] = workflow.data[`${depId}_result`];
      }
    }

    return {
      workflowId: workflow.id,
      chainId: agent.chainId,
      agentId,
      correlationId: workflow.id,
      data,
      previousResults,
      metadata: {
        cycleCount: workflow.cycleCount,
        startedAt: workflow.startedAt
      }
    };
  }

  /**
   * Request approval from user
   */
  private async requestApproval(workflow: WorkflowState, agentId: string): Promise<void> {
    const approval: ApprovalState = {
      agentId,
      requestedAt: Date.now(),
      data: workflow.data,
      status: 'pending'
    };

    workflow.approvals[agentId] = approval;
    this.pendingApprovals.set(`${workflow.id}_${agentId}`, approval);
    this.chainStatus.set(AGENT_REGISTRY[agentId].chainId, 'waiting_approval');

    this.emit('approvalRequested', {
      workflowId: workflow.id,
      agentId,
      data: workflow.data
    });
  }

  /**
   * Approve pending approval
   */
  public approve(workflowId: string, agentId: string, approvedBy: string = 'Yassine'): boolean {
    const key = `${workflowId}_${agentId}`;
    const approval = this.pendingApprovals.get(key);

    if (!approval || approval.status !== 'pending') {
      return false;
    }

    approval.status = 'approved';
    approval.approvedAt = Date.now();
    approval.approvedBy = approvedBy;

    const workflow = this.workflows.get(workflowId);
    if (workflow) {
      workflow.approvals[agentId] = approval;
      workflow.data[`${agentId}_completed`] = true;
      workflow.data[`${agentId}_approved`] = true;

      const agent = AGENT_REGISTRY[agentId];
      this.chainStatus.set(agent.chainId, 'active');
    }

    this.pendingApprovals.delete(key);
    this.emit('approvalGranted', { workflowId, agentId, approvedBy });

    return true;
  }

  /**
   * Reject pending approval
   */
  public reject(workflowId: string, agentId: string, reason?: string): boolean {
    const key = `${workflowId}_${agentId}`;
    const approval = this.pendingApprovals.get(key);

    if (!approval || approval.status !== 'pending') {
      return false;
    }

    approval.status = 'rejected';
    approval.rejectedAt = Date.now();

    const workflow = this.workflows.get(workflowId);
    if (workflow) {
      workflow.approvals[agentId] = approval;
      workflow.status = 'paused';
    }

    this.pendingApprovals.delete(key);
    this.emit('approvalRejected', { workflowId, agentId, reason });

    return true;
  }

  /**
   * Check pending approvals for timeout
   */
  private async checkApprovals(workflow: WorkflowState): Promise<void> {
    const now = Date.now();

    for (const [agentId, approval] of Object.entries(workflow.approvals)) {
      if (approval.status !== 'pending') continue;

      const elapsed = now - approval.requestedAt;
      if (elapsed > ORCHESTRATION_SETTINGS.approvalTimeout) {
        approval.status = 'timeout';
        this.emit('approvalTimeout', { workflowId: workflow.id, agentId });
      }
    }
  }

  /**
   * Complete a chain and move to next
   */
  private async completeChain(workflow: WorkflowState, chainId: number): Promise<void> {
    // Reset chain completion flags
    const chain = CHAIN_REGISTRY[chainId];
    for (const agentId of chain.agents) {
      delete workflow.data[`${agentId}_completed`];
    }

    this.emit('chainCompleted', { workflowId: workflow.id, chainId });
    await this.advanceToNextChain(workflow);
  }

  /**
   * Advance to next chain
   */
  private async advanceToNextChain(workflow: WorkflowState): Promise<void> {
    const currentChainId = workflow.currentChainId;
    const currentChain = CHAIN_REGISTRY[currentChainId];

    // Check for loop back
    if (currentChain?.loopBack) {
      workflow.currentChainId = currentChain.loopBack;
      workflow.cycleCount++;

      // Add delay between cycles
      await this.delay(ORCHESTRATION_SETTINGS.cycleDelay);

      this.emit('cycleCompleted', {
        workflowId: workflow.id,
        cycleCount: workflow.cycleCount
      });
    } else {
      // Move to next chain
      const nextChainId = currentChainId + 1;
      if (CHAIN_REGISTRY[nextChainId]) {
        workflow.currentChainId = nextChainId;
      } else {
        // All chains complete
        workflow.currentChainId = 1;
        workflow.cycleCount++;

        await this.delay(ORCHESTRATION_SETTINGS.cycleDelay);

        this.emit('cycleCompleted', {
          workflowId: workflow.id,
          cycleCount: workflow.cycleCount
        });
      }
    }

    workflow.currentAgentId = null;
  }

  /**
   * Handle agent execution error
   */
  private async handleAgentError(workflow: WorkflowState, agentId: string, error: Error): Promise<void> {
    const agent = AGENT_REGISTRY[agentId];

    // Queue for retry
    this.queue.enqueue(agentId, {
      workflowId: workflow.id,
      context: this.buildExecutionContext(workflow, agentId),
      error: error.message
    }, {
      priority: agent.priority,
      correlationId: workflow.id
    });

    this.emit('agentRetryQueued', { workflowId: workflow.id, agentId, error: error.message });
  }

  /**
   * Record error in workflow
   */
  private recordError(workflow: WorkflowState, agentId: string, chainId: number, error: Error): void {
    workflow.errors.push({
      timestamp: Date.now(),
      agentId,
      chainId,
      error: error.message,
      stack: error.stack,
      recovered: false
    });

    this.monitor.createAlert({
      type: 'error',
      source: agentId,
      message: error.message,
      metadata: { workflowId: workflow.id, chainId }
    });
  }

  /**
   * Handle completed queue item
   */
  private handleItemCompleted(item: QueueItem, result: any): void {
    console.log(`Queue item completed: ${item.agentId}`);
  }

  /**
   * Handle failed queue item
   */
  private handleItemFailed(item: QueueItem, error: string): void {
    console.error(`Queue item failed: ${item.agentId} - ${error}`);
  }

  /**
   * Handle dead letter item
   */
  private handleItemDead(item: QueueItem): void {
    console.error(`Item moved to dead letter queue: ${item.agentId}`);
    this.monitor.createAlert({
      type: 'critical',
      source: item.agentId,
      message: `Agent failed after all retries: ${item.metadata.lastError}`
    });
  }

  /**
   * Handle critical alert
   */
  private handleCriticalAlert(alert: any): void {
    console.error(`CRITICAL ALERT: ${alert.message}`);
    this.emit('criticalAlert', alert);
  }

  /**
   * Pause the orchestrator
   */
  public pause(workflowId?: string): void {
    if (workflowId) {
      const workflow = this.workflows.get(workflowId);
      if (workflow) {
        workflow.status = 'paused';
        workflow.pausedAt = Date.now();
      }
    } else {
      this.isPaused = true;
      for (const workflow of this.workflows.values()) {
        if (workflow.status === 'running') {
          workflow.status = 'paused';
          workflow.pausedAt = Date.now();
        }
      }
    }
    this.emit('paused', { workflowId });
  }

  /**
   * Resume the orchestrator
   */
  public resume(workflowId?: string): void {
    if (workflowId) {
      const workflow = this.workflows.get(workflowId);
      if (workflow && workflow.status === 'paused') {
        workflow.status = 'running';
        delete workflow.pausedAt;
      }
    } else {
      this.isPaused = false;
      for (const workflow of this.workflows.values()) {
        if (workflow.status === 'paused') {
          workflow.status = 'running';
          delete workflow.pausedAt;
        }
      }
    }
    this.emit('resumed', { workflowId });
  }

  /**
   * Stop the orchestrator
   */
  public stop(workflowId?: string): void {
    if (workflowId) {
      const workflow = this.workflows.get(workflowId);
      if (workflow) {
        workflow.status = 'stopped';
        workflow.completedAt = Date.now();
      }
    } else {
      this.isRunning = false;
      if (this.executionLoop) {
        clearInterval(this.executionLoop);
        this.executionLoop = null;
      }
      for (const workflow of this.workflows.values()) {
        workflow.status = 'stopped';
        workflow.completedAt = Date.now();
      }
    }
    this.emit('stopped', { workflowId });
  }

  /**
   * Skip an agent
   */
  public skipAgent(workflowId: string, agentId: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    workflow.data[`${agentId}_completed`] = true;
    workflow.data[`${agentId}_skipped`] = true;

    this.emit('agentSkipped', { workflowId, agentId });
    return true;
  }

  /**
   * Force retry an agent
   */
  public forceRetry(workflowId: string, agentId: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    delete workflow.data[`${agentId}_completed`];
    delete workflow.data[`${agentId}_result`];

    this.emit('agentRetryForced', { workflowId, agentId });
    return true;
  }

  /**
   * Pause a specific chain
   */
  public pauseChain(chainId: number): void {
    this.chainStatus.set(chainId, 'paused');
    this.emit('chainPaused', { chainId });
  }

  /**
   * Resume a specific chain
   */
  public resumeChain(chainId: number): void {
    this.chainStatus.set(chainId, 'active');
    this.emit('chainResumed', { chainId });
  }

  /**
   * Get workflow state
   */
  public getWorkflow(workflowId: string): WorkflowState | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get all workflows
   */
  public getAllWorkflows(): WorkflowState[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Get current status
   */
  public getStatus(): {
    isRunning: boolean;
    isPaused: boolean;
    activeWorkflows: number;
    chainStatuses: Record<number, ChainStatus>;
    agentStatuses: Record<string, AgentStatus>;
    pendingApprovals: string[];
    queueStats: any;
    monitorSummary: any;
  } {
    const agentStatuses: Record<string, AgentStatus> = {};
    for (const [id, agent] of this.agents.entries()) {
      agentStatuses[id] = agent.status;
    }

    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      activeWorkflows: this.workflows.size,
      chainStatuses: Object.fromEntries(this.chainStatus),
      agentStatuses,
      pendingApprovals: Array.from(this.pendingApprovals.keys()),
      queueStats: this.queue.getStats(),
      monitorSummary: this.monitor.getSystemOverview()
    };
  }

  /**
   * Get chain status visualization data
   */
  public getVisualizationData(): {
    chains: Array<{
      id: number;
      name: string;
      status: ChainStatus;
      agents: Array<{
        id: string;
        name: string;
        status: AgentStatus;
        isCurrentAgent: boolean;
        queueSize: number;
      }>;
    }>;
    connections: Array<{
      from: string;
      to: string;
      type: 'chain' | 'agent';
    }>;
  } {
    const chains = [];
    const connections = [];

    for (const [chainId, chain] of Object.entries(CHAIN_REGISTRY)) {
      const id = Number(chainId);
      const agents = [];

      for (const agentId of chain.agents) {
        const agentInstance = this.agents.get(agentId);
        const config = AGENT_REGISTRY[agentId];

        let isCurrentAgent = false;
        for (const workflow of this.workflows.values()) {
          if (workflow.currentAgentId === agentId) {
            isCurrentAgent = true;
            break;
          }
        }

        agents.push({
          id: agentId,
          name: config.displayName,
          status: agentInstance?.status || 'idle',
          isCurrentAgent,
          queueSize: this.queue.getPendingForAgent(agentId).length
        });

        // Add agent dependencies as connections
        for (const depId of config.dependencies) {
          connections.push({
            from: depId,
            to: agentId,
            type: 'agent' as const
          });
        }
      }

      chains.push({
        id,
        name: chain.displayName,
        status: this.chainStatus.get(id) || 'active',
        agents
      });

      // Add chain-to-chain connections
      if (chain.loopBack) {
        connections.push({
          from: `chain-${id}`,
          to: `chain-${chain.loopBack}`,
          type: 'chain' as const
        });
      }
    }

    return { chains, connections };
  }

  /**
   * Inject data into workflow
   */
  public injectData(workflowId: string, key: string, value: any): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    workflow.data[key] = value;
    this.emit('dataInjected', { workflowId, key });
    return true;
  }

  /**
   * Get pending approvals
   */
  public getPendingApprovals(): ApprovalState[] {
    return Array.from(this.pendingApprovals.values());
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Shutdown the orchestrator
   */
  public async shutdown(): Promise<void> {
    this.stop();
    this.monitor.stop();
    this.queue.stopProcessing();
    this.removeAllListeners();
    console.log('Orchestrator shut down');
  }
}

// Singleton instance
let orchestratorInstance: AgentOrchestrator | null = null;

export function getAgentOrchestrator(): AgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AgentOrchestrator();
  }
  return orchestratorInstance;
}

export default AgentOrchestrator;
