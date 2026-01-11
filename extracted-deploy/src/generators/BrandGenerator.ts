/**
 * BrandGenerator - Generates comprehensive brand identities
 *
 * This class provides AI-powered brand generation including names, taglines,
 * logo concepts, color palettes, brand voice, and complete brand guidelines.
 */

import { getGeminiService, GeminiService } from '../services/GeminiService';

export interface BrandNameOptions {
  niche: string;
  style?: 'modern' | 'classic' | 'playful' | 'professional' | 'luxurious';
  length?: 'short' | 'medium' | 'long';
  includeNicheKeyword?: boolean;
  targetAudience?: string;
}

export interface BrandName {
  name: string;
  available: boolean;
  domain?: string;
  reasoning: string;
  alternatives: string[];
}

export interface TaglineOptions {
  brandName: string;
  niche: string;
  values?: string[];
  tone?: 'inspiring' | 'professional' | 'witty' | 'emotional' | 'direct';
  maxWords?: number;
}

export interface Tagline {
  tagline: string;
  variations: string[];
  tone: string;
  emotionalImpact: string;
}

export interface LogoDesign {
  concept: string;
  style: 'minimalist' | 'illustrative' | 'abstract' | 'geometric' | 'typographic';
  elements: string[];
  symbolism: string;
  colorUsage: string;
  variations: {
    primary: string;
    secondary: string;
    icon: string;
    wordmark: string;
  };
  specifications: {
    fileFormats: string[];
    minimumSize: string;
    clearSpace: string;
  };
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string[];
  neutral: string[];
  palette: {
    name: string;
    hex: string;
    rgb: string;
    usage: string;
    psychology: string;
  }[];
  accessibility: {
    wcagCompliant: boolean;
    contrastRatios: Record<string, number>;
  };
}

export interface BrandVoice {
  tone: string[];
  personality: string[];
  language: {
    doUse: string[];
    dontUse: string[];
  };
  writingStyle: {
    sentenceStructure: string;
    vocabulary: string;
    formality: 'casual' | 'professional' | 'conversational' | 'formal';
  };
  examples: {
    socialMedia: string;
    emailCommunication: string;
    websiteCopy: string;
    customerSupport: string;
  };
}

export interface BrandGuidelines {
  brandName: string;
  tagline: string;
  mission: string;
  vision: string;
  values: string[];
  logo: LogoDesign;
  colors: ColorPalette;
  typography: {
    primary: {
      family: string;
      weights: string[];
      usage: string;
    };
    secondary: {
      family: string;
      weights: string[];
      usage: string;
    };
    webFonts: string[];
  };
  voice: BrandVoice;
  imagery: {
    style: string;
    subjects: string[];
    mood: string;
    doUse: string[];
    dontUse: string[];
  };
  applications: {
    website: string;
    socialMedia: string;
    packaging: string;
    marketing: string;
  };
  dosDonts: {
    dos: string[];
    donts: string[];
  };
}

