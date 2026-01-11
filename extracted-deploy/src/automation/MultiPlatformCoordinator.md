# Multi-Platform Coordinator

**Master Orchestration System** - Manage all social media platforms from one unified system.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [API Reference](#api-reference)
5. [Use Cases](#use-cases)
6. [Advanced Features](#advanced-features)
7. [Best Practices](#best-practices)

---

## Overview

The `MultiPlatformCoordinator` is the master control system that orchestrates **all social media platforms** into one unified automation system. Think of it as your social media command center.

### Supported Platforms

Currently Integrated:
- ✅ **YouTube** - Video content
- ✅ **Instagram** - Photos, reels, stories
- ✅ **TikTok** - Short-form videos
- ✅ **Pinterest** - E-commerce & discovery

Future Platforms:
- 🔜 **Facebook** - Social networking
- 🔜 **Twitter/X** - Micro-blogging
- 🔜 **Reddit** - Community engagement
- 🔜 **LinkedIn** - Professional networking

### Key Features

- 🎯 **Unified Posting** - Post to all platforms with one command
- 🔄 **Content Sync** - Cross-post content between platforms
- 📅 **Coordinated Scheduling** - Schedule across all platforms
- 🔗 **Cross-Promotion** - Promote content between platforms
- 📊 **Unified Analytics** - Track metrics across all platforms
- 🎨 **Smart Adaptation** - Auto-adapt content for each platform
- 🚀 **Platform Optimization** - Get recommendations for each platform
- 💡 **Best Platform Detection** - Find optimal platform for content type

### Why Use Multi-Platform Coordinator?

**Save Time:**
- One API call instead of 4+ separate calls
- Automatic content adaptation
- Centralized management

**Better Results:**
- Cross-promotion increases reach by 300%+
- Platform-specific optimization
- Unified analytics for better insights

**Simplified Workflow:**
- No context switching between platforms
- Consistent branding across all channels
- One source of truth for content

---

## Installation

The coordinator automatically uses all installed platform automations:

```bash
# Already installed if you have the automation systems
npm install axios form-data dotenv googleapis
```

---

## Quick Start

### Initialize Coordinator

```typescript
import { MultiPlatformCoordinator } from './automation/MultiPlatformCoordinator';
import * as dotenv from 'dotenv';

dotenv.config();

const coordinator = new MultiPlatformCoordinator({
  youtube: {
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    redirectUri: process.env.YOUTUBE_REDIRECT_URI!,
    accessToken: process.env.YOUTUBE_ACCESS_TOKEN,
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN
  },
  instagram: {
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN!,
    businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!
  },
  tiktok: {
    clientKey: process.env.TIKTOK_CLIENT_KEY!,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
    accessToken: process.env.TIKTOK_ACCESS_TOKEN
  },
  pinterest: {
    accessToken: process.env.PINTEREST_ACCESS_TOKEN!,
    clientId: process.env.PINTEREST_CLIENT_ID,
    clientSecret: process.env.PINTEREST_CLIENT_SECRET
  }
});

console.log('Enabled platforms:', coordinator.getEnabledPlatforms());
```

### Post to All Platforms

```typescript
// Post the same content to all platforms
const results = await coordinator.postToAllPlatforms({
  content: {
    title: 'New Product Launch! 🚀',
    description: 'Check out our latest innovation. Limited time offer!',
    media: {
      type: 'image',
      url: 'https://yourstore.com/product-image.jpg'
    },
    link: 'https://yourstore.com/new-product',
    tags: ['newproduct', 'innovation', 'limitedoffer'],
    price: 99.99,
    currency: 'USD',
    availability: 'IN_STOCK'
  },
  adaptContent: true,
  crossPromote: true
});

// Results contains post IDs for each platform
results.forEach((postId, platform) => {
  console.log(`${platform}: ${postId}`);
});
```

### Track All Metrics

```typescript
// Get unified analytics from all platforms
const analytics = await coordinator.trackAllMetrics('week');

console.log('\n📊 Weekly Performance Across All Platforms:');
console.log(`Total Reach: ${analytics.totalReach.toLocaleString()}`);
console.log(`Total Engagement: ${analytics.totalEngagement.toLocaleString()}`);
console.log(`Total Clicks: ${analytics.totalClicks.toLocaleString()}`);
console.log(`Best Platform: ${analytics.topPlatform}`);
console.log(`Avg Engagement Rate: ${(analytics.averageEngagementRate * 100).toFixed(2)}%`);

console.log('\n📈 Per-Platform Breakdown:');
analytics.platforms.forEach(p => {
  console.log(`\n${p.platform}:`);
  console.log(`  Impressions: ${p.impressions.toLocaleString()}`);
  console.log(`  Engagement: ${p.engagement.toLocaleString()}`);
  console.log(`  Clicks: ${p.clicks.toLocaleString()}`);
});

console.log('\n💡 Recommendations:');
analytics.recommendations.forEach(r => console.log(`  - ${r}`));
```

---

## API Reference

### Constructor

```typescript
new MultiPlatformCoordinator(config: MultiPlatformConfig)
```

**Parameters:**

```typescript
interface MultiPlatformConfig {
  youtube?: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    accessToken?: string;
    refreshToken?: string;
  };
  instagram?: {
    accessToken: string;
    businessAccountId: string;
  };
  tiktok?: {
    clientKey: string;
    clientSecret: string;
    accessToken?: string;
    refreshToken?: string;
  };
  pinterest?: {
    accessToken?: string;
    clientId?: string;
    clientSecret?: string;
  };
}
```

Only include platforms you want to enable. The coordinator will automatically detect and use available platforms.

### Unified Posting

#### `postToAllPlatforms(options: PostToAllOptions): Promise<Map<Platform, string>>`

Post content to multiple platforms with automatic adaptation.

**Parameters:**

```typescript
interface PostToAllOptions {
  content: UniversalContent;      // Content to post
  platforms?: Platform[];         // Specific platforms (default: all)
  scheduleTime?: Date;            // Schedule for later
  crossPromote?: boolean;         // Add cross-promo links
  adaptContent?: boolean;         // Auto-adapt for each platform
}

interface UniversalContent {
  title: string;
  description: string;
  media: {
    type: 'image' | 'video';
    url?: string;               // Remote URL
    path?: string;              // Local file
    width?: number;
    height?: number;
    duration?: number;
  };
  link?: string;                // Website link
  tags?: string[];              // Hashtags/keywords
  category?: string;
  // E-commerce fields
  price?: number;
  currency?: string;
  availability?: 'IN_STOCK' | 'OUT_OF_STOCK';
  productId?: string;
}
```

**Returns:** Map of platform → post ID

**Example:**

```typescript
const results = await coordinator.postToAllPlatforms({
  content: {
    title: 'Summer Sale! 50% Off',
    description: 'Biggest sale of the year. Shop now before it\'s gone!',
    media: {
      type: 'image',
      url: 'https://store.com/sale-banner.jpg'
    },
    link: 'https://store.com/sale',
    tags: ['sale', 'summer', 'discount'],
    price: 49.99,
    currency: 'USD',
    availability: 'IN_STOCK'
  },
  platforms: ['pinterest', 'instagram', 'tiktok'], // Specific platforms
  crossPromote: true,
  adaptContent: true
});

// Check success
console.log(`Posted to ${results.size} platforms`);
```

### Content Sync

#### `syncContent(source, targetPlatforms): Promise<Map<Platform, string>>`

Cross-post existing content from one platform to others.

**Example:**

```typescript
// Viral TikTok video? Share to other platforms!
const synced = await coordinator.syncContent(
  {
    platform: 'tiktok',
    postId: 'viral-video-id'
  },
  ['youtube', 'instagram']
);

console.log(`Synced to ${synced.size} platforms`);
```

### Coordinated Scheduling

#### `scheduleAcrossAll(options): Promise<Map<Platform, string[]>>`

Schedule content across platforms with optimal timing.

**Example:**

```typescript
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const scheduled = await coordinator.scheduleAcrossAll({
  content: {
    title: 'Weekly Update',
    description: 'Here\'s what\'s new this week!',
    media: { type: 'image', url: 'https://example.com/update.jpg' }
  },
  platforms: ['youtube', 'instagram', 'pinterest'],
  schedules: [
    { platform: 'youtube', time: new Date(tomorrow.setHours(10, 0)) },     // 10 AM
    { platform: 'instagram', time: new Date(tomorrow.setHours(14, 0)) },   // 2 PM
    { platform: 'pinterest', time: new Date(tomorrow.setHours(20, 0)) }    // 8 PM
  ],
  stagger: 30 // 30 minutes between platform posts
});
```

### Cross-Promotion

#### `crossPromote(options): Promise<Map<Platform, string>>`

Promote content from one platform on all others.

**Example:**

```typescript
// New YouTube video? Promote on Instagram, TikTok, Pinterest
const promos = await coordinator.crossPromote({
  mainPlatform: 'youtube',
  postId: 'new-video-id',
  promotionPlatforms: ['instagram', 'tiktok', 'pinterest'],
  message: '🎥 New video is live! Watch the full tutorial on YouTube 👉'
});

console.log(`Promoted on ${promos.size} platforms`);
```

### Unified Analytics

#### `trackAllMetrics(timeframe): Promise<CrossPlatformAnalytics>`

Get comprehensive analytics from all platforms.

**Returns:**

```typescript
interface CrossPlatformAnalytics {
  totalReach: number;
  totalEngagement: number;
  totalClicks: number;
  platforms: UnifiedMetrics[];
  topPlatform: Platform;
  averageEngagementRate: number;
  recommendations: string[];
}
```

**Example:**

```typescript
const monthlyStats = await coordinator.trackAllMetrics('month');

console.log('Monthly Performance:');
console.log(`Total Reach: ${monthlyStats.totalReach.toLocaleString()}`);
console.log(`Top Platform: ${monthlyStats.topPlatform}`);

// Export to CSV, dashboard, etc.
```

### Platform Optimization

#### `optimizePerPlatform(): Promise<Map<Platform, PlatformOptimization>>`

Get optimization recommendations for each platform.

**Example:**

```typescript
const optimizations = await coordinator.optimizePerPlatform();

optimizations.forEach((opt, platform) => {
  console.log(`\n${platform} Optimizations:`);
  opt.recommendations.forEach(rec => {
    console.log(`  ${rec.type}: ${rec.suggestion}`);
    console.log(`     Expected: ${rec.expectedImprovement}`);
  });
});
```

#### `getBestPlatformFor(contentType): Promise<Platform>`

Find the best platform for specific content.

**Example:**

```typescript
const bestForVideo = await coordinator.getBestPlatformFor('video');
// Returns: 'youtube' or 'tiktok' based on your performance

const bestForProduct = await coordinator.getBestPlatformFor('product');
// Returns: 'pinterest' (optimized for e-commerce)

const bestForImage = await coordinator.getBestPlatformFor('image');
// Returns: 'pinterest' or 'instagram'
```

---

## Use Cases

### Use Case 1: Product Launch Campaign

```typescript
async function productLaunchCampaign() {
  const coordinator = new MultiPlatformCoordinator({...});

  // 1. Create product content
  const productContent = {
    title: 'Introducing the UltraWidget Pro',
    description: `
      Revolutionary widget that changes everything!

      ✨ 3x faster than competitors
      💪 Built to last
      🌍 Eco-friendly materials

      Limited launch pricing: Only $99.99!
      Use code LAUNCH20 for extra 20% off!
    `,
    media: {
      type: 'image',
      url: 'https://store.com/ultrawidget-hero.jpg',
      width: 1200,
      height: 1200
    },
    link: 'https://store.com/ultrawidget-pro',
    tags: ['newproduct', 'innovation', 'tech', 'gadgets'],
    price: 99.99,
    currency: 'USD',
    availability: 'IN_STOCK',
    productId: 'ULTRA-001'
  };

  // 2. Post to all platforms
  console.log('🚀 Launching product campaign...');

  const results = await coordinator.postToAllPlatforms({
    content: productContent,
    crossPromote: true,
    adaptContent: true
  });

  console.log(`✅ Posted to ${results.size} platforms`);

  // 3. Cross-promote the best performer
  await new Promise(r => setTimeout(r, 60 * 60 * 1000)); // Wait 1 hour

  const analytics = await coordinator.trackAllMetrics('day');
  const topPlatform = analytics.topPlatform;

  const topPost = results.get(topPlatform);
  if (topPost) {
    await coordinator.crossPromote({
      mainPlatform: topPlatform,
      postId: topPost,
      promotionPlatforms: coordinator.getEnabledPlatforms().filter(p => p !== topPlatform),
      message: `🔥 Going viral on ${topPlatform}! Check it out 👉`
    });
  }

  // 4. Track results
  console.log('\n📊 Campaign Results:');
  console.log(`Total Reach: ${analytics.totalReach.toLocaleString()}`);
  console.log(`Total Clicks: ${analytics.totalClicks.toLocaleString()}`);

  const estimatedRevenue = analytics.totalClicks * 0.025 * 99.99;
  console.log(`Estimated Revenue: $${estimatedRevenue.toFixed(2)}`);
}
```

### Use Case 2: Weekly Content Calendar

```typescript
async function weeklyContentCalendar() {
  const coordinator = new MultiPlatformCoordinator({...});

  const now = new Date();
  const schedules = [];

  // Monday: Educational content
  schedules.push({
    content: {
      title: 'Monday Motivation: 5 Productivity Tips',
      description: 'Start your week strong with these proven productivity hacks!',
      media: { type: 'image', url: 'https://example.com/monday.jpg' },
      tags: ['productivity', 'motivation', 'mondaymood']
    },
    time: new Date(now.setDate(now.getDate() + (1 - now.getDay()))).setHours(9, 0)
  });

  // Wednesday: Product showcase
  schedules.push({
    content: {
      title: 'Product Spotlight: Customer Favorite',
      description: 'See why customers love this product!',
      media: { type: 'image', url: 'https://example.com/product.jpg' },
      tags: ['product', 'customerlove'],
      price: 49.99,
      currency: 'USD'
    },
    time: new Date(now.setDate(now.getDate() + (3 - now.getDay()))).setHours(14, 0)
  });

  // Friday: Behind the scenes
  schedules.push({
    content: {
      title: 'Friday BTS: How We Make It',
      description: 'Take a peek behind the curtain!',
      media: { type: 'video', url: 'https://example.com/bts.mp4' },
      tags: ['bts', 'behindthescenes', 'fridayfeeling']
    },
    time: new Date(now.setDate(now.getDate() + (5 - now.getDay()))).setHours(16, 0)
  });

  // Schedule all content
  for (const schedule of schedules) {
    await coordinator.postToAllPlatforms({
      content: schedule.content,
      scheduleTime: new Date(schedule.time),
      crossPromote: true,
      adaptContent: true
    });
  }

  console.log(`✅ Scheduled ${schedules.length} posts for the week`);
}
```

### Use Case 3: Performance Tracking Dashboard

```typescript
async function performanceDashboard() {
  const coordinator = new MultiPlatformCoordinator({...});

  // Weekly report
  const weekly = await coordinator.trackAllMetrics('week');
  const monthly = await coordinator.trackAllMetrics('month');

  console.log('═══════════════════════════════════════');
  console.log('  SOCIAL MEDIA PERFORMANCE DASHBOARD');
  console.log('═══════════════════════════════════════\n');

  console.log('📊 WEEKLY SUMMARY');
  console.log(`   Total Reach: ${weekly.totalReach.toLocaleString()}`);
  console.log(`   Engagement: ${weekly.totalEngagement.toLocaleString()}`);
  console.log(`   Clicks: ${weekly.totalClicks.toLocaleString()}`);
  console.log(`   Top Platform: ${weekly.topPlatform} 🏆\n`);

  console.log('📈 PLATFORM BREAKDOWN\n');
  weekly.platforms.forEach(p => {
    const engagementRate = (p.engagement / p.impressions) * 100;
    console.log(`${p.platform.toUpperCase()}:`);
    console.log(`   Impressions: ${p.impressions.toLocaleString()}`);
    console.log(`   Engagement: ${p.engagement.toLocaleString()} (${engagementRate.toFixed(2)}%)`);
    console.log(`   Clicks: ${p.clicks.toLocaleString()}\n`);
  });

  console.log('💡 RECOMMENDATIONS\n');
  weekly.recommendations.forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });

  console.log('\n🎯 OPTIMIZATIONS\n');
  const optimizations = await coordinator.optimizePerPlatform();

  optimizations.forEach((opt, platform) => {
    console.log(`${platform.toUpperCase()}:`);
    opt.recommendations.slice(0, 2).forEach(rec => {
      console.log(`   • ${rec.suggestion}`);
    });
    console.log('');
  });

  console.log('═══════════════════════════════════════\n');
}
```

---

## Advanced Features

### Smart Content Adaptation

The coordinator automatically adapts content for each platform:

```typescript
// You provide universal content
const content = {
  title: 'Amazing Product with Tons of Features and Benefits!',
  description: 'Very long description...',
  tags: ['tag1', 'tag2', ... 'tag50']
};

// Coordinator adapts automatically:
// YouTube: Full title (100 chars), full description (5000 chars), all tags
// Instagram: Truncated title, description with hashtags (2200 chars), 30 tags max
// TikTok: Short title, concise description, 30 tags
// Pinterest: 100 char title, 500 char description, 20 tags

// All automatic! ✨
```

### Cross-Promotion Templates

```typescript
// Automatic cross-promotion adds platform mentions
const results = await coordinator.postToAllPlatforms({
  content: {...},
  crossPromote: true  // Adds: "Follow me on: YouTube, Instagram, TikTok, Pinterest"
});
```

### Best Platform Detection

```typescript
// Automatically find best platform for content type
const bestForVideo = await coordinator.getBestPlatformFor('video');
const bestForImage = await coordinator.getBestPlatformFor('image');
const bestForProduct = await coordinator.getBestPlatformFor('product');

// Post to optimal platform
await coordinator.postToAllPlatforms({
  content: productContent,
  platforms: [bestForProduct], // Pinterest for products
  adaptContent: true
});
```

---

## Best Practices

### 1. Content Strategy

```typescript
// Mix content types across platforms
const contentMix = {
  educational: 30%, // How-to, tutorials
  promotional: 20%, // Product launches, sales
  entertaining: 30%, // Behind-scenes, fun
  inspirational: 20% // Quotes, motivation
};

// Optimal posting frequency
const frequency = {
  youtube: '2-3 times/week',
  instagram: '1-2 times/day',
  tiktok: '1-3 times/day',
  pinterest: '10-30 pins/day'
};
```

### 2. Timing Optimization

```typescript
// Best times to post (general)
const optimalTimes = {
  youtube: '14:00-16:00 (2-4 PM)',
  instagram: '11:00, 14:00, 19:00',
  tiktok: '06:00-10:00, 19:00-23:00',
  pinterest: '20:00-23:00 (8-11 PM)'
};

// Use platform-specific scheduling
await coordinator.scheduleAcrossAll({
  content: {...},
  platforms: ['youtube', 'instagram'],
  schedules: [
    { platform: 'youtube', time: '14:00' },
    { platform: 'instagram', time: '19:00' }
  ]
});
```

### 3. Cross-Platform Workflow

```typescript
// 1. Start with best platform for content type
const bestPlatform = await coordinator.getBestPlatformFor('video');

// 2. Post to best platform first
const initialPost = await coordinator.postToAllPlatforms({
  content: videoContent,
  platforms: [bestPlatform]
});

// 3. Wait for initial engagement (1-2 hours)
await new Promise(r => setTimeout(r, 2 * 60 * 60 * 1000));

// 4. If performing well, cross-post to other platforms
const analytics = await coordinator.trackAllMetrics('day');
if (analytics.platforms[0].engagement > 1000) {
  await coordinator.syncContent(
    { platform: bestPlatform, postId: initialPost.get(bestPlatform)! },
    ['instagram', 'tiktok', 'pinterest']
  );
}
```

### 4. Performance Monitoring

```typescript
// Daily health check
async function dailyHealthCheck() {
  const coordinator = new MultiPlatformCoordinator({...});

  const analytics = await coordinator.trackAllMetrics('day');

  // Alert if any platform underperforming
  analytics.platforms.forEach(p => {
    const engagementRate = p.engagement / p.impressions;

    if (engagementRate < 0.01) { // Less than 1%
      console.warn(`⚠️  ${p.platform} engagement low: ${(engagementRate * 100).toFixed(2)}%`);
    }
  });

  // Get optimization suggestions
  const optimizations = await coordinator.optimizePerPlatform();
  // Review and implement suggestions...
}
```

---

## Success Metrics

### Cross-Platform KPIs

```typescript
// Track these metrics weekly
const kpis = {
  totalReach: 100000,           // Target: 100K+ impressions
  totalEngagement: 5000,        // Target: 5K+ engagements
  totalClicks: 2000,            // Target: 2K+ clicks
  averageEngagementRate: 0.05,  // Target: 5%+
  platformDiversity: 4          // Active on 4+ platforms
};

// Revenue tracking
const revenueImpact = {
  clicks: 2000,
  conversionRate: 0.025,  // 2.5%
  averageOrderValue: 75,
  monthlyRevenue: 2000 * 0.025 * 75 // = $3,750
};
```

---

## Support

- **Setup Guides**: See individual platform setup guides
- **Examples**: [multiplatform-coordinator-example.ts](../examples/multiplatform-coordinator-example.ts)
- **API Docs**: Individual platform documentation

---

**Master your entire social media presence!** 🚀📱💼
