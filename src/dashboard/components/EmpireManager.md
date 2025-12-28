# EmpireManager Component

Beautiful React component for managing all created niche empires with comprehensive filtering, bulk actions, and performance tracking.

## Features

- 📊 **Empire Overview**: View all empires with key metrics and performance scores
- 🎯 **Advanced Filtering**: Filter by status, health, search terms, and sort options
- 📈 **Performance Tracking**: Visual health scores and trend indicators
- 🔄 **Sync Management**: Individual and bulk sync operations
- ⚡ **Bulk Actions**: Pause, resume, archive, or delete multiple empires
- 📱 **Responsive Views**: Switch between grid and list layouts
- ✨ **Beautiful UI**: Modern design with Tailwind CSS
- 🎨 **Status Indicators**: Color-coded status badges and health bars

## Quick Start

### Standalone Usage

Open `test-empire-manager.html` in your browser:

```bash
cd src/dashboard
open test-empire-manager.html  # macOS
start test-empire-manager.html # Windows
```

### React Integration

```typescript
import { EmpireManager } from './components/EmpireManager';

function App() {
  const handleEmpireClick = (empire) => {
    console.log('Viewing empire:', empire);
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action);
  };

  return (
    <EmpireManager
      empires={myEmpires}
      onEmpireClick={handleEmpireClick}
      onEmpireEdit={(empire) => console.log('Edit', empire)}
      onEmpireDelete={(id) => console.log('Delete', id)}
      onEmpirePause={(id) => console.log('Pause', id)}
      onEmpireResume={(id) => console.log('Resume', id)}
      onEmpireSync={(id) => console.log('Sync', id)}
      onBulkAction={handleBulkAction}
      onCreateNew={() => console.log('Create new')}
    />
  );
}
```

## Data Structures

### Empire Interface

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

### Filter Options

```typescript
interface FilterOptions {
  status: 'all' | 'active' | 'paused' | 'draft' | 'archived';
  health: 'all' | 'excellent' | 'good' | 'fair' | 'poor';
  search: string;
  sortBy: 'name' | 'revenue' | 'customers' | 'created' | 'updated';
  sortOrder: 'asc' | 'desc';
}
```

### Bulk Actions

```typescript
interface BulkAction {
  type: 'pause' | 'resume' | 'archive' | 'delete' | 'sync';
  empireIds: string[];
}
```

## Component Props

### EmpireManagerProps

| Prop | Type | Description |
|------|------|-------------|
| `empires` | `Empire[]` | Array of empire objects (optional, uses mock data if not provided) |
| `onEmpireClick` | `(empire: Empire) => void` | Called when an empire card/row is clicked |
| `onEmpireEdit` | `(empire: Empire) => void` | Called when edit button is clicked |
| `onEmpireDelete` | `(empireId: string) => void` | Called when delete is confirmed |
| `onEmpirePause` | `(empireId: string) => void` | Called when pause button is clicked |
| `onEmpireResume` | `(empireId: string) => void` | Called when resume button is clicked |
| `onEmpireSync` | `(empireId: string) => void` | Called when sync button is clicked |
| `onBulkAction` | `(action: BulkAction) => void` | Called when bulk action is performed |
| `onCreateNew` | `() => void` | Called when "Create New Empire" is clicked |

## Features in Detail

### 1. Statistics Dashboard

Top section shows aggregate statistics:
- **Total Empires**: Count with active/paused breakdown
- **Total Revenue**: Sum across all empires
- **Total Customers**: Combined customer base
- **Average Performance**: Mean health score

### 2. Advanced Filtering

**Search Bar:**
- Search by empire name or niche
- Real-time filtering as you type

**Status Filter:**
- All Status
- Active (green)
- Paused (amber)
- Draft (gray)
- Archived (red)

**Health Filter:**
- All Health
- Excellent (90-100)
- Good (70-89)
- Fair (50-69)
- Poor (<50)

