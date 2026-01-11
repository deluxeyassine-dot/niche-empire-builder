/**
 * ORCHESTRATOR API ROUTES
 * RESTful API endpoints for the Agent Orchestration Control Dashboard
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getAgentOrchestrator } from '../core/AgentOrchestrator';
import { getProductionQueue } from '../core/ProductionQueue';
import { getAgentMonitor } from '../core/AgentMonitor';
import { getAgentIntegration } from '../core/AgentIntegration';
import { getProductionModeManager, ProductionMode } from '../core/ProductionModes';
import { AGENT_REGISTRY, CHAIN_REGISTRY } from '../config/orchestration-config';

// Response helper
function sendResponse(res: NextApiResponse, status: number, data: any) {
  res.status(status).json({
    success: status >= 200 && status < 300,
    timestamp: new Date().toISOString(),
    ...data
  });
}

// Error helper
function sendError(res: NextApiResponse, status: number, message: string) {
  res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
}

/**
 * Orchestrator API Handler
 * Main entry point for orchestrator API routes
 */
export async function orchestratorApiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const action = query.action as string;

  try {
    switch (action) {
      // === ORCHESTRATOR CONTROL ===
      case 'start':
        return handleStart(req, res);
      case 'stop':
        return handleStop(req, res);
      case 'pause':
        return handlePause(req, res);
      case 'resume':
        return handleResume(req, res);
      case 'status':
        return handleStatus(req, res);

      // === WORKFLOW MANAGEMENT ===
      case 'workflows':
        return handleWorkflows(req, res);
      case 'workflow':
        return handleWorkflow(req, res);

      // === AGENT MANAGEMENT ===
      case 'agents':
        return handleAgents(req, res);
      case 'agent':
        return handleAgent(req, res);
      case 'run-agent':
        return handleRunAgent(req, res);
      case 'skip-agent':
        return handleSkipAgent(req, res);
      case 'retry-agent':
        return handleRetryAgent(req, res);

      // === CHAIN MANAGEMENT ===
      case 'chains':
        return handleChains(req, res);
      case 'chain':
        return handleChain(req, res);
      case 'run-chain':
        return handleRunChain(req, res);
      case 'pause-chain':
        return handlePauseChain(req, res);
      case 'resume-chain':
        return handleResumeChain(req, res);

      // === QUEUE MANAGEMENT ===
      case 'queue':
        return handleQueue(req, res);
      case 'queue-stats':
        return handleQueueStats(req, res);
      case 'dead-letter':
        return handleDeadLetter(req, res);
      case 'retry-dead-letter':
        return handleRetryDeadLetter(req, res);

      // === MONITORING ===
      case 'health':
        return handleHealth(req, res);
      case 'metrics':
        return handleMetrics(req, res);
      case 'alerts':
        return handleAlerts(req, res);
      case 'acknowledge-alert':
        return handleAcknowledgeAlert(req, res);

      // === APPROVALS ===
      case 'approvals':
        return handleApprovals(req, res);
      case 'approve':
        return handleApprove(req, res);
      case 'reject':
        return handleReject(req, res);

      // === PRODUCTION MODES ===
      case 'modes':
        return handleModes(req, res);
      case 'set-mode':
        return handleSetMode(req, res);
      case 'schedules':
        return handleSchedules(req, res);

      // === VISUALIZATION ===
      case 'visualization':
        return handleVisualization(req, res);
      case 'bottlenecks':
        return handleBottlenecks(req, res);

      default:
        return sendError(res, 400, `Unknown action: ${action}`);
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return sendError(res, 500, error.message);
  }
}

// === ORCHESTRATOR CONTROL HANDLERS ===

async function handleStart(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const modeManager = getProductionModeManager();
  const { mode } = req.body || {};

  if (mode) {
    modeManager.setMode(mode as ProductionMode);
  }

  const workflowId = await modeManager.startProduction();
  sendResponse(res, 200, { workflowId, mode: modeManager.getCurrentMode() });
}

