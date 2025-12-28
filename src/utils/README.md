# Utilities

This directory contains utility classes for AI-powered content, image, and video generation.

## Available Utilities

### AIHelper.ts

Helper class for AI API interactions with advanced features:

- **Retry Logic**: Automatic retry with exponential backoff
- **Rate Limiting**: Intelligent rate limit management
- **Prompt Formatting**: Enhanced prompt construction
- **Response Parsing**: JSON, text, and markdown parsing
- **Streaming Support**: Real-time response streaming
- **Error Handling**: Comprehensive error management
- **Usage Tracking**: Cost estimation and logging

**Usage:**
```typescript
import { AIHelper } from './utils/AIHelper';

// Retry with backoff
const result = await AIHelper.retryWithBackoff(async () => {
  return await someAPICall();
}, { maxRetries: 3 });

// Format prompt
const prompt = AIHelper.formatPrompt('Generate a story', {
  context: 'Fantasy genre',
  temperature: 0.8
});

// Parse response
const parsed = AIHelper.parseResponse<MyType>(response, 'json');
```

### ImageGenerator.ts

AI-powered image generation utility supporting multiple providers:

**Features:**
- Generate product images
- Create logos
- Design banners
- Create social media graphics
- Optimize images
- Generate variations

**Supported Providers:**
- OpenAI DALL-E 3
- Stability AI (Stable Diffusion)
- Replicate
- Google Imagen

**Usage:**
```typescript
import { getImageGenerator } from './utils/ImageGenerator';

const imageGen = getImageGenerator();

// Generate product image
const image = await imageGen.generateProductImage(
  'Product Name',
  'Product description',
  { width: 1024, height: 1024, quality: 'hd' }
);

// Create logo
const logo = await imageGen.createLogo({
  brandName: 'MyBrand',
  style: 'modern',
  colors: ['blue', 'white']
});

// Design banner
const banner = await imageGen.designBanner({
  type: 'web',
  width: 1200,
  height: 630,
  headline: 'Sale!'
});
```

### VideoGenerator.ts

AI-powered video generation utility supporting multiple providers:

**Features:**
- Generate product videos
- Create promotional videos
- Generate short-form content (TikTok, Reels, Shorts)
- Add subtitles to videos
- Optimize for specific platforms
- Create video thumbnails

**Supported Providers:**
- Runway Gen-2/Gen-3
- Pika Labs
- Stability AI Video
- Synthesia (avatar videos)
- Replicate

**Usage:**
```typescript
import { getVideoGenerator } from './utils/VideoGenerator';

const videoGen = getVideoGenerator();

// Generate product video
const video = await videoGen.generateProductVideo({
  productName: 'Product Name',
  description: 'Product description',
  duration: 15,
  style: 'cinematic'
});

// Create promo video
const promo = await videoGen.createPromoVideo({
  headline: 'Big Sale',
  message: 'Limited time offer',
  duration: 20,
  style: 'bold'
});

// Generate short-form video
const short = await videoGen.generateShorts({
  platform: 'tiktok',
  topic: 'Product features',
  hook: 'Amazing new product!',
  duration: 30,
  includeSubtitles: true
});

// Add subtitles
const subtitled = await videoGen.addSubtitles(video, {
  position: 'center',
  highlightStyle: 'word'
});

// Optimize for platform
const optimized = await videoGen.optimizeForPlatform(video, {
  platform: 'youtube',
  format: 'feed',
  quality: 'high'
});
```

### SEOOptimizer.ts

Comprehensive SEO optimization utility:

**Features:**
- Keyword analysis and research
- Meta tag generation (OG, Twitter)
- Title optimization with scoring
- XML sitemap creation
- Schema.org structured data
- Competitor analysis
- Content SEO scoring

