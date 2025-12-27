/**
 * WebsiteGenerator - Generates complete website structures and code
 *
 * This class provides AI-powered website generation including site structure,
 * pages, layouts, components, SEO optimization, and code generation.
 */

export interface SiteStructureOptions {
  businessType: 'ecommerce' | 'saas' | 'portfolio' | 'blog' | 'landing-page' | 'corporate';
  features?: string[];
  pages?: string[];
  hasAuth?: boolean;
  hasBlog?: boolean;
  hasEcommerce?: boolean;
}

export interface SiteStructure {
  businessType: string;
  pages: {
    name: string;
    path: string;
    parent?: string;
    children?: string[];
    purpose: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  navigation: {
    primary: NavigationItem[];
    secondary: NavigationItem[];
    footer: NavigationItem[];
    mobile: NavigationItem[];
  };
  features: {
    name: string;
    description: string;
    pages: string[];
  }[];
  sitemap: {
    url: string;
    changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
  }[];
  integrations: {
    analytics: boolean;
    seo: boolean;
    emailMarketing: boolean;
    socialMedia: boolean;
    payments?: boolean;
    cms?: boolean;
  };
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
  icon?: string;
}

export interface PageOptions {
  pageName: string;
  pageType: 'home' | 'about' | 'product' | 'service' | 'contact' | 'blog' | 'custom';
  brandName?: string;
  content?: any;
  includeForm?: boolean;
}

export interface Page {
  name: string;
  path: string;
  title: string;
  description: string;
  type: string;
  sections: PageSection[];
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    canonical?: string;
  };
  schema: {
    type: string;
    data: Record<string, any>;
  };
  scripts: {
    head: string[];
    body: string[];
  };
  styles: {
    inline?: string;
    external: string[];
  };
}

export interface PageSection {
  name: string;
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'content' | 'gallery' | 'form' | 'pricing' | 'faq' | 'stats';
  content: {
    heading?: string;
    subheading?: string;
    body?: string;
    items?: any[];
    image?: string;
    video?: string;
    cta?: {
      text: string;
      link: string;
      style: 'primary' | 'secondary' | 'outline';
    };
  };
  layout: string;
  styling: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
  };
  components: string[];
}

export interface LayoutOptions {
  layoutType: 'standard' | 'sidebar' | 'fullwidth' | 'split' | 'grid';
  header?: 'sticky' | 'fixed' | 'static';
  footer?: 'simple' | 'detailed' | 'minimal';
  brandColors?: string[];
}

