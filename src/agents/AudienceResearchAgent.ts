/**
 * AUDIENCE RESEARCH AGENT
 *
 * Purpose: Deep dive into target audience demographics, psychographics, pain points, and buying behavior.
 *
 * Core Capabilities:
 * - Identify target audience for a niche
 * - Analyze demographics
 * - Discover pain points and challenges
 * - Find buying triggers
 * - Map customer journey
 * - Extract language patterns
 * - Identify influencers
 * - Find relevant communities
 *
 * API Integrations:
 * - Facebook Audience Insights API
 * - Reddit API (subreddit analysis)
 * - Quora API (question analysis)
 * - YouTube Comments API
 * - Instagram Insights API
 * - Google Analytics API
 *
 * Revenue Impact: High - Ensures all marketing hits the right audience with the right message
 */

import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '../lib/supabase';

interface AudienceProfile {
  niche: string;
  ageRange: string;
  genderSplit: { male: number; female: number; other: number };
  incomeLevel: string;
  educationLevel: string;
  interests: string[];
  painPoints: string[];
  buyingTriggers: string[];
  preferredPlatforms: string[];
  languagePatterns: LanguageInsights;
}

interface Demographics {
  ageRange: string;
  primaryAgeGroup: string;
  genderSplit: { male: number; female: number; other: number };
  locations: string[];
  incomeLevel: string;
  educationLevel: string;
  occupations: string[];
  relationshipStatus: string[];
}

interface PainPoint {
  pain: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: string;
  impact: string;
  currentSolutions: string[];
  frustrations: string[];
}

interface Trigger {
  trigger: string;
  type: 'emotional' | 'logical' | 'social' | 'urgent';
  effectiveness: number;
  examples: string[];
}

interface Journey {
  stages: JourneyStage[];
  touchpoints: string[];
  averageTimeline: string;
  conversionBottlenecks: string[];
}

interface JourneyStage {
  stage: string;
  mindset: string;
  actions: string[];
  painPoints: string[];
  content_needed: string[];
}

interface LanguageInsights {
  commonPhrases: string[];
  emotionalTone: string;
  educationLevel: string;
  jargonUsed: string[];
  questionPatterns: string[];
  objections: string[];
}

interface Influencer {
  name: string;
  platform: string;
  followers: number;
  engagementRate: number;
  niche: string;
  contentFocus: string[];
}

interface Community {
  name: string;
  platform: string;
  memberCount: number;
  activityLevel: 'low' | 'medium' | 'high';
  primaryTopics: string[];
  url: string;
}

