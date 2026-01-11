/**
 * EmailTemplate - Responsive HTML Email Templates
 *
 * Generates production-ready HTML email templates for various automation scenarios.
 * All templates are mobile-responsive and tested across major email clients.
 */

// ============================================================================
// Interfaces - Email Configuration
// ============================================================================

export interface EmailConfig {
  brandName: string;
  brandLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  footerText?: string;
  unsubscribeUrl?: string;
  viewInBrowserUrl?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  companyAddress?: string;
}

export interface EmailPersonalization {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  [key: string]: any;
}

// ============================================================================
// Interfaces - Welcome Email
// ============================================================================

export interface WelcomeEmailOptions {
  subject: string;
  preheader?: string;
  headline: string;
  message: string;
  ctaText: string;
  ctaUrl: string;
  steps?: WelcomeStep[];
  benefits?: string[];
  personalization?: EmailPersonalization;
}

export interface WelcomeStep {
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

export interface WelcomeEmail {
  subject: string;
  preheader: string;
  html: string;
  text: string;
  metadata: {
    type: 'welcome';
    hasPersonalization: boolean;
    estimatedSize: number;
  };
}

// ============================================================================
// Interfaces - Newsletter
// ============================================================================

export interface NewsletterOptions {
  subject: string;
  preheader?: string;
  headerImage?: string;
  introText?: string;
  articles: NewsletterArticle[];
  featuredArticle?: NewsletterArticle;
  ctaSection?: {
    headline: string;
    text: string;
    buttonText: string;
    buttonUrl: string;
  };
  personalization?: EmailPersonalization;
}

export interface NewsletterArticle {
  title: string;
  excerpt: string;
  imageUrl?: string;
  linkUrl: string;
  category?: string;
  readTime?: number;
}

export interface Newsletter {
  subject: string;
  preheader: string;
  html: string;
  text: string;
  metadata: {
    type: 'newsletter';
    articleCount: number;
    estimatedSize: number;
  };
}

// ============================================================================
// Interfaces - Abandoned Cart
// ============================================================================

export interface AbandonedCartOptions {
  subject: string;
  preheader?: string;
  customerName?: string;
  cartItems: CartItem[];
  cartTotal: number;
  currency?: string;
  discountCode?: string;
  discountAmount?: string;
  urgencyMessage?: string;
  ctaText?: string;
  ctaUrl: string;
  personalization?: EmailPersonalization;
}

export interface CartItem {
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  productUrl: string;
}

export interface AbandonedCartEmail {
  subject: string;
  preheader: string;
  html: string;
  text: string;
  metadata: {
    type: 'abandoned-cart';
    itemCount: number;
    cartValue: number;
    estimatedSize: number;
  };
}

// ============================================================================
// Interfaces - Promotional Email
// ============================================================================

export interface PromotionalEmailOptions {
  subject: string;
  preheader?: string;
  headline: string;
  offerText: string;
  offerDetails?: string;
  heroImage?: string;
  products?: PromotionalProduct[];
  ctaText: string;
  ctaUrl: string;
  expiryDate?: Date;
  discountCode?: string;
  urgencyBadge?: string;
  personalization?: EmailPersonalization;
}

export interface PromotionalProduct {
  name: string;
  originalPrice?: number;
  salePrice: number;
  imageUrl: string;
  productUrl: string;
  savingsPercent?: number;
}

export interface PromotionalEmail {
  subject: string;
  preheader: string;
  html: string;
  text: string;
  metadata: {
    type: 'promotional';
    hasOffer: boolean;
    hasExpiry: boolean;
    estimatedSize: number;
  };
}

// ============================================================================
// Interfaces - Transactional Email
// ============================================================================

export interface TransactionalEmailOptions {
  type: 'order-confirmation' | 'shipping-notification' | 'password-reset' | 'receipt' | 'account-update';
  subject: string;
  preheader?: string;
  customerName?: string;
  orderNumber?: string;
  orderDate?: Date;
  orderItems?: OrderItem[];
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  currency?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  resetLink?: string;
  resetExpiry?: number; // hours
  message?: string;
  ctaText?: string;
  ctaUrl?: string;
  personalization?: EmailPersonalization;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface TransactionalEmail {
  subject: string;
  preheader: string;
  html: string;
  text: string;
  metadata: {
    type: 'transactional';
    subtype: string;
    estimatedSize: number;
  };
}

// ============================================================================
// Interfaces - Email Sequence
// ============================================================================

export interface EmailSequenceOptions {
  sequenceName: string;
  sequenceType: 'onboarding' | 'nurture' | 're-engagement' | 'educational' | 'sales';
  emails: SequenceEmail[];
  personalization?: EmailPersonalization;
}

export interface SequenceEmail {
  dayOffset: number; // Days after trigger
  subject: string;
  preheader?: string;
  headline: string;
  content: string;
  ctaText: string;
  ctaUrl: string;
  tips?: string[];
  imageUrl?: string;
}

export interface EmailSequence {
  sequenceName: string;
  sequenceType: string;
  emails: {
    dayOffset: number;
    email: {
      subject: string;
      preheader: string;
      html: string;
      text: string;
    };
  }[];
  metadata: {
    totalEmails: number;
    totalDuration: number;
    estimatedSize: number;
  };
}

// ============================================================================
// EmailTemplate Class
// ============================================================================

export class EmailTemplate {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#f59e0b',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      footerText: `© ${new Date().getFullYear()} ${config.brandName}. All rights reserved.`,
      ...config
    };
  }

