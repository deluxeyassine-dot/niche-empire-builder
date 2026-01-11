/**
 * AnalyticsTracker - Tracks and analyzes business metrics
 *
 * This class provides comprehensive analytics tracking including metric collection,
 * report generation, performance monitoring, dashboard creation, ROI analysis,
 * and data export capabilities.
 */

export interface MetricOptions {
  category: 'marketing' | 'sales' | 'engagement' | 'traffic' | 'revenue' | 'customer' | 'product' | 'custom';
  name: string;
  value: number;
  unit?: 'count' | 'percentage' | 'currency' | 'time' | 'custom';
  dimensions?: Record<string, string>;
  timestamp?: Date;
  source?: string;
}

export interface Metric {
  id: string;
  category: string;
  name: string;
  value: number;
  unit: string;
  dimensions: Record<string, string>;
  timestamp: Date;
  source: string;
  metadata?: Record<string, any>;
}

export interface ReportOptions {
  name: string;
  type: 'summary' | 'detailed' | 'comparison' | 'trend' | 'custom';
  dateRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  groupBy?: 'day' | 'week' | 'month' | 'category' | 'source';
  filters?: {
    category?: string;
    source?: string;
    dimension?: Record<string, string>;
  };
  includeCharts?: boolean;
  includeInsights?: boolean;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  generatedAt: Date;
  summary: {
    totalMetrics: number;
    categories: string[];
    keyFindings: string[];
  };
  data: {
    category: string;
    metrics: {
      name: string;
      current: number;
      previous?: number;
      change?: number;
      changePercentage?: number;
      trend: 'up' | 'down' | 'stable';
    }[];
  }[];
  charts?: {
    type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
    title: string;
    data: any[];
    config?: Record<string, any>;
  }[];
  insights: {
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    recommendation?: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  metadata?: Record<string, any>;
}

export interface PerformanceMonitorOptions {
  metrics: string[];
  thresholds?: {
    metric: string;
    min?: number;
    max?: number;
    target?: number;
  }[];
  alertChannels?: ('email' | 'slack' | 'webhook')[];
  checkInterval?: number; // minutes
}

export interface PerformanceMonitor {
  id: string;
  name: string;
  metrics: string[];
  thresholds: PerformanceMonitorOptions['thresholds'];
  alertChannels: string[];
  checkInterval: number;
  status: 'active' | 'paused';
  createdAt: Date;
  lastCheckedAt?: Date;
  alerts: {
    id: string;
    metric: string;
    value: number;
    threshold: number;
    type: 'above_max' | 'below_min' | 'off_target';
    severity: 'critical' | 'warning' | 'info';
    timestamp: Date;
    resolved: boolean;
  }[];
}

export interface DashboardOptions {
  name: string;
  description?: string;
  layout?: 'grid' | 'rows' | 'custom';
  widgets: {
    type: 'metric' | 'chart' | 'table' | 'progress' | 'scorecard' | 'timeline';
    title: string;
    metric?: string;
    query?: {
      category?: string;
      dateRange?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
      aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
    };
    size?: 'small' | 'medium' | 'large' | 'full';
    position?: {
      row: number;
      col: number;
    };
    config?: Record<string, any>;
  }[];
  refreshInterval?: number; // minutes
  isPublic?: boolean;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  layout: string;
  widgets: {
    id: string;
    type: string;
    title: string;
    metric?: string;
    query?: DashboardOptions['widgets'][0]['query'];
    size: string;
    position: {
      row: number;
      col: number;
    };
    data?: any;
    lastUpdated?: Date;
  }[];
  refreshInterval: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  shares: number;
}

export interface ROIAnalysisOptions {
  campaign?: string;
  channel?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  investment: {
    total: number;
    breakdown?: {
      category: string;
      amount: number;
    }[];
  };
  revenue: {
    total: number;
    source?: string;
  };
  includeProjections?: boolean;
}

export interface ROIAnalysis {
  id: string;
  campaign?: string;
  channel?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  investment: {
    total: number;
    breakdown: {
      category: string;
      amount: number;
      percentage: number;
    }[];
  };
  revenue: {
    total: number;
    source?: string;
    breakdown?: {
      source: string;
      amount: number;
      percentage: number;
    }[];
  };
  roi: {
    value: number; // percentage
    profit: number;
    paybackPeriod?: number; // days
    breakEvenPoint?: Date;
  };
  metrics: {
    cac: number; // Customer Acquisition Cost
    ltv?: number; // Lifetime Value
    roas: number; // Return on Ad Spend
    conversionRate: number;
    ctr?: number; // Click-through Rate
  };
  projections?: {
    period: 'month' | 'quarter' | 'year';
    projectedRevenue: number;
    projectedROI: number;
    confidence: number; // percentage
  };
  recommendations: {
    category: string;
    action: string;
    expectedImpact: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  generatedAt: Date;
}

export interface ExportOptions {
  dataType: 'metrics' | 'reports' | 'dashboards' | 'roi' | 'all';
  format: 'csv' | 'json' | 'excel' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: {
    category?: string;
    source?: string;
    [key: string]: any;
  };
  includeCharts?: boolean;
  includeMetadata?: boolean;
}

export interface ExportResult {
  id: string;
  format: string;
  dataType: string;
  fileName: string;
  fileSize: number; // bytes
  recordCount: number;
  generatedAt: Date;
  expiresAt?: Date;
  downloadUrl: string;
  metadata?: {
    dateRange?: ExportOptions['dateRange'];
    filters?: ExportOptions['filters'];
    [key: string]: any;
  };
}

export interface TrafficSource {
  source: string;
  medium: string;
  campaign?: string;
  sessions: number;
  users: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number; // seconds
  conversions: number;
  revenue: number;
}

export interface ConversionFunnel {
  name: string;
  steps: {
    name: string;
    users: number;
    dropoffRate: number;
    conversionRate: number;
  }[];
  overallConversionRate: number;
  bottleneck: string;
}

export interface CohortAnalysis {
  cohortType: 'registration' | 'purchase' | 'custom';
  period: 'daily' | 'weekly' | 'monthly';
  cohorts: {
    cohortDate: Date;
    size: number;
    retention: {
      period: number;
      users: number;
      percentage: number;
    }[];
  }[];
  averageRetention: number[];
}

export class AnalyticsTracker {
  private metrics: Map<string, Metric> = new Map();
  private reports: Map<string, Report> = new Map();
  private monitors: Map<string, PerformanceMonitor> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private roiAnalyses: Map<string, ROIAnalysis> = new Map();
  private exports: Map<string, ExportResult> = new Map();
  private metricIdCounter: number = 0;

