/**
 * SocialMediaGenerator - Generates social media content and automation
 *
 * This class provides AI-powered social media management including profile creation,
 * post generation, graphic design, content scheduling, hashtag research, and automation setup.
 */

import { getGeminiService, GeminiService } from '../services/GeminiService';

export interface ProfileOptions {
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'pinterest' | 'youtube';
  brandName: string;
  niche: string;
  targetAudience?: string;
  brandVoice?: string;
  brandColors?: string[];
}

export interface SocialProfile {
  platform: string;
  username: string;
  displayName: string;
  bio: string;
  bioVariations: string[];
  link: string;
  profileImage: {
    concept: string;
    specifications: {
      dimensions: string;
      format: string[];
      fileSize: string;
    };
    aiPrompt: string;
  };
  coverImage?: {
    concept: string;
    specifications: {
      dimensions: string;
      format: string[];
      fileSize: string;
    };
    aiPrompt: string;
  };
  highlights?: {
    title: string;
    coverConcept: string;
    stories: string[];
  }[];
  pinnedContent?: {
    type: string;
    concept: string;
  };
  categoryTags?: string[];
  contactButtons?: {
    type: string;
    label: string;
    value: string;
  }[];
  callToAction?: {
    type: string;
    text: string;
    link: string;
  };
}

export interface PostGenerationOptions {
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'pinterest' | 'youtube';
  postType?: 'educational' | 'promotional' | 'engagement' | 'inspirational' | 'entertaining' | 'news';
  topic?: string;
  productName?: string;
  count?: number;
  includeMedia?: boolean;
  tone?: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'playful';
}

export interface SocialPost {
  platform: string;
  postType: string;
  content: {
    caption: string;
    captionVariations: string[];
    hook: string;
    mainMessage: string;
    callToAction: string;
  };
  media: {
    type: 'image' | 'video' | 'carousel' | 'story' | 'reel';
    count: number;
    concepts: string[];
    specifications: {
      dimensions: string;
      duration?: string;
      format: string[];
      aspectRatio: string;
    };
  };
  hashtags: {
    primary: string[];
    secondary: string[];
    branded: string[];
    trending: string[];
  };
  mentions: string[];
  location?: string;
  timing: {
    bestDays: string[];
    bestTimes: string[];
    timezone: string;
  };
  engagement: {
    expectedReach: string;
    targetEngagementRate: string;
    goalMetric: string;
  };
  variants: {
    short: string;
    medium: string;
    long: string;
  };
}

export interface GraphicDesignOptions {
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'pinterest';
  graphicType: 'post' | 'story' | 'cover' | 'ad' | 'carousel' | 'infographic' | 'quote';
  theme?: string;
  brandColors?: string[];
  message?: string;
}

export interface SocialGraphic {
  platform: string;
  type: string;
  theme: string;
  design: {
    layout: string;
    colorScheme: string[];
    typography: {
      primary: string;
      secondary: string;
      sizes: string[];
    };
    elements: string[];
  };
  specifications: {
    dimensions: string;
    resolution: string;
    format: string[];
    fileSize: string;
    aspectRatio: string;
  };
  content: {
    headline?: string;
    subheadline?: string;
    bodyText?: string;
    callToAction?: string;
  };
  aiPrompt: string;
  designGuidelines: {
    spacing: string;
    alignment: string;
    hierarchy: string;
    branding: string;
  };
  templates: {
    name: string;
    description: string;
    variations: number;
  }[];
  exportSettings: {
    formats: string[];
    compression: string;
    colorProfile: string;
  };
}

export interface ScheduleOptions {
  platforms: string[];
  duration: 'week' | 'month' | 'quarter';
  postsPerDay?: number;
  contentMix?: {
    educational: number;
    promotional: number;
    engagement: number;
    inspirational: number;
  };
  niche?: string;
}

export interface ContentSchedule {
  duration: string;
  totalPosts: number;
  platforms: string[];
  calendar: {
    date: Date;
    dayOfWeek: string;
    posts: {
      platform: string;
      time: string;
      postType: string;
      topic: string;
      status: 'draft' | 'scheduled' | 'published';
      priority: 'high' | 'medium' | 'low';
    }[];
    theme?: string;
  }[];
  contentMix: {
    type: string;
    percentage: number;
    count: number;
  }[];
  timing: {
    platform: string;
    bestDays: string[];
    bestTimes: string[];
    frequency: string;
  }[];
  themes: {
    week: number;
    theme: string;
    topics: string[];
  }[];
  analytics: {
    expectedReach: string;
    expectedEngagement: string;
    contentBalance: string;
  };
}

export interface HashtagOptions {
  niche: string;
  topic?: string;
  platform?: string;
  count?: number;
  competition?: 'low' | 'medium' | 'high' | 'mixed';
}

export interface HashtagSet {
  niche: string;
  topic: string;
  hashtags: {
    tag: string;
    category: 'branded' | 'niche' | 'trending' | 'community' | 'location';
    volume: 'low' | 'medium' | 'high' | 'very-high';
    competition: 'low' | 'medium' | 'high';
    relevance: number;
    estimatedReach: string;
  }[];
  sets: {
    name: string;
    description: string;
    tags: string[];
    bestFor: string[];
  }[];
  strategy: {
    mix: string;
    rotation: string;
    placement: string;
    monitoring: string;
  };
  recommendations: string[];
  banned: string[];
}

export interface AutomationOptions {
  platforms: string[];
  features?: string[];
  objectives?: string[];
  budget?: 'minimal' | 'moderate' | 'extensive';
}

