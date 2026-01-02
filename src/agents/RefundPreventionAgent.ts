/**
 * RefundPreventionAgent (#46)
 *
 * Purpose: Identify at-risk customers and intervene
 *
 * Revenue Impact: Very High - saves thousands in refunds
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
// REFUNDPREVENTIONAGENT
// =====================================================================

export class RefundPreventionAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Identify At Risk Customers
   */
  async identifyAtRiskCustomers(params: any): Promise<any> {
    console.log(`🚀 RefundPreventionAgent: identifyAtRiskCustomers`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute identifyAtRiskCustomers with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ identifyAtRiskCustomers completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in identifyAtRiskCustomers:`, error);
      throw error;
    }
  }

  /**
   * Intervene Proactively
   */
  async interveneProactively(params: any): Promise<any> {
    console.log(`🚀 RefundPreventionAgent: interveneProactively`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute interveneProactively with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ interveneProactively completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in interveneProactively:`, error);
      throw error;
    }
  }

  /**
   * Address Concerns
   */
  async addressConcerns(params: any): Promise<any> {
    console.log(`🚀 RefundPreventionAgent: addressConcerns`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute addressConcerns with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ addressConcerns completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in addressConcerns:`, error);
      throw error;
    }
  }

  /**
   * Offer Solutions
   */
  async offerSolutions(params: any): Promise<any> {
    console.log(`🚀 RefundPreventionAgent: offerSolutions`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute offerSolutions with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ offerSolutions completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in offerSolutions:`, error);
      throw error;
    }
  }

  /**
   * Track Prevention Rate
   */
  async trackPreventionRate(params: any): Promise<any> {
    console.log(`🚀 RefundPreventionAgent: trackPreventionRate`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute trackPreventionRate with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ trackPreventionRate completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in trackPreventionRate:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete RefundPreventionAgent workflow\n`);

    try {
      const results: any = {};

      results.identifyAtRiskCustomers = await this.identifyAtRiskCustomers(params);
      results.interveneProactively = await this.interveneProactively(params);
      results.addressConcerns = await this.addressConcerns(params);

      console.log(`\n✅ RefundPreventionAgent workflow complete!\n`);
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

export default RefundPreventionAgent;