**Usage:**
```typescript
import { getSEOOptimizer } from './utils/SEOOptimizer';

const seo = getSEOOptimizer();

// Analyze keywords
const keywords = await seo.analyzeKeywords(content, 'smart home security');
console.log('Density:', keywords.metrics.density + '%');

// Generate meta tags
const meta = await seo.generateMetaTags({
  title: 'Complete Guide',
  description: 'Learn everything about...',
  url: 'https://example.com/guide'
});

// Optimize title
const title = await seo.optimizeTitles({
  content,
  primaryKeyword: 'smart home',
  format: 'how-to',
  maxLength: 60
});

// Create sitemap
const sitemap = seo.createSitemap([
  {
    url: 'https://example.com/',
    changeFrequency: 'daily',
    priority: 1.0
  }
], 'sitemap.xml');

// Generate schema
const schema = seo.generateSchema('Product', {
  name: 'Product Name',
  description: 'Description',
  offers: { price: '99.99', priceCurrency: 'USD' }
});

// Score content
const score = await seo.scoreContent({
  content,
  targetKeyword: 'keyword',
  metaTitle: 'Page Title',
  metaDescription: 'Page description'
});

console.log('SEO Score:', score.overallScore + '/100');
```

## Setup

1. **Install Dependencies**
```bash
npm install dotenv
```

2. **Configure Environment Variables**
Create a `.env` file with your API keys:
```env
# For AIHelper (via GeminiService)
GOOGLE_GEMINI_API_KEY=your-key

# For ImageGenerator (at least one)
OPENAI_API_KEY=your-key
STABILITY_API_KEY=your-key
REPLICATE_API_KEY=your-key

# For VideoGenerator (at least one)
RUNWAY_API_KEY=your-key
PIKA_API_KEY=your-key
SYNTHESIA_API_KEY=your-key
```

3. **Import and Use**
```typescript
import { AIHelper } from './utils/AIHelper';
import { getImageGenerator } from './utils/ImageGenerator';
import { getVideoGenerator } from './utils/VideoGenerator';
import { getSEOOptimizer } from './utils/SEOOptimizer';
```

## Documentation

- **AIHelper**: See source code documentation
- **ImageGenerator**: See `/docs/ImageGenerator-Guide.md`
- **VideoGenerator**: See `/docs/VideoGenerator-Guide.md`
- **SEOOptimizer**: See `/docs/SEOOptimizer-Guide.md`

## Examples

Complete examples available in `/src/examples/`:
- `complete-product-creation.ts` - Full product creation pipeline with images
- `complete-media-package.ts` - Complete media package with images and videos

## Testing

```bash
# Test ImageGenerator
npx ts-node src/test-image-generator.ts

# Test VideoGenerator
npx ts-node src/test-video-generator.ts

# Test SEOOptimizer
npx ts-node src/test-seo-optimizer.ts

# Test GeminiService with AIHelper
npx ts-node src/test-gemini.ts

# Run complete examples
npx ts-node src/examples/complete-product-creation.ts
npx ts-node src/examples/complete-media-package.ts
```

## Error Handling

All utilities include comprehensive error handling:

```typescript
try {
  const image = await imageGen.generateProductImage(...);
} catch (error) {
  console.error('Generation failed:', error.message);
  // Implement fallback logic
}
```

## Best Practices

1. **API Keys**: Store in `.env`, never commit
2. **Error Handling**: Always wrap calls in try-catch
3. **Rate Limits**: Utilities handle automatically
4. **Cost Management**: Monitor usage with built-in logging
5. **Quality**: Use 'hd' quality for production
6. **Prompts**: Be specific for better results

## Cost Estimates

### AIHelper (Gemini)
- Gemini 1.5 Flash: ~$0.075 per 1M tokens
- Gemini 1.5 Pro: ~$1.25 per 1M tokens

### ImageGenerator
- DALL-E 3: $0.04 - $0.08 per image
- Stability AI: ~$0.002 - $0.01 per image
- Replicate: ~$0.01 per image (varies by model)