  /**
   * Track individual metrics
   * @param options - Metric tracking options
   * @returns Tracked metric
   */
  async trackMetrics(options: MetricOptions): Promise<Metric> {
    // TODO: Implement comprehensive metric tracking
    // This would typically involve:
    // - Real-time data ingestion
    // - Event streaming (Kafka, Kinesis)
    // - Database storage (InfluxDB, TimescaleDB)
    // - Data validation and cleaning
    // - Aggregation and rollups
    // - Custom dimension support
    // - Batch processing for historical data
    // - Integration with analytics platforms (Google Analytics, Mixpanel)

    console.log(`Tracking ${options.category} metric: ${options.name} = ${options.value}...`);

    const metricId = this.generateMetricId();

    const metric: Metric = {
      id: metricId,
      category: options.category,
      name: options.name,
      value: options.value,
      unit: options.unit || 'count',
      dimensions: options.dimensions || {},
      timestamp: options.timestamp || new Date(),
      source: options.source || 'manual'
    };

    this.metrics.set(metricId, metric);

    // Check performance monitors
    await this.checkMonitors(metric);

    console.log(`Metric tracked: ${metric.name} = ${metric.value} ${metric.unit}`);

    return metric;
  }

  /**
   * Generate comprehensive reports
   * @param options - Report generation options
   * @returns Generated report
   */
  async generateReports(options: ReportOptions): Promise<Report> {
    // TODO: Implement advanced reporting
    // This would typically involve:
    // - SQL query generation
    // - Data aggregation across sources
    // - Comparison with previous periods
    // - Statistical analysis
    // - Chart generation (Chart.js, D3.js)
    // - Insight extraction using ML
    // - PDF generation (Puppeteer, PDFKit)
    // - Schedule report delivery
    // - Report templating

    console.log(`Generating ${options.type} report: "${options.name}"...`);

    const reportId = this.generateReportId();

    // Get metrics for date range
    const reportMetrics = this.getMetricsForDateRange(
      options.dateRange.start,
      options.dateRange.end,
      options.filters
    );

    // Group metrics by category
    const groupedData = this.groupMetrics(reportMetrics, options.groupBy || 'category');

    // Calculate comparisons with previous period
    const previousPeriod = this.getPreviousPeriod(options.dateRange);
    const previousMetrics = this.getMetricsForDateRange(
      previousPeriod.start,
      previousPeriod.end,
      options.filters
    );

    // Build report data
    const data = this.buildReportData(groupedData, previousMetrics);

    // Generate charts if requested
    const charts = options.includeCharts ? this.generateCharts(data, options.type) : [];

    // Extract insights if requested
    const insights = options.includeInsights !== false ? this.extractInsights(data) : [];

    const report: Report = {
      id: reportId,
      name: options.name,
      type: options.type,
      dateRange: options.dateRange,
      generatedAt: new Date(),
      summary: {
        totalMetrics: reportMetrics.length,
        categories: [...new Set(reportMetrics.map(m => m.category))],
        keyFindings: this.generateKeyFindings(data, insights)
      },
      data,
      charts,
      insights
    };

    this.reports.set(reportId, report);

    console.log(`Report generated with ${data.length} data groups and ${insights.length} insights`);

    return report;
  }

