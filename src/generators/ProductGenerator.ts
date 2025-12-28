/**
 * ProductGenerator - Generates comprehensive product specifications and assets
 *
 * This class provides AI-powered product generation including ideation, specifications,
 * features, pricing strategies, descriptions, and product imagery.
 */

import { getGeminiService, GeminiService } from '../services/GeminiService';

export interface ProductIdeaOptions {
  niche: string;
  targetAudience?: string;
  priceRange?: 'budget' | 'mid-range' | 'premium' | 'luxury';
  count?: number;
  marketGaps?: string[];
  trends?: string[];
}

export interface ProductIdea {
  name: string;
  category: string;
  description: string;
  targetMarket: string;
  uniqueSellingPoints: string[];
  marketPotential: 'Low' | 'Medium' | 'High' | 'Very High';
  competitionLevel: 'Low' | 'Medium' | 'High';
  estimatedDemand: string;
  developmentComplexity: 'Low' | 'Medium' | 'High';
}

export interface ProductSpecsOptions {
  productName: string;
  category: string;
  targetUse: string;
  qualityLevel?: 'standard' | 'premium' | 'luxury';
}

export interface ProductSpecs {
  productName: string;
  category: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
    weight: string;
  };
  materials: string[];
  colors: string[];
  variants: {
    name: string;
    sku: string;
    specifications: Record<string, string>;
  }[];
  technical: {
    [key: string]: string;
  };
  certifications: string[];
  warranty: string;
  packaging: {
    type: string;
    dimensions: string;
    materials: string[];
    sustainable: boolean;
  };
  manufacturing: {
    origin: string;
    leadTime: string;
    moq: number;
  };
}

export interface FeatureDefinition {
  name: string;
  description: string;
  benefit: string;
  priority: 'must-have' | 'should-have' | 'nice-to-have';
  category: 'functionality' | 'design' | 'quality' | 'convenience' | 'sustainability';
  differentiator: boolean;
}

export interface PricingStrategy {
  basePrice: number;
  currency: string;
  strategy: 'cost-plus' | 'value-based' | 'competition-based' | 'penetration' | 'skimming';
  breakdown: {
    cogs: number;
    margin: number;
    marginPercentage: number;
  };
  tiers?: {
    name: string;
    price: number;
    description: string;
    features: string[];
  }[];
  discounts: {
    type: string;
    amount: number;
    conditions: string;
  }[];
  competitorComparison: {
    low: number;
    average: number;
    high: number;
    yourPrice: number;
    positioning: string;
  };
  recommendations: string[];
}

export interface ProductDescription {
  short: string;
  long: string;
  tagline: string;
  keyBenefits: string[];
  features: string[];
  specifications: string;
  useCases: string[];
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
    slug: string;
  };
  marketingCopy: {
    headline: string;
    subheadline: string;
    callToAction: string;
    socialMediaPost: string;
    emailCampaign: string;
  };
}

export interface ProductImage {
  type: 'hero' | 'lifestyle' | 'detail' | 'packaging' | '360-view' | 'comparison' | 'infographic';
  concept: string;
  setting: string;
  lighting: string;
  angle: string;
  props: string[];
  colorScheme: string[];
  mood: string;
  specifications: {
    resolution: string;
    aspectRatio: string;
    fileFormat: string[];
  };
  aiPrompt: string;
  usage: string;
}

export interface ProductImageSet {
  hero: ProductImage;
  lifestyle: ProductImage[];
  details: ProductImage[];
  packaging: ProductImage;
  additional: ProductImage[];
  guidelines: {
    style: string;
    consistency: string[];
    editing: string[];
    formats: string[];
  };
}

