/**
 * ProductPackagerAgent (#52)
 *
 * Purpose: Package products for market release
 *
 * Revenue Impact: High - professional packaging = higher value
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
// PRODUCTPACKAGERAGENT
// =====================================================================

export class ProductPackagerAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Assemble Product
   */
  async assembleProduct(params: any): Promise<any> {
    console.log(`🚀 ProductPackagerAgent: assembleProduct`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute assembleProduct with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ assembleProduct completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in assembleProduct:`, error);
      throw error;
    }
  }

  /**
   * Create Packaging
   */
  async createPackaging(params: any): Promise<any> {
    console.log(`🚀 ProductPackagerAgent: createPackaging`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute createPackaging with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ createPackaging completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in createPackaging:`, error);
      throw error;
    }
  }

  /**
   * Write Descriptions
   */
  async writeDescriptions(params: any): Promise<any> {
    console.log(`🚀 ProductPackagerAgent: writeDescriptions`);

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
   * Set Pricing
   */
  async setPricing(params: any): Promise<any> {
    console.log(`🚀 ProductPackagerAgent: setPricing`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute setPricing with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ setPricing completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in setPricing:`, error);
      throw error;
    }
  }

  /**
   * Prepare Launch
   */
  async prepareLaunch(params: any): Promise<any> {
    console.log(`🚀 ProductPackagerAgent: prepareLaunch`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute prepareLaunch with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ prepareLaunch completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in prepareLaunch:`, error);
      throw error;
    }
  }

  /**
   * Generate Assets
   */
  async generateAssets(params: any): Promise<any> {
    console.log(`🚀 ProductPackagerAgent: generateAssets`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute generateAssets with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ generateAssets completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in generateAssets:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete ProductPackagerAgent workflow\n`);

    try {
      const results: any = {};

      results.assembleProduct = await this.assembleProduct(params);
      results.createPackaging = await this.createPackaging(params);
      results.writeDescriptions = await this.writeDescriptions(params);

      console.log(`\n✅ ProductPackagerAgent workflow complete!\n`);
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

export default ProductPackagerAgent;