  /**
   * Monitor performance metrics in real-time
   * @param options - Performance monitoring options
   * @returns Performance monitor configuration
   */
  async monitorPerformance(options: PerformanceMonitorOptions): Promise<PerformanceMonitor> {
    // TODO: Implement real-time monitoring
    // This would typically involve:
    // - WebSocket connections for real-time data
    // - Threshold-based alerting
    // - Anomaly detection (ML-based)
    // - Alert routing (PagerDuty, Opsgenie)
    // - SLA monitoring
    // - Performance degradation detection
    // - Automated remediation triggers
    // - Historical baseline comparison

    console.log(`Setting up performance monitor for ${options.metrics.length} metrics...`);

    const monitorId = this.generateMonitorId();

    const monitor: PerformanceMonitor = {
      id: monitorId,
      name: `Monitor ${monitorId}`,
      metrics: options.metrics,
      thresholds: options.thresholds || [],
      alertChannels: options.alertChannels || ['email'],
      checkInterval: options.checkInterval || 5,
      status: 'active',
      createdAt: new Date(),
      alerts: []
    };

    this.monitors.set(monitorId, monitor);

    // Start monitoring
    this.startMonitoring(monitor);

    console.log(`Performance monitor created: checking every ${monitor.checkInterval} minutes`);

    return monitor;
  }

  /**
   * Create interactive dashboards
   * @param options - Dashboard creation options
   * @returns Created dashboard
   */
  async createDashboards(options: DashboardOptions): Promise<Dashboard> {
    // TODO: Implement dashboard system
    // This would typically involve:
    // - Real-time data updates
    // - Interactive visualizations
    // - Drill-down capabilities
    // - Custom widget development
    // - Responsive layouts
    // - Sharing and permissions
    // - Embedding in external apps
    // - Mobile optimization
    // - Collaboration features

    console.log(`Creating dashboard: "${options.name}"...`);

    const dashboardId = this.generateDashboardId();

    // Initialize widgets with data
    const widgets = await Promise.all(
      options.widgets.map(async (widget, index) => {
        const data = await this.getWidgetData(widget);

        return {
          id: `${dashboardId}_widget_${index}`,
          type: widget.type,
          title: widget.title,
          metric: widget.metric,
          query: widget.query,
          size: widget.size || 'medium',
          position: widget.position || { row: Math.floor(index / 2), col: index % 2 },
          data,
          lastUpdated: new Date()
        };
      })
    );

    const dashboard: Dashboard = {
      id: dashboardId,
      name: options.name,
      description: options.description || '',
      layout: options.layout || 'grid',
      widgets,
      refreshInterval: options.refreshInterval || 5,
      isPublic: options.isPublic || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      shares: 0
    };

    this.dashboards.set(dashboardId, dashboard);

    console.log(`Dashboard created with ${widgets.length} widgets`);

    return dashboard;
  }

