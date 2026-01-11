/**
 * MetricsDisplay - React Component for Empire Performance Metrics
 *
 * Displays comprehensive analytics with beautiful charts and visualizations
 */

import React, { useState, useMemo } from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  traffic: number;
  customers: number;
  conversion: number;
  engagement: number;
}

export interface MetricsSummary {
  revenue: {
    current: number;
    previous: number;
    change: number;
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

export interface ChannelMetrics {
  channel: string;
  traffic: number;
  revenue: number;
  conversion: number;
  color: string;
}

export interface ProductPerformance {
  name: string;
  revenue: number;
  units: number;
  growth: number;
}

export interface EmpireMetrics {
  id: string;
  name: string;
  timeSeries: TimeSeriesData[];
  summary: MetricsSummary;
  channels: ChannelMetrics[];
  topProducts: ProductPerformance[];
}

export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
export type ChartType = 'revenue' | 'traffic' | 'conversion' | 'engagement' | 'overview';

interface MetricsDisplayProps {
  empireMetrics: EmpireMetrics | EmpireMetrics[];
  onExport?: (format: 'csv' | 'pdf' | 'json') => void;
}

// ============================================================================
// Mock Data Generator
// ============================================================================

const generateMockData = (days: number): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const baseRevenue = 500 + Math.random() * 200;
    const seasonality = Math.sin((i / 30) * Math.PI) * 100;
    const trend = (days - i) * 2;

    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(baseRevenue + seasonality + trend),
      orders: Math.round((baseRevenue + seasonality + trend) / 45),
      traffic: Math.round((baseRevenue + seasonality + trend) * 3 + Math.random() * 100),
      customers: Math.round((baseRevenue + seasonality + trend) / 150),
      conversion: Math.round((Math.random() * 2 + 2.5) * 10) / 10,
      engagement: Math.round((Math.random() * 10 + 60))
    });
  }

  return data;
};

const MOCK_METRICS: EmpireMetrics = {
  id: 'emp-001',
  name: 'SmartHome Pro',
  timeSeries: generateMockData(90),
  summary: {
    revenue: {
      current: 45780,
      previous: 38650,
      change: 18.4,
      trend: 'up'
    },
    traffic: {
      current: 15420,
      previous: 13200,
      change: 16.8,
      trend: 'up'
    },
    conversion: {
      current: 3.2,
      previous: 2.9,
      change: 10.3,
      trend: 'up'
    },
    engagement: {
      current: 68,
      previous: 62,
      change: 9.7,
      trend: 'up'
    }
  },
  channels: [
    { channel: 'Organic Search', traffic: 6200, revenue: 18500, conversion: 3.5, color: '#10b981' },
    { channel: 'Paid Ads', traffic: 4100, revenue: 14200, conversion: 4.2, color: '#3b82f6' },
    { channel: 'Social Media', traffic: 3200, revenue: 8900, conversion: 2.8, color: '#8b5cf6' },
    { channel: 'Email', traffic: 1500, revenue: 3200, conversion: 2.1, color: '#f59e0b' },
    { channel: 'Direct', traffic: 420, revenue: 980, conversion: 2.3, color: '#6b7280' }
  ],
  topProducts: [
    { name: 'Smart Thermostat Pro', revenue: 12400, units: 124, growth: 24.5 },
    { name: 'Security Camera Kit', revenue: 9800, units: 98, growth: 18.2 },
    { name: 'Smart Lock Elite', revenue: 8600, units: 86, growth: 15.8 },
    { name: 'Voice Assistant Hub', revenue: 7200, units: 144, growth: 12.3 },
    { name: 'Smart Lighting Bundle', revenue: 5900, units: 118, growth: 8.7 }
  ]
};

// ============================================================================
// Simple Chart Components (No external dependencies)
// ============================================================================

interface LineChartProps {
  data: TimeSeriesData[];
  dataKey: keyof TimeSeriesData;
  color: string;
  height?: number;
}

const SimpleLineChart: React.FC<LineChartProps> = ({ data, dataKey, color, height = 300 }) => {
  if (data.length === 0) return null;

  const values = data.map(d => typeof d[dataKey] === 'number' ? d[dataKey] as number : 0);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const value = typeof d[dataKey] === 'number' ? d[dataKey] as number : 0;
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  const area = `0,100 ${points} 100,100`;

  return (
    <div className="relative" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.1" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.1" />

        {/* Area fill */}
        <polygon points={area} fill={color} fillOpacity="0.1" />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const value = typeof d[dataKey] === 'number' ? d[dataKey] as number : 0;
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((value - min) / range) * 80 - 10;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="0.8"
              fill={color}
              className="hover:r-1.5 transition-all"
            />
          );
        })}
      </svg>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-12">
        <span>{Math.round(max).toLocaleString()}</span>
        <span>{Math.round(min + range * 0.75).toLocaleString()}</span>
        <span>{Math.round(min + range * 0.5).toLocaleString()}</span>
        <span>{Math.round(min + range * 0.25).toLocaleString()}</span>
        <span>{Math.round(min).toLocaleString()}</span>
      </div>
    </div>
  );
};