export interface Layout {
  type: string;
  header: {
    style: string;
    height: string;
    components: string[];
    sticky: boolean;
    transparent: boolean;
  };
  main: {
    maxWidth: string;
    padding: string;
    backgroundColor: string;
  };
  sidebar?: {
    position: 'left' | 'right';
    width: string;
    components: string[];
  };
  footer: {
    style: string;
    columns: number;
    components: string[];
    backgroundColor: string;
  };
  grid: {
    columns: number;
    gap: string;
    responsive: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface ComponentOptions {
  componentType: 'button' | 'card' | 'form' | 'navbar' | 'hero' | 'footer' | 'testimonial' | 'pricing' | 'gallery' | 'modal';
  variant?: string;
  props?: Record<string, any>;
}

export interface Component {
  name: string;
  type: string;
  variant: string;
  props: {
    [key: string]: {
      type: string;
      default?: any;
      required: boolean;
      description: string;
    };
  };
  code: {
    tsx: string;
    css: string;
    test?: string;
  };
  usage: string;
  examples: {
    title: string;
    code: string;
    preview: string;
  }[];
  dependencies: string[];
  accessibility: {
    ariaLabels: string[];
    keyboardNav: boolean;
    screenReader: boolean;
  };
}

export interface SEOOptions {
  siteName: string;
  siteUrl: string;
  niche: string;
  targetKeywords?: string[];
  location?: string;
}

export interface SEOOptimization {
  siteName: string;
  metadata: {
    global: {
      defaultTitle: string;
      titleTemplate: string;
      defaultDescription: string;
      keywords: string[];
      author: string;
      language: string;
    };
    openGraph: {
      type: string;
      siteName: string;
      images: {
        url: string;
        width: number;
        height: number;
        alt: string;
      }[];
    };
    twitter: {
      card: string;
      site: string;
      creator: string;
    };
  };
  structured: {
    organization: Record<string, any>;
    website: Record<string, any>;
    breadcrumb?: Record<string, any>;
    product?: Record<string, any>;
  };
  sitemapXML: string;
  robotsTxt: string;
  performance: {
    lazyLoading: boolean;
    imageOptimization: boolean;
    codeMinification: boolean;
    caching: boolean;
    compression: boolean;
  };
  accessibility: {
    altTexts: boolean;
    ariaLabels: boolean;
    semanticHTML: boolean;
    colorContrast: boolean;
    keyboardNav: boolean;
  };
  recommendations: string[];
}

export interface CodeGenerationOptions {
  framework: 'react' | 'next' | 'vue' | 'svelte' | 'html';
  styling: 'tailwind' | 'css-modules' | 'styled-components' | 'sass' | 'css';
  typescript?: boolean;
  includeTests?: boolean;
}

export interface GeneratedCode {
  framework: string;
  structure: {
    path: string;
    type: 'file' | 'directory';
    content?: string;
  }[];
  files: {
    [key: string]: {
      path: string;
      content: string;
      language: string;
    };
  };
  dependencies: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  scripts: {
    [key: string]: string;
  };
  configuration: {
    [key: string]: any;
  };
  deployment: {
    platform: string;
    config: any;
    steps: string[];
  };
  documentation: {
    readme: string;
    setup: string;
    deployment: string;
    contributing?: string;
  };
}

export class WebsiteGenerator {
  private brandName: string | null = null;
  private niche: string | null = null;
  private brandColors: string[] = [];
  private siteUrl: string | null = null;

  /**
   * Set context for website generation
   * @param brandName - The brand name
   * @param niche - The niche/industry
   * @param brandColors - Brand color palette
   * @param siteUrl - Website URL
   */
  setContext(
    brandName: string,
    niche: string,
    brandColors?: string[],
    siteUrl?: string
  ): void {
    this.brandName = brandName;
    this.niche = niche;
    this.brandColors = brandColors || [];
    this.siteUrl = siteUrl || null;
  }

  /**
   * Create overall site structure with pages and navigation
   * @param options - Site structure options
   * @returns Complete site structure with navigation and features
   */
  async createSiteStructure(options: SiteStructureOptions): Promise<SiteStructure> {
    // TODO: Implement AI-powered site structure planning
    // This would typically involve:
    // - User flow analysis
    // - Information architecture best practices
    // - Competitor site analysis
    // - Industry-specific page recommendations
    // - Conversion funnel optimization
    // - SEO-friendly URL structure

    console.log(`Creating ${options.businessType} site structure...`);

    const defaultPages = this.getDefaultPages(options.businessType);
    const customPages = options.pages || [];
    const allPages = [...defaultPages, ...customPages.map(p => ({
      name: p,
      path: `/${p.toLowerCase().replace(/\s+/g, '-')}`,
      purpose: `Custom ${p} page`,
      priority: 'medium' as const
    }))];

    // Add conditional pages
    if (options.hasBlog) {
      allPages.push({
        name: 'Blog',
        path: '/blog',
        purpose: 'Content marketing and SEO',
        priority: 'high'
      });
    }

    if (options.hasEcommerce) {
      allPages.push(
        {
          name: 'Products',
          path: '/products',
          purpose: 'Product catalog',
          priority: 'high'
        },
        {
          name: 'Cart',
          path: '/cart',
          purpose: 'Shopping cart',
          priority: 'high'
        },
        {
          name: 'Checkout',
          path: '/checkout',
          purpose: 'Purchase completion',
          priority: 'high'
        }
      );
    }

    if (options.hasAuth) {
      allPages.push(
        {
          name: 'Login',
          path: '/login',
          purpose: 'User authentication',
          priority: 'medium'
        },
        {
          name: 'Sign Up',
          path: '/signup',
          purpose: 'User registration',
          priority: 'medium'
        },
        {
          name: 'Dashboard',
          path: '/dashboard',
          purpose: 'User account management',
          priority: 'medium'
        }
      );
    }

    const navigation = this.generateNavigation(allPages, options);

    return {
      businessType: options.businessType,
      pages: allPages,
      navigation,
      features: options.features?.map(f => ({
        name: f,
        description: `${f} functionality`,
        pages: this.getPagesForFeature(f, allPages)
      })) || [],
      sitemap: allPages.map(page => ({
        url: page.path,
        changeFreq: page.priority === 'high' ? 'daily' : page.priority === 'medium' ? 'weekly' : 'monthly',
        priority: page.priority === 'high' ? 1.0 : page.priority === 'medium' ? 0.7 : 0.5
      })),
      integrations: {
        analytics: true,
        seo: true,
        emailMarketing: options.businessType !== 'portfolio',
        socialMedia: true,
        payments: options.hasEcommerce,
        cms: options.hasBlog
      }
    };
  }

  /**
   * Generate individual page content and structure
   * @param options - Page generation options
   * @returns Complete page with sections and metadata
   */
  async generatePages(options: PageOptions): Promise<Page> {
    // TODO: Implement AI-powered page content generation
    // This would typically involve:
    // - Content strategy based on page purpose
    // - Conversion-optimized layouts
    // - Industry-specific best practices
    // - A/B testing recommendations
    // - Accessibility compliance
    // - Mobile-first design

    console.log(`Generating ${options.pageType} page: ${options.pageName}...`);

    const sections = this.generatePageSections(options.pageType, options);
    const metadata = this.generatePageMetadata(options);

    return {
      name: options.pageName,
      path: `/${options.pageName.toLowerCase().replace(/\s+/g, '-')}`,
      title: `${options.pageName} | ${options.brandName || this.brandName || 'Website'}`,
      description: metadata.description,
      type: options.pageType,
      sections,
      metadata,
      schema: this.generateSchema(options.pageType, options),
      scripts: {
        head: [
          '<!-- Google Analytics -->',
          '<!-- Meta Pixel -->'
        ],
        body: [
          '<!-- Chat Widget -->',
          '<!-- Cookie Consent -->'
        ]
      },
      styles: {
        external: [
          '/styles/global.css',
          '/styles/components.css'
        ]
      }
    };
  }

  /**
   * Design layout system with responsive grid
   * @param options - Layout design options
   * @returns Complete layout configuration
   */
  async designLayout(options: LayoutOptions): Promise<Layout> {
    // TODO: Implement AI-powered layout design
    // This would typically involve:
    // - Responsive design patterns
    // - Grid system optimization
    // - Typography scale generation
    // - Color system application
    // - Spacing system creation
    // - Breakpoint optimization

    console.log(`Designing ${options.layoutType} layout...`);

    const brandColors = options.brandColors || this.brandColors;

    return {
      type: options.layoutType,
      header: {
        style: options.header || 'sticky',
        height: '80px',
        components: ['Logo', 'Navigation', 'CTA Button'],
        sticky: options.header === 'sticky' || options.header === 'fixed',
        transparent: false
      },
      main: {
        maxWidth: options.layoutType === 'fullwidth' ? '100%' : '1280px',
        padding: '0 1.5rem',
        backgroundColor: '#FFFFFF'
      },
      sidebar: options.layoutType === 'sidebar' ? {
        position: 'right',
        width: '300px',
        components: ['Search', 'Categories', 'Recent Posts', 'Newsletter']
      } : undefined,
      footer: {
        style: options.footer || 'detailed',
        columns: options.footer === 'minimal' ? 1 : options.footer === 'simple' ? 2 : 4,
        components: [
          'About',
          'Quick Links',
          'Contact Info',
          'Social Media',
          'Newsletter',
          'Copyright'
        ],
        backgroundColor: brandColors[0] || '#1F2937'
      },
      grid: {
        columns: 12,
        gap: '1.5rem',
        responsive: {
          mobile: 4,
          tablet: 8,
          desktop: 12
        }
      },
      breakpoints: {
        mobile: '640px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1280px'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      }
    };
  }

  /**
   * Create reusable UI components
   * @param options - Component creation options
   * @returns Complete component with code and documentation
   */
  async createComponents(options: ComponentOptions): Promise<Component> {
    // TODO: Implement AI-powered component generation
    // This would typically involve:
    // - Design system compliance
    // - Accessibility best practices
    // - Component composition patterns
    // - State management integration
    // - Testing utilities
    // - Storybook integration

    console.log(`Creating ${options.componentType} component...`);

    const component = this.generateComponentCode(options);

    return {
      name: this.capitalize(options.componentType),
      type: options.componentType,
      variant: options.variant || 'default',
      props: component.props,
      code: component.code,
      usage: component.usage,
      examples: component.examples,
      dependencies: component.dependencies,
      accessibility: {
        ariaLabels: component.ariaLabels,
        keyboardNav: true,
        screenReader: true
      }
    };
  }

  /**
   * Optimize site for SEO
   * @param options - SEO optimization options
   * @returns Complete SEO configuration and recommendations
   */
  async optimizeSEO(options: SEOOptions): Promise<SEOOptimization> {
    // TODO: Implement comprehensive SEO optimization
    // This would typically involve:
    // - Keyword research and analysis
    // - Competitor SEO analysis
    // - Technical SEO audit
    // - Schema markup generation
    // - Sitemap optimization
    // - Performance optimization
    // - Core Web Vitals improvement

    console.log(`Optimizing SEO for ${options.siteName}...`);

    const keywords = options.targetKeywords || [
      options.niche,
      `${options.niche} services`,
      `best ${options.niche}`,
      `${options.niche} near me`
    ];

    const sitemapXML = this.generateSitemapXML(options.siteUrl);
    const robotsTxt = this.generateRobotsTxt(options.siteUrl);

    return {
      siteName: options.siteName,
      metadata: {
        global: {
          defaultTitle: options.siteName,
          titleTemplate: `%s | ${options.siteName}`,
          defaultDescription: `${options.siteName} - Premium ${options.niche} solutions. Discover quality, innovation, and excellence.`,
          keywords,
          author: options.siteName,
          language: 'en'
        },
        openGraph: {
          type: 'website',
          siteName: options.siteName,
          images: [{
            url: `${options.siteUrl}/og-image.jpg`,
            width: 1200,
            height: 630,
            alt: `${options.siteName} - ${options.niche}`
          }]
        },
        twitter: {
          card: 'summary_large_image',
          site: `@${options.siteName.replace(/\s+/g, '')}`,
          creator: `@${options.siteName.replace(/\s+/g, '')}`
        }
      },
      structured: {
        organization: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: options.siteName,
          url: options.siteUrl,
          logo: `${options.siteUrl}/logo.png`,
          description: `Premium ${options.niche} solutions`,
          address: options.location ? {
            '@type': 'PostalAddress',
            addressLocality: options.location
          } : undefined,
          sameAs: [
            `https://facebook.com/${options.siteName.replace(/\s+/g, '')}`,
            `https://twitter.com/${options.siteName.replace(/\s+/g, '')}`,
            `https://instagram.com/${options.siteName.replace(/\s+/g, '')}`
          ]
        },
        website: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: options.siteName,
          url: options.siteUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${options.siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }
      },
      sitemapXML,
      robotsTxt,
      performance: {
        lazyLoading: true,
        imageOptimization: true,
        codeMinification: true,
        caching: true,
        compression: true
      },
      accessibility: {
        altTexts: true,
        ariaLabels: true,
        semanticHTML: true,
        colorContrast: true,
        keyboardNav: true
      },
      recommendations: [
        'Implement lazy loading for images and videos',
        'Use next-gen image formats (WebP, AVIF)',
        'Minimize render-blocking resources',
        'Implement proper heading hierarchy (H1-H6)',
        'Add descriptive alt text to all images',
        'Use semantic HTML5 elements',
        'Implement breadcrumb navigation',
        'Create XML sitemap and submit to search engines',
        'Set up Google Search Console and Analytics',
        'Optimize Core Web Vitals (LCP, FID, CLS)',
        'Implement HTTPS throughout the site',
        'Create mobile-friendly responsive design',
        'Add structured data for rich snippets',
        'Optimize page load speed (< 3 seconds)',
        'Create quality, keyword-optimized content regularly'
      ]
    };
  }

  /**
   * Generate production-ready code for the website
   * @param siteStructure - Site structure from createSiteStructure
   * @param pages - Generated pages
   * @param layout - Layout configuration
   * @param options - Code generation options
   * @returns Complete codebase with deployment configuration
   */
  async generateCode(
    siteStructure: SiteStructure,
    pages: Page[],
    layout: Layout,
    options: CodeGenerationOptions
  ): Promise<GeneratedCode> {
    // TODO: Implement AI-powered code generation
    // This would typically involve:
    // - Framework-specific code generation
    // - Component library integration
    // - State management setup
    // - API integration
    // - Testing infrastructure
    // - CI/CD pipeline configuration
    // - Deployment automation

    console.log(`Generating ${options.framework} code with ${options.styling}...`);

    const structure = this.generateFileStructure(options.framework);
    const files = this.generateProjectFiles(siteStructure, pages, layout, options);
    const dependencies = this.generateDependencies(options);
    const scripts = this.generateScripts(options.framework);
    const configuration = this.generateConfiguration(options);
    const deployment = this.generateDeploymentConfig(options.framework);
    const documentation = this.generateDocumentation(options);

    return {
      framework: options.framework,
      structure,
      files,
      dependencies,
      scripts,
      configuration,
      deployment,
      documentation
    };
  }

  /**
   * Helper method to get default pages for business type
   * @private
   */
  private getDefaultPages(businessType: string): SiteStructure['pages'] {
    const commonPages = [
      { name: 'Home', path: '/', purpose: 'Homepage and first impression', priority: 'high' as const },
      { name: 'About', path: '/about', purpose: 'Company information and story', priority: 'high' as const },
      { name: 'Contact', path: '/contact', purpose: 'Contact information and form', priority: 'high' as const }
    ];

    switch (businessType) {
      case 'ecommerce':
        return [
          ...commonPages,
          { name: 'Shop', path: '/shop', purpose: 'Product catalog', priority: 'high' as const },
          { name: 'Product Detail', path: '/product/:id', purpose: 'Individual product pages', priority: 'high' as const }
        ];
      case 'saas':
        return [
          ...commonPages,
          { name: 'Features', path: '/features', purpose: 'Product features showcase', priority: 'high' as const },
          { name: 'Pricing', path: '/pricing', purpose: 'Pricing plans', priority: 'high' as const },
          { name: 'Documentation', path: '/docs', purpose: 'Product documentation', priority: 'medium' as const }
        ];
      case 'portfolio':
        return [
          ...commonPages,
          { name: 'Portfolio', path: '/portfolio', purpose: 'Work showcase', priority: 'high' as const },
          { name: 'Services', path: '/services', purpose: 'Services offered', priority: 'high' as const }
        ];
      case 'blog':
        return [
          ...commonPages,
          { name: 'Blog', path: '/blog', purpose: 'Blog listing', priority: 'high' as const },
          { name: 'Post', path: '/blog/:slug', purpose: 'Individual blog posts', priority: 'high' as const }
        ];
      case 'landing-page':
        return [
          { name: 'Home', path: '/', purpose: 'Single landing page', priority: 'high' as const }
        ];
      case 'corporate':
      default:
        return [
          ...commonPages,
          { name: 'Services', path: '/services', purpose: 'Services offered', priority: 'high' as const },
          { name: 'Team', path: '/team', purpose: 'Team members', priority: 'medium' as const }
        ];
    }
  }

  /**
   * Helper method to generate navigation structure
   * @private
   */
  private generateNavigation(pages: SiteStructure['pages'], options: SiteStructureOptions): SiteStructure['navigation'] {
    const primaryPages = pages.filter(p => p.priority === 'high' && !p.path.includes(':'));

    return {
      primary: primaryPages.slice(0, 5).map(p => ({
        label: p.name,
        href: p.path
      })),
      secondary: [
        { label: 'Login', href: '/login' },
        { label: 'Sign Up', href: '/signup' }
      ],
      footer: [
        {
          label: 'Company',
          href: '#',
          children: [
            { label: 'About', href: '/about' },
            { label: 'Team', href: '/team' },
            { label: 'Careers', href: '/careers' }
          ]
        },
        {
          label: 'Resources',
          href: '#',
          children: [
            { label: 'Blog', href: '/blog' },
            { label: 'Help Center', href: '/help' },
            { label: 'FAQ', href: '/faq' }
          ]
        },
        {
          label: 'Legal',
          href: '#',
          children: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Cookies', href: '/cookies' }
          ]
        }
      ],
      mobile: primaryPages.map(p => ({
        label: p.name,
        href: p.path
      }))
    };
  }