### VideoGenerator
- Runway Gen-3: ~$0.10 per second
- Runway Gen-2: ~$0.05 per second
- Pika Labs: ~$0.05 per second
- Stability AI Video: ~$0.05 per generation
- Synthesia: ~$0.30 per video

### SEOOptimizer
- Free (uses existing content analysis)
- Integrates with Gemini for AI-powered suggestions
- No additional API costs

## Website Templates

### DefaultTemplate

Located in `/src/templates/website/DefaultTemplate.ts`:

Complete website template generator for e-commerce sites:

**Features:**
- Homepage with hero, features, products
- Product pages with galleries
- About page with team section
- Contact page with forms
- Blog layout and posts
- SEO-optimized structure
- Responsive design
- Modern CSS & JavaScript

**Usage:**
```typescript
import { getDefaultTemplate } from './templates/website/DefaultTemplate';

const template = getDefaultTemplate({
  siteName: 'My Store',
  tagline: 'Quality products',
  primaryColor: '#2563eb'
});

// Generate pages
const homepage = template.generateHomepage({...});
const productPage = template.createProductPages(product);
const aboutPage = template.buildAboutPage({...});
const contactPage = template.createContactPage({...});
const blogPage = template.generateBlogLayout(posts);
```

**Test:**
```bash
npx ts-node src/test-default-template.ts
```

## Product Templates

### ProductTemplate

Located in `/src/templates/products/ProductTemplate.ts`:

Complete product data structure system for e-commerce:

**Features:**
- Physical products with inventory & shipping
- Digital products with downloads & licensing
- Service products with booking & scheduling
- Product variations (colors, sizes, etc.)
- Volume pricing tiers & bulk discounts
- Product bundles with savings
- Customer reviews & ratings
- Schema.org structured data
- JSON/CSV export

**Product Types:**

1. **Physical Products**: SKU, inventory tracking, shipping details, dimensions
2. **Digital Products**: Download links, file sizes, license management, version control
3. **Service Products**: Duration, availability schedules, booking windows, locations

**Usage:**
```typescript
import { getProductTemplate } from './templates/products/ProductTemplate';

const template = getProductTemplate();

// Create physical product
const camera = template.createPhysicalProduct({
  name: 'Smart Camera Pro',
  description: '4K security camera with AI detection',
  price: 199.99,
  sku: 'CAM-001',
  weight: 0.5,
  dimensions: { length: 12, width: 8, height: 8 },
  inventory: 150,
  category: 'Security'
});

// Generate variations
const withVariations = template.generateVariations(camera, {
  attributes: [
    {
      name: 'color',
      values: [
        { value: 'White', skuSuffix: 'WHT' },
        { value: 'Black', skuSuffix: 'BLK' }
      ]
    }
  ]
});

// Set pricing tiers (bulk discounts)
const withTiers = template.setPricingTiers(camera, [
  { minQuantity: 10, maxQuantity: 49, discountType: 'percentage', discountValue: 10 },
  { minQuantity: 50, discountType: 'percentage', discountValue: 20 }
]);

// Create digital product
const software = template.createDigitalProduct({
  name: 'Smart Home Software Pro',
  price: 149.99,
  fileUrl: 'https://example.com/download',
  fileSize: 524288000, // 500 MB
  licenseType: 'multi',
  version: '2.1.0'
});

// Create service product
const installation = template.createServiceProduct({
  name: 'Installation Service',
  price: 299.99,
  duration: 180, // 3 hours
  location: 'client-location',
  availability: {
    monday: [{ start: '09:00', end: '17:00' }],
    tuesday: [{ start: '09:00', end: '17:00' }]
  }
});

// Create bundle
const bundle = template.createBundles({
  name: 'Complete Security Package',
  products: [
    { product: camera, quantity: 2 },
    { product: software, quantity: 1 }
  ],
  discountPercentage: 20
});
```

**Advanced Features:**