  /**
   * Analyze return on investment
   * @param options - ROI analysis options
   * @returns ROI analysis results
   */
  async analyzeROI(options: ROIAnalysisOptions): Promise<ROIAnalysis> {
    // TODO: Implement comprehensive ROI analysis
    // This would typically involve:
    // - Multi-touch attribution
    // - Cohort-based analysis
    // - Predictive modeling
    // - Scenario planning
    // - Sensitivity analysis
    // - Competitor benchmarking
    // - Market condition factors
    // - Time-series forecasting

    console.log(`Analyzing ROI for period ${options.dateRange.start} to ${options.dateRange.end}...`);

    const analysisId = this.generateROIAnalysisId();

    // Calculate investment breakdown
    const investmentBreakdown = options.investment.breakdown?.map(item => ({
      ...item,
      percentage: parseFloat(((item.amount / options.investment.total) * 100).toFixed(2))
    })) || [];

    // Calculate ROI
    const profit = options.revenue.total - options.investment.total;
    const roiValue = parseFloat(((profit / options.investment.total) * 100).toFixed(2));

    // Calculate key metrics
    const metrics = this.calculateROIMetrics(options);

    // Generate projections if requested
    const projections = options.includeProjections
      ? this.generateROIProjections(options, roiValue, metrics)
      : undefined;

    // Generate recommendations
    const recommendations = this.generateROIRecommendations(roiValue, metrics, options);

    const analysis: ROIAnalysis = {
      id: analysisId,
      campaign: options.campaign,
      channel: options.channel,
      dateRange: options.dateRange,
      investment: {
        total: options.investment.total,
        breakdown: investmentBreakdown
      },
      revenue: {
        total: options.revenue.total,
        source: options.revenue.source
      },
      roi: {
        value: roiValue,
        profit,
        paybackPeriod: this.calculatePaybackPeriod(options),
        breakEvenPoint: this.calculateBreakEvenPoint(options)
      },
      metrics,
      projections,
      recommendations,
      generatedAt: new Date()
    };

    this.roiAnalyses.set(analysisId, analysis);

    console.log(`ROI Analysis complete: ${roiValue}% ROI, $${profit} profit`);

    return analysis;
  }

  /**
   * Export analytics data
   * @param options - Export options
   * @returns Export result with download information
   */
  async exportData(options: ExportOptions): Promise<ExportResult> {
    // TODO: Implement data export
    // This would typically involve:
    // - Large dataset handling
    // - Streaming exports
    // - Format conversion
    // - Compression (gzip, zip)
    // - S3/Cloud storage upload
    // - Signed URL generation
    // - Email delivery
    // - Scheduled exports
    // - Export history tracking

    console.log(`Exporting ${options.dataType} data in ${options.format} format...`);

    const exportId = this.generateExportId();

    // Gather data based on type
    let data: any[] = [];
    let recordCount = 0;

    switch (options.dataType) {
      case 'metrics':
        data = this.prepareMetricsExport(options);
        recordCount = data.length;
        break;
      case 'reports':
        data = Array.from(this.reports.values());
        recordCount = data.length;
        break;
      case 'dashboards':
        data = Array.from(this.dashboards.values());
        recordCount = data.length;
        break;
      case 'roi':
        data = Array.from(this.roiAnalyses.values());
        recordCount = data.length;
        break;
      case 'all':
        const allData = {
          metrics: this.prepareMetricsExport(options),
          reports: Array.from(this.reports.values()),
          dashboards: Array.from(this.dashboards.values()),
          roi: Array.from(this.roiAnalyses.values())
        };
        data = [allData];
        recordCount = Object.values(allData).reduce((sum: number, arr: any) =>
          sum + (Array.isArray(arr) ? arr.length : 0), 0);
        break;
    }

    // Generate file
    const fileName = this.generateFileName(options);
    const fileContent = this.formatExport(data, options.format, options);
    const fileSize = JSON.stringify(fileContent).length;

    const exportResult: ExportResult = {
      id: exportId,
      format: options.format,
      dataType: options.dataType,
      fileName,
      fileSize,
      recordCount,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      downloadUrl: `/exports/${exportId}/${fileName}`,
      metadata: {
        dateRange: options.dateRange,
        filters: options.filters
      }
    };

    this.exports.set(exportId, exportResult);

    console.log(`Export created: ${fileName} (${recordCount} records, ${this.formatBytes(fileSize)})`);

    return exportResult;
  }