  /**
   * Helper method to get pages for a feature
   * @private
   */
  private getPagesForFeature(feature: string, pages: SiteStructure['pages']): string[] {
    // Simple mapping - in production this would be more sophisticated
    return pages.slice(0, 2).map(p => p.path);
  }

  /**
   * Helper method to generate page sections
   * @private
   */
  private generatePageSections(pageType: string, options: PageOptions): PageSection[] {
    const brandName = options.brandName || this.brandName || 'Brand';

    switch (pageType) {
      case 'home':
        return [
          {
            name: 'Hero',
            type: 'hero',
            content: {
              heading: `Welcome to ${brandName}`,
              subheading: `Premium ${this.niche || 'solutions'} for discerning customers`,
              body: 'Discover excellence in every detail',
              cta: { text: 'Get Started', link: '/products', style: 'primary' }
            },
            layout: 'centered',
            styling: { backgroundColor: this.brandColors[0] || '#FFFFFF', padding: '6rem 0' },
            components: ['Heading', 'Paragraph', 'Button', 'Image']
          },
          {
            name: 'Features',
            type: 'features',
            content: {
              heading: 'Why Choose Us',
              items: [
                { title: 'Quality', description: 'Premium materials and craftsmanship', icon: 'star' },
                { title: 'Innovation', description: 'Cutting-edge solutions', icon: 'lightbulb' },
                { title: 'Support', description: '24/7 customer service', icon: 'headset' }
              ]
            },
            layout: 'grid-3',
            styling: { padding: '4rem 0' },
            components: ['FeatureCard', 'Grid']
          },
          {
            name: 'CTA',
            type: 'cta',
            content: {
              heading: 'Ready to Get Started?',
              body: 'Join thousands of satisfied customers today',
              cta: { text: 'Start Free Trial', link: '/signup', style: 'primary' }
            },
            layout: 'centered',
            styling: { backgroundColor: this.brandColors[1] || '#F3F4F6', padding: '4rem 0' },
            components: ['Heading', 'Button']
          }
        ];

      case 'about':
        return [
          {
            name: 'Story',
            type: 'content',
            content: {
              heading: `About ${brandName}`,
              body: `${brandName} was founded with a simple mission: to deliver exceptional ${this.niche || 'products'} that make a difference in people's lives.`
            },
            layout: 'split',
            styling: { padding: '4rem 0' },
            components: ['Heading', 'Paragraph', 'Image']
          },
          {
            name: 'Stats',
            type: 'stats',
            content: {
              items: [
                { value: '10,000+', label: 'Happy Customers' },
                { value: '50+', label: 'Products' },
                { value: '99%', label: 'Satisfaction Rate' }
              ]
            },
            layout: 'grid-3',
            styling: { padding: '4rem 0' },
            components: ['StatCard', 'Grid']
          }
        ];

      case 'contact':
        return [
          {
            name: 'Contact Form',
            type: 'form',
            content: {
              heading: 'Get In Touch',
              body: 'We\'d love to hear from you'
            },
            layout: 'split',
            styling: { padding: '4rem 0' },
            components: ['Form', 'Input', 'Textarea', 'Button']
          }
        ];

      default:
        return [
          {
            name: 'Content',
            type: 'content',
            content: {
              heading: options.pageName,
              body: `Content for ${options.pageName} page`
            },
            layout: 'standard',
            styling: { padding: '4rem 0' },
            components: ['Heading', 'Paragraph']
          }
        ];
    }
  }

