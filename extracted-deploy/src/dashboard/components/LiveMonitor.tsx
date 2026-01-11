/**
 * LiveMonitor - React Component for Real-Time Activity Monitoring
 *
 * Provides live activity feed, agent status, system health monitoring,
 * and WebSocket connection for real-time updates
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ActivityType =
  | 'agent-start'
  | 'agent-stop'
  | 'agent-complete'
  | 'agent-error'
  | 'generation-start'
  | 'generation-complete'
  | 'api-call'
  | 'api-error'
  | 'system-info'
  | 'system-warning'
  | 'system-error'
  | 'user-action';

export interface Activity {
  id: string;
  timestamp: Date;
  type: ActivityType;
  agentId?: string;
  agentName?: string;
  message: string;
  details?: any;
  duration?: number;
  success?: boolean;
}

export interface AgentStatus {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  uptime: number;
  lastActivity?: Date;
  tasksProcessed: number;
  currentTask?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  cpu: number;
  memory: number;
  apiCalls: {
    total: number;
    successful: number;
    failed: number;
    rate: number;
  };
  websocket: {
    connected: boolean;
    latency: number;
    reconnects: number;
  };
  agents: {
    total: number;
    running: number;
    idle: number;
    errors: number;
  };
}

export interface LiveMonitorProps {
  websocketUrl?: string;
  maxActivities?: number;
  autoScroll?: boolean;
  onActivityReceived?: (activity: Activity) => void;
  onConnectionChange?: (connected: boolean) => void;
}

// ============================================================================
// Mock Data & Utilities
// ============================================================================

const MOCK_AGENTS: AgentStatus[] = [
  {
    id: 'brand',
    name: 'Brand Generator',
    icon: '🎨',
    color: '#8b5cf6',
    status: 'running',
    uptime: 3600,
    tasksProcessed: 45,
    currentTask: 'Generating brand guidelines...'
  },
  {
    id: 'product',
    name: 'Product Generator',
    icon: '📦',
    color: '#3b82f6',
    status: 'running',
    uptime: 7200,
    tasksProcessed: 128,
    currentTask: 'Creating product specifications...'
  },
  {
    id: 'content',
    name: 'Content Generator',
    icon: '📝',
    color: '#10b981',
    status: 'idle',
    uptime: 1800,
    tasksProcessed: 234
  },
  {
    id: 'social',
    name: 'Social Media',
    icon: '📱',
    color: '#f59e0b',
    status: 'running',
    uptime: 5400,
    tasksProcessed: 567,
    currentTask: 'Scheduling posts...'
  },
  {
    id: 'website',
    name: 'Website Generator',
    icon: '🌐',
    color: '#ec4899',
    status: 'error',
    uptime: 900,
    tasksProcessed: 12
  }
];

const generateMockActivity = (): Activity => {
  const types: ActivityType[] = [
    'generation-complete',
    'api-call',
    'agent-start',
    'generation-start',
    'system-info'
  ];

  const messages = [
    'Generated brand name: "TechVista Pro"',
    'Created 5 product variations',
    'Blog post "10 Ways to..." completed',
    'Social media post scheduled',
    'API call to Gemini Pro completed',
    'Image generation started',
    'SEO optimization complete',
    'Email sequence created',
    'Product description generated',
    'Landing page template ready'
  ];

  const agents = MOCK_AGENTS;
  const type = types[Math.floor(Math.random() * types.length)];
  const agent = agents[Math.floor(Math.random() * agents.length)];

  return {
    id: `activity-${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    type,
    agentId: agent.id,
    agentName: agent.name,
    message: messages[Math.floor(Math.random() * messages.length)],
    duration: Math.random() * 5000,
    success: Math.random() > 0.1
  };
};

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

const formatUptime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const getRelativeTime = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// ============================================================================
// Sub-Components
// ============================================================================

const ActivityTypeIcon: React.FC<{ type: ActivityType }> = ({ type }) => {
  const configs: Record<ActivityType, { icon: string; color: string; bg: string }> = {
    'agent-start': { icon: '▶️', color: 'text-blue-600', bg: 'bg-blue-100' },
    'agent-stop': { icon: '⏹️', color: 'text-gray-600', bg: 'bg-gray-100' },
    'agent-complete': { icon: '✅', color: 'text-green-600', bg: 'bg-green-100' },
    'agent-error': { icon: '❌', color: 'text-red-600', bg: 'bg-red-100' },
    'generation-start': { icon: '🚀', color: 'text-purple-600', bg: 'bg-purple-100' },
    'generation-complete': { icon: '✨', color: 'text-green-600', bg: 'bg-green-100' },
    'api-call': { icon: '🔌', color: 'text-blue-600', bg: 'bg-blue-100' },
    'api-error': { icon: '⚠️', color: 'text-red-600', bg: 'bg-red-100' },
    'system-info': { icon: 'ℹ️', color: 'text-blue-600', bg: 'bg-blue-100' },
    'system-warning': { icon: '⚠️', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    'system-error': { icon: '🔥', color: 'text-red-600', bg: 'bg-red-100' },
    'user-action': { icon: '👤', color: 'text-purple-600', bg: 'bg-purple-100' }
  };

  const config = configs[type];

  return (
    <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
      <span className="text-sm">{config.icon}</span>
    </div>
  );
};

const ActivityItem: React.FC<{ activity: Activity; isNew?: boolean }> = ({ activity, isNew }) => {
  return (
    <div
      className={`flex items-start space-x-3 p-3 rounded-lg border transition-all duration-300 ${
        isNew
          ? 'bg-blue-50 border-blue-200 animate-pulse-once'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <ActivityTypeIcon type={activity.type} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{activity.message}</p>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {getRelativeTime(activity.timestamp)}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs text-gray-600">
          {activity.agentName && (
            <span className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>{activity.agentName}</span>
            </span>
          )}
          {activity.duration && (
            <span className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{formatDuration(activity.duration)}</span>
            </span>
          )}
          {activity.success !== undefined && (
            <span className={`flex items-center space-x-1 ${activity.success ? 'text-green-600' : 'text-red-600'}`}>
              {activity.success ? '✓' : '✗'}
              <span>{activity.success ? 'Success' : 'Failed'}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const AgentStatusCard: React.FC<{ agent: AgentStatus }> = ({ agent }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${agent.color}20` }}
          >
            {agent.icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{agent.name}</h4>
            <p className="text-xs text-gray-600">{formatUptime(agent.uptime)} uptime</p>
          </div>
        </div>
        <div className="relative">
          {agent.status === 'running' && (
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
          {agent.status === 'idle' && (
            <span className="inline-flex rounded-full h-3 w-3 bg-gray-400"></span>
          )}
          {agent.status === 'error' && (
            <span className="inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          )}
          {agent.status === 'paused' && (
            <span className="inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          )}
        </div>
      </div>

      {agent.currentTask && (
        <p className="text-xs text-gray-600 mb-2 truncate">{agent.currentTask}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">Tasks: {agent.tasksProcessed}</span>
        <span className={`px-2 py-0.5 rounded-full font-semibold ${
          agent.status === 'running' ? 'bg-green-100 text-green-700' :
          agent.status === 'idle' ? 'bg-gray-100 text-gray-700' :
          agent.status === 'error' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {agent.status.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

const SystemHealthPanel: React.FC<{ health: SystemHealth }> = ({ health }) => {
  const getStatusColor = () => {
    if (health.status === 'healthy') return 'text-green-600';
    if (health.status === 'degraded') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBg = () => {
    if (health.status === 'healthy') return 'bg-green-100';
    if (health.status === 'degraded') return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">System Health</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBg()} ${getStatusColor()}`}>
          {health.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* CPU Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">CPU</span>
            <span className="text-sm font-semibold text-gray-900">{health.cpu}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                health.cpu > 80 ? 'bg-red-500' : health.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${health.cpu}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Memory</span>
            <span className="text-sm font-semibold text-gray-900">{health.memory}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                health.memory > 80 ? 'bg-red-500' : health.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${health.memory}%` }}
            />
          </div>
        </div>
      </div>

      {/* API Calls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">API Success Rate</span>
          <span className="text-sm font-semibold text-gray-900">
            {((health.apiCalls.successful / health.apiCalls.total) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-gray-50 rounded p-2">
            <p className="text-gray-600">Total</p>
            <p className="font-semibold text-gray-900">{health.apiCalls.total}</p>
          </div>
          <div className="bg-green-50 rounded p-2">
            <p className="text-green-600">Success</p>
            <p className="font-semibold text-green-700">{health.apiCalls.successful}</p>
          </div>
          <div className="bg-red-50 rounded p-2">
            <p className="text-red-600">Failed</p>
            <p className="font-semibold text-red-700">{health.apiCalls.failed}</p>
          </div>
        </div>
      </div>

      {/* WebSocket Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">WebSocket</span>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex h-2 w-2 rounded-full ${health.websocket.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-xs font-semibold text-gray-900">
              {health.websocket.latency}ms
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-600">
          Reconnects: {health.websocket.reconnects}
        </div>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-blue-50 rounded p-2 text-center">
          <p className="text-blue-600 mb-1">Total</p>
          <p className="font-bold text-blue-700 text-lg">{health.agents.total}</p>
        </div>
        <div className="bg-green-50 rounded p-2 text-center">
          <p className="text-green-600 mb-1">Running</p>
          <p className="font-bold text-green-700 text-lg">{health.agents.running}</p>
        </div>
        <div className="bg-gray-50 rounded p-2 text-center">
          <p className="text-gray-600 mb-1">Idle</p>
          <p className="font-bold text-gray-700 text-lg">{health.agents.idle}</p>
        </div>
        <div className="bg-red-50 rounded p-2 text-center">
          <p className="text-red-600 mb-1">Errors</p>
          <p className="font-bold text-red-700 text-lg">{health.agents.errors}</p>
        </div>
      </div>

      {/* System Uptime */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">System Uptime</span>
          <span className="font-semibold text-gray-900">{formatUptime(health.uptime)}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const LiveMonitor: React.FC<LiveMonitorProps> = ({
  websocketUrl,
  maxActivities = 100,
  autoScroll = true,
  onActivityReceived,
  onConnectionChange
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [agents, setAgents] = useState<AgentStatus[]>(MOCK_AGENTS);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 3600,
    cpu: 45,
    memory: 62,
    apiCalls: {
      total: 1234,
      successful: 1198,
      failed: 36,
      rate: 12.5
    },
    websocket: {
      connected: true,
      latency: 23,
      reconnects: 0
    },
    agents: {
      total: 5,
      running: 3,
      idle: 1,
      errors: 1
    }
  });

  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<'all' | ActivityType>('all');
  const [wsConnected, setWsConnected] = useState(false);
  const [newActivityId, setNewActivityId] = useState<string | null>(null);

  const activitiesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (autoScroll && !isPaused && activitiesEndRef.current) {
      activitiesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoScroll, isPaused]);

  useEffect(() => {
    scrollToBottom();
  }, [activities, scrollToBottom]);

  // Add new activity
  const addActivity = useCallback((activity: Activity) => {
    setActivities(prev => {
      const updated = [activity, ...prev].slice(0, maxActivities);
      return updated;
    });
    setNewActivityId(activity.id);
    setTimeout(() => setNewActivityId(null), 1000);
    onActivityReceived?.(activity);
  }, [maxActivities, onActivityReceived]);

  // Mock WebSocket connection (for demo)
  useEffect(() => {
    if (websocketUrl) {
      // Real WebSocket implementation
      try {
        const ws = new WebSocket(websocketUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected');
          setWsConnected(true);
          setSystemHealth(prev => ({
            ...prev,
            websocket: { ...prev.websocket, connected: true }
          }));
          onConnectionChange?.(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'activity') {
              addActivity(data.activity);
            } else if (data.type === 'agent-update') {
              setAgents(prev => prev.map(a =>
                a.id === data.agentId ? { ...a, ...data.updates } : a
              ));
            } else if (data.type === 'health-update') {
              setSystemHealth(prev => ({ ...prev, ...data.health }));
            }
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsConnected(false);
          setSystemHealth(prev => ({
            ...prev,
            websocket: { ...prev.websocket, connected: false }
          }));
          onConnectionChange?.(false);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setWsConnected(false);
          setSystemHealth(prev => ({
            ...prev,
            websocket: {
              ...prev.websocket,
              connected: false,
              reconnects: prev.websocket.reconnects + 1
            }
          }));
          onConnectionChange?.(false);
        };

        return () => {
          ws.close();
        };
      } catch (err) {
        console.error('Failed to create WebSocket:', err);
      }
    } else {
      // Mock data generation for demo
      setWsConnected(true);
      setSystemHealth(prev => ({
        ...prev,
        websocket: { ...prev.websocket, connected: true }
      }));

      const interval = setInterval(() => {
        if (!isPaused) {
          const activity = generateMockActivity();
          addActivity(activity);

          // Random system health updates
          if (Math.random() > 0.7) {
            setSystemHealth(prev => ({
              ...prev,
              cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 10)),
              memory: Math.min(100, Math.max(0, prev.memory + (Math.random() - 0.5) * 5)),
              uptime: prev.uptime + 1,
              apiCalls: {
                ...prev.apiCalls,
                total: prev.apiCalls.total + 1,
                successful: prev.apiCalls.successful + (Math.random() > 0.1 ? 1 : 0),
                failed: prev.apiCalls.failed + (Math.random() > 0.9 ? 1 : 0)
              },
              websocket: {
                ...prev.websocket,
                latency: Math.floor(Math.random() * 50) + 10
              }
            }));
          }

          // Random agent updates
          if (Math.random() > 0.8) {
            const randomAgent = agents[Math.floor(Math.random() * agents.length)];
            setAgents(prev => prev.map(a =>
              a.id === randomAgent.id
                ? { ...a, tasksProcessed: a.tasksProcessed + 1 }
                : a
            ));
          }
        }
      }, 2000); // New activity every 2 seconds

      return () => clearInterval(interval);
    }
  }, [websocketUrl, isPaused, addActivity, onConnectionChange, agents]);

  // Filter activities
  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.type === filter);

  // Activity type counts
  const activityCounts = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<ActivityType, number>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <span>Live Monitor</span>
                {wsConnected && (
                  <span className="flex items-center space-x-2 text-sm font-normal text-green-600">
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>Live</span>
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">Real-time activity monitoring and system health</p>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  isPaused
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isPaused ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Pause</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActivities([])}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <p className="text-sm text-green-600 mb-1">Completions</p>
              <p className="text-2xl font-bold text-green-700">
                {(activityCounts['generation-complete'] || 0) + (activityCounts['agent-complete'] || 0)}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <p className="text-sm text-blue-600 mb-1">API Calls</p>
              <p className="text-2xl font-bold text-blue-700">{activityCounts['api-call'] || 0}</p>
            </div>
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <p className="text-sm text-red-600 mb-1">Errors</p>
              <p className="text-2xl font-bold text-red-700">
                {(activityCounts['agent-error'] || 0) + (activityCounts['api-error'] || 0) + (activityCounts['system-error'] || 0)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
              <p className="text-sm text-purple-600 mb-1">Active Agents</p>
              <p className="text-2xl font-bold text-purple-700">
                {agents.filter(a => a.status === 'running').length}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Activity Feed */}
          <div className="lg:col-span-2 space-y-6">

            {/* Activity Filter */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 overflow-x-auto">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</span>
                {(['all', 'generation-complete', 'api-call', 'agent-start', 'agent-error', 'system-info'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      filter === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'All' : type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    {type !== 'all' && activityCounts[type] > 0 && (
                      <span className="ml-1 opacity-75">({activityCounts[type]})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Activity Feed</h2>
                <span className="text-sm text-gray-600">{filteredActivities.length} activities</span>
              </div>

              <div className="p-4 max-h-[600px] overflow-y-auto space-y-2">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-600">No activities to display</p>
                    {filter !== 'all' && (
                      <button
                        onClick={() => setFilter('all')}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {filteredActivities.map((activity) => (
                      <ActivityItem
                        key={activity.id}
                        activity={activity}
                        isNew={activity.id === newActivityId}
                      />
                    ))}
                    <div ref={activitiesEndRef} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: System Info */}
          <div className="space-y-6">

            {/* System Health */}
            <SystemHealthPanel health={systemHealth} />

            {/* Active Agents */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Active Agents</h3>
              <div className="space-y-3">
                {agents.map((agent) => (
                  <AgentStatusCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>

            {/* Connection Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Connection Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">WebSocket</span>
                  <span className={`flex items-center space-x-1 font-semibold ${wsConnected ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`inline-flex h-2 w-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span>{wsConnected ? 'Connected' : 'Disconnected'}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Feed Status</span>
                  <span className={`font-semibold ${isPaused ? 'text-yellow-600' : 'text-green-600'}`}>
                    {isPaused ? 'Paused' : 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Auto-scroll</span>
                  <span className={`font-semibold ${autoScroll ? 'text-green-600' : 'text-gray-600'}`}>
                    {autoScroll ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveMonitor;