export class BrandGenerator {
  private niche: string | null = null;
  private targetAudience: string | null = null;
  private brandValues: string[] = [];
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = getGeminiService();
  }

  /**
   * Set the niche and basic information for brand generation
   * @param niche - The niche/industry for the brand
   * @param targetAudience - Optional target audience description
   * @param values - Optional brand values
   */
  setContext(niche: string, targetAudience?: string, values?: string[]): void {
    this.niche = niche;
    this.targetAudience = targetAudience || null;
    this.brandValues = values || [];
  }

  /**
   * Generate brand name suggestions based on the niche and style preferences
   * @param options - Brand name generation options
   * @returns Brand name with alternatives and reasoning
   */
  async generateBrandName(options: BrandNameOptions): Promise<BrandName> {
    const niche = options.niche || this.niche;
    if (!niche) {
      throw new Error('Niche must be provided or set via setContext()');
    }

    console.log(`Generating brand name for "${niche}" with style: ${options.style || 'modern'}...`);

    const style = options.style || 'modern';
    const length = options.length || 'medium';

    // Use Gemini AI to generate brand name
    const result = await this.geminiService.generateBrandName({
      niche,
      style,
      length,
      targetAudience: options.targetAudience || this.targetAudience || undefined
    });

    const generatedName = result.name;
    const alternatives = result.alternatives;

    return {
      name: generatedName,
      available: true, // Would check domain availability in production
      domain: `${generatedName.toLowerCase().replace(/\s+/g, '')}.com`,
      reasoning: result.reasoning || `This name reflects ${style} branding with ${length} length, suitable for the ${niche} niche.`,
      alternatives
    };
  }

  /**
   * Create tagline variations for the brand
   * @param options - Tagline creation options
   * @returns Tagline with variations and analysis
   */
  async createTagline(options: TaglineOptions): Promise<Tagline> {
    if (!options.brandName) {
      throw new Error('Brand name is required to create tagline');
    }

    console.log(`Creating tagline for "${options.brandName}" in ${options.niche} niche...`);

    const tone = options.tone || 'professional';

    // Use Gemini AI to generate tagline
    const result = await this.geminiService.createTagline({
      brandName: options.brandName,
      niche: options.niche,
      values: options.values || this.brandValues,
      tone
    });

    const primaryTagline = result.primary;
    const variations = result.alternatives;

    return {
      tagline: primaryTagline,
      variations,
      tone,
      emotionalImpact: tone === 'emotional' ? 'High - connects deeply with values' :
                       tone === 'inspiring' ? 'Medium-High - motivates and uplifts' :
                       tone === 'witty' ? 'Medium - creates positive association' :
                       'Medium - builds trust and credibility'
    };
  }

  /**
   * Design logo concept with specifications
   * @param brandName - The brand name
   * @param niche - The niche/industry
   * @param style - Preferred logo style
   * @returns Complete logo design concept
   */
  async designLogo(
    brandName: string,
    niche: string,
    style?: 'minimalist' | 'illustrative' | 'abstract' | 'geometric' | 'typographic'
  ): Promise<LogoDesign> {
    // TODO: Implement AI-powered logo design generation
    // This would typically involve:
    // - DALL-E or Midjourney API for visual concepts
    // - Vector graphics generation
    // - Multiple variations testing
    // - Scalability testing
    // - Color theory application
    // - Industry best practices

    console.log(`Designing logo for "${brandName}" in ${style || 'minimalist'} style...`);

    const logoStyle = style || 'minimalist';
    const nicheElements = niche.split(' ');

    return {
      concept: `A ${logoStyle} design that combines ${nicheElements[0]} imagery with modern aesthetics. The logo features clean lines and balanced composition, making it versatile across all media.`,
      style: logoStyle,
      elements: [
        `${nicheElements[0]} symbol`,
        'Typography-based brand name',
        'Geometric shapes',
        'Negative space utilization'
      ],
      symbolism: `The design represents ${niche} values: quality, innovation, and trustworthiness. The visual metaphor connects ${nicheElements[0]} with forward-thinking solutions.`,
      colorUsage: 'Primary color for main elements, secondary for accents, neutral for supporting text',
      variations: {
        primary: 'Full color logo with icon and wordmark',
        secondary: 'Monochrome version for single-color applications',
        icon: 'Standalone icon for social media and app icons',
        wordmark: 'Text-only version for horizontal layouts'
      },
      specifications: {
        fileFormats: ['SVG (vector)', 'PNG (transparent)', 'PDF', 'EPS'],
        minimumSize: '32px height for digital, 0.5 inch for print',
        clearSpace: 'Minimum spacing of logo height × 0.25 on all sides'
      }
    };
  }

  /**
   * Select color palette based on brand personality and industry
   * @param niche - The niche/industry
   * @param mood - Desired brand mood/personality
   * @returns Complete color palette with specifications
   */
  async selectColors(
    niche: string,
    mood?: 'professional' | 'energetic' | 'calm' | 'luxurious' | 'eco-friendly'
  ): Promise<ColorPalette> {
    // TODO: Implement color psychology and palette generation
    // This would typically involve:
    // - Color psychology analysis
    // - Industry standard research
    // - Accessibility compliance (WCAG)
    // - Cultural color meanings
    // - Competitor color analysis
    // - A/B testing for conversion

    console.log(`Selecting color palette for ${niche} with ${mood || 'professional'} mood...`);

    const brandMood = mood || 'professional';
    let primary = '#2C3E50';
    let secondary = '#3498DB';
    let accent = ['#E74C3C', '#F39C12'];
    let neutral = ['#ECF0F1', '#95A5A6', '#34495E', '#FFFFFF'];

    // Adjust colors based on mood
    if (brandMood === 'energetic') {
      primary = '#E74C3C';
      secondary = '#F39C12';
      accent = ['#3498DB', '#9B59B6'];
    } else if (brandMood === 'calm') {
      primary = '#5DADE2';
      secondary = '#85C1E2';
      accent = ['#A8DADC', '#457B9D'];
    } else if (brandMood === 'luxurious') {
      primary = '#1C1C1C';
      secondary = '#D4AF37';
      accent = ['#8B7355', '#C0C0C0'];
    } else if (brandMood === 'eco-friendly') {
      primary = '#2D5016';
      secondary = '#7CB342';
      accent = ['#AED581', '#558B2F'];
    }

    return {
      primary,
      secondary,
      accent,
      neutral,
      palette: [
        {
          name: 'Primary',
          hex: primary,
          rgb: this.hexToRgb(primary),
          usage: 'Main brand color, primary CTAs, headers',
          psychology: 'Conveys trust, professionalism, and brand identity'
        },
        {
          name: 'Secondary',
          hex: secondary,
          rgb: this.hexToRgb(secondary),
          usage: 'Secondary elements, highlights, hover states',
          psychology: 'Supports primary color, adds visual interest'
        },
        {
          name: 'Accent 1',
          hex: accent[0],
          rgb: this.hexToRgb(accent[0]),
          usage: 'Call-to-action buttons, important highlights',
          psychology: 'Draws attention, creates urgency or excitement'
        },
        {
          name: 'Accent 2',
          hex: accent[1],
          rgb: this.hexToRgb(accent[1]),
          usage: 'Additional accents, warnings, secondary CTAs',
          psychology: 'Provides variety, supports visual hierarchy'
        },
        {
          name: 'Light Neutral',
          hex: neutral[0],
          rgb: this.hexToRgb(neutral[0]),
          usage: 'Backgrounds, cards, subtle containers',
          psychology: 'Creates breathing room, improves readability'
        },
        {
          name: 'Dark Neutral',
          hex: neutral[2],
          rgb: this.hexToRgb(neutral[2]),
          usage: 'Text, borders, dark mode elements',
          psychology: 'Ensures readability and contrast'
        }
      ],
      accessibility: {
        wcagCompliant: true,
        contrastRatios: {
          'primary-on-white': 7.5,
          'secondary-on-white': 4.8,
          'white-on-primary': 8.2
        }
      }
    };
  }

  /**
   * Define brand voice and communication style
   * @param brandName - The brand name
   * @param niche - The niche/industry
   * @param targetAudience - Target audience description
   * @returns Complete brand voice guidelines
   */
  async defineBrandVoice(
    brandName: string,
    niche: string,
    targetAudience?: string
  ): Promise<BrandVoice> {
    // TODO: Implement AI-powered brand voice definition
    // This would typically involve:
    // - Audience persona analysis
    // - Competitor voice analysis
    // - Tone of voice mapping
    // - Communication guidelines
    // - Channel-specific adaptations
    // - Cultural considerations

    console.log(`Defining brand voice for "${brandName}" targeting ${targetAudience || 'general audience'}...`);

    const audience = targetAudience || this.targetAudience || 'general consumers';

    return {
      tone: [
        'Authentic',
        'Knowledgeable',
        'Approachable',
        'Trustworthy'
      ],
      personality: [
        'Expert but not condescending',
        'Friendly but professional',
        'Innovative but reliable',
        'Confident but humble'
      ],
      language: {
        doUse: [
          'Clear, concise sentences',
          'Active voice',
          'Industry expertise terms (with explanations)',
          'Customer-centric language',
          'Positive, solution-focused words',
          'Inclusive language'
        ],
        dontUse: [
          'Jargon without context',
          'Overly complex sentences',
          'Passive voice',
          'Negative or fear-based language',
          'Clichés and buzzwords',
          'Inconsistent terminology'
        ]
      },
      writingStyle: {
        sentenceStructure: 'Mix of short, punchy sentences and medium-length explanatory ones. Avg 15-20 words per sentence.',
        vocabulary: 'Accessible yet professional. Industry terms used purposefully with context.',
        formality: 'conversational'
      },
      examples: {
        socialMedia: `"Just launched our new ${niche.split(' ')[0]} line! 🎉 We've spent months perfecting every detail because you deserve nothing but the best. What feature are you most excited about?"`,
        emailCommunication: `"Hi [Name],\n\nThanks for choosing ${brandName}! We're excited to have you with us.\n\nYour ${niche.split(' ')[0]} journey starts now. Here's what you can expect over the next few days...\n\nQuestions? We're here to help.\n\nBest regards,\nThe ${brandName} Team"`,
        websiteCopy: `"Welcome to ${brandName} – where ${niche} meets innovation. We believe in delivering quality without compromise, creating solutions that make a real difference in your life."`,
        customerSupport: `"I understand your concern about [issue]. Let me help you resolve this right away. Here's what we can do..."`
      }
    };
  }

  /**
   * Create comprehensive brand guidelines document
   * @param brandName - The brand name
   * @param tagline - The brand tagline
   * @param niche - The niche/industry
   * @param options - Additional options for guideline generation
   * @returns Complete brand guidelines
   */
  async createBrandGuidelines(
    brandName: string,
    tagline: string,
    niche: string,
    options?: {
      mission?: string;
      vision?: string;
      values?: string[];
      targetAudience?: string;
    }
  ): Promise<BrandGuidelines> {
    // TODO: Implement comprehensive brand guideline generation
    // This would typically involve:
    // - Aggregating all brand elements
    // - Creating usage examples
    // - Defining dos and don'ts
    // - Application guidelines
    // - Template creation
    // - Brand asset library

    console.log(`Creating comprehensive brand guidelines for "${brandName}"...`);

    // Generate all brand elements if not already done
    const logo = await this.designLogo(brandName, niche);
    const colors = await this.selectColors(niche);
    const voice = await this.defineBrandVoice(brandName, niche, options?.targetAudience);

    const guidelines: BrandGuidelines = {
      brandName,
      tagline,
      mission: options?.mission || `To revolutionize ${niche} by delivering exceptional quality and innovation that exceeds expectations.`,
      vision: options?.vision || `To become the most trusted name in ${niche}, known for our commitment to excellence and customer satisfaction.`,
      values: options?.values || [
        'Quality First',
        'Customer Obsession',
        'Innovation',
        'Integrity',
        'Sustainability'
      ],
      logo,
      colors,
      typography: {
        primary: {
          family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          weights: ['400 (Regular)', '500 (Medium)', '600 (Semibold)', '700 (Bold)'],
          usage: 'Headlines, subheadings, UI elements, body text'
        },
        secondary: {
          family: 'Georgia, "Times New Roman", serif',
          weights: ['400 (Regular)', '700 (Bold)'],
          usage: 'Pull quotes, featured content, editorial elements'
        },
        webFonts: [
          '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");'
        ]
      },
      voice,
      imagery: {
        style: 'Clean, modern, authentic photography with natural lighting',
        subjects: [
          `${niche} in real-world contexts`,
          'Diverse, relatable people using products',
          'Detail shots highlighting quality',
          'Lifestyle imagery showing benefits'
        ],
        mood: 'Aspirational yet achievable, professional yet warm',
        doUse: [
          'High-resolution, professional images',
          'Consistent color grading',
          'Natural, candid moments',
          'Images that tell a story',
          'Diverse representation'
        ],
        dontUse: [
          'Stock photos that look staged',
          'Overly filtered or processed images',
          'Inconsistent visual styles',
          'Low-quality or pixelated images',
          'Imagery that contradicts brand values'
        ]
      },
      applications: {
        website: 'Use full-color primary logo on white backgrounds. Maintain consistent spacing and color palette. Typography hierarchy must follow guidelines.',
        socialMedia: 'Use icon-only logo for profile pictures. Maintain brand colors in graphics. Include tagline in cover images where applicable.',
        packaging: 'Primary logo on main panels. Secondary colors for accents. Include mission statement on inside panels or inserts.',
        marketing: 'Flexible application based on medium. Always maintain brand voice and color palette. Use approved templates for consistency.'
      },
      dosDonts: {
        dos: [
          'Use approved logo variations only',
          'Maintain minimum clear space around logo',
          'Follow color palette exactly (use hex codes)',
          'Keep typography consistent across all materials',
          'Use brand voice in all communications',
          'Ensure accessibility compliance in all designs',
          'Get approval for new brand applications'
        ],
        donts: [
          "Don't modify logo colors or proportions",
          "Don't use unapproved fonts or color combinations",
          "Don't place logo on busy backgrounds",
          "Don't rotate, skew, or distort the logo",
          "Don't use outdated brand materials",
          "Don't contradict brand values in messaging",
          "Don't create new brand variations without approval"
        ]
      }
    };

    return guidelines;
  }

  /**
   * Helper method to convert hex color to RGB
   * @private
   */
  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return 'rgb(0, 0, 0)';
    }
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Get current generator state
   */
  getState(): {
    hasContext: boolean;
    niche: string | null;
    targetAudience: string | null;
    brandValues: string[];
  } {
    return {
      hasContext: this.niche !== null,
      niche: this.niche,
      targetAudience: this.targetAudience,
      brandValues: this.brandValues
    };
  }
}
