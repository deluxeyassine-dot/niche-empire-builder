# AgentControls Component

Beautiful React component for controlling and monitoring individual AI agents in the Niche Empire Builder.

## Features

### 1. **Agent Management**
- Start/Stop/Pause/Resume individual agents
- Real-time status indicators
- Progress tracking with visual progress bars
- Current task display

### 2. **Status Monitoring**
- **Idle** - Agent is ready but not running
- **Running** - Agent is actively processing tasks
- **Paused** - Agent temporarily stopped, can be resumed
- **Completed** - Agent finished all tasks successfully
- **Error** - Agent encountered an error
- **Stopped** - Agent manually stopped by user

### 3. **Performance Metrics**
Each agent displays:
- **Success Rate** - Percentage of successful task completions
- **Completed Tasks** - Progress (completed/total)
- **Average Time** - Average execution time per task
- **Total Runs** - Lifetime execution count

### 4. **Configuration Options**
- **Enabled** - Turn agent on/off
- **Auto Restart** - Automatically restart on error
- **Concurrent Tasks** - Allow parallel task execution
- **Max Retries** - Number of retry attempts on failure (0-10)
- **Timeout** - Maximum execution time (60-1800 seconds)
- **Priority** - Task priority level (low/medium/high)
- **Custom Settings** - Agent-specific configuration

### 5. **Activity Logs**
- Real-time log viewer with timestamps
- Log levels: INFO, SUCCESS, WARNING, ERROR
- Detailed error information
- Auto-scroll to latest logs
- Clear logs functionality

### 6. **Overall Dashboard**
- Total agents count
- Running agents count
- Idle agents count
- Error count
- Average success rate across all agents

### 7. **Filtering & Sorting**
- Filter by status: All, Running, Idle, Error, Completed
- Sort by: Name, Status, Success Rate

## Supported Agents

