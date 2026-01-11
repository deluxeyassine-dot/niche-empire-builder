/**
 * AGENT ORCHESTRATOR
 *
 * Central coordinator for all 52 AI agents
 * Manages agent execution, dependencies, and workflows
 *
 * Uses dynamic imports to avoid build-time issues with agent files
 */

export interface AgentExecutionResult {
  agentName: string;
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
}

export interface WorkflowResult {
  workflowName: string;
  totalAgents: number;
  successfulAgents: number;
  failedAgents: number;
  results: AgentExecutionResult[];
  totalExecutionTime: number;
}

export class AgentOrchestrator {
  private agentNames: Set<string> = new Set();

  constructor() {
    this.initializeAgentNames();
  }

  private initializeAgentNames() {
    // Content Discovery Agents
    this.agentNames.add('TrendScout');
    this.agentNames.add('OpportunityValidator');
    this.agentNames.add('KeywordMining');
    this.agentNames.add('CompetitorAnalysis');
    this.agentNames.add('AudienceResearch');
    this.agentNames.add('ContentGapFinder');

    // Product Creation Agents
    // Temporarily disabled due to build issues:
    // this.agentNames.add('ProductArchitect');
    this.agentNames.add('AIDesignGenerator');
    this.agentNames.add('ContentTemplateGenerator');
    this.agentNames.add('CourseBuilder');
    this.agentNames.add('EbookWriter');
    this.agentNames.add('ToolSoftwareGenerator');
    this.agentNames.add('PromptGenerator');

    // Quality & Content Agents
    this.agentNames.add('QualityControl');
    this.agentNames.add('VideoCreator');
    this.agentNames.add('BlogPostWriter');
    this.agentNames.add('SocialMediaContentGenerator');
    this.agentNames.add('EmailSequenceGenerator');
    this.agentNames.add('AdCopyGenerator');
    this.agentNames.add('SalesPageBuilder');
    this.agentNames.add('ThumbnailCreator');

    // Publishing & Distribution Agents
    this.agentNames.add('MultiPlatformPublisher');
    this.agentNames.add('SEOOptimizer');
    this.agentNames.add('SocialMediaManager');
    this.agentNames.add('EmailAutomation');
    this.agentNames.add('AffiliatePromotion');
    this.agentNames.add('PlatformCrossPromoter');

    // Customer Acquisition Agents
    this.agentNames.add('CustomerHunter');
    this.agentNames.add('ColdEmailOutreach');
    this.agentNames.add('CommunityBuilder');
    this.agentNames.add('InfluencerOutreach');
    this.agentNames.add('PaidAdsManager');

    // Engagement & Conversion Agents
    this.agentNames.add('CommentManager');
    this.agentNames.add('DMResponder');
    this.agentNames.add('ReviewManager');
    this.agentNames.add('FAQBot');
    this.agentNames.add('ObjectionHandler');
    this.agentNames.add('ChatbotSales');
    this.agentNames.add('Upsell');

    // Analytics & Optimization Agents
    this.agentNames.add('PerformanceAnalytics');
    this.agentNames.add('ABTesting');
    this.agentNames.add('PricingOptimizer');
    this.agentNames.add('ContentPerformanceAnalyzer');
    this.agentNames.add('GrowthAdvisor');

    // Support & Retention Agents
    this.agentNames.add('CustomerSupport');
    this.agentNames.add('RefundPrevention');
    this.agentNames.add('RetentionOptimizer');
    this.agentNames.add('Onboarding');

    // Revenue Optimization Agents
    this.agentNames.add('LaunchManager');
    this.agentNames.add('BundleCreator');
    this.agentNames.add('AffiliateRecruiter');
    this.agentNames.add('ProductPackager');
  }

  /**
   * Get agent instance by name (with dynamic import)
   */
  async getAgent(agentName: string): Promise<any> {
    if (!this.agentNames.has(agentName)) {
      throw new Error(`Agent "${agentName}" not found`);
    }

    // Dynamic import based on agent name
    const module = await import(`../agents/${agentName}Agent`);
    const AgentClass = module[`${agentName}Agent`];

    if (!AgentClass) {
      throw new Error(`Agent class "${agentName}Agent" not found in module`);
    }

    return new AgentClass();
  }

  /**
   * List all available agents
   */
  listAgents(): string[] {
    return Array.from(this.agentNames);
  }