```typescript
// Add reviews
const reviews = template.addReviews(camera.id, [
  {
    author: 'John Smith',
    rating: 5,
    title: 'Excellent camera!',
    comment: 'Crystal clear video quality',
    verified: true,
    date: new Date()
  }
]);

// Generate SEO schema
const schema = template.generateProductSchema(camera, reviews.statistics);

// Export to JSON
const json = template.exportToJSON(camera);

// Export to CSV
const csv = template.exportToCSV([camera, software, installation]);
```

**Test:**
```bash
npx ts-node src/test-product-template.ts
```

## Content Templates

### ContentTemplate

Located in `/src/templates/content/ContentTemplate.ts`:

Comprehensive marketing content generator for multiple channels:

**Features:**
- Blog posts with SEO optimization
- Social media posts for 6 platforms
- Video scripts with timing & subtitles
- Email copy with A/B variants
- Ad copy for multiple platforms
- Landing pages with conversion optimization

**Content Types:**

1. **Blog Posts**: SEO-optimized with ToC, FAQ, Schema.org markup
2. **Social Media**: Platform-specific optimization (Facebook, Instagram, Twitter, LinkedIn, TikTok, Pinterest)
3. **Video Scripts**: Product demos, tutorials, shorts with scene breakdowns
4. **Email Copy**: Welcome, promotional, newsletter, abandoned cart, follow-up
5. **Ad Copy**: Google, Facebook, Instagram, LinkedIn with quality scoring
6. **Landing Pages**: Product launch, lead gen, sales with form integration

**Usage:**
```typescript
import { getContentTemplate } from './templates/content/ContentTemplate';

const template = getContentTemplate();

// Create blog post
const blog = template.createBlogPost({
  title: 'Ultimate Guide to Smart Home Security',
  topic: 'smart home security',
  wordCount: 2000,
  includeToc: true,
  includeFaq: true,
  tone: 'professional'
});

// Generate social posts
const socialPost = template.generateSocialPost({
  platform: 'instagram',
  message: 'New product launch! 🔥',
  includeHashtags: true,
  includeEmojis: true,
  targetUrl: 'https://example.com/product'
});

// Create video script
const video = template.createVideoScript({
  title: 'Product Demo',
  duration: 60,
  type: 'product-demo',
  platform: 'youtube',
  includeSubtitles: true
});

// Write email copy
const email = template.writeEmailCopy({
  subject: 'Welcome to Our Platform!',
  purpose: 'welcome',
  tone: 'friendly',
  includePreheader: true
});

// Generate ad copy
const ad = template.generateAdCopy({
  platform: 'google',
  adType: 'search',
  product: 'SmartGuard Pro',
  targetAudience: 'homeowners',
  objective: 'conversion',
  keywords: ['smart camera', 'home security']
});

// Create landing page
const landing = template.createLandingPage({
  title: 'Get SmartGuard Pro Today',
  purpose: 'product-launch',
  product: 'SmartGuard Pro',
  offer: '25% off + Free Shipping',
  includeTestimonials: true,
  includeFeatures: true,
  includeFaq: true,
  callToAction: 'Buy Now'
});
```

**Platform Specifications:**

Social Media:
- Twitter: 280 chars, 2 hashtags
- Instagram: 2200 chars, 30 hashtags
- Facebook: 63K chars, 3 hashtags
- LinkedIn: 3000 chars, 3 hashtags
- TikTok: 2200 chars, 5 hashtags

Ad Platforms:
- Google Search: 30 char headline, 90 char body
- Facebook: 40 char headline, 125 char body
- Instagram: 40 char headline, 125 char body
- LinkedIn: 70 char headline, 150 char body

**Optimization Features:**

