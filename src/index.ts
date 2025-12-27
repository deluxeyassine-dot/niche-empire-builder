/**
 * Niche Empire Builder - Main Entry Point
 *
 * A comprehensive TypeScript framework for building and managing
 * multiple online business empires across different niches.
 *
 * @version 1.0.0
 * @author Niche Empire Builder Team
 * @license MIT
 */

// ============================================================================
// CORE MODULES
// ============================================================================

/**
 * Core business logic and empire management
 */
export { NicheEmpireBuilder } from './core/NicheEmpireBuilder';
export { NicheAnalyzer } from './core/NicheAnalyzer';
export { EmpireManager } from './core/EmpireManager';

// ============================================================================
// GENERATORS
// ============================================================================

/**
 * Content and asset generation tools
 */
export { BrandGenerator } from './generators/BrandGenerator';
export { ProductGenerator } from './generators/ProductGenerator';
export { ContentGenerator } from './generators/ContentGenerator';
export { WebsiteGenerator } from './generators/WebsiteGenerator';
export { SocialMediaGenerator } from './generators/SocialMediaGenerator';

// ============================================================================
// AUTOMATION
// ============================================================================

/**
 * Marketing and service automation
 */
export { ContentScheduler } from './automation/ContentScheduler';
export { EmailAutomation } from './automation/EmailAutomation';
export { CustomerService } from './automation/CustomerService';
export { AnalyticsTracker } from './automation/AnalyticsTracker';

// ============================================================================
// DEPLOYERS
// ============================================================================

/**
 * Infrastructure deployment and management
 */
export { DatabaseDeployer } from './deployers/DatabaseDeployer';
export { WebsiteDeployer } from './deployers/WebsiteDeployer';
export { SocialMediaDeployer } from './deployers/SocialMediaDeployer';

// ============================================================================
// DASHBOARD
// ============================================================================

/**
 * Monitoring and visualization
 */
export { EmpireDashboard } from './dashboard/EmpireDashboard';

// ============================================================================
// CONVENIENCE API
// ============================================================================

import { NicheEmpireBuilder } from './core/NicheEmpireBuilder';
import { EmpireManager } from './core/EmpireManager';
import { EmpireDashboard } from './dashboard/EmpireDashboard';

/**
 * Configuration for initializing the Niche Empire Builder system
 */
export interface SystemConfig {
  /**
   * API key for authentication
   */
  apiKey: string;

  /**
   * OpenAI API key for AI-powered generation (optional)
   */
  openAIKey?: string;

  /**
   * Anthropic API key for Claude AI (optional)
   */
  anthropicKey?: string;

  /**
   * Default region for deployments
   * @default 'us-east-1'
   */
  region?: string;

  /**
   * Default language for content generation
   * @default 'en'
   */
  language?: string;

  /**
   * Default currency for pricing
   * @default 'USD'
   */
  currency?: string;

  /**
   * Default timezone
   * @default 'America/New_York'
   */
  timezone?: string;

  /**
   * Feature flags
   */
  features?: {
    /**
     * Enable analytics tracking
     * @default true
     */
    analytics?: boolean;

    /**
     * Enable automation features
     * @default true
     */
    automation?: boolean;

    /**
     * Enable AI-powered generation
     * @default true
     */
    aiGeneration?: boolean;

    /**
     * Enable real-time dashboard updates
     * @default true
     */
    realtimeUpdates?: boolean;
  };

  /**
   * Debug mode
   * @default false
   */
  debug?: boolean;
}

/**
 * System instance containing all initialized components
 */
export interface NicheEmpireSystem {
  /**
   * Main empire builder instance
   */
  builder: NicheEmpireBuilder;

  /**
   * Empire manager for portfolio management
   */
  manager: EmpireManager;

  /**
   * Dashboard instance (if enabled)
   */
  dashboard?: EmpireDashboard;

  /**
   * Configuration used
   */
  config: SystemConfig;

  /**
   * System version
   */
  version: string;

  /**
   * Initialization timestamp
   */
  initializedAt: Date;
}

/**
 * Initialize the Niche Empire Builder system with configuration
 *
 * This is a convenience function that sets up all core components
 * and returns a ready-to-use system instance.
 *
 * @param config - System configuration
 * @returns Initialized system instance
 *
 * @example
 * ```typescript
 * import { initializeSystem } from 'niche-empire-builder';
 *
 * const system = await initializeSystem({
 *   apiKey: 'your-api-key',
 *   openAIKey: 'your-openai-key',
 *   region: 'us-east-1',
 *   features: {
 *     analytics: true,
 *     automation: true,
 *     aiGeneration: true,
 *   },
 * });
 *
 * // Use the system
 * const empire = await system.manager.createEmpire('fitness');
 * ```
 */