  /**
   * Execute a single agent
   */
  async executeAgent(
    agentName: string,
    method: string,
    params: any[] = []
  ): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    try {
      console.log(`🚀 Executing ${agentName}.${method}...`);

      const agent = await this.getAgent(agentName);

      if (typeof agent[method] !== 'function') {
        throw new Error(`Method "${method}" not found on agent "${agentName}"`);
      }

      const data = await agent[method](...params);
      const executionTime = Date.now() - startTime;

      console.log(`✅ ${agentName}.${method} completed in ${executionTime}ms`);

      return {
        agentName,
        success: true,
        data,
        executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ ${agentName}.${method} failed:`, error);

      return {
        agentName,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime,
      };
    }
  }

  /**
   * Execute complete niche discovery workflow
   */
  async runNicheDiscoveryWorkflow(platforms: string[]): Promise<WorkflowResult> {
    const startTime = Date.now();
    const results: AgentExecutionResult[] = [];

    console.log('\n🎯 STARTING NICHE DISCOVERY WORKFLOW\n');

    // Step 1: Trend Scout
    results.push(await this.executeAgent('TrendScout', 'scanTrendingTopics', [platforms]));

    // Step 2: Keyword Mining (using top trend)
    if (results[0].success && results[0].data?.length > 0) {
      const topTrend = results[0].data[0].topic;
      results.push(await this.executeAgent('KeywordMining', 'mineKeywords', [topTrend]));
    }

    // Step 3: Competitor Analysis
    if (results[0].success && results[0].data?.length > 0) {
      const topTrend = results[0].data[0].topic;
      results.push(await this.executeAgent('CompetitorAnalysis', 'identifyCompetitors', [topTrend]));
    }

    // Step 4: Audience Research
    if (results[0].success && results[0].data?.length > 0) {
      const topTrend = results[0].data[0].topic;
      results.push(await this.executeAgent('AudienceResearch', 'identifyTargetAudience', [topTrend]));
    }

    // Step 5: Opportunity Validation
    if (results[0].success && results[0].data?.length > 0) {
      const topTrend = results[0].data[0].topic;
      results.push(await this.executeAgent('OpportunityValidator', 'validateNiche', [topTrend]));
    }

    const totalExecutionTime = Date.now() - startTime;
    const successfulAgents = results.filter((r) => r.success).length;

    console.log(`\n✅ NICHE DISCOVERY WORKFLOW COMPLETED in ${totalExecutionTime}ms\n`);

    return {
      workflowName: 'Niche Discovery',
      totalAgents: results.length,
      successfulAgents,
      failedAgents: results.length - successfulAgents,
      results,
      totalExecutionTime,
    };
  }

  /**
   * Execute complete product creation workflow
   */
  async runProductCreationWorkflow(niche: string, productType: string): Promise<WorkflowResult> {
    const startTime = Date.now();
    const results: AgentExecutionResult[] = [];

    console.log('\n🏗️ STARTING PRODUCT CREATION WORKFLOW\n');

    // Step 1: Product Architecture
    results.push(await this.executeAgent('ProductArchitect', 'designProduct', [niche, productType]));

    // Step 2: Content Generation (depends on product type)
    if (productType === 'course') {
      results.push(await this.executeAgent('CourseBuilder', 'createCourseCurriculum', [niche]));
    } else if (productType === 'ebook') {
      results.push(await this.executeAgent('EbookWriter', 'generateBookOutline', [niche]));
    } else if (productType === 'template') {
      results.push(await this.executeAgent('ContentTemplateGenerator', 'generateNotionTemplate', [niche]));
    }

    // Step 3: Design Generation
    results.push(await this.executeAgent('AIDesignGenerator', 'generateTemplate', [results[0].data]));

    // Step 4: Quality Control
    results.push(await this.executeAgent('QualityControl', 'reviewProduct', [results[0].data]));

    const totalExecutionTime = Date.now() - startTime;
    const successfulAgents = results.filter((r) => r.success).length;

    console.log(`\n✅ PRODUCT CREATION WORKFLOW COMPLETED in ${totalExecutionTime}ms\n`);

    return {
      workflowName: 'Product Creation',
      totalAgents: results.length,
      successfulAgents,
      failedAgents: results.length - successfulAgents,
      results,
      totalExecutionTime,
    };
  }

  /**
   * Execute complete marketing automation workflow
   */
  async runMarketingWorkflow(productId: string): Promise<WorkflowResult> {
    const startTime = Date.now();
    const results: AgentExecutionResult[] = [];

    console.log('\n📢 STARTING MARKETING AUTOMATION WORKFLOW\n');

    // Step 1: Generate content
    results.push(await this.executeAgent('BlogPostWriter', 'generatePost', [productId]));
    results.push(await this.executeAgent('SocialMediaContentGenerator', 'generatePosts', [productId]));
    results.push(await this.executeAgent('EmailSequenceGenerator', 'generateSequence', [productId]));
    results.push(await this.executeAgent('AdCopyGenerator', 'generateAds', [productId]));

    // Step 2: SEO Optimization
    results.push(await this.executeAgent('SEOOptimizer', 'optimizeContent', [results[0].data]));

    // Step 3: Multi-platform publishing
    results.push(await this.executeAgent('MultiPlatformPublisher', 'publishToAll', [productId]));

    const totalExecutionTime = Date.now() - startTime;
    const successfulAgents = results.filter((r) => r.success).length;

    console.log(`\n✅ MARKETING WORKFLOW COMPLETED in ${totalExecutionTime}ms\n`);

    return {
      workflowName: 'Marketing Automation',
      totalAgents: results.length,
      successfulAgents,
      failedAgents: results.length - successfulAgents,
      results,
      totalExecutionTime,
    };
  }

  /**
   * Execute complete end-to-end automation
   */
  async runCompleteAutomation(platforms: string[]): Promise<{
    nicheDiscovery: WorkflowResult;
    productCreation: WorkflowResult;
    marketing: WorkflowResult;
  }> {
    console.log('\n🚀🚀🚀 STARTING COMPLETE END-TO-END AUTOMATION 🚀🚀🚀\n');

    // Phase 1: Niche Discovery
    const nicheDiscovery = await this.runNicheDiscoveryWorkflow(platforms);

    if (!nicheDiscovery.results[0].success) {
      throw new Error('Niche discovery failed. Cannot proceed.');
    }

    const validatedNiche = nicheDiscovery.results[0].data[0].topic;

    // Phase 2: Product Creation
    const productCreation = await this.runProductCreationWorkflow(validatedNiche, 'course');

    if (!productCreation.results[0].success) {
      throw new Error('Product creation failed. Cannot proceed.');
    }

    const productId = 'product-' + Date.now();

    // Phase 3: Marketing
    const marketing = await this.runMarketingWorkflow(productId);

    console.log('\n✅✅✅ COMPLETE AUTOMATION FINISHED ✅✅✅\n');

    return {
      nicheDiscovery,
      productCreation,
      marketing,
    };
  }
}

// Export singleton instance
export const orchestrator = new AgentOrchestrator();