**Sort Options:**
- Last Updated (default)
- Date Created
- Name (alphabetical)
- Revenue (highest first)
- Customers (most first)

**Sort Direction:**
- Ascending ↑
- Descending ↓

### 3. View Modes

**Grid View:**
- 3-column responsive grid
- Large empire cards with metrics
- Visual health bars
- Quick action buttons

**List View:**
- Sortable table format
- Compact information display
- Bulk selection checkboxes
- Action buttons in last column

### 4. Empire Cards (Grid View)

Each card displays:
- **Header**: Checkbox, icon, name, niche
- **Status Badge**: Color-coded status indicator
- **Sync Status**: Last sync time or syncing indicator
- **Metrics Grid**: Revenue, customers, products, conversion rate
- **Performance Bar**: Visual health score with trend arrow
- **Actions**: Pause/resume, sync, edit, delete buttons

### 5. Empire Rows (List View)

Each row shows:
- Checkbox for bulk selection
- Icon and name/niche
- Status badge
- Revenue (formatted in thousands)
- Customer count
- Performance bar and score
- Last updated date
- Action buttons

### 6. Bulk Actions

Select multiple empires and perform actions:
- **Sync Selected**: Refresh all selected empires
- **Pause Selected**: Pause all selected active empires
- **Archive Selected**: Move to archived status
- **Delete Selected**: Delete all (with confirmation)

**Selection Controls:**
- Select/deselect individual empires
- Select all filtered empires (header checkbox)
- Clear selection button
- Selection count indicator

### 7. Sync Functionality

**Individual Sync:**
- Click sync button on any empire
- Shows spinning animation during sync
- Updates last sync timestamp
- Changes sync status indicator

**Sync All:**
- Top-right "Sync All" button
- Syncs all active empires simultaneously
- Batch operation for efficiency

### 8. Status Management

**Active Empires:**
- Can be paused
- Show pause button (⏸)
- Included in "Sync All"

**Paused Empires:**
- Can be resumed
- Show play button (▶)
- Not included in "Sync All"

**Draft Empires:**
- Incomplete/in-progress
- No pause/resume actions
- Can be edited or deleted

**Archived Empires:**
- Historical record
- Limited actions available
- Can be restored by changing status

### 9. Delete Confirmation

When deleting an empire:
- Modal dialog appears
- Shows empire name
- Requires explicit confirmation
- Warning about permanent action
- Cancel or confirm options

## Example Usage

### Basic Implementation

```typescript
import React, { useState } from 'react';
import { EmpireManager, Empire } from './components/EmpireManager';

function MyApp() {
  const [empires, setEmpires] = useState<Empire[]>([
    {
      id: 'emp-001',
      name: 'SmartHome Pro',
      niche: 'Smart Home Products',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      metrics: {
        revenue: 45780,
        customers: 342,
        products: 12,
        orders: 1256,
        traffic: 15420,
        conversionRate: 3.2
      },
      performance: {
        health: 'excellent',
        score: 92,
        trend: 'up'
      },
      branding: {
        primaryColor: '#2563eb',
        icon: '🏠'
      },
      lastSync: new Date(),
      syncStatus: 'synced'
    }
    // ... more empires
  ]);

  const handleDelete = (empireId: string) => {
    setEmpires(prev => prev.filter(e => e.id !== empireId));
  };

  const handlePause = (empireId: string) => {
    setEmpires(prev => prev.map(e =>
      e.id === empireId ? { ...e, status: 'paused' as const } : e
    ));
  };

  const handleResume = (empireId: string) => {
    setEmpires(prev => prev.map(e =>
      e.id === empireId ? { ...e, status: 'active' as const } : e
    ));
  };

  return (
    <EmpireManager
      empires={empires}
      onEmpireDelete={handleDelete}
      onEmpirePause={handlePause}
      onEmpireResume={handleResume}
    />
  );
}
```

### With API Integration

