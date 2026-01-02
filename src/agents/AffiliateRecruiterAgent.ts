/**
 * AffiliateRecruiterAgent (#51)
 *
 * Purpose: Recruit and onboard affiliates
 *
 * Revenue Impact: Very High - affiliates = scalable sales
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
// AFFILIATERECRUITERAGENT
// =====================================================================

export class AffiliateRecruiterAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Find Affiliates
   */
  async findAffiliates(params: any): Promise<any> {
    console.log(`🚀 AffiliateRecruiterAgent: findAffiliates`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute findAffiliates with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ findAffiliates completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in findAffiliates:`, error);
      throw error;
    }
  }

  /**
   * Reach Out
   */
  async reachOut(params: any): Promise<any> {
    console.log(`🚀 AffiliateRecruiterAgent: reachOut`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute reachOut with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ reachOut completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in reachOut:`, error);
      throw error;
    }
  }

  /**
   * Onboard Affiliates
   */
  async onboardAffiliates(params: any): Promise<any> {
    console.log(`🚀 AffiliateRecruiterAgent: onboardAffiliates`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute onboardAffiliates with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ onboardAffiliates completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in onboardAffiliates:`, error);
      throw error;
    }
  }

  /**
   * Provide Resources
   */
  async provideResources(params: any): Promise<any> {
    console.log(`🚀 AffiliateRecruiterAgent: provideResources`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute provideResources with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ provideResources completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in provideResources:`, error);
      throw error;
    }
  }

  /**
   * Track Performance
   */
  async trackPerformance(params: any): Promise<any> {
    console.log(`🚀 AffiliateRecruiterAgent: trackPerformance`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute trackPerformance with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ trackPerformance completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in trackPerformance:`, error);
      throw error;
    }
  }

  /**
   * Incentivize Top
   */
  async incentivizeTop(params: any): Promise<any> {
    console.log(`🚀 AffiliateRecruiterAgent: incentivizeTop`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute incentivizeTop with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ incentivizeTop completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in incentivizeTop:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete AffiliateRecruiterAgent workflow\n`);

    try {
      const results: any = {};

      results.findAffiliates = await this.findAffiliates(params);
      results.reachOut = await this.reachOut(params);
      results.onboardAffiliates = await this.onboardAffiliates(params);

      console.log(`\n✅ AffiliateRecruiterAgent workflow complete!\n`);
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

export default AffiliateRecruiterAgent;