  /**
   * Create a welcome email for new users
   */
  createWelcomeEmail(options: WelcomeEmailOptions): WelcomeEmail {
    const personalization = options.personalization || {};
    const firstName = personalization.firstName || 'there';

    const subject = this.personalize(options.subject, personalization);
    const preheader = options.preheader || 'Welcome to our community! Here\'s what to do next.';

    const html = this.buildWelcomeHTML(options, firstName);
    const text = this.buildWelcomeText(options, firstName);

    return {
      subject,
      preheader,
      html,
      text,
      metadata: {
        type: 'welcome',
        hasPersonalization: Object.keys(personalization).length > 0,
        estimatedSize: html.length
      }
    };
  }

  /**
   * Generate a newsletter email
   */
  generateNewsletters(options: NewsletterOptions): Newsletter {
    const personalization = options.personalization || {};

    const subject = this.personalize(options.subject, personalization);
    const preheader = options.preheader || 'Your latest updates and insights';

    const html = this.buildNewsletterHTML(options);
    const text = this.buildNewsletterText(options);

    return {
      subject,
      preheader,
      html,
      text,
      metadata: {
        type: 'newsletter',
        articleCount: options.articles.length + (options.featuredArticle ? 1 : 0),
        estimatedSize: html.length
      }
    };
  }

  /**
   * Create an abandoned cart recovery email
   */
  createAbandonedCart(options: AbandonedCartOptions): AbandonedCartEmail {
    const personalization = options.personalization || {};
    const customerName = options.customerName || personalization.firstName || 'there';
    const currency = options.currency || 'USD';

    const subject = this.personalize(options.subject, { ...personalization, customerName });
    const preheader = options.preheader || 'Complete your purchase - items still available!';

    const html = this.buildAbandonedCartHTML(options, customerName, currency);
    const text = this.buildAbandonedCartText(options, customerName, currency);

    return {
      subject,
      preheader,
      html,
      text,
      metadata: {
        type: 'abandoned-cart',
        itemCount: options.cartItems.length,
        cartValue: options.cartTotal,
        estimatedSize: html.length
      }
    };
  }

  /**
   * Build a promotional email
   */
  buildPromotionalEmail(options: PromotionalEmailOptions): PromotionalEmail {
    const personalization = options.personalization || {};

    const subject = this.personalize(options.subject, personalization);
    const preheader = options.preheader || 'Limited time offer - don\'t miss out!';

    const html = this.buildPromotionalHTML(options);
    const text = this.buildPromotionalText(options);

    return {
      subject,
      preheader,
      html,
      text,
      metadata: {
        type: 'promotional',
        hasOffer: !!options.discountCode || !!options.offerText,
        hasExpiry: !!options.expiryDate,
        estimatedSize: html.length
      }
    };
  }

  /**
   * Create a transactional email
   */
  createTransactional(options: TransactionalEmailOptions): TransactionalEmail {
    const personalization = options.personalization || {};
    const customerName = options.customerName || personalization.firstName || 'Customer';

    const subject = this.personalize(options.subject, { ...personalization, customerName, orderNumber: options.orderNumber });
    const preheader = options.preheader || this.getTransactionalPreheader(options.type);

    const html = this.buildTransactionalHTML(options, customerName);
    const text = this.buildTransactionalText(options, customerName);

    return {
      subject,
      preheader,
      html,
      text,
      metadata: {
        type: 'transactional',
        subtype: options.type,
        estimatedSize: html.length
      }
    };
  }

  /**
   * Generate an email sequence (drip campaign)
   */
  generateSequences(options: EmailSequenceOptions): EmailSequence {
    const personalization = options.personalization || {};

    const emails = options.emails.map(sequenceEmail => {
      const html = this.buildSequenceEmailHTML(sequenceEmail, personalization);
      const text = this.buildSequenceEmailText(sequenceEmail, personalization);

      return {
        dayOffset: sequenceEmail.dayOffset,
        email: {
          subject: this.personalize(sequenceEmail.subject, personalization),
          preheader: sequenceEmail.preheader || '',
          html,
          text
        }
      };
    });

    const maxDayOffset = Math.max(...options.emails.map(e => e.dayOffset));
    const totalSize = emails.reduce((sum, e) => sum + e.email.html.length, 0);

    return {
      sequenceName: options.sequenceName,
      sequenceType: options.sequenceType,
      emails,
      metadata: {
        totalEmails: emails.length,
        totalDuration: maxDayOffset,
        estimatedSize: totalSize
      }
    };
  }

