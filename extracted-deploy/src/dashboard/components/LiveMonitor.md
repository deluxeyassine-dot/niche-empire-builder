# LiveMonitor Component

Real-time activity monitoring dashboard for the Niche Empire Builder with live updates, agent status tracking, and system health monitoring.

## Features

### 1. **Live Activity Feed**
- Real-time activity stream with auto-scroll
- Activity type icons and color coding
- Timestamp with relative time display
- Agent attribution for each activity
- Duration tracking for tasks
- Success/failure indicators

### 2. **Activity Types**
- **Agent Start** ▶️ - Agent initialized
- **Agent Stop** ⏹️ - Agent stopped
- **Agent Complete** ✅ - Agent finished task
- **Agent Error** ❌ - Agent encountered error
- **Generation Start** 🚀 - Content generation started
- **Generation Complete** ✨ - Content generation finished
- **API Call** 🔌 - External API request
- **API Error** ⚠️ - API request failed
- **System Info** ℹ️ - System information
- **System Warning** ⚠️ - System warning
- **System Error** 🔥 - Critical system error
- **User Action** 👤 - User interaction

### 3. **Real-Time Updates**
- WebSocket connection for live data
- Automatic reconnection on disconnect
- Latency monitoring
- Connection status indicator
- Configurable update interval

### 4. **Agent Status Indicators**
- Live status display (Running, Idle, Error, Paused)
- Uptime tracking
- Task completion counter
- Current task display
- Pulse animation for active agents

### 5. **System Health Monitor**
- Overall system status (Healthy, Degraded, Critical)
- CPU usage monitoring
- Memory usage tracking
- API call statistics (total, successful, failed)
- WebSocket connection health
- Agent status summary
- System uptime display

### 6. **Interactive Controls**
- Pause/Resume activity feed
- Clear all activities
- Activity type filtering
- Auto-scroll toggle
- Connection status display

### 7. **Activity Filtering**
- Filter by activity type
- Activity count badges
- Quick filter buttons
- "Clear filter" option

## Usage

### Basic Usage

```tsx
import { LiveMonitor } from './components/LiveMonitor';

function App() {
  return <LiveMonitor />;
}
```

### With WebSocket Connection

```tsx
import { LiveMonitor } from './components/LiveMonitor';

function App() {
  return (
    <LiveMonitor
      websocketUrl="ws://localhost:3000/live"
      maxActivities={150}
      autoScroll={true}
      onActivityReceived={(activity) => {
        console.log('New activity:', activity);
      }}
      onConnectionChange={(connected) => {
        console.log('WebSocket status:', connected);
      }}
    />
  );
}
```

### Custom Configuration

```tsx
import { LiveMonitor } from './components/LiveMonitor';

function App() {
  const handleActivity = (activity: Activity) => {
    // Log to analytics
    console.log('Activity received:', activity);

    // Send to monitoring service
    if (activity.type === 'agent-error') {
      sendToErrorTracking(activity);
    }
  };

  const handleConnection = (connected: boolean) => {
    if (!connected) {
      showNotification('Connection lost. Attempting to reconnect...');
    }
  };

  return (
    <LiveMonitor
      websocketUrl="wss://api.example.com/live"
      maxActivities={200}
      autoScroll={true}
      onActivityReceived={handleActivity}
      onConnectionChange={handleConnection}
    />
  );
}
```

## Props

### LiveMonitorProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `websocketUrl` | `string` | `undefined` | WebSocket server URL for live updates |
| `maxActivities` | `number` | `100` | Maximum number of activities to keep in memory |
| `autoScroll` | `boolean` | `true` | Auto-scroll to latest activity |
| `onActivityReceived` | `(activity: Activity) => void` | `undefined` | Callback when new activity is received |
| `onConnectionChange` | `(connected: boolean) => void` | `undefined` | Callback when connection status changes |

## TypeScript Interfaces

### Activity

```typescript
interface Activity {
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
```

### AgentStatus

```typescript
interface AgentStatus {
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
```

### SystemHealth

```typescript
interface SystemHealth {
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
```

## WebSocket Message Format

### Activity Message

```json
{
  "type": "activity",
  "activity": {
    "id": "activity-123",
    "timestamp": "2024-01-15T10:30:00Z",
    "type": "generation-complete",
    "agentId": "brand",
    "agentName": "Brand Generator",
    "message": "Generated brand name: TechVista Pro",
    "duration": 2500,
    "success": true
  }
}
```

### Agent Update Message

```json
{
  "type": "agent-update",
  "agentId": "product",
  "updates": {
    "status": "running",
    "currentTask": "Creating product specifications...",
    "tasksProcessed": 129
  }
}
```

### Health Update Message

```json
{
  "type": "health-update",
  "health": {
    "cpu": 52,
    "memory": 68,
    "apiCalls": {
      "total": 1235,
      "successful": 1199,
      "failed": 36
    }
  }
}
```

## Demo Mode

When no `websocketUrl` is provided, the component runs in **demo mode** with:
- Mock data generation every 2 seconds
- Simulated agent updates
- Random system health fluctuations
- Simulated WebSocket connection