```typescript
// Blog SEO
console.log(blog.seo.readingTime); // 10 minutes
console.log(blog.seo.keywords); // ['smart home', 'security', ...]

// Social engagement
console.log(socialPost.optimization.engagementPotential); // 'high'
console.log(socialPost.scheduling.bestTimeToPost); // '11:00 AM - 1:00 PM'

// Email effectiveness
console.log(email.optimization.subjectLineScore); // 85/100
console.log(email.optimization.spamScore); // 2/10

// Ad quality
console.log(ad.optimization.qualityScore); // 90/100
console.log(ad.optimization.relevanceScore); // 95%

// Landing conversion
console.log(landing.performance.conversionOptimized); // true
console.log(landing.conversion.trustSignals); // ['30-day guarantee', ...]
```

**A/B Testing:**

All content types generate variants for testing:
```typescript
// 3 email subject line variants
email.variants.forEach(v => {
  console.log(`${v.version}: ${v.subject}`);
});

// 3 social post variants
socialPost.variants.forEach(v => {
  console.log(`${v.version}: ${v.purpose}`);
});

// 3 ad copy variants
ad.variants.forEach(v => {
  console.log(`${v.version}: ${v.headline}`);
});
```

**Test:**
```bash
npx ts-node src/test-content-template.ts
```

## Email Templates

### EmailTemplate

Located in `/src/templates/emails/EmailTemplate.ts`:

Production-ready responsive HTML email templates for automation:

**Features:**
- Mobile-responsive HTML templates
- Inline CSS for email client compatibility
- Personalization support
- Plain text fallbacks
- Tested across major email clients

**Email Types:**

1. **Welcome Emails**: Onboard new users with steps and benefits
2. **Newsletters**: Curated content with featured articles
3. **Abandoned Cart**: Recovery emails with discounts
4. **Promotional**: Sales campaigns with product grids
5. **Transactional**: Orders, shipping, password resets
6. **Email Sequences**: Multi-day drip campaigns

**Usage:**
```typescript
import { getEmailTemplate, EmailConfig } from './templates/emails/EmailTemplate';

// Configure branding
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

// Welcome email
const welcome = template.createWelcomeEmail({
  subject: 'Welcome [firstName]!',
  headline: 'Welcome Aboard!',
  message: 'We\'re excited to have you.',
  ctaText: 'Get Started',
  ctaUrl: 'https://example.com/start',
  steps: [
    {
      stepNumber: 1,
      title: 'Set Up Account',
      description: 'Complete your profile'
    }
  ],
  personalization: { firstName: 'John' }
});

// Newsletter
const newsletter = template.generateNewsletters({
  subject: 'Weekly Digest',
  articles: [
    {
      title: 'Article Title',
      excerpt: 'Description...',
      linkUrl: 'https://example.com/article',
      readTime: 5
    }
  ]
});

// Abandoned cart
const cart = template.createAbandonedCart({
  subject: 'Complete your purchase',
  cartItems: [
    {
      name: 'Product Name',
      imageUrl: 'https://example.com/product.jpg',
      price: 99.99,
      quantity: 1,
      productUrl: 'https://example.com/product'
    }
  ],
  cartTotal: 99.99,
  ctaUrl: 'https://example.com/checkout'
});

// Promotional
const promo = template.buildPromotionalEmail({
  subject: 'Flash Sale: 25% Off!',
  headline: 'Limited Time Offer',
  offerText: 'Save 25% Today',
  ctaText: 'Shop Now',
  ctaUrl: 'https://example.com/sale',
  discountCode: 'FLASH25'
});

// Transactional
const order = template.createTransactional({
  type: 'order-confirmation',
  subject: 'Order #12345 Confirmed',
  customerName: 'John',
  orderNumber: '12345',
  orderItems: [...],
  total: 199.99
});

// Email sequence
const sequence = template.generateSequences({
  sequenceName: 'Onboarding',
  sequenceType: 'onboarding',
  emails: [
    {
      dayOffset: 0,
      subject: 'Welcome!',
      headline: 'Get Started',
      content: 'Welcome message...',
      ctaText: 'Start Now',
      ctaUrl: 'https://example.com/start'
    },
    {
      dayOffset: 3,
      subject: 'Tips & Tricks',
      headline: 'Pro Tips',
      content: 'Here are some tips...',
      ctaText: 'Learn More',
      ctaUrl: 'https://example.com/tips'
    }
  ]
});
```