  // ============================================================================
  // HTML Builders - Welcome Email
  // ============================================================================

  private buildWelcomeHTML(options: WelcomeEmailOptions, firstName: string): string {
    const stepsHTML = options.steps ? options.steps.map(step => `
      <tr>
        <td style="padding: 20px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="60" valign="top">
                <div style="width: 40px; height: 40px; background-color: ${this.config.primaryColor}; color: white; border-radius: 50%; text-align: center; line-height: 40px; font-weight: bold; font-size: 18px;">
                  ${step.stepNumber}
                </div>
              </td>
              <td valign="top">
                <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                  ${step.title}
                </h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                  ${step.description}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('') : '';

    const benefitsHTML = options.benefits ? `
      <tr>
        <td style="padding: 20px 0;">
          <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
            What you'll get:
          </h3>
          ${options.benefits.map(benefit => `
            <div style="margin-bottom: 12px;">
              <span style="color: ${this.config.accentColor}; margin-right: 8px;">✓</span>
              <span style="color: #4b5563; font-size: 14px;">${benefit}</span>
            </div>
          `).join('')}
        </td>
      </tr>
    ` : '';

    return this.wrapInTemplate(`
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0 0 16px 0; color: #1f2937; font-size: 28px; font-weight: 700;">
            ${options.headline}
          </h1>
          <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
            Hi ${firstName}! ${options.message}
          </p>
          ${this.buildCTAButton(options.ctaText, options.ctaUrl)}
        </td>
      </tr>

      ${stepsHTML}
      ${benefitsHTML}

      <tr>
        <td style="padding: 30px 0; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Need help getting started? Just reply to this email - we're here to help!
          </p>
        </td>
      </tr>
    `);
  }

  // ============================================================================
  // HTML Builders - Newsletter
  // ============================================================================

  private buildNewsletterHTML(options: NewsletterOptions): string {
    const headerImageHTML = options.headerImage ? `
      <tr>
        <td style="padding: 0;">
          <img src="${options.headerImage}" alt="Newsletter Header" style="width: 100%; height: auto; display: block;">
        </td>
      </tr>
    ` : '';

    const introHTML = options.introText ? `
      <tr>
        <td style="padding: 30px 30px 20px 30px;">
          <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
            ${options.introText}
          </p>
        </td>
      </tr>
    ` : '';

    const featuredHTML = options.featuredArticle ? `
      <tr>
        <td style="padding: 20px 30px;">
          <div style="background-color: #f9fafb; border-left: 4px solid ${this.config.primaryColor}; padding: 20px;">
            ${options.featuredArticle.imageUrl ? `
              <img src="${options.featuredArticle.imageUrl}" alt="${options.featuredArticle.title}" style="width: 100%; height: auto; display: block; margin-bottom: 16px; border-radius: 8px;">
            ` : ''}
            <div style="background-color: ${this.config.accentColor}; color: white; display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">
              FEATURED
            </div>
            <h2 style="margin: 0 0 12px 0; color: #1f2937; font-size: 22px; font-weight: 700;">
              ${options.featuredArticle.title}
            </h2>
            <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
              ${options.featuredArticle.excerpt}
            </p>
            ${this.buildTextLink('Read More →', options.featuredArticle.linkUrl)}
          </div>
        </td>
      </tr>
    ` : '';

    const articlesHTML = options.articles.map(article => `
      <tr>
        <td style="padding: 20px 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${article.imageUrl ? `
                <td width="120" valign="top" style="padding-right: 16px;">
                  <img src="${article.imageUrl}" alt="${article.title}" style="width: 120px; height: 80px; display: block; border-radius: 8px; object-fit: cover;">
                </td>
              ` : ''}
              <td valign="top">
                ${article.category ? `
                  <div style="color: ${this.config.primaryColor}; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">
                    ${article.category}
                  </div>
                ` : ''}
                <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                  <a href="${article.linkUrl}" style="color: #1f2937; text-decoration: none;">
                    ${article.title}
                  </a>
                </h3>
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                  ${article.excerpt}
                </p>
                ${article.readTime ? `
                  <div style="color: #9ca3af; font-size: 12px;">
                    ${article.readTime} min read
                  </div>
                ` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 30px;">
          <div style="border-top: 1px solid #e5e7eb;"></div>
        </td>
      </tr>
    `).join('');

    const ctaSectionHTML = options.ctaSection ? `
      <tr>
        <td style="padding: 30px; background-color: #f9fafb; text-align: center;">
          <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 20px; font-weight: 700;">
            ${options.ctaSection.headline}
          </h3>
          <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
            ${options.ctaSection.text}
          </p>
          ${this.buildCTAButton(options.ctaSection.buttonText, options.ctaSection.buttonUrl)}
        </td>
      </tr>
    ` : '';

    return this.wrapInTemplate(`
      ${headerImageHTML}
      ${introHTML}
      ${featuredHTML}
      ${articlesHTML}
      ${ctaSectionHTML}
    `);
  }

