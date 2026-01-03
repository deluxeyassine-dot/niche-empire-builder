/**
 * GeminiService - AI-powered content generation using Google Gemini API
 *
 * This service provides methods for generating various types of content including
 * brand names, product descriptions, taglines, social media posts, and niche analysis.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIHelper } from '../utils/AIHelper';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private apiKey: string;
  private readonly MODEL_NAME = 'gemini-1.5-flash';
  private readonly REQUESTS_PER_MINUTE = 60;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GOOGLE_GEMINI_API_KEY || '';
    if (!key) {
      throw new Error('Google Gemini API key is required. Set GOOGLE_GEMINI_API_KEY in .env file.');
    }
    this.apiKey = key;
    this.genAI = new GoogleGenerativeAI(key);
    this.model = this.genAI.getGenerativeModel({ model: this.MODEL_NAME });
  }

  /**
   * Generate brand names based on niche and style preferences
   */
  async generateBrandName(options: {
    niche: string;
    style?: string;
    length?: string;
    targetAudience?: string;
  }): Promise<{
    name: string;
    alternatives: string[];
    reasoning: string;
  }> {
    const startTime = Date.now();

    // Sanitize input
    const sanitizedNiche = AIHelper.sanitizeInput(options.niche);

    // Format prompt with helper
    const prompt = AIHelper.formatPrompt(
      `You are an expert brand strategist and naming consultant who has created names for Fortune 500 companies.

Generate a memorable, marketable brand name for a ${sanitizedNiche} business.

BRAND NAME CRITERIA:
- Easy to spell and pronounce
- Memorable and distinctive
- Suggests the benefit or niche (but not too literal)
- Available as a domain (.com preferred)
- Works across platforms (social media handles)
- Scalable for future growth
- Evokes positive emotions
- No trademark conflicts (avoid obvious copies)

Style: ${options.style || 'modern and professional'}
Length: ${options.length || 'medium'} (short: 1-2 syllables, medium: 2-3 syllables, long: 3+ syllables)
Target Audience: ${options.targetAudience || 'general consumers'}

Please provide:
1. PRIMARY BRAND NAME: Your best recommendation with strong commercial appeal
2. ALTERNATIVES: 5 different creative options, each with unique positioning
3. REASONING: Strategic explanation of why the primary name will succeed in the market

Consider:
- Brandable invented words (like Kodak, Spotify)
- Descriptive compounds (like Instagram, Netflix)
- Metaphors or evocative words (like Amazon, Apple)
- Abbreviations or acronyms (only if meaningful)

Format your response as JSON:
{
  "name": "Primary Brand Name",
  "alternatives": ["Alt1", "Alt2", "Alt3", "Alt4", "Alt5"],
  "reasoning": "Strategic explanation of why this name will succeed: brand positioning, memorability, market differentiation, and growth potential"
}`,
      {
        context: `Niche: ${sanitizedNiche}, Style: ${options.style || 'modern'}, Length: ${options.length || 'medium'}, Target: ${options.targetAudience || 'general consumers'}`,
        temperature: 0.9
      }
    );

    try {
      // Use retry with backoff and rate limiting
      const text = await AIHelper.retryWithBackoff(
        async () => {
          return await AIHelper.handleRateLimit(
            this.apiKey,
            async () => {
              const result = await this.model.generateContent(prompt);
              const response = await result.response;
              return response.text();
            },
            this.REQUESTS_PER_MINUTE
          );
        },
        { maxRetries: 3 }
      );

      // Parse response with helper
      const parsed = AIHelper.parseResponse<{
        name: string;
        alternatives: string[];
        reasoning: string;
      }>(text, 'json');

      // Log usage stats
      const duration = Date.now() - startTime;
      AIHelper.logUsageStats({
        operation: 'generateBrandName',
        inputTokens: AIHelper['estimateTokens'](prompt),
        outputTokens: AIHelper['estimateTokens'](text),
        duration,
        model: this.MODEL_NAME
      });

      if (parsed.success && parsed.data) {
        return parsed.data;
      }

      // Fallback if parsing fails
      return this.getFallbackBrandName(sanitizedNiche);
    } catch (error: any) {
      console.error(AIHelper.formatError(error, 'brand name generation'));
      return this.getFallbackBrandName(sanitizedNiche);
    }
  }

  private getFallbackBrandName(niche: string) {
    const firstWord = niche.split(' ')[0];
    return {
      name: `${firstWord}Hub`,
      alternatives: [`${firstWord}Pro`, `${firstWord}Elite`, `${firstWord}Max`, `${firstWord}Plus`, `${firstWord}Co`],
      reasoning: 'Fallback brand name generated'
    };
  }

  /**
   * Create content for blogs, articles, or marketing materials
   */
  async createContent(options: {
    topic: string;
    type: 'blog' | 'article' | 'email' | 'social' | 'ad';
    tone?: string;
    length?: number;
    keywords?: string[];
  }): Promise<string> {
    const startTime = Date.now();
    const sanitizedTopic = AIHelper.sanitizeInput(options.topic);

    const contentGuidelines = {
      blog: 'SEO-optimized long-form content with H2/H3 subheadings, actionable tips, personal anecdotes, and internal linking opportunities',
      article: 'Well-researched, authoritative content with data/statistics, expert quotes, clear structure, and credible sources',
      email: 'Personalized, conversational tone with compelling subject line, clear CTA, mobile-optimized short paragraphs, and urgency/scarcity',
      social: 'Platform-optimized, highly engaging micro-content with hooks, value bombs, and shareability',
      ad: 'Conversion-focused copy with attention-grabbing headline, problem-solution framework, social proof, and strong CTA'
    };

    const guideline = contentGuidelines[options.type] || 'High-quality, engaging content';

    const prompt = AIHelper.formatPrompt(
      `You are a professional content writer and marketing copywriter with 10+ years of experience creating high-converting content.

Create exceptional ${options.type} content about: ${sanitizedTopic}

CONTENT TYPE REQUIREMENTS: ${guideline}

WRITING GUIDELINES:
- Start with a compelling hook that grabs attention immediately
- Use the AIDA framework (Attention, Interest, Desire, Action)
- Write in active voice with strong, specific verbs
- Break up text with short paragraphs (2-3 sentences max)
- Include relevant examples, case studies, or stories
- Address the reader directly ("you" language)
- Optimize for skimmability with bullet points and lists
- End with a clear, actionable call-to-action
${options.keywords ? `- Naturally incorporate these SEO keywords: ${options.keywords.join(', ')}` : ''}

TARGET METRICS:
- Tone: ${options.tone || 'professional yet approachable'}
- Length: ${options.length || 500} words (±10%)
- Reading Level: 8th-grade (accessible to broad audience)
- Engagement Goal: High shareability and conversion potential

FORMAT:
- Include a compelling headline/subject line
- Use subheadings for structure (if applicable)
- Add strategic formatting (bold, italics) for emphasis
- End with strong CTA

Write content that educates, engages, and converts.`,
      {
        context: `Type: ${options.type}, Tone: ${options.tone || 'professional'}, Length: ${options.length || 500} words, Keywords: ${options.keywords?.join(', ') || 'none'}`,
        temperature: 0.7
      }
    );

    try {
      const text = await AIHelper.retryWithBackoff(
        async () => {
          return await AIHelper.handleRateLimit(
            this.apiKey,
            async () => {
              const result = await this.model.generateContent(prompt);
              const response = await result.response;
              return response.text();
            },
            this.REQUESTS_PER_MINUTE
          );
        }
      );

      const duration = Date.now() - startTime;
      AIHelper.logUsageStats({
        operation: 'createContent',
        inputTokens: AIHelper['estimateTokens'](prompt),
        outputTokens: AIHelper['estimateTokens'](text),
        duration,
        model: this.MODEL_NAME
      });

      return text;
    } catch (error: any) {
      console.error(AIHelper.formatError(error, 'content creation'));
      return `Content about ${sanitizedTopic}. [Error: ${error.message}]`;
    }
  }

  /**
   * Analyze a niche for market opportunities and insights
   */
  async analyzeNiche(options: {
    niche: string;
    focus?: 'opportunities' | 'competition' | 'trends' | 'comprehensive';
  }): Promise<{
    overview: string;
    opportunities: string[];
    challenges: string[];
    trends: string[];
    recommendations: string[];
  }> {
    const startTime = Date.now();
    const sanitizedNiche = AIHelper.sanitizeInput(options.niche);

    const prompt = AIHelper.formatPrompt(
      `Analyze the ${sanitizedNiche} niche with focus on: ${options.focus || 'comprehensive'}

Provide:
1. Market overview
2. Top 5 opportunities
3. Main challenges
4. Current trends
5. Strategic recommendations

Format your response as JSON:
{
  "overview": "Market overview text",
  "opportunities": ["opportunity1", "opportunity2", ...],
  "challenges": ["challenge1", "challenge2", ...],
  "trends": ["trend1", "trend2", ...],
  "recommendations": ["rec1", "rec2", ...]
}`,
      { temperature: 0.6 }
    );

    try {
      const text = await AIHelper.retryWithBackoff(
        async () => {
          return await AIHelper.handleRateLimit(
            this.apiKey,
            async () => {
              const result = await this.model.generateContent(prompt);
              const response = await result.response;
              return response.text();
            },
            this.REQUESTS_PER_MINUTE
          );
        }
      );

      const parsed = AIHelper.parseResponse<{
        overview: string;
        opportunities: string[];
        challenges: string[];
        trends: string[];
        recommendations: string[];
      }>(text, 'json');

      const duration = Date.now() - startTime;
      AIHelper.logUsageStats({
        operation: 'analyzeNiche',
        inputTokens: AIHelper['estimateTokens'](prompt),
        outputTokens: AIHelper['estimateTokens'](text),
        duration,
        model: this.MODEL_NAME
      });

      if (parsed.success && parsed.data) {
        return parsed.data;
      }

      return this.getFallbackNicheAnalysis(sanitizedNiche);
    } catch (error: any) {
      console.error(AIHelper.formatError(error, 'niche analysis'));
      return this.getFallbackNicheAnalysis(sanitizedNiche);
    }
  }

  private getFallbackNicheAnalysis(niche: string) {
    return {
      overview: `The ${niche} market shows significant potential.`,
      opportunities: ['Digital transformation', 'Direct-to-consumer sales', 'Sustainability focus'],
      challenges: ['Competition', 'Market saturation', 'Customer acquisition'],
      trends: ['E-commerce growth', 'Social media marketing', 'Sustainability'],
      recommendations: ['Focus on unique value proposition', 'Build strong brand identity', 'Invest in customer experience']
    };
  }

  /**
   * Generate product descriptions
   */
  async generateProductDescription(options: {
    productName: string;
    features: string[];
    benefits: string[];
    category: string;
    tone?: string;
    length?: 'short' | 'medium' | 'long';
  }): Promise<{
    headline: string;
    shortDescription: string;
    longDescription: string;
    bulletPoints: string[];
  }> {
    const prompt = `You are a world-class copywriter specializing in high-converting product descriptions for Etsy, Amazon, and digital marketplaces.

Create a compelling, sales-focused product description for: ${options.productName}

Category: ${options.category}
Key Features: ${options.features.join(', ')}
Customer Benefits: ${options.benefits.join(', ')}
Tone: ${options.tone || 'persuasive and professional'}
Length: ${options.length || 'medium'}

IMPORTANT GUIDELINES:
- Focus on BENEFITS and emotional outcomes, not just features
- Use power words that trigger action and desire
- Include sensory language and vivid descriptions
- Address pain points and show the transformation
- Create urgency and exclusivity where appropriate
- Use short, punchy sentences mixed with longer descriptive ones
- Optimize for SEO with natural keyword integration

Provide:
1. HEADLINE: Powerful, benefit-driven headline (max 10 words) that stops the scroll
2. SHORT DESCRIPTION: Compelling 2-3 sentence hook that creates desire and curiosity
3. LONG DESCRIPTION: Detailed 3-4 paragraph story-based description that:
   - Opens with the problem/desire
   - Shows the solution (the product)
   - Describes the experience and transformation
   - Closes with a call to action
4. BULLET POINTS: 5 benefit-focused bullet points (not feature lists) that show value

Format as JSON:
{
  "headline": "Headline text",
  "shortDescription": "Short description",
  "longDescription": "Long description",
  "bulletPoints": ["benefit point 1", "benefit point 2", "benefit point 3", "benefit point 4", "benefit point 5"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        headline: `${options.productName} - ${options.benefits[0] || 'Premium Quality'}`,
        shortDescription: `Discover the ${options.productName}, featuring ${options.features[0]?.toLowerCase() || 'innovative design'}. ${options.benefits[0] || 'Experience the difference'}.`,
        longDescription: `Introducing the ${options.productName}, a ${options.category} that combines ${options.features.slice(0, 2).join(' and ')}. ${options.benefits.join(' ')} Perfect for those who demand quality and excellence.`,
        bulletPoints: options.features.slice(0, 5)
      };
    } catch (error) {
      console.error('Error generating product description:', error);
      return {
        headline: `${options.productName} - ${options.benefits[0] || 'Premium Quality'}`,
        shortDescription: `Discover the ${options.productName}, your ultimate ${options.category} solution.`,
        longDescription: `The ${options.productName} delivers exceptional quality and performance.`,
        bulletPoints: options.features.slice(0, 5)
      };
    }
  }

  /**
   * Create taglines for brands or products
   */
  async createTagline(options: {
    brandName: string;
    niche: string;
    values?: string[];
    tone?: string;
  }): Promise<{
    primary: string;
    alternatives: string[];
  }> {
    const prompt = `Create taglines for: ${options.brandName}

Niche: ${options.niche}
${options.values ? `Brand Values: ${options.values.join(', ')}` : ''}
Tone: ${options.tone || 'professional'}

Create:
1. One primary tagline (5-7 words)
2. 5 alternative taglines

Requirements:
- Memorable and catchy
- Reflects brand essence
- Easy to remember
- Emotionally resonant

Format as JSON:
{
  "primary": "Primary tagline",
  "alternatives": ["alt1", "alt2", "alt3", "alt4", "alt5"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        primary: `${options.brandName} - Excellence in ${options.niche}`,
        alternatives: [
          `Where Quality Meets Innovation`,
          `Your Trusted ${options.niche} Partner`,
          `Elevate Your ${options.niche} Experience`,
          `${options.niche} Done Right`,
          `Innovation for Life`
        ]
      };
    } catch (error) {
      console.error('Error creating tagline:', error);
      return {
        primary: `${options.brandName} - Excellence in ${options.niche}`,
        alternatives: ['Where Quality Meets Innovation', 'Your Trusted Partner']
      };
    }
  }

  /**
   * Generate social media posts
   */
  async generateSocialPost(options: {
    platform: string;
    topic: string;
    tone?: string;
    includeHashtags?: boolean;
    includeEmojis?: boolean;
    maxLength?: number;
  }): Promise<{
    caption: string;
    hashtags: string[];
  }> {
    const platformGuidelines = {
      instagram: 'Visual storytelling, authentic voice, use 3-5 emojis strategically, 2200 char limit',
      tiktok: 'Trend-driven, casual conversational, hook in first 3 seconds, max 150 chars',
      twitter: 'Concise & witty, news-worthy angle, max 280 characters, 1-2 hashtags max',
      facebook: 'Community-focused, longer form ok, ask questions, create conversations',
      linkedin: 'Professional insights, thought leadership, value-driven, business context',
      pinterest: 'SEO-optimized, descriptive, keyword-rich, includes call-to-action'
    };

    const platformGuide = platformGuidelines[options.platform.toLowerCase() as keyof typeof platformGuidelines] || 'Engaging, platform-appropriate content';

    const prompt = `You are a viral social media content creator with millions of followers across platforms.

Create a high-engagement ${options.platform} post about: ${options.topic}

PLATFORM GUIDELINES: ${platformGuide}
Tone: ${options.tone || 'authentic and engaging'}
${options.includeEmojis !== false ? 'Use emojis strategically (not overdone)' : 'No emojis'}
${options.includeHashtags !== false ? 'Include researched hashtags' : 'No hashtags'}
Max length: ${options.maxLength || 280} characters

POST MUST INCLUDE:
- Attention-grabbing hook in first line
- Value proposition or emotional trigger
- Clear call-to-action or engagement prompt
- Platform-specific optimization

ENGAGEMENT BOOSTERS:
- Ask questions
- Create curiosity gaps
- Use pattern interrupts
- Include social proof when relevant
- Make it shareable
- Use active voice

HASHTAG STRATEGY (if enabled):
- Mix of popular (100K+) and niche (10K-50K) hashtags
- Relevant to content and trending topics
- 5-10 hashtags for Instagram, 1-3 for Twitter, 3-5 for others

Format as JSON:
{
  "caption": "Compelling post caption with hook, value, and CTA",
  "hashtags": ["researched hashtag1", "hashtag2", "hashtag3", "trending hashtag4", "niche hashtag5"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        caption: `${options.topic} - discover more on ${options.platform}! 🎉`,
        hashtags: ['trending', options.topic.replace(/\s+/g, '').toLowerCase(), options.platform.toLowerCase()]
      };
    } catch (error) {
      console.error('Error generating social post:', error);
      return {
        caption: `${options.topic} - discover more!`,
        hashtags: [options.topic.replace(/\s+/g, '').toLowerCase()]
      };
    }
  }

  /**
   * Generate general AI content with custom prompt
   */
  async generate(prompt: string): Promise<string> {
    const startTime = Date.now();
    const sanitizedPrompt = AIHelper.sanitizeInput(prompt);

    try {
      const text = await AIHelper.retryWithBackoff(
        async () => {
          return await AIHelper.handleRateLimit(
            this.apiKey,
            async () => {
              const result = await this.model.generateContent(sanitizedPrompt);
              const response = await result.response;
              return response.text();
            },
            this.REQUESTS_PER_MINUTE
          );
        }
      );

      const duration = Date.now() - startTime;
      AIHelper.logUsageStats({
        operation: 'generate',
        inputTokens: AIHelper['estimateTokens'](sanitizedPrompt),
        outputTokens: AIHelper['estimateTokens'](text),
        duration,
        model: this.MODEL_NAME
      });

      return text;
    } catch (error: any) {
      console.error(AIHelper.formatError(error, 'content generation'));
      return `Error generating content: ${error.message}`;
    }
  }

  /**
   * Stream content generation with real-time updates
   */
  async generateStream(
    prompt: string,
    onChunk?: (chunk: { text: string; isComplete: boolean }) => void
  ): Promise<string> {
    const sanitizedPrompt = AIHelper.sanitizeInput(prompt);

    try {
      const result = await this.model.generateContentStream(sanitizedPrompt);

      const fullText = await AIHelper.streamResponse(
        () => result.stream,
        onChunk
      );

      return fullText;
    } catch (error: any) {
      console.error(AIHelper.formatError(error, 'stream generation'));
      throw error;
    }
  }

  /**
   * Batch process multiple prompts efficiently
   */
  async batchGenerate(
    prompts: string[],
    batchSize: number = 5
  ): Promise<string[]> {
    return await AIHelper.batchExecute(
      prompts,
      async (prompt) => await this.generate(prompt),
      batchSize
    );
  }
}

// Export singleton instance
let geminiServiceInstance: GeminiService | null = null;

export function getGeminiService(apiKey?: string): GeminiService {
  if (!geminiServiceInstance) {
    geminiServiceInstance = new GeminiService(apiKey);
  }
  return geminiServiceInstance;
}
