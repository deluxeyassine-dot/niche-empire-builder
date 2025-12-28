/**
 * DefaultTemplate - Complete website template generator
 *
 * Generates modern, responsive e-commerce website templates with:
 * - Homepage with hero section, features, products
 * - Product pages with galleries and descriptions
 * - About page with company story
 * - Contact page with forms
 * - Blog layout with article listings
 * - Navigation system
 * - Mobile-responsive design
 * - SEO-optimized structure
 */

import { getSEOOptimizer, MetaTags } from '../../utils/SEOOptimizer';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Website configuration
 */
export interface WebsiteConfig {
  siteName: string;
  tagline?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  font?: string;
  baseUrl?: string;
  currency?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

/**
 * Page content structure
 */
export interface PageContent {
  title: string;
  description: string;
  content: string;
  metaTags?: MetaTags;
  schema?: any;
}

/**
 * Product data
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  image: string;
  images?: string[];
  features?: string[];
  category?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  sku?: string;
}

/**
 * Blog post data
 */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: Date;
  image?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
}

/**
 * Navigation item
 */
export interface NavItem {
  label: string;
  url: string;
  children?: NavItem[];
  icon?: string;
}

export class DefaultTemplate {
  private config: WebsiteConfig;
  private outputDir: string;
  private seo: any;

