/**
 * ReviewManagerAgent (#35)
 *
 * Purpose: Monitor and respond to reviews
 *
 * Revenue Impact: High - reviews drive trust
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
// REVIEWMANAGERAGENT
// =====================================================================

export class ReviewManagerAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Monitor Reviews
   */
  async monitorReviews(params: any): Promise<any> {
    console.log(`🚀 ReviewManagerAgent: monitorReviews`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute monitorReviews with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ monitorReviews completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in monitorReviews:`, error);
      throw error;
    }
  }

  /**
   * Respond To Reviews
   */
  async respondToReviews(params: any): Promise<any> {
    console.log(`🚀 ReviewManagerAgent: respondToReviews`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute respondToReviews with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ respondToReviews completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in respondToReviews:`, error);
      throw error;
    }
  }

  /**
   * Handle Negative
   */
  async handleNegative(params: any): Promise<any> {
    console.log(`🚀 ReviewManagerAgent: handleNegative`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute handleNegative with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ handleNegative completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in handleNegative:`, error);
      throw error;
    }
  }

  /**
   * Encourage Positive
   */
  async encouragePositive(params: any): Promise<any> {
    console.log(`🚀 ReviewManagerAgent: encouragePositive`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute encouragePositive with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ encouragePositive completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in encouragePositive:`, error);
      throw error;
    }
  }

  /**
   * Analyze Review Sentiment
   */
  async analyzeReviewSentiment(params: any): Promise<any> {
    console.log(`🚀 ReviewManagerAgent: analyzeReviewSentiment`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute analyzeReviewSentiment with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ analyzeReviewSentiment completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in analyzeReviewSentiment:`, error);
      throw error;
    }
  }

  /**
   * Generate Insights
   */
  async generateInsights(params: any): Promise<any> {
    console.log(`🚀 ReviewManagerAgent: generateInsights`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute generateInsights with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ generateInsights completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in generateInsights:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete ReviewManagerAgent workflow\n`);

    try {
      const results: any = {};

      results.monitorReviews = await this.monitorReviews(params);
      results.respondToReviews = await this.respondToReviews(params);
      results.handleNegative = await this.handleNegative(params);

      console.log(`\n✅ ReviewManagerAgent workflow complete!\n`);
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

export default ReviewManagerAgent;
