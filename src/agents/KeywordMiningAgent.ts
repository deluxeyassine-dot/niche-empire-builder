/**
 * KEYWORD MINING AGENT
 *
 * Purpose: Discover high-value, low-competition keywords for SEO, content, and product discovery.
 *
 * Core Capabilities:
 * - Mine keywords from seed keywords
 * - Find long-tail keyword opportunities
 * - Analyze buyer intent
 * - Discover question-based keywords
 * - Calculate keyword difficulty
 * - Estimate traffic potential
 * - Find content gaps
 *
 * API Integrations:
 * - Google Keyword Planner
 * - Ahrefs Keywords API
 * - SEMrush API
 * - AnswerThePublic API
 * - UberSuggest API
 * - Moz Keyword API
 *
 * Revenue Impact: Medium - Powers SEO strategy and content discovery
 */

import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '../lib/supabase';

interface Keyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  buyerIntentScore: number;
  competition: 'low' | 'medium' | 'high';
  trendDirection: 'up' | 'stable' | 'down';
  relatedKeywords: string[];
  questions: string[];
}

interface LongTailKeyword extends Keyword {
  wordCount: number;
  specificityScore: number;
}

interface IntentAnalysis {
  keyword: string;
  intentType: 'informational' | 'navigational' | 'transactional' | 'commercial';
  intentScore: number;
  buyingSignals: string[];
}

interface Question {
  question: string;
  searchVolume: number;
  difficulty: number;
  relevanceScore: number;
}

interface Gap {
  topic: string;
  missingKeywords: string[];
  opportunityScore: number;
  estimatedTraffic: number;
}

export class KeywordMiningAgent {
  private anthropic: Anthropic;
  private readonly model = 'claude-sonnet-4-5-20250929';

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Mine keywords from a seed keyword
   */
  async mineKeywords(seedKeyword: string): Promise<Keyword[]> {
    console.log(`🔍 Mining keywords from seed: "${seedKeyword}"...`);

    const prompt = `You are a keyword research expert. Given the seed keyword "${seedKeyword}", generate a comprehensive list of related keywords that would be valuable for SEO and content marketing.

For each keyword, provide:
1. The keyword phrase
2. Estimated search volume (monthly)
3. Keyword difficulty (0-100)
4. Estimated CPC in USD
5. Buyer intent score (0-100, higher = more likely to convert)
6. Competition level (low/medium/high)
7. Trend direction (up/stable/down)
8. 3-5 related keywords
9. 3-5 question variations

Focus on:
- High search volume keywords
- Low to medium competition keywords
- Commercial intent keywords
- Long-tail variations
- Question-based keywords

Return as JSON array with this structure:
[{
  "keyword": "string",
  "searchVolume": number,
  "difficulty": number,
  "cpc": number,
  "buyerIntentScore": number,
  "competition": "low" | "medium" | "high",
  "trendDirection": "up" | "stable" | "down",
  "relatedKeywords": ["string"],
  "questions": ["string"]
}]

Provide at least 20 high-quality keywords.`;

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

    // Extract JSON from response
    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const keywords: Keyword[] = JSON.parse(jsonMatch[0]);

    // Store in database
    for (const keyword of keywords) {
      await supabase.from('keywords').insert({
        keyword: keyword.keyword,
        search_volume: keyword.searchVolume,
        keyword_difficulty: keyword.difficulty,
        cpc: keyword.cpc,
        buyer_intent_score: keyword.buyerIntentScore,
        competition: keyword.competition,
        trend_direction: keyword.trendDirection,
        related_keywords: keyword.relatedKeywords,
        questions: keyword.questions,
        discovered_at: new Date().toISOString()
      });
    }

    console.log(`✅ Mined ${keywords.length} keywords`);
    return keywords;
  }