**Email Client Compatibility:**

Desktop:
- ✅ Gmail, Outlook 2010+, Apple Mail, Yahoo
- ✅ Inline CSS for maximum compatibility

Mobile:
- ✅ Gmail (iOS & Android)
- ✅ Apple Mail (iOS)
- ✅ Outlook Mobile
- ✅ Responsive design adapts to all screens

**Output:**

All methods return:
```typescript
{
  subject: string;      // Email subject line
  preheader: string;    // Preview text
  html: string;         // Full HTML email
  text: string;         // Plain text fallback
  metadata: {           // Email metadata
    type: string;
    estimatedSize: number;
    // ... type-specific data
  }
}
```

**Personalization:**

Use square brackets in subject/content:
```typescript
{
  subject: 'Welcome [firstName]!',
  personalization: {
    firstName: 'John',
    email: 'john@example.com',
    company: 'Acme Inc'
  }
}
// Result: "Welcome John!"
```

**Integration Examples:**

SendGrid:
```typescript
import sgMail from '@sendgrid/mail';

const email = template.createWelcomeEmail({...});

await sgMail.send({
  to: 'user@example.com',
  from: 'noreply@company.com',
  subject: email.subject,
  text: email.text,
  html: email.html
});
```

Mailchimp:
```typescript
import mailchimp from '@mailchimp/mailchimp_transactional';

const email = template.createWelcomeEmail({...});

await mailchimp.messages.send({
  message: {
    subject: email.subject,
    from_email: 'noreply@company.com',
    to: [{ email: 'user@example.com' }],
    html: email.html,
    text: email.text
  }
});
```

**Test:**
```bash
npx ts-node src/test-email-template.ts
```

Generates 11 HTML files in `./generated-emails/` for preview.

## Dashboard

### EmpireCreator React Component

Located in `/src/dashboard/components/EmpireCreator.tsx`:

Beautiful React dashboard for creating complete niche empires:

**Features:**
- 4-step wizard interface
- Quick start templates
- Full customization options
- Real-time progress tracking
- Beautiful Tailwind CSS design
- Fully responsive

**Quick Start Templates:**

1. **E-commerce Store** 🛍️: Complete online store with 10 products
2. **SaaS Business** 💻: Software product with landing pages
3. **Content Business** 📝: Content-focused with blog and social
4. **Service Business** 🔧: Service booking and client communication

**Usage:**

**Option 1: Standalone (No Build)**
```bash
# Open the dashboard
cd src/dashboard
open index-standalone.html  # macOS
start index-standalone.html # Windows
```

**Option 2: Vite Development Server**
```bash
cd src/dashboard
npm install
npm run dev
# Opens at http://localhost:3000
```

**Option 3: React Integration**
```typescript
import { EmpireCreator } from './dashboard/components/EmpireCreator';

function App() {
  return <EmpireCreator />;
}
```

**Build for Production:**
```bash
cd src/dashboard
npm run build  # Output in dist/
npm run preview # Preview production build
```

**Configuration:**

```typescript
const config = {
  niche: 'Smart Home Products',
  businessName: 'SmartHome Pro',
  targetAudience: 'Tech-savvy homeowners',
  products: {
    enabled: true,
    types: ['physical', 'digital'],
    count: 10
  },
  content: {
    enabled: true,
    types: ['blog', 'social', 'email', 'landing']
  },
  website: {
    enabled: true,
    template: 'default'
  },
  email: {
    enabled: true,
    sequences: ['welcome', 'abandoned-cart']
  },
  branding: {
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#f59e0b'
  }
};
```

**4-Step Wizard:**

