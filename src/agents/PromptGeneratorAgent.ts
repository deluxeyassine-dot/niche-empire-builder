/**
 * Prompt Generator Agent (#13)
 * Purpose: Create high-quality AI prompts for ChatGPT, Midjourney, Stable Diffusion, and other AI tools.
 * Revenue Impact: High - prompt packs are trending and easy to produce ($7-$47).
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

export interface Prompt {
  id: string;
  text: string;
  category: string;
  platform: string;
  effectiveness: number;
}

export interface Template {
  id: string;
  name: string;
  structure: string;
}

export interface EffectivenessScore {
  score: number;
  feedback: string;
}

export interface OptimizedPrompt {
  original: string;
  optimized: string;
  improvements: string[];
}

export class PromptGeneratorAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async generateChatGPTPrompts(useCase: string, count: number): Promise<Prompt[]> {
    console.log(`🤖 Generating ${count} ChatGPT prompts for: ${useCase}`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Generate ${count} highly effective ChatGPT prompts for: ${useCase}

Each prompt should be:
1. Clear and specific
2. Include context and constraints
3. Specify desired output format
4. Be immediately usable

Format as JSON array.`
      }]
    });

    const prompts = this.parseResponse(response.content);
    console.log(`✅ Generated ${prompts.length} ChatGPT prompts`);
    return prompts;
  }

  async createMidjourneyPrompts(style: string, count: number): Promise<Prompt[]> {
    console.log(`🎨 Generating ${count} Midjourney prompts in ${style} style`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Create ${count} Midjourney prompts in ${style} style.

Include:
1. Subject description
2. Style modifiers
3. Quality parameters
4. Aspect ratio
5. Version tags

Format as JSON array.`
      }]
    });

    const prompts = this.parseResponse(response.content);
    console.log(`✅ Generated ${prompts.length} Midjourney prompts`);
    return prompts;
  }

  async buildPromptTemplates(category: string): Promise<Template[]> {
    console.log(`📋 Building prompt templates for: ${category}`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Create reusable prompt templates for ${category}.

Templates should have:
1. Variable placeholders
2. Clear structure
3. Examples
4. Usage instructions

Format as JSON array.`
      }]
    });

    const templates = this.parseResponse(response.content);
    console.log(`✅ Created ${templates.length} templates`);
    return templates;
  }

  async testPromptEffectiveness(prompt: Prompt): Promise<EffectivenessScore> {
    console.log(`🧪 Testing prompt effectiveness`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Evaluate this prompt for effectiveness:

"${prompt.text}"

Rate on:
1. Clarity (0-100)
2. Specificity (0-100)
3. Output quality (0-100)
4. Usability (0-100)

Provide overall score and feedback. Format as JSON.`
      }]
    });

    const score = this.parseResponse(response.content);
    console.log(`✅ Effectiveness score: ${score.score}/100`);
    return score;
  }

  async optimizePrompt(prompt: Prompt): Promise<OptimizedPrompt> {
    console.log(`⚡ Optimizing prompt`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Optimize this prompt for better results:

"${prompt.text}"

Improve:
1. Clarity and specificity
2. Context and constraints
3. Output format specification
4. Overall effectiveness

Provide optimized version and list improvements. Format as JSON.`
      }]
    });

    const optimized = this.parseResponse(response.content);
    console.log(`✅ Prompt optimized with ${optimized.improvements?.length || 0} improvements`);
    return optimized;
  }

  async createVariations(basePrompt: Prompt, count: number): Promise<Prompt[]> {
    console.log(`🔄 Creating ${count} variations`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Create ${count} variations of this prompt:

"${basePrompt.text}"

Each variation should:
1. Maintain core purpose
2. Use different phrasing
3. Add unique modifiers
4. Target slightly different use cases

Format as JSON array.`
      }]
    });

    const variations = this.parseResponse(response.content);
    console.log(`✅ Created ${variations.length} variations`);
    return variations;
  }

  async runComplete(useCase: string): Promise<any> {
    console.log(`\n🚀 Running complete prompt generation for: ${useCase}\n`);

    const chatgptPrompts = await this.generateChatGPTPrompts(useCase, 10);
    const midjourneyPrompts = await this.createMidjourneyPrompts('modern', 5);
    const templates = await this.buildPromptTemplates(useCase);

    if (chatgptPrompts.length > 0) {
      const effectiveness = await this.testPromptEffectiveness(chatgptPrompts[0]);
      const optimized = await this.optimizePrompt(chatgptPrompts[0]);
      const variations = await this.createVariations(chatgptPrompts[0], 3);
    }

    console.log(`\n✅ Complete prompt pack generated!\n`);
    return { chatgptPrompts, midjourneyPrompts, templates };
  }

  private parseResponse(content: any): any {
    try {
      const text = Array.isArray(content) ? content[0]?.text || '[]' : content.text || '[]';
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      return [];
    }
  }
}

export default PromptGeneratorAgent;