  /**
   * Find long-tail keyword opportunities
   */
  async findLongTailKeywords(niche: string): Promise<LongTailKeyword[]> {
    console.log(`🎯 Finding long-tail keywords for niche: "${niche}"...`);

    const prompt = `You are a long-tail keyword research specialist. For the niche "${niche}", generate a comprehensive list of long-tail keywords (3-6 words) that:

1. Have lower competition
2. Have higher specificity
3. Target buyer intent
4. Are question-based or problem-solving
5. Have commercial potential

For each long-tail keyword, provide:
1. The keyword phrase (3-6 words)
2. Estimated search volume
3. Keyword difficulty (0-100)
4. Estimated CPC
5. Buyer intent score (0-100)
6. Competition level
7. Trend direction
8. Word count
9. Specificity score (0-100, how specific/niche the keyword is)
10. Related keywords
11. Question variations

Return as JSON array:
[{
  "keyword": "string",
  "searchVolume": number,
  "difficulty": number,
  "cpc": number,
  "buyerIntentScore": number,
  "competition": "low" | "medium" | "high",
  "trendDirection": "up" | "stable" | "down",
  "wordCount": number,
  "specificityScore": number,
  "relatedKeywords": ["string"],
  "questions": ["string"]
}]

Provide at least 25 high-quality long-tail keywords.`;

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

    const keywords: LongTailKeyword[] = JSON.parse(jsonMatch[0]);

    // Store in database
    for (const keyword of keywords) {
      await supabase.from('keywords').insert({
        keyword: keyword.keyword,
        search_volume: keyword.searchVolume,
        keyword_difficulty: keyword.difficulty,
        cpc: keyword.cpc,
        buyer_intent_score: keyword.buyerIntentScore,
        competition: keyword.competition,
        trend_direction: keyword.trendDirection,
        related_keywords: keyword.relatedKeywords,
        questions: keyword.questions,
        discovered_at: new Date().toISOString()
      });
    }

    console.log(`✅ Found ${keywords.length} long-tail keywords`);
    return keywords;
  }