  /**
   * Get traffic sources analysis
   * @param dateRange - Date range to analyze
   * @returns Traffic source breakdown
   */
  async getTrafficSources(dateRange: { start: Date; end: Date }): Promise<TrafficSource[]> {
    console.log('Analyzing traffic sources...');

    // Simulate traffic source data
    return [
      {
        source: 'google',
        medium: 'organic',
        sessions: 15000,
        users: 12000,
        pageviews: 45000,
        bounceRate: 45.5,
        avgSessionDuration: 180,
        conversions: 450,
        revenue: 22500
      },
      {
        source: 'facebook',
        medium: 'social',
        campaign: 'summer_campaign',
        sessions: 8000,
        users: 6500,
        pageviews: 20000,
        bounceRate: 52.3,
        avgSessionDuration: 120,
        conversions: 200,
        revenue: 10000
      },
      {
        source: 'direct',
        medium: '(none)',
        sessions: 5000,
        users: 4200,
        pageviews: 15000,
        bounceRate: 38.2,
        avgSessionDuration: 240,
        conversions: 300,
        revenue: 18000
      }
    ];
  }

  /**
   * Analyze conversion funnel
   * @param funnelName - Name of the funnel
   * @returns Funnel analysis
   */
  async analyzeConversionFunnel(funnelName: string): Promise<ConversionFunnel> {
    console.log(`Analyzing conversion funnel: ${funnelName}...`);

    // Simulate funnel data
    const steps = [
      { name: 'Landing Page', users: 10000, dropoffRate: 0, conversionRate: 100 },
      { name: 'Product Page', users: 7000, dropoffRate: 30, conversionRate: 70 },
      { name: 'Add to Cart', users: 3500, dropoffRate: 50, conversionRate: 35 },
      { name: 'Checkout', users: 2100, dropoffRate: 40, conversionRate: 21 },
      { name: 'Purchase', users: 1500, dropoffRate: 28.6, conversionRate: 15 }
    ];

    return {
      name: funnelName,
      steps,
      overallConversionRate: 15,
      bottleneck: 'Add to Cart'
    };
  }

  /**
   * Generate cohort analysis
   * @param cohortType - Type of cohort analysis
   * @param period - Period for grouping
   * @returns Cohort retention analysis
   */
  async analyzeCohorts(
    cohortType: 'registration' | 'purchase' | 'custom',
    period: 'daily' | 'weekly' | 'monthly'
  ): Promise<CohortAnalysis> {
    console.log(`Analyzing ${cohortType} cohorts by ${period}...`);

    // Simulate cohort data
    const cohorts = [
      {
        cohortDate: new Date('2024-01-01'),
        size: 1000,
        retention: [
          { period: 0, users: 1000, percentage: 100 },
          { period: 1, users: 600, percentage: 60 },
          { period: 2, users: 450, percentage: 45 },
          { period: 3, users: 380, percentage: 38 }
        ]
      }
    ];

    return {
      cohortType,
      period,
      cohorts,
      averageRetention: [100, 60, 45, 38]
    };
  }

  /**
   * Helper method to get metrics for date range
   * @private
   */
  private getMetricsForDateRange(
    start: Date,
    end: Date,
    filters?: ReportOptions['filters']
  ): Metric[] {
    return Array.from(this.metrics.values()).filter(metric => {
      const inDateRange = metric.timestamp >= start && metric.timestamp <= end;

      if (!inDateRange) return false;

      if (filters?.category && metric.category !== filters.category) return false;
      if (filters?.source && metric.source !== filters.source) return false;

      return true;
    });
  }

  /**
   * Helper method to get previous period
   * @private
   */
  private getPreviousPeriod(dateRange: { start: Date; end: Date }): { start: Date; end: Date } {
    const duration = dateRange.end.getTime() - dateRange.start.getTime();
    return {
      start: new Date(dateRange.start.getTime() - duration),
      end: new Date(dateRange.start.getTime())
    };
  }

