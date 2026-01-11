/**
 * SalesPageBuilderAgent (#20)
 *
 * Purpose: Create high-converting sales pages
 *
 * Revenue Impact: Very High - sales pages directly drive revenue
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
// SALESPAGEBUILDERAGENT
// =====================================================================

export class SalesPageBuilderAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Build Sales Page
   */
  async buildSalesPage(params: any): Promise<any> {
    console.log(`🚀 SalesPageBuilderAgent: buildSalesPage`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute buildSalesPage with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ buildSalesPage completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in buildSalesPage:`, error);
      throw error;
    }
  }

  /**
   * Write Headline
   */
  async writeHeadline(params: any): Promise<any> {
    console.log(`🚀 SalesPageBuilderAgent: writeHeadline`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute writeHeadline with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ writeHeadline completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in writeHeadline:`, error);
      throw error;
    }
  }

  /**
   * Craft Value Proposition
   */
  async craftValueProposition(params: any): Promise<any> {
    console.log(`🚀 SalesPageBuilderAgent: craftValueProposition`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute craftValueProposition with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ craftValueProposition completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in craftValueProposition:`, error);
      throw error;
    }
  }

  /**
   * Generate F A Qs
   */
  async generateFAQs(params: any): Promise<any> {
    console.log(`🚀 SalesPageBuilderAgent: generateFAQs`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute generateFAQs with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ generateFAQs completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in generateFAQs:`, error);
      throw error;
    }
  }

  /**
   * Apply Conversion Framework
   */
  async applyConversionFramework(params: any): Promise<any> {
    console.log(`🚀 SalesPageBuilderAgent: applyConversionFramework`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute applyConversionFramework with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ applyConversionFramework completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in applyConversionFramework:`, error);
      throw error;
    }
  }

  /**
   * Add Social Proof
   */
  async addSocialProof(params: any): Promise<any> {
    console.log(`🚀 SalesPageBuilderAgent: addSocialProof`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute addSocialProof with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ addSocialProof completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in addSocialProof:`, error);
      throw error;
    }
  }

  /**
   * Optimize Checkout Flow
   */
  async optimizeCheckoutFlow(params: any): Promise<any> {
    console.log(`🚀 SalesPageBuilderAgent: optimizeCheckoutFlow`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute optimizeCheckoutFlow with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ optimizeCheckoutFlow completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in optimizeCheckoutFlow:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete SalesPageBuilderAgent workflow\n`);

    try {
      const results: any = {};

      results.buildSalesPage = await this.buildSalesPage(params);
      results.writeHeadline = await this.writeHeadline(params);
      results.craftValueProposition = await this.craftValueProposition(params);

      console.log(`\n✅ SalesPageBuilderAgent workflow complete!\n`);
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

export default SalesPageBuilderAgent;
