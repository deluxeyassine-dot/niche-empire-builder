/**
 * LaunchManagerAgent (#49)
 *
 * Purpose: Orchestrate product launches
 *
 * Revenue Impact: Very High - launches = revenue spikes
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
// LAUNCHMANAGERAGENT
// =====================================================================

export class LaunchManagerAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Plan Launch
   */
  async planLaunch(params: any): Promise<any> {
    console.log(`🚀 LaunchManagerAgent: planLaunch`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute planLaunch with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ planLaunch completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in planLaunch:`, error);
      throw error;
    }
  }

  /**
   * Coordinate Channels
   */
  async coordinateChannels(params: any): Promise<any> {
    console.log(`🚀 LaunchManagerAgent: coordinateChannels`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute coordinateChannels with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ coordinateChannels completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in coordinateChannels:`, error);
      throw error;
    }
  }

  /**
   * Build Hype
   */
  async buildHype(params: any): Promise<any> {
    console.log(`🚀 LaunchManagerAgent: buildHype`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute buildHype with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ buildHype completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in buildHype:`, error);
      throw error;
    }
  }

  /**
   * Execute Launch
   */
  async executeLaunch(params: any): Promise<any> {
    console.log(`🚀 LaunchManagerAgent: executeLaunch`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute executeLaunch with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ executeLaunch completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in executeLaunch:`, error);
      throw error;
    }
  }

  /**
   * Track Results
   */
  async trackResults(params: any): Promise<any> {
    console.log(`🚀 LaunchManagerAgent: trackResults`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute trackResults with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ trackResults completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in trackResults:`, error);
      throw error;
    }
  }

  /**
   * Post Launch Optimization
   */
  async postLaunchOptimization(params: any): Promise<any> {
    console.log(`🚀 LaunchManagerAgent: postLaunchOptimization`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute postLaunchOptimization with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ postLaunchOptimization completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in postLaunchOptimization:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete LaunchManagerAgent workflow\n`);

    try {
      const results: any = {};

      results.planLaunch = await this.planLaunch(params);
      results.coordinateChannels = await this.coordinateChannels(params);
      results.buildHype = await this.buildHype(params);

      console.log(`\n✅ LaunchManagerAgent workflow complete!\n`);
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

export default LaunchManagerAgent;
