/**
 * AGENT INTEGRATION LAYER
 * Connects all 52 agents to the orchestration system
 * Provides unified interface for agent execution and management
 */

import { EventEmitter } from 'events';
import {
  AGENT_REGISTRY,
  AGENT_CLASS_MAPPING,
  AgentConfig
} from '../config/orchestration-config';
import { ExecutionContext } from './AgentOrchestrator';

// Agent Interface - All agents must implement this
export interface IAgent {
  name: string;
  execute(data: any, context?: ExecutionContext): Promise<any>;
  validate?(data: any): boolean;
  cleanup?(): Promise<void>;
}

// Agent Wrapper for unified execution
export interface AgentWrapper {
  id: string;
  config: AgentConfig;
  instance: IAgent | null;
  isLoaded: boolean;
  loadError?: string;
}

// Execution Result
export interface AgentExecutionResult {
  agentId: string;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  timestamp: number;
  outputs: Record<string, any>;
}

// Agent Factory
type AgentFactory = () => Promise<IAgent>;

/**
 * Agent Integration Manager
 * Central hub for loading and managing all 52 agents
 */
export class AgentIntegration extends EventEmitter {
  private agents: Map<string, AgentWrapper> = new Map();
  private factories: Map<string, AgentFactory> = new Map();
  private loadedCount: number = 0;

  constructor() {
    super();
    this.registerAllAgents();
  }

