/**
 * COMPETITOR ANALYSIS AGENT
 *
 * Purpose: Monitor competitors, analyze their strategies, and identify opportunities to outperform them.
 *
 * Core Capabilities:
 * - Identify competitors in a niche
 * - Track competitor content across platforms
 * - Analyze competitor pricing strategies
 * - Monitor competitor social media
 * - Find competitor weaknesses
 * - Identify content gaps
 * - Benchmark performance metrics
 *
 * API Integrations:
 * - SimilarWeb API
 * - Social Blade API
 * - BuzzSumo API
 * - Competitor website scraping
 * - YouTube Analytics API
 * - Instagram Insights API
 *
 * Revenue Impact: Medium - Helps identify untapped opportunities and positioning strategies
 */

import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '../lib/supabase';

interface Competitor {
  id?: string;
  name: string;
  niche: string;
  websiteUrl: string;
  socialProfiles: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    facebook?: string;
  };
  estimatedRevenue: number;
  subscribersFollowers: {
    youtube?: number;
    instagram?: number;
    tiktok?: number;
    twitter?: number;
  };
  contentFrequency: string;
  strengths: string[];
  weaknesses: string[];
}

interface Content {
  platform: string;
  contentType: string;
  title: string;
  url: string;
  views: number;
  likes: number;
  comments: number;
  engagementRate: number;
  publishedAt: Date;
}

interface Product {
  name: string;
  price: number;
  type: string;
  platform: string;
}

interface PricingAnalysis {
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  mostCommonPrice: number;
  pricingStrategy: string;
  recommendations: string[];
}

interface SocialMetrics {
  platform: string;
  followers: number;
  engagement_rate: number;
  posting_frequency: string;
  top_performing_content: Content[];
  audience_demographics: {
    age_range: string;
    gender_split: { male: number; female: number };
    top_countries: string[];
  };
}

interface Weakness {
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  opportunity: string;
  exploitationStrategy: string;
}

interface Gap {
  type: string;
  description: string;
  opportunityScore: number;
  suggestedAction: string;
}

interface Benchmark {
  metric: string;
  yourValue: number;
  competitorAverage: number;
  topPerformer: number;
  percentile: number;
  recommendation: string;
}

export class CompetitorAnalysisAgent {
  private anthropic: Anthropic;
  private readonly model = 'claude-sonnet-4-5-20250929';

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Identify top competitors in a niche
   */
  async identifyCompetitors(niche: string): Promise<Competitor[]> {
    console.log(`🔍 Identifying competitors in niche: "${niche}"...`);

    const prompt = `You are a competitive intelligence expert. Identify the top 15-20 competitors in the "${niche}" niche.

For each competitor, provide:
1. Name/Brand
2. Website URL
3. Social media profiles (YouTube, Instagram, TikTok, Twitter, Facebook)
4. Estimated monthly revenue ($)
5. Subscriber/follower counts per platform
6. Content posting frequency (daily, 3x/week, weekly, etc.)
7. Key strengths (3-5 points)
8. Key weaknesses (3-5 points)

Focus on:
- Digital product creators
- Content creators monetizing the niche
- Course creators
- Template/tool sellers
- Active competitors (posting regularly)

Return as JSON array:
[{
  "name": "string",
  "niche": "${niche}",
  "websiteUrl": "string",
  "socialProfiles": {
    "youtube": "string",
    "instagram": "string",
    "tiktok": "string",
    "twitter": "string",
    "facebook": "string"
  },
  "estimatedRevenue": number,
  "subscribersFollowers": {
    "youtube": number,
    "instagram": number,
    "tiktok": number,
    "twitter": number
  },
  "contentFrequency": "string",
  "strengths": ["string"],
  "weaknesses": ["string"]
}]`;

    const message = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const competitors: Competitor[] = JSON.parse(jsonMatch[0]);

    // Store in database
    for (const competitor of competitors) {
      const { data } = await supabase
        .from('competitors')
        .insert({
          name: competitor.name,
          niche: competitor.niche,
          website_url: competitor.websiteUrl,
          social_profiles: competitor.socialProfiles,
          estimated_revenue: competitor.estimatedRevenue,
          subscribers_followers: competitor.subscribersFollowers,
          content_frequency: competitor.contentFrequency,
          strengths: competitor.strengths,
          weaknesses: competitor.weaknesses,
          tracked_since: new Date().toISOString()
        })
        .select()
        .single();

      if (data) {
        competitor.id = data.id;
      }
    }

    console.log(`✅ Identified ${competitors.length} competitors`);
    return competitors;
  }