```typescript
import React, { useState, useEffect } from 'react';
import { EmpireManager, Empire } from './components/EmpireManager';

function AppWithAPI() {
  const [empires, setEmpires] = useState<Empire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmpires();
  }, []);

  const fetchEmpires = async () => {
    const response = await fetch('/api/empires');
    const data = await response.json();
    setEmpires(data);
    setLoading(false);
  };

  const handleSync = async (empireId: string) => {
    await fetch(`/api/empires/${empireId}/sync`, { method: 'POST' });
    await fetchEmpires(); // Refresh data
  };

  const handleBulkAction = async (action) => {
    await fetch('/api/empires/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action)
    });
    await fetchEmpires(); // Refresh data
  };

  if (loading) return <div>Loading...</div>;

  return (
    <EmpireManager
      empires={empires}
      onEmpireSync={handleSync}
      onBulkAction={handleBulkAction}
    />
  );
}
```

### With Routing

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmpireManager, Empire } from './components/EmpireManager';

function AppWithRouting() {
  const navigate = useNavigate();

  const handleEmpireClick = (empire: Empire) => {
    navigate(`/empires/${empire.id}`);
  };

  const handleEmpireEdit = (empire: Empire) => {
    navigate(`/empires/${empire.id}/edit`);
  };

  const handleCreateNew = () => {
    navigate('/empires/new');
  };

  return (
    <EmpireManager
      onEmpireClick={handleEmpireClick}
      onEmpireEdit={handleEmpireEdit}
      onCreateNew={handleCreateNew}
    />
  );
}
```

## Styling and Customization

### Status Colors

Default color scheme:
- **Active**: Green (`bg-green-100`, `text-green-800`)
- **Paused**: Amber (`bg-amber-100`, `text-amber-800`)
- **Draft**: Gray (`bg-gray-100`, `text-gray-800`)
- **Archived**: Red (`bg-red-100`, `text-red-800`)

### Health Colors

- **Excellent**: Green (`text-green-600`, `bg-green-500`)
- **Good**: Blue (`text-blue-600`, `bg-blue-500`)
- **Fair**: Amber (`text-amber-600`, `bg-amber-500`)
- **Poor**: Red (`text-red-600`, `bg-red-500`)

### Custom Styling

Override Tailwind classes:

```typescript
// Modify status colors in EmpireCard component
const statusColors = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  paused: 'bg-orange-100 text-orange-800 border-orange-200',
  // ...
};
```

## Responsive Behavior

### Mobile (< 640px)
- Single column grid
- Stacked filter controls
- Full-width cards
- Simplified metrics display

### Tablet (640px - 1024px)
- 2-column grid
- Side-by-side filters
- Medium card spacing

### Desktop (> 1024px)
- 3-column grid
- All filters in single row
- Large card spacing
- Sticky header options

## Accessibility

- ✅ Semantic HTML elements
- ✅ ARIA labels for icons
- ✅ Keyboard navigation support
- ✅ Focus indicators on all interactive elements
- ✅ Color contrast compliance (WCAG AA)
- ✅ Screen reader friendly

## Performance

- **Memoization**: Uses `useMemo` for filtered/sorted data
- **Efficient Updates**: Only re-renders changed components
- **Lazy Loading**: Can be extended with virtual scrolling
- **Optimized Animations**: CSS transforms for smooth UI

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11 (not supported)

## Mock Data

The component includes 5 sample empires for testing:
1. **SmartHome Pro** - Excellent health, active
2. **TaskFlow Pro** - Good health, active
3. **FitLife Plus** - Fair health, paused
4. **Home Services Hub** - Good health, active
5. **EcoBeauty** - Poor health, draft

## Future Enhancements

Potential additions:
- [ ] Export empire data (CSV, JSON)
- [ ] Import empires from file
- [ ] Advanced analytics dashboard
- [ ] Real-time collaboration
- [ ] Notification system
- [ ] Activity timeline
- [ ] Performance charts
- [ ] Custom views and layouts
- [ ] Saved filter presets

## License

Part of the Niche Empire Builder toolkit.