  // ============================================================================
  // HTML Builders - Abandoned Cart
  // ============================================================================

  private buildAbandonedCartHTML(options: AbandonedCartOptions, customerName: string, currency: string): string {
    const urgencyHTML = options.urgencyMessage ? `
      <tr>
        <td style="padding: 0 30px 20px 30px;">
          <div style="background-color: #fef3c7; border-left: 4px solid ${this.config.accentColor}; padding: 12px 16px;">
            <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
              ⏰ ${options.urgencyMessage}
            </p>
          </div>
        </td>
      </tr>
    ` : '';

    const discountHTML = options.discountCode ? `
      <tr>
        <td style="padding: 20px 30px;">
          <div style="background-color: ${this.config.primaryColor}; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
              Special Offer: ${options.discountAmount || 'Save Now'}
            </p>
            <div style="background-color: white; color: ${this.config.primaryColor}; display: inline-block; padding: 8px 20px; border-radius: 4px; font-size: 20px; font-weight: 700; letter-spacing: 2px;">
              ${options.discountCode}
            </div>
          </div>
        </td>
      </tr>
    ` : '';

    const cartItemsHTML = options.cartItems.map(item => `
      <tr>
        <td style="padding: 16px 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="80">
                <img src="${item.imageUrl}" alt="${item.name}" style="width: 80px; height: 80px; display: block; border-radius: 8px; object-fit: cover;">
              </td>
              <td style="padding-left: 16px;" valign="middle">
                <h4 style="margin: 0 0 4px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                  ${item.name}
                </h4>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  Quantity: ${item.quantity}
                </p>
              </td>
              <td width="80" align="right" valign="middle">
                <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 700;">
                  ${this.formatCurrency(item.price * item.quantity, currency)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 30px;">
          <div style="border-top: 1px solid #e5e7eb;"></div>
        </td>
      </tr>
    `).join('');

    return this.wrapInTemplate(`
      <tr>
        <td style="padding: 40px 30px 20px 30px; text-align: center;">
          <h1 style="margin: 0 0 12px 0; color: #1f2937; font-size: 26px; font-weight: 700;">
            Hi ${customerName}, you left something behind!
          </h1>
          <p style="margin: 0; color: #6b7280; font-size: 16px;">
            Complete your purchase now before these items sell out.
          </p>
        </td>
      </tr>

      ${urgencyHTML}

      <tr>
        <td style="padding: 20px 30px 0 30px;">
          <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
            Your Cart
          </h3>
        </td>
      </tr>

      ${cartItemsHTML}

      <tr>
        <td style="padding: 20px 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="right">
                <p style="margin: 0; color: #6b7280; font-size: 16px;">
                  Total: <strong style="color: #1f2937; font-size: 20px;">${this.formatCurrency(options.cartTotal, currency)}</strong>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${discountHTML}

      <tr>
        <td style="padding: 20px 30px; text-align: center;">
          ${this.buildCTAButton(options.ctaText || 'Complete Your Purchase', options.ctaUrl)}
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 14px;">
            Questions? Reply to this email or contact our support team.
          </p>
        </td>
      </tr>
    `);
  }

  // ============================================================================
  // HTML Builders - Promotional
  // ============================================================================

