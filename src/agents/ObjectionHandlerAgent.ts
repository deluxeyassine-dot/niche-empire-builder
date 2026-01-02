/**
 * ObjectionHandlerAgent (#37)
 *
 * Purpose: Identify and address customer objections
 *
 * Revenue Impact: High - removes purchase barriers
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
// OBJECTIONHANDLERAGENT
// =====================================================================

export class ObjectionHandlerAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Identify Objections
   */
  async identifyObjections(params: any): Promise<any> {
    console.log(`🚀 ObjectionHandlerAgent: identifyObjections`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute identifyObjections with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ identifyObjections completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in identifyObjections:`, error);
      throw error;
    }
  }

  /**
   * Craft Responses
   */
  async craftResponses(params: any): Promise<any> {
    console.log(`🚀 ObjectionHandlerAgent: craftResponses`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute craftResponses with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ craftResponses completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in craftResponses:`, error);
      throw error;
    }
  }

  /**
   * Handle In Real Time
   */
  async handleInRealTime(params: any): Promise<any> {
    console.log(`🚀 ObjectionHandlerAgent: handleInRealTime`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute handleInRealTime with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ handleInRealTime completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in handleInRealTime:`, error);
      throw error;
    }
  }

  /**
   * Track Patterns
   */
  async trackPatterns(params: any): Promise<any> {
    console.log(`🚀 ObjectionHandlerAgent: trackPatterns`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute trackPatterns with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ trackPatterns completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in trackPatterns:`, error);
      throw error;
    }
  }

  /**
   * Optimize Responses
   */
  async optimizeResponses(params: any): Promise<any> {
    console.log(`🚀 ObjectionHandlerAgent: optimizeResponses`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute optimizeResponses with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ optimizeResponses completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in optimizeResponses:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete ObjectionHandlerAgent workflow\n`);

    try {
      const results: any = {};

      results.identifyObjections = await this.identifyObjections(params);
      results.craftResponses = await this.craftResponses(params);
      results.handleInRealTime = await this.handleInRealTime(params);

      console.log(`\n✅ ObjectionHandlerAgent workflow complete!\n`);
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

export default ObjectionHandlerAgent;
