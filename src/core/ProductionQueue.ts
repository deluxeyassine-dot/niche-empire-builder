/**
 * PRODUCTION QUEUE SYSTEM
 * Advanced queue management for the 52-agent production chain
 * Handles priorities, retries, dead letter queue, and throughput tracking
 */

import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import {
  AgentPriority,
  PRIORITY_WEIGHTS,
  ORCHESTRATION_SETTINGS,
  AGENT_REGISTRY,
  AgentConfig
} from '../config/orchestration-config';

// Queue Item Interface
export interface QueueItem {
  id: string;
  agentId: string;
  chainId: number;
  priority: AgentPriority;
  data: any;
  metadata: {
    createdAt: number;
    updatedAt: number;
    attempts: number;
    maxAttempts: number;
    lastError?: string;
    source?: string;
    correlationId?: string;
    parentItemId?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'dead';
  result?: any;
  scheduledFor?: number;
}

// Queue Statistics
export interface QueueStats {
  totalItems: number;
  pendingItems: number;
  processingItems: number;
  completedItems: number;
  failedItems: number;
  deadItems: number;
  throughputPerMinute: number;
  throughputPerHour: number;
  averageProcessingTime: number;
  oldestPendingItem?: number;
  itemsByPriority: Record<AgentPriority, number>;
  itemsByChain: Record<number, number>;
  itemsByAgent: Record<string, number>;
}

// Chain Queue
export interface ChainQueue {
  chainId: number;
  name: string;
  items: QueueItem[];
  processing: QueueItem[];
  completed: QueueItem[];
  failed: QueueItem[];
}

// Processing Result
export interface ProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
}

/**
 * Production Queue Manager
 * Central queue system for all agent workflows
 */