async function handleStop(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const orchestrator = getAgentOrchestrator();
  const { workflowId } = req.body || {};
  orchestrator.stop(workflowId);
  sendResponse(res, 200, { message: 'Orchestrator stopped' });
}

async function handlePause(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const orchestrator = getAgentOrchestrator();
  const { workflowId } = req.body || {};
  orchestrator.pause(workflowId);
  sendResponse(res, 200, { message: 'Orchestrator paused' });
}

async function handleResume(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const orchestrator = getAgentOrchestrator();
  const { workflowId } = req.body || {};
  orchestrator.resume(workflowId);
  sendResponse(res, 200, { message: 'Orchestrator resumed' });
}

async function handleStatus(req: NextApiRequest, res: NextApiResponse) {
  const orchestrator = getAgentOrchestrator();
  const modeManager = getProductionModeManager();

  const status = orchestrator.getStatus();
  const modeStats = modeManager.getModeStats();

  sendResponse(res, 200, {
    ...status,
    ...modeStats,
    activeSchedule: modeManager.getActiveSchedule()
  });
}

// === WORKFLOW HANDLERS ===

async function handleWorkflows(req: NextApiRequest, res: NextApiResponse) {
  const orchestrator = getAgentOrchestrator();
  const workflows = orchestrator.getAllWorkflows();
  sendResponse(res, 200, { workflows });
}

async function handleWorkflow(req: NextApiRequest, res: NextApiResponse) {
  const { workflowId } = req.query;
  if (!workflowId) {
    return sendError(res, 400, 'Workflow ID required');
  }

  const orchestrator = getAgentOrchestrator();
  const workflow = orchestrator.getWorkflow(workflowId as string);

  if (!workflow) {
    return sendError(res, 404, 'Workflow not found');
  }

  sendResponse(res, 200, { workflow });
}

// === AGENT HANDLERS ===

async function handleAgents(req: NextApiRequest, res: NextApiResponse) {
  const integration = getAgentIntegration();
  const monitor = getAgentMonitor();

  const agents = Object.entries(AGENT_REGISTRY).map(([id, config]) => ({
    id,
    ...config,
    health: monitor.getHealth(id),
    metrics: monitor.getMetrics(id),
    isLoaded: integration.isAgentLoaded(id)
  }));

  sendResponse(res, 200, { agents, total: agents.length });
}

async function handleAgent(req: NextApiRequest, res: NextApiResponse) {
  const { agentId } = req.query;
  if (!agentId) {
    return sendError(res, 400, 'Agent ID required');
  }

  const config = AGENT_REGISTRY[agentId as string];
  if (!config) {
    return sendError(res, 404, 'Agent not found');
  }

  const integration = getAgentIntegration();
  const monitor = getAgentMonitor();

  sendResponse(res, 200, {
    agent: {
      id: agentId,
      ...config,
      health: monitor.getHealth(agentId as string),
      metrics: monitor.getMetrics(agentId as string),
      status: integration.getAgentStatus(agentId as string)
    }
  });
}

async function handleRunAgent(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { agentId, data } = req.body;
  if (!agentId) {
    return sendError(res, 400, 'Agent ID required');
  }

  const integration = getAgentIntegration();
  const result = await integration.executeAgent(agentId, data || {});
  sendResponse(res, 200, { result });
}

async function handleSkipAgent(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { workflowId, agentId } = req.body;
  if (!workflowId || !agentId) {
    return sendError(res, 400, 'Workflow ID and Agent ID required');
  }

  const orchestrator = getAgentOrchestrator();
  const success = orchestrator.skipAgent(workflowId, agentId);
  sendResponse(res, 200, { success });
}

async function handleRetryAgent(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { workflowId, agentId } = req.body;
  if (!workflowId || !agentId) {
    return sendError(res, 400, 'Workflow ID and Agent ID required');
  }

  const orchestrator = getAgentOrchestrator();
  const success = orchestrator.forceRetry(workflowId, agentId);
  sendResponse(res, 200, { success });
}

// === CHAIN HANDLERS ===

