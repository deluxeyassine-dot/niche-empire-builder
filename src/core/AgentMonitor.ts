/**
 * AGENT MONITORING SYSTEM
 * Real-time health checks, performance metrics, and alerting
 * for all 52 agents in the production chain
 */

import { EventEmitter } from 'events';
import {
  AGENT_REGISTRY,
  CHAIN_REGISTRY,
  ORCHESTRATION_SETTINGS,
  AgentConfig,
  AgentStatus
} from '../config/orchestration-config';

// Agent Health Status
export interface AgentHealth {
  agentId: string;
  status: AgentStatus;
  lastHeartbeat: number;
  lastExecution: number;
  isHealthy: boolean;
  uptime: number;
  downtime: number;
  lastError?: string;
  consecutiveErrors: number;
  resourceUsage: {
    memory: number;
    cpu: number;
  };
}

// Performance Metrics
export interface AgentMetrics {
  agentId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  throughputPerMinute: number;
  throughputPerHour: number;
  lastHourExecutions: number[];
  errorTypes: Record<string, number>;
}

// Chain Metrics
export interface ChainMetrics {
  chainId: number;
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  agentStatuses: Record<string, AgentStatus>;
  totalExecutions: number;
  averageCycleTime: number;
  bottleneckAgent?: string;
  throughput: number;
}

// Alert Definition
export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'critical';
  source: string;
  message: string;
  timestamp: number;
  acknowledged: boolean;
  metadata?: Record<string, any>;
}

// Execution Record
interface ExecutionRecord {
  agentId: string;
  timestamp: number;
  duration: number;
  success: boolean;
  error?: string;
}

/**
 * Agent Monitor
 * Comprehensive monitoring for all agents
 */
export class AgentMonitor extends EventEmitter {
  private healthStatus: Map<string, AgentHealth> = new Map();
  private metrics: Map<string, AgentMetrics> = new Map();
  private alerts: Alert[] = [];
  private executionHistory: ExecutionRecord[] = [];
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private metricsInterval: NodeJS.Timeout | null = null;
  private startTime: number = Date.now();

  constructor() {
    super();
    this.initializeMonitoring();
  }

  /**
   * Initialize monitoring for all agents
   */
  private initializeMonitoring(): void {
    const now = Date.now();

    // Initialize health status for all agents
    for (const [agentId, config] of Object.entries(AGENT_REGISTRY)) {
      this.healthStatus.set(agentId, {
        agentId,
        status: 'idle',
        lastHeartbeat: now,
        lastExecution: 0,
        isHealthy: true,
        uptime: 0,
        downtime: 0,
        consecutiveErrors: 0,
        resourceUsage: { memory: 0, cpu: 0 }
      });

      this.metrics.set(agentId, {
        agentId,
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        successRate: 100,
        averageResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        throughputPerMinute: 0,
        throughputPerHour: 0,
        lastHourExecutions: new Array(60).fill(0),
        errorTypes: {}
      });
    }
  }

  /**
   * Start monitoring
   */
  public start(): void {
    this.startHealthChecks();
    this.startMetricsCollection();
    this.emit('monitoringStarted');
  }

  /**
   * Stop monitoring
   */
  public stop(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    this.emit('monitoringStopped');
  }

  /**
   * Start health checks
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, ORCHESTRATION_SETTINGS.healthCheckInterval);
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      this.collectMetrics();
    }, ORCHESTRATION_SETTINGS.metricsCollectionInterval);
  }

  /**
   * Perform health checks on all agents
   */
  private performHealthChecks(): void {
    const now = Date.now();
    const downtimeThreshold = ORCHESTRATION_SETTINGS.alertThresholds.agentDowntime;

    for (const [agentId, health] of this.healthStatus.entries()) {
      const timeSinceHeartbeat = now - health.lastHeartbeat;

      // Check if agent is responding
      if (health.status === 'running' && timeSinceHeartbeat > downtimeThreshold) {
        health.isHealthy = false;
        health.downtime += ORCHESTRATION_SETTINGS.healthCheckInterval;

        this.createAlert({
          type: 'warning',
          source: agentId,
          message: `Agent ${agentId} has not responded for ${Math.round(timeSinceHeartbeat / 1000)}s`
        });
      } else if (health.status !== 'error' && health.status !== 'stopped') {
        health.isHealthy = true;
        health.uptime += ORCHESTRATION_SETTINGS.healthCheckInterval;
      }

      // Check consecutive errors
      if (health.consecutiveErrors >= 3) {
        this.createAlert({
          type: 'critical',
          source: agentId,
          message: `Agent ${agentId} has ${health.consecutiveErrors} consecutive errors`
        });
      }

      this.healthStatus.set(agentId, health);
    }

    this.emit('healthCheckCompleted', this.getHealthSummary());
  }