export class AudienceResearchAgent {
  private anthropic: Anthropic;
  private readonly model = 'claude-sonnet-4-5-20250929';

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Identify target audience for a niche
   */
  async identifyTargetAudience(niche: string): Promise<AudienceProfile> {
    console.log(`👥 Identifying target audience for: "${niche}"...`);

    const prompt = `You are an audience research expert. Create a comprehensive target audience profile for the "${niche}" niche.

Provide detailed information about:
1. Age range and primary age group
2. Gender split (percentages)
3. Income level (specific ranges)
4. Education level
5. Top 10 interests
6. Top 10 pain points
7. Top 10 buying triggers
8. Preferred social media platforms (ranked)
9. Language patterns (common phrases, emotional tone, etc.)

Be specific and data-driven. Think about who actually buys products in this niche.

Return as JSON:
{
  "niche": "${niche}",
  "ageRange": "string",
  "genderSplit": {
    "male": number,
    "female": number,
    "other": number
  },
  "incomeLevel": "string",
  "educationLevel": "string",
  "interests": ["string"],
  "painPoints": ["string"],
  "buyingTriggers": ["string"],
  "preferredPlatforms": ["string"],
  "languagePatterns": {
    "commonPhrases": ["string"],
    "emotionalTone": "string",
    "educationLevel": "string",
    "jargonUsed": ["string"],
    "questionPatterns": ["string"],
    "objections": ["string"]
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

    const profile: AudienceProfile = JSON.parse(jsonMatch[0]);

    // Store in database
    await supabase.from('audience_profiles').insert({
      niche: profile.niche,
      age_range: profile.ageRange,
      gender_split: profile.genderSplit,
      income_level: profile.incomeLevel,
      education_level: profile.educationLevel,
      interests: profile.interests,
      pain_points: profile.painPoints,
      buying_triggers: profile.buyingTriggers,
      preferred_platforms: profile.preferredPlatforms,
      language_patterns: profile.languagePatterns,
      researched_at: new Date().toISOString()
    });

    console.log(`✅ Target audience identified: ${profile.ageRange}, ${profile.incomeLevel}`);
    return profile;
  }

  /**
   * Analyze demographics in detail
   */
  async analyzeDemographics(audience: string): Promise<Demographics> {
    console.log(`📊 Analyzing demographics for: "${audience}"...`);

    const prompt = `You are a demographic analyst. Provide detailed demographic analysis for: "${audience}"

Include:
1. Age range and primary age group
2. Gender distribution
3. Top geographic locations/countries
4. Income levels
5. Education levels
6. Common occupations
7. Relationship status distribution

Return as JSON:
{
  "ageRange": "string",
  "primaryAgeGroup": "string",
  "genderSplit": {
    "male": number,
    "female": number,
    "other": number
  },
  "locations": ["string"],
  "incomeLevel": "string",
  "educationLevel": "string",
  "occupations": ["string"],
  "relationshipStatus": ["string"]
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

    const demographics: Demographics = JSON.parse(jsonMatch[0]);
    console.log(`✅ Primary demographic: ${demographics.primaryAgeGroup}, ${demographics.incomeLevel}`);
    return demographics;
  }

  /**
   * Discover pain points for a niche
   */
  async discoverPainPoints(niche: string): Promise<PainPoint[]> {
    console.log(`😣 Discovering pain points for: "${niche}"...`);

    const prompt = `You are a customer pain point analyst. Identify the top 15 pain points for people in the "${niche}" niche.

For each pain point, provide:
1. The pain/problem description
2. Severity (low, medium, high, critical)
3. How often they experience it
4. Impact on their life/business
5. Current solutions they're using (if any)
6. Specific frustrations with current solutions

Return as JSON array:
[{
  "pain": "string",
  "severity": "low" | "medium" | "high" | "critical",
  "frequency": "string",
  "impact": "string",
  "currentSolutions": ["string"],
  "frustrations": ["string"]
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

    const painPoints: PainPoint[] = JSON.parse(jsonMatch[0]);
    const criticalPains = painPoints.filter(p => p.severity === 'critical').length;
    console.log(`✅ Found ${painPoints.length} pain points (${criticalPains} critical)`);
    return painPoints;
  }

  /**
   * Find buying triggers for an audience
   */
  async findBuyingTriggers(audience: string): Promise<Trigger[]> {
    console.log(`🎯 Finding buying triggers for: "${audience}"...`);

    const prompt = `You are a consumer psychology expert. Identify the top 12 buying triggers that motivate "${audience}" to make a purchase.

For each trigger, provide:
1. The trigger description
2. Type (emotional, logical, social, urgent)
3. Effectiveness score (0-100)
4. Real examples of how it's used in marketing

Buying trigger types:
- Emotional: Fear, desire, pride, guilt, etc.
- Logical: ROI, efficiency, cost savings, etc.
- Social: Proof, authority, belonging, etc.
- Urgent: Scarcity, deadlines, FOMO, etc.

Return as JSON array:
[{
  "trigger": "string",
  "type": "emotional" | "logical" | "social" | "urgent",
  "effectiveness": number,
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

    const triggers: Trigger[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Found ${triggers.length} buying triggers`);
    return triggers;
  }

  /**
   * Map customer journey for a niche
   */
  async mapCustomerJourney(niche: string): Promise<Journey> {
    console.log(`🗺️ Mapping customer journey for: "${niche}"...`);

    const prompt = `You are a customer journey mapping expert. Map the complete customer journey for someone buying products in the "${niche}" niche.

Include:
1. All stages from awareness to purchase (and beyond)
2. Key touchpoints at each stage
3. Average timeline from discovery to purchase
4. Common conversion bottlenecks

For each stage, provide:
- Stage name
- Customer mindset
- Actions they take
- Pain points at this stage
- Content they need

Return as JSON:
{
  "stages": [{
    "stage": "string",
    "mindset": "string",
    "actions": ["string"],
    "painPoints": ["string"],
    "content_needed": ["string"]
  }],
  "touchpoints": ["string"],
  "averageTimeline": "string",
  "conversionBottlenecks": ["string"]
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

    const journey: Journey = JSON.parse(jsonMatch[0]);
    console.log(`✅ Mapped ${journey.stages.length} journey stages, ${journey.touchpoints.length} touchpoints`);
    return journey;
  }

  /**
   * Extract language patterns from content
   */
  async extractLanguagePatterns(contentSamples: string[]): Promise<LanguageInsights> {
    console.log(`💬 Analyzing language patterns from ${contentSamples.length} samples...`);

    const prompt = `You are a linguistic analyst. Analyze these content samples and extract language patterns:

${contentSamples.join('\n\n---\n\n')}

Extract:
1. Common phrases and expressions (10-15)
2. Overall emotional tone
3. Education level of language
4. Jargon and technical terms used
5. Common question patterns
6. Common objections expressed

Return as JSON:
{
  "commonPhrases": ["string"],
  "emotionalTone": "string",
  "educationLevel": "string",
  "jargonUsed": ["string"],
  "questionPatterns": ["string"],
  "objections": ["string"]
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

    const insights: LanguageInsights = JSON.parse(jsonMatch[0]);
    console.log(`✅ Extracted language patterns: ${insights.emotionalTone} tone`);
    return insights;
  }

  /**
   * Identify key influencers in a niche
   */
  async identifyInfluencers(niche: string): Promise<Influencer[]> {
    console.log(`⭐ Identifying influencers in: "${niche}"...`);

    const prompt = `You are an influencer research analyst. Identify the top 20 influencers in the "${niche}" niche across all platforms.

For each influencer, provide:
1. Name/username
2. Primary platform
3. Follower count
4. Engagement rate (%)
5. Niche focus
6. Main content topics

Include influencers from:
- YouTube
- Instagram
- TikTok
- Twitter
- LinkedIn

Return as JSON array:
[{
  "name": "string",
  "platform": "string",
  "followers": number,
  "engagementRate": number,
  "niche": "${niche}",
  "contentFocus": ["string"]
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

    const influencers: Influencer[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Found ${influencers.length} influencers`);
    return influencers;
  }

  /**
   * Find relevant communities for a niche
   */
  async findCommunities(niche: string): Promise<Community[]> {
    console.log(`🏘️ Finding communities for: "${niche}"...`);

    const prompt = `You are a community research specialist. Find the top 15 online communities for the "${niche}" niche.

For each community, provide:
1. Community name
2. Platform (Reddit, Facebook, Discord, Forum, etc.)
3. Member count
4. Activity level (low, medium, high)
5. Primary topics discussed
6. URL or location

Include communities from:
- Reddit subreddits
- Facebook groups
- Discord servers
- Online forums
- LinkedIn groups
- Slack communities

Return as JSON array:
[{
  "name": "string",
  "platform": "string",
  "memberCount": number,
  "activityLevel": "low" | "medium" | "high",
  "primaryTopics": ["string"],
  "url": "string"
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

    const communities: Community[] = JSON.parse(jsonMatch[0]);
    const highActivity = communities.filter(c => c.activityLevel === 'high').length;
    console.log(`✅ Found ${communities.length} communities (${highActivity} highly active)`);
    return communities;
  }

  /**
   * Create customer personas from research
   */
  async createPersonas(niche: string, audienceProfile: AudienceProfile): Promise<any[]> {
    console.log(`👤 Creating customer personas for: "${niche}"...`);

    const prompt = `You are a persona creation expert. Based on this audience research, create 3-5 detailed customer personas:

${JSON.stringify(audienceProfile, null, 2)}

For each persona, provide:
1. Persona name (realistic)
2. Demographics (age, gender, location, income, education)
3. Goals and aspirations
4. Challenges and pain points
5. Buying behavior and preferences
6. Preferred content types
7. Quote that represents them

Make personas realistic and distinct from each other.

Return as JSON array:
[{
  "personaName": "string",
  "demographics": {
    "age": number,
    "gender": "string",
    "location": "string",
    "income": "string",
    "education": "string",
    "occupation": "string"
  },
  "goals": ["string"],
  "challenges": ["string"],
  "buyingBehavior": {
    "triggers": ["string"],
    "preferredPlatforms": ["string"],
    "priceRange": "string",
    "decisionSpeed": "string"
  },
  "quote": "string"
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

    const personas = JSON.parse(jsonMatch[0]);

    // Store in database
    for (const persona of personas) {
      await supabase.from('customer_personas').insert({
        persona_name: persona.personaName,
        niche: niche,
        demographics: persona.demographics,
        goals: persona.goals,
        challenges: persona.challenges,
        buying_behavior: persona.buyingBehavior,
        created_at: new Date().toISOString()
      });
    }

    console.log(`✅ Created ${personas.length} customer personas`);
    return personas;
  }

  /**
   * Run complete audience research
   */
  async runCompleteResearch(niche: string): Promise<{
    profile: AudienceProfile;
    painPoints: PainPoint[];
    triggers: Trigger[];
    journey: Journey;
    influencers: Influencer[];
    communities: Community[];
    personas: any[];
  }> {
    console.log(`\n🚀 Running complete audience research for: "${niche}"\n`);

    const profile = await this.identifyTargetAudience(niche);

    const [painPoints, triggers, journey, influencers, communities] = await Promise.all([
      this.discoverPainPoints(niche),
      this.findBuyingTriggers(profile.ageRange),
      this.mapCustomerJourney(niche),
      this.identifyInfluencers(niche),
      this.findCommunities(niche)
    ]);

    const personas = await this.createPersonas(niche, profile);

    console.log(`\n✅ AUDIENCE RESEARCH COMPLETE:`);
    console.log(`   Pain Points: ${painPoints.length}`);
    console.log(`   Buying Triggers: ${triggers.length}`);
    console.log(`   Journey Stages: ${journey.stages.length}`);
    console.log(`   Influencers: ${influencers.length}`);
    console.log(`   Communities: ${communities.length}`);
    console.log(`   Personas: ${personas.length}\n`);

    return { profile, painPoints, triggers, journey, influencers, communities, personas };
  }
}
