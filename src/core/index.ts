/**
 * CORE MODULE EXPORTS
 * Central export point for all orchestration system components
 */

// Configuration
export * from '../config/orchestration-config';

// Core Components
export { AgentOrchestrator, getAgentOrchestrator } from './AgentOrchestrator';
export type { WorkflowState, ApprovalState, WorkflowError, ExecutionContext } from './AgentOrchestrator';

export { ProductionQueue, getProductionQueue } from './ProductionQueue';
export type { QueueItem, QueueStats, ChainQueue, ProcessingResult } from './ProductionQueue';

export { AgentMonitor, getAgentMonitor } from './AgentMonitor';
export type { AgentHealth, AgentMetrics, ChainMetrics, Alert } from './AgentMonitor';

export { AgentIntegration, getAgentIntegration } from './AgentIntegration';
export type { IAgent, AgentWrapper, AgentExecutionResult } from './AgentIntegration';

export { ProductionModeManager, getProductionModeManager, MODE_PRESETS, DEFAULT_SCHEDULES } from './ProductionModes';
export type { ProductionMode, ModeConfig, ProductionSchedule } from './ProductionModes';

// Existing core modules (re-export)
export { default as NicheEmpireBuilder } from './NicheEmpireBuilder';
export { default as EmpireManager } from './EmpireManager';
export { default as NicheAnalyzer } from './NicheAnalyzer';

/**
 * Initialize the complete orchestration system
 */
export async function initializeOrchestrationSystem(): Promise<{
  orchestrator: ReturnType<typeof getAgentOrchestrator>;
  queue: ReturnType<typeof getProductionQueue>;
  monitor: ReturnType<typeof getAgentMonitor>;
  integration: ReturnType<typeof getAgentIntegration>;
  modeManager: ReturnType<typeof getProductionModeManager>;
}> {
  const orchestrator = getAgentOrchestrator();
  const queue = getProductionQueue();
  const monitor = getAgentMonitor();
  const integration = getAgentIntegration();
  const modeManager = getProductionModeManager();

  // Initialize in order
  await modeManager.initialize();

  console.log('Orchestration system fully initialized');
  console.log(`- ${Object.keys(require('../config/orchestration-config').AGENT_REGISTRY).length} agents registered`);
  console.log(`- ${Object.keys(require('../config/orchestration-config').CHAIN_REGISTRY).length} chains configured`);

  return {
    orchestrator,
    queue,
    monitor,
    integration,
    modeManager
  };
}

/**
 * Quick start production in specified mode
 */
export async function startProduction(mode: import('./ProductionModes').ProductionMode = 'semi_auto'): Promise<string> {
  const modeManager = getProductionModeManager();

  // Initialize if not already
  await modeManager.initialize();

  // Set mode
  modeManager.setMode(mode);

  // Start production
  return modeManager.startProduction();
}

/**
 * Stop all production
 */
export function stopProduction(): void {
  const modeManager = getProductionModeManager();
  modeManager.stopProduction();
}

/**
 * Get system status
 */
export function getSystemStatus(): any {
  const orchestrator = getAgentOrchestrator();
  const modeManager = getProductionModeManager();

  return {
    ...orchestrator.getStatus(),
    mode: modeManager.getCurrentMode(),
    modeConfig: modeManager.getCurrentConfig(),
    stats: modeManager.getModeStats()
  };
}