export async function initializeSystem(config: SystemConfig): Promise<NicheEmpireSystem> {
  // Validate config
  if (!config.apiKey) {
    throw new Error('API key is required to initialize the system');
  }

  if (config.debug) {
    console.log('[NicheEmpireBuilder] Initializing system...');
    console.log('[NicheEmpireBuilder] Config:', { ...config, apiKey: '***', openAIKey: '***' });
  }

  // Initialize builder
  const builder = new NicheEmpireBuilder();
  await builder.initialize({
    apiKey: config.apiKey,
    openAIKey: config.openAIKey,
    region: config.region,
    language: config.language,
    currency: config.currency,
    timezone: config.timezone,
  });

  if (config.debug) {
    console.log('[NicheEmpireBuilder] Builder initialized');
  }

  // Initialize manager
  const manager = new EmpireManager();

  if (config.debug) {
    console.log('[NicheEmpireBuilder] Manager initialized');
  }

  // Initialize dashboard if real-time updates enabled
  let dashboard: EmpireDashboard | undefined;
  if (config.features?.realtimeUpdates !== false) {
    dashboard = new EmpireDashboard({
      enableRealtime: true,
      refreshInterval: 5,
    });

    if (config.debug) {
      console.log('[NicheEmpireBuilder] Dashboard initialized');
    }
  }

  const system: NicheEmpireSystem = {
    builder,
    manager,
    dashboard,
    config,
    version: '1.0.0',
    initializedAt: new Date(),
  };

  if (config.debug) {
    console.log('[NicheEmpireBuilder] System initialization complete');
  }

  return system;
}

/**
 * Quick start function to create a new empire
 *
 * This is the fastest way to get started with a new empire.
 * It handles initialization and basic setup automatically.
 *
 * @param niche - The niche to target
 * @param apiKey - Your API key
 * @param options - Additional options
 * @returns Empire builder instance
 *
 * @example
 * ```typescript
 * import { quickStart } from 'niche-empire-builder';
 *
 * const builder = await quickStart('fitness', 'your-api-key', {
 *   openAIKey: 'your-openai-key',
 *   autoLaunch: true,
 * });
 *
 * console.log('Empire created:', builder);
 * ```
 */
export async function quickStart(
  niche: string,
  apiKey: string,
  options?: {
    openAIKey?: string;
    region?: string;
    autoLaunch?: boolean;
    debug?: boolean;
  }
): Promise<NicheEmpireBuilder> {
  if (options?.debug) {
    console.log(`[NicheEmpireBuilder] Quick start for niche: ${niche}`);
  }

  // Initialize builder
  const builder = new NicheEmpireBuilder();
  await builder.initialize({
    apiKey,
    openAIKey: options?.openAIKey,
    region: options?.region,
  });

  if (options?.debug) {
    console.log('[NicheEmpireBuilder] Builder initialized');
  }

  // Analyze niche
  const nicheAnalysis = await builder.analyzeNiche(niche);

  if (options?.debug) {
    console.log('[NicheEmpireBuilder] Niche analyzed');
  }

  // Generate brand
  const brandData = await builder.generateBrand(nicheAnalysis);

  if (options?.debug) {
    console.log('[NicheEmpireBuilder] Brand generated');
  }

  // Create products
  const products = await builder.createProducts(brandData, 3);

  if (options?.debug) {
    console.log('[NicheEmpireBuilder] Products created');
  }

  // Build website
  const websiteData = await builder.buildWebsite(brandData, products);

  if (options?.debug) {
    console.log('[NicheEmpireBuilder] Website built');
  }

  if (options?.debug && options?.autoLaunch) {
    console.log('[NicheEmpireBuilder] Empire ready for launch!');
  }

  return builder;
}

/**
 * Create a portfolio of multiple empires
 *
 * @param niches - Array of niches to create empires for
 * @param apiKey - Your API key
 * @param options - Additional options
 * @returns Empire manager with all created empires
 *
 * @example
 * ```typescript
 * import { createPortfolio } from 'niche-empire-builder';
 *
 * const manager = await createPortfolio(
 *   ['fitness', 'tech gadgets', 'eco-friendly products'],
 *   'your-api-key',
 *   { parallel: true }
 * );
 *
 * const empires = await manager.listEmpires();
 * console.log(`Created ${empires.length} empires`);
 * ```
 */
