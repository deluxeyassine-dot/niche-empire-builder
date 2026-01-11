# MetricsDisplay Component

Beautiful React component for displaying empire performance metrics with interactive charts and analytics.

## Features

- 📊 **Multiple Chart Types**: Line charts, bar charts, pie charts
- 📈 **Time Range Selection**: 7d, 30d, 90d, 1y, all time
- 🎯 **Summary Cards**: Revenue, traffic, conversion, engagement
- 📉 **Trend Indicators**: Up/down arrows with percentage changes
- 🎨 **Beautiful Visualizations**: Custom SVG charts with Tailwind CSS
- 📤 **Export Options**: CSV and JSON export
- 📱 **Fully Responsive**: Works on all devices
- ⚡ **Interactive**: Hover effects and smooth animations
- 🔄 **Comparison Mode**: Compare multiple empires (optional)

## Quick Start

### Standalone Usage

Open `test-metrics-display.html` in your browser:

```bash
cd src/dashboard
open test-metrics-display.html  # macOS
start test-metrics-display.html # Windows
```

### React Integration

```typescript
import { MetricsDisplay } from './components/MetricsDisplay';

function App() {
  const metrics = {
    id: 'emp-001',
    name: 'SmartHome Pro',
    timeSeries: [...], // Your time series data
    summary: {...},    // Summary metrics
    channels: [...],   // Traffic sources
    topProducts: [...]  // Top products
  };

  const handleExport = (format) => {
    console.log('Exporting as', format);
  };

  return (
    <MetricsDisplay
      empireMetrics={metrics}
      onExport={handleExport}
    />
  );
}
```

## Data Structures

### EmpireMetrics

```typescript
interface EmpireMetrics {
  id: string;
  name: string;
  timeSeries: TimeSeriesData[];
  summary: MetricsSummary;
  channels: ChannelMetrics[];
  topProducts: ProductPerformance[];
}
```

### TimeSeriesData

```typescript
interface TimeSeriesData {
  date: string;           // ISO date format: "2024-02-20"
  revenue: number;        // Daily revenue
  orders: number;         // Number of orders
  traffic: number;        // Visitor count
  customers: number;      // New customers
  conversion: number;     // Conversion rate (%)
  engagement: number;     // Engagement score (0-100)
}
```

### MetricsSummary

```typescript
interface MetricsSummary {
  revenue: {
    current: number;      // Current period total
    previous: number;     // Previous period total
    change: number;       // Percentage change
    trend: 'up' | 'down' | 'stable';
  };
  traffic: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  conversion: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  engagement: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}
```

### ChannelMetrics

```typescript
interface ChannelMetrics {
  channel: string;        // Channel name
  traffic: number;        // Visitors from channel
  revenue: number;        // Revenue from channel
  conversion: number;     // Channel conversion rate (%)
  color: string;          // Hex color for visualization
}
```

### ProductPerformance

```typescript
interface ProductPerformance {
  name: string;           // Product name
  revenue: number;        // Total revenue
  units: number;          // Units sold
  growth: number;         // Growth percentage
}
```

## Component Props

### MetricsDisplayProps

| Prop | Type | Description |
|------|------|-------------|
| `empireMetrics` | `EmpireMetrics \| EmpireMetrics[]` | Single empire or array for comparison |
| `onExport` | `(format: 'csv' \| 'pdf' \| 'json') => void` | Export callback (optional) |

## Features in Detail

### 1. Summary Cards

Four key metric cards showing:
- **Revenue**: Total revenue with trend indicator
- **Traffic**: Total visitors with trend indicator
- **Conversion**: Conversion rate with trend indicator
- **Engagement**: Engagement score with trend indicator

Each card displays:
- Current value
- Percentage change from previous period
- Up/down trend arrow
- Average value per day

### 2. Time Range Selection

Filter data by time period:
- **Last 7 Days**: Weekly view
- **Last 30 Days**: Monthly view (default)
- **Last 90 Days**: Quarterly view
- **Last Year**: Annual view
- **All Time**: Complete history

### 3. Chart Types

Switch between different metric views:
- **Revenue**: Line chart showing revenue trend
- **Traffic**: Line chart showing visitor trend
- **Conversion**: Line chart showing conversion rate
- **Engagement**: Line chart showing engagement score
- **Overview**: Split view with multiple metrics

### 4. Traffic Sources

**Pie Chart**: Visual breakdown of traffic sources
- Organic Search
- Paid Ads
- Social Media
- Email
- Direct

**Legend**: Shows percentage and absolute values for each source

### 5. Revenue by Channel

**Bar Chart**: Horizontal bars showing revenue per channel
- Color-coded bars
- Value labels
- Hover effects
- Sorted by revenue

### 6. Channel Performance Table

Detailed table with:
- Channel name with color indicator
- Traffic count
- Revenue amount
- Conversion rate
- Average order value

Sortable and filterable.

### 7. Top Performing Products

