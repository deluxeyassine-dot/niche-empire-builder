#!/usr/bin/env node
/**
 * ORCHESTRATOR CLI
 * Command-line interface for controlling the 52-agent production chain
 */

import {
  initializeOrchestrationSystem,
  startProduction,
  stopProduction,
  getSystemStatus,
  getAgentOrchestrator,
  getProductionModeManager,
  getProductionQueue,
  getAgentMonitor
} from '../core';
import { ProductionMode, MODE_PRESETS } from '../core/ProductionModes';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message: string, color: keyof typeof colors = 'white'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(text: string): void {
  console.log('\n' + '='.repeat(50));
  log(text, 'bright');
  console.log('='.repeat(50));
}

function printHelp(): void {
  header('NICHE EMPIRE BUILDER - ORCHESTRATOR CLI');

  console.log(`
${colors.bright}USAGE:${colors.reset}
  npx ts-node orchestrator-cli.ts <command> [options]

${colors.bright}COMMANDS:${colors.reset}
  ${colors.cyan}start [mode]${colors.reset}     Start production in specified mode
  ${colors.cyan}stop${colors.reset}             Stop all production
  ${colors.cyan}pause${colors.reset}            Pause production
  ${colors.cyan}resume${colors.reset}           Resume production
  ${colors.cyan}status${colors.reset}           Show system status
  ${colors.cyan}modes${colors.reset}            List available production modes
  ${colors.cyan}agents${colors.reset}           List all agents and their status
  ${colors.cyan}chains${colors.reset}           List all chains and their status
  ${colors.cyan}queue${colors.reset}            Show queue statistics
  ${colors.cyan}metrics${colors.reset}          Show performance metrics
  ${colors.cyan}health${colors.reset}           Show agent health summary
  ${colors.cyan}run-agent <id>${colors.reset}   Run a specific agent manually
  ${colors.cyan}run-chain <id>${colors.reset}   Run a specific chain manually
  ${colors.cyan}help${colors.reset}             Show this help message

${colors.bright}PRODUCTION MODES:${colors.reset}
  ${colors.green}full_auto${colors.reset}        All 52 agents, fully automated
  ${colors.green}semi_auto${colors.reset}        Automated with approval gates (default)
  ${colors.green}manual${colors.reset}           Manual step-by-step execution
  ${colors.green}testing${colors.reset}          Testing mode with mock data
  ${colors.green}demo${colors.reset}             Demo mode for showcasing
  ${colors.green}single_chain${colors.reset}     Run only one chain
  ${colors.green}development${colors.reset}      Development mode with logging
  ${colors.green}maintenance${colors.reset}      Limited operations mode

${colors.bright}EXAMPLES:${colors.reset}
  # Start in semi-automatic mode
  npx ts-node orchestrator-cli.ts start semi_auto

  # Check system status
  npx ts-node orchestrator-cli.ts status

  # Run Chain 3 (Content Creation) manually
  npx ts-node orchestrator-cli.ts run-chain 3
`);
}

async function showStatus(): Promise<void> {
  header('SYSTEM STATUS');

  const status = getSystemStatus();
  const orchestrator = getAgentOrchestrator();
  const modeManager = getProductionModeManager();

  console.log(`
${colors.bright}Orchestrator:${colors.reset}
  Running: ${status.isRunning ? colors.green + 'Yes' : colors.red + 'No'}${colors.reset}
  Paused:  ${status.isPaused ? colors.yellow + 'Yes' : colors.green + 'No'}${colors.reset}
  Mode:    ${colors.cyan}${status.mode}${colors.reset}

${colors.bright}Workflows:${colors.reset}
  Active:  ${status.activeWorkflows}
  Cycles:  ${status.stats?.cyclesCompleted || 0}

${colors.bright}Agents:${colors.reset}
  Total:    ${status.monitorSummary?.healthSummary?.totalAgents || 52}
  Healthy:  ${colors.green}${status.monitorSummary?.healthSummary?.healthyAgents || 0}${colors.reset}
  Running:  ${colors.cyan}${status.monitorSummary?.healthSummary?.runningAgents || 0}${colors.reset}
  Errors:   ${colors.red}${status.monitorSummary?.healthSummary?.errorAgents || 0}${colors.reset}

${colors.bright}Queue:${colors.reset}
  Pending:     ${status.queueStats?.pendingItems || 0}
  Processing:  ${status.queueStats?.processingItems || 0}
  Failed:      ${colors.red}${status.queueStats?.failedItems || 0}${colors.reset}
  Dead Letter: ${colors.red}${status.queueStats?.deadItems || 0}${colors.reset}

${colors.bright}Performance:${colors.reset}
  Throughput:    ${status.queueStats?.throughputPerHour || 0}/hour
  Success Rate:  ${(status.monitorSummary?.successRate || 100).toFixed(1)}%
  Avg Response:  ${(status.monitorSummary?.averageResponseTime || 0).toFixed(0)}ms
  Active Alerts: ${colors.yellow}${status.monitorSummary?.activeAlerts || 0}${colors.reset}
`);
}