1. **Brand Generator** 🎨
   - Generates brand names, taglines, logos, brand guidelines
   - Color: Purple (#8b5cf6)

2. **Product Generator** 📦
   - Creates product ideas, specifications, features, pricing
   - Color: Blue (#3b82f6)

3. **Content Generator** 📝
   - Generates blog posts, articles, product descriptions
   - Color: Green (#10b981)

4. **Social Media Generator** 📱
   - Creates social posts, hashtags, content calendars
   - Color: Amber (#f59e0b)

5. **Website Generator** 🌐
   - Builds complete websites with pages and components
   - Color: Pink (#ec4899)

## Usage

### Basic Usage

```tsx
import { AgentControls } from './components/AgentControls';

function App() {
  return <AgentControls />;
}
```

### With Custom Handlers

```tsx
import { AgentControls } from './components/AgentControls';

function App() {
  const handleAgentStart = (agentId: string) => {
    console.log(`Starting agent: ${agentId}`);
    // Your logic here
  };

  const handleAgentStop = (agentId: string) => {
    console.log(`Stopping agent: ${agentId}`);
    // Your logic here
  };

  const handleConfigChange = (agentId: string, config: AgentConfig) => {
    console.log(`Config updated for ${agentId}:`, config);
    // Save configuration
  };

  return (
    <AgentControls
      onAgentStart={handleAgentStart}
      onAgentStop={handleAgentStop}
      onAgentPause={(id) => console.log('Paused:', id)}
      onAgentResume={(id) => console.log('Resumed:', id)}
      onConfigChange={handleConfigChange}
      onClearLogs={(id) => console.log('Logs cleared:', id)}
    />
  );
}
```

### With Custom Agents Data

```tsx
import { AgentControls, Agent } from './components/AgentControls';

const customAgents: Agent[] = [
  {
    id: 'custom-agent-1',
    type: 'brand',
    name: 'Custom Brand Agent',
    description: 'My custom agent',
    icon: '🚀',
    color: '#ff6b6b',
    status: 'idle',
    progress: 0,
    config: {
      enabled: true,
      autoRestart: false,
      maxRetries: 3,
      timeout: 300,
      priority: 'high',
      concurrent: false
    },
    metrics: {
      tasksCompleted: 0,
      tasksTotal: 0,
      successRate: 0,
      averageExecutionTime: 0,
      totalRuns: 0
    },
    logs: []
  }
];

function App() {
  return <AgentControls agents={customAgents} />;
}
```

## Props

### AgentControlsProps

| Prop | Type | Description |
|------|------|-------------|
| `agents` | `Agent[]` | Array of agents to display (optional, uses defaults) |
| `onAgentStart` | `(agentId: string) => void` | Called when agent starts |
| `onAgentStop` | `(agentId: string) => void` | Called when agent stops |
| `onAgentPause` | `(agentId: string) => void` | Called when agent pauses |
| `onAgentResume` | `(agentId: string) => void` | Called when agent resumes |
| `onConfigChange` | `(agentId: string, config: AgentConfig) => void` | Called when configuration changes |
| `onClearLogs` | `(agentId: string) => void` | Called when logs are cleared |

## TypeScript Interfaces

### Agent

```typescript
interface Agent {
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
```

### AgentConfig

```typescript
interface AgentConfig {
  enabled: boolean;
  autoRestart: boolean;
  maxRetries: number;
  timeout: number;
  priority: 'low' | 'medium' | 'high';
  concurrent: boolean;
  customSettings?: Record<string, any>;
}
```

### AgentMetrics

```typescript
interface AgentMetrics {
  tasksCompleted: number;
  tasksTotal: number;
  successRate: number;
  averageExecutionTime: number;
  lastRun?: Date;
  totalRuns: number;
}
```

### LogEntry

```typescript
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}
```

## Styling

The component uses Tailwind CSS for styling. All colors, spacing, and animations are customizable through Tailwind classes.

### Color Scheme

- **Primary Actions**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray (#6b7280)

## Advanced Features

### Auto-Scroll Logs
Logs automatically scroll to the latest entry when new logs are added.

### Progress Animation
Progress bars animate smoothly with CSS transitions.

### Status Color Coding
Each agent card has a colored left border matching the agent type.

### Responsive Design
Fully responsive layout that works on mobile, tablet, and desktop.

### Error Handling
Built-in error states with detailed error messages and retry capabilities.

## Examples

### Start All Agents

```tsx
const startAllAgents = () => {
  agents.forEach(agent => {
    if (agent.status === 'idle') {
      onAgentStart(agent.id);
    }
  });
};
```

### Stop All Running Agents

```tsx
const stopAllAgents = () => {
  agents.forEach(agent => {
    if (agent.status === 'running') {
      onAgentStop(agent.id);
    }
  });
};
```

### Filter Agents by Type

```tsx
const brandAgents = agents.filter(a => a.type === 'brand');
```

## Best Practices

1. **Use Meaningful Agent Names**: Give agents descriptive names that indicate their purpose
2. **Set Appropriate Timeouts**: Configure timeouts based on expected task duration
3. **Enable Auto-Restart for Critical Agents**: Use auto-restart for agents that must maintain uptime
4. **Monitor Success Rates**: Keep an eye on success rates to identify problematic agents
5. **Review Logs Regularly**: Check logs to understand agent behavior and catch issues early
6. **Configure Retries**: Set appropriate retry counts based on task reliability
7. **Use Priority Levels**: Assign priorities to ensure critical agents get resources first

## Integration with Backend

This component is designed to work with your backend agent system. Connect the event handlers to your API:

```tsx
const handleAgentStart = async (agentId: string) => {
  try {
    await fetch(`/api/agents/${agentId}/start`, { method: 'POST' });
    // Update agent state
  } catch (error) {
    console.error('Failed to start agent:', error);
  }
};
```

## Live Updates

For real-time updates, connect to your WebSocket or polling system:

```tsx
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3000/agents');

  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    // Update agent state
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === update.agentId
          ? { ...agent, ...update }
          : agent
      )
    );
  };

  return () => ws.close();
}, []);
```

## License

MIT
