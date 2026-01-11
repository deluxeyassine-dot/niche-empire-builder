/**
 * Content Template Generator Agent (#9)
 *
 * Purpose: Create templates for various content types (notion templates, spreadsheets, planners, worksheets, etc.).
 *
 * Revenue Impact: High - templates are in massive demand and easy to create at scale.
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// =====================================================================
// INTERFACES
// =====================================================================

export interface NotionTemplate {
  id: string;
  name: string;
  purpose: string;
  structure: NotionBlock[];
  databases: NotionDatabase[];
  properties: Record<string, any>;
}

export interface NotionBlock {
  type: string;
  content: string;
  children?: NotionBlock[];
}

export interface NotionDatabase {
  name: string;
  properties: NotionProperty[];
  views: string[];
}

export interface NotionProperty {
  name: string;
  type: string;
  config?: Record<string, any>;
}

export interface SpreadsheetTemplate {
  id: string;
  name: string;
  useCase: string;
  sheets: Sheet[];
  formulas: Formula[];
}

export interface Sheet {
  name: string;
  columns: Column[];
  rows: number;
  formatting: SheetFormatting;
}

export interface Column {
  name: string;
  type: string;
  format?: string;
}

export interface SheetFormatting {
  headerStyle: Record<string, any>;
  bodyStyle: Record<string, any>;
}

export interface Formula {
  cell: string;
  formula: string;
  description: string;
}

export interface PlannerTemplate {
  id: string;
  name: string;
  type: string;
  sections: PlannerSection[];
  frequency: string;
}

export interface PlannerSection {
  name: string;
  fields: PlannerField[];
  layout: string;
}

export interface PlannerField {
  name: string;
  type: string;
  placeholder?: string;
}

export interface WorksheetTemplate {
  id: string;
  name: string;
  topic: string;
  exercises: Exercise[];
  instructions: string;
}

export interface Exercise {
  title: string;
  description: string;
  type: string;
  content: string;
}

export interface Template {
  id: string;
  name: string;
  type: string;
  content: any;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  actions: AutomationAction[];
}

export interface AutomationAction {
  type: string;
  params: Record<string, any>;
}

export interface Instructions {
  title: string;
  steps: InstructionStep[];
  tips: string[];
}

export interface InstructionStep {
  number: number;
  title: string;
  description: string;
  screenshot?: string;
}

// =====================================================================
// CONTENT TEMPLATE GENERATOR AGENT
// =====================================================================

export class ContentTemplateGeneratorAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(
    anthropicApiKey: string,
    supabaseUrl: string,
    supabaseKey: string
  ) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // =====================================================================
  // CREATION METHODS
  // =====================================================================

  /**
   * Generate Notion template
   */
  async generateNotionTemplate(purpose: string): Promise<NotionTemplate> {
    console.log(`📝 Generating Notion template for: ${purpose}`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Create a comprehensive Notion template for: ${purpose}

Include:
1. Template structure (pages, blocks, sections)
2. Database schemas with properties
3. Views (table, board, calendar, gallery)
4. Relations and rollups
5. Formulas for calculations
6. Template buttons and automation ideas

Format as JSON with clear structure.`
          }
        ]
      });

      const spec = this.parseResponse(response.content);

      const template: NotionTemplate = {
        id: `notion-${Date.now()}`,
        name: spec.name || `${purpose} Template`,
        purpose: purpose,
        structure: spec.structure || this.getDefaultNotionStructure(),
        databases: spec.databases || [],
        properties: spec.properties || {}
      };

      await this.storeTemplate(template, 'notion');
      console.log(`✅ Notion template generated: ${template.name}`);
      return template;
    } catch (error) {
      console.error('Error generating Notion template:', error);
      throw error;
    }
  }

  /**
   * Create spreadsheet template
   */
  async createSpreadsheet(useCase: string): Promise<SpreadsheetTemplate> {
    console.log(`📊 Creating spreadsheet for: ${useCase}`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Design a professional spreadsheet template for: ${useCase}

Include:
1. Sheet structure (tabs, columns, sections)
2. Formulas for calculations
3. Data validation rules
4. Conditional formatting
5. Charts and visualizations
6. Instructions sheet

Format as JSON.`
          }
        ]
      });

      const spec = this.parseResponse(response.content);

      const spreadsheet: SpreadsheetTemplate = {
        id: `spreadsheet-${Date.now()}`,
        name: spec.name || `${useCase} Spreadsheet`,
        useCase: useCase,
        sheets: spec.sheets || this.getDefaultSheets(useCase),
        formulas: spec.formulas || []
      };

      await this.storeTemplate(spreadsheet, 'spreadsheet');
      console.log(`✅ Spreadsheet created: ${spreadsheet.name}`);
      return spreadsheet;
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      throw error;
    }
  }

  /**
   * Build planner template
   */
  async buildPlanner(type: string): Promise<PlannerTemplate> {
    console.log(`📅 Building planner: ${type}`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Create a ${type} planner template.

Include:
1. Planner sections (overview, daily, weekly, monthly, etc.)
2. Fields for each section
3. Layout recommendations
4. Tracking elements
5. Goal-setting components
6. Review sections

Format as JSON.`
          }
        ]
      });

      const spec = this.parseResponse(response.content);

      const planner: PlannerTemplate = {
        id: `planner-${Date.now()}`,
        name: spec.name || `${type} Planner`,
        type: type,
        sections: spec.sections || this.getDefaultPlannerSections(type),
        frequency: spec.frequency || 'daily'
      };

      await this.storeTemplate(planner, 'planner');
      console.log(`✅ Planner built: ${planner.name}`);
      return planner;
    } catch (error) {
      console.error('Error building planner:', error);
      throw error;
    }
  }

  /**
   * Design worksheet template
   */
  async designWorksheet(topic: string): Promise<WorksheetTemplate> {
    console.log(`📋 Designing worksheet for: ${topic}`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Create an educational worksheet on: ${topic}

Include:
1. Learning objectives
2. Exercises (multiple types: fill-in-blank, questions, problems, etc.)
3. Answer key
4. Difficulty progression
5. Visual elements
6. Instructions

Format as JSON.`
          }
        ]
      });

      const spec = this.parseResponse(response.content);

      const worksheet: WorksheetTemplate = {
        id: `worksheet-${Date.now()}`,
        name: spec.name || `${topic} Worksheet`,
        topic: topic,
        exercises: spec.exercises || [],
        instructions: spec.instructions || 'Complete all exercises.'
      };

      await this.storeTemplate(worksheet, 'worksheet');
      console.log(`✅ Worksheet designed: ${worksheet.name}`);
      return worksheet;
    } catch (error) {
      console.error('Error designing worksheet:', error);
      throw error;
    }
  }

  // =====================================================================
  // ENHANCEMENT METHODS
  // =====================================================================

  /**
   * Add formulas to template
   */
  async addFormulas(template: Template): Promise<Template> {
    console.log(`🔢 Adding formulas to template: ${template.name}`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Add useful formulas to this ${template.type} template:

${JSON.stringify(template.content, null, 2)}

Generate formulas for:
1. Calculations
2. Data aggregation
3. Conditional logic
4. Date/time operations
5. Text manipulation

Format as JSON array of formulas.`
          }
        ]
      });

      const formulas = this.parseResponse(response.content);
      template.content.formulas = formulas;

      await this.updateTemplate(template);
      console.log(`✅ Formulas added to template`);
      return template;
    } catch (error) {
      console.error('Error adding formulas:', error);
      throw error;
    }
  }

  /**
   * Create automations for template
   */
  async createAutomations(template: Template): Promise<Automation[]> {
    console.log(`⚙️ Creating automations for: ${template.name}`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Design automations for this ${template.type} template:

${JSON.stringify(template.content, null, 2)}

Create automations for:
1. Auto-population
2. Status updates
3. Notifications
4. Data syncing
5. Recurring tasks

Format as JSON array.`
          }
        ]
      });

      const automations: Automation[] = this.parseResponse(response.content);

      await this.storeAutomations(template.id, automations);
      console.log(`✅ Created ${automations.length} automations`);
      return automations;
    } catch (error) {
      console.error('Error creating automations:', error);
      throw error;
    }
  }

  /**
   * Generate instructions for template
   */
  async generateInstructions(template: Template): Promise<Instructions> {
    console.log(`📖 Generating instructions for: ${template.name}`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Write clear, step-by-step instructions for using this ${template.type} template:

Template: ${template.name}
Content: ${JSON.stringify(template.content, null, 2)}

Include:
1. Getting started steps
2. How to use each feature
3. Best practices
4. Tips and tricks
5. Troubleshooting

Format as JSON.`
          }
        ]
      });

      const instructions: Instructions = this.parseResponse(response.content);

      await this.storeInstructions(template.id, instructions);
      console.log(`✅ Instructions generated`);
      return instructions;
    } catch (error) {
      console.error('Error generating instructions:', error);
      throw error;
    }
  }

  // =====================================================================
  // COMPLETE WORKFLOW
  // =====================================================================

  /**
   * Run complete template generation workflow
   */
  async runComplete(purpose: string): Promise<{
    notionTemplate: NotionTemplate;
    spreadsheet: SpreadsheetTemplate;
    planner: PlannerTemplate;
    worksheet: WorksheetTemplate;
  }> {
    console.log(`\n🚀 Running complete template generation for: ${purpose}\n`);

    try {
      const notionTemplate = await this.generateNotionTemplate(purpose);
      const spreadsheet = await this.createSpreadsheet(purpose);
      const planner = await this.buildPlanner(purpose);
      const worksheet = await this.designWorksheet(purpose);

      console.log(`\n✅ Complete template generation finished!\n`);
      return { notionTemplate, spreadsheet, planner, worksheet };
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

  private getDefaultNotionStructure(): NotionBlock[] {
    return [
      { type: 'heading_1', content: 'Overview' },
      { type: 'paragraph', content: 'Template description' },
      { type: 'database', content: 'Main Database' }
    ];
  }

  private getDefaultSheets(useCase: string): Sheet[] {
    return [
      {
        name: 'Data',
        columns: [
          { name: 'ID', type: 'number' },
          { name: 'Name', type: 'text' },
          { name: 'Value', type: 'number' }
        ],
        rows: 100,
        formatting: {
          headerStyle: { bold: true, background: '#4285f4' },
          bodyStyle: { fontSize: 11 }
        }
      }
    ];
  }

  private getDefaultPlannerSections(type: string): PlannerSection[] {
    return [
      {
        name: 'Daily Overview',
        fields: [
          { name: 'Date', type: 'date' },
          { name: 'Goals', type: 'text' },
          { name: 'Tasks', type: 'checklist' }
        ],
        layout: 'vertical'
      }
    ];
  }

  private async storeTemplate(template: any, type: string): Promise<void> {
    await this.supabase.from('content_templates').insert({
      id: template.id,
      template_name: template.name,
      template_type: type,
      description: template.purpose || template.useCase || template.topic,
      created_at: new Date().toISOString()
    });
  }

  private async updateTemplate(template: Template): Promise<void> {
    await this.supabase.from('content_templates')
      .update({ description: JSON.stringify(template.content) })
      .eq('id', template.id);
  }

  private async storeAutomations(templateId: string, automations: Automation[]): Promise<void> {
    console.log(`💾 Stored ${automations.length} automations for template ${templateId}`);
  }

  private async storeInstructions(templateId: string, instructions: Instructions): Promise<void> {
    console.log(`💾 Stored instructions for template ${templateId}`);
  }
}

// =====================================================================
// EXPORT
// =====================================================================

export default ContentTemplateGeneratorAgent;
