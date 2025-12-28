/**
 * AgentControls - React Component for Managing Individual Agents
 *
 * Provides controls for BrandGenerator, ProductGenerator, ContentGenerator, etc.
 * with start/stop buttons, status indicators, configuration, logs, and error handling
 */

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type AgentType =
  | 'brand'
  | 'product'
  | 'content'
  | 'social-media'
  | 'website'
  | 'email'
  | 'seo';

export type AgentStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'error'
  | 'stopped';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

export interface AgentMetrics {
  tasksCompleted: number;
  tasksTotal: number;
  successRate: number;
  averageExecutionTime: number;
  lastRun?: Date;
  totalRuns: number;
}

export interface AgentConfig {
  enabled: boolean;
  autoRestart: boolean;
  maxRetries: number;
  timeout: number; // in seconds
  priority: 'low' | 'medium' | 'high';
  concurrent: boolean;
  customSettings?: Record<string, any>;
}

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: AgentStatus;
  progress: number;
  currentTask?: string;
  config: AgentConfig;
  metrics: AgentMetrics;
  logs: LogEntry[];
}

interface AgentControlsProps {
  agents?: Agent[];
  onAgentStart?: (agentId: string) => void;
  onAgentStop?: (agentId: string) => void;
  onAgentPause?: (agentId: string) => void;
  onAgentResume?: (agentId: string) => void;
  onConfigChange?: (agentId: string, config: AgentConfig) => void;
  onClearLogs?: (agentId: string) => void;
}

// ============================================================================
// Mock Data
// ============================================================================