  /**
   * Helper method to generate page metadata
   * @private
   */
  private generatePageMetadata(options: PageOptions): Page['metadata'] {
    const brandName = options.brandName || this.brandName || 'Website';

    return {
      title: `${options.pageName} | ${brandName}`,
      description: `${options.pageName} page for ${brandName}. ${this.niche ? `Premium ${this.niche} solutions.` : ''}`,
      keywords: [
        options.pageName.toLowerCase(),
        brandName.toLowerCase(),
        this.niche?.toLowerCase() || '',
        options.pageType
      ].filter(Boolean),
      ogImage: '/og-image.jpg',
      canonical: `${this.siteUrl}${options.pageName.toLowerCase().replace(/\s+/g, '-')}`
    };
  }

  /**
   * Helper method to generate schema markup
   * @private
   */
  private generateSchema(pageType: string, options: PageOptions): Page['schema'] {
    if (pageType === 'product') {
      return {
        type: 'Product',
        data: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: options.pageName,
          description: 'Product description',
          offers: {
            '@type': 'Offer',
            price: '99.99',
            priceCurrency: 'USD'
          }
        }
      };
    }

    return {
      type: 'WebPage',
      data: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: options.pageName,
        description: `${options.pageName} page`
      }
    };
  }

  /**
   * Helper method to generate component code
   * @private
   */
  private generateComponentCode(options: ComponentOptions): any {
    const componentName = this.capitalize(options.componentType);

    if (options.componentType === 'button') {
      return {
        props: {
          variant: {
            type: 'string',
            default: 'primary',
            required: false,
            description: 'Button style variant'
          },
          size: {
            type: 'string',
            default: 'medium',
            required: false,
            description: 'Button size'
          },
          onClick: {
            type: 'function',
            required: false,
            description: 'Click handler'
          },
          children: {
            type: 'node',
            required: true,
            description: 'Button content'
          }
        },
        code: {
          tsx: `import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  onClick,
  children
}) => {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`,
          css: `.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: ${this.brandColors[0] || '#3B82F6'};
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background-color: ${this.brandColors[1] || '#6B7280'};
  color: white;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid ${this.brandColors[0] || '#3B82F6'};
  color: ${this.brandColors[0] || '#3B82F6'};
}

.btn-small { padding: 0.5rem 1rem; font-size: 0.875rem; }
.btn-medium { padding: 0.75rem 1.5rem; }
.btn-large { padding: 1rem 2rem; font-size: 1.125rem; }`,
          test: `import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});`
        },
        usage: `import { Button } from './components/Button';

<Button variant="primary" size="medium" onClick={handleClick}>
  Click Me
</Button>`,
        examples: [
          {
            title: 'Primary Button',
            code: '<Button variant="primary">Click Me</Button>',
            preview: 'Blue button with white text'
          },
          {
            title: 'Outline Button',
            code: '<Button variant="outline" size="large">Learn More</Button>',
            preview: 'Transparent button with border'
          }
        ],
        dependencies: ['react'],
        ariaLabels: ['aria-label', 'aria-pressed']
      };
    }

    // Default component structure
    return {
      props: {},
      code: {
        tsx: `// ${componentName} component code`,
        css: `/* ${componentName} styles */`
      },
      usage: `<${componentName} />`,
      examples: [],
      dependencies: ['react'],
      ariaLabels: []
    };
  }

  /**
   * Helper method to generate sitemap XML
   * @private
   */
  private generateSitemapXML(siteUrl: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
  }

  /**
   * Helper method to generate robots.txt
   * @private
   */
  private generateRobotsTxt(siteUrl: string): string {
    return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;
  }

  /**
   * Helper method to generate file structure
   * @private
   */
  private generateFileStructure(framework: string): GeneratedCode['structure'] {
    if (framework === 'next') {
      return [
        { path: 'src', type: 'directory' },
        { path: 'src/app', type: 'directory' },
        { path: 'src/components', type: 'directory' },
        { path: 'src/lib', type: 'directory' },
        { path: 'public', type: 'directory' },
        { path: 'public/images', type: 'directory' }
      ];
    }

    return [
      { path: 'src', type: 'directory' },
      { path: 'src/components', type: 'directory' },
      { path: 'src/pages', type: 'directory' },
      { path: 'public', type: 'directory' }
    ];
  }

  /**
   * Helper method to generate project files
   * @private
   */
  private generateProjectFiles(
    siteStructure: SiteStructure,
    pages: Page[],
    layout: Layout,
    options: CodeGenerationOptions
  ): GeneratedCode['files'] {
    return {
      'package.json': {
        path: 'package.json',
        content: JSON.stringify({
          name: this.brandName?.toLowerCase().replace(/\s+/g, '-') || 'website',
          version: '1.0.0',
          private: true,
          scripts: this.generateScripts(options.framework)
        }, null, 2),
        language: 'json'
      },
      'README.md': {
        path: 'README.md',
        content: `# ${this.brandName || 'Website'}\n\nGenerated with Niche Empire Builder`,
        language: 'markdown'
      }
    };
  }

  /**
   * Helper method to generate dependencies
   * @private
   */
  private generateDependencies(options: CodeGenerationOptions): GeneratedCode['dependencies'] {
    const base = {
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0'
      }
    };

    if (options.framework === 'next') {
      base.dependencies['next'] = '^14.0.0';
    }

    if (options.styling === 'tailwind') {
      base.devDependencies['tailwindcss'] = '^3.3.0';
      base.devDependencies['autoprefixer'] = '^10.4.0';
      base.devDependencies['postcss'] = '^8.4.0';
    }

    if (options.typescript) {
      base.devDependencies['typescript'] = '^5.0.0';
    }

    return base;
  }

  /**
   * Helper method to generate npm scripts
   * @private
   */
  private generateScripts(framework: string): Record<string, string> {
    if (framework === 'next') {
      return {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      };
    }

    return {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    };
  }

  /**
   * Helper method to generate configuration
   * @private
   */
  private generateConfiguration(options: CodeGenerationOptions): any {
    return {
      framework: options.framework,
      styling: options.styling,
      typescript: options.typescript
    };
  }

  /**
   * Helper method to generate deployment config
   * @private
   */
  private generateDeploymentConfig(framework: string): GeneratedCode['deployment'] {
    return {
      platform: framework === 'next' ? 'Vercel' : 'Netlify',
      config: {
        buildCommand: framework === 'next' ? 'next build' : 'npm run build',
        outputDirectory: framework === 'next' ? '.next' : 'dist'
      },
      steps: [
        'Connect repository to hosting platform',
        'Configure build settings',
        'Set environment variables',
        'Deploy to production'
      ]
    };
  }

  /**
   * Helper method to generate documentation
   * @private
   */
  private generateDocumentation(options: CodeGenerationOptions): GeneratedCode['documentation'] {
    return {
      readme: `# ${this.brandName || 'Website'}\n\nBuilt with ${options.framework}`,
      setup: 'Run npm install to install dependencies',
      deployment: 'Deploy to Vercel or Netlify',
      contributing: 'Please read CONTRIBUTING.md for details'
    };
  }

  /**
   * Helper method to capitalize string
   * @private
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Get current generator state
   */
  getState(): {
    hasContext: boolean;
    brandName: string | null;
    niche: string | null;
    brandColors: string[];
    siteUrl: string | null;
  } {
    return {
      hasContext: this.brandName !== null && this.niche !== null,
      brandName: this.brandName,
      niche: this.niche,
      brandColors: this.brandColors,
      siteUrl: this.siteUrl
    };
  }
}