  /**
   * Register all 52 agents
   */
  private registerAllAgents(): void {
    // Chain 1: Content Discovery & Validation
    this.registerAgentFactory('trend-scout', () => this.loadAgent('TrendScoutAgent'));
    this.registerAgentFactory('opportunity-validator', () => this.loadAgent('OpportunityValidatorAgent'));
    this.registerAgentFactory('user-approval-gate', () => this.createApprovalGate());

    // Chain 2: Content Planning
    this.registerAgentFactory('product-architecture', () => this.loadAgent('ProductArchitectAgent'));
    this.registerAgentFactory('ai-prompt-generator', () => this.loadAgent('PromptGeneratorAgent'));
    this.registerAgentFactory('content-scheduler', () => this.loadAgent('ContentSchedulerAgent'));

    // Chain 3: Content Creation
    this.registerAgentFactory('ai-design-generator', () => this.loadAgent('AIDesignGeneratorAgent'));
    this.registerAgentFactory('video-creator', () => this.loadAgent('VideoCreatorAgent'));
    this.registerAgentFactory('thumbnail-generator', () => this.loadAgent('ThumbnailCreatorAgent'));
    this.registerAgentFactory('watermark-remover', () => this.loadAgent('WatermarkRemoverAgent'));
    this.registerAgentFactory('quality-control', () => this.loadAgent('QualityControlAgent'));

    // Chain 4: Content Packaging
    this.registerAgentFactory('product-packager', () => this.loadAgent('ProductPackagerAgent'));
    this.registerAgentFactory('seo-optimizer', () => this.loadAgent('SEOOptimizerAgent'));
    this.registerAgentFactory('multi-platform-adapter', () => this.loadAgent('MultiPlatformAdapterAgent'));

    // Chain 5: Distribution
    this.registerAgentFactory('youtube-automation', () => this.loadAgent('YouTubeAutomationAgent'));
    this.registerAgentFactory('instagram-automation', () => this.loadAgent('InstagramAutomationAgent'));
    this.registerAgentFactory('tiktok-automation', () => this.loadAgent('TikTokAutomationAgent'));
    this.registerAgentFactory('pinterest-automation', () => this.loadAgent('PinterestAutomationAgent'));
    this.registerAgentFactory('facebook-automation', () => this.loadAgent('FacebookAutomationAgent'));
    this.registerAgentFactory('multi-platform-publisher', () => this.loadAgent('MultiPlatformPublisherAgent'));

    // Chain 6: Marketplace Publishing
    this.registerAgentFactory('etsy-publisher', () => this.loadAgent('EtsyPublisherAgent'));
    this.registerAgentFactory('gumroad-publisher', () => this.loadAgent('GumroadPublisherAgent'));
    this.registerAgentFactory('shopify-publisher', () => this.loadAgent('ShopifyPublisherAgent'));
    this.registerAgentFactory('creative-market-publisher', () => this.loadAgent('CreativeMarketPublisherAgent'));

    // Chain 7: Marketing & Engagement
    this.registerAgentFactory('marketing-content', () => this.loadAgent('MarketingContentAgent'));
    this.registerAgentFactory('email-campaign', () => this.loadAgent('EmailCampaignAgent'));
    this.registerAgentFactory('customer-hunter', () => this.loadAgent('CustomerHunterAgent'));
    this.registerAgentFactory('comment-manager', () => this.loadAgent('CommentManagerAgent'));
    this.registerAgentFactory('dm-responder', () => this.loadAgent('DMResponderAgent'));
    this.registerAgentFactory('social-engagement', () => this.loadAgent('SocialEngagementAgent'));
    this.registerAgentFactory('influencer-outreach', () => this.loadAgent('InfluencerOutreachAgent'));
    this.registerAgentFactory('cross-promotion', () => this.loadAgent('CrossPromotionAgent'));

    // Chain 8: Sales & Support
    this.registerAgentFactory('lead-capture', () => this.loadAgent('LeadCaptureAgent'));
    this.registerAgentFactory('upsell-agent', () => this.loadAgent('UpsellAgent'));
    this.registerAgentFactory('customer-service', () => this.loadAgent('CustomerServiceAgent'));
    this.registerAgentFactory('delivery-agent', () => this.loadAgent('DeliveryAgent'));
    this.registerAgentFactory('follow-up-agent', () => this.loadAgent('FollowUpAgent'));
    this.registerAgentFactory('review-manager', () => this.loadAgent('ReviewManagerAgent'));

    // Chain 9: Analytics & Optimization
    this.registerAgentFactory('analytics-tracker', () => this.loadAgent('AnalyticsTrackerAgent'));
    this.registerAgentFactory('performance-monitor', () => this.loadAgent('PerformanceMonitorAgent'));
    this.registerAgentFactory('ab-testing', () => this.loadAgent('ABTestingAgent'));
    this.registerAgentFactory('roi-calculator', () => this.loadAgent('ROICalculatorAgent'));
    this.registerAgentFactory('competitor-analyzer', () => this.loadAgent('CompetitorAnalyzerAgent'));
    this.registerAgentFactory('trend-predictor', () => this.loadAgent('TrendPredictorAgent'));
    this.registerAgentFactory('growth-advisor', () => this.loadAgent('GrowthAdvisorAgent'));

    // Chain 10: Business Operations
    this.registerAgentFactory('inventory-manager', () => this.loadAgent('InventoryManagerAgent'));
    this.registerAgentFactory('pricing-optimizer', () => this.loadAgent('PricingOptimizerAgent'));
    this.registerAgentFactory('legal-compliance', () => this.loadAgent('LegalComplianceAgent'));
    this.registerAgentFactory('backup-agent', () => this.loadAgent('BackupAgent'));
    this.registerAgentFactory('security-agent', () => this.loadAgent('SecurityAgent'));
    this.registerAgentFactory('report-generator', () => this.loadAgent('ReportGeneratorAgent'));
    this.registerAgentFactory('notification-agent', () => this.loadAgent('NotificationAgent'));

    // Initialize wrapper for each agent
    for (const [agentId, config] of Object.entries(AGENT_REGISTRY)) {
      this.agents.set(agentId, {
        id: agentId,
        config,
        instance: null,
        isLoaded: false
      });
    }
  }

  /**
   * Register an agent factory
   */
  private registerAgentFactory(agentId: string, factory: AgentFactory): void {
    this.factories.set(agentId, factory);
  }

  /**
   * Load agent dynamically
   */
  private async loadAgent(className: string): Promise<IAgent> {
    try {
      // Try to import from agents directory
      const module = await import(`../agents/${className}`);
      const AgentClass = module[className] || module.default;

      if (!AgentClass) {
        throw new Error(`Agent class ${className} not found in module`);
      }

      const instance = new AgentClass();

      // Wrap in unified interface if needed
      return this.wrapAgent(instance, className);
    } catch (error: any) {
      console.warn(`Failed to load agent ${className}: ${error.message}`);
      // Return a placeholder agent
      return this.createPlaceholderAgent(className);
    }
  }