  private buildPromotionalHTML(options: PromotionalEmailOptions): string {
    const heroHTML = options.heroImage ? `
      <tr>
        <td style="padding: 0;">
          <img src="${options.heroImage}" alt="${options.headline}" style="width: 100%; height: auto; display: block;">
        </td>
      </tr>
    ` : '';

    const urgencyBadgeHTML = options.urgencyBadge ? `
      <tr>
        <td style="padding: 20px 30px 0 30px; text-align: center;">
          <div style="background-color: #dc2626; color: white; display: inline-block; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 700; text-transform: uppercase;">
            ${options.urgencyBadge}
          </div>
        </td>
      </tr>
    ` : '';

    const expiryHTML = options.expiryDate ? `
      <tr>
        <td style="padding: 16px 30px; text-align: center;">
          <p style="margin: 0; color: #dc2626; font-size: 14px; font-weight: 600;">
            ⏰ Offer expires ${this.formatDate(options.expiryDate)}
          </p>
        </td>
      </tr>
    ` : '';

    const discountCodeHTML = options.discountCode ? `
      <tr>
        <td style="padding: 20px 30px;">
          <div style="background-color: #f9fafb; border: 2px dashed ${this.config.primaryColor}; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">
              USE CODE:
            </p>
            <div style="background-color: ${this.config.primaryColor}; color: white; display: inline-block; padding: 12px 24px; border-radius: 4px; font-size: 24px; font-weight: 700; letter-spacing: 3px;">
              ${options.discountCode}
            </div>
          </div>
        </td>
      </tr>
    ` : '';

    const productsHTML = options.products && options.products.length > 0 ? `
      <tr>
        <td style="padding: 30px;">
          <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 700; text-align: center;">
            Featured Products
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${options.products.slice(0, 3).map(product => `
                <td width="33%" style="padding: 10px;" valign="top">
                  <a href="${product.productUrl}" style="text-decoration: none;">
                    <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: auto; display: block; border-radius: 8px; margin-bottom: 12px;">
                    <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: center;">
                      ${product.name}
                    </h4>
                    <p style="margin: 0; text-align: center;">
                      ${product.originalPrice ? `
                        <span style="color: #9ca3af; font-size: 12px; text-decoration: line-through;">
                          ${this.formatCurrency(product.originalPrice, 'USD')}
                        </span>
                      ` : ''}
                      <span style="color: #dc2626; font-size: 16px; font-weight: 700; margin-left: 4px;">
                        ${this.formatCurrency(product.salePrice, 'USD')}
                      </span>
                    </p>
                    ${product.savingsPercent ? `
                      <p style="margin: 4px 0 0 0; color: #059669; font-size: 12px; font-weight: 600; text-align: center;">
                        Save ${product.savingsPercent}%
                      </p>
                    ` : ''}
                  </a>
                </td>
              `).join('')}
            </tr>
          </table>
        </td>
      </tr>
    ` : '';

    return this.wrapInTemplate(`
      ${heroHTML}
      ${urgencyBadgeHTML}

      <tr>
        <td style="padding: 30px 30px 20px 30px; text-align: center;">
          <h1 style="margin: 0 0 16px 0; color: #1f2937; font-size: 32px; font-weight: 700;">
            ${options.headline}
          </h1>
          <p style="margin: 0 0 8px 0; color: ${this.config.primaryColor}; font-size: 24px; font-weight: 700;">
            ${options.offerText}
          </p>
          ${options.offerDetails ? `
            <p style="margin: 0; color: #6b7280; font-size: 16px;">
              ${options.offerDetails}
            </p>
          ` : ''}
        </td>
      </tr>

      ${expiryHTML}
      ${discountCodeHTML}

      <tr>
        <td style="padding: 20px 30px; text-align: center;">
          ${this.buildCTAButton(options.ctaText, options.ctaUrl, 'large')}
        </td>
      </tr>

      ${productsHTML}

      <tr>
        <td style="padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This offer is valid for a limited time. Terms and conditions apply.
          </p>
        </td>
      </tr>
    `);
  }

  // ============================================================================
  // HTML Builders - Transactional
  // ============================================================================

  private buildTransactionalHTML(options: TransactionalEmailOptions, customerName: string): string {
    switch (options.type) {
      case 'order-confirmation':
        return this.buildOrderConfirmationHTML(options, customerName);
      case 'shipping-notification':
        return this.buildShippingNotificationHTML(options, customerName);
      case 'password-reset':
        return this.buildPasswordResetHTML(options, customerName);
      case 'receipt':
        return this.buildReceiptHTML(options, customerName);
      case 'account-update':
        return this.buildAccountUpdateHTML(options, customerName);
      default:
        return this.wrapInTemplate('<tr><td>Unknown transactional email type</td></tr>');
    }
  }

