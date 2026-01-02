/**
 * PlatformCrossPromoterAgent (#27)
 *
 * Purpose: Cross-promote content across platforms
 *
 * Revenue Impact: Medium-High - increases reach
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
// PLATFORMCROSSPROMOTERAGENT
// =====================================================================

export class PlatformCrossPromoterAgent {
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
    console.log(`🚀 PlatformCrossPromoterAgent: identifyOpportunities`);

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
   * Repurpose Content
   */
  async repurposeContent(params: any): Promise<any> {
    console.log(`🚀 PlatformCrossPromoterAgent: repurposeContent`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute repurposeContent with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ repurposeContent completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in repurposeContent:`, error);
      throw error;
    }
  }

  /**
   * Cross Post
   */
  async crossPost(params: any): Promise<any> {
    console.log(`🚀 PlatformCrossPromoterAgent: crossPost`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute crossPost with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ crossPost completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in crossPost:`, error);
      throw error;
    }
  }

  /**
   * Track Effectiveness
   */
  async trackEffectiveness(params: any): Promise<any> {
    console.log(`🚀 PlatformCrossPromoterAgent: trackEffectiveness`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute trackEffectiveness with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ trackEffectiveness completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in trackEffectiveness:`, error);
      throw error;
    }
  }

  /**
   * Optimize Strategy
   */
  async optimizeStrategy(params: any): Promise<any> {
    console.log(`🚀 PlatformCrossPromoterAgent: optimizeStrategy`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute optimizeStrategy with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ optimizeStrategy completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in optimizeStrategy:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete PlatformCrossPromoterAgent workflow\n`);

    try {
      const results: any = {};

      results.identifyOpportunities = await this.identifyOpportunities(params);
      results.repurposeContent = await this.repurposeContent(params);
      results.crossPost = await this.crossPost(params);

      console.log(`\n✅ PlatformCrossPromoterAgent workflow complete!\n`);
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

export default PlatformCrossPromoterAgent;