  /**
   * Helper method to group metrics
   * @private
   */
  private groupMetrics(metrics: Metric[], groupBy: string): Map<string, Metric[]> {
    const grouped = new Map<string, Metric[]>();

    metrics.forEach(metric => {
      const key = groupBy === 'category' ? metric.category :
                  groupBy === 'source' ? metric.source :
                  metric.timestamp.toISOString().split('T')[0];

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(metric);
    });

    return grouped;
  }

  /**
   * Helper method to build report data
   * @private
   */
  private buildReportData(
    groupedMetrics: Map<string, Metric[]>,
    previousMetrics: Metric[]
  ): Report['data'] {
    const data: Report['data'] = [];

    groupedMetrics.forEach((metrics, category) => {
      const metricsByName = new Map<string, Metric[]>();

      metrics.forEach(m => {
        if (!metricsByName.has(m.name)) {
          metricsByName.set(m.name, []);
        }
        metricsByName.get(m.name)!.push(m);
      });

      const categoryData = {
        category,
        metrics: Array.from(metricsByName.entries()).map(([name, metricList]) => {
          const current = metricList.reduce((sum, m) => sum + m.value, 0) / metricList.length;
          const previousForMetric = previousMetrics.filter(m => m.name === name);
          const previous = previousForMetric.length > 0
            ? previousForMetric.reduce((sum, m) => sum + m.value, 0) / previousForMetric.length
            : undefined;

          const change = previous !== undefined ? current - previous : undefined;
          const changePercentage = previous !== undefined && previous !== 0
            ? parseFloat(((change! / previous) * 100).toFixed(2))
            : undefined;

          const trend: 'up' | 'down' | 'stable' =
            changePercentage === undefined ? 'stable' :
            changePercentage > 5 ? 'up' :
            changePercentage < -5 ? 'down' : 'stable';

          return {
            name,
            current: parseFloat(current.toFixed(2)),
            previous: previous !== undefined ? parseFloat(previous.toFixed(2)) : undefined,
            change: change !== undefined ? parseFloat(change.toFixed(2)) : undefined,
            changePercentage,
            trend
          };
        })
      };

      data.push(categoryData);
    });

    return data;
  }

  /**
   * Helper method to generate charts
   * @private
   */
  private generateCharts(data: Report['data'], reportType: string): Report['charts'] {
    const charts: Report['charts'] = [];

    // Add line chart for trends
    charts.push({
      type: 'line',
      title: 'Metric Trends',
      data: data.flatMap(d => d.metrics.map(m => ({
        category: d.category,
        metric: m.name,
        value: m.current
      })))
    });

    // Add bar chart for comparisons
    if (data.some(d => d.metrics.some(m => m.previous !== undefined))) {
      charts.push({
        type: 'bar',
        title: 'Current vs Previous Period',
        data: data.flatMap(d => d.metrics
          .filter(m => m.previous !== undefined)
          .map(m => ({
            metric: m.name,
            current: m.current,
            previous: m.previous
          }))
        )
      });
    }

    return charts;
  }

  /**
   * Helper method to extract insights
   * @private
   */
  private extractInsights(data: Report['data']): Report['insights'] {
    const insights: Report['insights'] = [];

    // Find biggest gains
    data.forEach(category => {
      category.metrics.forEach(metric => {
        if (metric.changePercentage && metric.changePercentage > 20) {
          insights.push({
            type: 'positive',
            title: `${metric.name} increased significantly`,
            description: `${metric.name} in ${category.category} increased by ${metric.changePercentage}% from ${metric.previous} to ${metric.current}`,
            recommendation: `Continue current strategies for ${metric.name}`,
            priority: 'high'
          });
        }

        if (metric.changePercentage && metric.changePercentage < -20) {
          insights.push({
            type: 'negative',
            title: `${metric.name} decreased significantly`,
            description: `${metric.name} in ${category.category} decreased by ${Math.abs(metric.changePercentage)}% from ${metric.previous} to ${metric.current}`,
            recommendation: `Investigate causes of ${metric.name} decline and implement corrective actions`,
            priority: 'high'
          });
        }
      });
    });

    return insights;
  }

