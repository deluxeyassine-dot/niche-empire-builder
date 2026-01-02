/**
 * BlogPostWriterAgent (#16)
 *
 * Purpose: Write SEO-optimized blog posts that rank on Google and drive organic traffic
 *
 * Revenue Impact: High - drives organic traffic = free leads forever
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
// BLOGPOSTWRITERAGENT
// =====================================================================

export class BlogPostWriterAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Write Blog Post
   */
  async writeBlogPost(params: any): Promise<any> {
    console.log(`🚀 BlogPostWriterAgent: writeBlogPost`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute writeBlogPost with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ writeBlogPost completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in writeBlogPost:`, error);
      throw error;
    }
  }

  /**
   * Optimize For S E O
   */
  async optimizeForSEO(params: any): Promise<any> {
    console.log(`🚀 BlogPostWriterAgent: optimizeForSEO`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute optimizeForSEO with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ optimizeForSEO completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in optimizeForSEO:`, error);
      throw error;
    }
  }

  /**
   * Add Internal Links
   */
  async addInternalLinks(params: any): Promise<any> {
    console.log(`🚀 BlogPostWriterAgent: addInternalLinks`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute addInternalLinks with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ addInternalLinks completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in addInternalLinks:`, error);
      throw error;
    }
  }

  /**
   * Generate Meta Data
   */
  async generateMetaData(params: any): Promise<any> {
    console.log(`🚀 BlogPostWriterAgent: generateMetaData`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute generateMetaData with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ generateMetaData completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in generateMetaData:`, error);
      throw error;
    }
  }

  /**
   * Add Images
   */
  async addImages(params: any): Promise<any> {
    console.log(`🚀 BlogPostWriterAgent: addImages`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute addImages with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ addImages completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in addImages:`, error);
      throw error;
    }
  }

  /**
   * Create Featured Image
   */
  async createFeaturedImage(params: any): Promise<any> {
    console.log(`🚀 BlogPostWriterAgent: createFeaturedImage`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute createFeaturedImage with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ createFeaturedImage completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in createFeaturedImage:`, error);
      throw error;
    }
  }

  /**
   * Format For Readability
   */
  async formatForReadability(params: any): Promise<any> {
    console.log(`🚀 BlogPostWriterAgent: formatForReadability`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute formatForReadability with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ formatForReadability completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in formatForReadability:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete BlogPostWriterAgent workflow\n`);

    try {
      const results: any = {};

      results.writeBlogPost = await this.writeBlogPost(params);
      results.optimizeForSEO = await this.optimizeForSEO(params);
      results.addInternalLinks = await this.addInternalLinks(params);

      console.log(`\n✅ BlogPostWriterAgent workflow complete!\n`);
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

export default BlogPostWriterAgent;
