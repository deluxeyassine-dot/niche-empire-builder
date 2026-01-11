/**
 * ORCHESTRATOR STANDALONE SERVER
 * Run the 52-agent orchestration system independently
 */

import http from 'http';
import { parse } from 'url';
import {
  initializeOrchestrationSystem,
  startProduction,
  stopProduction,
  getSystemStatus
} from './core';
import { getOrchestratorWebSocket } from './api/websocket-handler';
import { ProductionMode } from './core/ProductionModes';

// Configuration
const PORT = process.env.ORCHESTRATOR_PORT || 3100;
const DEFAULT_MODE: ProductionMode = (process.env.PRODUCTION_MODE as ProductionMode) || 'semi_auto';

// Server instance
let server: http.Server | null = null;

/**
 * Start the orchestrator server
 */
async function startServer(): Promise<void> {
  console.log('========================================');
  console.log('  NICHE EMPIRE BUILDER - ORCHESTRATOR');
  console.log('  52-Agent Production Chain System');
  console.log('========================================\n');

  // Initialize orchestration system
  console.log('Initializing orchestration system...');
  const { orchestrator, queue, monitor, integration, modeManager } = await initializeOrchestrationSystem();

  // Create HTTP server
  server = http.createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    const path = parsedUrl.pathname;

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      res.end();
      return;
    }

    // Route handling
    if (path === '/health') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
      return;
    }

    if (path === '/status') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(getSystemStatus()));
      return;
    }

    if (path === '/start' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = body ? JSON.parse(body) : {};
          const workflowId = await startProduction(data.mode || DEFAULT_MODE);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, workflowId }));
        } catch (error: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      });
      return;
    }

    if (path === '/stop' && req.method === 'POST') {
      stopProduction();
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, message: 'Production stopped' }));
      return;
    }

    if (path === '/visualization') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(orchestrator.getVisualizationData()));
      return;
    }

    if (path === '/queues') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        stats: queue.getStats(),
        bottlenecks: queue.getBottlenecks()
      }));
      return;
    }

    if (path === '/metrics') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(monitor.getSystemOverview()));
      return;
    }

    if (path === '/agents') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(integration.getAllStatuses()));
      return;
    }

    // 404 for unknown routes
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  // Initialize WebSocket
  const wsHandler = getOrchestratorWebSocket();
  wsHandler.initialize(server);

  // Start server
  server.listen(PORT, () => {
    console.log(`\nOrchestrator server running on port ${PORT}`);
    console.log(`  - HTTP API: http://localhost:${PORT}`);
    console.log(`  - WebSocket: ws://localhost:${PORT}/ws/orchestrator`);
    console.log(`  - Dashboard: http://localhost:3000/orchestrator-control.html`);
    console.log(`\nDefault mode: ${DEFAULT_MODE}`);
    console.log('\nAvailable endpoints:');
    console.log('  GET  /health          - Health check');
    console.log('  GET  /status          - System status');
    console.log('  POST /start           - Start production');
    console.log('  POST /stop            - Stop production');
    console.log('  GET  /visualization   - Chain visualization data');
    console.log('  GET  /queues          - Queue statistics');
    console.log('  GET  /metrics         - System metrics');
    console.log('  GET  /agents          - Agent statuses');
    console.log('\n========================================');
  });

  // Handle shutdown
  process.on('SIGINT', () => shutdown());
  process.on('SIGTERM', () => shutdown());
}

/**
 * Shutdown gracefully
 */
async function shutdown(): Promise<void> {
  console.log('\nShutting down orchestrator...');

  stopProduction();

  const wsHandler = getOrchestratorWebSocket();
  wsHandler.shutdown();

  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  startServer().catch(error => {
    console.error('Failed to start orchestrator:', error);
    process.exit(1);
  });
}

export { startServer, shutdown };
