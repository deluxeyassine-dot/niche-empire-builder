/**
 * SEOOptimizer - Comprehensive SEO optimization utility
 *
 * Features:
 * - Keyword analysis and research
 * - Meta tag generation (title, description, OG, Twitter)
 * - Title optimization for search engines
 * - XML sitemap generation
 * - Schema.org structured data
 * - Competitor analysis
 * - Content SEO scoring
 * - URL optimization
 * - Internal linking suggestions
 */

import { AIHelper } from './AIHelper';
import { getGeminiService } from '../services/GeminiService';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Keyword analysis result
 */
export interface KeywordAnalysis {
  primaryKeyword: string;
  secondaryKeywords: string[];
  relatedKeywords: string[];
  longTailKeywords: string[];
  searchVolume?: {
    keyword: string;
    volume: 'low' | 'medium' | 'high';
    difficulty: 'easy' | 'medium' | 'hard';
  }[];
  suggestions: string[];
  metrics: {
    density: number;
    prominence: number;
    distribution: number;
  };
}

/**
 * Meta tags configuration
 */
export interface MetaTags {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  canonical?: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url?: string;
    image?: string;
    siteName?: string;
  };
  twitter: {
    card: 'summary' | 'summary_large_image' | 'app' | 'player';
    title: string;
    description: string;
    image?: string;
    creator?: string;
  };
  additionalTags?: Record<string, string>;
}

/**
 * Title optimization options
 */
export interface TitleOptions {
  content: string;
  primaryKeyword: string;
  brandName?: string;
  separator?: string;
  maxLength?: number;
  includeYear?: boolean;
  format?: 'default' | 'question' | 'how-to' | 'list' | 'comparison';
}

/**
 * Sitemap entry
 */
export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number; // 0.0 to 1.0
  images?: {
    url: string;
    caption?: string;
    title?: string;
  }[];
}

/**
 * Schema.org type
 */
export type SchemaType =
  | 'Product'
  | 'Article'
  | 'BlogPosting'
  | 'Organization'
  | 'LocalBusiness'
  | 'WebSite'
  | 'BreadcrumbList'
  | 'FAQ'
  | 'Review'
  | 'VideoObject';

/**
 * Schema.org structured data
 */
export interface SchemaData {
  '@context': string;
  '@type': SchemaType;
  [key: string]: any;
}

/**
 * Competitor analysis result
 */
export interface CompetitorAnalysis {
  competitor: string;
  url: string;
  keywords: string[];
  metaTitle?: string;
  metaDescription?: string;
  contentLength?: number;
  backlinks?: number;
  domainAuthority?: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

/**
 * SEO score result
 */
export interface SEOScore {
  overallScore: number; // 0-100
  category: 'poor' | 'fair' | 'good' | 'excellent';
  breakdown: {
    technical: number;
    content: number;
    keywords: number;
    readability: number;
    metadata: number;
  };
  issues: {
    critical: string[];
    warnings: string[];
    suggestions: string[];
  };
  recommendations: string[];
  passedChecks: string[];
  failedChecks: string[];
}

/**
 * Content analysis options
 */
export interface ContentAnalysisOptions {
  content: string;
  url?: string;
  targetKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  includeReadability?: boolean;
}

export class SEOOptimizer {
  private outputDir: string;