async function handleChains(req: NextApiRequest, res: NextApiResponse) {
  const monitor = getAgentMonitor();

  const chains = Object.entries(CHAIN_REGISTRY).map(([id, config]) => ({
    id: Number(id),
    ...config,
    metrics: monitor.getChainMetrics(Number(id))
  }));

  sendResponse(res, 200, { chains });
}

async function handleChain(req: NextApiRequest, res: NextApiResponse) {
  const { chainId } = req.query;
  if (!chainId) {
    return sendError(res, 400, 'Chain ID required');
  }

  const config = CHAIN_REGISTRY[Number(chainId)];
  if (!config) {
    return sendError(res, 404, 'Chain not found');
  }

  const monitor = getAgentMonitor();

  sendResponse(res, 200, {
    chain: {
      id: Number(chainId),
      ...config,
      metrics: monitor.getChainMetrics(Number(chainId))
    }
  });
}

async function handleRunChain(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { chainId, data } = req.body;
  if (!chainId) {
    return sendError(res, 400, 'Chain ID required');
  }

  const modeManager = getProductionModeManager();
  const results = await modeManager.runChain(Number(chainId), data);
  sendResponse(res, 200, { results });
}

async function handlePauseChain(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { chainId } = req.body;
  if (!chainId) {
    return sendError(res, 400, 'Chain ID required');
  }

  const orchestrator = getAgentOrchestrator();
  orchestrator.pauseChain(Number(chainId));
  sendResponse(res, 200, { message: `Chain ${chainId} paused` });
}

async function handleResumeChain(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { chainId } = req.body;
  if (!chainId) {
    return sendError(res, 400, 'Chain ID required');
  }

  const orchestrator = getAgentOrchestrator();
  orchestrator.resumeChain(Number(chainId));
  sendResponse(res, 200, { message: `Chain ${chainId} resumed` });
}

// === QUEUE HANDLERS ===

async function handleQueue(req: NextApiRequest, res: NextApiResponse) {
  const queue = getProductionQueue();
  const { chainId } = req.query;

  if (chainId) {
    const chainQueue = queue.getQueue(Number(chainId));
    sendResponse(res, 200, { queue: chainQueue });
  } else {
    const allQueues = queue.getAllQueues();
    sendResponse(res, 200, { queues: allQueues });
  }
}

async function handleQueueStats(req: NextApiRequest, res: NextApiResponse) {
  const queue = getProductionQueue();
  const stats = queue.getStats();
  sendResponse(res, 200, { stats });
}

async function handleDeadLetter(req: NextApiRequest, res: NextApiResponse) {
  const queue = getProductionQueue();
  const deadLetter = queue.getDeadLetterQueue();
  sendResponse(res, 200, { deadLetter, count: deadLetter.length });
}

async function handleRetryDeadLetter(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { itemId } = req.body;
  if (!itemId) {
    return sendError(res, 400, 'Item ID required');
  }

  const queue = getProductionQueue();
  const item = queue.retryDeadLetter(itemId);

  if (!item) {
    return sendError(res, 404, 'Item not found in dead letter queue');
  }

  sendResponse(res, 200, { item });
}

// === MONITORING HANDLERS ===

async function handleHealth(req: NextApiRequest, res: NextApiResponse) {
  const monitor = getAgentMonitor();
  const { agentId } = req.query;

  if (agentId) {
    const health = monitor.getHealth(agentId as string);
    sendResponse(res, 200, { health });
  } else {
    const summary = monitor.getHealthSummary();
    const allHealth = monitor.getAllHealth();
    sendResponse(res, 200, { summary, agents: allHealth });
  }
}

async function handleMetrics(req: NextApiRequest, res: NextApiResponse) {
  const monitor = getAgentMonitor();
  const { agentId } = req.query;

  if (agentId) {
    const metrics = monitor.getMetrics(agentId as string);
    sendResponse(res, 200, { metrics });
  } else {
    const overview = monitor.getSystemOverview();
    const allMetrics = monitor.getAllMetrics();
    sendResponse(res, 200, { overview, agents: allMetrics });
  }
}

