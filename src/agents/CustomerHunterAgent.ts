/**
 * CustomerHunterAgent (#28)
 *
 * Purpose: Find and target ideal customers
 *
 * Revenue Impact: Very High - targeted acquisition
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
// CUSTOMERHUNTERAGENT
// =====================================================================

export class CustomerHunterAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Identify Target Customers
   */
  async identifyTargetCustomers(params: any): Promise<any> {
    console.log(`🚀 CustomerHunterAgent: identifyTargetCustomers`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute identifyTargetCustomers with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ identifyTargetCustomers completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in identifyTargetCustomers:`, error);
      throw error;
    }
  }

  /**
   * Research Prospects
   */
  async researchProspects(params: any): Promise<any> {
    console.log(`🚀 CustomerHunterAgent: researchProspects`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute researchProspects with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ researchProspects completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in researchProspects:`, error);
      throw error;
    }
  }

  /**
   * Build Prospect Lists
   */
  async buildProspectLists(params: any): Promise<any> {
    console.log(`🚀 CustomerHunterAgent: buildProspectLists`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute buildProspectLists with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ buildProspectLists completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in buildProspectLists:`, error);
      throw error;
    }
  }

  /**
   * Score Leads
   */
  async scoreLeads(params: any): Promise<any> {
    console.log(`🚀 CustomerHunterAgent: scoreLeads`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute scoreLeads with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ scoreLeads completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in scoreLeads:`, error);
      throw error;
    }
  }

  /**
   * Enrich Data
   */
  async enrichData(params: any): Promise<any> {
    console.log(`🚀 CustomerHunterAgent: enrichData`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute enrichData with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ enrichData completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in enrichData:`, error);
      throw error;
    }
  }

  /**
   * Generate Outreach Lists
   */
  async generateOutreachLists(params: any): Promise<any> {
    console.log(`🚀 CustomerHunterAgent: generateOutreachLists`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Execute generateOutreachLists with params: ${JSON.stringify(params)}`
        }]
      });

      const result = this.parseResponse(response.content);
      console.log(`✅ generateOutreachLists completed successfully`);
      return result;
    } catch (error) {
      console.error(`Error in generateOutreachLists:`, error);
      throw error;
    }
  }

  /**
   * Run complete workflow
   */
  async runComplete(params: any): Promise<any> {
    console.log(`\n🚀 Running complete CustomerHunterAgent workflow\n`);

    try {
      const results: any = {};

      results.identifyTargetCustomers = await this.identifyTargetCustomers(params);
      results.researchProspects = await this.researchProspects(params);
      results.buildProspectLists = await this.buildProspectLists(params);

      console.log(`\n✅ CustomerHunterAgent workflow complete!\n`);
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

export default CustomerHunterAgent;
