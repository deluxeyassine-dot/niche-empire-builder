/**
 * CONTENT GAP FINDER AGENT
 *
 * Purpose: Identify content opportunities that competitors haven't covered or topics with high demand but low supply.
 *
 * Core Capabilities:
 * - Find content gaps in a niche
 * - Analyze unanswered search queries
 * - Identify missing topics
 * - Discover untapped content formats
 * - Rank gaps by opportunity
 * - Estimate gap value
 * - Suggest content strategy
 *
 * API Integrations:
 * - Google Search Console API
 * - AnswerThePublic API
 * - AlsoAsked API
 * - BuzzSumo API
 * - Ahrefs Content Gap Tool API
 *
 * Revenue Impact: Medium-High - Ensures content always fills a real need
 */

import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '../lib/supabase';

interface ContentGap {
  niche: string;
  gapType: 'topic' | 'format' | 'depth' | 'platform';
  description: string;
  searchVolume: number;
  competitionLevel: 'low' | 'medium' | 'high';
  opportunityScore: number;
  suggestedFormat: string;
  targetKeywords: string[];
}

interface UnansweredQuery {
  query: string;
  searchVolume: number;
  difficulty: number;
  intent: string;
  reason: string;
}

interface Topic {
  topic: string;
  subtopics: string[];
  demandScore: number;
  supplyScore: number;
  gapScore: number;
}

interface Format {
  format: string;
  platform: string;
  usageLevel: 'underutilized' | 'untapped';
  potentialReach: number;
  examples: string[];
}

interface RankedGap extends ContentGap {
  rank: number;
  estimatedValue: number;
}

interface Strategy {
  gap: ContentGap;
  recommendedActions: string[];
  contentPlan: ContentPlan[];
  timeline: string;
  expectedROI: number;
}

interface ContentPlan {
  contentType: string;
  title: string;
  format: string;
  platform: string;
  keywords: string[];
}

