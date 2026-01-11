# ContentTemplate - Marketing Content Generator Guide

## Overview

The ContentTemplate is a comprehensive TypeScript utility for generating optimized marketing content across multiple channels. It provides professional, platform-specific content structures for blogs, social media, video scripts, emails, ads, and landing pages.

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Content Types](#content-types)
4. [Core Features](#core-features)
5. [Platform Specifications](#platform-specifications)
6. [Best Practices](#best-practices)
7. [API Reference](#api-reference)
8. [Examples](#examples)

## Installation

```bash
npm install dotenv
```

## Quick Start

```typescript
import { getContentTemplate } from './templates/content/ContentTemplate';

const template = getContentTemplate();

// Create a blog post
const blogPost = template.createBlogPost({
  title: 'How to Get Started with Smart Home Security',
  topic: 'smart home security',
  wordCount: 1500
});

// Generate a social media post
const socialPost = template.generateSocialPost({
  platform: 'instagram',
  message: 'Just launched our new smart camera! 🔥',
  includeHashtags: true
});
```

## Content Types

### 1. Blog Posts

Create SEO-optimized blog posts with table of contents, FAQs, and structured data.

**Features:**
- SEO optimization with keywords and meta tags
- Automatic table of contents generation
- FAQ section integration
- Reading time calculation
- Schema.org markup
- Image placeholders
- Multiple tone options

**Example:**
```typescript
const blogPost = template.createBlogPost({
  title: 'The Ultimate Guide to Smart Home Security in 2024',
  topic: 'smart home security',
  keywords: ['smart home', 'security cameras', 'home automation'],
  targetAudience: 'homeowners',
  tone: 'professional',
  wordCount: 2000,
  includeImages: true,
  includeToc: true,
  includeFaq: true,
  author: {
    name: 'Sarah Mitchell',
    bio: 'Smart home security expert',
    avatar: 'https://example.com/sarah.jpg'
  },
  category: 'Home Security',
  tags: ['security', 'smart home', 'technology']
});

console.log(blogPost.seo.readingTime); // 10 minutes
console.log(blogPost.content.sections.length); // 6+ sections
console.log(blogPost.content.tableOfContents); // Navigation items
```

**Output Structure:**
```typescript
{
  id: 'the-ultimate-guide-to-smart-home-security-in-2',
  type: 'blog-post',
  title: 'The Ultimate Guide to Smart Home Security in 2024',
  slug: 'the-ultimate-guide-to-smart-home-security-in-2024',
  metaTitle: 'The Ultimate Guide to Smart Home Security in 2024 | smart home',
  metaDescription: '...',
  content: {
    introduction: '...',
    sections: [
      {
        heading: 'Understanding smart home security',
        level: 2,
        content: '...',
        list: ['Key point 1', 'Key point 2', ...]
      }
    ],
    conclusion: '...',
    tableOfContents: [...],
    faq: [...]
  },
  seo: {
    keywords: ['smart home', 'security cameras', ...],
    focusKeyword: 'smart home',
    readingTime: 10,
    wordCount: 2000
  }
}
```

### 2. Social Media Posts

Generate platform-optimized social media content with hashtags, emojis, and engagement features.

**Supported Platforms:**
- Facebook
- Twitter (X)
- Instagram
- LinkedIn
- TikTok
- Pinterest

**Platform-Specific Features:**
- **Character limits**: Automatically enforced for each platform
- **Hashtag optimization**: Platform-appropriate hashtag counts
- **Emoji integration**: Added based on platform conventions
- **Best posting times**: Data-driven scheduling recommendations
- **A/B testing variants**: 3 versions for testing

**Example:**
```typescript
const socialPost = template.generateSocialPost({
  platform: 'instagram',
  message: 'Just launched our new SmartGuard Pro Camera! 4K quality, AI detection, and night vision.',
  topic: 'smart home camera launch',
  includeHashtags: true,
  includeEmojis: true,
  includeCallToAction: true,
  targetUrl: 'https://example.com/smart-camera',
  mediaType: 'image'
});

console.log(socialPost.content.hashtags);
// ['smarthome', 'securitycamera', 'homeautomation', ...]

console.log(socialPost.optimization.engagementPotential);
// 'high'

console.log(socialPost.scheduling.bestTimeToPost);
// '11:00 AM - 1:00 PM weekdays'
```

**Platform Specifications:**
```typescript
{
  twitter: { maxCharacters: 280, maxHashtags: 2 },
  facebook: { maxCharacters: 63206, maxHashtags: 3 },
  instagram: { maxCharacters: 2200, maxHashtags: 30 },
  linkedin: { maxCharacters: 3000, maxHashtags: 3 },
  tiktok: { maxCharacters: 2200, maxHashtags: 5 },
  pinterest: { maxCharacters: 500, maxHashtags: 20 }
}
```

### 3. Video Scripts

Create professional video scripts with timing, visual cues, and subtitle blocks.

**Video Types:**
- Product demo
- Tutorial
- Promotional
- Testimonial
- Educational
- Shorts (TikTok, YouTube Shorts, Instagram Reels)

**Features:**
- Precise timing for each segment
- Visual and audio cues
- Subtitle generation
- Scene breakdown
- Pacing analysis
- Hook optimization
- CTA placement

**Example:**
```typescript
const videoScript = template.createVideoScript({
  title: 'SmartGuard Pro Camera Setup and Features',
  duration: 60, // seconds
  type: 'product-demo',
  platform: 'youtube',
  tone: 'energetic',
  targetAudience: 'homeowners',
  callToAction: 'Get yours today at smartguard.com',
  includeSubtitles: true,
  product: 'SmartGuard Pro Camera'
});

console.log(videoScript.structure.hook.dialogue);
// "Are you tired of [problem]? Watch this."

console.log(videoScript.scenes.length); // 5+ scenes
console.log(videoScript.subtitles?.length); // 30+ subtitle blocks
console.log(videoScript.metadata.pacing); // 'medium' | 'fast' | 'slow'
```

**Script Structure:**
```typescript
{
  structure: {
    hook: {
      timestamp: '0:00-0:05',
      dialogue: '...',
      visualDescription: '...',
      audioNotes: '...',
      duration: 5
    },
    introduction: { ... },
    mainContent: [ ... ],
    callToAction: { ... },
    outro: { ... }
  },
  scenes: [
    {
      sceneNumber: 1,
      duration: 5,
      shot: 'Close-up of product',
      dialogue: '...',
      visual: '...',
      audio: '...'
    }
  ],
  subtitles: [
    {
      startTime: 0,
      endTime: 2.5,
      text: '...'
    }
  ]
}
```

### 4. Email Copy

Write conversion-optimized email copy for various purposes.

**Email Types:**
- Welcome emails
- Promotional campaigns
- Newsletters
- Transactional emails
- Follow-ups
- Abandoned cart recovery

**Features:**
- Subject line optimization with scoring
- Preheader text generation
- Spam score calculation
- Mobile optimization
- Personalization tokens
- A/B test variants
- Template selection
- Read time estimation

**Example:**
```typescript
const emailCopy = template.writeEmailCopy({
  subject: 'Welcome to SmartHome Pro!',
  purpose: 'welcome',
  recipientName: 'Yassine',
  tone: 'friendly',
  includePreheader: true,
  callToAction: 'Get Started',
  targetUrl: 'https://example.com/start',
  product: 'SmartGuard Pro Camera',
  personalization: {
    firstName: 'Yassine',
    company: 'Acme Inc'
  }
});

console.log(emailCopy.optimization.subjectLineScore); // 75/100
console.log(emailCopy.optimization.spamScore); // 2/10 (lower is better)
console.log(emailCopy.design.template); // 'welcome-template'
```

**Email Structure:**
```typescript
{
  subject: 'Welcome to SmartHome Pro!',
  preheader: 'Thanks for joining us! Here\'s what to do next...',
  content: {
    greeting: 'Hi Yassine,',
    introduction: '...',
    body: [
      { type: 'text', content: '...' },
      { type: 'product', content: '...', imageUrl: '...' },
      { type: 'button', buttonText: 'Get Started', buttonUrl: '...' }
    ],
    callToAction: {
      text: 'Get Started',
      url: '...',
      buttonStyle: 'primary'
    },
    footer: '...'
  },
  optimization: {
    subjectLineScore: 75,
    mobileOptimized: true,
    spamScore: 2,
    estimatedReadTime: 1
  }
}
```

### 5. Ad Copy

Generate high-converting ad copy optimized for different platforms.

**Supported Platforms:**
- Google Ads (Search, Display)
- Facebook Ads
- Instagram Ads
- LinkedIn Ads
- Twitter Ads
- TikTok Ads

**Ad Types:**
- Search ads
- Display ads
- Video ads
- Shopping ads
- Carousel ads

**Features:**
- Platform-specific character limits
- Headline optimization
- Quality score calculation
- Relevance scoring
- A/B test variants (3 versions)
- Targeting recommendations
- Optimization suggestions

**Example:**
```typescript
const adCopy = template.generateAdCopy({
  platform: 'google',
  adType: 'search',
  product: 'SmartGuard Pro Camera',
  targetAudience: 'homeowners aged 30-55',
  budget: 1000,
  objective: 'conversion',
  keywords: ['smart camera', 'home security', 'security camera'],
  callToAction: 'Buy Now',
  offer: 'Free shipping + 30-day trial',
  tone: 'direct'
});

console.log(adCopy.content.headline);
// "SmartGuard Pro Camera - Free shipping + 30-day trial"

console.log(adCopy.specifications.meetsRequirements); // true
console.log(adCopy.optimization.qualityScore); // 85/100
console.log(adCopy.variants.length); // 3
```

**Character Limits by Platform:**
```typescript
{
  google: {
    search: { headline: 30, body: 90 },
    display: { headline: 30, body: 90, subheadline: 60 }
  },
  facebook: { headline: 40, body: 125, subheadline: 60 },
  instagram: { headline: 40, body: 125 },
  linkedin: { headline: 70, body: 150 }
}
```

### 6. Landing Pages

Create high-converting landing page structures with optimized sections.

**Landing Page Types:**
- Product launch
- Lead generation
- Sales pages
- Event registration
- Download pages

**Features:**
- Hero section with CTA
- Feature highlights
- Benefits presentation
- Social proof / testimonials
- Pricing tables
- FAQ sections
- Lead capture forms
- Trust signals
- SEO optimization
- Schema.org markup

**Example:**
```typescript
const landingPage = template.createLandingPage({
  title: 'SmartGuard Pro - Professional Home Security',
  purpose: 'product-launch',
  product: 'SmartGuard Pro Camera',
  offer: 'Launch Special: 25% off + Free Shipping',
  targetAudience: 'homeowners',
  includeTestimonials: true,
  includeFeatures: true,
  includePricing: true,
  includeFaq: true,
  callToAction: 'Get Your Camera Today',
  formFields: [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true }
  ],
  socialProof: [
    {
      type: 'testimonial',
      content: 'This camera has transformed how I monitor my home!',
      author: 'Sarah J.',
      rating: 5
    }
  ]
});

console.log(landingPage.sections.length); // 8+ sections
console.log(landingPage.design.hero.headline);
// "SmartGuard Pro - Professional Home Security - Launch Special..."
```

**Landing Page Sections:**
```typescript
{
  sections: [
    { type: 'hero', title: '...', content: '...', image: {...} },
    { type: 'features', title: 'Key Features', items: [...] },
    { type: 'benefits', title: 'Why Choose Us', items: [...] },
    { type: 'testimonials', title: 'What Our Customers Say', items: [...] },
    { type: 'pricing', title: 'Special Offer', content: '...' },
    { type: 'faq', title: 'Frequently Asked Questions', items: [...] },
    { type: 'form', title: 'Get Your Camera Today', content: '...' }
  ]
}
```

## Core Features

### 1. SEO Optimization

All content types include SEO best practices:

- **Meta tags**: Title, description, keywords
- **Schema.org markup**: Structured data for search engines
- **Keyword optimization**: Focus keyword integration
- **Readability scoring**: Content quality assessment
- **Open Graph tags**: Social media sharing optimization

### 2. Platform Specifications

Automatic enforcement of platform-specific requirements:

- Character limits
- Hashtag limits
- Image size requirements
- File type restrictions
- Best practices compliance

### 3. A/B Testing

Generate multiple variants for testing:

- Email subject lines (3 variants)
- Social media copy (3 variants)
- Ad headlines and body (3 variants)
- Different angles and approaches

### 4. Optimization Scoring

Quantitative metrics for content quality:

- Subject line score (0-100)
- Quality score (0-100)
- Spam score (0-10, lower is better)
- Readability score (0-100)
- Engagement potential (low/medium/high)
- Relevance score (0-100%)

### 5. Personalization

Dynamic content customization:

- Name variables: `[First Name]`, `[Last Name]`
- Custom fields: Company, role, location
- Dynamic offers and pricing
- Conditional content sections

## Platform Specifications

### Social Media

| Platform | Max Chars | Max Hashtags | Best Time |
|----------|-----------|--------------|-----------|
| Twitter | 280 | 2 | 12:00-1:00 PM |
| Facebook | 63,206 | 3 | 1:00-3:00 PM |
| Instagram | 2,200 | 30 | 11:00 AM-1:00 PM |
| LinkedIn | 3,000 | 3 | 7:30-8:30 AM |
| TikTok | 2,200 | 5 | 6:00-10:00 AM |
| Pinterest | 500 | 20 | 8:00-11:00 PM |

### Ad Platforms

| Platform | Type | Headline | Body | Subheadline |
|----------|------|----------|------|-------------|
| Google | Search | 30 | 90 | - |
| Google | Display | 30 | 90 | 60 |
| Facebook | All | 40 | 125 | 60 |
| Instagram | All | 40 | 125 | - |
| LinkedIn | All | 70 | 150 | - |

### Video Durations

| Platform | Type | Ideal Duration |
|----------|------|----------------|
| YouTube | Standard | 7-15 minutes |
| YouTube | Shorts | 15-60 seconds |
| TikTok | Video | 21-34 seconds |
| Instagram | Reels | 15-30 seconds |
| Instagram | Feed | 30-60 seconds |
| Facebook | Feed | 1-2 minutes |

## Best Practices

### Blog Posts

```typescript
// DO: Specify target audience and tone
const blogPost = template.createBlogPost({
  title: 'How to...',
  topic: 'specific topic',
  targetAudience: 'homeowners',
  tone: 'professional',
  wordCount: 1500,
  includeToc: true,
  includeFaq: true
});

// DON'T: Use vague topics
const bad = template.createBlogPost({
  title: 'Stuff',
  topic: 'things'
});
```

### Social Media

```typescript
// DO: Use platform-appropriate settings
const instagram = template.generateSocialPost({
  platform: 'instagram',
  message: 'Clear, engaging message',
  includeHashtags: true, // Instagram loves hashtags
  includeEmojis: true,
  targetUrl: 'https://...'
});

// DON'T: Use same settings for LinkedIn
const linkedin = template.generateSocialPost({
  platform: 'linkedin',
  message: 'Professional update',
  includeHashtags: false, // Less important on LinkedIn
  includeEmojis: false // Keep professional
});
```

### Email Copy

```typescript
// DO: Keep subject lines short and clear
const email = template.writeEmailCopy({
  subject: 'Your exclusive 25% discount', // Clear value
  purpose: 'promotional',
  includePreheader: true
});

// DON'T: Use spammy language
const bad = template.writeEmailCopy({
  subject: 'FREE!!! ACT NOW!!! URGENT!!!', // High spam score
  purpose: 'promotional'
});
```

### Ad Copy

```typescript
// DO: Include clear offer and CTA
const ad = template.generateAdCopy({
  platform: 'google',
  adType: 'search',
  product: 'SmartGuard Pro Camera',
  offer: '25% off + free shipping',
  callToAction: 'Buy Now',
  keywords: ['smart camera', 'home security']
});

// DON'T: Be vague
const bad = template.generateAdCopy({
  platform: 'google',
  adType: 'search',
  product: 'Camera',
  // Missing offer, keywords, CTA
});
```

### Landing Pages

```typescript
// DO: Include all conversion elements
const landing = template.createLandingPage({
  title: 'Clear Value Proposition',
  purpose: 'product-launch',
  product: 'Specific Product',
  offer: 'Compelling Offer',
  includeTestimonials: true,
  includeFeatures: true,
  includeFaq: true,
  callToAction: 'Get Started Today'
});

// DON'T: Skip important sections
const bad = template.createLandingPage({
  title: 'Product',
  purpose: 'sales',
  callToAction: 'Buy'
  // Missing testimonials, features, offer
});
```

## API Reference

### `createBlogPost(options: BlogPostOptions): BlogPost`

Creates an SEO-optimized blog post.

**Parameters:**
- `title` (string, required): Blog post title
- `topic` (string, required): Main topic
- `keywords` (string[], optional): SEO keywords
- `targetAudience` (string, optional): Target reader
- `tone` (string, optional): Writing tone
- `wordCount` (number, optional): Target length (default: 1500)
- `includeImages` (boolean, optional): Add image placeholders
- `includeToc` (boolean, optional): Generate table of contents
- `includeFaq` (boolean, optional): Add FAQ section
- `author` (object, optional): Author details
- `category` (string, optional): Post category
- `tags` (string[], optional): Post tags

### `generateSocialPost(options: SocialPostOptions): SocialPost`

Generates platform-optimized social media content.

**Parameters:**
- `platform` (string, required): Social platform
- `message` (string, required): Post content
- `topic` (string, optional): Post topic
- `includeHashtags` (boolean, optional): Add hashtags
- `includeEmojis` (boolean, optional): Add emojis
- `includeCallToAction` (boolean, optional): Add CTA
- `targetUrl` (string, optional): Link URL
- `mediaType` (string, optional): Content type

### `createVideoScript(options: VideoScriptOptions): VideoScript`

Creates a professional video script with timing.

**Parameters:**
- `title` (string, required): Video title
- `duration` (number, required): Length in seconds
- `type` (string, required): Video type
- `platform` (string, optional): Target platform
- `tone` (string, optional): Video tone
- `targetAudience` (string, optional): Target viewers
- `callToAction` (string, optional): CTA message
- `includeSubtitles` (boolean, optional): Generate subtitles
- `product` (string, optional): Featured product

### `writeEmailCopy(options: EmailCopyOptions): EmailCopy`

Writes conversion-optimized email content.

**Parameters:**
- `subject` (string, required): Email subject
- `purpose` (string, required): Email type
- `recipientName` (string, optional): Recipient's name
- `tone` (string, optional): Email tone
- `includePreheader` (boolean, optional): Add preheader
- `callToAction` (string, optional): CTA text
- `targetUrl` (string, optional): CTA URL
- `personalization` (object, optional): Custom variables
- `product` (string, optional): Featured product
- `offer` (object, optional): Special offer details

### `generateAdCopy(options: AdCopyOptions): AdCopy`

Generates platform-compliant ad copy.

**Parameters:**
- `platform` (string, required): Ad platform
- `adType` (string, required): Ad format
- `product` (string, required): Product name
- `targetAudience` (string, required): Target audience
- `budget` (number, optional): Campaign budget
- `objective` (string, required): Campaign goal
- `keywords` (string[], optional): Target keywords
- `callToAction` (string, optional): CTA text
- `offer` (string, optional): Special offer
- `tone` (string, optional): Ad tone

### `createLandingPage(options: LandingPageOptions): LandingPage`

Creates a high-converting landing page structure.

**Parameters:**
- `title` (string, required): Page title
- `purpose` (string, required): Page goal
- `product` (string, optional): Featured product
- `offer` (string, optional): Special offer
- `targetAudience` (string, optional): Target visitors
- `includeTestimonials` (boolean, optional): Add testimonials
- `includeFeatures` (boolean, optional): Add features
- `includePricing` (boolean, optional): Add pricing
- `includeFaq` (boolean, optional): Add FAQ
- `callToAction` (string, required): Primary CTA
- `formFields` (array, optional): Lead form fields
- `socialProof` (array, optional): Trust elements

## Examples

### Example 1: Complete Blog Post

```typescript
const blogPost = template.createBlogPost({
  title: '10 Essential Smart Home Security Tips for 2024',
  topic: 'smart home security',
  keywords: ['smart home', 'security tips', 'home automation', 'safety'],
  targetAudience: 'homeowners and renters',
  tone: 'professional',
  wordCount: 2000,
  includeImages: true,
  includeToc: true,
  includeFaq: true,
  author: {
    name: 'Sarah Mitchell',
    bio: 'Security expert with 10+ years experience',
    avatar: 'https://example.com/sarah.jpg'
  },
  category: 'Home Security',
  tags: ['security', 'smart home', 'tips', 'safety'],
  metaDescription: 'Protect your smart home with these 10 essential security tips from industry experts.'
});

// Output includes:
// - SEO-optimized title and meta description
// - 6+ content sections
// - Table of contents with anchor links
// - 5 FAQ items
// - 6+ image placeholders
// - Schema.org BlogPosting markup
// - Reading time: 10 minutes
```

### Example 2: Multi-Platform Social Campaign

```typescript
const platforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
const posts = platforms.map(platform => {
  return template.generateSocialPost({
    platform: platform as any,
    message: 'Introducing SmartGuard Pro: The future of home security is here. 4K video, AI detection, 100ft night vision. Limited launch offer!',
    topic: 'product launch smart home camera',
    includeHashtags: true,
    includeEmojis: platform !== 'linkedin',
    includeCallToAction: true,
    targetUrl: 'https://example.com/smart-guard-pro'
  });
});

// Generates platform-optimized versions:
// - Facebook: 3 hashtags, 1-2 emojis, long-form allowed
// - Instagram: 30 hashtags, multiple emojis, visual focus
// - Twitter: 2 hashtags, concise under 280 chars
// - LinkedIn: Professional tone, minimal hashtags
```

### Example 3: Video Marketing Suite

```typescript
// Product demo for YouTube
const demo = template.createVideoScript({
  title: 'SmartGuard Pro - Complete Setup Guide',
  duration: 180,
  type: 'product-demo',
  platform: 'youtube',
  tone: 'professional',
  product: 'SmartGuard Pro Camera',
  includeSubtitles: true
});

// Short-form for TikTok
const short = template.createVideoScript({
  title: 'SmartGuard Pro in 30 Seconds',
  duration: 30,
  type: 'shorts',
  platform: 'tiktok',
  tone: 'energetic',
  product: 'SmartGuard Pro Camera',
  includeSubtitles: true
});

// Tutorial for Instagram
const tutorial = template.createVideoScript({
  title: 'How to Install SmartGuard Pro',
  duration: 60,
  type: 'tutorial',
  platform: 'instagram',
  tone: 'friendly',
  product: 'SmartGuard Pro Camera',
  includeSubtitles: true
});
```

### Example 4: Email Drip Campaign

```typescript
// Day 1: Welcome
const welcome = template.writeEmailCopy({
  subject: 'Welcome to SmartHome Pro!',
  purpose: 'welcome',
  tone: 'friendly',
  includePreheader: true,
  callToAction: 'Complete Your Profile'
});

// Day 3: Educational
const education = template.writeEmailCopy({
  subject: '5 Ways to Maximize Your Smart Home Security',
  purpose: 'newsletter',
  tone: 'informative',
  includePreheader: true
});

// Day 7: Promotional
const promo = template.writeEmailCopy({
  subject: 'Exclusive Offer: 25% Off SmartGuard Pro',
  purpose: 'promotional',
  tone: 'urgent',
  includePreheader: true,
  product: 'SmartGuard Pro Camera',
  offer: {
    type: 'discount',
    value: '25%',
    expiryDate: new Date('2024-12-31')
  }
});

// Day 10: Cart recovery
const recovery = template.writeEmailCopy({
  subject: 'Complete Your Purchase - Camera Still Waiting!',
  purpose: 'abandoned-cart',
  tone: 'casual',
  includePreheader: true,
  product: 'SmartGuard Pro Camera'
});
```

### Example 5: Complete Landing Page

```typescript
const landingPage = template.createLandingPage({
  title: 'SmartGuard Pro - Professional Home Security Made Simple',
  purpose: 'product-launch',
  product: 'SmartGuard Pro Camera',
  offer: 'Launch Special: Save 25% + Get Free Installation',
  targetAudience: 'homeowners and renters',
  includeTestimonials: true,
  includeFeatures: true,
  includePricing: true,
  includeFaq: true,
  callToAction: 'Get Your Camera Today',
  formFields: [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'phone', required: false }
  ],
  socialProof: [
    {
      type: 'testimonial',
      content: 'Crystal clear 4K video. The AI detection eliminated all false alerts!',
      author: 'Sarah J.',
      rating: 5
    },
    {
      type: 'testimonial',
      content: 'Setup took 5 minutes. Best investment for peace of mind.',
      author: 'Mike C.',
      rating: 5
    },
    {
      type: 'statistic',
      content: '10,000+ Happy Customers'
    },
    {
      type: 'statistic',
      content: '4.9/5 Average Rating'
    }
  ]
});

// Generates complete landing page with:
// - Hero section with headline, subheadline, image, CTA
// - 6 feature highlights with icons
// - 4 benefit sections
// - 4 testimonials and statistics
// - Pricing section with offer
// - 5 FAQ items
// - Lead capture form
// - 6 trust signals
// - Full SEO optimization
```

## Testing

Run the comprehensive test suite:

```bash
npx ts-node src/test-content-template.ts
```

The test demonstrates:
- Blog post with SEO optimization
- Social posts for 5 platforms
- Video scripts for 3 formats
- Email copy for 3 purposes
- Ad copy for 4 platforms
- Landing page with 8 sections

## Support

For questions or issues:
- Check main README: `/src/utils/README.md`
- Review test file: `/src/test-content-template.ts`
- Check templates: `/src/templates/content/`

## License

Part of the Niche Empire Builder toolkit.
