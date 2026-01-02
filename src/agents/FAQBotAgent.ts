/**
 * FAQBotAgent (#36)
 *
 * Purpose: Answer common questions automatically
 *
 * Revenue Impact: Medium - reduces support load
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
// FAQBOTAGENT
// =====================================================================

export class FAQBotAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Build Knowledge Base
   */
  async buildKnowledgeBase(params: any): Promise<any> {
    console.log(`🚀 FAQBotAgent: buildKnowledgeBase`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute buildKnowledgeBase with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ buildKnowledgeBase completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in buildKnowledgeBase:`, error);
      throw error;
    }
  }

  /**
   * Answer Questions
   */
  async answerQuestions(params: any): Promise<any> {
    console.log(`🚀 FAQBotAgent: answerQuestions`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute answerQuestions with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ answerQuestions completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in answerQuestions:`, error);
      throw error;
    }
  }

  /**
   * Learns From Interactions
   */
  async learnsFromInteractions(params: any): Promise<any> {
    console.log(`🚀 FAQBotAgent: learnsFromInteractions`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute learnsFromInteractions with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ learnsFromInteractions completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in learnsFromInteractions:`, error);
      throw error;
    }
  }

  /**
   * Suggest Articles
   */
  async suggestArticles(params: any): Promise<any> {
    console.log(`🚀 FAQBotAgent: suggestArticles`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute suggestArticles with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ suggestArticles completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in suggestArticles:`, error);
      throw error;
    }
  }

  /**
   * Escalate Complex
   */
  async escalateComplex(params: any): Promise<any> {
    console.log(`🚀 FAQBotAgent: escalateComplex`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute escalateComplex with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ escalateComplex completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in escalateComplex:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete FAQBotAgent workflow\n`);

    try {
      const results: any = {};

      results.buildKnowledgeBase = await this.buildKnowledgeBase(params);
      results.answerQuestions = await this.answerQuestions(params);
      results.learnsFromInteractions = await this.learnsFromInteractions(params);

      console.log(`\n✅ FAQBotAgent workflow complete!\n`);
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

export default FAQBotAgent;