const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'agent-brand',
    type: 'brand',
    name: 'Brand Generator',
    description: 'Generates brand names, taglines, logos, and brand guidelines',
    icon: '🎨',
    color: '#8b5cf6',
    status: 'idle',
    progress: 0,
    config: {
      enabled: true,
      autoRestart: false,
      maxRetries: 3,
      timeout: 300,
      priority: 'high',
      concurrent: false,
      customSettings: {
        style: 'modern',
        includeLogoConcepts: true
      }
    },
    metrics: {
      tasksCompleted: 45,
      tasksTotal: 50,
      successRate: 90,
      averageExecutionTime: 12.5,
      lastRun: new Date(Date.now() - 3600000),
      totalRuns: 50
    },
    logs: [
      { id: '1', timestamp: new Date(Date.now() - 120000), level: 'info', message: 'Agent initialized successfully' },
      { id: '2', timestamp: new Date(Date.now() - 60000), level: 'success', message: 'Generated brand name: "TechVista Pro"' },
      { id: '3', timestamp: new Date(Date.now() - 30000), level: 'info', message: 'Creating brand guidelines...' }
    ]
  },
  {
    id: 'agent-product',
    type: 'product',
    name: 'Product Generator',
    description: 'Creates product ideas, specifications, features, and pricing',
    icon: '📦',
    color: '#3b82f6',
    status: 'running',
    progress: 67,
    currentTask: 'Generating product specifications...',
    config: {
      enabled: true,
      autoRestart: true,
      maxRetries: 5,
      timeout: 600,
      priority: 'high',
      concurrent: true,
      customSettings: {
        priceRange: 'mid-range',
        productCount: 10
      }
    },
    metrics: {
      tasksCompleted: 128,
      tasksTotal: 150,
      successRate: 85.3,
      averageExecutionTime: 18.2,
      lastRun: new Date(),
      totalRuns: 150
    },
    logs: [
      { id: '1', timestamp: new Date(Date.now() - 180000), level: 'info', message: 'Starting product generation' },
      { id: '2', timestamp: new Date(Date.now() - 120000), level: 'success', message: 'Generated 5 product ideas' },
      { id: '3', timestamp: new Date(Date.now() - 60000), level: 'info', message: 'Creating product specifications...' },
      { id: '4', timestamp: new Date(Date.now() - 10000), level: 'success', message: 'Product specs completed for "Smart Watch Pro"' }
    ]
  },
  {
    id: 'agent-content',
    type: 'content',
    name: 'Content Generator',
    description: 'Generates blog posts, articles, product descriptions, and more',
    icon: '📝',
    color: '#10b981',
    status: 'idle',
    progress: 0,
    config: {
      enabled: true,
      autoRestart: false,
      maxRetries: 3,
      timeout: 480,
      priority: 'medium',
      concurrent: true,
      customSettings: {
        contentTypes: ['blog', 'product-description'],
        tone: 'professional'
      }
    },
    metrics: {
      tasksCompleted: 234,
      tasksTotal: 250,
      successRate: 93.6,
      averageExecutionTime: 15.8,
      lastRun: new Date(Date.now() - 7200000),
      totalRuns: 250
    },
    logs: [
      { id: '1', timestamp: new Date(Date.now() - 7200000), level: 'success', message: 'Generated 10 blog post outlines' },
      { id: '2', timestamp: new Date(Date.now() - 7100000), level: 'info', message: 'Agent stopped by user' }
    ]
  },
  {
    id: 'agent-social',
    type: 'social-media',
    name: 'Social Media Generator',
    description: 'Creates social media posts, hashtags, and content calendars',
    icon: '📱',
    color: '#f59e0b',
    status: 'completed',
    progress: 100,
    config: {
      enabled: true,
      autoRestart: true,
      maxRetries: 2,
      timeout: 240,
      priority: 'medium',
      concurrent: true,
      customSettings: {
        platforms: ['instagram', 'twitter', 'linkedin'],
        postsPerDay: 3
      }
    },
    metrics: {
      tasksCompleted: 567,
      tasksTotal: 567,
      successRate: 100,
      averageExecutionTime: 8.3,
      lastRun: new Date(Date.now() - 600000),
      totalRuns: 567
    },
    logs: [
      { id: '1', timestamp: new Date(Date.now() - 900000), level: 'info', message: 'Starting social media generation' },
      { id: '2', timestamp: new Date(Date.now() - 700000), level: 'success', message: 'Created 30-day content calendar' },
      { id: '3', timestamp: new Date(Date.now() - 600000), level: 'success', message: 'All tasks completed successfully' }
    ]
  },
  {
    id: 'agent-website',
    type: 'website',
    name: 'Website Generator',
    description: 'Builds complete websites with pages, components, and assets',
    icon: '🌐',
    color: '#ec4899',
    status: 'error',
    progress: 42,
    currentTask: 'Building homepage components...',
    config: {
      enabled: true,
      autoRestart: false,
      maxRetries: 3,
      timeout: 900,
      priority: 'low',
      concurrent: false,
      customSettings: {
        template: 'professional',
        pages: ['home', 'products', 'about', 'contact']
      }
    },
    metrics: {
      tasksCompleted: 12,
      tasksTotal: 15,
      successRate: 80,
      averageExecutionTime: 45.6,
      lastRun: new Date(Date.now() - 300000),
      totalRuns: 15
    },
    logs: [
      { id: '1', timestamp: new Date(Date.now() - 400000), level: 'info', message: 'Starting website generation' },
      { id: '2', timestamp: new Date(Date.now() - 350000), level: 'success', message: 'Generated website structure' },
      { id: '3', timestamp: new Date(Date.now() - 300000), level: 'error', message: 'Failed to generate homepage: API rate limit exceeded', details: { code: 429 } }
    ]
  }
];

// ============================================================================
// Utility Components
// ============================================================================