This is perfect for testing and development.

## Features Deep Dive

### Auto-Scroll Behavior

The component automatically scrolls to the latest activity when:
- New activity is received
- Feed is not paused
- `autoScroll` prop is enabled

You can temporarily disable auto-scroll by:
- Scrolling up manually in the feed
- Pausing the feed
- Setting `autoScroll={false}`

### Activity Highlighting

New activities are highlighted with:
- Blue background color
- Pulse animation
- 1-second highlight duration
- Smooth fade-out transition

### System Health Monitoring

**Status Levels:**
- **Healthy** 🟢 - All systems operational
- **Degraded** 🟡 - Some performance issues
- **Critical** 🔴 - Severe problems detected

**Metrics:**
- **CPU Usage**: Color-coded progress bar (green < 60%, yellow < 80%, red ≥ 80%)
- **Memory Usage**: Same color-coding as CPU
- **API Success Rate**: Percentage of successful API calls
- **WebSocket Latency**: Real-time connection latency in milliseconds

### Agent Status Display

Each agent shows:
- Icon and name
- Current status with pulse animation (running agents)
- Uptime since last restart
- Task completion count
- Current task description

### Performance Optimization

The component is optimized for performance:
- Maximum activity limit prevents memory overflow
- Efficient React hooks (useCallback, useMemo where beneficial)
- Smooth CSS transitions instead of JavaScript animations
- Virtual scrolling for large activity lists (future enhancement)

## Styling

The component uses Tailwind CSS with:
- Responsive grid layout
- Smooth transitions and animations
- Color-coded status indicators
- Custom pulse animations
- Hover effects for interactivity

### Color Scheme

- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)
- **Info**: Blue (#3b82f6)
- **Active**: Green with pulse
- **Idle**: Gray (#6b7280)

## Advanced Usage

### Custom Activity Types

You can extend the activity types:

```typescript
type CustomActivityType = ActivityType | 'custom-event';

// Send custom activity via WebSocket
ws.send(JSON.stringify({
  type: 'activity',
  activity: {
    id: 'custom-1',
    timestamp: new Date(),
    type: 'custom-event',
    message: 'Custom event occurred',
    success: true
  }
}));
```

### Analytics Integration

Track activities in your analytics system:

```tsx
<LiveMonitor
  onActivityReceived={(activity) => {
    // Send to Google Analytics
    gtag('event', activity.type, {
      event_category: 'Agent Activity',
      event_label: activity.agentName,
      value: activity.duration
    });

    // Send to custom analytics
    analytics.track('Activity', {
      type: activity.type,
      agent: activity.agentId,
      success: activity.success
    });
  }}
/>
```

### Error Monitoring

Monitor errors and send alerts:

```tsx
<LiveMonitor
  onActivityReceived={(activity) => {
    if (activity.type.includes('error')) {
      // Send to error monitoring service
      Sentry.captureException(new Error(activity.message), {
        extra: {
          agentId: activity.agentId,
          details: activity.details
        }
      });

      // Send notification
      notificationService.send({
        title: 'Agent Error',
        message: activity.message,
        severity: 'high'
      });
    }
  }}
/>
```

### Export Activity Log

Export activities for analysis:

```tsx
const exportActivities = (activities: Activity[]) => {
  const csv = activities.map(a =>
    `${a.timestamp},${a.type},${a.agentName},${a.message},${a.success}`
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `activities-${Date.now()}.csv`;
  a.click();
};
```

## Server-Side WebSocket Implementation

Example Node.js WebSocket server:

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send activity updates
  const sendActivity = (activity) => {
    ws.send(JSON.stringify({
      type: 'activity',
      activity
    }));
  };

  // Example: Send activity when agent completes task
  agentEmitter.on('task-complete', (data) => {
    sendActivity({
      id: `activity-${Date.now()}`,
      timestamp: new Date(),
      type: 'generation-complete',
      agentId: data.agentId,
      agentName: data.agentName,
      message: data.message,
      duration: data.duration,
      success: true
    });
  });

  // Send health updates every 5 seconds
  const healthInterval = setInterval(() => {
    ws.send(JSON.stringify({
      type: 'health-update',
      health: getSystemHealth()
    }));
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(healthInterval);
  });
});
```

## Best Practices

1. **Connection Management**: Implement reconnection logic with exponential backoff
2. **Error Handling**: Always handle WebSocket errors gracefully
3. **Memory Management**: Set appropriate `maxActivities` limit
4. **Performance**: Use throttling for high-frequency updates
5. **Security**: Use WSS (secure WebSocket) in production
6. **Monitoring**: Track connection quality and latency
7. **User Experience**: Provide clear feedback on connection status

## Troubleshooting

### Activities Not Appearing

- Check WebSocket connection status
- Verify message format matches expected structure
- Check browser console for errors
- Ensure feed is not paused

### High Memory Usage

- Reduce `maxActivities` limit
- Clear activities periodically
- Check for memory leaks in event handlers

### Connection Issues

- Verify WebSocket URL is correct
- Check CORS settings on server
- Ensure WebSocket server is running
- Check network connectivity

## License

MIT
