# EmailTemplate - Responsive HTML Email Templates Guide

## Overview

The EmailTemplate is a comprehensive TypeScript utility for generating production-ready, responsive HTML email templates. All templates are tested across major email clients and optimized for mobile devices with inline CSS.

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Email Types](#email-types)
4. [Configuration](#configuration)
5. [Personalization](#personalization)
6. [Best Practices](#best-practices)
7. [Email Client Compatibility](#email-client-compatibility)
8. [API Reference](#api-reference)
9. [Examples](#examples)

## Installation

```bash
npm install dotenv
```

## Quick Start

```typescript
import { getEmailTemplate, EmailConfig } from './templates/emails/EmailTemplate';

// Configure your email branding
const config: EmailConfig = {
  brandName: 'Your Company',
  brandLogo: 'https://example.com/logo.png',
  primaryColor: '#2563eb',
  socialLinks: {
    facebook: 'https://facebook.com/yourcompany',
    twitter: 'https://twitter.com/yourcompany'
  },
  unsubscribeUrl: 'https://example.com/unsubscribe'
};

const template = getEmailTemplate(config);

// Create a welcome email
const email = template.createWelcomeEmail({
  subject: 'Welcome to Our Platform!',
  headline: 'Welcome Aboard!',
  message: 'We\'re excited to have you here.',
  ctaText: 'Get Started',
  ctaUrl: 'https://example.com/start'
});

// The email object contains both HTML and plain text versions
console.log(email.html); // Full HTML email
console.log(email.text); // Plain text fallback
```

## Email Types

### 1. Welcome Emails

Onboard new users with step-by-step guidance and benefits.

**Features:**
- Numbered steps with descriptions
- Benefit highlights
- Clear call-to-action
- Personalization support

**Example:**
```typescript
const welcomeEmail = template.createWelcomeEmail({
  subject: 'Welcome to SmartHome Pro!',
  preheader: 'Thanks for joining us!',
  headline: 'Welcome to the Smart Home Revolution!',
  message: 'We\'re thrilled to have you join our community.',
  ctaText: 'Complete Your Profile',
  ctaUrl: 'https://example.com/profile',
  steps: [
    {
      stepNumber: 1,
      title: 'Set Up Your Account',
      description: 'Complete your profile to get started'
    },
    {
      stepNumber: 2,
      title: 'Connect Your Devices',
      description: 'Add your smart home devices to the app'
    },
    {
      stepNumber: 3,
      title: 'Create Automations',
      description: 'Set up custom scenes and schedules'
    }
  ],
  benefits: [
    'Control all devices from one app',
    '24/7 customer support',
    'Advanced automation features'
  ],
  personalization: {
    firstName: 'John'
  }
});
```

### 2. Newsletters

Engage subscribers with curated content and updates.

**Features:**
- Featured article spotlight
- Multiple article cards
- Category tags and read times
- Optional CTA section
- Header image support

**Example:**
```typescript
const newsletter = template.generateNewsletters({
  subject: 'Your Weekly Digest',
  headerImage: 'https://example.com/header.jpg',
  introText: 'Welcome to this week\'s edition!',
  featuredArticle: {
    title: 'The Future of Home Automation',
    excerpt: 'Discover the latest innovations...',
    imageUrl: 'https://example.com/featured.jpg',
    linkUrl: 'https://example.com/article/future',
    category: 'Industry News',
    readTime: 8
  },
  articles: [
    {
      title: '5 Energy Saving Tips',
      excerpt: 'Reduce your bills with these tips...',
      imageUrl: 'https://example.com/tips.jpg',
      linkUrl: 'https://example.com/tips',
      category: 'Tips',
      readTime: 5
    }
  ],
  ctaSection: {
    headline: 'Ready to Upgrade?',
    text: 'Browse our latest products',
    buttonText: 'Shop Now',
    buttonUrl: 'https://example.com/shop'
  }
});
```

### 3. Abandoned Cart Emails

Recover lost sales with cart reminders and incentives.

**Features:**
- Product images and details
- Cart total calculation
- Discount code highlighting
- Urgency messaging
- Clear checkout CTA

**Example:**
```typescript
const abandonedCart = template.createAbandonedCart({
  subject: 'Your cart misses you!',
  customerName: 'Sarah',
  cartItems: [
    {
      name: 'Smart Camera Pro',
      imageUrl: 'https://example.com/camera.jpg',
      price: 199.99,
      quantity: 2,
      productUrl: 'https://example.com/product/camera'
    }
  ],
  cartTotal: 399.98,
  currency: 'USD',
  discountCode: 'COMEBACK10',
  discountAmount: '10% off',
  urgencyMessage: 'Items selling fast! Complete your order in 24 hours.',
  ctaUrl: 'https://example.com/checkout'
});
```

### 4. Promotional Emails

Drive sales with time-limited offers and featured products.

**Features:**
- Hero image banner
- Urgency badges
- Discount code display
- Product grid (up to 3)
- Countdown to expiry

**Example:**
```typescript
const promotional = template.buildPromotionalEmail({
  subject: 'Flash Sale: 25% Off!',
  headline: 'Flash Sale Alert!',
  offerText: 'Save 25% on All Cameras',
  offerDetails: 'Plus free shipping over $100',
  heroImage: 'https://example.com/flash-sale.jpg',
  products: [
    {
      name: 'SmartGuard Pro',
      originalPrice: 199.99,
      salePrice: 149.99,
      imageUrl: 'https://example.com/product1.jpg',
      productUrl: 'https://example.com/product/1',
      savingsPercent: 25
    }
  ],
  ctaText: 'Shop Flash Sale',
  ctaUrl: 'https://example.com/sale',
  expiryDate: new Date('2024-12-31'),
  discountCode: 'FLASH25',
  urgencyBadge: 'Ends Tonight'
});
```

### 5. Transactional Emails

Send automated order confirmations, shipping updates, and more.

**Types:**
- Order Confirmation
- Shipping Notification
- Password Reset
- Receipt
- Account Update

**Example - Order Confirmation:**
```typescript
const orderConfirmation = template.createTransactional({
  type: 'order-confirmation',
  subject: 'Order Confirmation #12345',
  customerName: 'Mike',
  orderNumber: '12345',
  orderDate: new Date(),
  orderItems: [
    {
      name: 'Smart Camera Pro',
      quantity: 2,
      price: 199.99,
      imageUrl: 'https://example.com/camera.jpg'
    }
  ],
  subtotal: 399.98,
  tax: 32.00,
  shipping: 0,
  total: 431.98,
  currency: 'USD',
  ctaText: 'View Order',
  ctaUrl: 'https://example.com/orders/12345'
});
```

**Example - Shipping Notification:**
```typescript
const shipping = template.createTransactional({
  type: 'shipping-notification',
  subject: 'Your order has shipped!',
  customerName: 'Mike',
  orderNumber: '12345',
  trackingNumber: 'TRK123456789',
  trackingUrl: 'https://tracking.example.com/TRK123456789',
  estimatedDelivery: new Date('2024-12-25')
});
```

**Example - Password Reset:**
```typescript
const passwordReset = template.createTransactional({
  type: 'password-reset',
  subject: 'Reset your password',
  customerName: 'Alex',
  resetLink: 'https://example.com/reset?token=abc123',
  resetExpiry: 24 // hours
});
```

### 6. Email Sequences

Create automated drip campaigns with timed emails.

**Sequence Types:**
- Onboarding
- Nurture
- Re-engagement
- Educational
- Sales

**Example:**
```typescript
const sequence = template.generateSequences({
  sequenceName: 'New Customer Onboarding',
  sequenceType: 'onboarding',
  emails: [
    {
      dayOffset: 0, // Send immediately
      subject: 'Welcome!',
      headline: 'Welcome Aboard!',
      content: 'Thanks for joining us...',
      ctaText: 'Get Started',
      ctaUrl: 'https://example.com/start',
      tips: [
        'Download our mobile app',
        'Complete your profile',
        'Explore our knowledge base'
      ]
    },
    {
      dayOffset: 2, // Send 2 days later
      subject: 'Quick Setup Guide',
      headline: 'Let\'s Get You Set Up',
      content: 'Here\'s how to get started...',
      ctaText: 'Watch Tutorial',
      ctaUrl: 'https://example.com/tutorial'
    },
    {
      dayOffset: 7, // Send 7 days later
      subject: 'Exclusive Offer',
      headline: 'Special Discount for You!',
      content: 'As a thank you, here\'s 20% off...',
      ctaText: 'Shop Now',
      ctaUrl: 'https://example.com/shop?code=WELCOME20'
    }
  ],
  personalization: {
    firstName: 'Emily'
  }
});

// Access individual emails in the sequence
sequence.emails.forEach(email => {
  console.log(`Day ${email.dayOffset}: ${email.email.subject}`);
  // email.email.html contains the rendered HTML
  // email.email.text contains the plain text version
});
```

## Configuration

### EmailConfig Interface

```typescript
interface EmailConfig {
  brandName: string;              // Required: Your company name
  brandLogo?: string;              // URL to your logo (150x50px recommended)
  primaryColor?: string;           // Main brand color (default: '#2563eb')
  secondaryColor?: string;         // Secondary color (default: '#1e40af')
  accentColor?: string;            // Accent/highlight color (default: '#f59e0b')
  fontFamily?: string;             // Font stack for email
  footerText?: string;             // Custom footer text
  unsubscribeUrl?: string;         // Unsubscribe link
  viewInBrowserUrl?: string;       // "View in browser" link
  socialLinks?: {                  // Social media links
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  companyAddress?: string;         // Physical address for footer
}
```

### Default Values

```typescript
{
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af',
  accentColor: '#f59e0b',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  footerText: '© 2024 YourBrand. All rights reserved.'
}
```

## Personalization

All email methods support personalization through the `personalization` parameter.

### Available Variables

```typescript
{
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  [key: string]: any;  // Custom fields
}
```

### Usage in Subject Lines

Use square brackets to insert personalized data:

```typescript
const email = template.createWelcomeEmail({
  subject: 'Welcome [firstName]!',  // Becomes "Welcome John!"
  personalization: {
    firstName: 'John'
  }
});
```

### Usage in Content

Personalization automatically applies to:
- Subject lines
- Email body content
- Greetings and sign-offs

## Best Practices

### 1. Subject Lines

```typescript
// DO: Keep under 50 characters
subject: 'Your order #12345 has shipped!'

// DON'T: Use all caps or excessive punctuation
subject: 'YOUR ORDER HAS SHIPPED!!!'
```

### 2. Preheaders

```typescript
// DO: Complement the subject line
preheader: 'Track your package and see delivery date'

// DON'T: Repeat the subject line
preheader: 'Your order has shipped'
```

### 3. Call-to-Action Buttons

```typescript
// DO: Use action-oriented text
ctaText: 'Complete Your Purchase'
ctaText: 'Download Your Guide'
ctaText: 'Activate Your Account'

// DON'T: Use generic text
ctaText: 'Click Here'
ctaText: 'Learn More'
```

### 4. Images

- Use descriptive alt text
- Keep file sizes under 1MB
- Use https:// URLs
- Recommended sizes:
  - Logo: 150x50px
  - Header: 600x200px
  - Product: 180x180px
  - Hero: 600x300px

### 5. Mobile Optimization

All templates are automatically mobile-responsive. No additional work needed!

### 6. Testing

Always test emails in multiple clients:

```bash
# Send test email
npx ts-node src/test-email-template.ts

# Open generated HTML files
open generated-emails/welcome-email.html
```

### 7. File Size

Keep total email size under 100KB:
- Minify HTML (done automatically)
- Optimize images
- Limit embedded content

## Email Client Compatibility

All templates are tested and compatible with:

### Desktop Clients
- ✅ Gmail (Web)
- ✅ Outlook 2010-2021
- ✅ Outlook 365
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ AOL Mail

### Mobile Clients
- ✅ Gmail (iOS & Android)
- ✅ Apple Mail (iOS)
- ✅ Outlook (iOS & Android)
- ✅ Samsung Email
- ✅ Yahoo Mail Mobile

### Webmail
- ✅ Gmail
- ✅ Outlook.com
- ✅ Yahoo
- ✅ AOL

### Known Limitations

**Outlook 2007-2013:**
- Uses Microsoft Word rendering engine
- Limited CSS support
- Background images may not display

**Gmail:**
- Removes `<style>` tags (we use inline CSS)
- Converts some colors
- May clip emails over 102KB

## API Reference

### `createWelcomeEmail(options): WelcomeEmail`

Creates a welcome email with optional steps and benefits.

**Parameters:**
- `subject` (string, required)
- `preheader` (string, optional)
- `headline` (string, required)
- `message` (string, required)
- `ctaText` (string, required)
- `ctaUrl` (string, required)
- `steps` (WelcomeStep[], optional)
- `benefits` (string[], optional)
- `personalization` (object, optional)

**Returns:** `{ subject, preheader, html, text, metadata }`

### `generateNewsletters(options): Newsletter`

Generates a newsletter with articles and optional featured content.

**Parameters:**
- `subject` (string, required)
- `preheader` (string, optional)
- `headerImage` (string, optional)
- `introText` (string, optional)
- `articles` (NewsletterArticle[], required)
- `featuredArticle` (NewsletterArticle, optional)
- `ctaSection` (object, optional)
- `personalization` (object, optional)

### `createAbandonedCart(options): AbandonedCartEmail`

Creates a cart recovery email.

**Parameters:**
- `subject` (string, required)
- `customerName` (string, optional)
- `cartItems` (CartItem[], required)
- `cartTotal` (number, required)
- `currency` (string, optional, default: 'USD')
- `discountCode` (string, optional)
- `urgencyMessage` (string, optional)
- `ctaUrl` (string, required)

### `buildPromotionalEmail(options): PromotionalEmail`

Builds a promotional campaign email.

**Parameters:**
- `subject` (string, required)
- `headline` (string, required)
- `offerText` (string, required)
- `heroImage` (string, optional)
- `products` (PromotionalProduct[], optional)
- `ctaText` (string, required)
- `ctaUrl` (string, required)
- `expiryDate` (Date, optional)
- `discountCode` (string, optional)

### `createTransactional(options): TransactionalEmail`

Creates a transactional email (order, shipping, password reset, etc.).

**Parameters:**
- `type` (string, required): 'order-confirmation' | 'shipping-notification' | 'password-reset' | 'receipt' | 'account-update'
- `subject` (string, required)
- `customerName` (string, optional)
- Additional type-specific parameters

### `generateSequences(options): EmailSequence`

Generates an automated email sequence.

**Parameters:**
- `sequenceName` (string, required)
- `sequenceType` (string, required): 'onboarding' | 'nurture' | 're-engagement' | 'educational' | 'sales'
- `emails` (SequenceEmail[], required)
- `personalization` (object, optional)

## Examples

### Example 1: Complete Onboarding Campaign

```typescript
const config: EmailConfig = {
  brandName: 'MyApp',
  brandLogo: 'https://myapp.com/logo.png',
  primaryColor: '#4f46e5',
  socialLinks: {
    twitter: 'https://twitter.com/myapp',
    facebook: 'https://facebook.com/myapp'
  },
  unsubscribeUrl: 'https://myapp.com/unsubscribe'
};

const template = getEmailTemplate(config);

// Day 0: Welcome
const day0 = template.createWelcomeEmail({
  subject: 'Welcome to MyApp, [firstName]!',
  headline: 'Let\'s Get Started',
  message: 'We\'re excited to have you!',
  ctaText: 'Complete Setup',
  ctaUrl: 'https://myapp.com/setup',
  steps: [
    {
      stepNumber: 1,
      title: 'Verify Email',
      description: 'Click the link we sent you'
    },
    {
      stepNumber: 2,
      title: 'Set Up Profile',
      description: 'Tell us about yourself'
    },
    {
      stepNumber: 3,
      title: 'Explore Features',
      description: 'Take a quick tour'
    }
  ],
  personalization: { firstName: 'Sarah' }
});

// Day 3: Education
const day3 = template.createWelcomeEmail({
  subject: 'Here\'s how to get the most from MyApp',
  headline: 'Pro Tips Inside',
  message: 'Learn the features that power users love.',
  ctaText: 'Watch Tutorial',
  ctaUrl: 'https://myapp.com/tutorial',
  personalization: { firstName: 'Sarah' }
});

// Day 7: Upgrade prompt
const day7 = template.buildPromotionalEmail({
  subject: 'Upgrade to Pro - 20% Off',
  headline: 'Ready for More?',
  offerText: 'Get 20% off Pro',
  offerDetails: 'Unlock unlimited features',
  ctaText: 'Upgrade Now',
  ctaUrl: 'https://myapp.com/upgrade',
  discountCode: 'WELCOME20'
});
```

### Example 2: E-commerce Automation

```typescript
// Order confirmation
const orderEmail = template.createTransactional({
  type: 'order-confirmation',
  subject: 'Order #[orderNumber] confirmed',
  customerName: '[firstName]',
  orderNumber: '54321',
  orderItems: [...],
  total: 299.99,
  personalization: {
    firstName: 'John',
    orderNumber: '54321'
  }
});

// Shipping notification (sent when order ships)
const shippingEmail = template.createTransactional({
  type: 'shipping-notification',
  subject: 'Your order is on the way!',
  customerName: 'John',
  trackingNumber: 'TRK789',
  trackingUrl: 'https://tracking.com/TRK789'
});

// Abandoned cart (sent 1 hour after abandonment)
const cartEmail = template.createAbandonedCart({
  subject: 'Complete your purchase',
  customerName: 'John',
  cartItems: [...],
  cartTotal: 299.99,
  discountCode: 'SAVE10',
  discountAmount: '10%',
  urgencyMessage: 'Limited stock! Complete in 24 hours.',
  ctaUrl: 'https://shop.com/checkout'
});
```

### Example 3: Content Newsletter

```typescript
const newsletter = template.generateNewsletters({
  subject: 'Weekly Tech Digest - Dec 2024',
  headerImage: 'https://example.com/newsletter-header.jpg',
  introText: 'This week: AI breakthroughs, new products, and expert tips.',
  featuredArticle: {
    title: 'The AI Revolution in Home Automation',
    excerpt: 'How artificial intelligence is transforming smart homes...',
    imageUrl: 'https://example.com/ai-article.jpg',
    linkUrl: 'https://blog.example.com/ai-revolution',
    category: 'AI & Machine Learning',
    readTime: 12
  },
  articles: [
    {
      title: 'Top 10 Smart Home Gadgets of 2024',
      excerpt: 'Our picks for the best devices released this year...',
      imageUrl: 'https://example.com/gadgets.jpg',
      linkUrl: 'https://blog.example.com/top-10-gadgets',
      category: 'Product Reviews',
      readTime: 8
    },
    {
      title: 'How to Secure Your Smart Home Network',
      excerpt: 'Essential security practices every smart homeowner should know...',
      imageUrl: 'https://example.com/security.jpg',
      linkUrl: 'https://blog.example.com/security-guide',
      category: 'Security',
      readTime: 6
    },
    {
      title: 'Interview: Smart Home Pioneer Dr. Jane Smith',
      excerpt: 'We sat down with the inventor of the first smart thermostat...',
      imageUrl: 'https://example.com/interview.jpg',
      linkUrl: 'https://blog.example.com/jane-smith-interview',
      category: 'Interviews',
      readTime: 10
    }
  ],
  ctaSection: {
    headline: 'Stay Updated',
    text: 'Follow us on social media for daily tips and news',
    buttonText: 'Follow Us',
    buttonUrl: 'https://example.com/social'
  }
});
```

## Testing

Run the comprehensive test suite:

```bash
npx ts-node src/test-email-template.ts
```

This generates 11 HTML email files in `./generated-emails/`:
- welcome-email.html
- newsletter.html
- abandoned-cart.html
- promotional.html
- order-confirmation.html
- shipping-notification.html
- password-reset.html
- sequence-day-0.html
- sequence-day-2.html
- sequence-day-5.html
- sequence-day-7.html

Open these files in a browser to preview the emails.

## Integration with Email Services

### SendGrid

```typescript
import sgMail from '@sendgrid/mail';

const email = template.createWelcomeEmail({...});

const msg = {
  to: 'user@example.com',
  from: 'noreply@yourcompany.com',
  subject: email.subject,
  text: email.text,
  html: email.html
};

await sgMail.send(msg);
```

### Mailchimp

```typescript
import mailchimp from '@mailchimp/mailchimp_transactional';

const email = template.createWelcomeEmail({...});

await mailchimp.messages.send({
  message: {
    subject: email.subject,
    from_email: 'noreply@yourcompany.com',
    to: [{ email: 'user@example.com' }],
    html: email.html,
    text: email.text
  }
});
```

### AWS SES

```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const email = template.createWelcomeEmail({...});

const command = new SendEmailCommand({
  Source: 'noreply@yourcompany.com',
  Destination: { ToAddresses: ['user@example.com'] },
  Message: {
    Subject: { Data: email.subject },
    Body: {
      Html: { Data: email.html },
      Text: { Data: email.text }
    }
  }
});

await sesClient.send(command);
```

## Support

For questions or issues:
- Check main README: `/src/utils/README.md`
- Review test file: `/src/test-email-template.ts`
- Check templates: `/src/templates/emails/`

## License

Part of the Niche Empire Builder toolkit.
