/**
 * create-multiple-niches.ts
 *
 * Example demonstrating how to manage multiple niche empires simultaneously.
 * Shows EmpireManager features: creating, listing, status tracking, pausing,
 * resuming, deleting, and syncing multiple empires across different niches.
 */

import { EmpireManager } from '../src/core/EmpireManager';
import { NicheAnalyzer } from '../src/core/NicheAnalyzer';
import { BrandGenerator } from '../src/generators/BrandGenerator';
import { ProductGenerator } from '../src/generators/ProductGenerator';
import { WebsiteGenerator } from '../src/generators/WebsiteGenerator';
import { SocialMediaGenerator } from '../src/generators/SocialMediaGenerator';
import { DatabaseDeployer } from '../src/deployers/DatabaseDeployer';
import { WebsiteDeployer } from '../src/deployers/WebsiteDeployer';
import { AnalyticsTracker } from '../src/automation/AnalyticsTracker';

// ============================================================================
// INTERFACES
// ============================================================================

interface EmpireConfig {
  niche: string;
  description: string;
  targetAudience: string;
  productTypes: string[];
  priority: 'high' | 'medium' | 'low';
}

interface EmpireSnapshot {
  id: string;
  niche: string;
  brandName: string;
  status: string;
  phase: string;
  revenue: number;
  products: number;
  socialFollowers: number;
  websiteTraffic: number;
  healthScore: number;
  createdAt: Date;
  lastUpdated: Date;
}

interface PortfolioMetrics {
  totalEmpires: number;
  activeEmpires: number;
  pausedEmpires: number;
  totalRevenue: number;
  totalProducts: number;
  totalFollowers: number;
  avgHealthScore: number;
  topPerformer: string;
  needsAttention: string[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function printSection(title: string): void {
  console.log('\n' + '='.repeat(80));
  console.log(`  ${title}`);
  console.log('='.repeat(80) + '\n');
}

function printSubSection(title: string): void {
  console.log('\n' + '-'.repeat(60));
  console.log(`  ${title}`);
  console.log('-'.repeat(60));
}

function printSuccess(message: string): void {
  console.log(`✓ ${message}`);
}

function printWarning(message: string): void {
  console.log(`⚠ ${message}`);
}

function printInfo(label: string, value: any): void {
  const displayValue = typeof value === 'object' && !(value instanceof Date)
    ? JSON.stringify(value, null, 2)
    : value instanceof Date
    ? value.toLocaleDateString()
    : value;
  console.log(`  ${label}: ${displayValue}`);
}

function printTable(headers: string[], rows: string[][]): void {
  const colWidths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map(row => (row[i] || '').toString().length))
  );

  const separator = colWidths.map(width => '-'.repeat(width + 2)).join('+');
  const headerRow = headers
    .map((header, i) => ` ${header.padEnd(colWidths[i])} `)
    .join('|');

  console.log(separator);
  console.log(headerRow);
  console.log(separator);

  rows.forEach(row => {
    const rowStr = row
      .map((cell, i) => ` ${cell.toString().padEnd(colWidths[i])} `)
      .join('|');
    console.log(rowStr);
  });

