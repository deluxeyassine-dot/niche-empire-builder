# Dashboard Components Overview

This directory contains React components for the Niche Empire Builder dashboard.

## Components

### 1. EmpireCreator.tsx

**Purpose**: Create new niche empires through a guided wizard interface

**Size**: ~45KB (900+ lines)

**Features**:
- 4-step wizard (Select → Configure → Generate → Complete)
- Quick start templates (E-commerce, SaaS, Content, Service)
- Comprehensive configuration options
- Real-time progress tracking
- Success summary with download options
- Beautiful Tailwind CSS design
- Fully responsive

**Test File**: `index-standalone.html`

**Key Interfaces**:
- `EmpireConfig`: Configuration for new empire
- `GenerationStep`: Progress tracking
- `QuickStartTemplate`: Pre-configured templates
- `GeneratedAssets`: Output files summary

**Usage**:
```typescript
import { EmpireCreator } from './components/EmpireCreator';

<EmpireCreator />
```

---

### 2. EmpireManager.tsx

**Purpose**: Manage all created empires in a comprehensive dashboard

**Size**: ~46KB (1300+ lines)

**Features**:
- Empire list with status indicators
- Advanced filtering (status, health, search)
- Sorting (name, revenue, customers, date)
- Grid and list view modes
- Performance metrics and health scores
- Bulk actions (pause, resume, archive, delete, sync)
- Individual empire controls
- Sync functionality with progress indication
- Delete confirmation modals
- Statistics dashboard (total empires, revenue, customers)
- Beautiful Tailwind CSS design
- Fully responsive

**Test File**: `test-empire-manager.html`

**Documentation**: `components/EmpireManager.md`

**Key Interfaces**:
- `Empire`: Empire data structure
- `FilterOptions`: Filter and sort configuration
- `BulkAction`: Bulk operation definition
- `EmpireManagerProps`: Component props

**Usage**:
```typescript
import { EmpireManager } from './components/EmpireManager';

<EmpireManager
  empires={myEmpires}
  onEmpireClick={(empire) => viewDetails(empire)}
  onEmpireEdit={(empire) => editEmpire(empire)}
  onEmpireDelete={(id) => deleteEmpire(id)}
  onEmpirePause={(id) => pauseEmpire(id)}
  onEmpireResume={(id) => resumeEmpire(id)}
  onEmpireSync={(id) => syncEmpire(id)}
  onBulkAction={(action) => handleBulk(action)}
  onCreateNew={() => navigate('/create')}
/>
```

---

### 3. MetricsDisplay.tsx

**Purpose**: Display empire performance metrics with interactive charts

**Size**: ~35KB (900+ lines)

**Features**:
- Multiple chart types (line, bar, pie)
- Time range selection (7d, 30d, 90d, 1y, all)
- Summary cards (revenue, traffic, conversion, engagement)
- Trend indicators with percentage changes
- Traffic sources visualization
- Revenue by channel analysis
- Channel performance table
- Top performing products
- Export to CSV and JSON
- Beautiful custom SVG charts
- Fully responsive

**Test File**: `test-metrics-display.html`

**Documentation**: `components/MetricsDisplay.md`

**Key Interfaces**:
- `EmpireMetrics`: Complete metrics data
- `TimeSeriesData`: Daily performance data
- `MetricsSummary`: Summary statistics
- `ChannelMetrics`: Traffic source data
- `ProductPerformance`: Product stats

**Usage**:
```typescript
import { MetricsDisplay } from './components/MetricsDisplay';

<MetricsDisplay
  empireMetrics={metrics}
  onExport={(format) => handleExport(format)}
/>
```

**Chart Types**:
- **SimpleLineChart**: Time series trends with area fill
- **SimpleBarChart**: Horizontal bars for comparisons
- **SimplePieChart**: Circular breakdown with legend

**Time Ranges**:
- Last 7 Days
- Last 30 Days (default)
- Last 90 Days
- Last Year
- All Time

**Export Formats**:
- CSV (time series data)
- JSON (complete metrics object)

---

## Test Files