export class ProductGenerator {
  private niche: string | null = null;
  private brandName: string | null = null;
  private brandColors: string[] = [];
  private targetAudience: string | null = null;
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = getGeminiService();
  }

  /**
   * Set context for product generation
   * @param niche - The niche/industry
   * @param brandName - Optional brand name for product branding
   * @param brandColors - Optional brand colors for product design
   * @param targetAudience - Optional target audience description
   */
  setContext(
    niche: string,
    brandName?: string,
    brandColors?: string[],
    targetAudience?: string
  ): void {
    this.niche = niche;
    this.brandName = brandName || null;
    this.brandColors = brandColors || [];
    this.targetAudience = targetAudience || null;
  }

  /**
   * Generate product ideas based on market analysis
   * @param options - Product idea generation options
   * @returns Array of product ideas with market analysis
   */
  async generateProductIdeas(options: ProductIdeaOptions): Promise<ProductIdea[]> {
    const niche = options.niche || this.niche;
    if (!niche) {
      throw new Error('Niche must be provided or set via setContext()');
    }

    // TODO: Implement AI-powered product ideation
    // This would typically involve:
    // - Market trend analysis
    // - Competitor product analysis
    // - Customer pain point identification
    // - Innovation opportunities
    // - GPT/Claude for creative ideation
    // - Market validation data
    // - Amazon/e-commerce bestseller analysis

    console.log(`Generating ${options.count || 5} product ideas for "${niche}"...`);

    const count = options.count || 5;
    const priceRange = options.priceRange || 'mid-range';
    const ideas: ProductIdea[] = [];

    // Generate diverse product ideas
    const productCategories = [
      'Essential',
      'Premium',
      'Starter',
      'Professional',
      'Deluxe'
    ];

    for (let i = 0; i < count; i++) {
      const category = productCategories[i % productCategories.length];

      ideas.push({
        name: `${category} ${niche.split(' ')[0]} ${i % 2 === 0 ? 'Kit' : 'System'}`,
        category: niche.split(' ')[0],
        description: `A ${priceRange} ${niche} solution designed for ${options.targetAudience || 'discerning customers'} who value quality and performance.`,
        targetMarket: options.targetAudience || `${niche} enthusiasts and professionals`,
        uniqueSellingPoints: [
          `Premium quality ${niche.split(' ')[0]} materials`,
          'Innovative design for maximum efficiency',
          'Eco-friendly and sustainable production',
          'Backed by satisfaction guarantee',
          'Expert-designed for optimal results'
        ],
        marketPotential: i < 2 ? 'Very High' : i < 4 ? 'High' : 'Medium',
        competitionLevel: priceRange === 'budget' ? 'High' : priceRange === 'premium' ? 'Medium' : 'Low',
        estimatedDemand: `${1000 + (i * 500)}-${2000 + (i * 1000)} units/month`,
        developmentComplexity: priceRange === 'luxury' ? 'High' : priceRange === 'premium' ? 'Medium' : 'Low'
      });
    }

    return ideas;
  }

  /**
   * Create detailed product specifications
   * @param options - Product specification options
   * @returns Complete product specifications
   */
  async createProductSpecs(options: ProductSpecsOptions): Promise<ProductSpecs> {
    // TODO: Implement comprehensive specification generation
    // This would typically involve:
    // - Industry standard research
    // - Competitor spec analysis
    // - Manufacturing feasibility
    // - Material sourcing options
    // - Certification requirements
    // - Safety standards compliance

    console.log(`Creating specifications for "${options.productName}"...`);

    const qualityLevel = options.qualityLevel || 'premium';
    const category = options.category;

    return {
      productName: options.productName,
      category,
      dimensions: {
        length: '12 inches',
        width: '8 inches',
        height: '4 inches',
        weight: '2.5 lbs'
      },
      materials: [
        qualityLevel === 'luxury' ? 'Premium grade materials' : 'High-quality materials',
        'Sustainable components',
        'Non-toxic finishes',
        'Durable construction materials'
      ],
      colors: this.brandColors.length > 0 ? this.brandColors : [
        'Classic Black',
        'Pearl White',
        'Ocean Blue',
        'Forest Green'
      ],
      variants: [
        {
          name: 'Standard',
          sku: `${category.substring(0, 3).toUpperCase()}-STD-001`,
          specifications: {
            size: 'Medium',
            capacity: 'Standard',
            features: 'Core features included'
          }
        },
        {
          name: 'Deluxe',
          sku: `${category.substring(0, 3).toUpperCase()}-DLX-001`,
          specifications: {
            size: 'Large',
            capacity: 'Enhanced',
            features: 'All features + premium additions'
          }
        }
      ],
      technical: {
        'Material Grade': qualityLevel === 'luxury' ? 'A+' : 'A',
        'Durability Rating': '5000+ hours',
        'Temperature Range': '-10°C to 50°C',
        'Maintenance': 'Low maintenance, easy clean',
        'Compatibility': 'Universal fit',
        'Safety Rating': 'Meets all international standards'
      },
      certifications: [
        'ISO 9001 Quality Management',
        'CE Marking (European Conformity)',
        'RoHS Compliance',
        'Eco-Friendly Certified'
      ],
      warranty: qualityLevel === 'luxury' ? 'Lifetime limited warranty' :
                qualityLevel === 'premium' ? '5-year warranty' : '2-year warranty',
      packaging: {
        type: 'Recyclable premium box',
        dimensions: '14" × 10" × 6"',
        materials: ['FSC-certified cardboard', 'Biodegradable padding', 'Minimal plastic'],
        sustainable: true
      },
      manufacturing: {
        origin: 'Responsibly manufactured',
        leadTime: '3-4 weeks',
        moq: qualityLevel === 'luxury' ? 100 : 500
      }
    };
  }

  /**
   * Define product features with benefits and priorities
   * @param productName - The product name
   * @param category - Product category
   * @param targetUse - Primary use case
   * @returns Array of feature definitions
   */
  async defineFeatures(
    productName: string,
    category: string,
    targetUse: string
  ): Promise<FeatureDefinition[]> {
    // TODO: Implement AI-powered feature definition
    // This would typically involve:
    // - User research and surveys
    // - Competitor feature analysis
    // - Customer review mining
    // - Feature prioritization frameworks (MoSCoW, RICE)
    // - A/B testing data
    // - Market demand analysis

    console.log(`Defining features for "${productName}" in ${category} category...`);

    const features: FeatureDefinition[] = [
      {
        name: 'Premium Construction',
        description: 'Built with high-grade materials and precision engineering for lasting durability',
        benefit: 'Enjoy years of reliable performance without worrying about wear and tear',
        priority: 'must-have',
        category: 'quality',
        differentiator: true
      },
      {
        name: 'Intuitive Design',
        description: 'User-friendly interface and ergonomic design that feels natural to use',
        benefit: 'Start using immediately with no learning curve or complicated setup',
        priority: 'must-have',
        category: 'design',
        differentiator: false
      },
      {
        name: 'Multi-Functional Capability',
        description: 'Versatile design that adapts to multiple use cases and scenarios',
        benefit: 'Get more value from one product instead of buying multiple specialized items',
        priority: 'should-have',
        category: 'functionality',
        differentiator: true
      },
      {
        name: 'Eco-Friendly Materials',
        description: 'Sustainably sourced materials with minimal environmental impact',
        benefit: 'Make a positive environmental choice without compromising on quality',
        priority: 'should-have',
        category: 'sustainability',
        differentiator: true
      },
      {
        name: 'Easy Maintenance',
        description: 'Simple cleaning and maintenance procedures requiring minimal effort',
        benefit: 'Save time and hassle with quick, effortless upkeep',
        priority: 'should-have',
        category: 'convenience',
        differentiator: false
      },
      {
        name: 'Compact Storage',
        description: 'Space-efficient design that stores easily when not in use',
        benefit: 'Keep your space organized without sacrificing valuable storage area',
        priority: 'nice-to-have',
        category: 'convenience',
        differentiator: false
      },
      {
        name: 'Advanced Technology Integration',
        description: 'Smart features and modern technology for enhanced performance',
        benefit: 'Experience cutting-edge innovation that makes tasks easier and more efficient',
        priority: 'nice-to-have',
        category: 'functionality',
        differentiator: true
      },
      {
        name: 'Aesthetic Appeal',
        description: 'Beautifully designed to complement any environment or decor',
        benefit: 'Enjoy a product that looks as good as it performs',
        priority: 'nice-to-have',
        category: 'design',
        differentiator: false
      }
    ];

    return features;
  }

  /**
   * Set pricing strategy with market analysis
   * @param productName - The product name
   * @param cogs - Cost of goods sold
   * @param category - Product category
   * @param strategy - Pricing strategy to use
   * @returns Complete pricing strategy
   */
  async setPricing(
    productName: string,
    cogs: number,
    category: string,
    strategy?: 'cost-plus' | 'value-based' | 'competition-based' | 'penetration' | 'skimming'
  ): Promise<PricingStrategy> {
    // TODO: Implement intelligent pricing algorithms
    // This would typically involve:
    // - Competitor price scraping
    // - Market demand elasticity analysis
    // - Customer willingness to pay research
    // - Dynamic pricing models
    // - A/B price testing
    // - Psychological pricing optimization
    // - Regional pricing variations

    console.log(`Setting pricing strategy for "${productName}" using ${strategy || 'value-based'} approach...`);

    const pricingStrategy = strategy || 'value-based';
    let basePrice = 0;
    let marginPercentage = 0;

    // Calculate price based on strategy
    switch (pricingStrategy) {
      case 'cost-plus':
        marginPercentage = 50; // 50% markup
        basePrice = cogs * (1 + marginPercentage / 100);
        break;
      case 'value-based':
        marginPercentage = 70; // Higher margin for value-based
        basePrice = cogs * (1 + marginPercentage / 100);
        break;
      case 'competition-based':
        marginPercentage = 45; // Competitive margin
        basePrice = cogs * (1 + marginPercentage / 100);
        break;
      case 'penetration':
        marginPercentage = 30; // Lower initial margin
        basePrice = cogs * (1 + marginPercentage / 100);
        break;
      case 'skimming':
        marginPercentage = 100; // High initial margin
        basePrice = cogs * (1 + marginPercentage / 100);
        break;
    }

    // Round to psychological pricing point
    basePrice = Math.round(basePrice * 100) / 100;
    if (basePrice > 20) {
      basePrice = Math.floor(basePrice) + 0.99;
    }

    const margin = basePrice - cogs;

    return {
      basePrice,
      currency: 'USD',
      strategy: pricingStrategy,
      breakdown: {
        cogs,
        margin,
        marginPercentage: Math.round((margin / basePrice) * 100)
      },
      tiers: [
        {
          name: 'Standard',
          price: basePrice,
          description: 'Perfect for individual use',
          features: ['Core features', 'Standard warranty', 'Email support']
        },
        {
          name: 'Professional',
          price: basePrice * 1.5,
          description: 'For professionals and power users',
          features: ['All standard features', 'Extended warranty', 'Priority support', 'Advanced features']
        },
        {
          name: 'Enterprise',
          price: basePrice * 2.5,
          description: 'Complete solution for businesses',
          features: ['All professional features', 'Lifetime warranty', 'Dedicated support', 'Custom configurations', 'Bulk discounts']
        }
      ],
      discounts: [
        {
          type: 'Early Bird',
          amount: 15,
          conditions: 'First 100 customers - limited time offer'
        },
        {
          type: 'Bundle',
          amount: 20,
          conditions: 'Purchase 3 or more items'
        },
        {
          type: 'Subscription',
          amount: 10,
          conditions: 'Subscribe for monthly deliveries'
        }
      ],
      competitorComparison: {
        low: basePrice * 0.7,
        average: basePrice * 0.95,
        high: basePrice * 1.3,
        yourPrice: basePrice,
        positioning: pricingStrategy === 'penetration' ? 'Value Leader' :
                     pricingStrategy === 'skimming' ? 'Premium' :
                     'Competitive Premium'
      },
      recommendations: [
        `Start with ${pricingStrategy} strategy to ${pricingStrategy === 'penetration' ? 'gain market share' : 'maximize value'}`,
        'Monitor competitor pricing monthly and adjust accordingly',
        'Test price elasticity with A/B testing after 3 months',
        'Consider seasonal promotions during peak buying periods',
        `Maintain minimum ${Math.round(marginPercentage * 0.8)}% margin for profitability`
      ]
    };
  }

  /**
   * Create comprehensive product descriptions
   * @param productName - The product name
   * @param features - Product features
   * @param specs - Product specifications
   * @param brandVoice - Optional brand voice tone
   * @returns Complete product descriptions for various channels
   */
  async createProductDescriptions(
    productName: string,
    features: FeatureDefinition[],
    specs: ProductSpecs,
    brandVoice?: string
  ): Promise<ProductDescription> {
    console.log(`Creating product descriptions for "${productName}"...`);

    const voice = brandVoice || 'professional';
    const category = specs.category;
    const mustHaveFeatures = features.filter(f => f.priority === 'must-have');

    // Use Gemini AI to generate product description
    const result = await this.geminiService.generateProductDescription({
      productName,
      features: features.map(f => f.name),
      benefits: features.map(f => f.benefit),
      category,
      tone: voice,
      length: 'medium'
    });

    const shortDescription = result.shortDescription;
    const longDescription = result.longDescription;

    const keywords = [
      productName.toLowerCase(),
      category.toLowerCase(),
      'premium',
      'high-quality',
      specs.materials[0].toLowerCase().split(' ')[0],
      ...mustHaveFeatures.slice(0, 3).map(f => f.name.toLowerCase())
    ];

    return {
      short: shortDescription,
      long: longDescription,
      tagline: `${productName} - Where Quality Meets Innovation`,
      keyBenefits: mustHaveFeatures.map(f => f.benefit),
      features: features.map(f => f.name),
      specifications: `Dimensions: ${specs.dimensions?.length} × ${specs.dimensions?.width} × ${specs.dimensions?.height} | Weight: ${specs.dimensions?.weight} | Materials: ${specs.materials.join(', ')} | Warranty: ${specs.warranty}`,
      useCases: [
        'Daily professional use',
        'Home and personal projects',
        'Gift for enthusiasts',
        'Business and commercial applications',
        'Educational and training purposes'
      ],
      seo: {
        title: `${productName} | Premium ${category} Solution | ${this.brandName || 'Shop Now'}`,
        metaDescription: shortDescription.slice(0, 155) + '...',
        keywords,
        slug: productName.toLowerCase().replace(/\s+/g, '-')
      },
      marketingCopy: {
        headline: `Experience the Difference with ${productName}`,
        subheadline: 'Premium quality, innovative design, unmatched performance',
        callToAction: 'Get Yours Today - Limited Time Offer!',
        socialMediaPost: `🎉 Introducing the ${productName}! ${mustHaveFeatures[0].benefit} ✨ ${this.brandName ? `#${this.brandName.replace(/\s+/g, '')}` : ''} #${category.replace(/\s+/g, '')} #Quality`,
        emailCampaign: `Subject: You've Been Waiting For This - ${productName} Is Here!\n\nHi [Name],\n\nThe wait is over. The ${productName} is finally available, and it's everything we promised and more.\n\n${mustHaveFeatures[0].benefit}\n\nFor the next 48 hours, early supporters get 15% off. Don't miss out.\n\n[Shop Now Button]`
      }
    };
  }

  /**
   * Generate product image concepts and specifications
   * @param productName - The product name
   * @param category - Product category
   * @param brandColors - Brand color palette
   * @param lifestyle - Include lifestyle imagery
   * @returns Complete product image set with AI prompts
   */
  async generateProductImages(
    productName: string,
    category: string,
    brandColors?: string[],
    lifestyle: boolean = true
  ): Promise<ProductImageSet> {
    // TODO: Implement AI image generation
    // This would typically involve:
    // - DALL-E, Midjourney, or Stable Diffusion APIs
    // - Professional photography guidelines
    // - 3D rendering for product visualization
    // - Automated background removal
    // - Batch image processing
    // - Quality control and consistency checking

    console.log(`Generating image concepts for "${productName}"...`);

    const colors = brandColors || this.brandColors || ['#FFFFFF', '#000000'];

    const hero: ProductImage = {
      type: 'hero',
      concept: `Main product image showcasing ${productName} in pristine condition`,
      setting: 'Clean white background with soft shadows',
      lighting: 'Professional studio lighting with soft diffusion',
      angle: '45-degree front-facing angle',
      props: [],
      colorScheme: ['White', 'Soft gray'],
      mood: 'Professional, clean, premium',
      specifications: {
        resolution: '2000x2000px minimum',
        aspectRatio: '1:1',
        fileFormat: ['PNG with transparency', 'JPG high quality']
      },
      aiPrompt: `Professional product photography of ${productName}, ${category} product, studio lighting, white background, 45-degree angle, commercial photography, high resolution, detailed, premium quality, centered composition`,
      usage: 'E-commerce main image, thumbnails, catalog'
    };

    const lifestyleImages: ProductImage[] = lifestyle ? [
      {
        type: 'lifestyle',
        concept: `${productName} being used in real-world setting`,
        setting: 'Modern, well-lit interior space',
        lighting: 'Natural window light with subtle fill',
        angle: 'Eye-level, natural perspective',
        props: ['Complementary items', 'Natural environment elements'],
        colorScheme: colors.concat(['Natural tones', 'Warm neutrals']),
        mood: 'Aspirational, relatable, warm',
        specifications: {
          resolution: '3000x2000px minimum',
          aspectRatio: '3:2',
          fileFormat: ['JPG high quality', 'WebP']
        },
        aiPrompt: `Lifestyle photography, person using ${productName}, ${category}, modern interior, natural lighting, authentic moment, professional photography, warm tones, shallow depth of field`,
        usage: 'Social media, website banners, marketing campaigns'
      },
      {
        type: 'lifestyle',
        concept: `${productName} displayed in aesthetic environment`,
        setting: 'Minimalist styled surface or shelf',
        lighting: 'Soft natural light from side',
        angle: 'Overhead or 3/4 view',
        props: ['Decorative elements', 'Texture materials'],
        colorScheme: colors,
        mood: 'Sophisticated, clean, Instagram-worthy',
        specifications: {
          resolution: '3000x2000px minimum',
          aspectRatio: '4:5 or 1:1',
          fileFormat: ['JPG high quality']
        },
        aiPrompt: `Flat lay photography, ${productName}, ${category}, minimalist aesthetic, top-down view, styled product photography, soft shadows, muted colors, Instagram aesthetic`,
        usage: 'Social media posts, Pinterest, Instagram feed'
      }
    ] : [];

    const detailImages: ProductImage[] = [
      {
        type: 'detail',
        concept: 'Close-up of premium materials and construction',
        setting: 'Neutral background',
        lighting: 'Directional lighting to show texture',
        angle: 'Macro close-up',
        props: [],
        colorScheme: colors,
        mood: 'Detailed, quality-focused',
        specifications: {
          resolution: '2000x2000px minimum',
          aspectRatio: '1:1',
          fileFormat: ['JPG high quality']
        },
        aiPrompt: `Macro photography, close-up detail shot of ${productName}, ${category}, texture detail, material quality, professional product photography, sharp focus, bokeh background`,
        usage: 'Product detail pages, quality showcase'
      },
      {
        type: 'detail',
        concept: 'Unique features and design elements highlighted',
        setting: 'Clean background',
        lighting: 'Focused spotlight on feature',
        angle: 'Best angle to show feature',
        props: [],
        colorScheme: colors,
        mood: 'Technical, informative',
        specifications: {
          resolution: '2000x2000px minimum',
          aspectRatio: '1:1',
          fileFormat: ['JPG high quality']
        },
        aiPrompt: `Product feature highlight, ${productName}, ${category}, detailed view, professional photography, clean background, focused lighting, commercial style`,
        usage: 'Feature explanations, product pages'
      }
    ];

    const packaging: ProductImage = {
      type: 'packaging',
      concept: 'Product in premium packaging',
      setting: 'Clean surface, soft background',
      lighting: 'Even, professional lighting',
      angle: 'Front-facing with slight angle',
      props: ['Packaging box', 'Brand materials'],
      colorScheme: colors,
      mood: 'Premium, gift-ready, exciting',
      specifications: {
        resolution: '2000x2000px minimum',
        aspectRatio: '1:1',
        fileFormat: ['JPG high quality']
      },
      aiPrompt: `Product packaging photography, ${productName} in box, ${category}, premium packaging, unboxing ready, professional commercial photography, brand colors, clean background`,
      usage: 'Unboxing content, gift marketing'
    };

    const additional: ProductImage[] = [
      {
        type: 'comparison',
        concept: 'Size comparison with common objects',
        setting: 'Clean surface',
        lighting: 'Even studio lighting',
        angle: 'Top-down or side view',
        props: ['Size reference objects'],
        colorScheme: ['White', 'Neutral'],
        mood: 'Informative, clear',
        specifications: {
          resolution: '2000x1500px minimum',
          aspectRatio: '4:3',
          fileFormat: ['JPG high quality']
        },
        aiPrompt: `Product size comparison, ${productName} next to common objects, ${category}, scale reference, professional photography, white background, clear view`,
        usage: 'Size specifications, product details'
      },
      {
        type: 'infographic',
        concept: 'Key features visual infographic',
        setting: 'Digital design',
        lighting: 'N/A - graphic design',
        angle: 'N/A - graphic design',
        props: [],
        colorScheme: colors,
        mood: 'Informative, modern, clean',
        specifications: {
          resolution: '1200x1200px minimum',
          aspectRatio: '1:1',
          fileFormat: ['PNG', 'SVG']
        },
        aiPrompt: `Infographic design, ${productName} features, ${category}, modern design, icons, brand colors, professional layout, clean typography, feature highlights`,
        usage: 'Social media, marketing materials, product pages'
      }
    ];

    return {
      hero,
      lifestyle: lifestyleImages,
      details: detailImages,
      packaging,
      additional,
      guidelines: {
        style: 'Clean, professional, lifestyle-focused photography with consistent lighting and color grading',
        consistency: [
          'Use consistent lighting across all images',
          'Maintain brand color palette throughout',
          'Keep similar editing style and filters',
          'Use same background treatment for product shots',
          'Ensure color accuracy and white balance'
        ],
        editing: [
          'Color correction for brand consistency',
          'Minimal retouching - keep authentic',
          'Shadow and highlight adjustment',
          'Sharpening for web display',
          'Optimize file size without quality loss'
        ],
        formats: [
          'Hero: PNG with transparency + JPG',
          'Lifestyle: JPG high quality + WebP',
          'Details: JPG high quality',
          'Social media: JPG optimized, multiple aspect ratios',
          'Print: High-resolution TIFF or PNG'
        ]
      }
    };
  }

  /**
   * Get current generator state
   */
  getState(): {
    hasContext: boolean;
    niche: string | null;
    brandName: string | null;
    brandColors: string[];
    targetAudience: string | null;
  } {
    return {
      hasContext: this.niche !== null,
      niche: this.niche,
      brandName: this.brandName,
      brandColors: this.brandColors,
      targetAudience: this.targetAudience
    };
  }
}