export interface AutomationSetup {
  platforms: string[];
  workflows: {
    name: string;
    trigger: string;
    actions: {
      type: string;
      description: string;
      parameters: Record<string, any>;
    }[];
    frequency: string;
    enabled: boolean;
  }[];
  tools: {
    category: string;
    name: string;
    purpose: string;
    features: string[];
    pricing: string;
    integration: string[];
  }[];
  scheduling: {
    tool: string;
    features: string[];
    setup: string[];
    platforms: string[];
  };
  analytics: {
    tool: string;
    metrics: string[];
    reports: string[];
    automation: string[];
  };
  engagement: {
    autoResponses: {
      trigger: string;
      response: string;
      conditions: string[];
    }[];
    commentManagement: {
      filterKeywords: string[];
      autoReply: boolean;
      escalationRules: string[];
    };
    dmAutomation: {
      welcomeMessage: string;
      faqs: {
        question: string;
        answer: string;
      }[];
      humanHandoff: string[];
    };
  };
  contentCuration: {
    sources: string[];
    filters: string[];
    frequency: string;
    categories: string[];
  };
  monitoring: {
    brandMentions: boolean;
    keywords: string[];
    competitors: string[];
    alerts: string[];
  };
  reporting: {
    frequency: string;
    metrics: string[];
    recipients: string[];
    format: string;
  };
  recommendations: string[];
}

export interface CampaignOptions {
  campaignType: 'product-launch' | 'brand-awareness' | 'engagement' | 'lead-generation' | 'sales';
  duration: number; // days
  platforms: string[];
  budget?: number;
  targetAudience?: string;
}

export interface SocialCampaign {
  name: string;
  type: string;
  duration: number;
  platforms: string[];
  phases: {
    name: string;
    duration: number;
    goals: string[];
    content: {
      platform: string;
      posts: number;
      types: string[];
    }[];
  }[];
  content: {
    phase: string;
    posts: SocialPost[];
  }[];
  hashtags: HashtagSet;
  schedule: ContentSchedule;
  kpis: {
    metric: string;
    target: number;
    measurement: string;
  }[];
  budget?: {
    total: number;
    allocation: {
      platform: string;
      amount: number;
      purpose: string;
    }[];
  };
}