1. **Select**: Choose quick start template or custom start
2. **Configure**: Customize all aspects of your empire
3. **Generate**: Watch real-time progress as empire is created
4. **Complete**: Download all generated files

**Integrated Generators:**

- ✅ ProductTemplate: Generate products with variations
- ✅ ContentTemplate: Create marketing content
- ✅ DefaultTemplate: Build complete website
- ✅ EmailTemplate: Generate email campaigns
- ✅ All utilities: SEO, images, videos

**UI Features:**

- Template cards with icons and descriptions
- Color pickers for brand customization
- Slider for product quantity
- Checkboxes for feature selection
- Progress bars with status indicators
- Success screens with file summaries
- Responsive grid layouts
- Smooth animations and transitions

---

### EmpireManager React Component

Located in `/src/dashboard/components/EmpireManager.tsx`:

Comprehensive dashboard for managing all created niche empires:

**Features:**
- Empire list with status indicators (active, paused, draft, archived)
- Advanced filtering by status, health, and search terms
- Sort by name, revenue, customers, or date
- Grid and list view modes
- Performance metrics for each empire
- Bulk actions (pause, resume, archive, delete, sync)
- Individual empire controls
- Sync all button
- Delete confirmation modals
- Beautiful Tailwind CSS design

**Key Statistics:**
- Total empires count
- Total revenue across all empires
- Total customers
- Average performance score

**Empire Data:**
Each empire displays:
- Name and niche
- Status (active/paused/draft/archived)
- Revenue, customers, products, orders
- Traffic and conversion rate
- Health score (excellent/good/fair/poor)
- Performance trend (up/down/stable)
- Last sync timestamp

**Usage:**

**Standalone (No Build):**
```bash
cd src/dashboard
open test-empire-manager.html  # macOS
start test-empire-manager.html # Windows
```

**React Integration:**
```typescript
import { EmpireManager } from './dashboard/components/EmpireManager';

function App() {
  const [empires, setEmpires] = useState([...]);

  return (
    <EmpireManager
      empires={empires}
      onEmpireClick={(empire) => console.log('View', empire)}
      onEmpireEdit={(empire) => console.log('Edit', empire)}
      onEmpireDelete={(id) => setEmpires(prev => prev.filter(e => e.id !== id))}
      onEmpirePause={(id) => updateStatus(id, 'paused')}
      onEmpireResume={(id) => updateStatus(id, 'active')}
      onEmpireSync={(id) => syncEmpire(id)}
      onBulkAction={(action) => handleBulk(action)}
      onCreateNew={() => navigate('/create')}
    />
  );
}
```

**Filter Options:**
```typescript
{
  status: 'all' | 'active' | 'paused' | 'draft' | 'archived',
  health: 'all' | 'excellent' | 'good' | 'fair' | 'poor',
  search: string,
  sortBy: 'name' | 'revenue' | 'customers' | 'created' | 'updated',
  sortOrder: 'asc' | 'desc'
}
```

**Bulk Actions:**
```typescript
{
  type: 'pause' | 'resume' | 'archive' | 'delete' | 'sync',
  empireIds: string[]
}
```

**View Modes:**
- **Grid View**: 3-column responsive cards with large metrics
- **List View**: Compact table with sortable columns

**Mock Data:**
Includes 5 sample empires for testing:
1. SmartHome Pro (excellent, active)
2. TaskFlow Pro (good, active)
3. FitLife Plus (fair, paused)
4. Home Services Hub (good, active)
5. EcoBeauty (poor, draft)

---

### MetricsDisplay React Component

Located in `/src/dashboard/components/MetricsDisplay.tsx`:

Beautiful analytics dashboard for displaying empire performance metrics with interactive charts:

**Features:**
- Multiple chart types (line, bar, pie)
- Time range selection (7d, 30d, 90d, 1y, all time)
- Summary cards (revenue, traffic, conversion, engagement)
- Trend indicators with percentage changes
- Traffic sources visualization (pie chart)
- Revenue by channel (bar chart)
- Channel performance table
- Top performing products (ranked list)
- Export functionality (CSV, JSON)
- Custom SVG charts (no external dependencies)
- Fully responsive design