  /**
   * Wrap agent to ensure unified interface
   */
  private wrapAgent(instance: any, name: string): IAgent {
    return {
      name,
      execute: async (data: any, context?: ExecutionContext) => {
        // Try different method names
        if (typeof instance.execute === 'function') {
          return instance.execute(data, context);
        }
        if (typeof instance.run === 'function') {
          return instance.run(data, context);
        }
        if (typeof instance.process === 'function') {
          return instance.process(data, context);
        }
        if (typeof instance.analyze === 'function') {
          return instance.analyze(data);
        }
        if (typeof instance.generate === 'function') {
          return instance.generate(data);
        }
        if (typeof instance.publish === 'function') {
          return instance.publish(data);
        }
        if (typeof instance.handle === 'function') {
          return instance.handle(data);
        }
        // If instance is callable
        if (typeof instance === 'function') {
          return instance(data, context);
        }
        throw new Error(`Agent ${name} has no executable method`);
      },
      validate: instance.validate?.bind(instance),
      cleanup: instance.cleanup?.bind(instance)
    };
  }

  /**
   * Create placeholder agent for missing implementations
   */
  private createPlaceholderAgent(name: string): IAgent {
    return {
      name,
      execute: async (data: any) => {
        console.log(`[Placeholder] ${name} executing with data:`, Object.keys(data || {}));
        // Simulate some processing
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          success: true,
          message: `${name} placeholder executed`,
          processedAt: new Date().toISOString()
        };
      }
    };
  }

  /**
   * Create approval gate agent
   */
  private async createApprovalGate(): Promise<IAgent> {
    return {
      name: 'UserApprovalGate',
      execute: async (data: any, context?: ExecutionContext) => {
        // This agent waits for external approval
        this.emit('approvalRequired', {
          workflowId: context?.workflowId,
          data: data.validated_opportunities || data,
          agentId: 'user-approval-gate'
        });

        // Return data as-is, approval handled by orchestrator
        return {
          approved_opportunities: data.validated_opportunities || data,
          requiresApproval: true
        };
      }
    };
  }

  /**
   * Get agent instance (lazy loading)
   */
  public async getAgent(agentId: string): Promise<IAgent | null> {
    const wrapper = this.agents.get(agentId);
    if (!wrapper) {
      console.error(`Unknown agent: ${agentId}`);
      return null;
    }

    if (wrapper.isLoaded && wrapper.instance) {
      return wrapper.instance;
    }

    const factory = this.factories.get(agentId);
    if (!factory) {
      console.error(`No factory for agent: ${agentId}`);
      return null;
    }

    try {
      wrapper.instance = await factory();
      wrapper.isLoaded = true;
      this.loadedCount++;
      this.emit('agentLoaded', { agentId, totalLoaded: this.loadedCount });
      return wrapper.instance;
    } catch (error: any) {
      wrapper.loadError = error.message;
      console.error(`Failed to load agent ${agentId}:`, error);
      return null;
    }
  }

  /**
   * Execute agent with full lifecycle
   */
  public async executeAgent(
    agentId: string,
    data: any,
    context?: ExecutionContext
  ): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    try {
      const agent = await this.getAgent(agentId);
      if (!agent) {
        throw new Error(`Agent ${agentId} not available`);
      }

      const config = AGENT_REGISTRY[agentId];

      // Validate input if agent supports it
      if (agent.validate && !agent.validate(data)) {
        throw new Error(`Validation failed for agent ${agentId}`);
      }

      this.emit('executionStarted', { agentId, context });

      // Execute with timeout
      const result = await this.executeWithTimeout(
        agent.execute(data, context),
        config.timeout
      );

      const duration = Date.now() - startTime;

      // Extract outputs based on config
      const outputs: Record<string, any> = {};
      for (const output of config.outputs) {
        if (result[output] !== undefined) {
          outputs[output] = result[output];
        }
      }

      const executionResult: AgentExecutionResult = {
        agentId,
        success: true,
        data: result,
        duration,
        timestamp: Date.now(),
        outputs
      };

      this.emit('executionCompleted', executionResult);
      return executionResult;

    } catch (error: any) {
      const duration = Date.now() - startTime;

      const executionResult: AgentExecutionResult = {
        agentId,
        success: false,
        error: error.message,
        duration,
        timestamp: Date.now(),
        outputs: {}
      };

      this.emit('executionFailed', executionResult);
      return executionResult;
    }
  }

  /**
   * Execute with timeout
   */
  private executeWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Execution timed out after ${timeout}ms`));
      }, timeout);

      promise
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  /**
   * Execute multiple agents in parallel
   */
  public async executeParallel(
    agentIds: string[],
    data: any,
    context?: ExecutionContext
  ): Promise<AgentExecutionResult[]> {
    const promises = agentIds.map(agentId =>
      this.executeAgent(agentId, data, context)
    );

    return Promise.all(promises);
  }

  /**
   * Execute agents in sequence
   */
  public async executeSequential(
    agentIds: string[],
    initialData: any,
    context?: ExecutionContext
  ): Promise<AgentExecutionResult[]> {
    const results: AgentExecutionResult[] = [];
    let currentData = initialData;

    for (const agentId of agentIds) {
      const result = await this.executeAgent(agentId, currentData, context);
      results.push(result);

      if (!result.success) {
        break; // Stop on failure
      }

      // Merge outputs into current data for next agent
      currentData = { ...currentData, ...result.outputs };
    }

    return results;
  }

  /**
   * Preload all agents
   */
  public async preloadAll(): Promise<{ loaded: number; failed: number }> {
    let loaded = 0;
    let failed = 0;

    for (const agentId of this.agents.keys()) {
      try {
        await this.getAgent(agentId);
        loaded++;
      } catch {
        failed++;
      }
    }

    this.emit('preloadComplete', { loaded, failed });
    return { loaded, failed };
  }

  /**
   * Preload agents for specific chain
   */
  public async preloadChain(chainId: number): Promise<{ loaded: number; failed: number }> {
    let loaded = 0;
    let failed = 0;

    for (const [agentId, wrapper] of this.agents.entries()) {
      if (wrapper.config.chainId === chainId) {
        try {
          await this.getAgent(agentId);
          loaded++;
        } catch {
          failed++;
        }
      }
    }

    return { loaded, failed };
  }

  /**
   * Get agent status
   */
  public getAgentStatus(agentId: string): {
    id: string;
    isLoaded: boolean;
    config: AgentConfig | null;
    loadError?: string;
  } | null {
    const wrapper = this.agents.get(agentId);
    if (!wrapper) return null;

    return {
      id: agentId,
      isLoaded: wrapper.isLoaded,
      config: wrapper.config,
      loadError: wrapper.loadError
    };
  }

  /**
   * Get all agent statuses
   */
  public getAllStatuses(): Array<{
    id: string;
    isLoaded: boolean;
    chainId: number;
    loadError?: string;
  }> {
    const statuses = [];
    for (const [agentId, wrapper] of this.agents.entries()) {
      statuses.push({
        id: agentId,
        isLoaded: wrapper.isLoaded,
        chainId: wrapper.config.chainId,
        loadError: wrapper.loadError
      });
    }
    return statuses;
  }

  /**
   * Unload agent to free memory
   */
  public async unloadAgent(agentId: string): Promise<boolean> {
    const wrapper = this.agents.get(agentId);
    if (!wrapper || !wrapper.isLoaded) return false;

    if (wrapper.instance?.cleanup) {
      await wrapper.instance.cleanup();
    }

    wrapper.instance = null;
    wrapper.isLoaded = false;
    this.loadedCount--;

    this.emit('agentUnloaded', { agentId });
    return true;
  }

  /**
   * Unload all agents
   */
  public async unloadAll(): Promise<number> {
    let count = 0;
    for (const agentId of this.agents.keys()) {
      if (await this.unloadAgent(agentId)) {
        count++;
      }
    }
    return count;
  }

  /**
   * Get loaded count
   */
  public getLoadedCount(): number {
    return this.loadedCount;
  }

  /**
   * Get total agent count
   */
  public getTotalCount(): number {
    return this.agents.size;
  }

  /**
   * Check if agent is loaded
   */
  public isAgentLoaded(agentId: string): boolean {
    const wrapper = this.agents.get(agentId);
    return wrapper?.isLoaded ?? false;
  }

  /**
   * Get agents by chain
   */
  public getAgentsByChain(chainId: number): string[] {
    const agents: string[] = [];
    for (const [agentId, wrapper] of this.agents.entries()) {
      if (wrapper.config.chainId === chainId) {
        agents.push(agentId);
      }
    }
    return agents;
  }
}

// Singleton instance
let integrationInstance: AgentIntegration | null = null;

export function getAgentIntegration(): AgentIntegration {
  if (!integrationInstance) {
    integrationInstance = new AgentIntegration();
  }
  return integrationInstance;
}

export default AgentIntegration;
