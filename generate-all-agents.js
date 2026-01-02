const fs = require('fs');
const path = require('path');

const agents = [
  { num: 15, name: 'VideoCreatorAgent', purpose: 'Automatically create professional videos for YouTube, TikTok, Instagram Reels using AI', impact: 'Very High - video content drives massive traffic and engagement', methods: ['generateScript', 'createStoryboard', 'generateVoiceover', 'createVisuals', 'assembleVideo', 'addCaptions', 'optimizeForPlatform'] },
  { num: 16, name: 'BlogPostWriterAgent', purpose: 'Write SEO-optimized blog posts that rank on Google and drive organic traffic', impact: 'High - drives organic traffic = free leads forever', methods: ['writeBlogPost', 'optimizeForSEO', 'addInternalLinks', 'generateMetaData', 'addImages', 'createFeaturedImage', 'formatForReadability'] },
  { num: 17, name: 'SocialMediaContentGeneratorAgent', purpose: 'Create engaging social media posts for all platforms', impact: 'High - social media drives traffic and builds brand authority', methods: ['generatePosts', 'createCarousel', 'designInfographic', 'writeThreads', 'optimizeForPlatform', 'addHashtags', 'scheduleOptimalTime'] },
  { num: 18, name: 'EmailSequenceGeneratorAgent', purpose: 'Create complete email marketing sequences', impact: 'Very High - email marketing = highest ROI channel', methods: ['createWelcomeSequence', 'buildNurtureSequence', 'generateSalesSequence', 'writeEmail', 'optimizeSubjectLine', 'addPersonalization', 'predictOpenRate'] },
  { num: 19, name: 'AdCopyGeneratorAgent', purpose: 'Write high-converting ad copy for advertising platforms', impact: 'Very High - good ad copy = 2-5x better conversion rates', methods: ['generateAdCopy', 'createHeadlines', 'writeDescriptions', 'testAdVariations', 'optimizeForConversion', 'addCallToAction'] },
  { num: 20, name: 'SalesPageBuilderAgent', purpose: 'Create high-converting sales pages', impact: 'Very High - sales pages directly drive revenue', methods: ['buildSalesPage', 'writeHeadline', 'craftValueProposition', 'generateFAQs', 'applyConversionFramework', 'addSocialProof', 'optimizeCheckoutFlow'] },
  { num: 21, name: 'ThumbnailCreatorAgent', purpose: 'Generate eye-catching thumbnails', impact: 'High - thumbnails drive click-through rates', methods: ['generateThumbnail', 'designWithText', 'optimizeForPlatform', 'createVariations', 'testEffectiveness', 'applyBranding'] },
  { num: 22, name: 'MultiPlatformPublisherAgent', purpose: 'Publish content across all platforms simultaneously', impact: 'High - saves time and maximizes reach', methods: ['publishToAll', 'scheduleContent', 'optimizePerPlatform', 'trackPublishing', 'handleErrors', 'generateReports'] },
  { num: 23, name: 'SEOOptimizerAgent', purpose: 'Optimize all content for search engines', impact: 'Very High - SEO drives free, sustainable traffic', methods: ['optimizeContent', 'analyzeKeywords', 'improveMetaTags', 'buildBacklinks', 'auditSEO', 'trackRankings', 'generateSitemap'] },
  { num: 24, name: 'SocialMediaManagerAgent', purpose: 'Manage and automate social media', impact: 'High - consistent posting builds audience', methods: ['schedulePostsOptimally', 'engageWithAudience', 'growFollowers', 'analyzePerformance', 'respondToMentions', 'trackTrends'] },
  { num: 25, name: 'EmailAutomationAgent', purpose: 'Automate email campaigns and sequences', impact: 'Very High - email automation = highest ROI', methods: ['setupAutomation', 'triggerSequences', 'segmentAudience', 'personalizeEmails', 'trackMetrics', 'optimizeTiming'] },
  { num: 26, name: 'AffiliatePromotionAgent', purpose: 'Promote products through affiliate networks', impact: 'High - passive income through affiliates', methods: ['findAffiliatePrograms', 'createPromotionalContent', 'trackCommissions', 'optimizeCampaigns', 'buildLandingPages'] },
  { num: 27, name: 'PlatformCrossPromoterAgent', purpose: 'Cross-promote content across platforms', impact: 'Medium-High - increases reach', methods: ['identifyOpportunities', 'repurposeContent', 'crossPost', 'trackEffectiveness', 'optimizeStrategy'] },
  { num: 28, name: 'CustomerHunterAgent', purpose: 'Find and target ideal customers', impact: 'Very High - targeted acquisition', methods: ['identifyTargetCustomers', 'researchProspects', 'buildProspectLists', 'scoreLeads', 'enrichData', 'generateOutreachLists'] },
  { num: 29, name: 'ColdEmailOutreachAgent', purpose: 'Automate personalized cold email campaigns', impact: 'High - direct customer acquisition', methods: ['personalizeEmails', 'scheduleOutreach', 'trackResponses', 'followUp', 'warmUpDomain', 'optimizeDeliverability'] },
  { num: 30, name: 'CommunityBuilderAgent', purpose: 'Build and manage online communities', impact: 'High - communities drive engagement', methods: ['createCommunity', 'moderateContent', 'engageMembers', 'organizeEvents', 'growMembership', 'trackEngagement'] },
  { num: 31, name: 'InfluencerOutreachAgent', purpose: 'Find and reach out to influencers', impact: 'High - influencer partnerships drive growth', methods: ['findInfluencers', 'analyzeRelevance', 'craftOutreach', 'manageRelationships', 'trackCollaborations', 'measureROI'] },
  { num: 32, name: 'PaidAdsManagerAgent', purpose: 'Manage and optimize paid advertising', impact: 'Very High - scalable acquisition', methods: ['createCampaigns', 'optimizeBudget', 'targetAudiences', 'trackROAS', 'adjustBidding', 'scaleWinners'] },
  { num: 33, name: 'CommentManagerAgent', purpose: 'Auto-respond to comments', impact: 'Medium-High - engagement drives visibility', methods: ['monitorComments', 'respondIntelligently', 'filterSpam', 'engagePositively', 'handleNegative', 'trackSentiment'] },
  { num: 34, name: 'DMResponderAgent', purpose: 'Automatically respond to direct messages', impact: 'Medium - improves experience', methods: ['monitorDMs', 'respondIntelligently', 'qualifyLeads', 'escalateToHuman', 'trackConversations'] },
  { num: 35, name: 'ReviewManagerAgent', purpose: 'Monitor and respond to reviews', impact: 'High - reviews drive trust', methods: ['monitorReviews', 'respondToReviews', 'handleNegative', 'encouragePositive', 'analyzeReviewSentiment', 'generateInsights'] },
  { num: 36, name: 'FAQBotAgent', purpose: 'Answer common questions automatically', impact: 'Medium - reduces support load', methods: ['buildKnowledgeBase', 'answerQuestions', 'learnsFromInteractions', 'suggestArticles', 'escalateComplex'] },
  { num: 37, name: 'ObjectionHandlerAgent', purpose: 'Identify and address customer objections', impact: 'High - removes purchase barriers', methods: ['identifyObjections', 'craftResponses', 'handleInRealTime', 'trackPatterns', 'optimizeResponses'] },
  { num: 38, name: 'ChatbotSalesAgent', purpose: 'AI chatbot that qualifies and closes sales', impact: 'Very High - 24/7 automated sales', methods: ['qualifyLeads', 'presentOffers', 'handleObjections', 'closeDeals', 'upsellProducts', 'trackConversions'] },
  { num: 39, name: 'UpsellAgent', purpose: 'Automatically offer upsells and cross-sells', impact: 'Very High - increases AOV by 30-50%', methods: ['identifyOpportunities', 'recommendProducts', 'createOffers', 'timePerfectly', 'trackAcceptance', 'optimizeOffers'] },
  { num: 40, name: 'PerformanceAnalyticsAgent', purpose: 'Track and analyze all metrics', impact: 'High - data-driven decisions', methods: ['trackMetrics', 'generateReports', 'identifyTrends', 'predictPerformance', 'visualizeData', 'alertAnomalies'] },
  { num: 41, name: 'ABTestingAgent', purpose: 'Run A/B tests on content and strategies', impact: 'High - continuous optimization', methods: ['createExperiments', 'runTests', 'analyzeResults', 'determineWinners', 'implementChanges', 'trackLiftResults'] },
  { num: 42, name: 'PricingOptimizerAgent', purpose: 'Optimize pricing strategies', impact: 'Very High - pricing = biggest revenue lever', methods: ['analyzePricing', 'testPricePoints', 'segmentPricing', 'dynamicPricing', 'maximizeRevenue', 'trackElasticity'] },
  { num: 43, name: 'ContentPerformanceAnalyzerAgent', purpose: 'Analyze what content performs best', impact: 'High - double down on what works', methods: ['trackContentMetrics', 'identifyTopPerformers', 'analyzePatterns', 'recommendFormats', 'predictSuccess'] },
  { num: 44, name: 'GrowthAdvisorAgent', purpose: 'Provide strategic growth recommendations', impact: 'High - strategic guidance accelerates growth', methods: ['analyzeGrowth', 'identifyBottlenecks', 'recommendStrategies', 'prioritizeInitiatives', 'forecastImpact'] },
  { num: 45, name: 'CustomerSupportAgent', purpose: 'Provide AI-powered customer support 24/7', impact: 'High - happy customers = fewer refunds', methods: ['handleTickets', 'provideSupport', 'troubleshootIssues', 'escalateComplex', 'trackSatisfaction'] },
  { num: 46, name: 'RefundPreventionAgent', purpose: 'Identify at-risk customers and intervene', impact: 'Very High - saves thousands in refunds', methods: ['identifyAtRiskCustomers', 'interveneProactively', 'addressConcerns', 'offerSolutions', 'trackPreventionRate'] },
  { num: 47, name: 'RetentionOptimizerAgent', purpose: 'Maximize customer lifetime value', impact: 'Very High - retention = higher LTV', methods: ['identifyChurnRisk', 'implementRetentionStrategies', 'engageInactives', 'rewardLoyalty', 'trackRetention'] },
  { num: 48, name: 'OnboardingAgent', purpose: 'Automate customer onboarding', impact: 'High - good onboarding = lower churn', methods: ['createOnboardingFlow', 'guideNewCustomers', 'trackProgress', 'personalizeExperience', 'measureActivation'] },
  { num: 49, name: 'LaunchManagerAgent', purpose: 'Orchestrate product launches', impact: 'Very High - launches = revenue spikes', methods: ['planLaunch', 'coordinateChannels', 'buildHype', 'executeLaunch', 'trackResults', 'postLaunchOptimization'] },
  { num: 50, name: 'BundleCreatorAgent', purpose: 'Create and optimize product bundles', impact: 'High - bundles increase AOV', methods: ['analyzeProducts', 'createBundles', 'priceBundles', 'testCombinations', 'trackPerformance', 'optimizeMix'] },
  { num: 51, name: 'AffiliateRecruiterAgent', purpose: 'Recruit and onboard affiliates', impact: 'Very High - affiliates = scalable sales', methods: ['findAffiliates', 'reachOut', 'onboardAffiliates', 'provideResources', 'trackPerformance', 'incentivizeTop'] },
  { num: 52, name: 'ProductPackagerAgent', purpose: 'Package products for market release', impact: 'High - professional packaging = higher value', methods: ['assembleProduct', 'createPackaging', 'writeDescriptions', 'setPricing', 'prepareLaunch', 'generateAssets'] }
];