  /**
   * Collect and calculate metrics
   */
  private collectMetrics(): void {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    for (const [agentId, metrics] of this.metrics.entries()) {
      // Get recent executions for this agent
      const agentHistory = this.executionHistory.filter(
        e => e.agentId === agentId && e.timestamp > oneHourAgo
      );

      const lastMinuteHistory = agentHistory.filter(e => e.timestamp > oneMinuteAgo);

      // Calculate throughput
      metrics.throughputPerMinute = lastMinuteHistory.length;
      metrics.throughputPerHour = agentHistory.length;

      // Calculate response time percentiles
      if (agentHistory.length > 0) {
        const durations = agentHistory.map(e => e.duration).sort((a, b) => a - b);

        metrics.minResponseTime = durations[0];
        metrics.maxResponseTime = durations[durations.length - 1];
        metrics.averageResponseTime = durations.reduce((a, b) => a + b, 0) / durations.length;

        const p95Index = Math.floor(durations.length * 0.95);
        const p99Index = Math.floor(durations.length * 0.99);

        metrics.p95ResponseTime = durations[p95Index] || 0;
        metrics.p99ResponseTime = durations[p99Index] || 0;
      }

      // Update last hour execution distribution
      const currentMinute = Math.floor((now % 3600000) / 60000);
      metrics.lastHourExecutions[currentMinute] = lastMinuteHistory.length;

      // Calculate success rate
      if (metrics.totalExecutions > 0) {
        metrics.successRate = (metrics.successfulExecutions / metrics.totalExecutions) * 100;
      }

      // Check for error rate threshold
      if (metrics.successRate < (1 - ORCHESTRATION_SETTINGS.alertThresholds.errorRate) * 100) {
        this.createAlert({
          type: 'warning',
          source: agentId,
          message: `Agent ${agentId} has a ${(100 - metrics.successRate).toFixed(1)}% error rate`
        });
      }

      this.metrics.set(agentId, metrics);
    }

    // Cleanup old execution history
    this.executionHistory = this.executionHistory.filter(e => e.timestamp > oneHourAgo);

    this.emit('metricsCollected', this.getAllMetrics());
  }

  /**
   * Record agent heartbeat
   */
  public heartbeat(agentId: string): void {
    const health = this.healthStatus.get(agentId);
    if (health) {
      health.lastHeartbeat = Date.now();
      this.healthStatus.set(agentId, health);
    }
  }

  /**
   * Record execution start
   */
  public recordExecutionStart(agentId: string): void {
    const health = this.healthStatus.get(agentId);
    if (health) {
      health.status = 'running';
      health.lastHeartbeat = Date.now();
      this.healthStatus.set(agentId, health);
    }
    this.emit('executionStarted', agentId);
  }

  /**
   * Record execution completion
   */
  public recordExecutionComplete(
    agentId: string,
    duration: number,
    success: boolean,
    error?: string
  ): void {
    const now = Date.now();

    // Update health
    const health = this.healthStatus.get(agentId);
    if (health) {
      health.status = success ? 'completed' : 'error';
      health.lastExecution = now;
      health.lastHeartbeat = now;

      if (success) {
        health.consecutiveErrors = 0;
      } else {
        health.consecutiveErrors++;
        health.lastError = error;
      }

      this.healthStatus.set(agentId, health);
    }

    // Update metrics
    const metrics = this.metrics.get(agentId);
    if (metrics) {
      metrics.totalExecutions++;
      if (success) {
        metrics.successfulExecutions++;
      } else {
        metrics.failedExecutions++;
        if (error) {
          const errorType = this.categorizeError(error);
          metrics.errorTypes[errorType] = (metrics.errorTypes[errorType] || 0) + 1;
        }
      }
      this.metrics.set(agentId, metrics);
    }

    // Record in history
    this.executionHistory.push({
      agentId,
      timestamp: now,
      duration,
      success,
      error
    });

    // Check for slow response
    const agentConfig = AGENT_REGISTRY[agentId];
    if (duration > ORCHESTRATION_SETTINGS.alertThresholds.responseTime) {
      this.createAlert({
        type: 'warning',
        source: agentId,
        message: `Slow response: ${duration}ms (threshold: ${ORCHESTRATION_SETTINGS.alertThresholds.responseTime}ms)`
      });
    }

    this.emit('executionCompleted', { agentId, duration, success, error });
  }