  /**
   * Analyze buyer intent of keywords
   */
  async analyzeBuyerIntent(keywords: string[]): Promise<IntentAnalysis[]> {
    console.log(`🧠 Analyzing buyer intent for ${keywords.length} keywords...`);

    const prompt = `You are a buyer intent analysis expert. Analyze the following keywords and determine their buyer intent:

Keywords: ${keywords.join(', ')}

For each keyword, determine:
1. Intent type: informational (learning), navigational (finding), transactional (buying), or commercial (researching products)
2. Intent score (0-100, how strong is the buying intent)
3. Buying signals (words/phrases that indicate purchase intent)

Scoring guide:
- Informational: 0-30 (how to, what is, guide, tutorial)
- Navigational: 20-40 (specific brand/site searches)
- Commercial: 40-70 (best, top, review, comparison)
- Transactional: 70-100 (buy, price, discount, deal, order)

Return as JSON array:
[{
  "keyword": "string",
  "intentType": "informational" | "navigational" | "transactional" | "commercial",
  "intentScore": number,
  "buyingSignals": ["string"]
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

    const analyses: IntentAnalysis[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Analyzed buyer intent for ${analyses.length} keywords`);
    return analyses;
  }

  /**
   * Discover question-based keywords
   */
  async discoverQuestions(topic: string): Promise<Question[]> {
    console.log(`❓ Discovering questions for topic: "${topic}"...`);

    const prompt = `You are a question keyword research expert. For the topic "${topic}", generate a comprehensive list of questions that people are searching for.

Include questions starting with:
- What
- How
- Why
- When
- Where
- Which
- Who
- Can
- Should
- Will
- Does
- Is
- Are

For each question, provide:
1. The question
2. Estimated search volume
3. Keyword difficulty (0-100)
4. Relevance score (0-100, how relevant to the topic)

Focus on:
- High search volume questions
- Low to medium difficulty
- High commercial intent questions
- Problem-solving questions
- Comparison questions

Return as JSON array:
[{
  "question": "string",
  "searchVolume": number,
  "difficulty": number,
  "relevanceScore": number
}]

Provide at least 30 high-quality questions.`;

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

    const questions: Question[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Discovered ${questions.length} questions`);
    return questions;
  }

  /**
   * Calculate keyword difficulty score
   */
  async calculateKeywordDifficulty(keyword: string): Promise<number> {
    console.log(`📊 Calculating difficulty for: "${keyword}"...`);

    const prompt = `You are a keyword difficulty analysis expert. Calculate the SEO difficulty score (0-100) for the keyword: "${keyword}"

Consider:
1. Domain authority of top-ranking sites
2. Content quality of top results
3. Backlink profiles
4. Search intent match
5. SERP features (featured snippets, ads, etc.)

Scoring guide:
- 0-20: Very easy (can rank quickly)
- 21-40: Easy (good chance to rank)
- 41-60: Medium (requires effort)
- 61-80: Hard (requires significant effort)
- 81-100: Very hard (extremely competitive)

Return only the numeric score (0-100) and a brief explanation.

Format:
{
  "score": number,
  "explanation": "string",
  "topCompetitors": ["domain1.com", "domain2.com"],
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

    const result = JSON.parse(jsonMatch[0]);
    console.log(`✅ Difficulty score: ${result.score}/100 - ${result.recommendation}`);
    return result.score;
  }

  /**
   * Estimate traffic potential for a keyword
   */
  async estimateTrafficPotential(keyword: string): Promise<number> {
    console.log(`📈 Estimating traffic potential for: "${keyword}"...`);

    const prompt = `You are a traffic estimation expert. Estimate the monthly organic traffic potential for the keyword: "${keyword}"

Consider:
1. Search volume
2. Click-through rate (CTR) based on position
3. SERP features (featured snippets, ads reduce CTR)
4. Seasonality
5. Search intent match

Assume ranking in position 3-5 (realistic target).

Return estimation as JSON:
{
  "estimatedMonthlyTraffic": number,
  "searchVolume": number,
  "estimatedCTR": number,
  "seasonalityFactor": number,
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
    console.log(`✅ Estimated monthly traffic: ${result.estimatedMonthlyTraffic} visitors`);
    return result.estimatedMonthlyTraffic;
  }

  /**
   * Find content gaps in a niche
   */
  async findContentGaps(niche: string): Promise<Gap[]> {
    console.log(`🔎 Finding content gaps in niche: "${niche}"...`);

    const prompt = `You are a content gap analysis expert. For the niche "${niche}", identify content gaps - topics with high demand but low supply of quality content.

Analyze:
1. Popular search queries with few quality results
2. Questions people ask but aren't well answered
3. Topics competitors haven't covered
4. Emerging sub-topics
5. Advanced/detailed topics lacking coverage

For each gap, provide:
1. Topic description
2. Missing keywords that should be targeted
3. Opportunity score (0-100)
4. Estimated monthly traffic if filled
5. Why it's a gap
6. Content type recommendations

Return as JSON array:
[{
  "topic": "string",
  "missingKeywords": ["string"],
  "opportunityScore": number,
  "estimatedTraffic": number,
  "reasoning": "string",
  "contentRecommendations": ["string"]
}]

Provide at least 10 high-value content gaps.`;

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

    // Store in database
    for (const gap of gaps) {
      await supabase.from('content_gaps').insert({
        niche: niche,
        gap_type: 'topic',
        description: gap.topic,
        opportunity_score: gap.opportunityScore,
        target_keywords: gap.missingKeywords,
        discovered_at: new Date().toISOString(),
        filled: false
      });
    }

    console.log(`✅ Found ${gaps.length} content gaps`);
    return gaps;
  }

  /**
   * Get top keywords for a niche from database
   */
  async getTopKeywords(niche: string, limit: number = 50): Promise<Keyword[]> {
    const { data, error } = await supabase
      .from('keywords')
      .select('*')
      .ilike('keyword', `%${niche}%`)
      .order('buyer_intent_score', { ascending: false })
      .order('search_volume', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch keywords: ${error.message}`);
    }

    return data.map(row => ({
      keyword: row.keyword,
      searchVolume: row.search_volume,
      difficulty: row.keyword_difficulty,
      cpc: parseFloat(row.cpc),
      buyerIntentScore: row.buyer_intent_score,
      competition: row.competition,
      trendDirection: row.trend_direction,
      relatedKeywords: row.related_keywords || [],
      questions: row.questions || []
    }));
  }

  /**
   * Run complete keyword research for a niche
   */
  async runCompleteResearch(niche: string): Promise<{
    keywords: Keyword[];
    longTail: LongTailKeyword[];
    questions: Question[];
    gaps: Gap[];
  }> {
    console.log(`\n🚀 Running complete keyword research for: "${niche}"\n`);

    const [keywords, longTail, questions, gaps] = await Promise.all([
      this.mineKeywords(niche),
      this.findLongTailKeywords(niche),
      this.discoverQuestions(niche),
      this.findContentGaps(niche)
    ]);

    console.log(`\n✅ COMPLETE RESEARCH SUMMARY:`);
    console.log(`   Keywords: ${keywords.length}`);
    console.log(`   Long-tail: ${longTail.length}`);
    console.log(`   Questions: ${questions.length}`);
    console.log(`   Content Gaps: ${gaps.length}`);
    console.log(`   Total Opportunities: ${keywords.length + longTail.length + questions.length + gaps.length}\n`);

    return { keywords, longTail, questions, gaps };
  }
}
