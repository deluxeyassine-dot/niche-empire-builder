/**
 * PRODUCTION MODES
 * Different operational modes for the 52-agent orchestration system
 * Enables flexible deployment and testing scenarios
 */

import { EventEmitter } from 'events';
import { AgentOrchestrator, getAgentOrchestrator } from './AgentOrchestrator';
import { ProductionQueue, getProductionQueue } from './ProductionQueue';
import { AgentMonitor, getAgentMonitor } from './AgentMonitor';
import { AgentIntegration, getAgentIntegration } from './AgentIntegration';
import {
  AGENT_REGISTRY,
  CHAIN_REGISTRY,
  ORCHESTRATION_SETTINGS
} from '../config/orchestration-config';

// Production Mode Types
export type ProductionMode =
  | 'full_auto'      // All 52 agents, fully automated
  | 'semi_auto'      // Automated with approval gates
  | 'manual'         // Manual step-by-step execution
  | 'testing'        // Testing mode with mock data
  | 'demo'           // Demo mode for showcasing
  | 'single_chain'   // Run only one chain
  | 'development'    // Development mode with logging
  | 'maintenance';   // Maintenance mode - limited operations

// Mode Configuration
export interface ModeConfig {
  name: ProductionMode;
  description: string;
  enabledChains: number[];
  enabledAgents: string[];
  autoApprove: boolean;
  parallelExecution: boolean;
  loggingLevel: 'debug' | 'info' | 'warn' | 'error';
  mockExternalAPIs: boolean;
  rateLimitMultiplier: number;
  maxConcurrentAgents: number;
  cycleDelay: number;
  notificationsEnabled: boolean;
  requireConfirmation: boolean;
}

// Preset Mode Configurations
export const MODE_PRESETS: Record<ProductionMode, ModeConfig> = {
  full_auto: {
    name: 'full_auto',
    description: 'Full automation - All 52 agents running continuously',
    enabledChains: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    enabledAgents: Object.keys(AGENT_REGISTRY),
    autoApprove: true,
    parallelExecution: true,
    loggingLevel: 'info',
    mockExternalAPIs: false,
    rateLimitMultiplier: 1.0,
    maxConcurrentAgents: 10,
    cycleDelay: 300000, // 5 minutes
    notificationsEnabled: true,
    requireConfirmation: false
  },
  semi_auto: {
    name: 'semi_auto',
    description: 'Semi-automatic - Pauses for approval at key points',
    enabledChains: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    enabledAgents: Object.keys(AGENT_REGISTRY),
    autoApprove: false,
    parallelExecution: true,
    loggingLevel: 'info',
    mockExternalAPIs: false,
    rateLimitMultiplier: 1.0,
    maxConcurrentAgents: 10,
    cycleDelay: 300000,
    notificationsEnabled: true,
    requireConfirmation: true
  },
  manual: {
    name: 'manual',
    description: 'Manual mode - Each agent requires explicit trigger',
    enabledChains: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    enabledAgents: Object.keys(AGENT_REGISTRY),
    autoApprove: false,
    parallelExecution: false,
    loggingLevel: 'debug',
    mockExternalAPIs: false,
    rateLimitMultiplier: 0.5,
    maxConcurrentAgents: 1,
    cycleDelay: 0,
    notificationsEnabled: true,
    requireConfirmation: true
  },
  testing: {
    name: 'testing',
    description: 'Testing mode - Uses mock data and APIs',
    enabledChains: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    enabledAgents: Object.keys(AGENT_REGISTRY),
    autoApprove: true,
    parallelExecution: true,
    loggingLevel: 'debug',
    mockExternalAPIs: true,
    rateLimitMultiplier: 10.0, // No rate limiting
    maxConcurrentAgents: 20,
    cycleDelay: 1000, // 1 second
    notificationsEnabled: false,
    requireConfirmation: false
  },
  demo: {
    name: 'demo',
    description: 'Demo mode - Showcases system with simulated data',
    enabledChains: [1, 2, 3],
    enabledAgents: [
      'trend-scout', 'opportunity-validator', 'user-approval-gate',
      'product-architecture', 'ai-prompt-generator', 'content-scheduler',
      'ai-design-generator', 'video-creator', 'quality-control'
    ],
    autoApprove: false,
    parallelExecution: true,
    loggingLevel: 'info',
    mockExternalAPIs: true,
    rateLimitMultiplier: 5.0,
    maxConcurrentAgents: 5,
    cycleDelay: 5000,
    notificationsEnabled: true,
    requireConfirmation: false
  },
  single_chain: {
    name: 'single_chain',
    description: 'Single chain mode - Run one chain at a time',
    enabledChains: [1], // Default to chain 1, can be changed
    enabledAgents: CHAIN_REGISTRY[1].agents,
    autoApprove: false,
    parallelExecution: true,
    loggingLevel: 'debug',
    mockExternalAPIs: false,
    rateLimitMultiplier: 1.0,
    maxConcurrentAgents: 5,
    cycleDelay: 60000,
    notificationsEnabled: true,
    requireConfirmation: true
  },
  development: {
    name: 'development',
    description: 'Development mode - Verbose logging, slower execution',
    enabledChains: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    enabledAgents: Object.keys(AGENT_REGISTRY),
    autoApprove: false,
    parallelExecution: false,
    loggingLevel: 'debug',
    mockExternalAPIs: true,
    rateLimitMultiplier: 2.0,
    maxConcurrentAgents: 3,
    cycleDelay: 10000,
    notificationsEnabled: true,
    requireConfirmation: true
  },
  maintenance: {
    name: 'maintenance',
    description: 'Maintenance mode - Only essential operations',
    enabledChains: [9, 10], // Only analytics and operations
    enabledAgents: [
      'analytics-tracker', 'performance-monitor', 'backup-agent',
      'security-agent', 'report-generator', 'notification-agent'
    ],
    autoApprove: true,
    parallelExecution: false,
    loggingLevel: 'warn',
    mockExternalAPIs: false,
    rateLimitMultiplier: 0.5,
    maxConcurrentAgents: 2,
    cycleDelay: 600000, // 10 minutes
    notificationsEnabled: true,
    requireConfirmation: false
  }
};