  /**
   * Helper method to generate key findings
   * @private
   */
  private generateKeyFindings(data: Report['data'], insights: Report['insights']): string[] {
    const findings: string[] = [];

    // Top performing category
    const categorySums = data.map(d => ({
      category: d.category,
      total: d.metrics.reduce((sum, m) => sum + m.current, 0)
    }));

    categorySums.sort((a, b) => b.total - a.total);
    if (categorySums.length > 0) {
      findings.push(`${categorySums[0].category} is the top performing category`);
    }

    // Number of positive/negative trends
    const positiveCount = insights.filter(i => i.type === 'positive').length;
    const negativeCount = insights.filter(i => i.type === 'negative').length;

    if (positiveCount > negativeCount) {
      findings.push(`${positiveCount} metrics showing positive trends`);
    } else if (negativeCount > positiveCount) {
      findings.push(`${negativeCount} metrics require attention`);
    }

    return findings;
  }

  /**
   * Helper method to check monitors
   * @private
   */
  private async checkMonitors(metric: Metric): Promise<void> {
    for (const [id, monitor] of this.monitors.entries()) {
      if (monitor.status !== 'active') continue;
      if (!monitor.metrics.includes(metric.name)) continue;

      const threshold = monitor.thresholds?.find(t => t.metric === metric.name);
      if (!threshold) continue;

      let alertType: 'above_max' | 'below_min' | 'off_target' | null = null;
      let thresholdValue = 0;
      let severity: 'critical' | 'warning' | 'info' = 'info';

      if (threshold.max !== undefined && metric.value > threshold.max) {
        alertType = 'above_max';
        thresholdValue = threshold.max;
        severity = 'critical';
      } else if (threshold.min !== undefined && metric.value < threshold.min) {
        alertType = 'below_min';
        thresholdValue = threshold.min;
        severity = 'critical';
      } else if (threshold.target !== undefined) {
        const deviation = Math.abs((metric.value - threshold.target) / threshold.target);
        if (deviation > 0.2) {
          alertType = 'off_target';
          thresholdValue = threshold.target;
          severity = deviation > 0.5 ? 'critical' : 'warning';
        }
      }

      if (alertType) {
        monitor.alerts.push({
          id: `alert_${Date.now()}`,
          metric: metric.name,
          value: metric.value,
          threshold: thresholdValue,
          type: alertType,
          severity,
          timestamp: new Date(),
          resolved: false
        });

        await this.sendAlert(monitor, metric, alertType, severity);
      }
    }
  }

  /**
   * Helper method to send alert
   * @private
   */
  private async sendAlert(
    monitor: PerformanceMonitor,
    metric: Metric,
    type: string,
    severity: string
  ): Promise<void> {
    console.log(`ALERT [${severity}]: ${metric.name} = ${metric.value} (${type})`);
    // TODO: Implement actual alert sending
  }

  /**
   * Helper method to start monitoring
   * @private
   */
  private startMonitoring(monitor: PerformanceMonitor): void {
    // TODO: Implement actual monitoring loop
    console.log(`Monitoring started for ${monitor.metrics.join(', ')}`);
  }

  /**
   * Helper method to get widget data
   * @private
   */
  private async getWidgetData(widget: DashboardOptions['widgets'][0]): Promise<any> {
    // TODO: Implement actual widget data fetching
    if (widget.type === 'metric' && widget.metric) {
      const metrics = Array.from(this.metrics.values())
        .filter(m => m.name === widget.metric);

      return metrics.length > 0
        ? metrics[metrics.length - 1].value
        : 0;
    }

    return null;
  }

  /**
   * Helper method to calculate ROI metrics
   * @private
   */
  private calculateROIMetrics(options: ROIAnalysisOptions): ROIAnalysis['metrics'] {
    const cac = options.investment.total / 100; // Simplified
    const roas = options.revenue.total / options.investment.total;
    const conversionRate = 2.5; // Simplified

    return {
      cac,
      ltv: cac * 5, // Simplified LTV
      roas: parseFloat(roas.toFixed(2)),
      conversionRate,
      ctr: 3.5 // Simplified CTR
    };
  }

