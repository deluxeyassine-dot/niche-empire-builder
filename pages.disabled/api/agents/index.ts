/**
 * API Route: List All Agents
 * GET /api/agents
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { orchestrator } from '../../../src/lib/agent-orchestrator';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const agents = orchestrator.listAgents();

    const agentsByCategory = {
      contentDiscovery: [
        'TrendScout',
        'OpportunityValidator',
        'KeywordMining',
        'CompetitorAnalysis',
        'AudienceResearch',
        'ContentGapFinder',
      ],
      productCreation: [
        'ProductArchitect',
        'AIDesignGenerator',
        'ContentTemplateGenerator',
        'CourseBuilder',
        'EbookWriter',
        'ToolSoftwareGenerator',
        'PromptGenerator',
      ],
      qualityAndContent: [
        'QualityControl',
        'VideoCreator',
        'BlogPostWriter',
        'SocialMediaContentGenerator',
        'EmailSequenceGenerator',
        'AdCopyGenerator',
        'SalesPageBuilder',
        'ThumbnailCreator',
      ],
      publishingAndDistribution: [
        'MultiPlatformPublisher',
        'SEOOptimizer',
        'SocialMediaManager',
        'EmailAutomation',
        'AffiliatePromotion',
        'PlatformCrossPromoter',
      ],
      customerAcquisition: [
        'CustomerHunter',
        'ColdEmailOutreach',
        'CommunityBuilder',
        'InfluencerOutreach',
        'PaidAdsManager',
      ],
      engagementAndConversion: [
        'CommentManager',
        'DMResponder',
        'ReviewManager',
        'FAQBot',
        'ObjectionHandler',
        'ChatbotSales',
        'Upsell',
      ],
      analyticsAndOptimization: [
        'PerformanceAnalytics',
        'ABTesting',
        'PricingOptimizer',
        'ContentPerformanceAnalyzer',
        'GrowthAdvisor',
      ],
      supportAndRetention: [
        'CustomerSupport',
        'RefundPrevention',
        'RetentionOptimizer',
        'Onboarding',
      ],
      revenueOptimization: [
        'LaunchManager',
        'BundleCreator',
        'AffiliateRecruiter',
        'ProductPackager',
      ],
    };

    res.status(200).json({
      success: true,
      totalAgents: agents.length,
      agents,
      agentsByCategory,
    });
  } catch (error) {
    console.error('Error listing agents:', error);
    res.status(500).json({
      error: 'Failed to list agents',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
