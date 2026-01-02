/**
 * SocialMediaContentGeneratorAgent (#17)
 *
 * Purpose: Create engaging social media posts for all platforms
 *
 * Revenue Impact: High - social media drives traffic and builds brand authority
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
// SOCIALMEDIACONTENTGENERATORAGENT
// =====================================================================

export class SocialMediaContentGeneratorAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Generate Posts
   */
  async generatePosts(params: any): Promise<any> {
    console.log(`🚀 SocialMediaContentGeneratorAgent: generatePosts`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute generatePosts with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ generatePosts completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in generatePosts:`, error);
      throw error;
    }
  }

  /**
   * Create Carousel
   */
  async createCarousel(params: any): Promise<any> {
    console.log(`🚀 SocialMediaContentGeneratorAgent: createCarousel`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute createCarousel with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ createCarousel completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in createCarousel:`, error);
      throw error;
    }
  }

  /**
   * Design Infographic
   */
  async designInfographic(params: any): Promise<any> {
    console.log(`🚀 SocialMediaContentGeneratorAgent: designInfographic`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute designInfographic with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ designInfographic completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in designInfographic:`, error);
      throw error;
    }
  }

  /**
   * Write Threads
   */
  async writeThreads(params: any): Promise<any> {
    console.log(`🚀 SocialMediaContentGeneratorAgent: writeThreads`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute writeThreads with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ writeThreads completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in writeThreads:`, error);
      throw error;
    }
  }

  /**
   * Optimize For Platform
   */
  async optimizeForPlatform(params: any): Promise<any> {
    console.log(`🚀 SocialMediaContentGeneratorAgent: optimizeForPlatform`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute optimizeForPlatform with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ optimizeForPlatform completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in optimizeForPlatform:`, error);
      throw error;
    }
  }

  /**
   * Add Hashtags
   */
  async addHashtags(params: any): Promise<any> {
    console.log(`🚀 SocialMediaContentGeneratorAgent: addHashtags`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute addHashtags with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ addHashtags completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in addHashtags:`, error);
      throw error;
    }
  }

  /**
   * Schedule Optimal Time
   */
  async scheduleOptimalTime(params: any): Promise<any> {
    console.log(`🚀 SocialMediaContentGeneratorAgent: scheduleOptimalTime`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute scheduleOptimalTime with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ scheduleOptimalTime completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in scheduleOptimalTime:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete SocialMediaContentGeneratorAgent workflow\n`);

    try {
      const results: any = {};

      results.generatePosts = await this.generatePosts(params);
      results.createCarousel = await this.createCarousel(params);
      results.designInfographic = await this.designInfographic(params);

      console.log(`\n✅ SocialMediaContentGeneratorAgent workflow complete!\n`);
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
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      return {};
    }
  }

  private async storeData(table: string, data: any): Promise<void> {
    try {
      await this.supabase.from(table).insert(data);
      console.log(`💾 Data stored in ${table}`);
    } catch (error) {
      console.error(`Error storing data in ${table}:`, error);
    }
  }
}

// =====================================================================
// EXPORT
// =====================================================================

export default SocialMediaContentGeneratorAgent;
