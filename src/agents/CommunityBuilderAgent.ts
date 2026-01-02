/**
 * CommunityBuilderAgent (#30)
 *
 * Purpose: Build and manage online communities
 *
 * Revenue Impact: High - communities drive engagement
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
// COMMUNITYBUILDERAGENT
// =====================================================================

export class CommunityBuilderAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Create Community
   */
  async createCommunity(params: any): Promise<any> {
    console.log(`🚀 CommunityBuilderAgent: createCommunity`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute createCommunity with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ createCommunity completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in createCommunity:`, error);
      throw error;
    }
  }

  /**
   * Moderate Content
   */
  async moderateContent(params: any): Promise<any> {
    console.log(`🚀 CommunityBuilderAgent: moderateContent`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute moderateContent with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ moderateContent completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in moderateContent:`, error);
      throw error;
    }
  }

  /**
   * Engage Members
   */
  async engageMembers(params: any): Promise<any> {
    console.log(`🚀 CommunityBuilderAgent: engageMembers`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute engageMembers with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ engageMembers completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in engageMembers:`, error);
      throw error;
    }
  }

  /**
   * Organize Events
   */
  async organizeEvents(params: any): Promise<any> {
    console.log(`🚀 CommunityBuilderAgent: organizeEvents`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute organizeEvents with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ organizeEvents completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in organizeEvents:`, error);
      throw error;
    }
  }

  /**
   * Grow Membership
   */
  async growMembership(params: any): Promise<any> {
    console.log(`🚀 CommunityBuilderAgent: growMembership`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute growMembership with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ growMembership completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in growMembership:`, error);
      throw error;
    }
  }

  /**
   * Track Engagement
   */
  async trackEngagement(params: any): Promise<any> {
    console.log(`🚀 CommunityBuilderAgent: trackEngagement`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute trackEngagement with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ trackEngagement completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in trackEngagement:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete CommunityBuilderAgent workflow\n`);

    try {
      const results: any = {};

      results.createCommunity = await this.createCommunity(params);
      results.moderateContent = await this.moderateContent(params);
      results.engageMembers = await this.engageMembers(params);

      console.log(`\n✅ CommunityBuilderAgent workflow complete!\n`);
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

export default CommunityBuilderAgent;