async function handleAlerts(req: NextApiRequest, res: NextApiResponse) {
  const monitor = getAgentMonitor();
  const { type, source, acknowledged } = req.query;

  const alerts = monitor.getAlerts({
    type: type as any,
    source: source as string,
    acknowledged: acknowledged === 'true' ? true : acknowledged === 'false' ? false : undefined
  });

  sendResponse(res, 200, { alerts, count: alerts.length });
}

async function handleAcknowledgeAlert(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { alertId } = req.body;
  if (!alertId) {
    return sendError(res, 400, 'Alert ID required');
  }

  const monitor = getAgentMonitor();
  const success = monitor.acknowledgeAlert(alertId);
  sendResponse(res, 200, { success });
}

// === APPROVAL HANDLERS ===

async function handleApprovals(req: NextApiRequest, res: NextApiResponse) {
  const orchestrator = getAgentOrchestrator();
  const approvals = orchestrator.getPendingApprovals();
  sendResponse(res, 200, { approvals, count: approvals.length });
}

async function handleApprove(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { workflowId, agentId, approvedBy } = req.body;
  if (!workflowId || !agentId) {
    return sendError(res, 400, 'Workflow ID and Agent ID required');
  }

  const orchestrator = getAgentOrchestrator();
  const success = orchestrator.approve(workflowId, agentId, approvedBy || 'Yassine');
  sendResponse(res, 200, { success });
}

async function handleReject(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { workflowId, agentId, reason } = req.body;
  if (!workflowId || !agentId) {
    return sendError(res, 400, 'Workflow ID and Agent ID required');
  }

  const orchestrator = getAgentOrchestrator();
  const success = orchestrator.reject(workflowId, agentId, reason);
  sendResponse(res, 200, { success });
}

// === PRODUCTION MODE HANDLERS ===

async function handleModes(req: NextApiRequest, res: NextApiResponse) {
  const modeManager = getProductionModeManager();

  sendResponse(res, 200, {
    currentMode: modeManager.getCurrentMode(),
    config: modeManager.getCurrentConfig(),
    availableModes: modeManager.getAvailableModes(),
    stats: modeManager.getModeStats()
  });
}

async function handleSetMode(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { mode, customConfig } = req.body;
  if (!mode) {
    return sendError(res, 400, 'Mode required');
  }

  const modeManager = getProductionModeManager();
  modeManager.setMode(mode as ProductionMode, customConfig);

  sendResponse(res, 200, {
    mode: modeManager.getCurrentMode(),
    config: modeManager.getCurrentConfig()
  });
}

async function handleSchedules(req: NextApiRequest, res: NextApiResponse) {
  const modeManager = getProductionModeManager();

  if (req.method === 'GET') {
    sendResponse(res, 200, {
      schedules: modeManager.getSchedules(),
      activeSchedule: modeManager.getActiveSchedule()
    });
  } else if (req.method === 'POST') {
    const schedule = modeManager.addSchedule(req.body);
    sendResponse(res, 201, { schedule });
  } else if (req.method === 'PUT') {
    const { scheduleId, ...updates } = req.body;
    const success = modeManager.updateSchedule(scheduleId, updates);
    sendResponse(res, 200, { success });
  } else if (req.method === 'DELETE') {
    const { scheduleId } = req.body;
    const success = modeManager.removeSchedule(scheduleId);
    sendResponse(res, 200, { success });
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}

// === VISUALIZATION HANDLERS ===

async function handleVisualization(req: NextApiRequest, res: NextApiResponse) {
  const orchestrator = getAgentOrchestrator();
  const data = orchestrator.getVisualizationData();
  sendResponse(res, 200, { visualization: data });
}

async function handleBottlenecks(req: NextApiRequest, res: NextApiResponse) {
  const queue = getProductionQueue();
  const bottlenecks = queue.getBottlenecks();
  sendResponse(res, 200, { bottlenecks });
}

export default orchestratorApiHandler;