  constructor(config: WebsiteConfig, outputDir: string = './generated-website') {
    this.config = {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#f59e0b',
      font: 'Inter, system-ui, -apple-system, sans-serif',
      currency: 'USD',
      baseUrl: 'https://example.com',
      ...config
    };

    this.outputDir = outputDir;
    this.seo = getSEOOptimizer();

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate complete homepage
   *
   * @param options - Homepage content options
   * @returns Complete HTML for homepage
   */
  generateHomepage(options: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage?: string;
    heroCtaText?: string;
    heroCtaUrl?: string;
    features?: Array<{ title: string; description: string; icon?: string }>;
    featuredProducts?: Product[];
    testimonials?: Array<{ name: string; text: string; rating?: number; image?: string }>;
  }): string {
    console.log('🏠 Generating homepage...');

    const metaTags = this.generateMetaTags({
      title: `${this.config.siteName} - ${this.config.tagline || options.heroTitle}`,
      description: options.heroSubtitle,
      url: this.config.baseUrl
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    ${this.generateHead(metaTags)}
    <style>
        ${this.generateGlobalStyles()}
        ${this.generateHomepageStyles()}
    </style>
</head>
<body>
    ${this.generateNavigation()}

    <!-- Hero Section -->
    <section class="hero">
        ${options.heroImage ? `<div class="hero-background" style="background-image: url('${options.heroImage}');"></div>` : ''}
        <div class="hero-content">
            <div class="container">
                <h1 class="hero-title">${options.heroTitle}</h1>
                <p class="hero-subtitle">${options.heroSubtitle}</p>
                ${options.heroCtaText ? `
                <a href="${options.heroCtaUrl || '#products'}" class="btn btn-primary btn-lg">
                    ${options.heroCtaText}
                </a>
                ` : ''}
            </div>
        </div>
    </section>

    ${options.features ? this.generateFeaturesSection(options.features) : ''}

    ${options.featuredProducts ? this.generateProductGrid(options.featuredProducts, 'Featured Products') : ''}

    ${options.testimonials ? this.generateTestimonialsSection(options.testimonials) : ''}

    ${this.generateFooter()}

    <script>
        ${this.generateJavaScript()}
    </script>
</body>
</html>`;

    this.saveToFile('index.html', html);
    return html;
  }

  /**
   * Create product page
   *
   * @param product - Product data
   * @returns Complete HTML for product page
   */
  createProductPages(product: Product): string {
    console.log(`📦 Creating product page for: ${product.name}`);

    const metaTags = this.generateMetaTags({
      title: `${product.name} - ${this.config.siteName}`,
      description: product.description,
      url: `${this.config.baseUrl}/products/${product.id}`,
      image: product.image
    });

    // Generate product schema
    const productSchema = this.seo.generateSchema('Product', {
      name: product.name,
      description: product.description,
      image: product.images || [product.image],
      sku: product.sku || product.id,
      brand: {
        '@type': 'Brand',
        name: this.config.siteName
      },
      offers: {
        '@type': 'Offer',
        price: product.price.toString(),
        priceCurrency: product.currency || 'USD',
        availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      },
      ...(product.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.toString(),
          reviewCount: (product.reviews || 0).toString()
        }
      })
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    ${this.generateHead(metaTags, productSchema)}
    <style>
        ${this.generateGlobalStyles()}
        ${this.generateProductPageStyles()}
    </style>
</head>
<body>
    ${this.generateNavigation()}

    <main class="container product-page">
        <div class="breadcrumb">
            <a href="/">Home</a> /
            <a href="/products">Products</a> /
            ${product.category ? `<a href="/products/${product.category}">${product.category}</a> / ` : ''}
            <span>${product.name}</span>
        </div>

        <div class="product-container">
            <!-- Product Images -->
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}" id="mainProductImage">
                </div>
                ${product.images && product.images.length > 1 ? `
                <div class="thumbnail-gallery">
                    ${product.images.map((img, i) => `
                        <img src="${img}"
                             alt="${product.name} - View ${i + 1}"
                             class="thumbnail ${i === 0 ? 'active' : ''}"
                             onclick="changeProductImage('${img}', this)">
                    `).join('')}
                </div>
                ` : ''}
            </div>

            <!-- Product Details -->
            <div class="product-details">
                <h1 class="product-title">${product.name}</h1>

                ${product.rating ? `
                <div class="product-rating">
                    ${this.generateStarRating(product.rating)}
                    <span class="rating-text">${product.rating} (${product.reviews || 0} reviews)</span>
                </div>
                ` : ''}

                <div class="product-price">
                    <span class="currency">${this.getCurrencySymbol(product.currency)}</span>
                    <span class="amount">${product.price.toFixed(2)}</span>
                </div>

                <div class="product-description">
                    ${product.description}
                </div>

                ${product.features && product.features.length > 0 ? `
                <div class="product-features">
                    <h3>Key Features</h3>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <div class="product-actions">
                    ${product.inStock !== false ? `
                        <button class="btn btn-primary btn-lg add-to-cart" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                        <button class="btn btn-outline btn-lg" onclick="addToWishlist('${product.id}')">
                            ♥ Add to Wishlist
                        </button>
                    ` : `
                        <div class="out-of-stock">
                            <span>Currently Out of Stock</span>
                            <button class="btn btn-outline" onclick="notifyWhenAvailable('${product.id}')">
                                Notify When Available
                            </button>
                        </div>
                    `}
                </div>

                <div class="product-meta">
                    ${product.sku ? `<p><strong>SKU:</strong> ${product.sku}</p>` : ''}
                    ${product.category ? `<p><strong>Category:</strong> ${product.category}</p>` : ''}
                </div>
            </div>
        </div>

        <!-- Related Products Section -->
        <section class="related-products">
            <h2>You May Also Like</h2>
            <div id="relatedProductsContainer"></div>
        </section>
    </main>

    ${this.generateFooter()}

    <script>
        ${this.generateJavaScript()}
        ${this.generateProductPageJS(product)}
    </script>
</body>
</html>`;

    this.saveToFile(`products/${product.id}.html`, html);
    return html;
  }

  /**
   * Build about page
   *
   * @param options - About page content
   * @returns Complete HTML for about page
   */
  buildAboutPage(options: {
    title: string;
    story: string;
    mission?: string;
    vision?: string;
    values?: string[];
    team?: Array<{ name: string; role: string; image?: string; bio?: string }>;
  }): string {
    console.log('ℹ️ Building about page...');

    const metaTags = this.generateMetaTags({
      title: `About Us - ${this.config.siteName}`,
      description: options.story.substring(0, 160),
      url: `${this.config.baseUrl}/about`
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    ${this.generateHead(metaTags)}
    <style>
        ${this.generateGlobalStyles()}
        ${this.generateAboutPageStyles()}
    </style>
</head>
<body>
    ${this.generateNavigation()}

    <main class="about-page">
        <!-- Hero Section -->
        <section class="page-hero">
            <div class="container">
                <h1>${options.title}</h1>
            </div>
        </section>

        <!-- Story Section -->
        <section class="story-section">
            <div class="container">
                <div class="content-wrapper">
                    ${options.story}
                </div>
            </div>
        </section>

        <!-- Mission & Vision -->
        ${options.mission || options.vision ? `
        <section class="mission-vision">
            <div class="container">
                <div class="grid-2">
                    ${options.mission ? `
                    <div class="card">
                        <h2>Our Mission</h2>
                        <p>${options.mission}</p>
                    </div>
                    ` : ''}
                    ${options.vision ? `
                    <div class="card">
                        <h2>Our Vision</h2>
                        <p>${options.vision}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        </section>
        ` : ''}

        <!-- Values -->
        ${options.values && options.values.length > 0 ? `
        <section class="values-section">
            <div class="container">
                <h2>Our Values</h2>
                <div class="values-grid">
                    ${options.values.map(value => `
                        <div class="value-card">
                            <h3>${value}</h3>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        <!-- Team Section -->
        ${options.team && options.team.length > 0 ? `
        <section class="team-section">
            <div class="container">
                <h2>Meet Our Team</h2>
                <div class="team-grid">
                    ${options.team.map(member => `
                        <div class="team-member">
                            ${member.image ? `
                                <img src="${member.image}" alt="${member.name}" class="team-photo">
                            ` : `
                                <div class="team-photo-placeholder">${member.name.charAt(0)}</div>
                            `}
                            <h3>${member.name}</h3>
                            <p class="role">${member.role}</p>
                            ${member.bio ? `<p class="bio">${member.bio}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}
    </main>

    ${this.generateFooter()}

    <script>
        ${this.generateJavaScript()}
    </script>
</body>
</html>`;

    this.saveToFile('about.html', html);
    return html;
  }

  /**
   * Create contact page
   *
   * @param options - Contact page options
   * @returns Complete HTML for contact page
   */
  createContactPage(options: {
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
    mapEmbedUrl?: string;
  }): string {
    console.log('📞 Creating contact page...');

    const metaTags = this.generateMetaTags({
      title: `Contact Us - ${this.config.siteName}`,
      description: `Get in touch with ${this.config.siteName}. We're here to help!`,
      url: `${this.config.baseUrl}/contact`
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    ${this.generateHead(metaTags)}
    <style>
        ${this.generateGlobalStyles()}
        ${this.generateContactPageStyles()}
    </style>
</head>
<body>
    ${this.generateNavigation()}

    <main class="contact-page">
        <section class="page-hero">
            <div class="container">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you</p>
            </div>
        </section>

        <section class="contact-content">
            <div class="container">
                <div class="contact-grid">
                    <!-- Contact Form -->
                    <div class="contact-form-wrapper">
                        <h2>Send us a message</h2>
                        <form id="contactForm" class="contact-form" onsubmit="return handleContactSubmit(event)">
                            <div class="form-group">
                                <label for="name">Name *</label>
                                <input type="text" id="name" name="name" required>
                            </div>

                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input type="email" id="email" name="email" required>
                            </div>

                            <div class="form-group">
                                <label for="phone">Phone</label>
                                <input type="tel" id="phone" name="phone">
                            </div>

                            <div class="form-group">
                                <label for="subject">Subject *</label>
                                <input type="text" id="subject" name="subject" required>
                            </div>

                            <div class="form-group">
                                <label for="message">Message *</label>
                                <textarea id="message" name="message" rows="6" required></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary btn-lg">
                                Send Message
                            </button>

                            <div id="formMessage" class="form-message"></div>
                        </form>
                    </div>

                    <!-- Contact Information -->
                    <div class="contact-info-wrapper">
                        <h2>Get in Touch</h2>

                        <div class="contact-info-list">
                            ${options.email ? `
                            <div class="contact-info-item">
                                <div class="icon">✉</div>
                                <div>
                                    <h3>Email</h3>
                                    <a href="mailto:${options.email}">${options.email}</a>
                                </div>
                            </div>
                            ` : ''}

                            ${options.phone ? `
                            <div class="contact-info-item">
                                <div class="icon">📞</div>
                                <div>
                                    <h3>Phone</h3>
                                    <a href="tel:${options.phone}">${options.phone}</a>
                                </div>
                            </div>
                            ` : ''}

                            ${options.address ? `
                            <div class="contact-info-item">
                                <div class="icon">📍</div>
                                <div>
                                    <h3>Address</h3>
                                    <p>${options.address}</p>
                                </div>
                            </div>
                            ` : ''}

                            ${options.hours ? `
                            <div class="contact-info-item">
                                <div class="icon">🕐</div>
                                <div>
                                    <h3>Hours</h3>
                                    <p>${options.hours}</p>
                                </div>
                            </div>
                            ` : ''}
                        </div>

                        ${this.config.socialLinks ? `
                        <div class="social-links">
                            <h3>Follow Us</h3>
                            <div class="social-icons">
                                ${this.config.socialLinks.facebook ? `<a href="${this.config.socialLinks.facebook}" target="_blank" rel="noopener">Facebook</a>` : ''}
                                ${this.config.socialLinks.twitter ? `<a href="${this.config.socialLinks.twitter}" target="_blank" rel="noopener">Twitter</a>` : ''}
                                ${this.config.socialLinks.instagram ? `<a href="${this.config.socialLinks.instagram}" target="_blank" rel="noopener">Instagram</a>` : ''}
                                ${this.config.socialLinks.linkedin ? `<a href="${this.config.socialLinks.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                ${options.mapEmbedUrl ? `
                <div class="map-container">
                    <iframe
                        src="${options.mapEmbedUrl}"
                        width="100%"
                        height="450"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
                ` : ''}
            </div>
        </section>
    </main>

    ${this.generateFooter()}

    <script>
        ${this.generateJavaScript()}
        ${this.generateContactPageJS()}
    </script>
</body>
</html>`;

    this.saveToFile('contact.html', html);
    return html;
  }

  /**
   * Generate blog layout
   *
   * @param posts - Array of blog posts
   * @returns Complete HTML for blog page
   */
  generateBlogLayout(posts: BlogPost[]): string {
    console.log(`📝 Generating blog layout with ${posts.length} posts...`);

    const metaTags = this.generateMetaTags({
      title: `Blog - ${this.config.siteName}`,
      description: `Read the latest articles and updates from ${this.config.siteName}`,
      url: `${this.config.baseUrl}/blog`
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    ${this.generateHead(metaTags)}
    <style>
        ${this.generateGlobalStyles()}
        ${this.generateBlogStyles()}
    </style>
</head>
<body>
    ${this.generateNavigation()}

    <main class="blog-page">
        <section class="page-hero">
            <div class="container">
                <h1>Our Blog</h1>
                <p>Insights, tips, and updates</p>
            </div>
        </section>

        <section class="blog-content">
            <div class="container">
                <div class="blog-grid">
                    ${posts.map(post => this.generateBlogCard(post)).join('')}
                </div>
            </div>
        </section>
    </main>

    ${this.generateFooter()}

    <script>
        ${this.generateJavaScript()}
    </script>
</body>
</html>`;

    this.saveToFile('blog.html', html);

    // Generate individual blog post pages
    posts.forEach(post => this.generateBlogPost(post));

    return html;
  }

  /**
   * Setup navigation structure
   *
   * @param navItems - Navigation items
   * @returns HTML for navigation
   */
  setupNavigation(navItems?: NavItem[]): string {
    const defaultNav: NavItem[] = [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
      { label: 'About', url: '/about' },
      { label: 'Blog', url: '/blog' },
      { label: 'Contact', url: '/contact' }
    ];

    return this.generateNavigation(navItems || defaultNav);
  }

  // ==================== Private Helper Methods ====================

  private generateHead(metaTags: any, schema?: any): string {
    return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaTags.title}</title>
    <meta name="description" content="${metaTags.description}">
    ${metaTags.keywords ? `<meta name="keywords" content="${metaTags.keywords.join(', ')}">` : ''}
    ${metaTags.author ? `<meta name="author" content="${metaTags.author}">` : ''}
    <meta name="robots" content="${metaTags.robots || 'index, follow'}">
    ${metaTags.canonical ? `<link rel="canonical" href="${metaTags.canonical}">` : ''}

    <!-- Open Graph -->
    <meta property="og:title" content="${metaTags.openGraph.title}">
    <meta property="og:description" content="${metaTags.openGraph.description}">
    <meta property="og:type" content="${metaTags.openGraph.type}">
    ${metaTags.openGraph.url ? `<meta property="og:url" content="${metaTags.openGraph.url}">` : ''}
    ${metaTags.openGraph.image ? `<meta property="og:image" content="${metaTags.openGraph.image}">` : ''}
    ${metaTags.openGraph.siteName ? `<meta property="og:site_name" content="${metaTags.openGraph.siteName}">` : ''}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="${metaTags.twitter.card}">
    <meta name="twitter:title" content="${metaTags.twitter.title}">
    <meta name="twitter:description" content="${metaTags.twitter.description}">
    ${metaTags.twitter.image ? `<meta name="twitter:image" content="${metaTags.twitter.image}">` : ''}
    ${metaTags.twitter.creator ? `<meta name="twitter:creator" content="${metaTags.twitter.creator}">` : ''}

    ${schema ? `
    <!-- Schema.org structured data -->
    <script type="application/ld+json">
    ${JSON.stringify(schema, null, 2)}
    </script>
    ` : ''}

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    `;
  }

  private generateMetaTags(options: { title: string; description: string; url?: string; image?: string }): any {
    return {
      title: options.title,
      description: options.description,
      robots: 'index, follow',
      canonical: options.url,
      openGraph: {
        title: options.title,
        description: options.description,
        type: 'website',
        url: options.url,
        image: options.image,
        siteName: this.config.siteName
      },
      twitter: {
        card: options.image ? 'summary_large_image' : 'summary',
        title: options.title,
        description: options.description,
        image: options.image
      }
    };
  }

  private generateGlobalStyles(): string {
    return `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :root {
        --primary-color: ${this.config.primaryColor};
        --secondary-color: ${this.config.secondaryColor};
        --accent-color: ${this.config.accentColor};
        --text-color: #1f2937;
        --text-light: #6b7280;
        --border-color: #e5e7eb;
        --bg-color: #ffffff;
        --bg-light: #f9fafb;
        --font-family: ${this.config.font};
    }

    body {
        font-family: var(--font-family);
        color: var(--text-color);
        line-height: 1.6;
        background-color: var(--bg-color);
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    /* Buttons */
    .btn {
        display: inline-block;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }

    .btn-primary {
        background-color: var(--primary-color);
        color: white;
    }

    .btn-primary:hover {
        background-color: var(--secondary-color);
        transform: translateY(-2px);
    }

    .btn-outline {
        background-color: transparent;
        color: var(--primary-color);
        border: 2px solid var(--primary-color);
    }

    .btn-outline:hover {
        background-color: var(--primary-color);
        color: white;
    }

    .btn-lg {
        padding: 16px 32px;
        font-size: 18px;
    }

    /* Typography */
    h1, h2, h3, h4, h5, h6 {
        line-height: 1.2;
        margin-bottom: 1rem;
        font-weight: 700;
    }

    h1 { font-size: 3rem; }
    h2 { font-size: 2.5rem; }
    h3 { font-size: 2rem; }

    p {
        margin-bottom: 1rem;
    }

    /* Grid */
    .grid-2 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .grid-3 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
    }

    .grid-4 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    /* Card */
    .card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    /* Forms */
    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-color);
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 16px;
        font-family: var(--font-family);
        transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    /* Responsive */
    @media (max-width: 768px) {
        h1 { font-size: 2rem; }
        h2 { font-size: 1.75rem; }
        h3 { font-size: 1.5rem; }

        .grid-2, .grid-3, .grid-4 {
            grid-template-columns: 1fr;
        }
    }
    `;
  }

  private generateHomepageStyles(): string {
    return `
    .hero {
        position: relative;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        overflow: hidden;
    }

    .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
        background-position: center;
        opacity: 0.3;
    }

    .hero-content {
        position: relative;
        z-index: 1;
        text-align: center;
        padding: 4rem 0;
    }

    .hero-title {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
        animation: fadeInUp 0.8s ease;
    }

    .hero-subtitle {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        opacity: 0.95;
        animation: fadeInUp 0.8s ease 0.2s both;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .features-section {
        padding: 5rem 0;
        background: var(--bg-light);
    }

    .features-section h2 {
        text-align: center;
        margin-bottom: 3rem;
    }

    .feature-card {
        text-align: center;
        padding: 2rem;
    }

    .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .products-section {
        padding: 5rem 0;
    }

    .products-section h2 {
        text-align: center;
        margin-bottom: 3rem;
    }

    .product-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .product-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
    }

    .product-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
    }

    .product-info {
        padding: 1.5rem;
    }

    .product-name {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .product-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        margin: 1rem 0;
    }

    .testimonials-section {
        padding: 5rem 0;
        background: var(--bg-light);
    }

    .testimonials-section h2 {
        text-align: center;
        margin-bottom: 3rem;
    }

    .testimonial-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .testimonial-text {
        font-style: italic;
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }

    .testimonial-author {
        font-weight: 600;
    }

    .testimonial-rating {
        color: var(--accent-color);
    }
    `;
  }

  private generateProductPageStyles(): string {
    return `
    .product-page {
        padding: 2rem 0 4rem;
    }

    .breadcrumb {
        margin-bottom: 2rem;
        color: var(--text-light);
    }

    .breadcrumb a {
        color: var(--primary-color);
        text-decoration: none;
    }

    .breadcrumb a:hover {
        text-decoration: underline;
    }

    .product-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        margin-bottom: 4rem;
    }

    .product-gallery .main-image img {
        width: 100%;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .thumbnail-gallery {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .thumbnail {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.3s ease;
    }

    .thumbnail:hover,
    .thumbnail.active {
        border-color: var(--primary-color);
    }

    .product-title {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .product-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .product-price {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--primary-color);
        margin: 1.5rem 0;
    }

    .product-description {
        margin: 2rem 0;
        line-height: 1.8;
    }

    .product-features ul {
        list-style: none;
        padding: 0;
    }

    .product-features li {
        padding: 0.5rem 0;
        padding-left: 1.5rem;
        position: relative;
    }

    .product-features li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-weight: 700;
    }

    .product-actions {
        display: flex;
        gap: 1rem;
        margin: 2rem 0;
    }

    .product-actions .btn {
        flex: 1;
    }

    .product-meta {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
        color: var(--text-light);
    }

    .out-of-stock {
        padding: 1.5rem;
        background: var(--bg-light);
        border-radius: 8px;
        text-align: center;
    }

    .out-of-stock span {
        display: block;
        margin-bottom: 1rem;
        font-weight: 600;
        color: #dc2626;
    }

    .related-products {
        margin-top: 4rem;
        padding-top: 4rem;
        border-top: 1px solid var(--border-color);
    }

    .related-products h2 {
        margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
        .product-container {
            grid-template-columns: 1fr;
        }

        .product-actions {
            flex-direction: column;
        }
    }
    `;
  }

  private generateAboutPageStyles(): string {
    return `
    .page-hero {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 4rem 0;
        text-align: center;
    }

    .page-hero h1 {
        font-size: 3rem;
        margin-bottom: 0;
    }

    .story-section {
        padding: 4rem 0;
    }

    .content-wrapper {
        max-width: 800px;
        margin: 0 auto;
        font-size: 1.1rem;
        line-height: 1.8;
    }

    .mission-vision {
        padding: 4rem 0;
        background: var(--bg-light);
    }

    .values-section {
        padding: 4rem 0;
    }

    .values-section h2 {
        text-align: center;
        margin-bottom: 2rem;
    }

    .values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .value-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .team-section {
        padding: 4rem 0;
        background: var(--bg-light);
    }

    .team-section h2 {
        text-align: center;
        margin-bottom: 3rem;
    }

    .team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
    }

    .team-member {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .team-photo {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 1rem;
    }

    .team-photo-placeholder {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 700;
        margin: 0 auto 1rem;
    }

    .team-member .role {
        color: var(--text-light);
        margin-bottom: 1rem;
    }

    .team-member .bio {
        font-size: 0.95rem;
        line-height: 1.6;
    }
    `;
  }

  private generateContactPageStyles(): string {
    return `
    .contact-page {
        padding-bottom: 4rem;
    }

    .contact-content {
        padding: 4rem 0;
    }

    .contact-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 3rem;
    }

    .contact-form-wrapper h2,
    .contact-info-wrapper h2 {
        margin-bottom: 2rem;
    }

    .contact-form {
        background: var(--bg-light);
        padding: 2rem;
        border-radius: 12px;
    }

    .form-message {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 8px;
        display: none;
    }

    .form-message.success {
        background: #d1fae5;
        color: #065f46;
        display: block;
    }

    .form-message.error {
        background: #fee2e2;
        color: #991b1b;
        display: block;
    }

    .contact-info-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .contact-info-item {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }

    .contact-info-item .icon {
        font-size: 2rem;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .contact-info-item h3 {
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
    }

    .contact-info-item a {
        color: var(--primary-color);
        text-decoration: none;
    }

    .contact-info-item a:hover {
        text-decoration: underline;
    }

    .social-links {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    .social-icons {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;
    }

    .social-icons a {
        padding: 0.75rem 1.5rem;
        background: var(--primary-color);
        color: white;
        border-radius: 8px;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .social-icons a:hover {
        background: var(--secondary-color);
        transform: translateY(-2px);
    }

    .map-container {
        margin-top: 3rem;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
        .contact-grid {
            grid-template-columns: 1fr;
        }
    }
    `;
  }

  private generateBlogStyles(): string {
    return `
    .blog-content {
        padding: 4rem 0;
    }

    .blog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
    }

    .blog-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-decoration: none;
        color: inherit;
        display: block;
    }

    .blog-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
    }

    .blog-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .blog-card-content {
        padding: 1.5rem;
    }

    .blog-category {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: var(--primary-color);
        color: white;
        border-radius: 4px;
        font-size: 0.85rem;
        margin-bottom: 0.75rem;
    }

    .blog-title {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
    }

    .blog-excerpt {
        color: var(--text-light);
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    .blog-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        color: var(--text-light);
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }

    .blog-author {
        font-weight: 600;
    }

    .blog-date {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    `;
  }

  private generateNavigation(navItems?: NavItem[]): string {
    const nav = navItems || [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
      { label: 'About', url: '/about' },
      { label: 'Blog', url: '/blog' },
      { label: 'Contact', url: '/contact' }
    ];

    return `
    <style>
        nav {
            background: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-color);
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: var(--primary-color);
        }

        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .nav-links {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 1rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                display: none;
            }

            .nav-links.active {
                display: flex;
            }

            .mobile-menu-toggle {
                display: block;
            }
        }
    </style>

    <nav>
        <div class="nav-container">
            <a href="/" class="logo">${this.config.logo || this.config.siteName}</a>
            <ul class="nav-links" id="navLinks">
                ${nav.map(item => `<li><a href="${item.url}">${item.label}</a></li>`).join('')}
            </ul>
            <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">☰</button>
        </div>
    </nav>
    `;
  }

  private generateFooter(): string {
    return `
    <style>
        footer {
            background: var(--text-color);
            color: white;
            padding: 3rem 0 1rem;
            margin-top: 4rem;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .footer-section h3 {
            margin-bottom: 1rem;
        }

        .footer-section ul {
            list-style: none;
        }

        .footer-section a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            line-height: 2;
        }

        .footer-section a:hover {
            color: white;
        }

        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.6);
        }
    </style>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${this.config.siteName}</h3>
                    <p>${this.config.tagline || 'Building amazing products'}</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/products">Products</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Resources</h3>
                    <ul>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/support">Support</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} ${this.config.siteName}. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;
  }

  private generateJavaScript(): string {
    return `
    // Mobile menu toggle
    function toggleMobileMenu() {
        const navLinks = document.getElementById('navLinks');
        navLinks.classList.toggle('active');
    }

    // Add to cart functionality
    function addToCart(productId) {
        console.log('Adding product to cart:', productId);
        alert('Product added to cart!');
        // Implement actual cart logic here
    }

    // Wishlist functionality
    function addToWishlist(productId) {
        console.log('Adding to wishlist:', productId);
        alert('Added to wishlist!');
    }

    // Notify when available
    function notifyWhenAvailable(productId) {
        const email = prompt('Enter your email to be notified:');
        if (email) {
            alert('We will notify you when this product is back in stock!');
        }
    }

    // Add to cart buttons
    document.addEventListener('DOMContentLoaded', function() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                addToCart(productId);
            });
        });
    });
    `;
  }

  private generateFeaturesSection(features: Array<{ title: string; description: string; icon?: string }>): string {
    return `
    <section class="features-section">
        <div class="container">
            <h2>Why Choose Us</h2>
            <div class="grid-3">
                ${features.map(feature => `
                    <div class="feature-card">
                        ${feature.icon ? `<div class="feature-icon">${feature.icon}</div>` : ''}
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    `;
  }

  private generateProductGrid(products: Product[], title: string): string {
    return `
    <section class="products-section">
        <div class="container">
            <h2>${title}</h2>
            <div class="grid-3">
                ${products.map(product => `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <div class="product-info">
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-description">${product.description.substring(0, 100)}...</p>
                            <div class="product-price">${this.getCurrencySymbol(product.currency)}${product.price.toFixed(2)}</div>
                            <a href="/products/${product.id}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    `;
  }

  private generateTestimonialsSection(testimonials: Array<{ name: string; text: string; rating?: number; image?: string }>): string {
    return `
    <section class="testimonials-section">
        <div class="container">
            <h2>What Our Customers Say</h2>
            <div class="grid-3">
                ${testimonials.map(testimonial => `
                    <div class="testimonial-card">
                        <div class="testimonial-text">"${testimonial.text}"</div>
                        ${testimonial.rating ? `<div class="testimonial-rating">${this.generateStarRating(testimonial.rating)}</div>` : ''}
                        <div class="testimonial-author">- ${testimonial.name}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    `;
  }

  private generateBlogCard(post: BlogPost): string {
    return `
    <a href="/blog/${post.id}" class="blog-card">
        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-image">` : ''}
        <div class="blog-card-content">
            ${post.category ? `<span class="blog-category">${post.category}</span>` : ''}
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            <div class="blog-meta">
                <span class="blog-author">${post.author}</span>
                <span class="blog-date">
                    📅 ${post.date.toLocaleDateString()}
                    ${post.readTime ? ` • ${post.readTime} min read` : ''}
                </span>
            </div>
        </div>
    </a>
    `;
  }

  private generateBlogPost(post: BlogPost): void {
    const metaTags = this.generateMetaTags({
      title: `${post.title} - ${this.config.siteName} Blog`,
      description: post.excerpt,
      url: `${this.config.baseUrl}/blog/${post.id}`,
      image: post.image
    });

    const articleSchema = this.seo.generateSchema('Article', {
      headline: post.title,
      author: {
        '@type': 'Person',
        name: post.author
      },
      datePublished: post.date.toISOString(),
      image: post.image,
      publisher: {
        '@type': 'Organization',
        name: this.config.siteName
      }
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    ${this.generateHead(metaTags, articleSchema)}
    <style>
        ${this.generateGlobalStyles()}
        ${this.generateBlogPostStyles()}
    </style>
</head>
<body>
    ${this.generateNavigation()}

    <article class="blog-post">
        <div class="container">
            <header class="post-header">
                ${post.category ? `<span class="post-category">${post.category}</span>` : ''}
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <span class="post-author">By ${post.author}</span>
                    <span class="post-date">📅 ${post.date.toLocaleDateString()}</span>
                    ${post.readTime ? `<span class="post-read-time">⏱ ${post.readTime} min read</span>` : ''}
                </div>
            </header>

            ${post.image ? `
            <div class="post-featured-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            ` : ''}

            <div class="post-content">
                ${post.content}
            </div>

            ${post.tags && post.tags.length > 0 ? `
            <div class="post-tags">
                <strong>Tags:</strong>
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            ` : ''}
        </div>
    </article>

    ${this.generateFooter()}

    <script>
        ${this.generateJavaScript()}
    </script>
</body>
</html>`;

    this.saveToFile(`blog/${post.id}.html`, html);
  }

  private generateBlogPostStyles(): string {
    return `
    .blog-post {
        padding: 2rem 0 4rem;
    }

    .post-header {
        max-width: 800px;
        margin: 0 auto 2rem;
        text-align: center;
    }

    .post-category {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: var(--primary-color);
        color: white;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .post-header h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .post-meta {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        color: var(--text-light);
        flex-wrap: wrap;
    }

    .post-featured-image {
        max-width: 1000px;
        margin: 0 auto 2rem;
        border-radius: 12px;
        overflow: hidden;
    }

    .post-featured-image img {
        width: 100%;
        display: block;
    }

    .post-content {
        max-width: 800px;
        margin: 0 auto;
        font-size: 1.1rem;
        line-height: 1.8;
    }

    .post-content h2,
    .post-content h3 {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    .post-content img {
        max-width: 100%;
        border-radius: 8px;
        margin: 2rem 0;
    }

    .post-tags {
        max-width: 800px;
        margin: 3rem auto 0;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    .tag {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: var(--bg-light);
        border-radius: 4px;
        margin: 0.25rem;
    }
    `;
  }

  private generateProductPageJS(product: Product): string {
    return `
    function changeProductImage(src, thumbnail) {
        document.getElementById('mainProductImage').src = src;

        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    }
    `;
  }

  private generateContactPageJS(): string {
    return `
    function handleContactSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('Contact form submission:', data);

        // Show success message
        const messageDiv = document.getElementById('formMessage');
        messageDiv.className = 'form-message success';
        messageDiv.textContent = 'Thank you for your message! We will get back to you soon.';

        // Reset form
        form.reset();

        // In production, send data to server:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });

        return false;
    }
    `;
  }

  private generateStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return '★'.repeat(fullStars) +
           (halfStar ? '⯨' : '') +
           '☆'.repeat(emptyStars);
  }

  private getCurrencySymbol(currency?: string): string {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥'
    };
    return symbols[currency || 'USD'] || '$';
  }

  private saveToFile(filename: string, content: string): void {
    const filepath = path.join(this.outputDir, filename);
    const dir = path.dirname(filepath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`✓ Saved: ${filepath}`);
  }
}

/**
 * Export singleton instance getter
 */
export function getDefaultTemplate(config: WebsiteConfig, outputDir?: string): DefaultTemplate {
  return new DefaultTemplate(config, outputDir);
}
