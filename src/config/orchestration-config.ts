/**
 * ORCHESTRATION CONFIGURATION
 * Central configuration for the 52-agent production chain
 * Master control for all agent workflows and execution settings
 */

export type AgentPriority = 'critical' | 'high' | 'medium' | 'low';
export type ExecutionMode = 'sequential' | 'parallel' | 'conditional';
export type AgentStatus = 'idle' | 'running' | 'paused' | 'stopped' | 'error' | 'completed';
export type ChainStatus = 'active' | 'paused' | 'stopped' | 'waiting_approval';

// Agent Definition Interface
export interface AgentConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  chainId: number;
  position: number;
  timeout: number; // milliseconds
  retryLimit: number;
  retryDelay: number; // milliseconds
  priority: AgentPriority;
  executionMode: ExecutionMode;
  dependencies: string[]; // agent IDs this depends on
  outputs: string[]; // data types this agent produces
  inputs: string[]; // data types this agent requires
  rateLimits?: {
    requestsPerMinute?: number;
    requestsPerHour?: number;
    requestsPerDay?: number;
  };
  enabled: boolean;
  requiresApproval: boolean;
}

// Chain Definition Interface
export interface ChainConfig {
  id: number;
  name: string;
  displayName: string;
  description: string;
  agents: string[]; // agent IDs in execution order
  executionMode: ExecutionMode;
  loopBack?: number; // chain ID to loop back to (for chain 10)
  gateAfter?: string; // agent ID after which approval is needed
  enabled: boolean;
}