const StatusBadge: React.FC<{ status: AgentStatus }> = ({ status }) => {
  const configs = {
    idle: { color: 'bg-gray-100 text-gray-700', icon: '⏸️', label: 'Idle' },
    running: { color: 'bg-blue-100 text-blue-700', icon: '▶️', label: 'Running' },
    paused: { color: 'bg-yellow-100 text-yellow-700', icon: '⏸️', label: 'Paused' },
    completed: { color: 'bg-green-100 text-green-700', icon: '✅', label: 'Completed' },
    error: { color: 'bg-red-100 text-red-700', icon: '❌', label: 'Error' },
    stopped: { color: 'bg-gray-100 text-gray-700', icon: '⏹️', label: 'Stopped' }
  };

  const config = configs[status];

  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

const ProgressBar: React.FC<{ progress: number; status: AgentStatus }> = ({ progress, status }) => {
  const getColor = () => {
    if (status === 'error') return 'bg-red-500';
    if (status === 'completed') return 'bg-green-500';
    if (status === 'running') return 'bg-blue-500';
    return 'bg-gray-300';
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full ${getColor()} transition-all duration-500 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const LogLevelBadge: React.FC<{ level: LogEntry['level'] }> = ({ level }) => {
  const configs = {
    info: { color: 'bg-blue-100 text-blue-700', label: 'INFO' },
    success: { color: 'bg-green-100 text-green-700', label: 'SUCCESS' },
    warning: { color: 'bg-yellow-100 text-yellow-700', label: 'WARNING' },
    error: { color: 'bg-red-100 text-red-700', label: 'ERROR' }
  };

  const config = configs[level];

  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-mono font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
};

// ============================================================================
// Agent Card Component
// ============================================================================

const AgentCard: React.FC<{
  agent: Agent;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onConfigChange: (config: AgentConfig) => void;
  onClearLogs: () => void;
}> = ({ agent, onStart, onStop, onPause, onResume, onConfigChange, onClearLogs }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [localConfig, setLocalConfig] = useState(agent.config);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showLogs && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [agent.logs, showLogs]);

  const handleConfigSave = () => {
    onConfigChange(localConfig);
    setShowConfig(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    return `${(seconds / 60).toFixed(1)}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6" style={{ borderLeft: `4px solid ${agent.color}` }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${agent.color}20` }}
            >
              {agent.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-600">{agent.description}</p>
            </div>
          </div>
          <StatusBadge status={agent.status} />
        </div>

        {/* Progress */}
        {agent.status === 'running' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{agent.currentTask || 'Processing...'}</span>
              <span className="text-sm font-semibold text-gray-900">{agent.progress}%</span>
            </div>
            <ProgressBar progress={agent.progress} status={agent.status} />
          </div>
        )}

        {/* Metrics Summary */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Success Rate</p>
            <p className="text-lg font-bold text-gray-900">{agent.metrics.successRate.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Completed</p>
            <p className="text-lg font-bold text-gray-900">{agent.metrics.tasksCompleted}/{agent.metrics.tasksTotal}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Avg Time</p>
            <p className="text-lg font-bold text-gray-900">{formatDuration(agent.metrics.averageExecutionTime)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Total Runs</p>
            <p className="text-lg font-bold text-gray-900">{agent.metrics.totalRuns}</p>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          {agent.status === 'idle' || agent.status === 'stopped' || agent.status === 'completed' || agent.status === 'error' ? (
            <button
              onClick={onStart}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>Start</span>
            </button>
          ) : agent.status === 'running' ? (
            <>
              <button
                onClick={onPause}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Pause</span>
              </button>
              <button
                onClick={onStop}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                <span>Stop</span>
              </button>
            </>
          ) : (
            <button
              onClick={onResume}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>Resume</span>
            </button>
          )}

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Config</span>
          </button>

          <button
            onClick={() => setShowLogs(!showLogs)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Logs</span>
            {agent.logs.length > 0 && (
              <span className="ml-1 bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {agent.logs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-900">Configuration</h4>
            <button
              onClick={() => setShowConfig(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Enabled Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enabled</label>
              <button
                onClick={() => setLocalConfig({ ...localConfig, enabled: !localConfig.enabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localConfig.enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Auto Restart */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Auto Restart on Error</label>
              <button
                onClick={() => setLocalConfig({ ...localConfig, autoRestart: !localConfig.autoRestart })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localConfig.autoRestart ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localConfig.autoRestart ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Concurrent Execution */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Allow Concurrent Tasks</label>
              <button
                onClick={() => setLocalConfig({ ...localConfig, concurrent: !localConfig.concurrent })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localConfig.concurrent ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localConfig.concurrent ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Max Retries */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Retries: {localConfig.maxRetries}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={localConfig.maxRetries}
                onChange={(e) => setLocalConfig({ ...localConfig, maxRetries: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Timeout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout: {localConfig.timeout}s
              </label>
              <input
                type="range"
                min="60"
                max="1800"
                step="60"
                value={localConfig.timeout}
                onChange={(e) => setLocalConfig({ ...localConfig, timeout: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={localConfig.priority}
                onChange={(e) => setLocalConfig({ ...localConfig, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="flex items-center space-x-2 pt-4">
              <button
                onClick={handleConfigSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Configuration
              </button>
              <button
                onClick={() => {
                  setLocalConfig(agent.config);
                  setShowConfig(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs Panel */}
      {showLogs && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-900">Activity Logs</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClearLogs}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear Logs
              </button>
              <button
                onClick={() => setShowLogs(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
            {agent.logs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No logs available</p>
            ) : (
              <div className="space-y-2">
                {agent.logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 pb-2 border-b border-gray-800">
                    <span className="text-gray-500 text-xs whitespace-nowrap pt-1">
                      {formatTime(log.timestamp)}
                    </span>
                    <LogLevelBadge level={log.level} />
                    <div className="flex-1">
                      <p className="text-gray-200">{log.message}</p>
                      {log.details && (
                        <pre className="text-xs text-gray-400 mt-1 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const AgentControls: React.FC<AgentControlsProps> = ({
  agents = DEFAULT_AGENTS,
  onAgentStart,
  onAgentStop,
  onAgentPause,
  onAgentResume,
  onConfigChange,
  onClearLogs
}) => {
  const [filter, setFilter] = useState<'all' | AgentStatus>('all');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'success'>('name');

  const filteredAgents = agents.filter(agent => {
    if (filter === 'all') return true;
    return agent.status === filter;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return b.metrics.successRate - a.metrics.successRate;
  });

  const statusCounts = agents.reduce((acc, agent) => {
    acc[agent.status] = (acc[agent.status] || 0) + 1;
    return acc;
  }, {} as Record<AgentStatus, number>);

  const overallMetrics = {
    totalAgents: agents.length,
    running: statusCounts.running || 0,
    idle: statusCounts.idle || 0,
    errors: statusCounts.error || 0,
    averageSuccess: agents.reduce((sum, a) => sum + a.metrics.successRate, 0) / agents.length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Controls</h1>
          <p className="text-gray-600">Manage and monitor all AI agents in your empire</p>
        </div>

        {/* Overall Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900">{overallMetrics.totalAgents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Running</p>
                <p className="text-2xl font-bold text-green-600">{overallMetrics.running}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Idle</p>
                <p className="text-2xl font-bold text-gray-600">{overallMetrics.idle}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">{overallMetrics.errors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Success</p>
                <p className="text-2xl font-bold text-purple-600">{overallMetrics.averageSuccess.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              {(['all', 'running', 'idle', 'error', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="status">Status</option>
                <option value="success">Success Rate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="space-y-6">
          {sortedAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onStart={() => onAgentStart?.(agent.id)}
              onStop={() => onAgentStop?.(agent.id)}
              onPause={() => onAgentPause?.(agent.id)}
              onResume={() => onAgentResume?.(agent.id)}
              onConfigChange={(config) => onConfigChange?.(agent.id, config)}
              onClearLogs={() => onClearLogs?.(agent.id)}
            />
          ))}
        </div>

        {sortedAgents.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg">No agents match the current filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentControls;