export async function createPortfolio(
  niches: string[],
  apiKey: string,
  options?: {
    openAIKey?: string;
    region?: string;
    parallel?: boolean;
    debug?: boolean;
  }
): Promise<EmpireManager> {
  if (options?.debug) {
    console.log(`[NicheEmpireBuilder] Creating portfolio with ${niches.length} niches`);
  }

  const manager = new EmpireManager();

  if (options?.parallel) {
    // Create empires in parallel
    const promises = niches.map(niche =>
      manager.createEmpire(niche, {
        apiKey,
        openAIKey: options?.openAIKey,
        region: options?.region,
      })
    );

    await Promise.all(promises);

    if (options?.debug) {
      console.log('[NicheEmpireBuilder] All empires created in parallel');
    }
  } else {
    // Create empires sequentially
    for (const niche of niches) {
      await manager.createEmpire(niche, {
        apiKey,
        openAIKey: options?.openAIKey,
        region: options?.region,
      });

      if (options?.debug) {
        console.log(`[NicheEmpireBuilder] Created empire: ${niche}`);
      }
    }
  }

  if (options?.debug) {
    console.log('[NicheEmpireBuilder] Portfolio creation complete');
  }

  return manager;
}

/**
 * Launch the Empire Dashboard
 *
 * @param empireId - Empire ID to monitor
 * @param empireName - Display name for the empire
 * @param options - Dashboard options
 * @returns Initialized dashboard instance
 *
 * @example
 * ```typescript
 * import { launchDashboard } from 'niche-empire-builder';
 *
 * const dashboard = await launchDashboard(
 *   'empire-123',
 *   'My Fitness Empire',
 *   { enableRealtime: true, updateInterval: 5000 }
 * );
 *
 * const metrics = await dashboard.displayMetrics();
 * console.log('Current metrics:', metrics);
 * ```
 */
export async function launchDashboard(
  empireId: string,
  empireName: string,
  options?: {
    enableRealtime?: boolean;
    updateInterval?: number;
    debug?: boolean;
  }
): Promise<EmpireDashboard> {
  if (options?.debug) {
    console.log(`[NicheEmpireBuilder] Launching dashboard for: ${empireName}`);
  }

  const dashboard = new EmpireDashboard({
    enableRealtime: options?.enableRealtime ?? true,
    refreshInterval: options?.updateInterval ? options.updateInterval / 1000 : 5,
  });

  await dashboard.initializeDashboard();

  if (options?.debug) {
    console.log('[NicheEmpireBuilder] Dashboard launched successfully');
  }

  return dashboard;
}

// ============================================================================
// VERSION AND METADATA
// ============================================================================

/**
 * Library version
 */
export const VERSION = '1.0.0';

/**
 * Library metadata
 */
export const METADATA = {
  name: 'Niche Empire Builder',
  version: VERSION,
  description: 'AI-powered platform for building and managing multiple online business empires',
  author: 'Niche Empire Builder Team',
  license: 'MIT',
  homepage: 'https://github.com/yourusername/niche-empire-builder',
  repository: {
    type: 'git',
    url: 'https://github.com/yourusername/niche-empire-builder.git',
  },
  bugs: {
    url: 'https://github.com/yourusername/niche-empire-builder/issues',
  },
  keywords: [
    'niche',
    'empire',
    'business',
    'automation',
    'ai',
    'marketing',
    'ecommerce',
    'saas',
  ],
};

/**
 * Get system information
 *
 * @returns System metadata and version information
 *
 * @example
 * ```typescript
 * import { getSystemInfo } from 'niche-empire-builder';
 *
 * const info = getSystemInfo();
 * console.log(`${info.name} v${info.version}`);
 * ```
 */
export function getSystemInfo(): typeof METADATA {
  return { ...METADATA };
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

/**
 * Default export - Main builder class
 */
export default NicheEmpireBuilder;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Re-export commonly used types for convenience
 * (These would be imported from the individual modules)
 */
export type {
  // Add type exports here as needed
  // Example:
  // Empire,
  // EmpireStatus,
  // Brand,
  // Product,
  // etc.
};