// Complete Agent Registry - All 52 Agents
export const AGENT_REGISTRY: Record<string, AgentConfig> = {
  // ===== CHAIN 1: CONTENT DISCOVERY & VALIDATION =====
  'trend-scout': {
    id: 'trend-scout',
    name: 'TrendScoutAgent',
    displayName: 'Trend Scout',
    description: 'Discovers viral opportunities and trending topics',
    chainId: 1,
    position: 1,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 5000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: [],
    outputs: ['trending_topics', 'viral_opportunities'],
    inputs: [],
    rateLimits: { requestsPerMinute: 10, requestsPerHour: 100 },
    enabled: true,
    requiresApproval: false
  },
  'opportunity-validator': {
    id: 'opportunity-validator',
    name: 'OpportunityValidatorAgent',
    displayName: 'Opportunity Validator',
    description: 'Validates profitability of trending opportunities',
    chainId: 1,
    position: 2,
    timeout: 90000,
    retryLimit: 3,
    retryDelay: 5000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['trend-scout'],
    outputs: ['validated_opportunities', 'profitability_scores'],
    inputs: ['trending_topics', 'viral_opportunities'],
    enabled: true,
    requiresApproval: false
  },
  'user-approval-gate': {
    id: 'user-approval-gate',
    name: 'UserApprovalGate',
    displayName: 'User Approval Gate',
    description: 'Waits for Yassine\'s approval on opportunities',
    chainId: 1,
    position: 3,
    timeout: 86400000, // 24 hours
    retryLimit: 0,
    retryDelay: 0,
    priority: 'critical',
    executionMode: 'sequential',
    dependencies: ['opportunity-validator'],
    outputs: ['approved_opportunities'],
    inputs: ['validated_opportunities', 'profitability_scores'],
    enabled: true,
    requiresApproval: true
  },

  // ===== CHAIN 2: CONTENT PLANNING =====
  'product-architecture': {
    id: 'product-architecture',
    name: 'ProductArchitectAgent',
    displayName: 'Product Architecture',
    description: 'Creates content blueprints and product structures',
    chainId: 2,
    position: 1,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['user-approval-gate'],
    outputs: ['content_blueprint', 'product_structure'],
    inputs: ['approved_opportunities'],
    enabled: true,
    requiresApproval: false
  },
  'ai-prompt-generator': {
    id: 'ai-prompt-generator',
    name: 'PromptGeneratorAgent',
    displayName: 'AI Prompt Generator',
    description: 'Creates optimized prompts for content generation',
    chainId: 2,
    position: 2,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 5000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['product-architecture'],
    outputs: ['generation_prompts', 'prompt_library'],
    inputs: ['content_blueprint', 'product_structure'],
    enabled: true,
    requiresApproval: false
  },
  'content-scheduler': {
    id: 'content-scheduler',
    name: 'ContentSchedulerAgent',
    displayName: 'Content Scheduler',
    description: 'Plans optimal posting schedules',
    chainId: 2,
    position: 3,
    timeout: 60000,
    retryLimit: 3,
    retryDelay: 5000,
    priority: 'medium',
    executionMode: 'sequential',
    dependencies: ['ai-prompt-generator'],
    outputs: ['posting_schedule', 'content_calendar'],
    inputs: ['generation_prompts', 'content_blueprint'],
    enabled: true,
    requiresApproval: false
  },

  // ===== CHAIN 3: CONTENT CREATION =====
  'ai-design-generator': {
    id: 'ai-design-generator',
    name: 'AIDesignGeneratorAgent',
    displayName: 'AI Design Generator',
    description: 'Creates images and visual assets',
    chainId: 3,
    position: 1,
    timeout: 300000,
    retryLimit: 5,
    retryDelay: 15000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['content-scheduler'],
    outputs: ['generated_images', 'visual_assets'],
    inputs: ['generation_prompts', 'content_blueprint'],
    rateLimits: { requestsPerMinute: 5, requestsPerHour: 50 },
    enabled: true,
    requiresApproval: false
  },
  'video-creator': {
    id: 'video-creator',
    name: 'VideoCreatorAgent',
    displayName: 'Video Creator',
    description: 'Creates video content',
    chainId: 3,
    position: 2,
    timeout: 600000,
    retryLimit: 3,
    retryDelay: 30000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['content-scheduler'],
    outputs: ['raw_videos', 'video_assets'],
    inputs: ['generation_prompts', 'content_blueprint'],
    rateLimits: { requestsPerMinute: 2, requestsPerHour: 20 },
    enabled: true,
    requiresApproval: false
  },
  'thumbnail-generator': {
    id: 'thumbnail-generator',
    name: 'ThumbnailCreatorAgent',
    displayName: 'Thumbnail Generator',
    description: 'Creates compelling thumbnails',
    chainId: 3,
    position: 3,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['ai-design-generator'],
    outputs: ['thumbnails'],
    inputs: ['generated_images', 'visual_assets'],
    enabled: true,
    requiresApproval: false
  },
  'watermark-remover': {
    id: 'watermark-remover',
    name: 'WatermarkRemoverAgent',
    displayName: 'Watermark Remover',
    description: 'Cleans and processes videos',
    chainId: 3,
    position: 4,
    timeout: 300000,
    retryLimit: 3,
    retryDelay: 15000,
    priority: 'medium',
    executionMode: 'sequential',
    dependencies: ['video-creator'],
    outputs: ['clean_videos'],
    inputs: ['raw_videos'],
    enabled: true,
    requiresApproval: false
  },
  'quality-control': {
    id: 'quality-control',
    name: 'QualityControlAgent',
    displayName: 'Quality Control',
    description: 'Tests and validates all content',
    chainId: 3,
    position: 5,
    timeout: 180000,
    retryLimit: 2,
    retryDelay: 10000,
    priority: 'critical',
    executionMode: 'sequential',
    dependencies: ['watermark-remover', 'thumbnail-generator'],
    outputs: ['approved_content', 'quality_reports'],
    inputs: ['clean_videos', 'thumbnails', 'generated_images'],
    enabled: true,
    requiresApproval: false
  },

  // ===== CHAIN 4: CONTENT PACKAGING =====
  'product-packager': {
    id: 'product-packager',
    name: 'ProductPackagerAgent',
    displayName: 'Product Packager',
    description: 'Packages files for distribution',
    chainId: 4,
    position: 1,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['quality-control'],
    outputs: ['packaged_products', 'product_files'],
    inputs: ['approved_content'],
    enabled: true,
    requiresApproval: false
  },
  'seo-optimizer': {
    id: 'seo-optimizer',
    name: 'SEOOptimizerAgent',
    displayName: 'SEO Optimizer',
    description: 'Adds SEO metadata and optimization',
    chainId: 4,
    position: 2,
    timeout: 90000,
    retryLimit: 3,
    retryDelay: 5000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['product-packager'],
    outputs: ['optimized_content', 'seo_metadata'],
    inputs: ['packaged_products'],
    enabled: true,
    requiresApproval: false
  },
  'multi-platform-adapter': {
    id: 'multi-platform-adapter',
    name: 'MultiPlatformAdapterAgent',
    displayName: 'Multi-Platform Adapter',
    description: 'Formats content for each platform',
    chainId: 4,
    position: 3,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['seo-optimizer'],
    outputs: ['platform_content'],
    inputs: ['optimized_content', 'seo_metadata'],
    enabled: true,
    requiresApproval: false
  },

  // ===== CHAIN 5: DISTRIBUTION =====
  'youtube-automation': {
    id: 'youtube-automation',
    name: 'YouTubeAutomationAgent',
    displayName: 'YouTube Automation',
    description: 'Posts content to YouTube',
    chainId: 5,
    position: 1,
    timeout: 300000,
    retryLimit: 3,
    retryDelay: 30000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['multi-platform-adapter'],
    outputs: ['youtube_posts'],
    inputs: ['platform_content'],
    rateLimits: { requestsPerHour: 10, requestsPerDay: 50 },
    enabled: true,
    requiresApproval: false
  },
  'instagram-automation': {
    id: 'instagram-automation',
    name: 'InstagramAutomationAgent',
    displayName: 'Instagram Automation',
    description: 'Posts content to Instagram',
    chainId: 5,
    position: 2,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 30000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['multi-platform-adapter'],
    outputs: ['instagram_posts'],
    inputs: ['platform_content'],
    rateLimits: { requestsPerHour: 20, requestsPerDay: 100 },
    enabled: true,
    requiresApproval: false
  },
  'tiktok-automation': {
    id: 'tiktok-automation',
    name: 'TikTokAutomationAgent',
    displayName: 'TikTok Automation',
    description: 'Posts content to TikTok',
    chainId: 5,
    position: 3,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 30000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['multi-platform-adapter'],
    outputs: ['tiktok_posts'],
    inputs: ['platform_content'],
    rateLimits: { requestsPerHour: 15, requestsPerDay: 75 },
    enabled: true,
    requiresApproval: false
  },
  'pinterest-automation': {
    id: 'pinterest-automation',
    name: 'PinterestAutomationAgent',
    displayName: 'Pinterest Automation',
    description: 'Posts content to Pinterest',
    chainId: 5,
    position: 4,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 20000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['multi-platform-adapter'],
    outputs: ['pinterest_posts'],
    inputs: ['platform_content'],
    rateLimits: { requestsPerHour: 30, requestsPerDay: 200 },
    enabled: true,
    requiresApproval: false
  },
  'facebook-automation': {
    id: 'facebook-automation',
    name: 'FacebookAutomationAgent',
    displayName: 'Facebook Automation',
    description: 'Posts content to Facebook',
    chainId: 5,
    position: 5,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 30000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['multi-platform-adapter'],
    outputs: ['facebook_posts'],
    inputs: ['platform_content'],
    rateLimits: { requestsPerHour: 20, requestsPerDay: 100 },
    enabled: true,
    requiresApproval: false
  },
  'multi-platform-publisher': {
    id: 'multi-platform-publisher',
    name: 'MultiPlatformPublisherAgent',
    displayName: 'Multi-Platform Publisher',
    description: 'Confirms all platform posts',
    chainId: 5,
    position: 6,
    timeout: 60000,
    retryLimit: 2,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['youtube-automation', 'instagram-automation', 'tiktok-automation', 'pinterest-automation', 'facebook-automation'],
    outputs: ['post_confirmations', 'distribution_report'],
    inputs: ['youtube_posts', 'instagram_posts', 'tiktok_posts', 'pinterest_posts', 'facebook_posts'],
    enabled: true,
    requiresApproval: false
  },

  // ===== CHAIN 6: MARKETPLACE PUBLISHING =====
  'etsy-publisher': {
    id: 'etsy-publisher',
    name: 'EtsyPublisherAgent',
    displayName: 'Etsy Publisher',
    description: 'Lists products on Etsy',
    chainId: 6,
    position: 1,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 20000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['multi-platform-publisher'],
    outputs: ['etsy_listings'],
    inputs: ['packaged_products', 'seo_metadata'],
    rateLimits: { requestsPerHour: 20 },
    enabled: true,
    requiresApproval: false
  },
  'gumroad-publisher': {
    id: 'gumroad-publisher',
    name: 'GumroadPublisherAgent',
    displayName: 'Gumroad Publisher',
    description: 'Lists products on Gumroad',
    chainId: 6,
    position: 2,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 20000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['multi-platform-publisher'],
    outputs: ['gumroad_listings'],
    inputs: ['packaged_products', 'seo_metadata'],
    rateLimits: { requestsPerHour: 30 },
    enabled: true,
    requiresApproval: false
  },
  'shopify-publisher': {
    id: 'shopify-publisher',
    name: 'ShopifyPublisherAgent',
    displayName: 'Shopify Publisher',
    description: 'Lists products on Shopify',
    chainId: 6,
    position: 3,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 20000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['multi-platform-publisher'],
    outputs: ['shopify_listings'],
    inputs: ['packaged_products', 'seo_metadata'],
    rateLimits: { requestsPerHour: 40 },
    enabled: true,
    requiresApproval: false
  },
  'creative-market-publisher': {
    id: 'creative-market-publisher',
    name: 'CreativeMarketPublisherAgent',
    displayName: 'Creative Market Publisher',
    description: 'Lists on Creative Market',
    chainId: 6,
    position: 4,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 20000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['multi-platform-publisher'],
    outputs: ['creative_market_listings'],
    inputs: ['packaged_products', 'seo_metadata'],
    rateLimits: { requestsPerHour: 15 },
    enabled: true,
    requiresApproval: false
  },

  // ===== CHAIN 7: MARKETING & ENGAGEMENT =====
  'marketing-content': {
    id: 'marketing-content',
    name: 'MarketingContentAgent',
    displayName: 'Marketing Content',
    description: 'Creates promotional content',
    chainId: 7,
    position: 1,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['etsy-publisher', 'gumroad-publisher', 'shopify-publisher', 'creative-market-publisher'],
    outputs: ['promo_content', 'marketing_materials'],
    inputs: ['etsy_listings', 'gumroad_listings', 'shopify_listings', 'creative_market_listings'],
    enabled: true,
    requiresApproval: false
  },
  'email-campaign': {
    id: 'email-campaign',
    name: 'EmailCampaignAgent',
    displayName: 'Email Campaign',
    description: 'Sends email marketing campaigns',
    chainId: 7,
    position: 2,
    timeout: 300000,
    retryLimit: 3,
    retryDelay: 30000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['marketing-content'],
    outputs: ['email_campaigns', 'email_stats'],
    inputs: ['promo_content', 'marketing_materials'],
    rateLimits: { requestsPerHour: 100, requestsPerDay: 1000 },
    enabled: true,
    requiresApproval: false
  },
  'customer-hunter': {
    id: 'customer-hunter',
    name: 'CustomerHunterAgent',
    displayName: 'Customer Hunter',
    description: 'Actively finds potential buyers',
    chainId: 7,
    position: 3,
    timeout: 300000,
    retryLimit: 3,
    retryDelay: 30000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['marketing-content'],
    outputs: ['potential_customers', 'lead_list'],
    inputs: ['promo_content'],
    rateLimits: { requestsPerHour: 50 },
    enabled: true,
    requiresApproval: false
  },
  'comment-manager': {
    id: 'comment-manager',
    name: 'CommentManagerAgent',
    displayName: 'Comment Manager',
    description: 'Responds to comments across platforms',
    chainId: 7,
    position: 4,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['marketing-content'],
    outputs: ['comment_responses', 'engagement_data'],
    inputs: ['post_confirmations'],
    rateLimits: { requestsPerMinute: 30 },
    enabled: true,
    requiresApproval: false
  },
  'dm-responder': {
    id: 'dm-responder',
    name: 'DMResponderAgent',
    displayName: 'DM Responder',
    description: 'Handles direct messages',
    chainId: 7,
    position: 5,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['marketing-content'],
    outputs: ['dm_responses', 'dm_leads'],
    inputs: ['post_confirmations'],
    rateLimits: { requestsPerMinute: 20 },
    enabled: true,
    requiresApproval: false
  },
  'social-engagement': {
    id: 'social-engagement',
    name: 'SocialEngagementAgent',
    displayName: 'Social Engagement',
    description: 'Strategic likes and follows',
    chainId: 7,
    position: 6,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 15000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['marketing-content'],
    outputs: ['engagement_actions', 'follower_growth'],
    inputs: ['potential_customers'],
    rateLimits: { requestsPerHour: 100 },
    enabled: true,
    requiresApproval: false
  },
  'influencer-outreach': {
    id: 'influencer-outreach',
    name: 'InfluencerOutreachAgent',
    displayName: 'Influencer Outreach',
    description: 'Contacts influencers for promotion',
    chainId: 7,
    position: 7,
    timeout: 300000,
    retryLimit: 3,
    retryDelay: 60000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['marketing-content'],
    outputs: ['influencer_contacts', 'partnership_leads'],
    inputs: ['promo_content', 'marketing_materials'],
    rateLimits: { requestsPerHour: 20, requestsPerDay: 50 },
    enabled: true,
    requiresApproval: false
  },
  'cross-promotion': {
    id: 'cross-promotion',
    name: 'CrossPromotionAgent',
    displayName: 'Cross Promotion',
    description: 'Promotes across all channels',
    chainId: 7,
    position: 8,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 15000,
    priority: 'medium',
    executionMode: 'sequential',
    dependencies: ['email-campaign', 'customer-hunter', 'comment-manager', 'dm-responder', 'social-engagement', 'influencer-outreach'],
    outputs: ['cross_promo_results', 'engagement_summary'],
    inputs: ['email_campaigns', 'potential_customers', 'comment_responses', 'dm_responses', 'engagement_actions', 'influencer_contacts'],
    enabled: true,
    requiresApproval: false
  },

  // ===== CHAIN 8: SALES & SUPPORT =====
  'lead-capture': {
    id: 'lead-capture',
    name: 'LeadCaptureAgent',
    displayName: 'Lead Capture',
    description: 'Collects and organizes emails',
    chainId: 8,
    position: 1,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['cross-promotion'],
    outputs: ['captured_leads', 'email_list'],
    inputs: ['engagement_summary', 'dm_leads', 'potential_customers'],
    enabled: true,
    requiresApproval: false
  },
  'upsell-agent': {
    id: 'upsell-agent',
    name: 'UpsellAgent',
    displayName: 'Upsell Agent',
    description: 'Offers additional products',
    chainId: 8,
    position: 2,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['lead-capture'],
    outputs: ['upsell_offers', 'upsell_conversions'],
    inputs: ['captured_leads', 'packaged_products'],
    enabled: true,
    requiresApproval: false
  },
  'customer-service': {
    id: 'customer-service',
    name: 'CustomerServiceAgent',
    displayName: 'Customer Service',
    description: 'Handles customer inquiries',
    chainId: 8,
    position: 3,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'critical',
    executionMode: 'parallel',
    dependencies: ['lead-capture'],
    outputs: ['support_tickets', 'resolutions'],
    inputs: ['captured_leads'],
    enabled: true,
    requiresApproval: false
  },
  'delivery-agent': {
    id: 'delivery-agent',
    name: 'DeliveryAgent',
    displayName: 'Delivery Agent',
    description: 'Sends purchased files to customers',
    chainId: 8,
    position: 4,
    timeout: 120000,
    retryLimit: 5,
    retryDelay: 15000,
    priority: 'critical',
    executionMode: 'parallel',
    dependencies: ['upsell-agent'],
    outputs: ['deliveries', 'delivery_confirmations'],
    inputs: ['packaged_products', 'upsell_conversions'],
    enabled: true,
    requiresApproval: false
  },
  'follow-up-agent': {
    id: 'follow-up-agent',
    name: 'FollowUpAgent',
    displayName: 'Follow-up Agent',
    description: 'Post-purchase engagement',
    chainId: 8,
    position: 5,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['delivery-agent'],
    outputs: ['follow_ups', 'customer_feedback'],
    inputs: ['delivery_confirmations'],
    rateLimits: { requestsPerHour: 50 },
    enabled: true,
    requiresApproval: false
  },
  'review-manager': {
    id: 'review-manager',
    name: 'ReviewManagerAgent',
    displayName: 'Review Manager',
    description: 'Requests and manages reviews',
    chainId: 8,
    position: 6,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'medium',
    executionMode: 'sequential',
    dependencies: ['follow-up-agent', 'customer-service'],
    outputs: ['review_requests', 'review_data', 'sales_data'],
    inputs: ['follow_ups', 'customer_feedback', 'resolutions'],
    enabled: true,
    requiresApproval: false
  },

  // ===== CHAIN 9: ANALYTICS & OPTIMIZATION =====
  'analytics-tracker': {
    id: 'analytics-tracker',
    name: 'AnalyticsTrackerAgent',
    displayName: 'Analytics Tracker',
    description: 'Collects all performance data',
    chainId: 9,
    position: 1,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['review-manager'],
    outputs: ['raw_analytics', 'data_collection'],
    inputs: ['sales_data', 'engagement_summary', 'distribution_report'],
    enabled: true,
    requiresApproval: false
  },
  'performance-monitor': {
    id: 'performance-monitor',
    name: 'PerformanceMonitorAgent',
    displayName: 'Performance Monitor',
    description: 'Tracks and analyzes metrics',
    chainId: 9,
    position: 2,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['analytics-tracker'],
    outputs: ['performance_metrics', 'kpi_reports'],
    inputs: ['raw_analytics'],
    enabled: true,
    requiresApproval: false
  },
  'ab-testing': {
    id: 'ab-testing',
    name: 'ABTestingAgent',
    displayName: 'A/B Testing',
    description: 'Tests content variations',
    chainId: 9,
    position: 3,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 15000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['analytics-tracker'],
    outputs: ['test_results', 'winning_variants'],
    inputs: ['raw_analytics', 'platform_content'],
    enabled: true,
    requiresApproval: false
  },
  'roi-calculator': {
    id: 'roi-calculator',
    name: 'ROICalculatorAgent',
    displayName: 'ROI Calculator',
    description: 'Calculates profits and returns',
    chainId: 9,
    position: 4,
    timeout: 60000,
    retryLimit: 3,
    retryDelay: 5000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['performance-monitor'],
    outputs: ['roi_reports', 'profit_analysis'],
    inputs: ['performance_metrics', 'sales_data'],
    enabled: true,
    requiresApproval: false
  },
  'competitor-analyzer': {
    id: 'competitor-analyzer',
    name: 'CompetitorAnalyzerAgent',
    displayName: 'Competitor Analyzer',
    description: 'Monitors competition',
    chainId: 9,
    position: 5,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 15000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['analytics-tracker'],
    outputs: ['competitor_data', 'market_position'],
    inputs: ['raw_analytics'],
    rateLimits: { requestsPerHour: 20 },
    enabled: true,
    requiresApproval: false
  },
  'trend-predictor': {
    id: 'trend-predictor',
    name: 'TrendPredictorAgent',
    displayName: 'Trend Predictor',
    description: 'Forecasts future trends',
    chainId: 9,
    position: 6,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 15000,
    priority: 'medium',
    executionMode: 'parallel',
    dependencies: ['analytics-tracker', 'competitor-analyzer'],
    outputs: ['trend_forecasts', 'predictions'],
    inputs: ['raw_analytics', 'competitor_data'],
    enabled: true,
    requiresApproval: false
  },
  'growth-advisor': {
    id: 'growth-advisor',
    name: 'GrowthAdvisorAgent',
    displayName: 'Growth Advisor',
    description: 'Suggests improvements and growth strategies',
    chainId: 9,
    position: 7,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 15000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['performance-monitor', 'ab-testing', 'roi-calculator', 'competitor-analyzer', 'trend-predictor'],
    outputs: ['growth_insights', 'recommendations', 'optimization_plan'],
    inputs: ['performance_metrics', 'test_results', 'roi_reports', 'competitor_data', 'trend_forecasts'],
    enabled: true,
    requiresApproval: false
  },

  // ===== CHAIN 10: BUSINESS OPERATIONS =====
  'inventory-manager': {
    id: 'inventory-manager',
    name: 'InventoryManagerAgent',
    displayName: 'Inventory Manager',
    description: 'Tracks products and stock',
    chainId: 10,
    position: 1,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['growth-advisor'],
    outputs: ['inventory_status', 'stock_alerts'],
    inputs: ['packaged_products', 'sales_data'],
    enabled: true,
    requiresApproval: false
  },
  'pricing-optimizer': {
    id: 'pricing-optimizer',
    name: 'PricingOptimizerAgent',
    displayName: 'Pricing Optimizer',
    description: 'Adjusts prices for maximum profit',
    chainId: 10,
    position: 2,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'high',
    executionMode: 'parallel',
    dependencies: ['inventory-manager'],
    outputs: ['price_updates', 'pricing_strategy'],
    inputs: ['inventory_status', 'roi_reports', 'competitor_data'],
    enabled: true,
    requiresApproval: false
  },
  'legal-compliance': {
    id: 'legal-compliance',
    name: 'LegalComplianceAgent',
    displayName: 'Legal Compliance',
    description: 'Ensures legal compliance',
    chainId: 10,
    position: 3,
    timeout: 180000,
    retryLimit: 2,
    retryDelay: 30000,
    priority: 'critical',
    executionMode: 'parallel',
    dependencies: ['inventory-manager'],
    outputs: ['compliance_report', 'legal_alerts'],
    inputs: ['packaged_products', 'platform_content'],
    enabled: true,
    requiresApproval: false
  },
  'backup-agent': {
    id: 'backup-agent',
    name: 'BackupAgent',
    displayName: 'Backup Agent',
    description: 'Backs up all data and assets',
    chainId: 10,
    position: 4,
    timeout: 300000,
    retryLimit: 5,
    retryDelay: 30000,
    priority: 'critical',
    executionMode: 'parallel',
    dependencies: ['inventory-manager'],
    outputs: ['backup_status', 'backup_logs'],
    inputs: ['packaged_products', 'raw_analytics', 'captured_leads'],
    enabled: true,
    requiresApproval: false
  },
  'security-agent': {
    id: 'security-agent',
    name: 'SecurityAgent',
    displayName: 'Security Agent',
    description: 'Monitors security threats',
    chainId: 10,
    position: 5,
    timeout: 120000,
    retryLimit: 3,
    retryDelay: 10000,
    priority: 'critical',
    executionMode: 'parallel',
    dependencies: ['backup-agent'],
    outputs: ['security_status', 'threat_alerts'],
    inputs: ['backup_status'],
    enabled: true,
    requiresApproval: false
  },
  'report-generator': {
    id: 'report-generator',
    name: 'ReportGeneratorAgent',
    displayName: 'Report Generator',
    description: 'Creates comprehensive reports',
    chainId: 10,
    position: 6,
    timeout: 180000,
    retryLimit: 3,
    retryDelay: 15000,
    priority: 'high',
    executionMode: 'sequential',
    dependencies: ['pricing-optimizer', 'legal-compliance', 'backup-agent', 'security-agent'],
    outputs: ['daily_reports', 'weekly_reports', 'monthly_reports'],
    inputs: ['price_updates', 'compliance_report', 'backup_status', 'security_status', 'growth_insights'],
    enabled: true,
    requiresApproval: false
  },
  'notification-agent': {
    id: 'notification-agent',
    name: 'NotificationAgent',
    displayName: 'Notification Agent',
    description: 'Alerts Yassine about important events',
    chainId: 10,
    position: 7,
    timeout: 60000,
    retryLimit: 5,
    retryDelay: 5000,
    priority: 'critical',
    executionMode: 'sequential',
    dependencies: ['report-generator'],
    outputs: ['notifications_sent', 'alert_log', 'cycle_complete'],
    inputs: ['daily_reports', 'threat_alerts', 'legal_alerts', 'stock_alerts'],
    enabled: true,
    requiresApproval: false
  }
};

