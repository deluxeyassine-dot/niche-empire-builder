/**
 * GrowthAdvisorAgent (#44)
 *
 * Purpose: Provide strategic growth recommendations
 *
 * Revenue Impact: High - strategic guidance accelerates growth
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
// GROWTHADVISORAGENT
// =====================================================================

export class GrowthAdvisorAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Analyze Growth
   */
  async analyzeGrowth(params: any): Promise<any> {
    console.log(`🚀 GrowthAdvisorAgent: analyzeGrowth`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute analyzeGrowth with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ analyzeGrowth completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in analyzeGrowth:`, error);
      throw error;
    }
  }

  /**
   * Identify Bottlenecks
   */
  async identifyBottlenecks(params: any): Promise<any> {
    console.log(`🚀 GrowthAdvisorAgent: identifyBottlenecks`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute identifyBottlenecks with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ identifyBottlenecks completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in identifyBottlenecks:`, error);
      throw error;
    }
  }

  /**
   * Recommend Strategies
   */
  async recommendStrategies(params: any): Promise<any> {
    console.log(`🚀 GrowthAdvisorAgent: recommendStrategies`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute recommendStrategies with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ recommendStrategies completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in recommendStrategies:`, error);
      throw error;
    }
  }

  /**
   * Prioritize Initiatives
   */
  async prioritizeInitiatives(params: any): Promise<any> {
    console.log(`🚀 GrowthAdvisorAgent: prioritizeInitiatives`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute prioritizeInitiatives with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ prioritizeInitiatives completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in prioritizeInitiatives:`, error);
      throw error;
    }
  }

  /**
   * Forecast Impact
   */
  async forecastImpact(params: any): Promise<any> {
    console.log(`🚀 GrowthAdvisorAgent: forecastImpact`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute forecastImpact with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ forecastImpact completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in forecastImpact:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete GrowthAdvisorAgent workflow\n`);

    try {
      const results: any = {};

      results.analyzeGrowth = await this.analyzeGrowth(params);
      results.identifyBottlenecks = await this.identifyBottlenecks(params);
      results.recommendStrategies = await this.recommendStrategies(params);

      console.log(`\n✅ GrowthAdvisorAgent workflow complete!\n`);
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

export default GrowthAdvisorAgent;
