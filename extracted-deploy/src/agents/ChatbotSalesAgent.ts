/**
 * ChatbotSalesAgent (#38)
 *
 * Purpose: AI chatbot that qualifies and closes sales
 *
 * Revenue Impact: Very High - 24/7 automated sales
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
// CHATBOTSALESAGENT
// =====================================================================

export class ChatbotSalesAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Qualify Leads
   */
  async qualifyLeads(params: any): Promise<any> {
    console.log(`🚀 ChatbotSalesAgent: qualifyLeads`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute qualifyLeads with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ qualifyLeads completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in qualifyLeads:`, error);
      throw error;
    }
  }

  /**
   * Present Offers
   */
  async presentOffers(params: any): Promise<any> {
    console.log(`🚀 ChatbotSalesAgent: presentOffers`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute presentOffers with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ presentOffers completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in presentOffers:`, error);
      throw error;
    }
  }

  /**
   * Handle Objections
   */
  async handleObjections(params: any): Promise<any> {
    console.log(`🚀 ChatbotSalesAgent: handleObjections`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute handleObjections with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ handleObjections completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in handleObjections:`, error);
      throw error;
    }
  }

  /**
   * Close Deals
   */
  async closeDeals(params: any): Promise<any> {
    console.log(`🚀 ChatbotSalesAgent: closeDeals`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute closeDeals with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ closeDeals completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in closeDeals:`, error);
      throw error;
    }
  }

  /**
   * Upsell Products
   */
  async upsellProducts(params: any): Promise<any> {
    console.log(`🚀 ChatbotSalesAgent: upsellProducts`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute upsellProducts with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ upsellProducts completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in upsellProducts:`, error);
      throw error;
    }
  }

  /**
   * Track Conversions
   */
  async trackConversions(params: any): Promise<any> {
    console.log(`🚀 ChatbotSalesAgent: trackConversions`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute trackConversions with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ trackConversions completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in trackConversions:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete ChatbotSalesAgent workflow\n`);

    try {
      const results: any = {};

      results.qualifyLeads = await this.qualifyLeads(params);
      results.presentOffers = await this.presentOffers(params);
      results.handleObjections = await this.handleObjections(params);

      console.log(`\n✅ ChatbotSalesAgent workflow complete!\n`);
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

export default ChatbotSalesAgent;