// Chain Definitions - All 10 Production Chains
export const CHAIN_REGISTRY: Record<number, ChainConfig> = {
  1: {
    id: 1,
    name: 'content-discovery-validation',
    displayName: 'Content Discovery & Validation',
    description: 'Finds viral opportunities and validates profitability',
    agents: ['trend-scout', 'opportunity-validator', 'user-approval-gate'],
    executionMode: 'sequential',
    gateAfter: 'user-approval-gate',
    enabled: true
  },
  2: {
    id: 2,
    name: 'content-planning',
    displayName: 'Content Planning',
    description: 'Creates blueprints, prompts, and schedules',
    agents: ['product-architecture', 'ai-prompt-generator', 'content-scheduler'],
    executionMode: 'sequential',
    enabled: true
  },
  3: {
    id: 3,
    name: 'content-creation',
    displayName: 'Content Creation',
    description: 'Generates images, videos, and thumbnails',
    agents: ['ai-design-generator', 'video-creator', 'thumbnail-generator', 'watermark-remover', 'quality-control'],
    executionMode: 'parallel',
    enabled: true
  },
  4: {
    id: 4,
    name: 'content-packaging',
    displayName: 'Content Packaging',
    description: 'Packages and optimizes content for distribution',
    agents: ['product-packager', 'seo-optimizer', 'multi-platform-adapter'],
    executionMode: 'sequential',
    enabled: true
  },
  5: {
    id: 5,
    name: 'distribution',
    displayName: 'Distribution',
    description: 'Posts to all social platforms',
    agents: ['youtube-automation', 'instagram-automation', 'tiktok-automation', 'pinterest-automation', 'facebook-automation', 'multi-platform-publisher'],
    executionMode: 'parallel',
    enabled: true
  },
  6: {
    id: 6,
    name: 'marketplace-publishing',
    displayName: 'Marketplace Publishing',
    description: 'Lists products on marketplaces',
    agents: ['etsy-publisher', 'gumroad-publisher', 'shopify-publisher', 'creative-market-publisher'],
    executionMode: 'parallel',
    enabled: true
  },
  7: {
    id: 7,
    name: 'marketing-engagement',
    displayName: 'Marketing & Engagement',
    description: 'Promotes and engages with audiences',
    agents: ['marketing-content', 'email-campaign', 'customer-hunter', 'comment-manager', 'dm-responder', 'social-engagement', 'influencer-outreach', 'cross-promotion'],
    executionMode: 'parallel',
    enabled: true
  },
  8: {
    id: 8,
    name: 'sales-support',
    displayName: 'Sales & Support',
    description: 'Handles leads, sales, and customer support',
    agents: ['lead-capture', 'upsell-agent', 'customer-service', 'delivery-agent', 'follow-up-agent', 'review-manager'],
    executionMode: 'parallel',
    enabled: true
  },
  9: {
    id: 9,
    name: 'analytics-optimization',
    displayName: 'Analytics & Optimization',
    description: 'Analyzes performance and optimizes operations',
    agents: ['analytics-tracker', 'performance-monitor', 'ab-testing', 'roi-calculator', 'competitor-analyzer', 'trend-predictor', 'growth-advisor'],
    executionMode: 'parallel',
    enabled: true
  },
  10: {
    id: 10,
    name: 'business-operations',
    displayName: 'Business Operations',
    description: 'Manages business operations and loops back to start',
    agents: ['inventory-manager', 'pricing-optimizer', 'legal-compliance', 'backup-agent', 'security-agent', 'report-generator', 'notification-agent'],
    executionMode: 'parallel',
    loopBack: 1,
    enabled: true
  }
};

