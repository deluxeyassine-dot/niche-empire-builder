/**
 * EmpireManager - React Component for Managing Created Empires
 *
 * Comprehensive dashboard for viewing, filtering, and managing all niche empires
 */

import React, { useState, useEffect, useMemo } from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface Empire {
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

export interface FilterOptions {
  status: 'all' | 'active' | 'paused' | 'draft' | 'archived';
  health: 'all' | 'excellent' | 'good' | 'fair' | 'poor';
  search: string;
  sortBy: 'name' | 'revenue' | 'customers' | 'created' | 'updated';
  sortOrder: 'asc' | 'desc';
}

export interface BulkAction {
  type: 'pause' | 'resume' | 'archive' | 'delete' | 'sync';
  empireIds: string[];
}

interface EmpireManagerProps {
  empires?: Empire[];
  onEmpireClick?: (empire: Empire) => void;
  onEmpireEdit?: (empire: Empire) => void;
  onEmpireDelete?: (empireId: string) => void;
  onEmpirePause?: (empireId: string) => void;
  onEmpireResume?: (empireId: string) => void;
  onEmpireSync?: (empireId: string) => void;
  onBulkAction?: (action: BulkAction) => void;
  onCreateNew?: () => void;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_EMPIRES: Empire[] = [
  {
    id: 'emp-001',
    name: 'SmartHome Pro',
    niche: 'Smart Home Products',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
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
    lastSync: new Date('2024-02-20T10:30:00'),
    syncStatus: 'synced'
  },
  {
    id: 'emp-002',
    name: 'TaskFlow Pro',
    niche: 'Project Management',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-19'),
    metrics: {
      revenue: 28500,
      customers: 156,
      products: 3,
      orders: 478,
      traffic: 8920,
      conversionRate: 4.1
    },
    performance: {
      health: 'good',
      score: 85,
      trend: 'up'
    },
    branding: {
      primaryColor: '#7c3aed',
      icon: '📊'
    },
    lastSync: new Date('2024-02-19T15:45:00'),
    syncStatus: 'synced'
  },
  {
    id: 'emp-003',
    name: 'FitLife Plus',
    niche: 'Health & Fitness',
    status: 'paused',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-15'),
    metrics: {
      revenue: 12350,
      customers: 89,
      products: 5,
      orders: 234,
      traffic: 4560,
      conversionRate: 2.8
    },
    performance: {
      health: 'fair',
      score: 68,
      trend: 'down'
    },
    branding: {
      primaryColor: '#10b981',
      icon: '💪'
    },
    lastSync: new Date('2024-02-15T08:20:00'),
    syncStatus: 'synced'
  },
  {
    id: 'emp-004',
    name: 'Home Services Hub',
    niche: 'Home Repair Services',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-20'),
    metrics: {
      revenue: 18900,
      customers: 124,
      products: 8,
      orders: 356,
      traffic: 6780,
      conversionRate: 3.5
    },
    performance: {
      health: 'good',
      score: 79,
      trend: 'stable'
    },
    branding: {
      primaryColor: '#f59e0b',
      icon: '🔧'
    },
    lastSync: new Date('2024-02-20T09:15:00'),
    syncStatus: 'synced'
  },
  {
    id: 'emp-005',
    name: 'EcoBeauty',
    niche: 'Organic Skincare',
    status: 'draft',
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-18'),
    metrics: {
      revenue: 0,
      customers: 0,
      products: 6,
      orders: 0,
      traffic: 0,
      conversionRate: 0
    },
    performance: {
      health: 'poor',
      score: 25,
      trend: 'stable'
    },
    branding: {
      primaryColor: '#ec4899',
      icon: '🌿'
    },
    syncStatus: 'synced'
  }
];

// ============================================================================
// Main Component
// ============================================================================

export const EmpireManager: React.FC<EmpireManagerProps> = ({
  empires = MOCK_EMPIRES,
  onEmpireClick,
  onEmpireEdit,
  onEmpireDelete,
  onEmpirePause,
  onEmpireResume,
  onEmpireSync,
  onBulkAction,
  onCreateNew
}) => {
  // State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    health: 'all',
    search: '',
    sortBy: 'updated',
    sortOrder: 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  // Filtered and sorted empires
  const filteredEmpires = useMemo(() => {
    let result = [...empires];

    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(e => e.status === filters.status);
    }

    // Filter by health
    if (filters.health !== 'all') {
      result = result.filter(e => e.performance.health === filters.health);
    }

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(search) ||
        e.niche.toLowerCase().includes(search)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'revenue':
          comparison = a.metrics.revenue - b.metrics.revenue;
          break;
        case 'customers':
          comparison = a.metrics.customers - b.metrics.customers;
          break;
        case 'created':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updated':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [empires, filters]);

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredEmpires.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmpires.map(e => e.id)));
    }
  };

  const handleSelectEmpire = (empireId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(empireId)) {
      newSelected.delete(empireId);
    } else {
      newSelected.add(empireId);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkAction = (type: BulkAction['type']) => {
    if (selectedIds.size === 0) return;

    const action: BulkAction = {
      type,
      empireIds: Array.from(selectedIds)
    };

    if (onBulkAction) {
      onBulkAction(action);
    }

    // Clear selection after action
    setSelectedIds(new Set());
  };

  const handleSync = async (empireId: string) => {
    setSyncingIds(new Set([...syncingIds, empireId]));

    if (onEmpireSync) {
      await onEmpireSync(empireId);
    }

    // Simulate sync delay
    setTimeout(() => {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(empireId);
        return next;
      });
    }, 2000);
  };

  const handleSyncAll = async () => {
    const activeEmpires = empires.filter(e => e.status === 'active');
    setSyncingIds(new Set(activeEmpires.map(e => e.id)));

    // Simulate sync for all
    setTimeout(() => {
      setSyncingIds(new Set());
    }, 3000);
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      total: empires.length,
      active: empires.filter(e => e.status === 'active').length,
      paused: empires.filter(e => e.status === 'paused').length,
      draft: empires.filter(e => e.status === 'draft').length,
      totalRevenue: empires.reduce((sum, e) => sum + e.metrics.revenue, 0),
      totalCustomers: empires.reduce((sum, e) => sum + e.metrics.customers, 0)
    };
  }, [empires]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Empire Manager</h1>
              <p className="text-gray-600 mt-1">Manage all your niche businesses in one place</p>
            </div>
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Empire</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Empires</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <span className="text-green-600 font-semibold">{stats.active} active</span>
                <span className="text-gray-400 mx-1">•</span>
                <span className="text-gray-600">{stats.paused} paused</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${(stats.totalRevenue / 1000).toFixed(1)}k</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Across all empires
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Combined customer base
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(empires.reduce((sum, e) => sum + e.performance.score, 0) / empires.length)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Health score out of 100
              </div>
            </div>
          </div>

          {/* Filters and Actions Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Left side - Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search empires..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Health Filter */}
                <select
                  value={filters.health}
                  onChange={(e) => setFilters({ ...filters, health: e.target.value as any })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Health</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>

                {/* Sort */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="updated">Last Updated</option>
                  <option value="created">Date Created</option>
                  <option value="name">Name</option>
                  <option value="revenue">Revenue</option>
                  <option value="customers">Customers</option>
                </select>

                <button
                  onClick={() => setFilters({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* Right side - View and Sync */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSyncAll}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Sync All</span>
                </button>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 border-l border-gray-300 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {selectedIds.size} empire{selectedIds.size > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('sync')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Sync Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('pause')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Pause Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
                  >
                    Archive Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empire List/Grid */}
        {filteredEmpires.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No empires found</h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.status !== 'all' || filters.health !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first niche empire.'}
            </p>
            {(!filters.search && filters.status === 'all' && filters.health === 'all') && (
              <button
                onClick={onCreateNew}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Create Your First Empire
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmpires.map(empire => (
              <EmpireCard
                key={empire.id}
                empire={empire}
                selected={selectedIds.has(empire.id)}
                syncing={syncingIds.has(empire.id)}
                onSelect={() => handleSelectEmpire(empire.id)}
                onClick={() => onEmpireClick?.(empire)}
                onEdit={() => onEmpireEdit?.(empire)}
                onDelete={() => setShowDeleteConfirm(empire.id)}
                onPause={() => onEmpirePause?.(empire.id)}
                onResume={() => onEmpireResume?.(empire.id)}
                onSync={() => handleSync(empire.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredEmpires.length && filteredEmpires.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmpires.map(empire => (
                  <EmpireRow
                    key={empire.id}
                    empire={empire}
                    selected={selectedIds.has(empire.id)}
                    syncing={syncingIds.has(empire.id)}
                    onSelect={() => handleSelectEmpire(empire.id)}
                    onClick={() => onEmpireClick?.(empire)}
                    onEdit={() => onEmpireEdit?.(empire)}
                    onDelete={() => setShowDeleteConfirm(empire.id)}
                    onPause={() => onEmpirePause?.(empire.id)}
                    onResume={() => onEmpireResume?.(empire.id)}
                    onSync={() => handleSync(empire.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmModal
            empireName={empires.find(e => e.id === showDeleteConfirm)?.name || ''}
            onConfirm={() => {
              onEmpireDelete?.(showDeleteConfirm);
              setShowDeleteConfirm(null);
            }}
            onCancel={() => setShowDeleteConfirm(null)}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Empire Card Component (Grid View)
// ============================================================================

interface EmpireCardProps {
  empire: Empire;
  selected: boolean;
  syncing: boolean;
  onSelect: () => void;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPause: () => void;
  onResume: () => void;
  onSync: () => void;
}

const EmpireCard: React.FC<EmpireCardProps> = ({
  empire,
  selected,
  syncing,
  onSelect,
  onClick,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onSync
}) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    paused: 'bg-amber-100 text-amber-800 border-amber-200',
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    archived: 'bg-red-100 text-red-800 border-red-200'
  };

  const healthColors = {
    excellent: 'text-green-600',
    good: 'text-blue-600',
    fair: 'text-amber-600',
    poor: 'text-red-600'
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selected}
              onChange={onSelect}
              onClick={(e) => e.stopPropagation()}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: empire.branding.primaryColor + '20' }}
            >
              {empire.branding.icon || '🏢'}
            </div>
            <div className="flex-1">
              <h3
                onClick={onClick}
                className="text-lg font-bold text-gray-900 hover:text-blue-600 cursor-pointer"
              >
                {empire.name}
              </h3>
              <p className="text-sm text-gray-600">{empire.niche}</p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[empire.status]}`}>
            {empire.status.charAt(0).toUpperCase() + empire.status.slice(1)}
          </span>
          {empire.lastSync && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              {syncing ? (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Synced</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-600">Revenue</p>
            <p className="text-lg font-bold text-gray-900">${(empire.metrics.revenue / 1000).toFixed(1)}k</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Customers</p>
            <p className="text-lg font-bold text-gray-900">{empire.metrics.customers}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Products</p>
            <p className="text-lg font-bold text-gray-900">{empire.metrics.products}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Conv. Rate</p>
            <p className="text-lg font-bold text-gray-900">{empire.metrics.conversionRate}%</p>
          </div>
        </div>

        {/* Performance */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Performance</span>
            <span className={`text-xs font-semibold ${healthColors[empire.performance.health]}`}>
              {empire.performance.health.toUpperCase()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                empire.performance.health === 'excellent' ? 'bg-green-500' :
                empire.performance.health === 'good' ? 'bg-blue-500' :
                empire.performance.health === 'fair' ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${empire.performance.score}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">{empire.performance.score}/100</span>
            <div className="flex items-center space-x-1">
              {empire.performance.trend === 'up' && (
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {empire.performance.trend === 'down' && (
                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {empire.performance.trend === 'stable' && (
                <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {empire.status === 'active' ? (
            <button
              onClick={(e) => { e.stopPropagation(); onPause(); }}
              className="text-gray-600 hover:text-gray-900"
              title="Pause"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          ) : empire.status === 'paused' ? (
            <button
              onClick={(e) => { e.stopPropagation(); onResume(); }}
              className="text-green-600 hover:text-green-700"
              title="Resume"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          ) : null}

          <button
            onClick={(e) => { e.stopPropagation(); onSync(); }}
            className="text-blue-600 hover:text-blue-700"
            title="Sync"
            disabled={syncing}
          >
            <svg className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-gray-600 hover:text-gray-900"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-red-600 hover:text-red-700"
          title="Delete"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// Empire Row Component (List View)
// ============================================================================

const EmpireRow: React.FC<EmpireCardProps> = ({
  empire,
  selected,
  syncing,
  onSelect,
  onClick,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onSync
}) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-amber-100 text-amber-800',
    draft: 'bg-gray-100 text-gray-800',
    archived: 'bg-red-100 text-red-800'
  };

  const healthColors = {
    excellent: 'text-green-600',
    good: 'text-blue-600',
    fair: 'text-amber-600',
    poor: 'text-red-600'
  };

  return (
    <tr className={`hover:bg-gray-50 ${selected ? 'bg-blue-50' : ''}`}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: empire.branding.primaryColor + '20' }}
          >
            {empire.branding.icon || '🏢'}
          </div>
          <div>
            <div
              onClick={onClick}
              className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
            >
              {empire.name}
            </div>
            <div className="text-sm text-gray-600">{empire.niche}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[empire.status]}`}>
          {empire.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        ${(empire.metrics.revenue / 1000).toFixed(1)}k
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {empire.metrics.customers}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                empire.performance.health === 'excellent' ? 'bg-green-500' :
                empire.performance.health === 'good' ? 'bg-blue-500' :
                empire.performance.health === 'fair' ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${empire.performance.score}%` }}
            />
          </div>
          <span className={`text-xs font-semibold ${healthColors[empire.performance.health]}`}>
            {empire.performance.score}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {new Date(empire.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          {empire.status === 'active' ? (
            <button
              onClick={(e) => { e.stopPropagation(); onPause(); }}
              className="text-gray-600 hover:text-gray-900"
              title="Pause"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          ) : empire.status === 'paused' ? (
            <button
              onClick={(e) => { e.stopPropagation(); onResume(); }}
              className="text-green-600 hover:text-green-700"
              title="Resume"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          ) : null}

          <button
            onClick={(e) => { e.stopPropagation(); onSync(); }}
            className="text-blue-600 hover:text-blue-700"
            title="Sync"
            disabled={syncing}
          >
            <svg className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-gray-600 hover:text-gray-900"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-red-600 hover:text-red-700"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

// ============================================================================
// Delete Confirmation Modal
// ============================================================================

interface DeleteConfirmModalProps {
  empireName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  empireName,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
            Delete Empire
          </h3>

          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete <strong>{empireName}</strong>? This action cannot be undone.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpireManager;
