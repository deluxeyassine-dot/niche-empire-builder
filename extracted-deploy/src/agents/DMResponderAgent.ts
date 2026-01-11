/**
 * DMResponderAgent (#34)
 *
 * Purpose: Automatically respond to direct messages
 *
 * Revenue Impact: Medium - improves experience
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
// DMRESPONDERAGENT
// =====================================================================

export class DMResponderAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Monitor D Ms
   */
  async monitorDMs(params: any): Promise<any> {
    console.log(`🚀 DMResponderAgent: monitorDMs`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute monitorDMs with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ monitorDMs completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in monitorDMs:`, error);
      throw error;
    }
  }

  /**
   * Respond Intelligently
   */
  async respondIntelligently(params: any): Promise<any> {
    console.log(`🚀 DMResponderAgent: respondIntelligently`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute respondIntelligently with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ respondIntelligently completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in respondIntelligently:`, error);
      throw error;
    }
  }

  /**
   * Qualify Leads
   */
  async qualifyLeads(params: any): Promise<any> {
    console.log(`🚀 DMResponderAgent: qualifyLeads`);

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
   * Escalate To Human
   */
  async escalateToHuman(params: any): Promise<any> {
    console.log(`🚀 DMResponderAgent: escalateToHuman`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute escalateToHuman with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ escalateToHuman completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in escalateToHuman:`, error);
      throw error;
    }
  }

  /**
   * Track Conversations
   */
  async trackConversations(params: any): Promise<any> {
    console.log(`🚀 DMResponderAgent: trackConversations`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute trackConversations with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ trackConversations completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in trackConversations:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete DMResponderAgent workflow\n`);

    try {
      const results: any = {};

      results.monitorDMs = await this.monitorDMs(params);
      results.respondIntelligently = await this.respondIntelligently(params);
      results.qualifyLeads = await this.qualifyLeads(params);

      console.log(`\n✅ DMResponderAgent workflow complete!\n`);
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

export default DMResponderAgent;