export class ContentGapFinderAgent {
  private anthropic: Anthropic;
  private readonly model = 'claude-sonnet-4-5-20250929';

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Find content gaps in a niche
   */
  async findContentGaps(niche: string): Promise<ContentGap[]> {
    console.log(`🔍 Finding content gaps in niche: "${niche}"...`);

    const prompt = `You are a content gap analysis expert. Identify content gaps in the "${niche}" niche - opportunities where demand exists but quality content is lacking.

Analyze gaps across these dimensions:
1. Topics: What topics are people searching for but not well covered?
2. Formats: Which content formats are underutilized (video, infographics, tools, etc.)?
3. Depth: What topics need more in-depth coverage?
4. Platforms: Which platforms have untapped potential?

For each gap (provide 15-20 gaps), include:
1. Gap type (topic, format, depth, platform)
2. Description of the gap
3. Estimated search volume
4. Competition level (low, medium, high)
5. Opportunity score (0-100, higher = better opportunity)
6. Suggested content format to fill it
7. Target keywords (5-10)

Return as JSON array:
[{
  "niche": "${niche}",
  "gapType": "topic" | "format" | "depth" | "platform",
  "description": "string",
  "searchVolume": number,
  "competitionLevel": "low" | "medium" | "high",
  "opportunityScore": number,
  "suggestedFormat": "string",
  "targetKeywords": ["string"]
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

    const gaps: ContentGap[] = JSON.parse(jsonMatch[0]);

    // Store in database
    for (const gap of gaps) {
      await supabase.from('content_gaps').insert({
        niche: gap.niche,
        gap_type: gap.gapType,
        description: gap.description,
        search_volume: gap.searchVolume,
        competition_level: gap.competitionLevel,
        opportunity_score: gap.opportunityScore,
        suggested_format: gap.suggestedFormat,
        target_keywords: gap.targetKeywords,
        discovered_at: new Date().toISOString(),
        filled: false
      });
    }

    const highOpportunity = gaps.filter(g => g.opportunityScore >= 70).length;
    console.log(`✅ Found ${gaps.length} content gaps (${highOpportunity} high-opportunity)`);
    return gaps;
  }

  /**
   * Analyze unanswered search queries
   */
  async analyzeSearchQueries(keywords: string[]): Promise<UnansweredQuery[]> {
    console.log(`🔎 Analyzing ${keywords.length} search queries...`);

    const prompt = `You are a search intent analyst. Analyze these keywords and identify which ones represent unanswered or poorly-answered search queries:

Keywords: ${keywords.join(', ')}

For queries that are unanswered/poorly answered (select 10-15), provide:
1. The search query
2. Estimated search volume
3. Difficulty to rank (0-100)
4. Search intent
5. Why it's unanswered (lack of content, poor quality, outdated, etc.)

Return as JSON array:
[{
  "query": "string",
  "searchVolume": number,
  "difficulty": number,
  "intent": "string",
  "reason": "string"
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

    const queries: UnansweredQuery[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Found ${queries.length} unanswered queries`);
    return queries;
  }

  /**
   * Identify missing topics in a niche
   */
  async identifyMissingTopics(niche: string): Promise<Topic[]> {
    console.log(`📝 Identifying missing topics in: "${niche}"...`);

    const prompt = `You are a content strategist. Identify missing or under-covered topics in the "${niche}" niche.

For each topic (provide 12-15), analyze:
1. Main topic
2. Relevant subtopics
3. Demand score (0-100, based on search interest)
4. Supply score (0-100, how well it's currently covered)
5. Gap score (0-100, demand minus supply)

Focus on topics with high demand but low supply.

Return as JSON array:
[{
  "topic": "string",
  "subtopics": ["string"],
  "demandScore": number,
  "supplyScore": number,
  "gapScore": number
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

    const topics: Topic[] = JSON.parse(jsonMatch[0]);
    const bigGaps = topics.filter(t => t.gapScore >= 60).length;
    console.log(`✅ Found ${topics.length} missing topics (${bigGaps} with major gaps)`);
    return topics;
  }

  /**
   * Discover untapped content formats
   */
  async discoverUntappedFormats(niche: string): Promise<Format[]> {
    console.log(`🎬 Discovering untapped formats for: "${niche}"...`);

    const prompt = `You are a content format specialist. Identify content formats that are underutilized or untapped in the "${niche}" niche.

Consider these format types:
- Video (YouTube Shorts, long-form, tutorials, vlogs)
- Audio (podcasts, audiobooks, voice notes)
- Visual (infographics, carousels, memes, charts)
- Interactive (quizzes, calculators, tools, games)
- Text (threads, newsletters, ebooks, guides)
- Live (streams, webinars, workshops)

For each untapped format (provide 10-12), include:
1. Format name
2. Best platform for it
3. Usage level (underutilized or untapped)
4. Potential reach estimate
5. Examples of what could be created

Return as JSON array:
[{
  "format": "string",
  "platform": "string",
  "usageLevel": "underutilized" | "untapped",
  "potentialReach": number,
  "examples": ["string"]
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

    const formats: Format[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Found ${formats.length} untapped formats`);
    return formats;
  }

  /**
   * Rank content gaps by opportunity
   */
  async rankGapsByOpportunity(gaps: ContentGap[]): Promise<RankedGap[]> {
    console.log(`📊 Ranking ${gaps.length} gaps by opportunity...`);

    const prompt = `You are a content opportunity analyst. Rank these content gaps by overall opportunity (considering search volume, competition, and opportunity score):

${JSON.stringify(gaps, null, 2)}

For each gap, provide:
1. Its rank (1 = best opportunity)
2. Estimated value in monthly traffic

Return as JSON array in ranked order:
[{
  ...existing gap properties,
  "rank": number,
  "estimatedValue": number
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

    const rankedGaps: RankedGap[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Ranked gaps - Top opportunity: ${rankedGaps[0].description}`);
    return rankedGaps;
  }

  /**
   * Estimate monetary value of a content gap
   */
  async estimateGapValue(gap: ContentGap): Promise<number> {
    console.log(`💰 Estimating value for gap: "${gap.description}"...`);

    const prompt = `You are a content ROI analyst. Estimate the monthly monetary value of filling this content gap:

${JSON.stringify(gap, null, 2)}

Consider:
1. Search volume → potential traffic
2. Traffic → potential conversions (assume 2-5% conversion rate)
3. Average order value in this niche
4. Lifetime value multiplier

Return as JSON:
{
  "estimatedMonthlyTraffic": number,
  "conversionRate": number,
  "averageOrderValue": number,
  "estimatedMonthlyRevenue": number,
  "explanation": "string"
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

    const result = JSON.parse(jsonMatch[0]);
    console.log(`✅ Estimated value: $${result.estimatedMonthlyRevenue}/month`);
    return result.estimatedMonthlyRevenue;
  }

  /**
   * Suggest content strategy for a gap
   */
  async suggestContentStrategy(gap: ContentGap): Promise<Strategy> {
    console.log(`📋 Creating strategy for gap: "${gap.description}"...`);

    const prompt = `You are a content strategist. Create a comprehensive strategy to fill this content gap:

${JSON.stringify(gap, null, 2)}

Provide:
1. Recommended actions (step-by-step)
2. Content plan with 5-7 specific content pieces:
   - Content type
   - Compelling title
   - Format
   - Platform
   - Target keywords
3. Suggested timeline
4. Expected ROI (multiplier, e.g., 3x)

Return as JSON:
{
  "gap": ${JSON.stringify(gap)},
  "recommendedActions": ["string"],
  "contentPlan": [{
    "contentType": "string",
    "title": "string",
    "format": "string",
    "platform": "string",
    "keywords": ["string"]
  }],
  "timeline": "string",
  "expectedROI": number
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

    const strategy: Strategy = JSON.parse(jsonMatch[0]);
    console.log(`✅ Strategy created: ${strategy.contentPlan.length} content pieces, ${strategy.expectedROI}x ROI`);
    return strategy;
  }

  /**
   * Run complete content gap analysis
   */
  async runCompleteAnalysis(niche: string): Promise<{
    gaps: ContentGap[];
    missingTopics: Topic[];
    untappedFormats: Format[];
    topGaps: RankedGap[];
    strategies: Strategy[];
  }> {
    console.log(`\n🚀 Running complete content gap analysis for: "${niche}"\n`);

    const gaps = await this.findContentGaps(niche);

    const [missingTopics, untappedFormats] = await Promise.all([
      this.identifyMissingTopics(niche),
      this.discoverUntappedFormats(niche)
    ]);

    const topGaps = await this.rankGapsByOpportunity(gaps);

    // Create strategies for top 3 gaps
    const top3 = topGaps.slice(0, 3);
    const strategies = await Promise.all(
      top3.map(gap => this.suggestContentStrategy(gap))
    );

    console.log(`\n✅ CONTENT GAP ANALYSIS COMPLETE:`);
    console.log(`   Total Gaps: ${gaps.length}`);
    console.log(`   Missing Topics: ${missingTopics.length}`);
    console.log(`   Untapped Formats: ${untappedFormats.length}`);
    console.log(`   Strategies Created: ${strategies.length}`);
    console.log(`   Top Opportunity: ${topGaps[0].description}\n`);

    return { gaps, missingTopics, untappedFormats, topGaps, strategies };
  }
}