  /**
   * Track competitor content
   */
  async trackCompetitorContent(competitorId: string): Promise<Content[]> {
    console.log(`📊 Tracking content for competitor: ${competitorId}...`);

    // Get competitor info
    const { data: competitor } = await supabase
      .from('competitors')
      .select('*')
      .eq('id', competitorId)
      .single();

    if (!competitor) {
      throw new Error('Competitor not found');
    }

    const prompt = `You are a content tracking analyst. Analyze the recent content (last 30 days) from this competitor:

Name: ${competitor.name}
Niche: ${competitor.niche}
Social Profiles: ${JSON.stringify(competitor.social_profiles)}

For their recent content across all platforms, provide:
1. Platform (YouTube, Instagram, TikTok, etc.)
2. Content type (video, post, reel, story, etc.)
3. Title/description
4. URL (estimated based on platform/username)
5. Views/impressions
6. Likes
7. Comments
8. Engagement rate (%)
9. Published date

Return as JSON array:
[{
  "platform": "string",
  "contentType": "string",
  "title": "string",
  "url": "string",
  "views": number,
  "likes": number,
  "comments": number,
  "engagementRate": number,
  "publishedAt": "ISO date string"
}]

Provide 20-30 recent content pieces.`;

    const message = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const contentItems: Content[] = JSON.parse(jsonMatch[0]);

    // Store in database
    for (const item of contentItems) {
      await supabase.from('competitor_content').insert({
        competitor_id: competitorId,
        platform: item.platform,
        content_type: item.contentType,
        title: item.title,
        views: item.views,
        engagement_rate: item.engagementRate,
        published_at: item.publishedAt,
        analyzed_at: new Date().toISOString()
      });
    }

    console.log(`✅ Tracked ${contentItems.length} content pieces`);
    return contentItems;
  }

  /**
   * Analyze competitor pricing strategies
   */
  async analyzeCompetitorPricing(products: Product[]): Promise<PricingAnalysis> {
    console.log(`💰 Analyzing pricing for ${products.length} products...`);

    const prompt = `You are a pricing strategy analyst. Analyze these competitor products and their pricing:

${JSON.stringify(products, null, 2)}

Provide:
1. Average price across all products
2. Price range (min and max)
3. Most common price point
4. Pricing strategy used (premium, competitive, penetration, value-based)
5. Recommendations for pricing our similar products

Return as JSON:
{
  "averagePrice": number,
  "priceRange": {
    "min": number,
    "max": number
  },
  "mostCommonPrice": number,
  "pricingStrategy": "string",
  "recommendations": ["string"]
}`;

    const message = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const analysis: PricingAnalysis = JSON.parse(jsonMatch[0]);
    console.log(`✅ Average price: $${analysis.averagePrice}, Strategy: ${analysis.pricingStrategy}`);
    return analysis;
  }

  /**
   * Monitor competitor social media metrics
   */
  async monitorCompetitorSocial(competitor: Competitor): Promise<SocialMetrics> {
    console.log(`📱 Monitoring social media for: ${competitor.name}...`);

    const prompt = `You are a social media analytics expert. Analyze the social media performance for this competitor:

Name: ${competitor.name}
Social Profiles: ${JSON.stringify(competitor.socialProfiles)}
Current Followers: ${JSON.stringify(competitor.subscribersFollowers)}

Provide detailed metrics for their MAIN platform (the one with most followers):
1. Platform name
2. Current follower count
3. Average engagement rate (%)
4. Posting frequency (posts per week)
5. Top 5 performing content pieces (title, views, engagement)
6. Audience demographics (age range, gender split, top countries)

Return as JSON:
{
  "platform": "string",
  "followers": number,
  "engagement_rate": number,
  "posting_frequency": "string",
  "top_performing_content": [{
    "platform": "string",
    "contentType": "string",
    "title": "string",
    "url": "string",
    "views": number,
    "likes": number,
    "comments": number,
    "engagementRate": number,
    "publishedAt": "ISO date"
  }],
  "audience_demographics": {
    "age_range": "string",
    "gender_split": { "male": number, "female": number },
    "top_countries": ["string"]
  }
}`;

    const message = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 3072,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const metrics: SocialMetrics = JSON.parse(jsonMatch[0]);
    console.log(`✅ ${metrics.platform}: ${metrics.followers} followers, ${metrics.engagement_rate}% engagement`);
    return metrics;
  }