// Production Schedule
export interface ProductionSchedule {
  id: string;
  name: string;
  mode: ProductionMode;
  startTime: string; // HH:MM format
  endTime: string;
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  enabled: boolean;
}

// Default Schedules
export const DEFAULT_SCHEDULES: ProductionSchedule[] = [
  {
    id: 'weekday-full',
    name: 'Weekday Full Production',
    mode: 'full_auto',
    startTime: '06:00',
    endTime: '23:00',
    daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday
    enabled: true
  },
  {
    id: 'weekend-semi',
    name: 'Weekend Semi-Auto',
    mode: 'semi_auto',
    startTime: '09:00',
    endTime: '21:00',
    daysOfWeek: [0, 6], // Saturday-Sunday
    enabled: true
  },
  {
    id: 'night-maintenance',
    name: 'Night Maintenance',
    mode: 'maintenance',
    startTime: '23:00',
    endTime: '06:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    enabled: true
  }
];

/**
 * Production Mode Manager
 * Controls operational modes for the orchestration system
 */
export class ProductionModeManager extends EventEmitter {
  private currentMode: ProductionMode = 'semi_auto';
  private currentConfig: ModeConfig;
  private orchestrator: AgentOrchestrator;
  private queue: ProductionQueue;
  private monitor: AgentMonitor;
  private integration: AgentIntegration;
  private schedules: ProductionSchedule[] = [...DEFAULT_SCHEDULES];
  private scheduleCheckInterval: NodeJS.Timeout | null = null;
  private customConfig: Partial<ModeConfig> = {};

  constructor() {
    super();
    this.currentConfig = { ...MODE_PRESETS.semi_auto };
    this.orchestrator = getAgentOrchestrator();
    this.queue = getProductionQueue();
    this.monitor = getAgentMonitor();
    this.integration = getAgentIntegration();
  }

  /**
   * Initialize the production mode manager
   */
  public async initialize(): Promise<void> {
    await this.orchestrator.initialize();
    this.applyModeConfig();
    this.startScheduleChecker();
    this.emit('initialized', { mode: this.currentMode });
  }

  /**
   * Set production mode
   */
  public setMode(mode: ProductionMode, customConfig?: Partial<ModeConfig>): void {
    const previousMode = this.currentMode;
    this.currentMode = mode;
    this.customConfig = customConfig || {};
    this.currentConfig = {
      ...MODE_PRESETS[mode],
      ...this.customConfig
    };

    this.applyModeConfig();

    this.emit('modeChanged', {
      previousMode,
      newMode: mode,
      config: this.currentConfig
    });
  }