### index-standalone.html
- **Component**: EmpireCreator
- **Size**: 1.6KB
- **Purpose**: Standalone demo of empire creation
- **Dependencies**: CDN-loaded React, ReactDOM, Babel, Tailwind
- **Usage**: Open directly in browser, no build required

### test-empire-manager.html
- **Component**: EmpireManager
- **Size**: 8.4KB
- **Purpose**: Standalone demo of empire management
- **Features**: Full state management, mock data, all callbacks
- **Dependencies**: CDN-loaded React, ReactDOM, Babel, Tailwind
- **Usage**: Open directly in browser, no build required

### test-full-dashboard.html
- **Component**: Both (EmpireCreator + EmpireManager)
- **Size**: 14KB
- **Purpose**: Complete dashboard with navigation
- **Features**:
  - View switching between Manager and Creator
  - Shared state between components
  - Navigation header with view toggle
  - Empire creation flow with automatic addition to manager
  - Full feature demonstration
- **Dependencies**: CDN-loaded React, ReactDOM, Babel, Tailwind
- **Usage**: Open directly in browser, no build required

### test-metrics-display.html
- **Component**: MetricsDisplay
- **Size**: 7KB
- **Purpose**: Standalone demo of metrics and analytics
- **Features**: Interactive charts, time range selection, export functionality
- **Dependencies**: CDN-loaded React, ReactDOM, Babel, Tailwind
- **Usage**: Open directly in browser, no build required

---

## Sub-Components

### EmpireCard (in EmpireManager.tsx)
- **Purpose**: Grid view card for individual empire
- **Features**: Metrics, status, health bar, action buttons
- **Used in**: EmpireManager grid view

### EmpireRow (in EmpireManager.tsx)
- **Purpose**: Table row for individual empire
- **Features**: Compact display, sortable columns, actions
- **Used in**: EmpireManager list view

### DeleteConfirmModal (in EmpireManager.tsx)
- **Purpose**: Confirmation dialog for empire deletion
- **Features**: Warning message, cancel/confirm buttons
- **Used in**: EmpireManager delete flow

### SimpleLineChart (in MetricsDisplay.tsx)
- **Purpose**: Time series line chart visualization
- **Features**: Area fill, grid lines, data points, y-axis labels
- **Used in**: MetricsDisplay for trend charts

### SimpleBarChart (in MetricsDisplay.tsx)
- **Purpose**: Horizontal bar chart for comparisons
- **Features**: Color-coded bars, value labels, hover effects
- **Used in**: MetricsDisplay for channel revenue

### SimplePieChart (in MetricsDisplay.tsx)
- **Purpose**: Circular pie chart with legend
- **Features**: Color-coded slices, percentages, interactive legend
- **Used in**: MetricsDisplay for traffic sources

---

## Data Structures

### Empire
```typescript
interface Empire {
  id: string;
  name: string;
  niche: string;
  status: 'active' | 'paused' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  metrics: {
    revenue: number;
    customers: number;
    products: number;
    orders: number;
    traffic: number;
    conversionRate: number;
  };
  performance: {
    health: 'excellent' | 'good' | 'fair' | 'poor';
    score: number; // 0-100
    trend: 'up' | 'down' | 'stable';
  };
  branding: {
    primaryColor: string;
    icon?: string;
  };
  lastSync?: Date;
  syncStatus?: 'synced' | 'syncing' | 'error';
}
```

### TimeSeriesData (MetricsDisplay)
```typescript
interface TimeSeriesData {
  date: string;           // ISO date: "2024-02-20"
  revenue: number;        // Daily revenue
  orders: number;         // Number of orders
  traffic: number;        // Visitor count
  customers: number;      // New customers
  conversion: number;     // Conversion rate (%)
  engagement: number;     // Engagement score (0-100)
}
```

### EmpireMetrics (MetricsDisplay)
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