interface BarChartProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
}

const SimpleBarChart: React.FC<BarChartProps> = ({ data, height = 300 }) => {
  if (data.length === 0) return null;

  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-3" style={{ height }}>
      {data.map((item, i) => {
        const percentage = (item.value / max) * 100;
        return (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-32 text-sm text-gray-700 truncate">{item.name}</div>
            <div className="flex-1 flex items-center space-x-2">
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                >
                  {percentage > 15 && (
                    <span className="text-xs font-semibold text-white">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              {percentage <= 15 && (
                <span className="text-xs font-semibold text-gray-600 w-16 text-right">
                  {item.value.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface PieChartProps {
  data: { name: string; value: number; color: string }[];
  size?: number;
}

const SimplePieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;

  const slices = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle
    };
  });

  const radius = 45;
  const center = 50;

  return (
    <div className="flex items-center justify-center space-x-8">
      <svg viewBox="0 0 100 100" className="transform -rotate-90" style={{ width: size, height: size }}>
        {slices.map((slice, i) => {
          const startAngle = (slice.startAngle * Math.PI) / 180;
          const endAngle = (slice.endAngle * Math.PI) / 180;

          const x1 = center + radius * Math.cos(startAngle);
          const y1 = center + radius * Math.sin(startAngle);
          const x2 = center + radius * Math.cos(endAngle);
          const y2 = center + radius * Math.sin(endAngle);

          const largeArc = slice.percentage > 50 ? 1 : 0;

          return (
            <path
              key={i}
              d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={slice.color}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          );
        })}
      </svg>

      <div className="space-y-2">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: slice.color }} />
            <div className="text-sm">
              <span className="text-gray-700">{slice.name}</span>
              <span className="text-gray-500 ml-2">{slice.percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  empireMetrics = MOCK_METRICS,
  onExport
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartType, setChartType] = useState<ChartType>('revenue');
  const [compareMode, setCompareMode] = useState(false);

  // Handle single or multiple empires
  const metrics = Array.isArray(empireMetrics) ? empireMetrics[0] : empireMetrics;
  const isComparison = Array.isArray(empireMetrics) && empireMetrics.length > 1;

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : timeRange === '1y' ? 365 : metrics.timeSeries.length;
    return metrics.timeSeries.slice(-days);
  }, [metrics.timeSeries, timeRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;

    const latest = filteredData[filteredData.length - 1];
    const firstHalf = filteredData.slice(0, Math.floor(filteredData.length / 2));
    const secondHalf = filteredData.slice(Math.floor(filteredData.length / 2));

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      current: {
        revenue: latest.revenue,
        traffic: latest.traffic,
        conversion: latest.conversion,
        engagement: latest.engagement
      },
      average: {
        revenue: Math.round(avg(filteredData.map(d => d.revenue))),
        traffic: Math.round(avg(filteredData.map(d => d.traffic))),
        conversion: Math.round(avg(filteredData.map(d => d.conversion)) * 10) / 10,
        engagement: Math.round(avg(filteredData.map(d => d.engagement)))
      },
      trend: {
        revenue: avg(secondHalf.map(d => d.revenue)) > avg(firstHalf.map(d => d.revenue)) ? 'up' : 'down',
        traffic: avg(secondHalf.map(d => d.traffic)) > avg(firstHalf.map(d => d.traffic)) ? 'up' : 'down',
        conversion: avg(secondHalf.map(d => d.conversion)) > avg(firstHalf.map(d => d.conversion)) ? 'up' : 'down',
        engagement: avg(secondHalf.map(d => d.engagement)) > avg(firstHalf.map(d => d.engagement)) ? 'up' : 'down'
      }
    };
  }, [filteredData]);

  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export implementation
      if (format === 'csv') {
        const headers = ['Date', 'Revenue', 'Orders', 'Traffic', 'Customers', 'Conversion', 'Engagement'];
        const rows = filteredData.map(d => [
          d.date,
          d.revenue,
          d.orders,
          d.traffic,
          d.customers,
          d.conversion,
          d.engagement
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `metrics-${metrics.name}-${timeRange}.csv`;
        a.click();
      } else if (format === 'json') {
        const json = JSON.stringify({ metrics, timeRange, data: filteredData }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `metrics-${metrics.name}-${timeRange}.json`;
        a.click();
      }
    }
  };

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Performance Metrics</h1>
              <p className="text-gray-600 mt-1">{metrics.name} - Analytics Dashboard</p>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => handleExport('json')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <span>Export JSON</span>
              </button>

              {isComparison && (
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm ${
                    compareMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Compare</span>
                </button>
              )}
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            {(['7d', '30d', '90d', '1y', 'all'] as TimeRange[]).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' :
                 range === '30d' ? 'Last 30 Days' :
                 range === '90d' ? 'Last 90 Days' :
                 range === '1y' ? 'Last Year' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${metrics.summary.revenue.current.toLocaleString()}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 text-sm font-semibold ${
                metrics.summary.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.summary.revenue.trend === 'up' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{metrics.summary.revenue.change.toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Avg: ${stats.average.revenue.toLocaleString()} per day
            </div>
          </div>

          {/* Traffic Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Traffic</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.summary.traffic.current.toLocaleString()}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 text-sm font-semibold ${
                metrics.summary.traffic.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.summary.traffic.trend === 'up' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{metrics.summary.traffic.change.toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Avg: {stats.average.traffic.toLocaleString()} visitors/day
            </div>
          </div>

          {/* Conversion Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversion</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.summary.conversion.current}%</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 text-sm font-semibold ${
                metrics.summary.conversion.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.summary.conversion.trend === 'up' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{metrics.summary.conversion.change.toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Avg: {stats.average.conversion}% conversion rate
            </div>
          </div>

          {/* Engagement Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.summary.engagement.current}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 text-sm font-semibold ${
                metrics.summary.engagement.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.summary.engagement.trend === 'up' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{metrics.summary.engagement.change.toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Avg: {stats.average.engagement} engagement score
            </div>
          </div>
        </div>

        {/* Chart Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {[
              { key: 'revenue' as ChartType, label: 'Revenue', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { key: 'traffic' as ChartType, label: 'Traffic', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
              { key: 'conversion' as ChartType, label: 'Conversion', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { key: 'engagement' as ChartType, label: 'Engagement', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
              { key: 'overview' as ChartType, label: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
            ].map(chart => (
              <button
                key={chart.key}
                onClick={() => setChartType(chart.key)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap transition-all ${
                  chartType === chart.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={chart.icon} />
                </svg>
                <span>{chart.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            {chartType === 'revenue' ? 'Revenue Trend' :
             chartType === 'traffic' ? 'Traffic Trend' :
             chartType === 'conversion' ? 'Conversion Rate' :
             chartType === 'engagement' ? 'Engagement Score' : 'Performance Overview'}
          </h2>

          {chartType === 'overview' ? (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue & Traffic</h3>
                <SimpleLineChart data={filteredData} dataKey="revenue" color="#10b981" height={250} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Conversion & Engagement</h3>
                <SimpleLineChart data={filteredData} dataKey="conversion" color="#3b82f6" height={250} />
              </div>
            </div>
          ) : (
            <SimpleLineChart
              data={filteredData}
              dataKey={chartType}
              color={
                chartType === 'revenue' ? '#10b981' :
                chartType === 'traffic' ? '#3b82f6' :
                chartType === 'conversion' ? '#8b5cf6' : '#f59e0b'
              }
              height={350}
            />
          )}

          {/* X-axis labels */}
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            {[0, Math.floor(filteredData.length / 4), Math.floor(filteredData.length / 2), Math.floor(filteredData.length * 3 / 4), filteredData.length - 1].map(i => (
              <span key={i}>{filteredData[i]?.date.substring(5)}</span>
            ))}
          </div>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Traffic Sources</h2>
            <SimplePieChart
              data={metrics.channels.map(c => ({
                name: c.channel,
                value: c.traffic,
                color: c.color
              }))}
              size={180}
            />
          </div>

          {/* Revenue by Channel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue by Channel</h2>
            <SimpleBarChart
              data={metrics.channels.map(c => ({
                name: c.channel,
                value: c.revenue,
                color: c.color
              }))}
              height={280}
            />
          </div>
        </div>

        {/* Channel Performance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Channel Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.channels.map((channel, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }} />
                        <span className="text-sm font-medium text-gray-900">{channel.channel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {channel.traffic.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${channel.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {channel.conversion}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Math.round(channel.revenue / channel.traffic).toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top Performing Products</h2>
          <div className="space-y-4">
            {metrics.topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    #{i + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-600">{product.units} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${product.revenue.toLocaleString()}</p>
                  <div className={`text-xs font-semibold flex items-center justify-end space-x-1 ${
                    product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.growth >= 0 ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{Math.abs(product.growth).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