// Global Orchestration Settings
export const ORCHESTRATION_SETTINGS = {
  // Execution Settings
  maxConcurrentAgents: 10,
  maxConcurrentChains: 3,
  globalTimeout: 3600000, // 1 hour max for entire cycle
  cycleDelay: 300000, // 5 minutes between cycles

  // Retry Settings
  globalRetryLimit: 3,
  retryBackoffMultiplier: 2,
  maxRetryDelay: 300000, // 5 minutes max retry delay

  // Queue Settings
  maxQueueSize: 1000,
  queueProcessingInterval: 1000, // 1 second
  deadLetterQueueEnabled: true,
  deadLetterMaxAge: 86400000, // 24 hours

  // Monitoring Settings
  healthCheckInterval: 30000, // 30 seconds
  metricsCollectionInterval: 60000, // 1 minute
  alertThresholds: {
    errorRate: 0.1, // 10% error rate triggers alert
    queueBacklog: 100, // More than 100 items triggers alert
    agentDowntime: 300000, // 5 minutes of downtime triggers alert
    responseTime: 60000 // 60 seconds response time triggers alert
  },

  // Notification Settings
  notifications: {
    enabled: true,
    channels: ['email', 'dashboard', 'webhook'],
    criticalAlertEmail: 'yassine@example.com',
    webhookUrl: '',
    dailyDigestTime: '09:00',
    weeklyReportDay: 'monday'
  },

  // Approval Settings
  approvalTimeout: 86400000, // 24 hours to approve
  autoApproveThreshold: 0.9, // Auto-approve if confidence > 90%
  requireApprovalFor: ['user-approval-gate'],

  // Resource Limits
  maxMemoryUsage: 4096, // MB
  maxCpuUsage: 80, // Percentage
  maxDiskUsage: 10240, // MB

  // Logging
  logLevel: 'info' as 'debug' | 'info' | 'warn' | 'error',
  logRetention: 7, // days
  detailedLogging: true,

  // Feature Flags
  features: {
    parallelExecution: true,
    autoRetry: true,
    deadLetterQueue: true,
    healthMonitoring: true,
    performanceMetrics: true,
    autoScaling: false,
    loadBalancing: false
  }
};

