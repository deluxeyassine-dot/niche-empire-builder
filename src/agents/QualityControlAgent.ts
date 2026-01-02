/**
 * Quality Control Agent (#14)
 *
 * Purpose: Review all generated content and products for quality, accuracy, and market readiness before release.
 *
 * Revenue Impact: Critical - ensures high product quality = fewer refunds + better reviews.
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

export interface Product {
  id: string;
  name: string;
  type: string;
  content: any;
}

export interface QualityReport {
  productId: string;
  qualityScore: number;
  readabilityScore: number;
  originalityScore: number;
  functionalityScore: number;
  marketReadinessScore: number;
  issues: Issue[];
  recommendations: string[];
}

export interface QualityScore {
  score: number;
  breakdown: Record<string, number>;
  feedback: string;
}

export interface Content {
  id: string;
  text: string;
  type: string;
}

export interface Tool {
  id: string;
  name: string;
  code: string;
}

export interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

export interface ReadinessScore {
  score: number;
  criteria: Record<string, boolean>;
  blockers: string[];
}

export interface Improvement {
  area: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: string;
}

export interface Issue {
  severity: 'critical' | 'major' | 'minor';
  category: string;
  description: string;
  location?: string;
}

export interface Fix {
  issue: Issue;
  solution: string;
  automated: boolean;
}

export class QualityControlAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async reviewProduct(product: Product): Promise<QualityReport> {
    console.log(`🔍 Reviewing product: ${product.name}`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Conduct a comprehensive quality review of this ${product.type}:

Name: ${product.name}
Content: ${JSON.stringify(product.content).substring(0, 2000)}

Evaluate:
1. Overall quality (0-100)
2. Readability (0-100)
3. Originality (0-100)
4. Functionality (0-100)
5. Market readiness (0-100)

Identify issues and provide recommendations. Format as JSON.`
      }]
    });

    const report = this.parseResponse(response.content);

    const qualityReport: QualityReport = {
      productId: product.id,
      qualityScore: report.qualityScore || 0,
      readabilityScore: report.readabilityScore || 0,
      originalityScore: report.originalityScore || 0,
      functionalityScore: report.functionalityScore || 0,
      marketReadinessScore: report.marketReadinessScore || 0,
      issues: report.issues || [],
      recommendations: report.recommendations || []
    };

    await this.storeQualityReport(qualityReport);
    console.log(`✅ Quality review complete: ${qualityReport.qualityScore}/100`);
    return qualityReport;
  }

  async checkContentQuality(content: Content): Promise<QualityScore> {
    console.log(`📝 Checking content quality`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Evaluate the quality of this ${content.type} content:

${content.text.substring(0, 2000)}

Check:
1. Grammar and spelling (0-100)
2. Clarity and coherence (0-100)
3. Engagement level (0-100)
4. Value delivered (0-100)
5. Professional tone (0-100)

Provide overall score, breakdown, and feedback. Format as JSON.`
      }]
    });

    const quality = this.parseResponse(response.content);
    console.log(`✅ Content quality: ${quality.score}/100`);
    return quality;
  }

  async validateFunctionality(tool: Tool): Promise<ValidationResult> {
    console.log(`🧪 Validating tool functionality: ${tool.name}`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Validate this code for functionality and quality:

Tool: ${tool.name}
Code:
${tool.code.substring(0, 2000)}

Check for:
1. Syntax errors
2. Logic errors
3. Security vulnerabilities
4. Performance issues
5. Best practices

List errors and warnings. Format as JSON.`
      }]
    });

    const validation = this.parseResponse(response.content);
    const result: ValidationResult = {
      passed: validation.errors?.length === 0,
      errors: validation.errors || [],
      warnings: validation.warnings || []
    };

    console.log(`✅ Validation ${result.passed ? 'passed' : 'failed'}: ${result.errors.length} errors, ${result.warnings.length} warnings`);
    return result;
  }

  async assessMarketReadiness(product: Product): Promise<ReadinessScore> {
    console.log(`📊 Assessing market readiness`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Assess market readiness for this product:

Name: ${product.name}
Type: ${product.type}

Evaluate:
1. Product completeness (yes/no)
2. Quality standards met (yes/no)
3. Value proposition clear (yes/no)
4. Target audience defined (yes/no)
5. Pricing justified (yes/no)
6. Documentation complete (yes/no)

Provide score (0-100), criteria results, and any blockers. Format as JSON.`
      }]
    });

    const readiness = this.parseResponse(response.content);
    console.log(`✅ Market readiness: ${readiness.score}/100`);
    return readiness;
  }

  async suggestImprovements(product: Product): Promise<Improvement[]> {
    console.log(`💡 Suggesting improvements`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Suggest improvements for this product:

Name: ${product.name}
Type: ${product.type}
Content: ${JSON.stringify(product.content).substring(0, 1000)}

Provide 5-10 specific, actionable improvements with:
1. Area of improvement
2. Description
3. Priority (high/medium/low)
4. Effort estimation (hours)

Format as JSON array.`
      }]
    });

    const improvements = this.parseResponse(response.content);
    console.log(`✅ Suggested ${improvements.length} improvements`);
    return improvements;
  }

  async identifyIssues(product: Product): Promise<Issue[]> {
    console.log(`🔍 Identifying issues`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Identify all issues in this product:

Name: ${product.name}
Type: ${product.type}
Content: ${JSON.stringify(product.content).substring(0, 1000)}

Find issues with:
1. Content quality
2. Functionality
3. User experience
4. Value delivery
5. Market fit

For each issue:
- Severity (critical/major/minor)
- Category
- Description
- Location (if applicable)

Format as JSON array.`
      }]
    });

    const issues = this.parseResponse(response.content);
    console.log(`✅ Found ${issues.length} issues: ${issues.filter((i: Issue) => i.severity === 'critical').length} critical`);
    return issues;
  }

  async generateFixList(issues: Issue[]): Promise<Fix[]> {
    console.log(`🔧 Generating fix list for ${issues.length} issues`);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Generate fixes for these issues:

${JSON.stringify(issues, null, 2)}

For each issue, provide:
1. Solution description
2. Whether it can be automated
3. Implementation steps

Format as JSON array.`
      }]
    });

    const fixes = this.parseResponse(response.content);
    console.log(`✅ Generated ${fixes.length} fixes`);
    return fixes;
  }

  async runComplete(product: Product): Promise<any> {
    console.log(`\n🚀 Running complete quality control for: ${product.name}\n`);

    const review = await this.reviewProduct(product);
    const readiness = await this.assessMarketReadiness(product);
    const improvements = await this.suggestImprovements(product);
    const issues = await this.identifyIssues(product);
    const fixes = await this.generateFixList(issues);

    const approved = review.qualityScore >= 80 && readiness.score >= 80;

    console.log(`\n${approved ? '✅ APPROVED' : '❌ NEEDS WORK'}: Quality ${review.qualityScore}/100, Readiness ${readiness.score}/100\n`);
    return { review, readiness, improvements, issues, fixes, approved };
  }

  private parseResponse(content: any): any {
    try {
      const text = Array.isArray(content) ? content[0]?.text || '{}' : content.text || '{}';
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      return {};
    }
  }

  private async storeQualityReport(report: QualityReport): Promise<void> {
    await this.supabase.from('quality_reviews').insert({
      product_id: report.productId,
      quality_score: report.qualityScore,
      readability_score: report.readabilityScore,
      originality_score: report.originalityScore,
      functionality_score: report.functionalityScore,
      market_readiness_score: report.marketReadinessScore,
      issues: report.issues,
      status: report.qualityScore >= 80 ? 'passed' : 'failed',
      reviewed_at: new Date().toISOString()
    });
  }
}

export default QualityControlAgent;
