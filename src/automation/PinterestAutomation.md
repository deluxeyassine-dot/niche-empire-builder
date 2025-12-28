# Pinterest Automation API Documentation

**E-Commerce Optimized** - Drive massive traffic and sales with Pinterest automation.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Authentication](#authentication)
4. [Quick Start](#quick-start)
5. [API Reference](#api-reference)
6. [E-Commerce Guide](#e-commerce-guide)
7. [SEO Optimization](#seo-optimization)
8. [Viral Content Strategy](#viral-content-strategy)
9. [Best Practices](#best-practices)

---

## Overview

The `PinterestAutomation` class provides a production-ready system for Pinterest marketing, optimized for **e-commerce, traffic generation, and sales conversion**. Pinterest drives 33% more referral traffic to shopping sites than Facebook!

### Why Pinterest for E-Commerce?

- **83% of weekly Pinners** have made a purchase based on Pins
- **97% of searches** are unbranded (discovery intent)
- **Average order value** 50% higher than other platforms
- **Long-term traffic** - Pins get 80% of engagement after publishing
- **Visual discovery** - Perfect for product showcasing

### Features

- ✅ **Product Pins** - Rich pins with pricing, availability
- ✅ **Shopping Catalog** - Bulk upload from product catalog
- ✅ **Traffic Analytics** - Track clicks to your website
- ✅ **Viral Pin Tracking** - Identify top performers
- ✅ **SEO Optimization** - Keyword-rich titles and descriptions
- ✅ **Board Management** - Organize products effectively
- ✅ **Pin Scheduling** - Optimal timing for engagement
- ✅ **Conversion Optimization** - CTAs, urgency, benefits

### Requirements

- Pinterest Business account
- Claimed website
- Pinterest App (for API access)
- Node.js 16+

---

## Installation

```bash
# Install dependencies
npm install axios form-data dotenv

# Optional: Image optimization
npm install sharp

# Install TypeScript types
npm install --save-dev @types/node @types/form-data
```

---

## Authentication

### Setup Pinterest App

1. Go to [Pinterest Developers](https://developers.pinterest.com/)
2. Create new app
3. Add Content API product
4. Get App ID and App Secret
5. Configure OAuth redirect

**See full setup guide**: [PINTEREST_SETUP.md](./PINTEREST_SETUP.md)

### Initialize Client

```typescript
import { PinterestAutomation } from './automation/PinterestAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

const pinterest = new PinterestAutomation({
  accessToken: process.env.PINTEREST_ACCESS_TOKEN!,
  refreshToken: process.env.PINTEREST_REFRESH_TOKEN,
  clientId: process.env.PINTEREST_CLIENT_ID,
  clientSecret: process.env.PINTEREST_CLIENT_SECRET,
  redirectUri: 'https://yourdomain.com/callback'
});
```

---

## Quick Start

### Create a Product Pin

```typescript
// Create a product pin with shopping optimization
const pinId = await pinterest.optimizeForShopping({
  boardId: 'your-board-id',
  imageUrl: 'https://yourstore.com/product-image.jpg',
  title: 'Organic Cotton T-Shirt',
  description: 'Premium quality organic cotton t-shirt in 10 colors',
  link: 'https://yourstore.com/products/organic-tshirt',
  price: 29.99,
  currency: 'USD',
  availability: 'IN_STOCK',
  brand: 'YourBrand',
  salePrice: 19.99  // On sale!
}, {
  usePriceInTitle: true,
  addUrgency: true,
  highlightBenefit: true,
  targetKeywords: ['organic clothing', 'sustainable fashion']
});

console.log('Product pin created:', pinId);
```

### Track Traffic to Your Website

```typescript
// See how much traffic Pinterest drives to your site
const traffic = await pinterest.driveTrafficToWebsite('yourstore.com');

console.log('Pinterest Traffic:');
console.log(`  Total Impressions: ${traffic.totalImpressions.toLocaleString()}`);
console.log(`  Total Clicks: ${traffic.totalClicks.toLocaleString()}`);
console.log(`  CTR: ${(traffic.clickThroughRate * 100).toFixed(2)}%`);
console.log(`\nTop Performing Pins:`);
traffic.topReferringPins.forEach((pin, i) => {
  console.log(`  ${i + 1}. Pin ${pin.pinId}: ${pin.clicks} clicks`);
});
```

### Find Your Viral Pins

```typescript
// Identify which pins are going viral
const viralPins = await pinterest.trackViralPins({
  minImpressions: 10000,
  minSaves: 500,
  minEngagementRate: 0.05,
  timeframe: 'month'
});

console.log(`Found ${viralPins.length} viral pins!`);
viralPins.forEach((pin, i) => {
  console.log(`\n${i + 1}. Pin ${pin.pinId}:`);
  console.log(`   Impressions: ${pin.impressions.toLocaleString()}`);
  console.log(`   Saves: ${pin.saves.toLocaleString()}`);
  console.log(`   Clicks: ${pin.outboundClicks.toLocaleString()}`);
});
```

---

## API Reference

### Constructor

```typescript
new PinterestAutomation(config: PinterestConfig)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config.accessToken` | `string` | No | User access token |
| `config.refreshToken` | `string` | No | Refresh token |
| `config.clientId` | `string` | No | App Client ID |
| `config.clientSecret` | `string` | No | App Client Secret |
| `config.redirectUri` | `string` | No | OAuth redirect URI |

### Pin Creation

#### `createPin(options: PinOptions, seoOptions?: SEOOptions): Promise<string>`

Create a pin with SEO optimization.

**Parameters:**

```typescript
interface PinOptions {
  boardId: string;         // Target board
  imageUrl?: string;       // Remote image URL
  imagePath?: string;      // Local image path
  title: string;           // Pin title (max 100 chars)
  description?: string;    // Pin description (max 500 chars)
  link?: string;           // Your website URL
  altText?: string;        // Alt text for accessibility
  dominantColor?: string;  // Hex color
}

interface SEOOptions {
  keywords: string[];              // Target keywords
  hashtags?: string[];             // Hashtags (max 20)
  titleFormula?: 'keyword-first' | 'benefit-first' | 'question';
  optimizeImageAltText?: boolean;
}
```

**Example:**

```typescript
const pinId = await pinterest.createPin({
  boardId: 'board-123',
  imageUrl: 'https://example.com/product.jpg',
  title: 'Handmade Ceramic Mug',
  description: 'Beautiful handmade ceramic mug for coffee lovers',
  link: 'https://myshop.com/ceramic-mug'
}, {
  keywords: ['ceramic mug', 'handmade pottery', 'coffee mug'],
  hashtags: ['handmade', 'ceramics', 'coffeelover'],
  titleFormula: 'keyword-first'
});
```

#### `createRichPin(options: RichPinOptions): Promise<string>`

Create a rich product pin with metadata.

**Parameters:**

```typescript
interface RichPinOptions extends PinOptions {
  productId?: string;
  price?: number;
  currency?: string;
  availability?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';
  brand?: string;
  category?: string;
  condition?: 'NEW' | 'USED' | 'REFURBISHED';
  salePrice?: number;
}
```

**Example:**

```typescript
const richPinId = await pinterest.createRichPin({
  boardId: 'products-board',
  imageUrl: 'https://shop.com/sneakers.jpg',
  title: 'Running Sneakers',
  description: 'Professional running sneakers for athletes',
  link: 'https://shop.com/sneakers',
  price: 129.99,
  currency: 'USD',
  availability: 'IN_STOCK',
  brand: 'Nike',
  category: 'Footwear',
  condition: 'NEW',
  salePrice: 99.99
});
```

### Shopping Optimization

#### `optimizeForShopping(options: RichPinOptions, optimizations): Promise<string>`

Create a conversion-optimized product pin.

**Optimizations:**

```typescript
{
  usePriceInTitle?: boolean;      // Add price to title
  addUrgency?: boolean;           // Add urgency words
  highlightBenefit?: boolean;     // Highlight benefits
  targetKeywords?: string[];      // SEO keywords
}
```

**Example:**

```typescript
const pinId = await pinterest.optimizeForShopping({
  boardId: 'sale-items',
  imageUrl: 'https://shop.com/dress.jpg',
  title: 'Summer Dress',
  description: 'Lightweight summer dress perfect for beach vacations',
  link: 'https://shop.com/summer-dress',
  price: 79.99,
  currency: 'USD',
  availability: 'IN_STOCK',
  salePrice: 49.99
}, {
  usePriceInTitle: true,
  addUrgency: true,
  highlightBenefit: true,
  targetKeywords: ['summer dress', 'beach dress', 'vacation outfit']
});

// Result: "Hot Deal - Summer Dress - $49.99"
```

#### `createCatalogPins(boardId, catalog, seoOptions): Promise<string[]>`

Bulk upload product catalog.

**Example:**

```typescript
const catalog = [
  {
    productId: 'PROD-001',
    title: 'Yoga Mat',
    description: 'Non-slip yoga mat for all skill levels',
    price: 39.99,
    currency: 'USD',
    availability: 'IN_STOCK',
    imageUrl: 'https://shop.com/yoga-mat.jpg',
    productUrl: 'https://shop.com/products/yoga-mat',
    brand: 'FitLife',
    category: 'Fitness'
  },
  {
    productId: 'PROD-002',
    title: 'Resistance Bands',
    description: 'Set of 5 resistance bands',
    price: 24.99,
    currency: 'USD',
    availability: 'IN_STOCK',
    imageUrl: 'https://shop.com/bands.jpg',
    productUrl: 'https://shop.com/products/bands'
  }
];

const pinIds = await pinterest.createCatalogPins(
  'fitness-board-id',
  catalog,
  {
    keywords: ['fitness equipment', 'home workout'],
    hashtags: ['fitness', 'workout', 'health']
  }
);

console.log(`Created ${pinIds.length} product pins`);
```

### Board Management

#### `createBoard(options: BoardOptions): Promise<string>`

Create a new board.

**Example:**

```typescript
const boardId = await pinterest.createBoard({
  name: 'Summer Collection 2024',
  description: 'Our latest summer fashion collection',
  privacy: 'PUBLIC',
  category: 'Fashion'
});
```

#### `getBoards(): Promise<BoardInfo[]>`

Get all your boards.

**Example:**

```typescript
const boards = await pinterest.getBoards();

boards.forEach(board => {
  console.log(`${board.name}: ${board.pinCount} pins, ${board.followerCount} followers`);
});
```

### Analytics & Traffic

#### `trackViralPins(criteria?: ViralCriteria): Promise<PinAnalytics[]>`

Find viral pins.

**Criteria:**

```typescript
interface ViralCriteria {
  minImpressions?: number;      // Default: 10,000
  minSaves?: number;            // Default: 500
  minClicks?: number;
  minEngagementRate?: number;   // Default: 0.05 (5%)
  timeframe?: 'day' | 'week' | 'month';
}
```

**Example:**

```typescript
const viralPins = await pinterest.trackViralPins({
  minImpressions: 50000,
  minSaves: 2000,
  minEngagementRate: 0.10,
  timeframe: 'month'
});

// Analyze viral pins
viralPins.forEach(pin => {
  console.log(`Pin ${pin.pinId}:`);
  console.log(`  Viral Score: ${pin.engagement}`);
  console.log(`  Traffic: ${pin.outboundClicks} clicks`);
});
```

#### `driveTrafficToWebsite(websiteUrl: string): Promise<TrafficAnalytics>`

Track all traffic from Pinterest to your website.

**Returns:**

```typescript
interface TrafficAnalytics {
  totalImpressions: number;
  totalClicks: number;
  totalSaves: number;
  clickThroughRate: number;
  topReferringPins: Array<{
    pinId: string;
    clicks: number;
    impressions: number;
  }>;
  topBoards: Array<{
    boardId: string;
    name: string;
    traffic: number;
  }>;
}
```

**Example:**

```typescript
const traffic = await pinterest.driveTrafficToWebsite('myshop.com');

console.log('Website Traffic from Pinterest:');
console.log(`Total Clicks: ${traffic.totalClicks.toLocaleString()}`);
console.log(`CTR: ${(traffic.clickThroughRate * 100).toFixed(2)}%`);

// Find your best traffic drivers
traffic.topReferringPins.slice(0, 5).forEach((pin, i) => {
  console.log(`${i + 1}. Pin ${pin.pinId}: ${pin.clicks} clicks`);
});
```

#### `getPinAnalytics(pinId, timeframe): Promise<PinAnalytics>`

Get detailed analytics for a pin.

**Example:**

```typescript
const analytics = await pinterest.getPinAnalytics('pin-123', 'month');

console.log('Pin Performance:');
console.log(`  Impressions: ${analytics.impressions.toLocaleString()}`);
console.log(`  Saves: ${analytics.saves.toLocaleString()}`);
console.log(`  Clicks: ${analytics.outboundClicks.toLocaleString()}`);
console.log(`  Engagement: ${analytics.engagement}`);
```

### SEO Tools

#### `generateKeywords(niche, productType): string[]`

Generate SEO keywords for your niche.

**Example:**

```typescript
const keywords = pinterest.generateKeywords('home decor', 'wall art');

console.log('SEO Keywords:', keywords);
// [
//   'home decor', 'wall art',
//   'best home decor', 'best wall art',
//   'affordable home decor', 'affordable wall art',
//   'home decor wall art',
//   'home decor ideas',
//   'wall art for home decor',
//   ...
// ]
```

### Scheduling

#### `schedulePins(schedules: SchedulePinOptions[]): Promise<string[]>`

Schedule pins for future posting.

**Example:**

```typescript
const now = new Date();
const schedules = [];

// Schedule pins for peak times
const peakHours = [8, 12, 20]; // 8 AM, 12 PM, 8 PM

for (let day = 0; day < 7; day++) {
  for (const hour of peakHours) {
    const postTime = new Date(now);
    postTime.setDate(now.getDate() + day);
    postTime.setHours(hour, 0, 0, 0);

    schedules.push({
      pin: {
        boardId: 'daily-board',
        imageUrl: `https://shop.com/day-${day}-${hour}.jpg`,
        title: `Daily Inspiration`,
        link: 'https://shop.com'
      },
      scheduledTime: postTime
    });
  }
}

const scheduled = await pinterest.schedulePins(schedules);
console.log(`Scheduled ${scheduled.length} pins`);
```

---

## E-Commerce Guide

### Setting Up for E-Commerce Success

#### 1. Claim Your Website

```typescript
// Verify your website domain on Pinterest
// This enables:
// - Rich pins
// - Analytics
// - Shopping features
```

Add this meta tag to your website:

```html
<meta name="p:domain_verify" content="your-verification-code"/>
```

#### 2. Enable Rich Pins

Add Open Graph meta tags to product pages:

```html
<!-- Product Rich Pin -->
<meta property="og:type" content="product"/>
<meta property="og:title" content="Product Name"/>
<meta property="og:description" content="Product description"/>
<meta property="og:image" content="https://yoursite.com/product-image.jpg"/>
<meta property="og:url" content="https://yoursite.com/product"/>
<meta property="product:price:amount" content="29.99"/>
<meta property="product:price:currency" content="USD"/>
<meta property="product:availability" content="in stock"/>
```

#### 3. Product Pin Strategy

**Best Practices:**

```typescript
// ✅ DO:
const goodPin = await pinterest.optimizeForShopping({
  boardId: 'products',
  imageUrl: 'high-quality-image.jpg',    // 1000x1500px
  title: 'Organic Bamboo Sheets - Queen Size',  // Specific
  description: '100% organic bamboo sheets. Soft, breathable, eco-friendly. Perfect for hot sleepers. Available in 8 colors.',
  link: 'https://shop.com/bamboo-sheets',
  price: 89.99,
  currency: 'USD',
  availability: 'IN_STOCK',
  brand: 'EcoHome',
  salePrice: 69.99
}, {
  usePriceInTitle: true,
  addUrgency: true,
  targetKeywords: ['bamboo sheets', 'organic bedding', 'cooling sheets']
});

// ❌ DON'T:
// - Generic titles: "Sheets"
// - No price info
// - Low quality images
// - No link to product
// - Missing keywords
```

#### 4. Traffic Conversion Formula

```typescript
async function ecommerceTrafficStrategy() {
  const pinterest = new PinterestAutomation({...});

  // Step 1: Create high-value boards
  const boards = [
    'Product Catalog',
    'Customer Reviews & Photos',
    'How-To Guides',
    'Inspiration & Ideas',
    'Behind the Scenes',
    'Seasonal Collections',
    'Sale & Promotions'
  ];

  for (const boardName of boards) {
    await pinterest.createBoard({
      name: boardName,
      description: `${boardName} - Shop now at YourStore.com`,
      privacy: 'PUBLIC'
    });
  }

  // Step 2: Pin consistently
  // Aim for 10-30 pins per day
  // Mix: 80% evergreen, 20% seasonal

  // Step 3: Optimize for keywords
  const productKeywords = pinterest.generateKeywords(
    'home decor',
    'minimalist'
  );

  // Step 4: Track what works
  const viralPins = await pinterest.trackViralPins({
    minClicks: 100,
    timeframe: 'week'
  });

  // Step 5: Double down on winners
  for (const pin of viralPins.slice(0, 5)) {
    // Create similar pins to viral ones
    console.log(`Viral pin found: ${pin.pinId} (${pin.outboundClicks} clicks)`);
  }

  // Step 6: Monitor traffic
  const traffic = await pinterest.driveTrafficToWebsite('yourstore.com');
  console.log(`Monthly clicks: ${traffic.totalClicks}`);
  console.log(`Estimated revenue: $${traffic.totalClicks * 2.5}`); // $2.5 avg order
}
```

---

## SEO Optimization

### Pinterest SEO Checklist

#### Pin Titles (100 chars max)

```typescript
// ✅ Good Examples:
'Ceramic Coffee Mugs - Handmade Pottery - Set of 4'
'Best Organic Skincare Products for Sensitive Skin'
'DIY Home Decor Ideas - Budget Friendly 2024'

// ❌ Bad Examples:
'Mugs'
'Check this out!'
'Amazing product'
```

#### Pin Descriptions (500 chars max)

```typescript
const seoOptimizedDescription = `
Premium ceramic coffee mugs handcrafted by local artisans. Each mug is unique and made from high-quality stoneware clay. Perfect for coffee, tea, or hot chocolate.

Features:
✨ Handmade in USA
☕ 12oz capacity
🎨 Dishwasher & microwave safe
🎁 Gift-ready packaging

Ideal for:
- Coffee lovers
- Housewarming gifts
- Kitchen decor
- Wedding registry

Shop our complete collection of handmade pottery!

#ceramicmugs #handmadepottery #coffeemugs #artisanmade #kitchenware
`;
```

#### Keyword Research

```typescript
// Generate keywords for your niche
const keywords = pinterest.generateKeywords('sustainable fashion', 'organic cotton');

// Use in pins
const pinId = await pinterest.createPin({
  boardId: 'sustainable-fashion',
  imageUrl: 'product.jpg',
  title: keywords[0], // 'sustainable fashion'
  description: `Discover our ${keywords[0]} collection...`,
  link: 'https://shop.com'
}, {
  keywords: keywords.slice(0, 10),
  hashtags: ['sustainable', 'ecofriendly', 'organic'],
  titleFormula: 'keyword-first'
});
```

### Image SEO

**Optimal dimensions:**
- **Standard Pin**: 1000 x 1500px (2:3 ratio)
- **Square Pin**: 1000 x 1000px
- **Long Pin**: 1000 x 2100px (max)

**File names:**
```
✅ organic-cotton-t-shirt-white.jpg
✅ handmade-ceramic-mug-blue.jpg
❌ IMG_1234.jpg
❌ photo.jpg
```

---

## Viral Content Strategy

### What Makes Pins Go Viral?

1. **High-Quality Images** - Clear, well-lit, professional
2. **Strong Headlines** - Benefit-driven, specific
3. **Vertical Format** - 2:3 ratio performs best
4. **Text Overlays** - Add value, explain benefits
5. **Bright Colors** - Eye-catching in feed
6. **Clear CTAs** - "Shop Now", "Get the Recipe", etc.

### Viral Pin Formula

```typescript
async function createViralPin() {
  const pinId = await pinterest.optimizeForShopping({
    boardId: 'viral-products',

    // 1. Perfect image (1000x1500px)
    imageUrl: 'https://shop.com/product-high-res.jpg',

    // 2. Benefit-driven title
    title: 'Save $500/Year with This Simple Kitchen Gadget',

    // 3. Value-packed description
    description: `
      This revolutionary kitchen gadget saves you money, time, and reduces waste!

      ✅ Saves $500+ per year
      ✅ Reduces food waste by 50%
      ✅ Takes 2 minutes to use
      ✅ Easy to clean
      ✅ 5-star ratings

      1000+ happy customers!

      Limited stock - order now!

      #kitchengadgets #moneysaving #ecofriendly #kitchenhacks
    `,

    // 4. Direct link to product
    link: 'https://shop.com/kitchen-gadget',

    // 5. Price visibility
    price: 39.99,
    salePrice: 29.99,
    availability: 'IN_STOCK'
  }, {
    usePriceInTitle: true,
    addUrgency: true,
    highlightBenefit: true,
    targetKeywords: [
      'kitchen gadgets',
      'money saving tips',
      'eco friendly products'
    ]
  });

  return pinId;
}
```

### Track & Replicate

```typescript
// Find your viral pins
const viralPins = await pinterest.trackViralPins({
  minImpressions: 100000,
  minSaves: 5000,
  minEngagementRate: 0.08
});

// Analyze what worked
viralPins.forEach(async (pin) => {
  const analytics = await pinterest.getPinAnalytics(pin.pinId);

  console.log(`Viral Pin Analysis:`);
  console.log(`  Impressions: ${analytics.impressions.toLocaleString()}`);
  console.log(`  Saves: ${analytics.saves.toLocaleString()}`);
  console.log(`  Website Clicks: ${analytics.outboundClicks.toLocaleString()}`);
  console.log(`  CTR: ${((analytics.outboundClicks / analytics.impressions) * 100).toFixed(2)}%`);

  // Create similar pins
});
```

---

## Best Practices

### 1. Pinning Frequency

- **Optimal**: 10-30 pins per day
- **Minimum**: 5 pins per day
- **Best times**: 8-11 PM (peak engagement)
- **Consistency**: More important than quantity

### 2. Board Strategy

```typescript
// Organize boards strategically
const boardStructure = {
  'Main Categories': [
    'All Products',
    'Best Sellers',
    'New Arrivals',
    'Sale Items'
  ],
  'By Product Type': [
    'Category 1',
    'Category 2',
    'Category 3'
  ],
  'Lifestyle': [
    'How To Use',
    'Customer Photos',
    'Inspiration',
    'Behind the Scenes'
  ],
  'Seasonal': [
    'Spring Collection',
    'Summer Collection',
    'Holiday Gift Guide'
  ]
};
```

### 3. Content Mix

- **80%**: Your products/content
- **20%**: Curated content (others' pins)
- Mix product pins with lifestyle/inspiration
- Repurpose content across boards

### 4. Traffic Optimization

```typescript
async function optimizeTraffic() {
  // Weekly check
  const traffic = await pinterest.driveTrafficToWebsite('yourstore.com');

  // Find best performers
  const topPins = traffic.topReferringPins.slice(0, 10);

  // Create variations of top pins
  for (const pin of topPins) {
    // Analyze and recreate with improvements
    const analytics = await pinterest.getPinAnalytics(pin.pinId);

    if (analytics.outboundClicks > 100) {
      console.log(`High-traffic pin: ${pin.pinId}`);
      // Create 3-5 variations
    }
  }
}
```

### 5. Mobile Optimization

- 80% of Pinterest users are on mobile
- Use vertical images (2:3 ratio)
- Large, readable text overlays
- Clear, simple designs
- Test on mobile before posting

---

## API Limits

### Rate Limits

- **Per user**: 180 requests per minute
- **Per app**: 10,000 requests per hour
- **Pins**: Up to 500 per day (recommended)

### Best Practices

- Add 1-second delays between pins
- Batch operations when possible
- Monitor rate limit headers
- Implement exponential backoff

---

## Success Metrics

### E-Commerce KPIs

```typescript
// Monthly tracking
const monthlyMetrics = {
  impressions: 500000,      // Goal: 500K+
  saves: 25000,             // Goal: 25K+
  clicks: 15000,            // Goal: 15K+
  ctr: 0.03,                // Goal: 3%+
  revenue: 37500            // $15K clicks * $2.50 AOV
};
```

### Viral Benchmarks

- **Impressions**: 10,000+ (viral start)
- **Saves**: 500+ (highly engaging)
- **CTR**: 5%+ (excellent)
- **Engagement Rate**: 8%+ (viral)

---

## Support

- **Pinterest API**: https://developers.pinterest.com/docs/api/v5/
- **Rich Pins**: https://help.pinterest.com/en/business/article/rich-pins
- **Setup Guide**: [PINTEREST_SETUP.md](./PINTEREST_SETUP.md)
- **Examples**: [pinterest-automation-example.ts](../examples/pinterest-automation-example.ts)

---

**Drive massive e-commerce traffic with Pinterest!** 📍💰