List of top 5 products showing:
- Product rank (#1, #2, etc.)
- Product name
- Units sold
- Total revenue
- Growth percentage with trend arrow

### 8. Export Functionality

Export data in multiple formats:
- **CSV**: Comma-separated values for spreadsheets
- **JSON**: Structured data for APIs
- **PDF**: Coming soon (requires custom implementation)

Default export includes:
- All time series data
- Selected time range
- Empire name and ID

## Chart Components

### SimpleLineChart

Custom SVG line chart with:
- Area fill (gradient)
- Connecting lines
- Data points (circles)
- Grid lines
- Y-axis labels
- Responsive scaling

**Props**:
- `data`: Time series data
- `dataKey`: Which metric to display
- `color`: Line and fill color
- `height`: Chart height (default: 300px)

### SimpleBarChart

Horizontal bar chart with:
- Color-coded bars
- Value labels
- Percentage-based widths
- Hover effects

**Props**:
- `data`: Array of {name, value, color}
- `height`: Chart height (default: 300px)

### SimplePieChart

Circular pie chart with:
- Color-coded slices
- Percentage labels
- Interactive legend
- Hover effects

**Props**:
- `data`: Array of {name, value, color}
- `size`: Chart diameter (default: 200px)

## Example Usage

### Basic Implementation

```typescript
import { MetricsDisplay, EmpireMetrics } from './components/MetricsDisplay';

const metrics: EmpireMetrics = {
  id: 'emp-001',
  name: 'SmartHome Pro',
  timeSeries: [
    {
      date: '2024-02-01',
      revenue: 850,
      orders: 19,
      traffic: 2100,
      customers: 6,
      conversion: 3.2,
      engagement: 68
    },
    // ... more days
  ],
  summary: {
    revenue: {
      current: 45780,
      previous: 38650,
      change: 18.4,
      trend: 'up'
    },
    // ... other metrics
  },
  channels: [
    {
      channel: 'Organic Search',
      traffic: 6200,
      revenue: 18500,
      conversion: 3.5,
      color: '#10b981'
    },
    // ... more channels
  ],
  topProducts: [
    {
      name: 'Smart Thermostat Pro',
      revenue: 12400,
      units: 124,
      growth: 24.5
    },
    // ... more products
  ]
};

<MetricsDisplay empireMetrics={metrics} />
```

### With Export Handler

```typescript
const handleExport = (format: 'csv' | 'pdf' | 'json') => {
  if (format === 'csv') {
    // Custom CSV export logic
    const csv = generateCSV(metrics);
    downloadFile(csv, 'metrics.csv');
  } else if (format === 'json') {
    // Custom JSON export logic
    const json = JSON.stringify(metrics, null, 2);
    downloadFile(json, 'metrics.json');
  }
};

<MetricsDisplay
  empireMetrics={metrics}
  onExport={handleExport}
/>
```

### With API Data

```typescript
import { useState, useEffect } from 'react';
import { MetricsDisplay } from './components/MetricsDisplay';

function MetricsPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/empires/emp-001/metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return <MetricsDisplay empireMetrics={metrics} />;
}
```

### Comparison Mode (Multiple Empires)

```typescript
const empires = [empire1Metrics, empire2Metrics, empire3Metrics];

<MetricsDisplay empireMetrics={empires} />
```

## Styling and Customization

### Colors

Default color scheme:
- **Revenue**: Green (#10b981)
- **Traffic**: Blue (#3b82f6)
- **Conversion**: Purple (#8b5cf6)
- **Engagement**: Amber (#f59e0b)

### Chart Colors

Customize channel colors:
```typescript
const customChannels = [
  { channel: 'SEO', traffic: 5000, revenue: 15000, conversion: 3.0, color: '#22c55e' },
  { channel: 'PPC', traffic: 3000, revenue: 12000, conversion: 4.0, color: '#3b82f6' },
  // ... more
];
```

### Custom Styling

Override Tailwind classes:
```typescript
// Modify card backgrounds
className="bg-gradient-to-br from-blue-50 to-purple-50"

// Change chart heights
<SimpleLineChart height={400} />

// Adjust spacing
className="space-y-8"
```

## Responsive Design

### Mobile (< 640px)
- Single column layouts
- Stacked cards
- Simplified charts
- Touch-friendly controls

### Tablet (640px - 1024px)
- 2-column grids
- Medium chart sizes
- Side-by-side comparisons

### Desktop (> 1024px)
- 4-column summary cards
- Large charts
- Full table views
- Optimal spacing

## Performance

- **Efficient Rendering**: useMemo for computed values
- **Lazy Loading**: Charts render on demand
- **Optimized SVG**: Minimal DOM nodes
- **Smooth Animations**: CSS transforms
- **Data Filtering**: Client-side time range filtering

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels for charts
- ✅ Keyboard navigation
- ✅ Color contrast compliance
- ✅ Screen reader descriptions

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11 (not supported)

## Data Generation

The component includes a mock data generator:

```typescript
const generateMockData = (days: number): TimeSeriesData[]
```

Generates realistic time series data with:
- Seasonal patterns
- Growth trends
- Random variations
- Proper date formatting

## Export Formats

### CSV Export

Includes columns:
- Date
- Revenue
- Orders
- Traffic
- Customers
- Conversion
- Engagement

### JSON Export

Complete metrics object with:
- Empire metadata
- Time series data
- Summary statistics
- Channel breakdowns
- Product performance

## Future Enhancements

- [ ] PDF export with charts
- [ ] Real-time data updates
- [ ] Custom date range picker
- [ ] Comparison overlays
- [ ] Drill-down capabilities
- [ ] Annotations and markers
- [ ] Goal tracking
- [ ] Forecasting
- [ ] Alert thresholds
- [ ] Customizable dashboards

## License

Part of the Niche Empire Builder toolkit.