async function showModes(): Promise<void> {
  header('PRODUCTION MODES');

  const modeManager = getProductionModeManager();
  const currentMode = modeManager.getCurrentMode();

  for (const [mode, config] of Object.entries(MODE_PRESETS)) {
    const isCurrent = mode === currentMode;
    const indicator = isCurrent ? `${colors.green}[ACTIVE]${colors.reset}` : '';

    console.log(`
${colors.bright}${mode}${colors.reset} ${indicator}
  ${config.description}
  Chains:  ${config.enabledChains.join(', ')}
  Agents:  ${config.enabledAgents.length}
  Parallel: ${config.parallelExecution ? 'Yes' : 'No'}
  Auto-Approve: ${config.autoApprove ? 'Yes' : 'No'}`);
  }
}

async function showAgents(): Promise<void> {
  header('AGENT STATUS');

  const monitor = getAgentMonitor();
  const health = monitor.getAllHealth();

  // Group by chain
  const byChain: Record<number, typeof health> = {};
  for (const agent of health) {
    const chainId = parseInt(agent.agentId.split('-')[0]) || 1;
    if (!byChain[chainId]) byChain[chainId] = [];
    byChain[chainId].push(agent);
  }

  for (const agent of health) {
    const statusColor = agent.isHealthy ? colors.green :
                        agent.status === 'error' ? colors.red :
                        agent.status === 'paused' ? colors.yellow :
                        colors.white;

    console.log(`  ${statusColor}${agent.status.padEnd(10)}${colors.reset} ${agent.agentId}`);
  }

  console.log(`\n  Total: ${health.length} agents`);
}

async function showChains(): Promise<void> {
  header('CHAIN STATUS');

  const monitor = getAgentMonitor();
  const chainMetrics = monitor.getAllChainMetrics();

  for (const chain of chainMetrics) {
    const statusColor = chain.status === 'healthy' ? colors.green :
                        chain.status === 'degraded' ? colors.yellow :
                        colors.red;

    console.log(`
${colors.bright}Chain ${chain.chainId}: ${chain.name}${colors.reset}
  Status:     ${statusColor}${chain.status}${colors.reset}
  Executions: ${chain.totalExecutions}
  Avg Time:   ${chain.averageCycleTime.toFixed(0)}ms
  Throughput: ${chain.throughput.toFixed(1)}/min`);
  }
}

async function showQueue(): Promise<void> {
  header('QUEUE STATISTICS');

  const queue = getProductionQueue();
  const stats = queue.getStats();
  const bottlenecks = queue.getBottlenecks();

  console.log(`
${colors.bright}Queue Status:${colors.reset}
  Total Items:    ${stats.totalItems}
  Pending:        ${stats.pendingItems}
  Processing:     ${stats.processingItems}
  Completed:      ${stats.completedItems}
  Failed:         ${colors.red}${stats.failedItems}${colors.reset}
  Dead Letter:    ${colors.red}${stats.deadItems}${colors.reset}

${colors.bright}Throughput:${colors.reset}
  Per Minute: ${stats.throughputPerMinute}
  Per Hour:   ${stats.throughputPerHour}

${colors.bright}Processing:${colors.reset}
  Avg Time: ${stats.averageProcessingTime.toFixed(0)}ms

${colors.bright}By Priority:${colors.reset}
  Critical: ${stats.itemsByPriority.critical}
  High:     ${stats.itemsByPriority.high}
  Medium:   ${stats.itemsByPriority.medium}
  Low:      ${stats.itemsByPriority.low}`);

  if (bottlenecks.length > 0) {
    console.log(`\n${colors.yellow}${colors.bright}BOTTLENECKS DETECTED:${colors.reset}`);
    for (const b of bottlenecks) {
      console.log(`  ${colors.yellow}${b.agentId}${colors.reset}: ${b.count} items queued (avg wait: ${(b.avgWait / 1000).toFixed(1)}s)`);
    }
  }
}