  /**
   * Apply mode configuration to all systems
   */
  private applyModeConfig(): void {
    const config = this.currentConfig;

    // Update orchestration settings
    ORCHESTRATION_SETTINGS.maxConcurrentAgents = config.maxConcurrentAgents;
    ORCHESTRATION_SETTINGS.cycleDelay = config.cycleDelay;
    ORCHESTRATION_SETTINGS.features.parallelExecution = config.parallelExecution;
    ORCHESTRATION_SETTINGS.logLevel = config.loggingLevel;
    ORCHESTRATION_SETTINGS.notifications.enabled = config.notificationsEnabled;

    // Enable/disable chains
    for (const chainId of Object.keys(CHAIN_REGISTRY).map(Number)) {
      CHAIN_REGISTRY[chainId].enabled = config.enabledChains.includes(chainId);
    }

    // Enable/disable agents
    for (const agentId of Object.keys(AGENT_REGISTRY)) {
      AGENT_REGISTRY[agentId].enabled = config.enabledAgents.includes(agentId);

      // Apply rate limit multiplier
      if (AGENT_REGISTRY[agentId].rateLimits) {
        // Store original if not already stored
        if (!(AGENT_REGISTRY[agentId] as any)._originalRateLimits) {
          (AGENT_REGISTRY[agentId] as any)._originalRateLimits = { ...AGENT_REGISTRY[agentId].rateLimits };
        }
        const original = (AGENT_REGISTRY[agentId] as any)._originalRateLimits;
        if (original.requestsPerMinute) {
          AGENT_REGISTRY[agentId].rateLimits!.requestsPerMinute =
            Math.floor(original.requestsPerMinute * config.rateLimitMultiplier);
        }
        if (original.requestsPerHour) {
          AGENT_REGISTRY[agentId].rateLimits!.requestsPerHour =
            Math.floor(original.requestsPerHour * config.rateLimitMultiplier);
        }
      }
    }

    // Set auto-approve
    if (config.autoApprove) {
      AGENT_REGISTRY['user-approval-gate'].requiresApproval = false;
    } else {
      AGENT_REGISTRY['user-approval-gate'].requiresApproval = true;
    }
  }

  /**
   * Get current mode
   */
  public getCurrentMode(): ProductionMode {
    return this.currentMode;
  }

  /**
   * Get current configuration
   */
  public getCurrentConfig(): ModeConfig {
    return { ...this.currentConfig };
  }

  /**
   * Get all available modes
   */
  public getAvailableModes(): Array<{ mode: ProductionMode; description: string }> {
    return Object.entries(MODE_PRESETS).map(([mode, config]) => ({
      mode: mode as ProductionMode,
      description: config.description
    }));
  }

  /**
   * Start production with current mode
   */
  public async startProduction(): Promise<string> {
    if (this.currentConfig.requireConfirmation) {
      this.emit('confirmationRequired', {
        mode: this.currentMode,
        config: this.currentConfig
      });
      // Wait for confirmation
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Confirmation timeout'));
        }, 30000);

        this.once('confirmed', async () => {
          clearTimeout(timeout);
          const workflowId = await this.orchestrator.start();
          resolve(workflowId);
        });