export class ProductionQueue extends EventEmitter {
  private queues: Map<number, ChainQueue> = new Map();
  private deadLetterQueue: QueueItem[] = [];
  private processingHistory: Array<{ timestamp: number; duration: number }> = [];
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeQueues();
  }

  /**
   * Initialize queues for all chains
   */
  private initializeQueues(): void {
    for (let i = 1; i <= 10; i++) {
      this.queues.set(i, {
        chainId: i,
        name: `chain-${i}`,
        items: [],
        processing: [],
        completed: [],
        failed: []
      });
    }
  }

  /**
   * Add item to queue
   */
  public enqueue(
    agentId: string,
    data: any,
    options: {
      priority?: AgentPriority;
      correlationId?: string;
      parentItemId?: string;
      scheduledFor?: number;
    } = {}
  ): QueueItem {
    const agent = AGENT_REGISTRY[agentId];
    if (!agent) {
      throw new Error(`Unknown agent: ${agentId}`);
    }

    const item: QueueItem = {
      id: uuidv4(),
      agentId,
      chainId: agent.chainId,
      priority: options.priority || agent.priority,
      data,
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        attempts: 0,
        maxAttempts: agent.retryLimit,
        correlationId: options.correlationId || uuidv4(),
        parentItemId: options.parentItemId
      },
      status: 'pending',
      scheduledFor: options.scheduledFor
    };

    const queue = this.queues.get(agent.chainId);
    if (queue) {
      // Insert by priority
      const insertIndex = this.findInsertIndex(queue.items, item.priority);
      queue.items.splice(insertIndex, 0, item);
    }

    this.emit('itemEnqueued', item);
    return item;
  }

  /**
   * Find insert index based on priority
   */
  private findInsertIndex(items: QueueItem[], priority: AgentPriority): number {
    const weight = PRIORITY_WEIGHTS[priority];
    for (let i = 0; i < items.length; i++) {
      if (PRIORITY_WEIGHTS[items[i].priority] < weight) {
        return i;
      }
    }
    return items.length;
  }

  /**
   * Enqueue multiple items
   */
  public enqueueBatch(
    items: Array<{ agentId: string; data: any; priority?: AgentPriority }>
  ): QueueItem[] {
    return items.map(item => this.enqueue(item.agentId, item.data, { priority: item.priority }));
  }

  /**
   * Dequeue next item for processing
   */
  public dequeue(chainId?: number): QueueItem | null {
    const now = Date.now();

    if (chainId !== undefined) {
      const queue = this.queues.get(chainId);
      if (queue && queue.items.length > 0) {
        const item = queue.items.find(
          i => !i.scheduledFor || i.scheduledFor <= now
        );
        if (item) {
          const index = queue.items.indexOf(item);
          queue.items.splice(index, 1);
          item.status = 'processing';
          item.metadata.updatedAt = now;
          queue.processing.push(item);
          this.emit('itemDequeued', item);
          return item;
        }
      }
      return null;
    }

    // Get from highest priority queue across all chains
    for (const priority of ['critical', 'high', 'medium', 'low'] as AgentPriority[]) {
      for (const queue of this.queues.values()) {
        const item = queue.items.find(
          i => i.priority === priority && (!i.scheduledFor || i.scheduledFor <= now)
        );
        if (item) {
          const index = queue.items.indexOf(item);
          queue.items.splice(index, 1);
          item.status = 'processing';
          item.metadata.updatedAt = now;
          queue.processing.push(item);
          this.emit('itemDequeued', item);
          return item;
        }
      }
    }

    return null;
  }

  /**
   * Mark item as completed
   */
  public complete(itemId: string, result: any): void {
    const { item, queue } = this.findItem(itemId, 'processing');
    if (!item || !queue) {
      throw new Error(`Item not found in processing: ${itemId}`);
    }

    const processingIndex = queue.processing.indexOf(item);
    if (processingIndex > -1) {
      queue.processing.splice(processingIndex, 1);
    }

    const duration = Date.now() - item.metadata.updatedAt;
    this.processingHistory.push({ timestamp: Date.now(), duration });

    item.status = 'completed';
    item.result = result;
    item.metadata.updatedAt = Date.now();
    queue.completed.push(item);

    // Clean up old completed items (keep last 1000)
    if (queue.completed.length > 1000) {
      queue.completed = queue.completed.slice(-1000);
    }

    this.emit('itemCompleted', item, result);
  }

  /**
   * Mark item as failed
   */
  public fail(itemId: string, error: string): void {
    const { item, queue } = this.findItem(itemId, 'processing');
    if (!item || !queue) {
      throw new Error(`Item not found in processing: ${itemId}`);
    }

    const processingIndex = queue.processing.indexOf(item);
    if (processingIndex > -1) {
      queue.processing.splice(processingIndex, 1);
    }

    item.metadata.attempts++;
    item.metadata.lastError = error;
    item.metadata.updatedAt = Date.now();

    // Check if should retry
    if (item.metadata.attempts < item.metadata.maxAttempts) {
      // Re-queue with exponential backoff
      const agent = AGENT_REGISTRY[item.agentId];
      const backoffDelay = agent.retryDelay * Math.pow(
        ORCHESTRATION_SETTINGS.retryBackoffMultiplier,
        item.metadata.attempts - 1
      );
      item.scheduledFor = Date.now() + Math.min(backoffDelay, ORCHESTRATION_SETTINGS.maxRetryDelay);
      item.status = 'pending';

      // Re-insert by priority
      const insertIndex = this.findInsertIndex(queue.items, item.priority);
      queue.items.splice(insertIndex, 0, item);

      this.emit('itemRetrying', item);
    } else {
      // Move to failed or dead letter queue
      item.status = 'failed';
      queue.failed.push(item);

      if (ORCHESTRATION_SETTINGS.deadLetterQueueEnabled) {
        item.status = 'dead';
        this.deadLetterQueue.push(item);
        this.emit('itemDead', item);
      }

      this.emit('itemFailed', item, error);
    }
  }

  /**
   * Find item by ID
   */
  private findItem(
    itemId: string,
    status?: 'pending' | 'processing' | 'completed' | 'failed'
  ): { item: QueueItem | null; queue: ChainQueue | null } {
    for (const queue of this.queues.values()) {
      let items: QueueItem[] = [];

      if (!status || status === 'pending') {
        items = items.concat(queue.items);
      }
      if (!status || status === 'processing') {
        items = items.concat(queue.processing);
      }
      if (!status || status === 'completed') {
        items = items.concat(queue.completed);
      }
      if (!status || status === 'failed') {
        items = items.concat(queue.failed);
      }

      const item = items.find(i => i.id === itemId);
      if (item) {
        return { item, queue };
      }
    }

    return { item: null, queue: null };
  }

  /**
   * Get item by ID
   */
  public getItem(itemId: string): QueueItem | null {
    return this.findItem(itemId).item;
  }

  /**
   * Get items by correlation ID
   */
  public getByCorrelationId(correlationId: string): QueueItem[] {
    const items: QueueItem[] = [];
    for (const queue of this.queues.values()) {
      items.push(
        ...queue.items.filter(i => i.metadata.correlationId === correlationId),
        ...queue.processing.filter(i => i.metadata.correlationId === correlationId),
        ...queue.completed.filter(i => i.metadata.correlationId === correlationId),
        ...queue.failed.filter(i => i.metadata.correlationId === correlationId)
      );
    }
    return items;
  }

  /**
   * Get queue by chain ID
   */
  public getQueue(chainId: number): ChainQueue | undefined {
    return this.queues.get(chainId);
  }

  /**
   * Get all queues
   */
  public getAllQueues(): ChainQueue[] {
    return Array.from(this.queues.values());
  }

  /**
   * Get dead letter queue
   */
  public getDeadLetterQueue(): QueueItem[] {
    return [...this.deadLetterQueue];
  }

  /**
   * Retry dead letter item
   */
  public retryDeadLetter(itemId: string): QueueItem | null {
    const index = this.deadLetterQueue.findIndex(i => i.id === itemId);
    if (index === -1) return null;

    const item = this.deadLetterQueue.splice(index, 1)[0];
    item.status = 'pending';
    item.metadata.attempts = 0;
    item.metadata.updatedAt = Date.now();
    delete item.scheduledFor;

    const queue = this.queues.get(item.chainId);
    if (queue) {
      const insertIndex = this.findInsertIndex(queue.items, item.priority);
      queue.items.splice(insertIndex, 0, item);
    }

    this.emit('deadLetterRetried', item);
    return item;
  }

  /**
   * Clear dead letter queue
   */
  public clearDeadLetterQueue(): number {
    const count = this.deadLetterQueue.length;
    this.deadLetterQueue = [];
    return count;
  }

  /**
   * Purge old dead letters
   */
  public purgeOldDeadLetters(): number {
    const cutoff = Date.now() - ORCHESTRATION_SETTINGS.deadLetterMaxAge;
    const before = this.deadLetterQueue.length;
    this.deadLetterQueue = this.deadLetterQueue.filter(
      item => item.metadata.updatedAt > cutoff
    );
    return before - this.deadLetterQueue.length;
  }

  /**
   * Get queue statistics
   */
  public getStats(): QueueStats {
    const stats: QueueStats = {
      totalItems: 0,
      pendingItems: 0,
      processingItems: 0,
      completedItems: 0,
      failedItems: 0,
      deadItems: this.deadLetterQueue.length,
      throughputPerMinute: 0,
      throughputPerHour: 0,
      averageProcessingTime: 0,
      itemsByPriority: { critical: 0, high: 0, medium: 0, low: 0 },
      itemsByChain: {},
      itemsByAgent: {}
    };

    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    for (const queue of this.queues.values()) {
      stats.pendingItems += queue.items.length;
      stats.processingItems += queue.processing.length;
      stats.completedItems += queue.completed.length;
      stats.failedItems += queue.failed.length;

      stats.itemsByChain[queue.chainId] = queue.items.length + queue.processing.length;

      // Count by priority
      for (const item of queue.items) {
        stats.itemsByPriority[item.priority]++;
        stats.itemsByAgent[item.agentId] = (stats.itemsByAgent[item.agentId] || 0) + 1;
      }

      // Find oldest pending
      if (queue.items.length > 0) {
        const oldest = queue.items[queue.items.length - 1].metadata.createdAt;
        if (!stats.oldestPendingItem || oldest < stats.oldestPendingItem) {
          stats.oldestPendingItem = oldest;
        }
      }
    }

    stats.totalItems = stats.pendingItems + stats.processingItems;

    // Calculate throughput
    const recentHistory = this.processingHistory.filter(h => h.timestamp > oneMinuteAgo);
    stats.throughputPerMinute = recentHistory.length;

    const hourHistory = this.processingHistory.filter(h => h.timestamp > oneHourAgo);
    stats.throughputPerHour = hourHistory.length;

    // Calculate average processing time
    if (hourHistory.length > 0) {
      stats.averageProcessingTime = hourHistory.reduce((sum, h) => sum + h.duration, 0) / hourHistory.length;
    }

    // Cleanup old history
    if (this.processingHistory.length > 10000) {
      this.processingHistory = this.processingHistory.slice(-5000);
    }

    return stats;
  }

  /**
   * Get items pending for specific agent
   */
  public getPendingForAgent(agentId: string): QueueItem[] {
    const agent = AGENT_REGISTRY[agentId];
    if (!agent) return [];

    const queue = this.queues.get(agent.chainId);
    if (!queue) return [];

    return queue.items.filter(i => i.agentId === agentId);
  }

  /**
   * Get processing items for specific agent
   */
  public getProcessingForAgent(agentId: string): QueueItem[] {
    const agent = AGENT_REGISTRY[agentId];
    if (!agent) return [];

    const queue = this.queues.get(agent.chainId);
    if (!queue) return [];

    return queue.processing.filter(i => i.agentId === agentId);
  }

  /**
   * Clear queue for specific chain
   */
  public clearChainQueue(chainId: number): number {
    const queue = this.queues.get(chainId);
    if (!queue) return 0;

    const count = queue.items.length;
    queue.items = [];
    return count;
  }

  /**
   * Clear all queues
   */
  public clearAllQueues(): number {
    let count = 0;
    for (const queue of this.queues.values()) {
      count += queue.items.length;
      queue.items = [];
    }
    return count;
  }

  /**
   * Move item to different priority
   */
  public reprioritize(itemId: string, newPriority: AgentPriority): boolean {
    const { item, queue } = this.findItem(itemId, 'pending');
    if (!item || !queue) return false;

    const index = queue.items.indexOf(item);
    if (index > -1) {
      queue.items.splice(index, 1);
      item.priority = newPriority;
      item.metadata.updatedAt = Date.now();
      const insertIndex = this.findInsertIndex(queue.items, newPriority);
      queue.items.splice(insertIndex, 0, item);
      this.emit('itemReprioritized', item);
      return true;
    }

    return false;
  }

  /**
   * Cancel pending item
   */
  public cancel(itemId: string): boolean {
    const { item, queue } = this.findItem(itemId, 'pending');
    if (!item || !queue) return false;

    const index = queue.items.indexOf(item);
    if (index > -1) {
      queue.items.splice(index, 1);
      this.emit('itemCancelled', item);
      return true;
    }

    return false;
  }

  /**
   * Get estimated time to process
   */
  public getETA(itemId: string): number | null {
    const { item, queue } = this.findItem(itemId, 'pending');
    if (!item || !queue) return null;

    const stats = this.getStats();
    if (stats.averageProcessingTime === 0) return null;

    // Count items ahead in queue
    const index = queue.items.indexOf(item);
    const itemsAhead = index + 1;

    // Factor in priority - higher priority items process faster
    const priorityFactor = PRIORITY_WEIGHTS[item.priority] / 100;

    // Estimate based on average processing time
    return Math.round(itemsAhead * stats.averageProcessingTime * priorityFactor);
  }

  /**
   * Get bottleneck analysis
   */
  public getBottlenecks(): Array<{ chainId: number; agentId: string; count: number; avgWait: number }> {
    const bottlenecks: Array<{ chainId: number; agentId: string; count: number; avgWait: number }> = [];
    const now = Date.now();

    for (const queue of this.queues.values()) {
      // Group by agent
      const agentGroups: Record<string, QueueItem[]> = {};
      for (const item of queue.items) {
        if (!agentGroups[item.agentId]) {
          agentGroups[item.agentId] = [];
        }
        agentGroups[item.agentId].push(item);
      }

      // Find agents with significant backlog
      for (const [agentId, items] of Object.entries(agentGroups)) {
        if (items.length >= 5) { // Threshold for bottleneck
          const avgWait = items.reduce((sum, i) => sum + (now - i.metadata.createdAt), 0) / items.length;
          bottlenecks.push({
            chainId: queue.chainId,
            agentId,
            count: items.length,
            avgWait
          });
        }
      }
    }

    // Sort by count descending
    return bottlenecks.sort((a, b) => b.count - a.count);
  }

  /**
   * Start automatic queue processing
   */
  public startProcessing(processor: (item: QueueItem) => Promise<ProcessingResult>): void {
    if (this.processingInterval) return;

    this.isProcessing = true;
    this.processingInterval = setInterval(async () => {
      if (!this.isProcessing) return;

      const item = this.dequeue();
      if (!item) return;

      try {
        const result = await processor(item);
        if (result.success) {
          this.complete(item.id, result.data);
        } else {
          this.fail(item.id, result.error || 'Unknown error');
        }
      } catch (error: any) {
        this.fail(item.id, error.message || 'Processing error');
      }
    }, ORCHESTRATION_SETTINGS.queueProcessingInterval);
  }

  /**
   * Stop automatic queue processing
   */
  public stopProcessing(): void {
    this.isProcessing = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  /**
   * Export queue state for persistence
   */
  public exportState(): any {
    const state: any = {
      queues: {},
      deadLetterQueue: this.deadLetterQueue,
      timestamp: Date.now()
    };

    for (const [chainId, queue] of this.queues.entries()) {
      state.queues[chainId] = {
        items: queue.items,
        processing: queue.processing,
        failed: queue.failed
      };
    }

    return state;
  }

  /**
   * Import queue state from persistence
   */
  public importState(state: any): void {
    if (!state || !state.queues) return;

    for (const [chainId, queueData] of Object.entries(state.queues) as any) {
      const queue = this.queues.get(Number(chainId));
      if (queue && queueData) {
        queue.items = queueData.items || [];
        queue.processing = [];
        queue.failed = queueData.failed || [];

        // Re-queue items that were processing
        if (queueData.processing) {
          for (const item of queueData.processing) {
            item.status = 'pending';
            item.metadata.updatedAt = Date.now();
            queue.items.push(item);
          }
        }
      }
    }

    if (state.deadLetterQueue) {
      this.deadLetterQueue = state.deadLetterQueue;
    }
  }
}

// Singleton instance
let queueInstance: ProductionQueue | null = null;

export function getProductionQueue(): ProductionQueue {
  if (!queueInstance) {
    queueInstance = new ProductionQueue();
  }
  return queueInstance;
}

export default ProductionQueue;