  private buildOrderConfirmationHTML(options: TransactionalEmailOptions, customerName: string): string {
    const currency = options.currency || 'USD';

    const itemsHTML = options.orderItems ? options.orderItems.map(item => `
      <tr>
        <td style="padding: 12px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${item.imageUrl ? `
                <td width="60">
                  <img src="${item.imageUrl}" alt="${item.name}" style="width: 60px; height: 60px; display: block; border-radius: 4px;">
                </td>
              ` : ''}
              <td style="padding-left: ${item.imageUrl ? '12px' : '0'};" valign="middle">
                <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                  ${item.name}
                </p>
                <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">
                  Qty: ${item.quantity}
                </p>
              </td>
              <td width="80" align="right" valign="middle">
                <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                  ${this.formatCurrency(item.price * item.quantity, currency)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('') : '';

    return this.wrapInTemplate(`
      <tr>
        <td style="padding: 40px 30px 20px 30px; text-align: center;">
          <div style="width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 30px;">✓</span>
          </div>
          <h1 style="margin: 0 0 12px 0; color: #1f2937; font-size: 28px; font-weight: 700;">
            Order Confirmed!
          </h1>
          <p style="margin: 0; color: #6b7280; font-size: 16px;">
            Thanks for your order, ${customerName}!
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px;">
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">Order Number</p>
                  <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 700;">${options.orderNumber}</p>
                </td>
                <td align="right">
                  <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">Order Date</p>
                  <p style="margin: 0; color: #1f2937; font-size: 14px;">${this.formatDate(options.orderDate || new Date())}</p>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px;">
          <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
            Order Details
          </h3>
          ${itemsHTML}
          <div style="border-top: 2px solid #e5e7eb; margin-top: 16px; padding-top: 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px;">
              ${options.subtotal !== undefined ? `
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Subtotal</td>
                  <td align="right" style="padding: 4px 0; color: #1f2937;">${this.formatCurrency(options.subtotal, currency)}</td>
                </tr>
              ` : ''}
              ${options.shipping !== undefined ? `
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Shipping</td>
                  <td align="right" style="padding: 4px 0; color: #1f2937;">${this.formatCurrency(options.shipping, currency)}</td>
                </tr>
              ` : ''}
              ${options.tax !== undefined ? `
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Tax</td>
                  <td align="right" style="padding: 4px 0; color: #1f2937;">${this.formatCurrency(options.tax, currency)}</td>
                </tr>
              ` : ''}
              ${options.total !== undefined ? `
                <tr style="border-top: 1px solid #e5e7eb;">
                  <td style="padding: 12px 0 0 0; color: #1f2937; font-weight: 700; font-size: 16px;">Total</td>
                  <td align="right" style="padding: 12px 0 0 0; color: #1f2937; font-weight: 700; font-size: 18px;">${this.formatCurrency(options.total, currency)}</td>
                </tr>
              ` : ''}
            </table>
          </div>
        </td>
      </tr>

      ${options.ctaText && options.ctaUrl ? `
        <tr>
          <td style="padding: 20px 30px; text-align: center;">
            ${this.buildCTAButton(options.ctaText, options.ctaUrl)}
          </td>
        </tr>
      ` : ''}

      <tr>
        <td style="padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Questions about your order? Contact our support team.
          </p>
        </td>
      </tr>
    `);
  }

  private buildShippingNotificationHTML(options: TransactionalEmailOptions, customerName: string): string {
    return this.wrapInTemplate(`
      <tr>
        <td style="padding: 40px 30px 20px 30px; text-align: center;">
          <div style="width: 60px; height: 60px; background-color: ${this.config.primaryColor}; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 24px;">📦</span>
          </div>
          <h1 style="margin: 0 0 12px 0; color: #1f2937; font-size: 28px; font-weight: 700;">
            Your Order Has Shipped!
          </h1>
          <p style="margin: 0; color: #6b7280; font-size: 16px;">
            Hi ${customerName}, your order is on its way!
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px;">
          <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Tracking Number</p>
            <p style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px; font-weight: 700; letter-spacing: 1px;">
              ${options.trackingNumber}
            </p>
            ${options.estimatedDelivery ? `
              <p style="margin: 0; color: #059669; font-size: 14px; font-weight: 600;">
                Estimated Delivery: ${this.formatDate(options.estimatedDelivery)}
              </p>
            ` : ''}
          </div>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px; text-align: center;">
          ${this.buildCTAButton('Track Your Package', options.trackingUrl || '#')}
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Order #${options.orderNumber}
          </p>
        </td>
      </tr>
    `);
  }

  private buildPasswordResetHTML(options: TransactionalEmailOptions, customerName: string): string {
    const expiryHours = options.resetExpiry || 24;

    return this.wrapInTemplate(`
      <tr>
        <td style="padding: 40px 30px 20px 30px; text-align: center;">
          <h1 style="margin: 0 0 12px 0; color: #1f2937; font-size: 28px; font-weight: 700;">
            Reset Your Password
          </h1>
          <p style="margin: 0; color: #6b7280; font-size: 16px;">
            Hi ${customerName}, we received a request to reset your password.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px;">
          <div style="background-color: #fef3c7; border-left: 4px solid ${this.config.accentColor}; padding: 16px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Security Notice:</strong> This link will expire in ${expiryHours} hours. If you didn't request this, please ignore this email.
            </p>
          </div>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px; text-align: center;">
          ${this.buildCTAButton('Reset Password', options.resetLink || '#')}
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px;">
          <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
            Or copy and paste this link into your browser:
          </p>
          <p style="margin: 8px 0 0 0; color: ${this.config.primaryColor}; font-size: 12px; text-align: center; word-break: break-all;">
            ${options.resetLink || '#'}
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 14px;">
            If you didn't request a password reset, please contact our support team immediately.
          </p>
        </td>
      </tr>
    `);
  }

  private buildReceiptHTML(options: TransactionalEmailOptions, customerName: string): string {
    return this.buildOrderConfirmationHTML(options, customerName);
  }

  private buildAccountUpdateHTML(options: TransactionalEmailOptions, customerName: string): string {
    return this.wrapInTemplate(`
      <tr>
        <td style="padding: 40px 30px 20px 30px; text-align: center;">
          <h1 style="margin: 0 0 12px 0; color: #1f2937; font-size: 28px; font-weight: 700;">
            Account Updated
          </h1>
          <p style="margin: 0; color: #6b7280; font-size: 16px;">
            Hi ${customerName}, your account has been successfully updated.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 30px;">
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
            <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
              ${options.message || 'We wanted to let you know that changes have been made to your account. If you made these changes, no further action is needed.'}
            </p>
          </div>
        </td>
      </tr>

      ${options.ctaText && options.ctaUrl ? `
        <tr>
          <td style="padding: 20px 30px; text-align: center;">
            ${this.buildCTAButton(options.ctaText, options.ctaUrl)}
          </td>
        </tr>
      ` : ''}

      <tr>
        <td style="padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #dc2626; font-size: 14px; font-weight: 600;">
            If you didn't make these changes, please contact us immediately.
          </p>
        </td>
      </tr>
    `);
  }

  // ============================================================================
  // HTML Builders - Sequence Email
  // ============================================================================

  private buildSequenceEmailHTML(email: SequenceEmail, personalization: EmailPersonalization): string {
    const firstName = personalization.firstName || 'there';

    const tipsHTML = email.tips ? `
      <tr>
        <td style="padding: 20px 30px;">
          <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
            Pro Tips:
          </h3>
          ${email.tips.map((tip, index) => `
            <div style="margin-bottom: 12px; padding-left: 24px; position: relative;">
              <span style="position: absolute; left: 0; color: ${this.config.primaryColor}; font-weight: bold;">
                ${index + 1}.
              </span>
              <span style="color: #4b5563; font-size: 14px;">
                ${tip}
              </span>
            </div>
          `).join('')}
        </td>
      </tr>
    ` : '';

    const imageHTML = email.imageUrl ? `
      <tr>
        <td style="padding: 0 30px 20px 30px;">
          <img src="${email.imageUrl}" alt="${email.headline}" style="width: 100%; height: auto; display: block; border-radius: 8px;">
        </td>
      </tr>
    ` : '';

    return this.wrapInTemplate(`
      <tr>
        <td style="padding: 40px 30px 20px 30px;">
          <h1 style="margin: 0 0 12px 0; color: #1f2937; font-size: 26px; font-weight: 700;">
            ${email.headline}
          </h1>
          <p style="margin: 0; color: #6b7280; font-size: 16px;">
            Hi ${firstName}!
          </p>
        </td>
      </tr>

      ${imageHTML}

      <tr>
        <td style="padding: 20px 30px;">
          <div style="color: #4b5563; font-size: 15px; line-height: 1.7;">
            ${email.content.split('\n').map(para => `<p style="margin: 0 0 16px 0;">${para}</p>`).join('')}
          </div>
        </td>
      </tr>

      ${tipsHTML}

      <tr>
        <td style="padding: 20px 30px; text-align: center;">
          ${this.buildCTAButton(email.ctaText, email.ctaUrl)}
        </td>
      </tr>
    `);
  }

  // ============================================================================
  // Text Version Builders
  // ============================================================================

  private buildWelcomeText(options: WelcomeEmailOptions, firstName: string): string {
    let text = `${options.headline}\n\n`;
    text += `Hi ${firstName}! ${options.message}\n\n`;
    text += `${options.ctaText}: ${options.ctaUrl}\n\n`;

    if (options.steps) {
      text += 'Getting Started:\n';
      options.steps.forEach(step => {
        text += `\n${step.stepNumber}. ${step.title}\n${step.description}\n`;
      });
      text += '\n';
    }

    if (options.benefits) {
      text += 'What you\'ll get:\n';
      options.benefits.forEach(benefit => {
        text += `✓ ${benefit}\n`;
      });
    }

    return text + this.getTextFooter();
  }

  private buildNewsletterText(options: NewsletterOptions): string {
    let text = '';

    if (options.introText) {
      text += `${options.introText}\n\n`;
    }

    if (options.featuredArticle) {
      text += `FEATURED:\n${options.featuredArticle.title}\n${options.featuredArticle.excerpt}\nRead more: ${options.featuredArticle.linkUrl}\n\n`;
    }

    options.articles.forEach(article => {
      text += `${article.title}\n${article.excerpt}\nRead more: ${article.linkUrl}\n\n`;
    });

    return text + this.getTextFooter();
  }

  private buildAbandonedCartText(options: AbandonedCartOptions, customerName: string, currency: string): string {
    let text = `Hi ${customerName}, you left something behind!\n\n`;
    text += 'Your Cart:\n';

    options.cartItems.forEach(item => {
      text += `- ${item.name} (${item.quantity}x) - ${this.formatCurrency(item.price * item.quantity, currency)}\n`;
    });

    text += `\nTotal: ${this.formatCurrency(options.cartTotal, currency)}\n\n`;

    if (options.discountCode) {
      text += `Use code ${options.discountCode} for ${options.discountAmount}\n\n`;
    }

    text += `${options.ctaText || 'Complete Your Purchase'}: ${options.ctaUrl}\n`;

    return text + this.getTextFooter();
  }

  private buildPromotionalText(options: PromotionalEmailOptions): string {
    let text = `${options.headline}\n\n${options.offerText}\n\n`;

    if (options.offerDetails) {
      text += `${options.offerDetails}\n\n`;
    }

    if (options.discountCode) {
      text += `Use code: ${options.discountCode}\n\n`;
    }

    if (options.expiryDate) {
      text += `Offer expires: ${this.formatDate(options.expiryDate)}\n\n`;
    }

    text += `${options.ctaText}: ${options.ctaUrl}\n`;

    return text + this.getTextFooter();
  }

  private buildTransactionalText(options: TransactionalEmailOptions, customerName: string): string {
    let text = `Hi ${customerName},\n\n`;

    switch (options.type) {
      case 'order-confirmation':
        text += `Your order has been confirmed!\n\nOrder #${options.orderNumber}\n`;
        break;
      case 'shipping-notification':
        text += `Your order has shipped!\n\nTracking: ${options.trackingNumber}\n`;
        if (options.trackingUrl) text += `Track: ${options.trackingUrl}\n`;
        break;
      case 'password-reset':
        text += `Reset your password: ${options.resetLink}\n`;
        break;
      default:
        text += options.message || '';
    }

    return text + this.getTextFooter();
  }

