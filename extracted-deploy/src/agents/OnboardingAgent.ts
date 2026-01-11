/**
 * OnboardingAgent (#48)
 *
 * Purpose: Automate customer onboarding
 *
 * Revenue Impact: High - good onboarding = lower churn
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
// ONBOARDINGAGENT
// =====================================================================

export class OnboardingAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Create Onboarding Flow
   */
  async createOnboardingFlow(params: any): Promise<any> {
    console.log(`🚀 OnboardingAgent: createOnboardingFlow`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute createOnboardingFlow with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ createOnboardingFlow completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in createOnboardingFlow:`, error);
      throw error;
    }
  }

  /**
   * Guide New Customers
   */
  async guideNewCustomers(params: any): Promise<any> {
    console.log(`🚀 OnboardingAgent: guideNewCustomers`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute guideNewCustomers with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ guideNewCustomers completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in guideNewCustomers:`, error);
      throw error;
    }
  }

  /**
   * Track Progress
   */
  async trackProgress(params: any): Promise<any> {
    console.log(`🚀 OnboardingAgent: trackProgress`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute trackProgress with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ trackProgress completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in trackProgress:`, error);
      throw error;
    }
  }

  /**
   * Personalize Experience
   */
  async personalizeExperience(params: any): Promise<any> {
    console.log(`🚀 OnboardingAgent: personalizeExperience`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute personalizeExperience with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ personalizeExperience completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in personalizeExperience:`, error);
      throw error;
    }
  }

  /**
   * Measure Activation
   */
  async measureActivation(params: any): Promise<any> {
    console.log(`🚀 OnboardingAgent: measureActivation`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute measureActivation with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ measureActivation completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in measureActivation:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete OnboardingAgent workflow\n`);

    try {
      const results: any = {};

      results.createOnboardingFlow = await this.createOnboardingFlow(params);
      results.guideNewCustomers = await this.guideNewCustomers(params);
      results.trackProgress = await this.trackProgress(params);

      console.log(`\n✅ OnboardingAgent workflow complete!\n`);
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

export default OnboardingAgent;
