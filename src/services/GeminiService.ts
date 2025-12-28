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
      `Generate a creative brand name for a ${sanitizedNiche} business.

Please provide:
1. One primary brand name
2. 5 alternative names
3. Brief reasoning for the primary name

Format your response as JSON:
{
  "name": "Primary Brand Name",
  "alternatives": ["Alt1", "Alt2", "Alt3", "Alt4", "Alt5"],
  "reasoning": "Explanation of why this name works"
}`,
      {
        context: `Style: ${options.style || 'modern'}, Length: ${options.length || 'medium'}, Target Audience: ${options.targetAudience || 'general consumers'}`,
        temperature: 0.8
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

    const prompt = AIHelper.formatPrompt(
      `Create ${options.type} content about: ${sanitizedTopic}

Please write engaging, high-quality content that is informative and compelling.`,
      {
        context: `Tone: ${options.tone || 'professional'}, Target Length: ${options.length || 500} words${options.keywords ? `, Keywords: ${options.keywords.join(', ')}` : ''}`,
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
    const prompt = `Create a compelling product description for: ${options.productName}

Category: ${options.category}
Features: ${options.features.join(', ')}
Benefits: ${options.benefits.join(', ')}
Tone: ${options.tone || 'persuasive'}
Length: ${options.length || 'medium'}

Provide:
1. Attention-grabbing headline
2. Short description (2-3 sentences)
3. Long description (2-3 paragraphs)
4. 5 compelling bullet points

Format as JSON:
{
  "headline": "Headline text",
  "shortDescription": "Short description",
  "longDescription": "Long description",
  "bulletPoints": ["point1", "point2", "point3", "point4", "point5"]
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
    const prompt = `Create a ${options.platform} post about: ${options.topic}

Tone: ${options.tone || 'friendly'}
${options.includeEmojis !== false ? 'Include relevant emojis' : ''}
${options.includeHashtags !== false ? 'Include hashtags' : ''}
Max length: ${options.maxLength || 280} characters

Create an engaging post that drives engagement.

Format as JSON:
{
  "caption": "Post caption text",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
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