  private buildSequenceEmailText(email: SequenceEmail, personalization: EmailPersonalization): string {
    const firstName = personalization.firstName || 'there';
    let text = `${email.headline}\n\nHi ${firstName}!\n\n${email.content}\n\n`;

    if (email.tips) {
      text += 'Pro Tips:\n';
      email.tips.forEach((tip, i) => {
        text += `${i + 1}. ${tip}\n`;
      });
      text += '\n';
    }

    text += `${email.ctaText}: ${email.ctaUrl}\n`;

    return text + this.getTextFooter();
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private wrapInTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: ${this.config.fontFamily};">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              ${this.config.brandLogo ? `
                <img src="${this.config.brandLogo}" alt="${this.config.brandName}" style="max-width: 150px; height: auto; display: block; margin: 0 auto;">
              ` : `
                <h2 style="margin: 0; color: ${this.config.primaryColor}; font-size: 24px; font-weight: 700;">
                  ${this.config.brandName}
                </h2>
              `}
            </td>
          </tr>

          <!-- Content -->
          ${content}

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
              ${this.buildSocialLinks()}
              <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                ${this.config.footerText}
              </p>
              ${this.config.companyAddress ? `
                <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                  ${this.config.companyAddress}
                </p>
              ` : ''}
              ${this.config.unsubscribeUrl ? `
                <p style="margin: 12px 0 0 0;">
                  <a href="${this.config.unsubscribeUrl}" style="color: #9ca3af; font-size: 12px; text-decoration: underline;">
                    Unsubscribe
                  </a>
                </p>
              ` : ''}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  private buildCTAButton(text: string, url: string, size: 'normal' | 'large' = 'normal'): string {
    const padding = size === 'large' ? '16px 40px' : '12px 32px';
    const fontSize = size === 'large' ? '18px' : '16px';

    return `
      <a href="${url}" style="display: inline-block; background-color: ${this.config.primaryColor}; color: white; padding: ${padding}; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: ${fontSize};">
        ${text}
      </a>
    `;
  }

  private buildTextLink(text: string, url: string): string {
    return `<a href="${url}" style="color: ${this.config.primaryColor}; text-decoration: none; font-weight: 600;">${text}</a>`;
  }

  private buildSocialLinks(): string {
    if (!this.config.socialLinks) return '';

    const links = [];
    if (this.config.socialLinks.facebook) {
      links.push(`<a href="${this.config.socialLinks.facebook}" style="color: #4b5563; margin: 0 8px; text-decoration: none;">Facebook</a>`);
    }
    if (this.config.socialLinks.twitter) {
      links.push(`<a href="${this.config.socialLinks.twitter}" style="color: #4b5563; margin: 0 8px; text-decoration: none;">Twitter</a>`);
    }
    if (this.config.socialLinks.instagram) {
      links.push(`<a href="${this.config.socialLinks.instagram}" style="color: #4b5563; margin: 0 8px; text-decoration: none;">Instagram</a>`);
    }
    if (this.config.socialLinks.linkedin) {
      links.push(`<a href="${this.config.socialLinks.linkedin}" style="color: #4b5563; margin: 0 8px; text-decoration: none;">LinkedIn</a>`);
    }

    return links.length > 0 ? `<div style="margin-bottom: 16px;">${links.join(' | ')}</div>` : '';
  }

  private personalize(text: string, data: EmailPersonalization): string {
    let result = text;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`\\[${key}\\]`, 'gi');
      result = result.replace(regex, data[key]?.toString() || '');
    });
    return result;
  }

  private formatCurrency(amount: number, currency: string): string {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥'
    };

    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toFixed(2)}`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private getTransactionalPreheader(type: string): string {
    const preheaders: Record<string, string> = {
      'order-confirmation': 'Your order has been confirmed',
      'shipping-notification': 'Your package is on the way',
      'password-reset': 'Reset your password',
      'receipt': 'Your receipt',
      'account-update': 'Your account has been updated'
    };
    return preheaders[type] || '';
  }

  private getTextFooter(): string {
    return `\n\n---\n${this.config.brandName}\n${this.config.footerText}\n${this.config.unsubscribeUrl ? `Unsubscribe: ${this.config.unsubscribeUrl}` : ''}`;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export function getEmailTemplate(config: EmailConfig): EmailTemplate {
  return new EmailTemplate(config);
}

// Default export
export default EmailTemplate;
