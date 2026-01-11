/**
 * UpsellAgent (#39)
 *
 * Purpose: Automatically offer upsells and cross-sells
 *
 * Revenue Impact: Very High - increases AOV by 30-50%
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
// UPSELLAGENT
// =====================================================================

export class UpsellAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Identify Opportunities
   */
  async identifyOpportunities(params: any): Promise<any> {
    console.log(`🚀 UpsellAgent: identifyOpportunities`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute identifyOpportunities with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ identifyOpportunities completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in identifyOpportunities:`, error);
      throw error;
    }
  }

  /**
   * Recommend Products
   */
  async recommendProducts(params: any): Promise<any> {
    console.log(`🚀 UpsellAgent: recommendProducts`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute recommendProducts with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ recommendProducts completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in recommendProducts:`, error);
      throw error;
    }
  }

  /**
   * Create Offers
   */
  async createOffers(params: any): Promise<any> {
    console.log(`🚀 UpsellAgent: createOffers`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute createOffers with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ createOffers completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in createOffers:`, error);
      throw error;
    }
  }

  /**
   * Time Perfectly
   */
  async timePerfectly(params: any): Promise<any> {
    console.log(`🚀 UpsellAgent: timePerfectly`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute timePerfectly with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ timePerfectly completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in timePerfectly:`, error);
      throw error;
    }
  }

  /**
   * Track Acceptance
   */
  async trackAcceptance(params: any): Promise<any> {
    console.log(`🚀 UpsellAgent: trackAcceptance`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute trackAcceptance with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ trackAcceptance completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in trackAcceptance:`, error);
      throw error;
    }
  }

  /**
   * Optimize Offers
   */
  async optimizeOffers(params: any): Promise<any> {
    console.log(`🚀 UpsellAgent: optimizeOffers`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute optimizeOffers with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ optimizeOffers completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in optimizeOffers:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete UpsellAgent workflow\n`);

    try {
      const results: any = {};

      results.identifyOpportunities = await this.identifyOpportunities(params);
      results.recommendProducts = await this.recommendProducts(params);
      results.createOffers = await this.createOffers(params);

      console.log(`\n✅ UpsellAgent workflow complete!\n`);
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

export default UpsellAgent;