  constructor(outputDir: string = './seo-output') {
    this.outputDir = outputDir;

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Analyze keywords in content and suggest improvements
   *
   * @param content - Content to analyze
   * @param targetKeyword - Primary keyword to optimize for
   * @returns Keyword analysis with suggestions
   */
  async analyzeKeywords(
    content: string,
    targetKeyword?: string
  ): Promise<KeywordAnalysis> {
    console.log('🔍 Analyzing keywords...');

    const words = this.extractWords(content);
    const wordFrequency = this.calculateWordFrequency(words);
    const phrases = this.extractPhrases(content);

    // If no target keyword provided, use AI to suggest one
    if (!targetKeyword) {
      targetKeyword = await this.suggestPrimaryKeyword(content);
    }

    const primaryKeyword = targetKeyword;
    const secondaryKeywords = this.findSecondaryKeywords(wordFrequency, primaryKeyword);
    const longTailKeywords = this.findLongTailKeywords(phrases, primaryKeyword);

    // Use AI to find related keywords
    const relatedKeywords = await this.findRelatedKeywords(primaryKeyword);

    // Calculate metrics
    const metrics = this.calculateKeywordMetrics(content, primaryKeyword);

    // Generate suggestions
    const suggestions = this.generateKeywordSuggestions(
      content,
      primaryKeyword,
      metrics
    );

    return {
      primaryKeyword,
      secondaryKeywords: secondaryKeywords.slice(0, 5),
      relatedKeywords,
      longTailKeywords: longTailKeywords.slice(0, 5),
      suggestions,
      metrics
    };
  }

  /**
   * Generate comprehensive meta tags
   *
   * @param options - Content and configuration options
   * @returns Complete meta tags object
   */
  async generateMetaTags(options: {
    title: string;
    description: string;
    url?: string;
    image?: string;
    keywords?: string[];
    author?: string;
    siteName?: string;
    type?: string;
  }): Promise<MetaTags> {
    console.log('🏷️ Generating meta tags...');

    // Optimize title and description if needed
    const optimizedTitle = this.optimizeMetaTitle(options.title);
    const optimizedDescription = this.optimizeMetaDescription(options.description);

    const metaTags: MetaTags = {
      title: optimizedTitle,
      description: optimizedDescription,
      keywords: options.keywords,
      author: options.author,
      robots: 'index, follow',
      canonical: options.url,
      openGraph: {
        title: optimizedTitle,
        description: optimizedDescription,
        type: options.type || 'website',
        url: options.url,
        image: options.image,
        siteName: options.siteName
      },
      twitter: {
        card: options.image ? 'summary_large_image' : 'summary',
        title: optimizedTitle,
        description: optimizedDescription,
        image: options.image,
        creator: options.author
      }
    };

    return metaTags;
  }

  /**
   * Optimize page title for SEO
   *
   * @param options - Title optimization options
   * @returns Optimized title with alternatives
   */
  async optimizeTitles(options: TitleOptions): Promise<{
    primary: string;
    alternatives: string[];
    score: number;
    issues: string[];
  }> {
    console.log('📝 Optimizing title...');

    const { content, primaryKeyword, brandName, separator = '|', maxLength = 60 } = options;

    let optimizedTitle = '';

    switch (options.format) {
      case 'question':
        optimizedTitle = await this.generateQuestionTitle(primaryKeyword, content);
        break;
      case 'how-to':
        optimizedTitle = await this.generateHowToTitle(primaryKeyword, content);
        break;
      case 'list':
        optimizedTitle = await this.generateListTitle(primaryKeyword, content);
        break;
      case 'comparison':
        optimizedTitle = await this.generateComparisonTitle(primaryKeyword, content);
        break;
      default:
        optimizedTitle = await this.generateDefaultTitle(primaryKeyword, content);
    }

    // Add brand name if provided
    if (brandName && optimizedTitle.length + brandName.length + 3 < maxLength) {
      optimizedTitle = `${optimizedTitle} ${separator} ${brandName}`;
    }

    // Add year if requested
    if (options.includeYear) {
      const year = new Date().getFullYear();
      if (optimizedTitle.length + 7 < maxLength) {
        optimizedTitle = `${optimizedTitle} (${year})`;
      }
    }

    // Ensure title is within length limit
    if (optimizedTitle.length > maxLength) {
      optimizedTitle = optimizedTitle.substring(0, maxLength - 3) + '...';
    }

    // Generate alternatives
    const alternatives = await this.generateAlternativeTitles(
      primaryKeyword,
      content,
      maxLength
    );

    // Score the title
    const { score, issues } = this.scoreTitleSEO(optimizedTitle, primaryKeyword);

    return {
      primary: optimizedTitle,
      alternatives,
      score,
      issues
    };
  }

  /**
   * Create XML sitemap
   *
   * @param entries - Sitemap entries
   * @param outputPath - Optional output file path
   * @returns XML sitemap string
   */
  createSitemap(entries: SitemapEntry[], outputPath?: string): string {
    console.log(`🗺️ Creating sitemap with ${entries.length} entries...`);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    for (const entry of entries) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(entry.url)}</loc>\n`;

      if (entry.lastModified) {
        xml += `    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>\n`;
      }

      if (entry.changeFrequency) {
        xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
      }

      if (entry.priority !== undefined) {
        xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
      }

      // Add image entries if present
      if (entry.images && entry.images.length > 0) {
        for (const image of entry.images) {
          xml += '    <image:image>\n';
          xml += `      <image:loc>${this.escapeXml(image.url)}</image:loc>\n`;
          if (image.title) {
            xml += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
          }
          if (image.caption) {
            xml += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
          }
          xml += '    </image:image>\n';
        }
      }

      xml += '  </url>\n';
    }

    xml += '</urlset>';

    // Save to file if path provided
    if (outputPath) {
      const fullPath = path.join(this.outputDir, outputPath);
      fs.writeFileSync(fullPath, xml, 'utf-8');
      console.log(`✓ Sitemap saved to: ${fullPath}`);
    }

    return xml;
  }

  /**
   * Generate Schema.org structured data
   *
   * @param type - Schema type
   * @param data - Schema data
   * @returns Formatted JSON-LD schema
   */
  generateSchema(type: SchemaType, data: any): SchemaData {
    console.log(`📋 Generating ${type} schema...`);

    const schema: SchemaData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };

    // Validate and enhance based on type
    switch (type) {
      case 'Product':
        return this.enhanceProductSchema(schema);
      case 'Article':
      case 'BlogPosting':
        return this.enhanceArticleSchema(schema);
      case 'Organization':
      case 'LocalBusiness':
        return this.enhanceOrganizationSchema(schema);
      case 'BreadcrumbList':
        return this.enhanceBreadcrumbSchema(schema);
      case 'FAQ':
        return this.enhanceFAQSchema(schema);
      default:
        return schema;
    }
  }

  /**
   * Analyze competitor SEO strategies
   *
   * @param competitorUrl - Competitor URL or domain
   * @param targetKeywords - Keywords to analyze
   * @returns Competitor analysis
   */
  async analyzeCompetitors(
    competitorUrl: string,
    targetKeywords: string[]
  ): Promise<CompetitorAnalysis> {
    console.log(`🔬 Analyzing competitor: ${competitorUrl}`);

    // Note: In production, this would integrate with APIs like:
    // - Ahrefs API
    // - SEMrush API
    // - Moz API
    // - Custom web scraping

    // For now, we'll use AI to simulate analysis
    const gemini = getGeminiService();

    const analysisPrompt = `Analyze the SEO strategy for competitor: ${competitorUrl}
Target keywords: ${targetKeywords.join(', ')}

Provide analysis in the following areas:
1. Main keywords they're targeting
2. Their meta title and description strategy
3. Content strengths and weaknesses
4. SEO opportunities they're missing
5. Recommendations for outranking them

Format as JSON.`;

    const response = await gemini.generate(analysisPrompt);
    const parsed = AIHelper.parseResponse<any>(response, 'json');

    return {
      competitor: competitorUrl,
      url: competitorUrl,
      keywords: targetKeywords,
      strengths: parsed.data?.strengths || ['Strong domain authority', 'Quality content'],
      weaknesses: parsed.data?.weaknesses || ['Limited internal linking', 'Slow page speed'],
      opportunities: parsed.data?.opportunities || [
        'Target long-tail keywords',
        'Improve content depth',
        'Build more backlinks'
      ]
    };
  }

  /**
   * Score content for SEO quality
   *
   * @param options - Content analysis options
   * @returns Comprehensive SEO score
   */
  async scoreContent(options: ContentAnalysisOptions): Promise<SEOScore> {
    console.log('📊 Scoring content for SEO...');

    const { content, url, targetKeyword, metaTitle, metaDescription } = options;

    const issues: SEOScore['issues'] = {
      critical: [],
      warnings: [],
      suggestions: []
    };

    const passedChecks: string[] = [];
    const failedChecks: string[] = [];

    // Technical checks
    const technicalScore = this.scoreTechnical(content, url, issues, passedChecks, failedChecks);

    // Content checks
    const contentScore = this.scoreContentQuality(content, issues, passedChecks, failedChecks);

    // Keyword checks
    const keywordScore = targetKeyword
      ? this.scoreKeywordUsage(content, targetKeyword, issues, passedChecks, failedChecks)
      : 50;

    // Readability checks
    const readabilityScore = options.includeReadability !== false
      ? this.scoreReadability(content, issues, passedChecks, failedChecks)
      : 75;

    // Metadata checks
    const metadataScore = this.scoreMetadata(
      metaTitle,
      metaDescription,
      targetKeyword,
      issues,
      passedChecks,
      failedChecks
    );

    // Calculate overall score
    const overallScore = Math.round(
      (technicalScore * 0.2 +
        contentScore * 0.25 +
        keywordScore * 0.25 +
        readabilityScore * 0.15 +
        metadataScore * 0.15)
    );

    // Determine category
    let category: SEOScore['category'];
    if (overallScore >= 90) category = 'excellent';
    else if (overallScore >= 70) category = 'good';
    else if (overallScore >= 50) category = 'fair';
    else category = 'poor';

    // Generate recommendations
    const recommendations = this.generateRecommendations(issues, overallScore);

    return {
      overallScore,
      category,
      breakdown: {
        technical: technicalScore,
        content: contentScore,
        keywords: keywordScore,
        readability: readabilityScore,
        metadata: metadataScore
      },
      issues,
      recommendations,
      passedChecks,
      failedChecks
    };
  }

  // ==================== Helper Methods ====================

  private extractWords(content: string): string[] {
    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2); // Ignore very short words
  }

  private calculateWordFrequency(words: string[]): Map<string, number> {
    const frequency = new Map<string, number>();

    for (const word of words) {
      if (!this.isStopWord(word)) {
        frequency.set(word, (frequency.get(word) || 0) + 1);
      }
    }

    return frequency;
  }

  private extractPhrases(content: string, phraseLength: number = 3): string[] {
    const words = this.extractWords(content);
    const phrases: string[] = [];

    for (let i = 0; i <= words.length - phraseLength; i++) {
      const phrase = words.slice(i, i + phraseLength).join(' ');
      phrases.push(phrase);
    }

    return phrases;
  }

  private findSecondaryKeywords(
    frequency: Map<string, number>,
    primaryKeyword: string
  ): string[] {
    const sorted = Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .filter(([word]) => word !== primaryKeyword && word.length > 3);

    return sorted.slice(0, 10).map(([word]) => word);
  }

  private findLongTailKeywords(phrases: string[], primaryKeyword: string): string[] {
    const phraseCounts = new Map<string, number>();

    for (const phrase of phrases) {
      if (phrase.includes(primaryKeyword)) {
        phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
      }
    }

    return Array.from(phraseCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([phrase]) => phrase);
  }

  private async findRelatedKeywords(keyword: string): Promise<string[]> {
    try {
      const gemini = getGeminiService();
      const prompt = `Generate 10 SEO-related keywords for: "${keyword}". Return only the keywords as a comma-separated list, no explanations.`;

      const response = await gemini.generate(prompt);
      const keywords = response
        .split(/[,\n]/)
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 0 && k !== keyword)
        .slice(0, 10);

      return keywords;
    } catch (error) {
      console.warn('Could not generate related keywords:', error);
      return [];
    }
  }

  private async suggestPrimaryKeyword(content: string): Promise<string> {
    try {
      const gemini = getGeminiService();
      const preview = content.substring(0, 1000);
      const prompt = `Based on this content, suggest the best primary SEO keyword (2-4 words). Return only the keyword:\n\n${preview}`;

      const response = await gemini.generate(prompt);
      return response.trim().toLowerCase();
    } catch (error) {
      console.warn('Could not suggest primary keyword:', error);
      return 'content';
    }
  }

  private calculateKeywordMetrics(content: string, keyword: string): {
    density: number;
    prominence: number;
    distribution: number;
  } {
    const lowerContent = content.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();

    // Density: percentage of keyword occurrences
    const words = this.extractWords(content);
    const keywordCount = lowerContent.split(lowerKeyword).length - 1;
    const density = (keywordCount / words.length) * 100;

    // Prominence: how early the keyword appears
    const firstOccurrence = lowerContent.indexOf(lowerKeyword);
    const prominence = firstOccurrence === -1 ? 0 : (1 - (firstOccurrence / lowerContent.length)) * 100;

    // Distribution: how evenly distributed the keyword is
    const contentLength = content.length;
    const sections = 10;
    const sectionLength = contentLength / sections;
    let sectionsWithKeyword = 0;

    for (let i = 0; i < sections; i++) {
      const start = Math.floor(i * sectionLength);
      const end = Math.floor((i + 1) * sectionLength);
      const section = lowerContent.substring(start, end);

      if (section.includes(lowerKeyword)) {
        sectionsWithKeyword++;
      }
    }

    const distribution = (sectionsWithKeyword / sections) * 100;

    return {
      density: Math.round(density * 100) / 100,
      prominence: Math.round(prominence),
      distribution: Math.round(distribution)
    };
  }

  private generateKeywordSuggestions(
    content: string,
    keyword: string,
    metrics: any
  ): string[] {
    const suggestions: string[] = [];

    if (metrics.density < 0.5) {
      suggestions.push(`Increase keyword density (currently ${metrics.density}%, aim for 1-2%)`);
    } else if (metrics.density > 3) {
      suggestions.push(`Reduce keyword density (currently ${metrics.density}%, avoid keyword stuffing)`);
    }

    if (metrics.prominence < 20) {
      suggestions.push('Include primary keyword earlier in the content (first 100 words)');
    }

    if (metrics.distribution < 50) {
      suggestions.push('Distribute keyword more evenly throughout content');
    }

    if (!content.toLowerCase().includes(keyword)) {
      suggestions.push('Add primary keyword to content');
    }

    return suggestions;
  }

  private optimizeMetaTitle(title: string, maxLength: number = 60): string {
    if (title.length <= maxLength) {
      return title;
    }

    // Try to cut at a word boundary
    const shortened = title.substring(0, maxLength - 3);
    const lastSpace = shortened.lastIndexOf(' ');

    if (lastSpace > maxLength * 0.8) {
      return shortened.substring(0, lastSpace) + '...';
    }

    return shortened + '...';
  }

  private optimizeMetaDescription(description: string, maxLength: number = 160): string {
    if (description.length <= maxLength) {
      return description;
    }

    const shortened = description.substring(0, maxLength - 3);
    const lastSpace = shortened.lastIndexOf(' ');
    const lastPeriod = shortened.lastIndexOf('.');

    // Prefer ending at a sentence
    if (lastPeriod > maxLength * 0.7) {
      return shortened.substring(0, lastPeriod + 1);
    }

    // Otherwise, end at a word
    if (lastSpace > maxLength * 0.8) {
      return shortened.substring(0, lastSpace) + '...';
    }

    return shortened + '...';
  }

  private async generateDefaultTitle(keyword: string, content: string): Promise<string> {
    const preview = content.substring(0, 200);
    return `${this.capitalizeWords(keyword)} - Complete Guide`;
  }

  private async generateQuestionTitle(keyword: string, content: string): Promise<string> {
    return `What is ${this.capitalizeWords(keyword)}? Complete Answer`;
  }

  private async generateHowToTitle(keyword: string, content: string): Promise<string> {
    return `How to ${this.capitalizeWords(keyword)} - Step by Step Guide`;
  }

  private async generateListTitle(keyword: string, content: string): Promise<string> {
    return `10 Best ${this.capitalizeWords(keyword)} Tips & Tricks`;
  }

  private async generateComparisonTitle(keyword: string, content: string): Promise<string> {
    return `${this.capitalizeWords(keyword)} Comparison - Which is Best?`;
  }

  private async generateAlternativeTitles(
    keyword: string,
    content: string,
    maxLength: number
  ): Promise<string[]> {
    const alternatives: string[] = [
      `${this.capitalizeWords(keyword)}: Everything You Need to Know`,
      `Ultimate ${this.capitalizeWords(keyword)} Guide`,
      `${this.capitalizeWords(keyword)} Explained Simply`,
      `Master ${this.capitalizeWords(keyword)} in Minutes`,
      `The Complete ${this.capitalizeWords(keyword)} Resource`
    ];

    return alternatives
      .filter(title => title.length <= maxLength)
      .slice(0, 3);
  }

  private scoreTitleSEO(title: string, keyword: string): { score: number; issues: string[] } {
    let score = 100;
    const issues: string[] = [];

    if (title.length < 30) {
      score -= 20;
      issues.push('Title is too short (minimum 30 characters recommended)');
    }

    if (title.length > 60) {
      score -= 15;
      issues.push('Title is too long (maximum 60 characters recommended)');
    }

    if (!title.toLowerCase().includes(keyword.toLowerCase())) {
      score -= 30;
      issues.push('Title does not include primary keyword');
    }

    if (title.toLowerCase().indexOf(keyword.toLowerCase()) > 20) {
      score -= 10;
      issues.push('Primary keyword should appear earlier in title');
    }

    return { score: Math.max(0, score), issues };
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private enhanceProductSchema(schema: SchemaData): SchemaData {
    // Ensure required Product fields
    if (!schema.name) {
      console.warn('Product schema missing required "name" field');
    }

    if (!schema.image) {
      console.warn('Product schema missing recommended "image" field');
    }

    if (!schema.offers) {
      console.warn('Product schema missing recommended "offers" field');
    }

    return schema;
  }

  private enhanceArticleSchema(schema: SchemaData): SchemaData {
    // Add article defaults
    if (!schema.datePublished) {
      schema.datePublished = new Date().toISOString();
    }

    if (!schema.dateModified) {
      schema.dateModified = schema.datePublished;
    }

    return schema;
  }

  private enhanceOrganizationSchema(schema: SchemaData): SchemaData {
    // Ensure organization has required fields
    if (!schema.name) {
      console.warn('Organization schema missing required "name" field');
    }

    return schema;
  }

  private enhanceBreadcrumbSchema(schema: SchemaData): SchemaData {
    // Validate breadcrumb list structure
    if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
      console.warn('BreadcrumbList schema requires "itemListElement" array');
    }

    return schema;
  }

  private enhanceFAQSchema(schema: SchemaData): SchemaData {
    // Validate FAQ structure
    if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
      console.warn('FAQ schema requires "mainEntity" array');
    }

    return schema;
  }

  private scoreTechnical(
    content: string,
    url: string | undefined,
    issues: SEOScore['issues'],
    passed: string[],
    failed: string[]
  ): number {
    let score = 100;

    // URL checks
    if (url) {
      if (url.length > 100) {
        score -= 10;
        issues.warnings.push('URL is too long (keep under 100 characters)');
        failed.push('URL length check');
      } else {
        passed.push('URL length is optimal');
      }

      if (!/^[a-z0-9-/:.]+$/.test(url.toLowerCase())) {
        score -= 5;
        issues.suggestions.push('Use only lowercase letters, numbers, and hyphens in URLs');
      }
    }

    // Content length
    const wordCount = this.extractWords(content).length;
    if (wordCount < 300) {
      score -= 20;
      issues.critical.push('Content is too short (minimum 300 words recommended)');
      failed.push('Minimum word count');
    } else if (wordCount < 600) {
      score -= 10;
      issues.warnings.push('Content could be more comprehensive (600+ words recommended)');
      failed.push('Recommended word count');
    } else {
      passed.push('Content length is sufficient');
    }

    return Math.max(0, score);
  }

  private scoreContentQuality(
    content: string,
    issues: SEOScore['issues'],
    passed: string[],
    failed: string[]
  ): number {
    let score = 100;

    // Check for headings
    const hasHeadings = /<h[1-6]>/i.test(content) || /^#{1,6}\s/m.test(content);
    if (!hasHeadings) {
      score -= 15;
      issues.warnings.push('Add headings (H1, H2, H3) to structure content');
      failed.push('Heading structure');
    } else {
      passed.push('Content includes headings');
    }

    // Check for lists
    const hasLists = /<[ou]l>/i.test(content) || /^[\*\-\+]\s/m.test(content);
    if (hasLists) {
      passed.push('Content includes lists');
    } else {
      score -= 5;
      issues.suggestions.push('Consider adding bulleted or numbered lists');
    }

    // Check for links
    const hasLinks = /<a\s+href=/i.test(content) || /\[.*\]\(.*\)/.test(content);
    if (!hasLinks) {
      score -= 10;
      issues.warnings.push('Add internal and external links');
      failed.push('Internal/external links');
    } else {
      passed.push('Content includes links');
    }

    return Math.max(0, score);
  }

  private scoreKeywordUsage(
    content: string,
    keyword: string,
    issues: SEOScore['issues'],
    passed: string[],
    failed: string[]
  ): number {
    const metrics = this.calculateKeywordMetrics(content, keyword);
    let score = 100;

    // Keyword density
    if (metrics.density < 0.5) {
      score -= 20;
      issues.warnings.push(`Increase keyword usage (current density: ${metrics.density}%)`);
      failed.push('Keyword density');
    } else if (metrics.density > 3) {
      score -= 15;
      issues.critical.push(`Reduce keyword stuffing (current density: ${metrics.density}%)`);
      failed.push('Keyword density (too high)');
    } else {
      passed.push('Keyword density is optimal');
    }

    // Keyword prominence
    if (metrics.prominence < 20) {
      score -= 15;
      issues.warnings.push('Include primary keyword earlier in content');
      failed.push('Keyword prominence');
    } else {
      passed.push('Keyword appears early in content');
    }

    // Keyword distribution
    if (metrics.distribution < 40) {
      score -= 10;
      issues.suggestions.push('Distribute keyword more evenly throughout content');
    } else {
      passed.push('Keyword is well-distributed');
    }

    return Math.max(0, score);
  }

  private scoreReadability(
    content: string,
    issues: SEOScore['issues'],
    passed: string[],
    failed: string[]
  ): number {
    let score = 100;

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = this.extractWords(content);
    const avgWordsPerSentence = words.length / sentences.length;

    // Sentence length
    if (avgWordsPerSentence > 25) {
      score -= 15;
      issues.warnings.push('Shorten sentences for better readability');
      failed.push('Sentence length');
    } else {
      passed.push('Sentence length is readable');
    }

    // Paragraph length (approximate)
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    const avgWordsPerParagraph = words.length / paragraphs.length;

    if (avgWordsPerParagraph > 150) {
      score -= 10;
      issues.suggestions.push('Break up long paragraphs (max 150 words per paragraph)');
    } else {
      passed.push('Paragraph length is appropriate');
    }

    return Math.max(0, score);
  }

  private scoreMetadata(
    metaTitle: string | undefined,
    metaDescription: string | undefined,
    targetKeyword: string | undefined,
    issues: SEOScore['issues'],
    passed: string[],
    failed: string[]
  ): number {
    let score = 100;

    // Meta title
    if (!metaTitle) {
      score -= 30;
      issues.critical.push('Meta title is missing');
      failed.push('Meta title exists');
    } else {
      if (metaTitle.length < 30 || metaTitle.length > 60) {
        score -= 15;
        issues.warnings.push('Meta title should be 30-60 characters');
        failed.push('Meta title length');
      } else {
        passed.push('Meta title length is optimal');
      }

      if (targetKeyword && !metaTitle.toLowerCase().includes(targetKeyword.toLowerCase())) {
        score -= 10;
        issues.warnings.push('Include primary keyword in meta title');
        failed.push('Keyword in meta title');
      } else if (targetKeyword) {
        passed.push('Meta title includes primary keyword');
      }
    }

    // Meta description
    if (!metaDescription) {
      score -= 25;
      issues.critical.push('Meta description is missing');
      failed.push('Meta description exists');
    } else {
      if (metaDescription.length < 120 || metaDescription.length > 160) {
        score -= 10;
        issues.warnings.push('Meta description should be 120-160 characters');
        failed.push('Meta description length');
      } else {
        passed.push('Meta description length is optimal');
      }

      if (targetKeyword && !metaDescription.toLowerCase().includes(targetKeyword.toLowerCase())) {
        score -= 10;
        issues.suggestions.push('Consider including primary keyword in meta description');
      }
    }

    return Math.max(0, score);
  }

  private generateRecommendations(issues: SEOScore['issues'], score: number): string[] {
    const recommendations: string[] = [];

    if (score < 50) {
      recommendations.push('Focus on critical issues first - these have the biggest SEO impact');
    }

    if (issues.critical.length > 0) {
      recommendations.push('Address critical SEO issues immediately');
      recommendations.push(...issues.critical.slice(0, 3));
    }

    if (issues.warnings.length > 0) {
      recommendations.push('Fix warning-level issues to improve rankings');
      recommendations.push(...issues.warnings.slice(0, 2));
    }

    if (score >= 70) {
      recommendations.push('Great SEO foundation! Focus on building quality backlinks');
      recommendations.push('Continue creating high-quality, valuable content');
    }

    return recommendations.slice(0, 5);
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'
    ]);

    return stopWords.has(word);
  }

  private capitalizeWords(str: string): string {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

/**
 * Export singleton instance getter
 */
let seoOptimizerInstance: SEOOptimizer | null = null;

export function getSEOOptimizer(outputDir?: string): SEOOptimizer {
  if (!seoOptimizerInstance) {
    seoOptimizerInstance = new SEOOptimizer(outputDir);
  }
  return seoOptimizerInstance;
}