### EmpireConfig
```typescript
interface EmpireConfig {
  niche: string;
  businessName: string;
  targetAudience: string;
  products: {
    enabled: boolean;
    types: ('physical' | 'digital' | 'service')[];
    count: number;
  };
  content: {
    enabled: boolean;
    types: ('blog' | 'social' | 'video' | 'email' | 'ads' | 'landing')[];
  };
  website: {
    enabled: boolean;
    template: 'default' | 'minimal' | 'professional';
  };
  email: {
    enabled: boolean;
    sequences: ('welcome' | 'abandoned-cart' | 'promotional')[];
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}
```

---

## Workflow Integration

### Typical Use Case

```typescript
import React, { useState } from 'react';
import { EmpireCreator } from './components/EmpireCreator';
import { EmpireManager } from './components/EmpireManager';

function Dashboard() {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [empires, setEmpires] = useState<Empire[]>([]);

  const handleCreateNew = () => {
    setView('create');
  };

  const handleCreationComplete = (config: EmpireConfig) => {
    // Create new empire from config
    const newEmpire = createEmpireFromConfig(config);
    setEmpires(prev => [newEmpire, ...prev]);
    setView('list');
  };

  if (view === 'create') {
    return (
      <div>
        <button onClick={() => setView('list')}>← Back</button>
        <EmpireCreator />
      </div>
    );
  }

  return (
    <EmpireManager
      empires={empires}
      onCreateNew={handleCreateNew}
      onEmpireDelete={(id) => setEmpires(prev => prev.filter(e => e.id !== id))}
      // ... other handlers
    />
  );
}
```

---

## Styling

All components use **Tailwind CSS** for styling:

- **Color Palette**: Blue/Purple gradients for primary actions
- **Status Colors**: Green (active), Amber (paused), Gray (draft), Red (archived)
- **Health Colors**: Green (excellent), Blue (good), Amber (fair), Red (poor)
- **Spacing**: Consistent padding and margins
- **Typography**: System fonts, bold headers, regular body text
- **Shadows**: Subtle card shadows, enhanced on hover
- **Animations**: Smooth transitions, pulsing indicators, spin loaders

---

## Responsive Design

### Mobile (< 640px)
- Single column layouts
- Stacked controls
- Full-width buttons
- Simplified metrics

### Tablet (640px - 1024px)
- 2-column grids
- Side-by-side controls
- Medium spacing

### Desktop (> 1024px)
- 3-column grids
- All controls in single row
- Large spacing
- Optimal viewing experience

---

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast (WCAG AA)
- ✅ Screen reader support

---

## Performance

- **Memoization**: `useMemo` for computed values
- **Efficient Updates**: Minimal re-renders
- **Lazy Loading**: Can be extended with virtual scrolling
- **Optimized Animations**: CSS transforms for smooth UI

---

## Files Summary

```
components/
├── EmpireCreator.tsx       # Empire creation wizard (45KB)
├── EmpireManager.tsx       # Empire management dashboard (46KB)
├── EmpireManager.md        # EmpireManager documentation (13KB)
├── MetricsDisplay.tsx      # Metrics and analytics (35KB)
└── MetricsDisplay.md       # MetricsDisplay documentation (16KB)

Test Files:
├── index-standalone.html        # EmpireCreator test (1.6KB)
├── test-empire-manager.html     # EmpireManager test (8.4KB)
├── test-metrics-display.html    # MetricsDisplay test (7KB)
└── test-full-dashboard.html     # Complete dashboard test (14KB)
```

---

## Dependencies

**Runtime**:
- React 18+
- ReactDOM 18+

**Development**:
- TypeScript 5+
- Tailwind CSS 3+
- Vite 4+ (optional, for build)

**For Standalone HTML**:
- All dependencies loaded via CDN
- No build step required
- Works in any modern browser

---

## Quick Start

### Option 1: Test Individual Components

```bash
# Test EmpireCreator
open index-standalone.html

# Test EmpireManager
open test-empire-manager.html

# Test Full Dashboard
open test-full-dashboard.html
```

### Option 2: Build with Vite

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

### Option 3: Integrate into Your App

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom tailwindcss
```

```typescript
import { EmpireCreator } from './dashboard/components/EmpireCreator';
import { EmpireManager } from './dashboard/components/EmpireManager';

// Use in your app
```

---

## License

Part of the Niche Empire Builder toolkit.