// Priority Weights for Queue Processing
export const PRIORITY_WEIGHTS: Record<AgentPriority, number> = {
  critical: 100,
  high: 75,
  medium: 50,
  low: 25
};

// Agent to Class Name Mapping
export const AGENT_CLASS_MAPPING: Record<string, string> = {
  'trend-scout': 'TrendScoutAgent',
  'opportunity-validator': 'OpportunityValidatorAgent',
  'user-approval-gate': 'UserApprovalGate',
  'product-architecture': 'ProductArchitectAgent',
  'ai-prompt-generator': 'PromptGeneratorAgent',
  'content-scheduler': 'ContentSchedulerAgent',
  'ai-design-generator': 'AIDesignGeneratorAgent',
  'video-creator': 'VideoCreatorAgent',
  'thumbnail-generator': 'ThumbnailCreatorAgent',
  'watermark-remover': 'WatermarkRemoverAgent',
  'quality-control': 'QualityControlAgent',
  'product-packager': 'ProductPackagerAgent',
  'seo-optimizer': 'SEOOptimizerAgent',
  'multi-platform-adapter': 'MultiPlatformAdapterAgent',
  'youtube-automation': 'YouTubeAutomationAgent',
  'instagram-automation': 'InstagramAutomationAgent',
  'tiktok-automation': 'TikTokAutomationAgent',
  'pinterest-automation': 'PinterestAutomationAgent',
  'facebook-automation': 'FacebookAutomationAgent',
  'multi-platform-publisher': 'MultiPlatformPublisherAgent',
  'etsy-publisher': 'EtsyPublisherAgent',
  'gumroad-publisher': 'GumroadPublisherAgent',
  'shopify-publisher': 'ShopifyPublisherAgent',
  'creative-market-publisher': 'CreativeMarketPublisherAgent',
  'marketing-content': 'MarketingContentAgent',
  'email-campaign': 'EmailCampaignAgent',
  'customer-hunter': 'CustomerHunterAgent',
  'comment-manager': 'CommentManagerAgent',
  'dm-responder': 'DMResponderAgent',
  'social-engagement': 'SocialEngagementAgent',
  'influencer-outreach': 'InfluencerOutreachAgent',
  'cross-promotion': 'CrossPromotionAgent',
  'lead-capture': 'LeadCaptureAgent',
  'upsell-agent': 'UpsellAgent',
  'customer-service': 'CustomerServiceAgent',
  'delivery-agent': 'DeliveryAgent',
  'follow-up-agent': 'FollowUpAgent',
  'review-manager': 'ReviewManagerAgent',
  'analytics-tracker': 'AnalyticsTrackerAgent',
  'performance-monitor': 'PerformanceMonitorAgent',
  'ab-testing': 'ABTestingAgent',
  'roi-calculator': 'ROICalculatorAgent',
  'competitor-analyzer': 'CompetitorAnalyzerAgent',
  'trend-predictor': 'TrendPredictorAgent',
  'growth-advisor': 'GrowthAdvisorAgent',
  'inventory-manager': 'InventoryManagerAgent',
  'pricing-optimizer': 'PricingOptimizerAgent',
  'legal-compliance': 'LegalComplianceAgent',
  'backup-agent': 'BackupAgent',
  'security-agent': 'SecurityAgent',
  'report-generator': 'ReportGeneratorAgent',
  'notification-agent': 'NotificationAgent'
};