const template = (agent) => `/**
 * ${agent.name} (#${agent.num})
 *
 * Purpose: ${agent.purpose}
 *
 * Revenue Impact: ${agent.impact}
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// =====================================================================
// INTERFACES
// =====================================================================

export interface AgentConfig {
  anthropicApiKey: string;
  supabaseUrl: string;
  supabaseKey: string;
}

// =====================================================================
// ${agent.name.toUpperCase()}
// =====================================================================

export class ${agent.name} {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

${agent.methods.map(method => `  /**
   * ${method.charAt(0).toUpperCase() + method.slice(1).replace(/([A-Z])/g, ' $1').trim()}
   */
  async ${method}(params: any): Promise<any> {
    console.log(\`🚀 ${agent.name}: ${method}\`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: \`Execute ${method} with params: \${JSON.stringify(params)}\`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(\`✅ ${method} completed successfully\`);
      return result;
    } catch (error) {
      console.error(\`Error in ${method}:\`, error);
      throw error;
    }
  }
`).join('\n')}
  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(\`\\n🚀 Running complete ${agent.name} workflow\\n\`);

    try {
      const results: any = {};

${agent.methods.slice(0, 3).map(method => `      results.${method} = await this.${method}(params);`).join('\n')}

      console.log(\`\\n✅ ${agent.name} workflow complete!\\n\`);
      return results;
    } catch (error) {
      console.error('Error in complete workflow:', error);
      throw error;
    }
  }

  // =====================================================================
  // HELPER METHODS
  // =====================================================================

  private parseResponse(content: any): any {
    try {
      const text = Array.isArray(content) ? content[0]?.text || '{}' : content.text || '{}';
      const jsonMatch = text.match(/\\{[\\s\\S]*\\}|\\[[\\s\\S]*\\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      return {};
    }
  }

  private async storeData(table: string, data: any): Promise<void> {
    try {
      await this.supabase.from(table).insert(data);
      console.log(\`💾 Data stored in \${table}\`);
    } catch (error) {
      console.error(\`Error storing data in \${table}:\`, error);
    }
  }
}

// =====================================================================
// EXPORT
// =====================================================================

export default ${agent.name};
`;

const agentsDir = path.join(__dirname, 'src', 'agents');

agents.forEach(agent => {
  const filename = path.join(agentsDir, `${agent.name}.ts`);
  const content = template(agent);

  fs.writeFileSync(filename, content, 'utf8');
  console.log(`✅ Created: ${agent.name}.ts`);
});

console.log(`\n🎉 Successfully created all ${agents.length} agents!\n`);