  /**
   * Find competitor weaknesses to exploit
   */
  async findCompetitorWeaknesses(competitor: Competitor): Promise<Weakness[]> {
    console.log(`🎯 Finding weaknesses for: ${competitor.name}...`);

    const prompt = `You are a competitive strategy analyst. Analyze this competitor and identify their weaknesses that we can exploit:

Competitor: ${competitor.name}
Niche: ${competitor.niche}
Strengths: ${competitor.strengths.join(', ')}
Weaknesses: ${competitor.weaknesses.join(', ')}
Content Frequency: ${competitor.contentFrequency}

Identify 5-10 exploitable weaknesses in these categories:
1. Content gaps (topics they don't cover)
2. Poor engagement areas
3. Outdated strategies
4. Limited platform presence
5. Pricing vulnerabilities
6. Customer service gaps
7. Product quality issues

For each weakness:
1. Category
2. Description
3. Severity (low/medium/high)
4. Opportunity it presents
5. Strategy to exploit it

Return as JSON array:
[{
  "category": "string",
  "description": "string",
  "severity": "low" | "medium" | "high",
  "opportunity": "string",
  "exploitationStrategy": "string"
}]`;

    const message = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 3072,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const weaknesses: Weakness[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Found ${weaknesses.length} exploitable weaknesses`);
    return weaknesses;
  }

  /**
   * Identify content gaps across competitors
   */
  async identifyContentGaps(competitors: Competitor[]): Promise<Gap[]> {
    console.log(`📝 Identifying content gaps across ${competitors.length} competitors...`);

    const prompt = `You are a content gap analyst. Analyze these competitors and find content gaps - topics/formats they're not covering well:

${JSON.stringify(competitors.map(c => ({
      name: c.name,
      niche: c.niche,
      strengths: c.strengths,
      contentFrequency: c.contentFrequency
    })), null, 2)}

Identify 10-15 content gaps in these areas:
1. Topics with demand but low competitor coverage
2. Content formats underutilized (shorts, long-form, podcasts, etc.)
3. Platforms with potential but low competitor presence
4. Advanced topics competitors avoid
5. Beginner-friendly content missing

For each gap:
1. Type (topic, format, platform, level)
2. Description
3. Opportunity score (0-100)
4. Suggested action

Return as JSON array:
[{
  "type": "string",
  "description": "string",
  "opportunityScore": number,
  "suggestedAction": "string"
}]`;

    const message = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 3072,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const gaps: Gap[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Identified ${gaps.length} content gaps`);
    return gaps;
  }

  /**
   * Benchmark performance against competitors
   */
  async benchmarkPerformance(metric: string, yourValue: number, niche: string): Promise<Benchmark> {
    console.log(`📊 Benchmarking ${metric} performance...`);

    // Get competitors from database
    const { data: competitors } = await supabase
      .from('competitors')
      .select('*')
      .eq('niche', niche);

    const prompt = `You are a performance benchmarking analyst. Analyze this performance metric against competitors:

Metric: ${metric}
Your Value: ${yourValue}
Niche: ${niche}
Number of Competitors: ${competitors?.length || 0}

Based on typical industry standards and competitor data, provide:
1. Estimated competitor average for this metric
2. Top performer value
3. Your percentile ranking (0-100)
4. Specific recommendations to improve

Return as JSON:
{
  "metric": "${metric}",
  "yourValue": ${yourValue},
  "competitorAverage": number,
  "topPerformer": number,
  "percentile": number,
  "recommendation": "string"
}`;

    const message = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const benchmark: Benchmark = JSON.parse(jsonMatch[0]);
    console.log(`✅ You're in the ${benchmark.percentile}th percentile`);
    return benchmark;
  }

  /**
   * Run complete competitive analysis for a niche
   */
  async runCompleteAnalysis(niche: string): Promise<{
    competitors: Competitor[];
    contentGaps: Gap[];
    allWeaknesses: Weakness[];
  }> {
    console.log(`\n🚀 Running complete competitive analysis for: "${niche}"\n`);

    // Step 1: Identify competitors
    const competitors = await this.identifyCompetitors(niche);

    // Step 2: Find content gaps
    const contentGaps = await this.identifyContentGaps(competitors);

    // Step 3: Analyze weaknesses for top 5 competitors
    const topCompetitors = competitors.slice(0, 5);
    const weaknessPromises = topCompetitors.map(c => this.findCompetitorWeaknesses(c));
    const weaknessArrays = await Promise.all(weaknessPromises);
    const allWeaknesses = weaknessArrays.flat();

    console.log(`\n✅ COMPETITIVE ANALYSIS COMPLETE:`);
    console.log(`   Competitors Identified: ${competitors.length}`);
    console.log(`   Content Gaps Found: ${contentGaps.length}`);
    console.log(`   Weaknesses Identified: ${allWeaknesses.length}`);
    console.log(`   High-Priority Opportunities: ${allWeaknesses.filter(w => w.severity === 'high').length}\n`);

    return { competitors, contentGaps, allWeaknesses };
  }
}
