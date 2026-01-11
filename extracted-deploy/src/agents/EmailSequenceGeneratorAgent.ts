/**
 * EmailSequenceGeneratorAgent (#18)
 *
 * Purpose: Create complete email marketing sequences
 *
 * Revenue Impact: Very High - email marketing = highest ROI channel
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
// EMAILSEQUENCEGENERATORAGENT
// =====================================================================

export class EmailSequenceGeneratorAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Create Welcome Sequence
   */
  async createWelcomeSequence(params: any): Promise<any> {
    console.log(`🚀 EmailSequenceGeneratorAgent: createWelcomeSequence`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute createWelcomeSequence with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ createWelcomeSequence completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in createWelcomeSequence:`, error);
      throw error;
    }
  }

  /**
   * Build Nurture Sequence
   */
  async buildNurtureSequence(params: any): Promise<any> {
    console.log(`🚀 EmailSequenceGeneratorAgent: buildNurtureSequence`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute buildNurtureSequence with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ buildNurtureSequence completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in buildNurtureSequence:`, error);
      throw error;
    }
  }

  /**
   * Generate Sales Sequence
   */
  async generateSalesSequence(params: any): Promise<any> {
    console.log(`🚀 EmailSequenceGeneratorAgent: generateSalesSequence`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute generateSalesSequence with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ generateSalesSequence completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in generateSalesSequence:`, error);
      throw error;
    }
  }

  /**
   * Write Email
   */
  async writeEmail(params: any): Promise<any> {
    console.log(`🚀 EmailSequenceGeneratorAgent: writeEmail`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute writeEmail with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ writeEmail completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in writeEmail:`, error);
      throw error;
    }
  }

  /**
   * Optimize Subject Line
   */
  async optimizeSubjectLine(params: any): Promise<any> {
    console.log(`🚀 EmailSequenceGeneratorAgent: optimizeSubjectLine`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute optimizeSubjectLine with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ optimizeSubjectLine completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in optimizeSubjectLine:`, error);
      throw error;
    }
  }

  /**
   * Add Personalization
   */
  async addPersonalization(params: any): Promise<any> {
    console.log(`🚀 EmailSequenceGeneratorAgent: addPersonalization`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute addPersonalization with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ addPersonalization completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in addPersonalization:`, error);
      throw error;
    }
  }

  /**
   * Predict Open Rate
   */
  async predictOpenRate(params: any): Promise<any> {
    console.log(`🚀 EmailSequenceGeneratorAgent: predictOpenRate`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute predictOpenRate with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ predictOpenRate completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in predictOpenRate:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete EmailSequenceGeneratorAgent workflow\n`);

    try {
      const results: any = {};

      results.createWelcomeSequence = await this.createWelcomeSequence(params);
      results.buildNurtureSequence = await this.buildNurtureSequence(params);
      results.generateSalesSequence = await this.generateSalesSequence(params);

      console.log(`\n✅ EmailSequenceGeneratorAgent workflow complete!\n`);
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

export default EmailSequenceGeneratorAgent;