// Helper Functions
export function getAgentsByChain(chainId: number): AgentConfig[] {
  return Object.values(AGENT_REGISTRY).filter(agent => agent.chainId === chainId);
}

export function getAgentDependencies(agentId: string): AgentConfig[] {
  const agent = AGENT_REGISTRY[agentId];
  if (!agent) return [];
  return agent.dependencies.map(depId => AGENT_REGISTRY[depId]).filter(Boolean);
}

export function getAgentDependents(agentId: string): AgentConfig[] {
  return Object.values(AGENT_REGISTRY).filter(agent =>
    agent.dependencies.includes(agentId)
  );
}

export function getChainExecutionOrder(): number[] {
  return Object.keys(CHAIN_REGISTRY).map(Number).sort((a, b) => a - b);
}

export function getAllAgentIds(): string[] {
  return Object.keys(AGENT_REGISTRY);
}

export function getEnabledAgents(): AgentConfig[] {
  return Object.values(AGENT_REGISTRY).filter(agent => agent.enabled);
}

export function getAgentsByPriority(priority: AgentPriority): AgentConfig[] {
  return Object.values(AGENT_REGISTRY).filter(agent => agent.priority === priority);
}

export function calculateTotalTimeout(): number {
  return Object.values(AGENT_REGISTRY).reduce((sum, agent) => sum + agent.timeout, 0);
}

export default {
  AGENT_REGISTRY,
  CHAIN_REGISTRY,
  ORCHESTRATION_SETTINGS,
  PRIORITY_WEIGHTS,
  AGENT_CLASS_MAPPING,
  getAgentsByChain,
  getAgentDependencies,
  getAgentDependents,
  getChainExecutionOrder,
  getAllAgentIds,
  getEnabledAgents,
  getAgentsByPriority,
  calculateTotalTimeout
};
