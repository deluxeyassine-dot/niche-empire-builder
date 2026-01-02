/**
 * AdCopyGeneratorAgent (#19)
 *
 * Purpose: Write high-converting ad copy for advertising platforms
 *
 * Revenue Impact: Very High - good ad copy = 2-5x better conversion rates
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
// ADCOPYGENERATORAGENT
// =====================================================================

export class AdCopyGeneratorAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Generate Ad Copy
   */
  async generateAdCopy(params: any): Promise<any> {
    console.log(`🚀 AdCopyGeneratorAgent: generateAdCopy`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute generateAdCopy with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ generateAdCopy completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in generateAdCopy:`, error);
      throw error;
    }
  }

  /**
   * Create Headlines
   */
  async createHeadlines(params: any): Promise<any> {
    console.log(`🚀 AdCopyGeneratorAgent: createHeadlines`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute createHeadlines with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ createHeadlines completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in createHeadlines:`, error);
      throw error;
    }
  }

  /**
   * Write Descriptions
   */
  async writeDescriptions(params: any): Promise<any> {
    console.log(`🚀 AdCopyGeneratorAgent: writeDescriptions`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute writeDescriptions with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ writeDescriptions completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in writeDescriptions:`, error);
      throw error;
    }
  }

  /**
   * Test Ad Variations
   */
  async testAdVariations(params: any): Promise<any> {
    console.log(`🚀 AdCopyGeneratorAgent: testAdVariations`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute testAdVariations with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ testAdVariations completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in testAdVariations:`, error);
      throw error;
    }
  }

  /**
   * Optimize For Conversion
   */
  async optimizeForConversion(params: any): Promise<any> {
    console.log(`🚀 AdCopyGeneratorAgent: optimizeForConversion`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute optimizeForConversion with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ optimizeForConversion completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in optimizeForConversion:`, error);
      throw error;
    }
  }

  /**
   * Add Call To Action
   */
  async addCallToAction(params: any): Promise<any> {
    console.log(`🚀 AdCopyGeneratorAgent: addCallToAction`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute addCallToAction with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ addCallToAction completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in addCallToAction:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete AdCopyGeneratorAgent workflow\n`);

    try {
      const results: any = {};

      results.generateAdCopy = await this.generateAdCopy(params);
      results.createHeadlines = await this.createHeadlines(params);
      results.writeDescriptions = await this.writeDescriptions(params);

      console.log(`\n✅ AdCopyGeneratorAgent workflow complete!\n`);
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

export default AdCopyGeneratorAgent;