async function showMetrics(): Promise<void> {
  header('PERFORMANCE METRICS');

  const monitor = getAgentMonitor();
  const overview = monitor.getSystemOverview();

  console.log(`
${colors.bright}System Overview:${colors.reset}
  Uptime:          ${formatDuration(overview.uptime)}
  Total Executions: ${overview.totalExecutions}
  Success Rate:    ${overview.successRate.toFixed(1)}%
  Avg Response:    ${overview.averageResponseTime.toFixed(0)}ms
  Active Alerts:   ${overview.activeAlerts}

${colors.bright}Top Performers:${colors.reset}`);

  for (const agent of overview.topPerformers) {
    console.log(`  ${colors.green}${agent.agentId}${colors.reset}: ${agent.successRate.toFixed(1)}% (${agent.throughput}/hr)`);
  }

  console.log(`\n${colors.bright}Needs Attention:${colors.reset}`);

  for (const agent of overview.bottomPerformers) {
    console.log(`  ${colors.red}${agent.agentId}${colors.reset}: ${agent.successRate.toFixed(1)}% (${agent.errorCount} errors)`);
  }
}

async function showHealth(): Promise<void> {
  header('AGENT HEALTH');

  const monitor = getAgentMonitor();
  const summary = monitor.getHealthSummary();

  console.log(`
${colors.bright}Health Summary:${colors.reset}
  Total Agents:   ${summary.totalAgents}
  Healthy:        ${colors.green}${summary.healthyAgents}${colors.reset}
  Unhealthy:      ${colors.red}${summary.unhealthyAgents}${colors.reset}

${colors.bright}By Status:${colors.reset}
  Running:  ${colors.cyan}${summary.runningAgents}${colors.reset}
  Idle:     ${summary.idleAgents}
  Error:    ${colors.red}${summary.errorAgents}${colors.reset}
  Stopped:  ${summary.stoppedAgents}
`);
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  // Initialize system for commands that need it
  if (!['help', '--help', '-h'].includes(command)) {
    log('Initializing orchestration system...', 'cyan');
    await initializeOrchestrationSystem();
    console.log('');
  }

  switch (command) {
    case 'start': {
      const mode = (args[1] as ProductionMode) || 'semi_auto';
      log(`Starting production in ${mode} mode...`, 'green');
      const workflowId = await startProduction(mode);
      log(`Production started! Workflow ID: ${workflowId}`, 'green');
      break;
    }

    case 'stop':
      log('Stopping production...', 'yellow');
      stopProduction();
      log('Production stopped.', 'green');
      break;

    case 'pause':
      log('Pausing production...', 'yellow');
      getAgentOrchestrator().pause();
      log('Production paused.', 'green');
      break;

    case 'resume':
      log('Resuming production...', 'green');
      getAgentOrchestrator().resume();
      log('Production resumed.', 'green');
      break;

    case 'status':
      await showStatus();
      break;

    case 'modes':
      await showModes();
      break;

    case 'agents':
      await showAgents();
      break;

    case 'chains':
      await showChains();
      break;

    case 'queue':
      await showQueue();
      break;

    case 'metrics':
      await showMetrics();
      break;

    case 'health':
      await showHealth();
      break;

    case 'run-agent': {
      const agentId = args[1];
      if (!agentId) {
        log('Error: Agent ID required', 'red');
        break;
      }
      log(`Running agent: ${agentId}...`, 'cyan');
      const modeManager = getProductionModeManager();
      const result = await modeManager.runAgent(agentId);
      log(`Result: ${JSON.stringify(result, null, 2)}`, 'green');
      break;
    }

    case 'run-chain': {
      const chainId = parseInt(args[1]);
      if (isNaN(chainId)) {
        log('Error: Chain ID required (1-10)', 'red');
        break;
      }
      log(`Running chain ${chainId}...`, 'cyan');
      const modeManager = getProductionModeManager();
      const results = await modeManager.runChain(chainId);
      log(`Completed. Results: ${results.length} agents executed.`, 'green');
      break;
    }

    default:
      log(`Unknown command: ${command}`, 'red');
      log('Use "help" to see available commands.', 'yellow');
  }
}

// Run CLI
main().catch(error => {
  console.error(colors.red + 'Error:' + colors.reset, error.message);
  process.exit(1);
});