        this.once('cancelled', () => {
          clearTimeout(timeout);
          reject(new Error('Production cancelled'));
        });
      });
    }

    return this.orchestrator.start();
  }

  /**
   * Confirm production start
   */
  public confirm(): void {
    this.emit('confirmed');
  }

  /**
   * Cancel production start
   */
  public cancel(): void {
    this.emit('cancelled');
  }

  /**
   * Stop production
   */
  public stopProduction(): void {
    this.orchestrator.stop();
  }

  /**
   * Pause production
   */
  public pauseProduction(): void {
    this.orchestrator.pause();
  }

  /**
   * Resume production
   */
  public resumeProduction(): void {
    this.orchestrator.resume();
  }

  /**
   * Set single chain mode
   */
  public setSingleChainMode(chainId: number): void {
    const chain = CHAIN_REGISTRY[chainId];
    if (!chain) {
      throw new Error(`Invalid chain ID: ${chainId}`);
    }

    this.setMode('single_chain', {
      enabledChains: [chainId],
      enabledAgents: chain.agents
    });
  }

  /**
   * Add production schedule
   */
  public addSchedule(schedule: Omit<ProductionSchedule, 'id'>): ProductionSchedule {
    const newSchedule: ProductionSchedule = {
      ...schedule,
      id: `schedule-${Date.now()}`
    };
    this.schedules.push(newSchedule);
    this.emit('scheduleAdded', newSchedule);
    return newSchedule;
  }

  /**
   * Remove schedule
   */
  public removeSchedule(scheduleId: string): boolean {
    const index = this.schedules.findIndex(s => s.id === scheduleId);
    if (index === -1) return false;

    const removed = this.schedules.splice(index, 1)[0];
    this.emit('scheduleRemoved', removed);
    return true;
  }

  /**
   * Update schedule
   */
  public updateSchedule(scheduleId: string, updates: Partial<ProductionSchedule>): boolean {
    const schedule = this.schedules.find(s => s.id === scheduleId);
    if (!schedule) return false;

    Object.assign(schedule, updates);
    this.emit('scheduleUpdated', schedule);
    return true;
  }

  /**
   * Get all schedules
   */
  public getSchedules(): ProductionSchedule[] {
    return [...this.schedules];
  }

  /**
   * Start schedule checker
   */
  private startScheduleChecker(): void {
    this.scheduleCheckInterval = setInterval(() => {
      this.checkSchedules();
    }, 60000); // Check every minute
  }

  /**
   * Check and apply schedules
   */
  private checkSchedules(): void {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    for (const schedule of this.schedules) {
      if (!schedule.enabled) continue;
      if (!schedule.daysOfWeek.includes(currentDay)) continue;

      const isInTimeRange = this.isTimeInRange(currentTime, schedule.startTime, schedule.endTime);

      if (isInTimeRange && this.currentMode !== schedule.mode) {
        this.setMode(schedule.mode);
        this.emit('scheduleTriggered', schedule);
      }
    }
  }

  /**
   * Check if time is in range
   */
  private isTimeInRange(current: string, start: string, end: string): boolean {
    // Handle overnight schedules
    if (start > end) {
      return current >= start || current < end;
    }
    return current >= start && current < end;
  }

  /**
   * Get active schedule
   */
  public getActiveSchedule(): ProductionSchedule | null {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    for (const schedule of this.schedules) {
      if (!schedule.enabled) continue;
      if (!schedule.daysOfWeek.includes(currentDay)) continue;

      if (this.isTimeInRange(currentTime, schedule.startTime, schedule.endTime)) {
        return schedule;
      }
    }

    return null;
  }

  /**
   * Run specific chain manually
   */
  public async runChain(chainId: number, data?: any): Promise<any> {
    const chain = CHAIN_REGISTRY[chainId];
    if (!chain) {
      throw new Error(`Invalid chain ID: ${chainId}`);
    }

    const results = await this.integration.executeSequential(
      chain.agents,
      data || {},
      {
        workflowId: `manual-${Date.now()}`,
        chainId,
        agentId: '',
        correlationId: `chain-${chainId}`,
        data: data || {},
        previousResults: {},
        metadata: { mode: 'manual' }
      }
    );

    return results;
  }

  /**
   * Run specific agent manually
   */
  public async runAgent(agentId: string, data?: any): Promise<any> {
    return this.integration.executeAgent(agentId, data || {});
  }

  /**
   * Get mode statistics
   */
  public getModeStats(): {
    currentMode: ProductionMode;
    uptime: number;
    cyclesCompleted: number;
    agentsEnabled: number;
    chainsEnabled: number;
  } {
    const status = this.orchestrator.getStatus();
    const workflows = this.orchestrator.getAllWorkflows();
    const activeWorkflow = workflows[0];

    return {
      currentMode: this.currentMode,
      uptime: activeWorkflow ? Date.now() - activeWorkflow.startedAt : 0,
      cyclesCompleted: activeWorkflow?.cycleCount || 0,
      agentsEnabled: this.currentConfig.enabledAgents.length,
      chainsEnabled: this.currentConfig.enabledChains.length
    };
  }

  /**
   * Export mode configuration
   */
  public exportConfig(): string {
    return JSON.stringify({
      mode: this.currentMode,
      config: this.currentConfig,
      schedules: this.schedules,
      timestamp: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Import mode configuration
   */
  public importConfig(configJson: string): void {
    try {
      const data = JSON.parse(configJson);
      if (data.mode) {
        this.setMode(data.mode, data.config);
      }
      if (data.schedules) {
        this.schedules = data.schedules;
      }
      this.emit('configImported', data);
    } catch (error: any) {
      throw new Error(`Failed to import config: ${error.message}`);
    }
  }

  /**
   * Shutdown
   */
  public async shutdown(): Promise<void> {
    if (this.scheduleCheckInterval) {
      clearInterval(this.scheduleCheckInterval);
      this.scheduleCheckInterval = null;
    }
    await this.orchestrator.shutdown();
    this.emit('shutdown');
  }
}

// Singleton instance
let modeManagerInstance: ProductionModeManager | null = null;

export function getProductionModeManager(): ProductionModeManager {
  if (!modeManagerInstance) {
    modeManagerInstance = new ProductionModeManager();
  }
  return modeManagerInstance;
}

export default ProductionModeManager;