  /**
   * Categorize error type
   */
  private categorizeError(error: string): string {
    const lowerError = error.toLowerCase();

    if (lowerError.includes('timeout')) return 'timeout';
    if (lowerError.includes('network') || lowerError.includes('connection')) return 'network';
    if (lowerError.includes('rate limit') || lowerError.includes('429')) return 'rate_limit';
    if (lowerError.includes('auth') || lowerError.includes('401') || lowerError.includes('403')) return 'auth';
    if (lowerError.includes('not found') || lowerError.includes('404')) return 'not_found';
    if (lowerError.includes('validation')) return 'validation';
    if (lowerError.includes('api')) return 'api_error';

    return 'unknown';
  }

  /**
   * Update agent status
   */
  public updateStatus(agentId: string, status: AgentStatus): void {
    const health = this.healthStatus.get(agentId);
    if (health) {
      health.status = status;
      health.lastHeartbeat = Date.now();
      this.healthStatus.set(agentId, health);
      this.emit('statusChanged', { agentId, status });
    }
  }

  /**
   * Update resource usage
   */
  public updateResourceUsage(agentId: string, memory: number, cpu: number): void {
    const health = this.healthStatus.get(agentId);
    if (health) {
      health.resourceUsage = { memory, cpu };
      this.healthStatus.set(agentId, health);
    }
  }

  /**
   * Get health status for agent
   */
  public getHealth(agentId: string): AgentHealth | undefined {
    return this.healthStatus.get(agentId);
  }

  /**
   * Get all health statuses
   */
  public getAllHealth(): AgentHealth[] {
    return Array.from(this.healthStatus.values());
  }

  /**
   * Get health summary
   */
  public getHealthSummary(): {
    totalAgents: number;
    healthyAgents: number;
    unhealthyAgents: number;
    runningAgents: number;
    idleAgents: number;
    errorAgents: number;
    stoppedAgents: number;
  } {
    const agents = this.getAllHealth();
    return {
      totalAgents: agents.length,
      healthyAgents: agents.filter(a => a.isHealthy).length,
      unhealthyAgents: agents.filter(a => !a.isHealthy).length,
      runningAgents: agents.filter(a => a.status === 'running').length,
      idleAgents: agents.filter(a => a.status === 'idle').length,
      errorAgents: agents.filter(a => a.status === 'error').length,
      stoppedAgents: agents.filter(a => a.status === 'stopped').length
    };
  }

  /**
   * Get metrics for agent
   */
  public getMetrics(agentId: string): AgentMetrics | undefined {
    return this.metrics.get(agentId);
  }

  /**
   * Get all metrics
   */
  public getAllMetrics(): AgentMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get chain metrics
   */
  public getChainMetrics(chainId: number): ChainMetrics | null {
    const chain = CHAIN_REGISTRY[chainId];
    if (!chain) return null;

    const agentStatuses: Record<string, AgentStatus> = {};
    let totalExecutions = 0;
    let totalResponseTime = 0;
    let maxBacklog = 0;
    let bottleneckAgent: string | undefined;

    for (const agentId of chain.agents) {
      const health = this.healthStatus.get(agentId);
      const metrics = this.metrics.get(agentId);

      if (health) {
        agentStatuses[agentId] = health.status;
      }

      if (metrics) {
        totalExecutions += metrics.totalExecutions;
        totalResponseTime += metrics.averageResponseTime * metrics.totalExecutions;
      }
    }

    // Determine chain health
    const statuses = Object.values(agentStatuses);
    let chainStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (statuses.some(s => s === 'error' || s === 'stopped')) {
      chainStatus = 'unhealthy';
    } else if (statuses.some(s => s === 'paused')) {
      chainStatus = 'degraded';
    }

    return {
      chainId,
      name: chain.displayName,
      status: chainStatus,
      agentStatuses,
      totalExecutions,
      averageCycleTime: totalExecutions > 0 ? totalResponseTime / totalExecutions : 0,
      bottleneckAgent,
      throughput: chain.agents.reduce((sum, id) => {
        const m = this.metrics.get(id);
        return sum + (m?.throughputPerMinute || 0);
      }, 0) / chain.agents.length
    };
  }

  /**
   * Get all chain metrics
   */
  public getAllChainMetrics(): ChainMetrics[] {
    return Object.keys(CHAIN_REGISTRY)
      .map(id => this.getChainMetrics(Number(id)))
      .filter((m): m is ChainMetrics => m !== null);
  }