  console.log(separator);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EMPIRE CONFIGURATION
// ============================================================================

const EMPIRE_CONFIGS: EmpireConfig[] = [
  {
    niche: 'fitness',
    description: 'Fitness and wellness programs for busy professionals',
    targetAudience: 'Professionals aged 25-45',
    productTypes: ['digital', 'membership'],
    priority: 'high',
  },
  {
    niche: 'tech gadgets',
    description: 'Smart home and productivity tech for modern living',
    targetAudience: 'Tech enthusiasts aged 20-40',
    productTypes: ['physical', 'digital'],
    priority: 'medium',
  },
  {
    niche: 'eco-friendly products',
    description: 'Sustainable and eco-conscious lifestyle products',
    targetAudience: 'Environmentally conscious consumers aged 25-50',
    productTypes: ['physical', 'subscription'],
    priority: 'high',
  },
];

// ============================================================================
// MAIN EXAMPLE
// ============================================================================

async function createMultipleEmpires() {
  printSection('MANAGING MULTIPLE NICHE EMPIRES');

  console.log('This example demonstrates:');
  console.log('• Creating multiple empires simultaneously');
  console.log('• Tracking status across all empires');
  console.log('• Pausing and resuming empires');
  console.log('• Syncing updates across portfolio');
  console.log('• Portfolio-level analytics and insights');
  console.log('• Managing empire lifecycle\n');

  // ============================================================================
  // STEP 1: INITIALIZE EMPIRE MANAGER
  // ============================================================================

  printSection('STEP 1: Initialize Empire Manager');

  const empireManager = new EmpireManager();
  const nicheAnalyzer = new NicheAnalyzer();

  printSuccess('Empire Manager initialized');
  printInfo('Ready to create empires', EMPIRE_CONFIGS.length);

  // ============================================================================
  // STEP 2: CREATE MULTIPLE EMPIRES
  // ============================================================================

  printSection('STEP 2: Create Multiple Empires');

  const empireData = new Map<string, any>();

  for (const config of EMPIRE_CONFIGS) {
    printSubSection(`Creating Empire: ${config.niche.toUpperCase()}`);

    // Create empire
    const empire = await empireManager.createEmpire(config.niche, {
      apiKey: 'demo_api_key',
      region: 'us-east-1',
      priority: config.priority,
    });

    printSuccess(`Empire created: ${empire.id}`);
    printInfo('Niche', empire.niche);
    printInfo('Status', empire.status);
    printInfo('Priority', config.priority);

    // Quick niche analysis
    console.log('\n  Analyzing niche...');
    const trends = await nicheAnalyzer.analyzeTrends(config.niche, {
      timeframe: 'last_year',
    });

    printInfo('Trend Score', `${trends.trendScore}/100`);
    printInfo('Growth Rate', `${trends.growthRate}%`);

    // Store empire data
    empireData.set(empire.id, {
      empire,
      config,
      trends,
      createdAt: new Date(),
    });

    await delay(500); // Small delay between creations
  }

  // ============================================================================
  // STEP 3: LIST ALL EMPIRES
  // ============================================================================

  printSection('STEP 3: List All Empires');

  const allEmpires = await empireManager.listEmpires();

  printSuccess(`Total empires: ${allEmpires.length}`);

  const empireTableRows = allEmpires.map(emp => [
    emp.id.substring(0, 12) + '...',
    emp.niche,
    emp.status,
    emp.metadata.phase || 'initialized',
    emp.createdAt.toLocaleString(),
  ]);

  printTable(
    ['Empire ID', 'Niche', 'Status', 'Phase', 'Created At'],
    empireTableRows
  );

  // ============================================================================
  // STEP 4: BUILD OUT EACH EMPIRE IN PARALLEL
  // ============================================================================

  printSection('STEP 4: Build Out Each Empire');

  console.log('Building brands, products, and infrastructure for all empires...\n');

  const buildPromises = Array.from(empireData.entries()).map(
    async ([empireId, data]) => {
      const { empire, config } = data;

      printSubSection(`Building ${config.niche.toUpperCase()} Empire`);

      try {
        // Generate brand
        const brandGenerator = new BrandGenerator();
        brandGenerator.setContext({ niche: config.niche });

        const brandNames = await brandGenerator.generateBrandName(config.niche, {
          style: 'modern',
          count: 1,
        });
        const brand = brandNames.suggestions[0];

        printSuccess(`Brand created: ${brand.name}`);

        // Generate tagline
        const tagline = await brandGenerator.createTagline(brand.name, config.niche);
        printSuccess(`Tagline: ${tagline.taglines[0].text}`);

        // Create product
        const productGenerator = new ProductGenerator();
        productGenerator.setContext({ brand: brand.name, niche: config.niche });

        const products = await productGenerator.generateProductIdeas(config.niche, {
          count: 3,
          productType: config.productTypes[0] as any,
        });

        printSuccess(`Products created: ${products.products.length}`);

        // Set pricing for first product
        const pricing = await productGenerator.setPricing(
          products.products[0].name,
          49.99,
          'digital_product'
        );

        printSuccess(`Pricing set: $${pricing.basePrice.toFixed(2)}`);

        // Update empire metadata
        empire.metadata = {
          ...empire.metadata,
          phase: 'branded',
          brand: brand.name,
          tagline: tagline.taglines[0].text,
          productCount: products.products.length,
          pricing: pricing.basePrice,
        };

        // Store updated data
        data.brand = brand;
        data.tagline = tagline;
        data.products = products;
        data.pricing = pricing;

        return { empireId, success: true, brand: brand.name };
      } catch (error) {
        console.error(`Error building ${config.niche} empire:`, error);
        return { empireId, success: false, error };
      }
    }
  );

  const buildResults = await Promise.all(buildPromises);

  console.log('\n');
  printSuccess(`Built ${buildResults.filter(r => r.success).length} empires successfully`);

  // ============================================================================
  // STEP 5: CHECK STATUS OF ALL EMPIRES
  // ============================================================================

  printSection('STEP 5: Check Empire Status');

  for (const [empireId, data] of empireData.entries()) {
    const status = await empireManager.getEmpireStatus(empireId);

    printSubSection(`${data.config.niche.toUpperCase()} Status`);

    printInfo('Empire ID', empireId.substring(0, 20) + '...');
    printInfo('Status', status.status);
    printInfo('Phase', status.phase);
    printInfo('Brand', status.metadata?.brand || 'Not set');
    printInfo('Products', status.metadata?.productCount || 0);
    printInfo('Last Updated', status.lastUpdated.toLocaleTimeString());
    printInfo('Runtime', `${Math.floor((Date.now() - status.createdAt.getTime()) / 1000)}s`);

    if (status.metrics) {
      printInfo('Metrics', status.metrics);
    }
  }

  // ============================================================================
  // STEP 6: DEPLOY INFRASTRUCTURE FOR EACH EMPIRE
  // ============================================================================

  printSection('STEP 6: Deploy Infrastructure');

  console.log('Deploying databases and websites for all empires...\n');

  const databaseDeployer = new DatabaseDeployer();
  const websiteDeployer = new WebsiteDeployer();

  for (const [empireId, data] of empireData.entries()) {
    printSubSection(`Deploying ${data.config.niche.toUpperCase()}`);

    try {
      // Setup database
      const projectName = data.brand.name.toLowerCase().replace(/\s/g, '-');
      const dbProject = await databaseDeployer.setupSupabase({
        projectName,
        region: 'us-east-1',
        plan: 'free',
      });

      printSuccess(`Database deployed: ${dbProject.id.substring(0, 15)}...`);

      // Create tables
      const tables = await databaseDeployer.createTables(dbProject.id, [
        {
          name: 'products',
          columns: [
            { name: 'id', type: 'uuid', nullable: false, default: 'uuid_generate_v4()' },
            { name: 'name', type: 'varchar', length: 255, nullable: false },
            { name: 'price', type: 'decimal', precision: 10, scale: 2 },
          ],
          primaryKey: 'id',
          timestamps: true,
        },
        {
          name: 'customers',
          columns: [
            { name: 'id', type: 'uuid', nullable: false, default: 'uuid_generate_v4()' },
            { name: 'email', type: 'varchar', length: 255, unique: true },
          ],
          primaryKey: 'id',
          timestamps: true,
        },
      ]);

      printSuccess(`Tables created: ${tables.length}`);

      // Deploy website
      const deployment = await websiteDeployer.deployToVercel({
        projectName,
        platform: 'vercel',
        buildCommand: 'npm run build',
        outputDirectory: '.next',
        framework: 'nextjs',
      });

      printSuccess(`Website deployed: ${deployment.deploymentUrl.substring(0, 40)}...`);

      // Update empire metadata
      data.empire.metadata = {
        ...data.empire.metadata,
        phase: 'deployed',
        database: dbProject.id,
        website: deployment.id,
        deploymentUrl: deployment.deploymentUrl,
      };

      data.database = dbProject;
      data.deployment = deployment;
    } catch (error) {
      printWarning(`Deployment failed for ${data.config.niche}`);
    }

    await delay(300);
  }

  // ============================================================================
  // STEP 7: SIMULATE EMPIRE OPERATIONS
  // ============================================================================

  printSection('STEP 7: Simulate Empire Operations');

  console.log('Simulating traffic, sales, and engagement...\n');

  const analyticsTracker = new AnalyticsTracker();

  for (const [empireId, data] of empireData.entries()) {
    printSubSection(`Simulating ${data.config.niche.toUpperCase()}`);

    // Simulate metrics based on priority
    const multiplier = data.config.priority === 'high' ? 1.5 : data.config.priority === 'medium' ? 1.0 : 0.7;

    // Track revenue
    const revenue = Math.floor(Math.random() * 5000 * multiplier);
    await analyticsTracker.trackMetrics({
      category: 'revenue',
      name: 'total_revenue',
      value: revenue,
      unit: 'USD',
      dimensions: { empireId, niche: data.config.niche },
    });

    // Track traffic
    const traffic = Math.floor(Math.random() * 10000 * multiplier);
    await analyticsTracker.trackMetrics({
      category: 'traffic',
      name: 'page_views',
      value: traffic,
      unit: 'count',
      dimensions: { empireId, niche: data.config.niche },
    });

    // Track conversions
    const conversions = Math.floor(Math.random() * 100 * multiplier);
    await analyticsTracker.trackMetrics({
      category: 'sales',
      name: 'conversions',
      value: conversions,
      unit: 'count',
      dimensions: { empireId, niche: data.config.niche },
    });

    printInfo('Revenue', `$${revenue.toLocaleString()}`);
    printInfo('Traffic', traffic.toLocaleString());
    printInfo('Conversions', conversions);

    // Store metrics
    data.metrics = { revenue, traffic, conversions };
  }

  // ============================================================================
  // STEP 8: PAUSE LOW-PERFORMING EMPIRE
  // ============================================================================

  printSection('STEP 8: Pause Low-Performing Empire');

  // Find lowest revenue empire
  const sortedByRevenue = Array.from(empireData.entries()).sort(
    (a, b) => (b[1].metrics?.revenue || 0) - (a[1].metrics?.revenue || 0)
  );

  const lowestPerformer = sortedByRevenue[sortedByRevenue.length - 1];
  const [lowestEmpireId, lowestData] = lowestPerformer;

  printInfo('Lowest Performer', lowestData.config.niche);
  printInfo('Revenue', `$${lowestData.metrics?.revenue || 0}`);

  console.log('\nPausing empire to focus on higher performers...');

  const pauseResult = await empireManager.pauseEmpire(lowestEmpireId);

  printSuccess('Empire paused');
  printInfo('Empire ID', lowestEmpireId.substring(0, 20) + '...');
  printInfo('Niche', lowestData.config.niche);
  printInfo('Reason', pauseResult.message);

  // ============================================================================
  // STEP 9: SYNC ALL EMPIRES
  // ============================================================================

  printSection('STEP 9: Sync All Empires');

  console.log('Syncing all empires with latest data and configurations...\n');

  const syncResults = await empireManager.syncAllEmpires();

  printSuccess('Sync completed');
  printInfo('Total Synced', syncResults.totalEmpires);
  printInfo('Successful', syncResults.successful);
  printInfo('Failed', syncResults.failed);
  printInfo('Duration', `${syncResults.duration}ms`);

  if (syncResults.errors.length > 0) {
    console.log('\nSync Errors:');
    syncResults.errors.forEach(error => {
      printWarning(`${error.empireId.substring(0, 15)}... - ${error.error}`);
    });
  }

  // ============================================================================
  // STEP 10: RESUME PAUSED EMPIRE
  // ============================================================================

  printSection('STEP 10: Resume Paused Empire');

  console.log('After optimization, resuming the paused empire...\n');

  const resumeResult = await empireManager.resumeEmpire(lowestEmpireId);

  printSuccess('Empire resumed');
  printInfo('Empire ID', lowestEmpireId.substring(0, 20) + '...');
  printInfo('Niche', lowestData.config.niche);
  printInfo('Status', resumeResult.empire.status);

  // ============================================================================
  // STEP 11: PORTFOLIO ANALYTICS
  // ============================================================================

  printSection('STEP 11: Portfolio Analytics');

  const portfolioMetrics = calculatePortfolioMetrics(empireData);

  printSubSection('Overall Portfolio Performance');

  printInfo('Total Empires', portfolioMetrics.totalEmpires);
  printInfo('Active Empires', portfolioMetrics.activeEmpires);
  printInfo('Paused Empires', portfolioMetrics.pausedEmpires);
  printInfo('Total Revenue', `$${portfolioMetrics.totalRevenue.toLocaleString()}`);
  printInfo('Total Products', portfolioMetrics.totalProducts);
  printInfo('Avg Health Score', `${portfolioMetrics.avgHealthScore}/100`);
  printInfo('Top Performer', portfolioMetrics.topPerformer);

  if (portfolioMetrics.needsAttention.length > 0) {
    console.log('\n⚠ Empires Needing Attention:');
    portfolioMetrics.needsAttention.forEach(niche => {
      console.log(`  • ${niche}`);
    });
  }

  // ============================================================================
  // STEP 12: EMPIRE COMPARISON
  // ============================================================================

  printSection('STEP 12: Empire Comparison');

  const snapshots = createEmpireSnapshots(empireData);

  console.log('\nDetailed Empire Comparison:\n');

  const comparisonRows = snapshots.map(snap => [
    snap.niche,
    snap.status,
    snap.phase,
    `$${snap.revenue.toLocaleString()}`,
    snap.products.toString(),
    snap.websiteTraffic.toLocaleString(),
    `${snap.healthScore}/100`,
  ]);

  printTable(
    ['Niche', 'Status', 'Phase', 'Revenue', 'Products', 'Traffic', 'Health'],
    comparisonRows
  );

  // ============================================================================
  // STEP 13: DELETE UNDERPERFORMING EMPIRE (OPTIONAL)
  // ============================================================================

  printSection('STEP 13: Delete Underperforming Empire (Demo)');

  console.log('Demonstrating empire deletion (if needed for portfolio optimization)...\n');

  // For demo, we'll create a test empire and delete it
  const testEmpire = await empireManager.createEmpire('test-niche', {
    apiKey: 'test_key',
  });

  printInfo('Created Test Empire', testEmpire.id.substring(0, 20) + '...');

  await delay(1000);

  const deleteResult = await empireManager.deleteEmpire(testEmpire.id);

  printSuccess('Test empire deleted');
  printInfo('Empire ID', testEmpire.id.substring(0, 20) + '...');
  printInfo('Message', deleteResult.message);
  printInfo('Data Removed', deleteResult.dataRemoved ? 'Yes' : 'No');

  // Verify deletion
  const remainingEmpires = await empireManager.listEmpires();
  printInfo('Remaining Empires', remainingEmpires.length);

  // ============================================================================
  // STEP 14: CONTINUOUS MONITORING
  // ============================================================================

  printSection('STEP 14: Continuous Monitoring Setup');

  console.log('Setting up continuous monitoring for all empires...\n');

  for (const [empireId, data] of empireData.entries()) {
    printSubSection(`Monitoring ${data.config.niche.toUpperCase()}`);

    // Setup performance monitoring
    const monitoring = await analyticsTracker.monitorPerformance({
      metrics: ['response_time', 'error_rate', 'conversion_rate'],
      interval: 300,
      alerts: [
        {
          id: `alert_${empireId}_1`,
          name: 'High Error Rate',
          metric: 'error_rate',
          threshold: 5,
          comparison: 'greater_than',
          severity: 'critical',
          enabled: true,
        },
      ],
    });

    printSuccess('Monitoring configured');
    printInfo('Active Monitors', monitoring.monitors.length);
    printInfo('Health Status', monitoring.healthStatus);
  }

  // ============================================================================
  // STEP 15: GENERATE ROI ANALYSIS
  // ============================================================================

  printSection('STEP 15: ROI Analysis');

  console.log('Analyzing return on investment for each empire...\n');

  for (const [empireId, data] of empireData.entries()) {
    printSubSection(`${data.config.niche.toUpperCase()} ROI`);

    const roiAnalysis = await analyticsTracker.analyzeROI({
      empireId,
      timeframe: 'last_30_days',
      metrics: ['revenue', 'costs', 'profit'],
      campaigns: [],
    });

    printInfo('Total Revenue', `$${roiAnalysis.totalRevenue.toLocaleString()}`);
    printInfo('Total Costs', `$${roiAnalysis.totalCosts.toLocaleString()}`);
    printInfo('Total Profit', `$${roiAnalysis.totalProfit.toLocaleString()}`);
    printInfo('ROI', `${roiAnalysis.roi.toFixed(2)}%`);
    printInfo('ROI Status', roiAnalysis.status);

    if (roiAnalysis.topPerformingCampaigns.length > 0) {
      console.log('\n  Top Campaigns:');
      roiAnalysis.topPerformingCampaigns.slice(0, 2).forEach(campaign => {
        console.log(`    • ${campaign.name}: ${campaign.roi.toFixed(1)}% ROI`);
      });
    }

    if (roiAnalysis.recommendations.length > 0) {
      console.log('\n  Recommendations:');
      roiAnalysis.recommendations.slice(0, 2).forEach(rec => {
        console.log(`    • ${rec}`);
      });
    }
  }

  // ============================================================================
  // FINAL SUMMARY
  // ============================================================================

  printSection('PORTFOLIO MANAGEMENT COMPLETE!');

  console.log('\n✨ Successfully managed multiple niche empires!\n');

  console.log('📊 PORTFOLIO SUMMARY:\n');
  console.log(`  Total Empires: ${portfolioMetrics.totalEmpires}`);
  console.log(`  Active: ${portfolioMetrics.activeEmpires}`);
  console.log(`  Combined Revenue: $${portfolioMetrics.totalRevenue.toLocaleString()}`);
  console.log(`  Total Products: ${portfolioMetrics.totalProducts}`);
  console.log(`  Average Health: ${portfolioMetrics.avgHealthScore}/100`);

  console.log('\n🏆 TOP PERFORMERS:\n');
  const topThree = snapshots
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  topThree.forEach((snap, index) => {
    console.log(`  ${index + 1}. ${snap.brandName} (${snap.niche})`);
    console.log(`     Revenue: $${snap.revenue.toLocaleString()}`);
    console.log(`     Health: ${snap.healthScore}/100`);
    console.log(`     Status: ${snap.status}\n`);
  });

  console.log('🔧 EMPIRE MANAGER FEATURES DEMONSTRATED:\n');
  console.log('  ✓ createEmpire() - Created multiple empires');
  console.log('  ✓ listEmpires() - Listed all empires');
  console.log('  ✓ getEmpireStatus() - Checked status of each empire');
  console.log('  ✓ pauseEmpire() - Paused low-performing empire');
  console.log('  ✓ resumeEmpire() - Resumed paused empire');
  console.log('  ✓ deleteEmpire() - Deleted test empire');
  console.log('  ✓ syncAllEmpires() - Synced all empires');

  console.log('\n📈 INSIGHTS:\n');
  console.log(`  • ${data.config.niche} shows highest growth potential`);
  console.log(`  • Portfolio generating $${portfolioMetrics.totalRevenue.toLocaleString()} total revenue`);
  console.log(`  • ${portfolioMetrics.activeEmpires} empires actively generating income`);
  console.log(`  • Average ROI across portfolio: Positive`);

  console.log('\n🎯 RECOMMENDED ACTIONS:\n');
  console.log('  1. Scale up top-performing empires with additional products');
  console.log('  2. Optimize underperforming empires before next review');
  console.log('  3. Expand social media presence for all empires');
  console.log('  4. A/B test pricing strategies across portfolio');
  console.log('  5. Consider diversifying into complementary niches');

  console.log('\n💡 PORTFOLIO MANAGEMENT TIPS:\n');
  console.log('  • Review empire health scores weekly');
  console.log('  • Pause empires during seasonal downturns');
  console.log('  • Sync settings regularly to maintain consistency');
  console.log('  • Monitor ROI to identify growth opportunities');
  console.log('  • Delete only after thorough analysis');

  printSection('THANK YOU FOR USING NICHE EMPIRE BUILDER!');
}

// ============================================================================
// HELPER FUNCTIONS FOR ANALYTICS
// ============================================================================

function calculatePortfolioMetrics(empireData: Map<string, any>): PortfolioMetrics {
  let totalRevenue = 0;
  let totalProducts = 0;
  let totalFollowers = 0;
  let totalHealthScore = 0;
  let activeCount = 0;
  let pausedCount = 0;
  let topRevenue = 0;
  let topPerformer = '';
  const needsAttention: string[] = [];

  for (const [empireId, data] of empireData.entries()) {
    const empire = data.empire;
    const metrics = data.metrics || {};

    // Count active/paused
    if (empire.status === 'active') activeCount++;
    if (empire.status === 'paused') pausedCount++;

    // Sum metrics
    totalRevenue += metrics.revenue || 0;
    totalProducts += data.empire.metadata?.productCount || 0;
    totalFollowers += Math.floor(Math.random() * 5000); // Simulated

    // Calculate health score (simplified)
    const healthScore = Math.min(
      100,
      Math.floor(
        ((metrics.revenue || 0) / 50) +
        ((metrics.traffic || 0) / 100) +
        ((metrics.conversions || 0) / 1) +
        30
      )
    );

    totalHealthScore += healthScore;

    // Track top performer
    if ((metrics.revenue || 0) > topRevenue) {
      topRevenue = metrics.revenue || 0;
      topPerformer = data.brand?.name || data.config.niche;
    }

    // Identify empires needing attention
    if (healthScore < 60) {
      needsAttention.push(data.config.niche);
    }
  }

  const totalEmpires = empireData.size;

  return {
    totalEmpires,
    activeEmpires: activeCount,
    pausedEmpires: pausedCount,
    totalRevenue,
    totalProducts,
    totalFollowers,
    avgHealthScore: Math.floor(totalHealthScore / totalEmpires),
    topPerformer,
    needsAttention,
  };
}

function createEmpireSnapshots(empireData: Map<string, any>): EmpireSnapshot[] {
  const snapshots: EmpireSnapshot[] = [];

  for (const [empireId, data] of empireData.entries()) {
    const metrics = data.metrics || {};

    const healthScore = Math.min(
      100,
      Math.floor(
        ((metrics.revenue || 0) / 50) +
        ((metrics.traffic || 0) / 100) +
        ((metrics.conversions || 0) / 1) +
        30
      )
    );

    snapshots.push({
      id: empireId,
      niche: data.config.niche,
      brandName: data.brand?.name || 'Pending',
      status: data.empire.status,
      phase: data.empire.metadata?.phase || 'initialized',
      revenue: metrics.revenue || 0,
      products: data.empire.metadata?.productCount || 0,
      socialFollowers: Math.floor(Math.random() * 5000),
      websiteTraffic: metrics.traffic || 0,
      healthScore,
      createdAt: data.empire.createdAt,
      lastUpdated: data.empire.updatedAt,
    });
  }

  return snapshots;
}

// ============================================================================
// RUN EXAMPLE
// ============================================================================

// Uncomment to run the example
// createMultipleEmpires()
//   .then(() => {
//     console.log('\n\nExample completed successfully!');
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error('\n\nExample failed:', error);
//     process.exit(1);
//   });

// Export for use in other files
export { createMultipleEmpires };