export class SocialMediaGenerator {
  private brandName: string | null = null;
  private niche: string | null = null;
  private brandVoice: string = 'professional';
  private brandColors: string[] = [];
  private targetAudience: string | null = null;
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = getGeminiService();
  }

  /**
   * Set context for social media generation
   * @param brandName - The brand name
   * @param niche - The niche/industry
   * @param brandVoice - Brand voice/tone
   * @param brandColors - Brand color palette
   * @param targetAudience - Target audience description
   */
  setContext(
    brandName: string,
    niche: string,
    brandVoice?: string,
    brandColors?: string[],
    targetAudience?: string
  ): void {
    this.brandName = brandName;
    this.niche = niche;
    this.brandVoice = brandVoice || 'professional';
    this.brandColors = brandColors || [];
    this.targetAudience = targetAudience || null;
  }

  /**
   * Create social media profiles with optimized bios and visuals
   * @param options - Profile creation options
   * @returns Complete profile configuration
   */
  async createProfiles(options: ProfileOptions): Promise<SocialProfile> {
    // TODO: Implement AI-powered profile creation
    // This would typically involve:
    // - Bio optimization for each platform
    // - Username availability checking
    // - Profile image generation (DALL-E, Midjourney)
    // - SEO optimization for social profiles
    // - Keyword research for discoverability
    // - Competitor profile analysis
    // - A/B testing different bios

    console.log(`Creating ${options.platform} profile for ${options.brandName}...`);

    const brandName = options.brandName || this.brandName || 'Brand';
    const niche = options.niche || this.niche || 'Business';
    const username = this.generateUsername(brandName, options.platform);

    const profile = this.buildPlatformProfile(options, brandName, niche, username);

    return profile;
  }

  /**
   * Generate social media posts for various platforms
   * @param options - Post generation options
   * @returns Social media post with content and media specs
   */
  async generatePosts(options: PostGenerationOptions): Promise<SocialPost[]> {
    console.log(`Generating ${options.count || 1} ${options.platform} posts...`);

    const count = options.count || 1;
    const posts: SocialPost[] = [];

    for (let i = 0; i < count; i++) {
      const post = this.createSinglePost(options, i);
      posts.push(post);
    }

    return posts;
  }

  /**
   * Design graphics for social media posts
   * @param options - Graphic design options
   * @returns Social media graphic with design specifications
   */
  async designGraphics(options: GraphicDesignOptions): Promise<SocialGraphic> {
    // TODO: Implement AI-powered graphic design
    // This would typically involve:
    // - DALL-E/Midjourney for image generation
    // - Canva API for template creation
    // - Brand consistency checking
    // - A/B testing different designs
    // - Engagement prediction
    // - Platform-specific optimization
    // - Accessibility compliance

    console.log(`Designing ${options.graphicType} graphic for ${options.platform}...`);

    const brandColors = options.brandColors || this.brandColors || ['#3B82F6', '#1F2937', '#FFFFFF'];
    const specs = this.getPlatformSpecifications(options.platform, options.graphicType);

    return {
      platform: options.platform,
      type: options.graphicType,
      theme: options.theme || 'modern',
      design: {
        layout: this.getLayoutForType(options.graphicType),
        colorScheme: brandColors,
        typography: {
          primary: 'Inter, sans-serif',
          secondary: 'Georgia, serif',
          sizes: ['14px', '18px', '24px', '36px', '48px']
        },
        elements: [
          'Brand logo',
          'Main visual/image',
          'Text overlay',
          'Call-to-action',
          'Decorative elements'
        ]
      },
      specifications: specs,
      content: {
        headline: options.message || `${this.brandName || 'Your Brand'} - ${this.niche || 'Excellence'}`,
        subheadline: 'Discover the difference',
        bodyText: 'Quality you can trust',
        callToAction: 'Learn More'
      },
      aiPrompt: this.generateGraphicPrompt(options, brandColors),
      designGuidelines: {
        spacing: 'Maintain 10% margin on all sides',
        alignment: 'Center-aligned for social, left-aligned for infographics',
        hierarchy: 'Headline > Visual > Body > CTA',
        branding: 'Logo in corner, brand colors throughout'
      },
      templates: [
        {
          name: 'Minimal',
          description: 'Clean design with focus on message',
          variations: 3
        },
        {
          name: 'Bold',
          description: 'Eye-catching with strong colors',
          variations: 3
        },
        {
          name: 'Elegant',
          description: 'Sophisticated and premium',
          variations: 3
        }
      ],
      exportSettings: {
        formats: ['PNG', 'JPG', 'PDF'],
        compression: 'High quality with optimization',
        colorProfile: 'sRGB'
      }
    };
  }

  /**
   * Schedule content across multiple platforms
   * @param options - Scheduling options
   * @returns Complete content calendar
   */
  async scheduleContent(options: ScheduleOptions): Promise<ContentSchedule> {
    // TODO: Implement AI-powered scheduling
    // This would typically involve:
    // - Optimal posting time analysis
    // - Audience activity patterns
    // - Platform algorithm optimization
    // - Content balance automation
    // - Holiday and event integration
    // - Competitor posting analysis
    // - Engagement prediction

    console.log(`Creating ${options.duration} content schedule for ${options.platforms.join(', ')}...`);

    const days = options.duration === 'week' ? 7 : options.duration === 'month' ? 30 : 90;
    const postsPerDay = options.postsPerDay || 2;
    const totalPosts = days * postsPerDay * options.platforms.length;

    const contentMix = options.contentMix || {
      educational: 40,
      promotional: 20,
      engagement: 30,
      inspirational: 10
    };

    const calendar = this.generateCalendar(days, options.platforms, postsPerDay, contentMix);

    return {
      duration: options.duration,
      totalPosts,
      platforms: options.platforms,
      calendar,
      contentMix: [
        { type: 'Educational', percentage: contentMix.educational, count: Math.round(totalPosts * contentMix.educational / 100) },
        { type: 'Promotional', percentage: contentMix.promotional, count: Math.round(totalPosts * contentMix.promotional / 100) },
        { type: 'Engagement', percentage: contentMix.engagement, count: Math.round(totalPosts * contentMix.engagement / 100) },
        { type: 'Inspirational', percentage: contentMix.inspirational, count: Math.round(totalPosts * contentMix.inspirational / 100) }
      ],
      timing: this.generateTimingRecommendations(options.platforms),
      themes: this.generateWeeklyThemes(Math.ceil(days / 7), options.niche),
      analytics: {
        expectedReach: `${totalPosts * 500}-${totalPosts * 2000} users`,
        expectedEngagement: '3-5% average engagement rate',
        contentBalance: 'Optimized mix of value and promotion'
      }
    };
  }

  /**
   * Create hashtag sets for different purposes
   * @param options - Hashtag research options
   * @returns Hashtag sets with analytics
   */
  async createHashtags(options: HashtagOptions): Promise<HashtagSet> {
    // TODO: Implement AI-powered hashtag research
    // This would typically involve:
    // - Instagram/TikTok hashtag volume API
    // - Trending hashtag identification
    // - Competition analysis
    // - Relevance scoring
    // - Banned hashtag checking
    // - Hashtag performance tracking
    // - Niche-specific research

    console.log(`Creating hashtag sets for ${options.niche}...`);

    const topic = options.topic || options.niche;
    const count = options.count || 30;

    const hashtags = this.generateHashtagList(options.niche, topic, count, options.competition);
    const sets = this.createHashtagSets(hashtags);

    return {
      niche: options.niche,
      topic,
      hashtags,
      sets,
      strategy: {
        mix: 'Use 70% niche + 20% trending + 10% branded hashtags',
        rotation: 'Rotate hashtags every 3-5 posts to avoid shadowban',
        placement: 'First comment for Instagram, within caption for others',
        monitoring: 'Track performance weekly and adjust based on reach'
      },
      recommendations: [
        'Use 25-30 hashtags on Instagram for maximum reach',
        'Limit to 3-5 highly relevant hashtags on Twitter',
        'Focus on trending hashtags for TikTok',
        'Use professional hashtags on LinkedIn',
        'Create a branded hashtag for campaigns',
        'Monitor hashtag performance monthly',
        'Avoid banned or spammy hashtags',
        'Mix high, medium, and low competition tags'
      ],
      banned: [
        '#follow4follow',
        '#like4like',
        '#gain',
        '#followback'
      ]
    };
  }

  /**
   * Setup social media automation workflows
   * @param options - Automation setup options
   * @returns Complete automation configuration
   */
  async setupAutomation(options: AutomationOptions): Promise<AutomationSetup> {
    // TODO: Implement automation setup
    // This would typically involve:
    // - API integrations (Buffer, Hootsuite, Zapier)
    // - Workflow creation and testing
    // - Chatbot setup
    // - Auto-response configuration
    // - Analytics automation
    // - Content curation setup
    // - Monitoring and alerts

    console.log(`Setting up automation for ${options.platforms.join(', ')}...`);

    const workflows = this.createAutomationWorkflows(options);
    const tools = this.recommendAutomationTools(options);

    return {
      platforms: options.platforms,
      workflows,
      tools,
      scheduling: {
        tool: 'Buffer or Hootsuite',
        features: [
          'Multi-platform scheduling',
          'Content calendar view',
          'Best time optimization',
          'Team collaboration',
          'Analytics dashboard'
        ],
        setup: [
          'Connect social media accounts',
          'Import content calendar',
          'Set up posting queues',
          'Configure timezone settings',
          'Enable analytics tracking'
        ],
        platforms: options.platforms
      },
      analytics: {
        tool: 'Google Analytics + Native Platform Analytics',
        metrics: [
          'Reach and impressions',
          'Engagement rate',
          'Click-through rate',
          'Follower growth',
          'Top performing posts',
          'Audience demographics',
          'Best posting times'
        ],
        reports: [
          'Weekly performance summary',
          'Monthly growth report',
          'Content type analysis',
          'Competitor benchmarking'
        ],
        automation: [
          'Automated weekly reports',
          'Real-time alerts for viral posts',
          'Engagement threshold notifications',
          'Monthly executive summaries'
        ]
      },
      engagement: {
        autoResponses: [
          {
            trigger: 'Thank you message',
            response: `Thanks for following ${this.brandName || 'us'}! 🎉`,
            conditions: ['New follower', 'Within 24 hours']
          },
          {
            trigger: 'FAQ about pricing',
            response: `Check out our pricing at [link]. Need help? DM us!`,
            conditions: ['Contains "price" or "cost"', 'Comment or DM']
          }
        ],
        commentManagement: {
          filterKeywords: ['spam', 'inappropriate', 'offensive'],
          autoReply: true,
          escalationRules: [
            'Negative sentiment → Notify team',
            'Question not in FAQ → Human response',
            'Complaint → Priority escalation'
          ]
        },
        dmAutomation: {
          welcomeMessage: `Hi! Thanks for reaching out to ${this.brandName || 'us'}. How can we help you today?`,
          faqs: [
            {
              question: 'What are your business hours?',
              answer: 'We\'re available Monday-Friday, 9am-5pm EST.'
            },
            {
              question: 'How can I track my order?',
              answer: 'You can track your order at [tracking link] using your order number.'
            }
          ],
          humanHandoff: [
            'Complex questions',
            'Complaints',
            'Custom requests',
            'After 2 automated responses'
          ]
        }
      },
      contentCuration: {
        sources: [
          'Industry news websites',
          'Influencer accounts',
          'Customer content (UGC)',
          'Trending topics',
          'Competitor content'
        ],
        filters: [
          `Related to ${this.niche}`,
          'High engagement content',
          'Positive sentiment',
          'Brand-safe content'
        ],
        frequency: 'Daily curation, weekly review',
        categories: [
          'Educational content',
          'Industry news',
          'Inspiration',
          'User-generated content'
        ]
      },
      monitoring: {
        brandMentions: true,
        keywords: [
          this.brandName || 'brand',
          this.niche || 'niche',
          'Product names',
          'Campaign hashtags'
        ],
        competitors: [
          'Competitor A mentions',
          'Competitor B mentions',
          'Industry leaders'
        ],
        alerts: [
          'Viral post (>1000 engagements)',
          'Negative mention',
          'Customer service needed',
          'Trending opportunity'
        ]
      },
      reporting: {
        frequency: 'Weekly summary, Monthly detailed report',
        metrics: [
          'Total reach and impressions',
          'Engagement rate by platform',
          'Follower growth',
          'Top performing content',
          'Audience insights',
          'ROI metrics'
        ],
        recipients: ['Marketing team', 'Management', 'Stakeholders'],
        format: 'PDF report + Dashboard access'
      },
      recommendations: [
        'Start with scheduling automation before engagement automation',
        'Test automated responses with small audience first',
        'Monitor automation performance weekly',
        'Keep human touch in customer service',
        'Use automation for consistency, not replacement',
        'Set up fail-safes for automation errors',
        'Review and update workflows monthly',
        'Track ROI of automation tools',
        'Maintain content quality over quantity',
        'Ensure brand voice consistency in automated responses'
      ]
    };
  }

  /**
   * Create a complete social media campaign
   * @param options - Campaign options
   * @returns Complete campaign plan with content and schedule
   */
  async createCampaign(options: CampaignOptions): Promise<SocialCampaign> {
    console.log(`Creating ${options.campaignType} campaign for ${options.duration} days...`);

    const phases = this.generateCampaignPhases(options);
    const hashtags = await this.createHashtags({ niche: this.niche || 'business', topic: options.campaignType });
    const schedule = await this.scheduleContent({
      platforms: options.platforms,
      duration: options.duration > 30 ? 'quarter' : options.duration > 7 ? 'month' : 'week',
      postsPerDay: 2
    });

    return {
      name: `${this.brandName || 'Brand'} ${options.campaignType} Campaign`,
      type: options.campaignType,
      duration: options.duration,
      platforms: options.platforms,
      phases,
      content: [],
      hashtags,
      schedule,
      kpis: this.generateKPIs(options.campaignType),
      budget: options.budget ? {
        total: options.budget,
        allocation: options.platforms.map(p => ({
          platform: p,
          amount: options.budget! / options.platforms.length,
          purpose: 'Organic + Paid promotion'
        }))
      } : undefined
    };
  }

  /**
   * Helper method to generate username
   * @private
   */
  private generateUsername(brandName: string, platform: string): string {
    const base = brandName.toLowerCase().replace(/\s+/g, '');

    if (platform === 'twitter' && base.length > 15) {
      return base.slice(0, 15);
    }

    return base;
  }

  /**
   * Helper method to build platform-specific profile
   * @private
   */
  private buildPlatformProfile(options: ProfileOptions, brandName: string, niche: string, username: string): SocialProfile {
    const platform = options.platform;
    let bio = '';
    let bioVariations: string[] = [];

    if (platform === 'instagram') {
      bio = `${brandName} | ${niche}\n✨ Quality & Innovation\n🌍 Trusted by thousands\n👇 Shop now`;
      bioVariations = [
        `${brandName}\n${niche} done right ✨\nYour trusted partner 🤝\nShop 👇`,
        `Premium ${niche} | ${brandName}\n🎯 Excellence in every detail\n💼 Professional solutions\nExplore 👇`
      ];
    } else if (platform === 'twitter') {
      bio = `${brandName} - Premium ${niche}. Quality, innovation, and excellence. #${niche.replace(/\s+/g, '')}`;
      bioVariations = [
        `${brandName}: Your trusted ${niche} partner. Delivering quality since day one.`,
        `Innovating ${niche} | ${brandName} | Quality & Excellence`
      ];
    } else if (platform === 'linkedin') {
      bio = `${brandName} specializes in premium ${niche} solutions. We help businesses and individuals achieve excellence through innovative products and exceptional service.`;
      bioVariations = [
        `Leading provider of ${niche} solutions. ${brandName} combines quality, innovation, and customer-focused service.`
      ];
    } else if (platform === 'tiktok') {
      bio = `${brandName} 🎯\n${niche} tips & tricks ✨\nYour daily dose of quality 💫`;
      bioVariations = [
        `${niche} made simple 🚀\n${brandName} | Quality & Fun\nFollow for more! ✨`
      ];
    } else if (platform === 'facebook') {
      bio = `${brandName} - Your trusted source for premium ${niche}. We're passionate about quality and committed to customer satisfaction.`;
      bioVariations = [];
    } else if (platform === 'youtube') {
      bio = `Welcome to ${brandName}! We create content about ${niche}, sharing tips, tutorials, and insights to help you succeed. Subscribe for weekly videos!`;
      bioVariations = [];
    } else {
      bio = `${brandName} - Premium ${niche}`;
      bioVariations = [];
    }

    const profile: SocialProfile = {
      platform,
      username,
      displayName: brandName,
      bio,
      bioVariations,
      link: `https://${username}.com`,
      profileImage: {
        concept: `${brandName} logo on ${options.brandColors?.[0] || 'branded'} background`,
        specifications: this.getProfileImageSpecs(platform),
        aiPrompt: `Professional logo design, ${brandName}, ${niche}, ${options.brandColors?.join(', ') || 'modern colors'}, clean, minimal, centered, high quality`
      }
    };

    // Add cover image for platforms that support it
    if (['facebook', 'twitter', 'linkedin', 'youtube'].includes(platform)) {
      profile.coverImage = {
        concept: `${brandName} brand imagery with tagline and value proposition`,
        specifications: this.getCoverImageSpecs(platform),
        aiPrompt: `Cover banner design, ${brandName}, ${niche}, ${options.brandColors?.join(', ') || 'brand colors'}, professional, modern, inspiring, ${platform} cover dimensions`
      };
    }

    // Add highlights for Instagram
    if (platform === 'instagram') {
      profile.highlights = [
        {
          title: 'Products',
          coverConcept: 'Product showcase icon',
          stories: ['Product 1', 'Product 2', 'Product 3']
        },
        {
          title: 'About',
          coverConcept: 'Brand story icon',
          stories: ['Our Story', 'Our Team', 'Our Values']
        },
        {
          title: 'Reviews',
          coverConcept: 'Star rating icon',
          stories: ['Customer Review 1', 'Customer Review 2', 'Testimonials']
        }
      ];

      profile.categoryTags = [niche, 'Brand', 'Shopping'];
    }

    // Add call-to-action for business profiles
    if (['facebook', 'instagram'].includes(platform)) {
      profile.callToAction = {
        type: 'Shop Now',
        text: 'Shop Now',
        link: `https://${username}.com/shop`
      };

      profile.contactButtons = [
        { type: 'email', label: 'Email', value: `hello@${username}.com` },
        { type: 'phone', label: 'Call', value: '+1-555-0123' }
      ];
    }

    return profile;
  }

  /**
   * Helper method to create a single post
   * @private
   */
  private createSinglePost(options: PostGenerationOptions, index: number): SocialPost {
    const postType = options.postType || 'educational';
    const topic = options.topic || this.niche || 'quality products';
    const tone = options.tone || this.brandVoice;

    const content = this.generatePostContent(options.platform, postType, topic, tone);
    const hashtags = this.generateQuickHashtags(this.niche || 'business', options.platform);
    const timing = this.getBestPostingTime(options.platform);

    return {
      platform: options.platform,
      postType,
      content,
      media: {
        type: this.getMediaType(options.platform),
        count: 1,
        concepts: [
          `${topic} visual for ${options.platform}`,
          `${this.brandName || 'Brand'} ${postType} content`
        ],
        specifications: this.getMediaSpecs(options.platform)
      },
      hashtags,
      mentions: [],
      timing,
      engagement: {
        expectedReach: '500-2000 users',
        targetEngagementRate: '3-5%',
        goalMetric: postType === 'promotional' ? 'Conversions' : 'Engagement'
      },
      variants: {
        short: content.caption.slice(0, 100),
        medium: content.caption,
        long: `${content.caption}\n\n${content.mainMessage}`
      }
    };
  }

  /**
   * Helper method to generate post content
   * @private
   */
  private generatePostContent(platform: string, postType: string, topic: string, tone: string): SocialPost['content'] {
    let hook = '';
    let mainMessage = '';
    let callToAction = '';

    if (postType === 'educational') {
      hook = `💡 Did you know?`;
      mainMessage = `Understanding ${topic} can transform your approach. Here's what you need to know...`;
      callToAction = 'Save this for later!';
    } else if (postType === 'promotional') {
      hook = `🎉 Special announcement!`;
      mainMessage = `Discover our ${topic} - quality you can trust. Limited time offer!`;
      callToAction = 'Shop now - link in bio!';
    } else if (postType === 'engagement') {
      hook = `👇 We want to hear from you!`;
      mainMessage = `What's your experience with ${topic}? Share in the comments!`;
      callToAction = 'Comment below!';
    } else if (postType === 'inspirational') {
      hook = `✨ Monday motivation`;
      mainMessage = `Excellence in ${topic} starts with commitment to quality. Your journey begins today.`;
      callToAction = 'Tag someone who needs this!';
    } else {
      hook = `📢 Exciting news!`;
      mainMessage = `Breaking: Latest updates on ${topic}. Stay informed with us.`;
      callToAction = 'Read more in our bio!';
    }

    const caption = `${hook}\n\n${mainMessage}\n\n${callToAction}`;

    return {
      caption,
      captionVariations: [
        caption,
        `${mainMessage}\n\n${callToAction}`,
        `${hook} ${mainMessage} ${callToAction}`
      ],
      hook,
      mainMessage,
      callToAction
    };
  }

  /**
   * Helper method to get profile image specifications
   * @private
   */
  private getProfileImageSpecs(platform: string): SocialProfile['profileImage']['specifications'] {
    const specs: Record<string, any> = {
      instagram: { dimensions: '320x320px', format: ['PNG', 'JPG'], fileSize: '2MB max' },
      facebook: { dimensions: '180x180px', format: ['PNG', 'JPG'], fileSize: '2MB max' },
      twitter: { dimensions: '400x400px', format: ['PNG', 'JPG'], fileSize: '2MB max' },
      linkedin: { dimensions: '400x400px', format: ['PNG', 'JPG'], fileSize: '8MB max' },
      tiktok: { dimensions: '200x200px', format: ['PNG', 'JPG'], fileSize: '2MB max' },
      youtube: { dimensions: '800x800px', format: ['PNG', 'JPG'], fileSize: '4MB max' }
    };

    return specs[platform] || { dimensions: '400x400px', format: ['PNG', 'JPG'], fileSize: '2MB max' };
  }

  /**
   * Helper method to get cover image specifications
   * @private
   */
  private getCoverImageSpecs(platform: string): SocialProfile['coverImage']['specifications'] {
    const specs: Record<string, any> = {
      facebook: { dimensions: '820x312px', format: ['PNG', 'JPG'], fileSize: '5MB max' },
      twitter: { dimensions: '1500x500px', format: ['PNG', 'JPG'], fileSize: '5MB max' },
      linkedin: { dimensions: '1584x396px', format: ['PNG', 'JPG'], fileSize: '8MB max' },
      youtube: { dimensions: '2560x1440px', format: ['PNG', 'JPG'], fileSize: '6MB max' }
    };

    return specs[platform] || { dimensions: '1500x500px', format: ['PNG', 'JPG'], fileSize: '5MB max' };
  }

  /**
   * Helper method to get platform specifications for graphics
   * @private
   */
  private getPlatformSpecifications(platform: string, graphicType: string): SocialGraphic['specifications'] {
    const baseSpecs: Record<string, any> = {
      instagram: {
        post: { dimensions: '1080x1080px', aspectRatio: '1:1' },
        story: { dimensions: '1080x1920px', aspectRatio: '9:16' },
        carousel: { dimensions: '1080x1080px', aspectRatio: '1:1' }
      },
      facebook: {
        post: { dimensions: '1200x630px', aspectRatio: '1.91:1' },
        cover: { dimensions: '820x312px', aspectRatio: '2.63:1' }
      },
      twitter: {
        post: { dimensions: '1200x675px', aspectRatio: '16:9' }
      },
      linkedin: {
        post: { dimensions: '1200x627px', aspectRatio: '1.91:1' }
      },
      tiktok: {
        post: { dimensions: '1080x1920px', aspectRatio: '9:16' }
      },
      pinterest: {
        post: { dimensions: '1000x1500px', aspectRatio: '2:3' }
      }
    };

    const spec = baseSpecs[platform]?.[graphicType] || { dimensions: '1080x1080px', aspectRatio: '1:1' };

    return {
      ...spec,
      resolution: '72 DPI (web) or 300 DPI (print)',
      format: ['PNG', 'JPG'],
      fileSize: '5MB max'
    };
  }

  /**
   * Helper method to get layout for graphic type
   * @private
   */
  private getLayoutForType(graphicType: string): string {
    const layouts: Record<string, string> = {
      post: 'Centered with balanced composition',
      story: 'Vertical with top and bottom safe zones',
      quote: 'Text-focused with minimal background',
      infographic: 'Structured grid with data visualization',
      carousel: 'Sequential storytelling layout',
      ad: 'Eye-catching with clear CTA'
    };

    return layouts[graphicType] || 'Balanced composition';
  }

  /**
   * Helper method to generate graphic AI prompt
   * @private
   */
  private generateGraphicPrompt(options: GraphicDesignOptions, brandColors: string[]): string {
    return `Professional ${options.platform} ${options.graphicType} graphic design, ${options.theme || 'modern'} style, brand colors: ${brandColors.join(', ')}, ${options.message || 'high quality content'}, clean layout, eye-catching, ${this.niche || 'business'} industry, social media optimized`;
  }

  /**
   * Helper method to generate calendar
   * @private
   */
  private generateCalendar(days: number, platforms: string[], postsPerDay: number, contentMix: any): ContentSchedule['calendar'] {
    const calendar: ContentSchedule['calendar'] = [];
    const contentTypes = ['educational', 'promotional', 'engagement', 'inspirational'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const posts = [];
      for (let p = 0; p < postsPerDay; p++) {
        for (const platform of platforms) {
          const postType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
          posts.push({
            platform,
            time: p === 0 ? '10:00 AM' : '4:00 PM',
            postType,
            topic: `${this.niche || 'Industry'} ${postType} content`,
            status: 'draft' as const,
            priority: postType === 'promotional' ? 'high' as const : 'medium' as const
          });
        }
      }

      calendar.push({
        date,
        dayOfWeek: dayNames[date.getDay()],
        posts,
        theme: i % 7 === 0 ? `Week ${Math.floor(i / 7) + 1} Theme` : undefined
      });
    }

    return calendar;
  }

  /**
   * Helper method to generate timing recommendations
   * @private
   */
  private generateTimingRecommendations(platforms: string[]): ContentSchedule['timing'] {
    return platforms.map(platform => ({
      platform,
      bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
      bestTimes: platform === 'linkedin' ? ['8:00 AM', '12:00 PM', '5:00 PM'] :
                 platform === 'instagram' ? ['11:00 AM', '1:00 PM', '7:00 PM'] :
                 ['10:00 AM', '2:00 PM', '6:00 PM'],
      frequency: '1-2 posts per day'
    }));
  }

  /**
   * Helper method to generate weekly themes
   * @private
   */
  private generateWeeklyThemes(weeks: number, niche?: string): ContentSchedule['themes'] {
    const themes = [
      'Educational Week - Tips & Tutorials',
      'Product Spotlight Week',
      'Customer Success Stories',
      'Behind the Scenes',
      'Industry News & Trends',
      'Q&A Week',
      'Motivational Week',
      'Product Benefits Week'
    ];

    return Array.from({ length: weeks }, (_, i) => ({
      week: i + 1,
      theme: themes[i % themes.length],
      topics: [
        `${niche || 'Industry'} tips`,
        'Product features',
        'Customer testimonials',
        'Company culture',
        'Market insights'
      ]
    }));
  }

  /**
   * Helper method to generate hashtag list
   * @private
   */
  private generateHashtagList(niche: string, topic: string, count: number, competition?: string): HashtagSet['hashtags'] {
    const hashtags = [];
    const nicheTag = niche.replace(/\s+/g, '');
    const topicTag = topic.replace(/\s+/g, '');

    // Branded
    hashtags.push({
      tag: `#${this.brandName?.replace(/\s+/g, '') || 'Brand'}`,
      category: 'branded' as const,
      volume: 'low' as const,
      competition: 'low' as const,
      relevance: 100,
      estimatedReach: '50-200'
    });

    // Niche hashtags
    const nicheTags = [
      `#${nicheTag}`,
      `#${nicheTag}Life`,
      `#${nicheTag}Lovers`,
      `#${nicheTag}Community`,
      `#${topicTag}`,
      `#Best${nicheTag}`,
      `#${nicheTag}Tips`
    ];

    nicheTags.forEach(tag => {
      hashtags.push({
        tag,
        category: 'niche' as const,
        volume: 'medium' as const,
        competition: 'medium' as const,
        relevance: 90,
        estimatedReach: '1K-10K'
      });
    });

    // Trending/popular
    const trendingTags = ['#Trending', '#Viral', '#Instagood', '#PhotoOfTheDay', '#InstaDaily'];
    trendingTags.forEach(tag => {
      hashtags.push({
        tag,
        category: 'trending' as const,
        volume: 'very-high' as const,
        competition: 'high' as const,
        relevance: 50,
        estimatedReach: '100K+'
      });
    });

    return hashtags.slice(0, count);
  }

  /**
   * Helper method to create hashtag sets
   * @private
   */
  private createHashtagSets(hashtags: HashtagSet['hashtags']): HashtagSet['sets'] {
    return [
      {
        name: 'High Reach Set',
        description: 'Mix of trending and niche hashtags for maximum visibility',
        tags: hashtags.filter(h => h.volume === 'high' || h.volume === 'very-high').map(h => h.tag),
        bestFor: ['New content', 'Viral potential', 'Brand awareness']
      },
      {
        name: 'Niche Engagement Set',
        description: 'Targeted hashtags for engaged community',
        tags: hashtags.filter(h => h.category === 'niche').map(h => h.tag),
        bestFor: ['Community building', 'Quality engagement', 'Targeted reach']
      },
      {
        name: 'Branded Set',
        description: 'Brand-specific hashtags for campaign tracking',
        tags: hashtags.filter(h => h.category === 'branded').map(h => h.tag),
        bestFor: ['Campaign tracking', 'UGC collection', 'Brand identity']
      }
    ];
  }

  /**
   * Helper method to generate quick hashtags
   * @private
   */
  private generateQuickHashtags(niche: string, platform: string): SocialPost['hashtags'] {
    const nicheTag = niche.replace(/\s+/g, '');

    return {
      primary: [`#${nicheTag}`, `#${nicheTag}Life`, '#Quality'],
      secondary: ['#Innovation', '#Excellence', '#Premium'],
      branded: [`#${this.brandName?.replace(/\s+/g, '') || 'Brand'}`],
      trending: platform === 'instagram' ? ['#InstaGood', '#PhotoOfTheDay'] :
                platform === 'tiktok' ? ['#FYP', '#Viral'] :
                ['#Trending']
    };
  }

  /**
   * Helper method to get best posting time
   * @private
   */
  private getBestPostingTime(platform: string): SocialPost['timing'] {
    const timings: Record<string, any> = {
      instagram: { bestDays: ['Wednesday', 'Thursday'], bestTimes: ['11:00 AM', '1:00 PM', '7:00 PM'], timezone: 'Local' },
      facebook: { bestDays: ['Tuesday', 'Wednesday', 'Friday'], bestTimes: ['1:00 PM', '3:00 PM'], timezone: 'Local' },
      twitter: { bestDays: ['Wednesday', 'Friday'], bestTimes: ['9:00 AM', '12:00 PM', '5:00 PM'], timezone: 'EST' },
      linkedin: { bestDays: ['Tuesday', 'Wednesday', 'Thursday'], bestTimes: ['8:00 AM', '12:00 PM', '5:00 PM'], timezone: 'Local' },
      tiktok: { bestDays: ['Friday', 'Saturday'], bestTimes: ['6:00 PM', '8:00 PM', '10:00 PM'], timezone: 'Local' },
      pinterest: { bestDays: ['Saturday', 'Sunday'], bestTimes: ['8:00 PM', '9:00 PM'], timezone: 'Local' }
    };

    return timings[platform] || { bestDays: ['Wednesday'], bestTimes: ['12:00 PM'], timezone: 'Local' };
  }

  /**
   * Helper method to get media type
   * @private
   */
  private getMediaType(platform: string): SocialPost['media']['type'] {
    if (platform === 'tiktok') return 'video';
    if (platform === 'instagram') return 'carousel';
    return 'image';
  }

  /**
   * Helper method to get media specifications
   * @private
   */
  private getMediaSpecs(platform: string): SocialPost['media']['specifications'] {
    const specs: Record<string, any> = {
      instagram: { dimensions: '1080x1080px', format: ['JPG', 'PNG', 'MP4'], aspectRatio: '1:1' },
      facebook: { dimensions: '1200x630px', format: ['JPG', 'PNG', 'MP4'], aspectRatio: '1.91:1' },
      twitter: { dimensions: '1200x675px', format: ['JPG', 'PNG', 'MP4', 'GIF'], aspectRatio: '16:9' },
      linkedin: { dimensions: '1200x627px', format: ['JPG', 'PNG'], aspectRatio: '1.91:1' },
      tiktok: { dimensions: '1080x1920px', duration: '15-60s', format: ['MP4'], aspectRatio: '9:16' },
      pinterest: { dimensions: '1000x1500px', format: ['JPG', 'PNG'], aspectRatio: '2:3' }
    };

    return specs[platform] || { dimensions: '1080x1080px', format: ['JPG', 'PNG'], aspectRatio: '1:1' };
  }

  /**
   * Helper method to create automation workflows
   * @private
   */
  private createAutomationWorkflows(options: AutomationOptions): AutomationSetup['workflows'] {
    return [
      {
        name: 'Welcome New Followers',
        trigger: 'New follower',
        actions: [
          {
            type: 'send_message',
            description: 'Send welcome DM',
            parameters: { message: `Thanks for following ${this.brandName}! 🎉`, delay: '5 minutes' }
          }
        ],
        frequency: 'On trigger',
        enabled: true
      },
      {
        name: 'Daily Content Publishing',
        trigger: 'Schedule: Daily at 10:00 AM',
        actions: [
          {
            type: 'publish_post',
            description: 'Publish queued content',
            parameters: { platforms: options.platforms, source: 'content_queue' }
          }
        ],
        frequency: 'Daily',
        enabled: true
      },
      {
        name: 'Engagement Monitoring',
        trigger: 'New mention or comment',
        actions: [
          {
            type: 'analyze_sentiment',
            description: 'Check sentiment of message',
            parameters: { threshold: 'negative' }
          },
          {
            type: 'notify_team',
            description: 'Alert team if negative',
            parameters: { channel: 'slack', condition: 'negative_sentiment' }
          }
        ],
        frequency: 'Real-time',
        enabled: true
      }
    ];
  }

  /**
   * Helper method to recommend automation tools
   * @private
   */
  private recommendAutomationTools(options: AutomationOptions): AutomationSetup['tools'] {
    return [
      {
        category: 'Scheduling',
        name: 'Buffer',
        purpose: 'Multi-platform content scheduling',
        features: ['Queue management', 'Analytics', 'Team collaboration', 'Optimal timing'],
        pricing: '$15-99/month',
        integration: options.platforms
      },
      {
        category: 'Analytics',
        name: 'Sprout Social',
        purpose: 'Comprehensive social media analytics',
        features: ['Cross-platform reporting', 'Competitive analysis', 'Audience insights', 'Custom reports'],
        pricing: '$249-499/month',
        integration: options.platforms
      },
      {
        category: 'Engagement',
        name: 'ManyChat',
        purpose: 'Chatbot and DM automation',
        features: ['Auto-responses', 'FAQ bots', 'Lead generation', 'Broadcast messages'],
        pricing: 'Free-$145/month',
        integration: ['facebook', 'instagram']
      },
      {
        category: 'Design',
        name: 'Canva',
        purpose: 'Graphic design and templates',
        features: ['Templates', 'Brand kit', 'Scheduling', 'Team collaboration'],
        pricing: 'Free-$12.99/month',
        integration: options.platforms
      }
    ];
  }

  /**
   * Helper method to generate campaign phases
   * @private
   */
  private generateCampaignPhases(options: CampaignOptions): SocialCampaign['phases'] {
    return [
      {
        name: 'Teaser Phase',
        duration: Math.ceil(options.duration * 0.2),
        goals: ['Build anticipation', 'Generate interest', 'Grow audience'],
        content: options.platforms.map(p => ({
          platform: p,
          posts: 3,
          types: ['teaser', 'countdown', 'behind-scenes']
        }))
      },
      {
        name: 'Launch Phase',
        duration: Math.ceil(options.duration * 0.3),
        goals: ['Announce launch', 'Drive conversions', 'Maximize reach'],
        content: options.platforms.map(p => ({
          platform: p,
          posts: 5,
          types: ['announcement', 'product showcase', 'testimonial', 'promotional']
        }))
      },
      {
        name: 'Engagement Phase',
        duration: Math.ceil(options.duration * 0.5),
        goals: ['Maintain momentum', 'Build community', 'Collect UGC'],
        content: options.platforms.map(p => ({
          platform: p,
          posts: 4,
          types: ['user-generated', 'educational', 'engagement', 'results']
        }))
      }
    ];
  }

  /**
   * Helper method to generate KPIs
   * @private
   */
  private generateKPIs(campaignType: string): SocialCampaign['kpis'] {
    const baseKPIs = [
      { metric: 'Follower Growth', target: 1000, measurement: 'New followers' },
      { metric: 'Engagement Rate', target: 5, measurement: 'Percentage' },
      { metric: 'Reach', target: 50000, measurement: 'Total reach' }
    ];

    if (campaignType === 'sales' || campaignType === 'product-launch') {
      baseKPIs.push({ metric: 'Conversions', target: 100, measurement: 'Sales/signups' });
    }

    if (campaignType === 'lead-generation') {
      baseKPIs.push({ metric: 'Leads Generated', target: 500, measurement: 'Email signups' });
    }

    return baseKPIs;
  }

  /**
   * Get current generator state
   */
  getState(): {
    hasContext: boolean;
    brandName: string | null;
    niche: string | null;
    brandVoice: string;
    brandColors: string[];
    targetAudience: string | null;
  } {
    return {
      hasContext: this.brandName !== null && this.niche !== null,
      brandName: this.brandName,
      niche: this.niche,
      brandVoice: this.brandVoice,
      brandColors: this.brandColors,
      targetAudience: this.targetAudience
    };
  }
}