  /**
   * Helper method to generate ROI projections
   * @private
   */
  private generateROIProjections(
    options: ROIAnalysisOptions,
    currentROI: number,
    metrics: ROIAnalysis['metrics']
  ): ROIAnalysis['projections'] {
    return {
      period: 'quarter',
      projectedRevenue: options.revenue.total * 1.2,
      projectedROI: currentROI * 1.15,
      confidence: 75
    };
  }

  /**
   * Helper method to generate ROI recommendations
   * @private
   */
  private generateROIRecommendations(
    roi: number,
    metrics: ROIAnalysis['metrics'],
    options: ROIAnalysisOptions
  ): ROIAnalysis['recommendations'] {
    const recommendations: ROIAnalysis['recommendations'] = [];

    if (roi < 100) {
      recommendations.push({
        category: 'Optimization',
        action: 'Review and optimize underperforming campaigns',
        expectedImpact: 'Increase ROI by 20-30%',
        priority: 'high'
      });
    }

    if (metrics.conversionRate < 5) {
      recommendations.push({
        category: 'Conversion',
        action: 'Implement conversion rate optimization (CRO) strategies',
        expectedImpact: 'Increase conversion rate to 5%+',
        priority: 'high'
      });
    }

    return recommendations;
  }

  /**
   * Helper method to calculate payback period
   * @private
   */
  private calculatePaybackPeriod(options: ROIAnalysisOptions): number {
    const dailyRevenue = options.revenue.total / 30; // Simplified
    return Math.ceil(options.investment.total / dailyRevenue);
  }

  /**
   * Helper method to calculate break-even point
   * @private
   */
  private calculateBreakEvenPoint(options: ROIAnalysisOptions): Date {
    const paybackDays = this.calculatePaybackPeriod(options);
    return new Date(options.dateRange.start.getTime() + paybackDays * 24 * 60 * 60 * 1000);
  }

  /**
   * Helper method to prepare metrics export
   * @private
   */
  private prepareMetricsExport(options: ExportOptions): any[] {
    let metrics = Array.from(this.metrics.values());

    if (options.dateRange) {
      metrics = metrics.filter(m =>
        m.timestamp >= options.dateRange!.start &&
        m.timestamp <= options.dateRange!.end
      );
    }

    if (options.filters?.category) {
      metrics = metrics.filter(m => m.category === options.filters!.category);
    }

    return metrics;
  }

  /**
   * Helper method to format export data
   * @private
   */
  private formatExport(data: any, format: string, options: ExportOptions): any {
    switch (format) {
      case 'json':
        return data;
      case 'csv':
        return this.convertToCSV(data);
      case 'excel':
        return this.convertToExcel(data);
      case 'pdf':
        return this.convertToPDF(data, options);
      default:
        return data;
    }
  }

  /**
   * Helper method to convert to CSV
   * @private
   */
  private convertToCSV(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map(item =>
      headers.map(header => JSON.stringify(item[header] ?? '')).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Helper method to convert to Excel
   * @private
   */
  private convertToExcel(data: any): any {
    // TODO: Implement actual Excel conversion (using exceljs or similar)
    return { format: 'excel', data };
  }

  /**
   * Helper method to convert to PDF
   * @private
   */
  private convertToPDF(data: any, options: ExportOptions): any {
    // TODO: Implement actual PDF generation (using puppeteer or pdfkit)
    return { format: 'pdf', data, includeCharts: options.includeCharts };
  }

  /**
   * Helper method to generate file name
   * @private
   */
  private generateFileName(options: ExportOptions): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `analytics_${options.dataType}_${timestamp}.${options.format}`;
  }

  /**
   * Helper method to format bytes
   * @private
   */
  private formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /**
   * Helper method to generate metric ID
   * @private
   */
  private generateMetricId(): string {
    this.metricIdCounter++;
    return `metric_${Date.now()}_${this.metricIdCounter.toString().padStart(6, '0')}`;
  }

  /**
   * Helper method to generate report ID
   * @private
   */
  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Helper method to generate monitor ID
   * @private
   */
  private generateMonitorId(): string {
    return `monitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Helper method to generate dashboard ID
   * @private
   */
  private generateDashboardId(): string {
    return `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Helper method to generate ROI analysis ID
   * @private
   */
  private generateROIAnalysisId(): string {
    return `roi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Helper method to generate export ID
   * @private
   */
  private generateExportId(): string {
    return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