**Chart Types:**
- **Line Chart**: Time series trends with area fill, grid lines, data points
- **Bar Chart**: Horizontal bars for channel comparisons
- **Pie Chart**: Circular breakdown for traffic sources

**Summary Cards Display:**
- Revenue: Current value, change %, trend arrow, average per day
- Traffic: Visitor count, change %, trend arrow, daily average
- Conversion: Rate percentage, change %, trend arrow, average rate
- Engagement: Score (0-100), change %, trend arrow, average score

**Usage:**

**Standalone (No Build):**
```bash
cd src/dashboard
open test-metrics-display.html  # macOS
start test-metrics-display.html # Windows
```

**React Integration:**
```typescript
import { MetricsDisplay } from './dashboard/components/MetricsDisplay';

const metrics = {
  id: 'emp-001',
  name: 'SmartHome Pro',
  timeSeries: [
    {
      date: '2024-02-01',
      revenue: 850,
      orders: 19,
      traffic: 2100,
      customers: 6,
      conversion: 3.2,
      engagement: 68
    },
    // ... more daily data
  ],
  summary: {
    revenue: { current: 45780, previous: 38650, change: 18.4, trend: 'up' },
    traffic: { current: 15420, previous: 13200, change: 16.8, trend: 'up' },
    conversion: { current: 3.2, previous: 2.9, change: 10.3, trend: 'up' },
    engagement: { current: 68, previous: 62, change: 9.7, trend: 'up' }
  },
  channels: [
    { channel: 'Organic Search', traffic: 6200, revenue: 18500, conversion: 3.5, color: '#10b981' },
    { channel: 'Paid Ads', traffic: 4100, revenue: 14200, conversion: 4.2, color: '#3b82f6' },
    // ... more channels
  ],
  topProducts: [
    { name: 'Smart Thermostat Pro', revenue: 12400, units: 124, growth: 24.5 },
    { name: 'Security Camera Kit', revenue: 9800, units: 98, growth: 18.2 },
    // ... more products
  ]
};

<MetricsDisplay
  empireMetrics={metrics}
  onExport={(format) => console.log('Export as', format)}
/>
```

**Data Structures:**
```typescript
interface TimeSeriesData {
  date: string;           // ISO date: "2024-02-20"
  revenue: number;        // Daily revenue
  orders: number;         // Number of orders
  traffic: number;        // Visitor count
  customers: number;      // New customers
  conversion: number;     // Conversion rate (%)
  engagement: number;     // Engagement score (0-100)
}

interface EmpireMetrics {
  id: string;
  name: string;
  timeSeries: TimeSeriesData[];
  summary: MetricsSummary;
  channels: ChannelMetrics[];
  topProducts: ProductPerformance[];
}
```

**Time Ranges:**
- Last 7 Days: Weekly view
- Last 30 Days: Monthly view (default)
- Last 90 Days: Quarterly view
- Last Year: Annual view
- All Time: Complete history

**Export Formats:**
- **CSV**: Time series data with all metrics
- **JSON**: Complete metrics object with metadata

**Mock Data Generator:**
Includes function to generate realistic time series data:
- Seasonal patterns (sine wave)
- Growth trends (linear)
- Random variations
- 7-365 days of data

**Dependencies:**

Required:
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

Development:
```json
{
  "tailwindcss": "^3.0.0",
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0"
}
```

**Documentation:**

See `/src/dashboard/README.md` for:
- Detailed setup instructions
- Configuration options
- Integration examples
- Customization guide
- Troubleshooting

## Support

For issues or questions:
- Check documentation in `/docs/`
- Review examples in `/src/examples/`
- Check test files for usage patterns
- Review templates in `/src/templates/`