  /**
   * Create alert
   */
  public createAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>): Alert {
    const newAlert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      acknowledged: false,
      ...alert
    };

    this.alerts.push(newAlert);

    // Keep only last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }

    this.emit('alertCreated', newAlert);

    // Emit critical alerts specially
    if (alert.type === 'critical') {
      this.emit('criticalAlert', newAlert);
    }

    return newAlert;
  }

  /**
   * Get all alerts
   */
  public getAlerts(options?: {
    type?: Alert['type'];
    source?: string;
    acknowledged?: boolean;
    since?: number;
  }): Alert[] {
    let filtered = [...this.alerts];

    if (options?.type) {
      filtered = filtered.filter(a => a.type === options.type);
    }
    if (options?.source) {
      filtered = filtered.filter(a => a.source === options.source);
    }
    if (options?.acknowledged !== undefined) {
      filtered = filtered.filter(a => a.acknowledged === options.acknowledged);
    }
    if (options?.since) {
      filtered = filtered.filter(a => a.timestamp >= options.since);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.emit('alertAcknowledged', alert);
      return true;
    }
    return false;
  }

  /**
   * Clear acknowledged alerts
   */
  public clearAcknowledgedAlerts(): number {
    const before = this.alerts.length;
    this.alerts = this.alerts.filter(a => !a.acknowledged);
    return before - this.alerts.length;
  }

  /**
   * Get system overview
   */
  public getSystemOverview(): {
    uptime: number;
    totalExecutions: number;
    successRate: number;
    averageResponseTime: number;
    activeAlerts: number;
    healthSummary: ReturnType<typeof this.getHealthSummary>;
    topPerformers: Array<{ agentId: string; successRate: number; throughput: number }>;
    bottomPerformers: Array<{ agentId: string; successRate: number; errorCount: number }>;
  } {
    const allMetrics = this.getAllMetrics();

    const totalExecutions = allMetrics.reduce((sum, m) => sum + m.totalExecutions, 0);
    const successfulExecutions = allMetrics.reduce((sum, m) => sum + m.successfulExecutions, 0);
    const totalResponseTime = allMetrics.reduce(
      (sum, m) => sum + m.averageResponseTime * m.totalExecutions,
      0
    );

    // Sort by performance
    const sorted = [...allMetrics]
      .filter(m => m.totalExecutions > 0)
      .sort((a, b) => b.successRate - a.successRate);

    const topPerformers = sorted.slice(0, 5).map(m => ({
      agentId: m.agentId,
      successRate: m.successRate,
      throughput: m.throughputPerHour
    }));

    const bottomPerformers = sorted.slice(-5).reverse().map(m => ({
      agentId: m.agentId,
      successRate: m.successRate,
      errorCount: m.failedExecutions
    }));

    return {
      uptime: Date.now() - this.startTime,
      totalExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 100,
      averageResponseTime: totalExecutions > 0 ? totalResponseTime / totalExecutions : 0,
      activeAlerts: this.alerts.filter(a => !a.acknowledged).length,
      healthSummary: this.getHealthSummary(),
      topPerformers,
      bottomPerformers
    };
  }

  /**
   * Reset metrics for agent
   */
  public resetMetrics(agentId: string): void {
    const metrics = this.metrics.get(agentId);
    if (metrics) {
      metrics.totalExecutions = 0;
      metrics.successfulExecutions = 0;
      metrics.failedExecutions = 0;
      metrics.successRate = 100;
      metrics.averageResponseTime = 0;
      metrics.minResponseTime = Infinity;
      metrics.maxResponseTime = 0;
      metrics.p95ResponseTime = 0;
      metrics.p99ResponseTime = 0;
      metrics.throughputPerMinute = 0;
      metrics.throughputPerHour = 0;
      metrics.lastHourExecutions = new Array(60).fill(0);
      metrics.errorTypes = {};
      this.metrics.set(agentId, metrics);
    }
  }

  /**
   * Reset all metrics
   */
  public resetAllMetrics(): void {
    for (const agentId of this.metrics.keys()) {
      this.resetMetrics(agentId);
    }
    this.executionHistory = [];
  }

  /**
   * Export monitoring data
   */
  public exportData(): any {
    return {
      timestamp: Date.now(),
      uptime: Date.now() - this.startTime,
      health: Array.from(this.healthStatus.entries()),
      metrics: Array.from(this.metrics.entries()),
      alerts: this.alerts,
      executionHistoryCount: this.executionHistory.length
    };
  }
}

// Singleton instance
let monitorInstance: AgentMonitor | null = null;

export function getAgentMonitor(): AgentMonitor {
  if (!monitorInstance) {
    monitorInstance = new AgentMonitor();
  }
  return monitorInstance;
}

export default AgentMonitor;
