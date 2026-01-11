/**
 * WEBSOCKET HANDLER
 * Real-time communication for the Orchestrator Control Dashboard
 */

import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { getAgentOrchestrator } from '../core/AgentOrchestrator';
import { getProductionQueue } from '../core/ProductionQueue';
import { getAgentMonitor } from '../core/AgentMonitor';
import { getProductionModeManager } from '../core/ProductionModes';

// Message Types
export type WebSocketMessageType =
  | 'status_update'
  | 'agent_status_changed'
  | 'chain_status_changed'
  | 'approval_required'
  | 'approval_granted'
  | 'approval_rejected'
  | 'workflow_started'
  | 'workflow_completed'
  | 'cycle_completed'
  | 'queue_update'
  | 'alert'
  | 'metrics_update'
  | 'mode_changed'
  | 'error'
  | 'ping'
  | 'pong';

// WebSocket Message
export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
  timestamp: number;
}

// Connected Client
interface ConnectedClient {
  id: string;
  ws: WebSocket;
  subscriptions: Set<string>;
  lastPing: number;
}

/**
 * Orchestrator WebSocket Handler
 * Manages real-time connections for the dashboard
 */
export class OrchestratorWebSocket {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ConnectedClient> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize WebSocket server
   */
  public initialize(server: any, path: string = '/ws/orchestrator'): void {
    this.wss = new WebSocketServer({ server, path });

    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      this.handleConnection(ws, request);
    });

    this.setupEventListeners();
    this.startPingLoop();
    this.startUpdateLoop();

    console.log(`WebSocket server initialized at ${path}`);
  }

  /**
   * Handle new connection
   */
  private handleConnection(ws: WebSocket, request: IncomingMessage): void {
    const clientId = this.generateClientId();
    const client: ConnectedClient = {
      id: clientId,
      ws,
      subscriptions: new Set(['all']),
      lastPing: Date.now()
    };

    this.clients.set(clientId, client);
    console.log(`Client connected: ${clientId}`);

    // Send initial state
    this.sendInitialState(client);

    // Handle messages
    ws.on('message', (data: Buffer) => {
      this.handleMessage(client, data);
    });

    // Handle close
    ws.on('close', () => {
      this.clients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
    });

    // Handle error
    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      this.clients.delete(clientId);
    });
  }

  /**
   * Handle incoming message
   */
  private handleMessage(client: ConnectedClient, data: Buffer): void {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(client, message.channels);
          break;
        case 'unsubscribe':
          this.handleUnsubscribe(client, message.channels);
          break;
        case 'ping':
          client.lastPing = Date.now();
          this.send(client, { type: 'pong', data: {}, timestamp: Date.now() });
          break;
        case 'command':
          this.handleCommand(client, message.command, message.data);
          break;
        default:
          console.log(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Handle subscribe request
   */
  private handleSubscribe(client: ConnectedClient, channels: string[]): void {
    for (const channel of channels) {
      client.subscriptions.add(channel);
    }
  }

  /**
   * Handle unsubscribe request
   */
  private handleUnsubscribe(client: ConnectedClient, channels: string[]): void {
    for (const channel of channels) {
      client.subscriptions.delete(channel);
    }
  }

  /**
   * Handle command from client
   */
  private async handleCommand(client: ConnectedClient, command: string, data: any): Promise<void> {
    const orchestrator = getAgentOrchestrator();
    const modeManager = getProductionModeManager();

    try {
      let result: any;

      switch (command) {
        case 'start':
          result = await modeManager.startProduction();
          break;
        case 'stop':
          orchestrator.stop(data?.workflowId);
          result = { success: true };
          break;
        case 'pause':
          orchestrator.pause(data?.workflowId);
          result = { success: true };
          break;
        case 'resume':
          orchestrator.resume(data?.workflowId);
          result = { success: true };
          break;
        case 'approve':
          result = orchestrator.approve(data.workflowId, data.agentId, data.approvedBy);
          break;
        case 'reject':
          result = orchestrator.reject(data.workflowId, data.agentId, data.reason);
          break;
        case 'skip_agent':
          result = orchestrator.skipAgent(data.workflowId, data.agentId);
          break;
        case 'retry_agent':
          result = orchestrator.forceRetry(data.workflowId, data.agentId);
          break;
        case 'set_mode':
          modeManager.setMode(data.mode, data.config);
          result = { mode: modeManager.getCurrentMode() };
          break;
        default:
          result = { error: `Unknown command: ${command}` };
      }

      this.send(client, {
        type: 'command_response' as any,
        data: { command, result },
        timestamp: Date.now()
      });
    } catch (error: any) {
      this.send(client, {
        type: 'error',
        data: { command, error: error.message },
        timestamp: Date.now()
      });
    }
  }

  /**
   * Send initial state to new client
   */
  private sendInitialState(client: ConnectedClient): void {
    const orchestrator = getAgentOrchestrator();
    const queue = getProductionQueue();
    const monitor = getAgentMonitor();
    const modeManager = getProductionModeManager();

    // Send full status
    this.send(client, {
      type: 'status_update',
      data: {
        ...orchestrator.getStatus(),
        mode: modeManager.getCurrentMode(),
        modeConfig: modeManager.getCurrentConfig(),
        stats: modeManager.getModeStats(),
        visualization: orchestrator.getVisualizationData()
      },
      timestamp: Date.now()
    });

    // Send queue state
    this.send(client, {
      type: 'queue_update',
      data: {
        stats: queue.getStats(),
        bottlenecks: queue.getBottlenecks()
      },
      timestamp: Date.now()
    });

    // Send alerts
    const alerts = monitor.getAlerts({ acknowledged: false });
    if (alerts.length > 0) {
      this.send(client, {
        type: 'alert',
        data: { alerts },
        timestamp: Date.now()
      });
    }

    // Send pending approvals
    const approvals = orchestrator.getPendingApprovals();
    for (const approval of approvals) {
      this.send(client, {
        type: 'approval_required',
        data: approval,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Setup event listeners for orchestrator events
   */
  private setupEventListeners(): void {
    const orchestrator = getAgentOrchestrator();
    const queue = getProductionQueue();
    const monitor = getAgentMonitor();
    const modeManager = getProductionModeManager();

    // Orchestrator events
    orchestrator.on('workflowStarted', (workflow) => {
      this.broadcast({
        type: 'workflow_started',
        data: workflow,
        timestamp: Date.now()
      });
    });

    orchestrator.on('agentExecutionStarted', (data) => {
      this.broadcast({
        type: 'agent_status_changed',
        data: { ...data, status: 'running' },
        timestamp: Date.now()
      }, 'agents');
    });

    orchestrator.on('agentExecutionCompleted', (data) => {
      this.broadcast({
        type: 'agent_status_changed',
        data: { ...data, status: 'completed' },
        timestamp: Date.now()
      }, 'agents');
    });

    orchestrator.on('chainCompleted', (data) => {
      this.broadcast({
        type: 'chain_status_changed',
        data: { ...data, status: 'completed' },
        timestamp: Date.now()
      }, 'chains');
    });

    orchestrator.on('cycleCompleted', (data) => {
      this.broadcast({
        type: 'cycle_completed',
        data,
        timestamp: Date.now()
      });
    });

    orchestrator.on('approvalRequested', (data) => {
      this.broadcast({
        type: 'approval_required',
        data,
        timestamp: Date.now()
      }, 'approvals');
    });

    orchestrator.on('approvalGranted', (data) => {
      this.broadcast({
        type: 'approval_granted',
        data,
        timestamp: Date.now()
      }, 'approvals');
    });

    orchestrator.on('approvalRejected', (data) => {
      this.broadcast({
        type: 'approval_rejected',
        data,
        timestamp: Date.now()
      }, 'approvals');
    });

    orchestrator.on('paused', (data) => {
      this.broadcastStatusUpdate();
    });

    orchestrator.on('resumed', (data) => {
      this.broadcastStatusUpdate();
    });

    orchestrator.on('stopped', (data) => {
      this.broadcastStatusUpdate();
    });

    // Queue events
    queue.on('itemEnqueued', () => {
      this.broadcastQueueUpdate();
    });

    queue.on('itemCompleted', () => {
      this.broadcastQueueUpdate();
    });

    queue.on('itemFailed', () => {
      this.broadcastQueueUpdate();
    });

    queue.on('itemDead', (item) => {
      this.broadcast({
        type: 'alert',
        data: {
          type: 'critical',
          message: `Agent ${item.agentId} failed after all retries`,
          source: item.agentId
        },
        timestamp: Date.now()
      }, 'alerts');
    });

    // Monitor events
    monitor.on('alertCreated', (alert) => {
      this.broadcast({
        type: 'alert',
        data: alert,
        timestamp: Date.now()
      }, 'alerts');
    });

    monitor.on('criticalAlert', (alert) => {
      this.broadcast({
        type: 'alert',
        data: { ...alert, critical: true },
        timestamp: Date.now()
      });
    });

    // Mode manager events
    modeManager.on('modeChanged', (data) => {
      this.broadcast({
        type: 'mode_changed',
        data,
        timestamp: Date.now()
      });
    });

    modeManager.on('confirmationRequired', (data) => {
      this.broadcast({
        type: 'approval_required',
        data: { ...data, type: 'mode_confirmation' },
        timestamp: Date.now()
      });
    });
  }

  /**
   * Broadcast status update
   */
  private broadcastStatusUpdate(): void {
    const orchestrator = getAgentOrchestrator();
    const modeManager = getProductionModeManager();

    this.broadcast({
      type: 'status_update',
      data: {
        ...orchestrator.getStatus(),
        mode: modeManager.getCurrentMode(),
        stats: modeManager.getModeStats(),
        visualization: orchestrator.getVisualizationData()
      },
      timestamp: Date.now()
    });
  }

  /**
   * Broadcast queue update
   */
  private broadcastQueueUpdate(): void {
    const queue = getProductionQueue();

    this.broadcast({
      type: 'queue_update',
      data: {
        stats: queue.getStats(),
        bottlenecks: queue.getBottlenecks()
      },
      timestamp: Date.now()
    }, 'queue');
  }

  /**
   * Send message to client
   */
  private send(client: ConnectedClient, message: WebSocketMessage): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast message to all clients
   */
  private broadcast(message: WebSocketMessage, channel: string = 'all'): void {
    for (const client of this.clients.values()) {
      if (client.subscriptions.has('all') || client.subscriptions.has(channel)) {
        this.send(client, message);
      }
    }
  }

  /**
   * Start ping loop to keep connections alive
   */
  private startPingLoop(): void {
    this.pingInterval = setInterval(() => {
      const now = Date.now();
      const timeout = 60000; // 60 seconds

      for (const [id, client] of this.clients.entries()) {
        if (now - client.lastPing > timeout) {
          console.log(`Client ${id} timed out`);
          client.ws.terminate();
          this.clients.delete(id);
        } else if (client.ws.readyState === WebSocket.OPEN) {
          this.send(client, { type: 'ping', data: {}, timestamp: now });
        }
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Start periodic update loop
   */
  private startUpdateLoop(): void {
    this.updateInterval = setInterval(() => {
      if (this.clients.size > 0) {
        this.broadcastStatusUpdate();

        // Send metrics update
        const monitor = getAgentMonitor();
        this.broadcast({
          type: 'metrics_update',
          data: monitor.getSystemOverview(),
          timestamp: Date.now()
        }, 'metrics');
      }
    }, 5000); // Every 5 seconds
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get connected client count
   */
  public getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Shutdown WebSocket server
   */
  public shutdown(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    for (const client of this.clients.values()) {
      client.ws.close();
    }
    this.clients.clear();

    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }

    console.log('WebSocket server shut down');
  }
}

// Singleton instance
let wsInstance: OrchestratorWebSocket | null = null;

export function getOrchestratorWebSocket(): OrchestratorWebSocket {
  if (!wsInstance) {
    wsInstance = new OrchestratorWebSocket();
  }
  return wsInstance;
}

export default OrchestratorWebSocket;
