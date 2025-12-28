# Instagram Automation API Documentation

Complete Instagram Graph API automation system for content creators and social media managers.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Authentication](#authentication)
4. [Quick Start](#quick-start)
5. [API Reference](#api-reference)
6. [Examples](#examples)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## Overview

The `InstagramAutomation` class provides a production-ready automation system for Instagram using the official Instagram Graph API. It supports feed posts, reels, stories, scheduling, auto-replies, and comprehensive analytics.

### Features

- ✅ **Feed Posts**: Images, carousels, and albums
- ✅ **Reels**: Short-form video content
- ✅ **Stories**: 24-hour ephemeral content with links
- ✅ **Scheduling**: Schedule posts for optimal engagement
- ✅ **Auto-Reply**: Automated comment responses with rules
- ✅ **Analytics**: Track performance metrics
- ✅ **Hashtag Management**: Research and optimization
- ✅ **OAuth Authentication**: Secure token management
- ✅ **Rate Limiting**: API quota management
- ✅ **Error Handling**: Production-ready error recovery

### Requirements

- Instagram Business or Creator account
- Facebook Page connected to Instagram account
- Facebook Developer account
- Instagram Graph API access
- Node.js 16+

---

## Installation

```bash
# Install dependencies
npm install axios form-data dotenv

# Install TypeScript types
npm install --save-dev @types/node @types/form-data
```

---

## Authentication

### Setup Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app → Business type
3. Add Instagram Graph API product
4. Configure Basic Settings
5. Get access tokens via Graph API Explorer

**See full setup guide**: [INSTAGRAM_SETUP.md](./INSTAGRAM_SETUP.md)

### Initialize Client

```typescript
import { InstagramAutomation } from './automation/InstagramAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

const instagram = new InstagramAutomation({
  accessToken: process.env.INSTAGRAM_ACCESS_TOKEN!,
  businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!
});
```

---

## Quick Start

### Post an Image

```typescript
// Single image post
const mediaId = await instagram.postFeed({
  imageUrl: 'https://example.com/image.jpg',
  caption: 'Check out my latest product! #newlaunch #ecommerce',
  location: 'San Francisco, CA'
});

console.log('Posted:', `https://www.instagram.com/p/${mediaId}`);
```

### Post a Carousel

```typescript
// Multi-image carousel
const carouselId = await instagram.postCarousel({
  media: [
    { type: 'image', url: 'https://example.com/image1.jpg' },
    { type: 'image', url: 'https://example.com/image2.jpg' },
    { type: 'video', url: 'https://example.com/video.mp4' }
  ],
  caption: 'Swipe to see more! 👉',
  location: 'New York, NY'
});
```

### Post a Reel

```typescript
// Video reel
const reelId = await instagram.postReel({
  videoUrl: 'https://example.com/reel.mp4',
  caption: 'Quick tutorial! #howto #tutorial',
  coverUrl: 'https://example.com/thumbnail.jpg',
  shareToFeed: true
});
```

### Schedule Posts

```typescript
// Schedule multiple posts
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0); // 10 AM

const scheduledIds = await instagram.schedulePosts([
  {
    scheduledTime: tomorrow,
    mediaType: 'image',
    imageUrl: 'https://example.com/post1.jpg',
    caption: 'Morning motivation! ☀️'
  },
  {
    scheduledTime: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000), // 4 PM
    mediaType: 'carousel',
    media: [...],
    caption: 'Afternoon update! 📸'
  }
]);
```

---

## API Reference

### Constructor

```typescript
new InstagramAutomation(config: InstagramConfig)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config.accessToken` | `string` | Yes | Instagram Graph API access token |
| `config.businessAccountId` | `string` | Yes | Instagram Business Account ID |

### Feed Posts

#### `postFeed(options: MediaPostOptions): Promise<string>`

Post a single image or video to the Instagram feed.

**Parameters:**

```typescript
interface MediaPostOptions {
  imageUrl?: string;        // Image URL (for images)
  videoUrl?: string;        // Video URL (for videos)
  caption?: string;         // Post caption (max 2,200 chars)
  location?: string;        // Location name or ID
  userTags?: Array<{       // Tag users in photo
    username: string;
    x: number;             // X position (0-1)
    y: number;             // Y position (0-1)
  }>;
  productTags?: string[];  // Product IDs for shopping tags
}
```

**Returns:** Media ID

**Example:**

```typescript
const mediaId = await instagram.postFeed({
  imageUrl: 'https://example.com/product.jpg',
  caption: 'New product launch! 🚀 #newproduct',
  location: 'Los Angeles, CA',
  userTags: [
    { username: 'partner_account', x: 0.5, y: 0.5 }
  ]
});
```

#### `postCarousel(options: CarouselPostOptions): Promise<string>`

Post a multi-image/video carousel (album).

**Parameters:**

```typescript
interface CarouselPostOptions {
  media: Array<{
    type: 'image' | 'video';
    url: string;
  }>;
  caption?: string;
  location?: string;
  userTags?: Array<{
    username: string;
    x: number;
    y: number;
  }>;
}
```

**Returns:** Media ID

**Limits:**
- Min: 2 items
- Max: 10 items
- Mix images and videos

**Example:**

```typescript
const carouselId = await instagram.postCarousel({
  media: [
    { type: 'image', url: 'https://example.com/img1.jpg' },
    { type: 'image', url: 'https://example.com/img2.jpg' },
    { type: 'video', url: 'https://example.com/clip.mp4' }
  ],
  caption: 'Product showcase! Swipe to see all features 👉'
});
```

### Reels

#### `postReel(options: ReelPostOptions): Promise<string>`

Post a video reel to Instagram.

**Parameters:**

```typescript
interface ReelPostOptions {
  videoUrl: string;         // Video URL (required)
  caption?: string;         // Reel caption
  coverUrl?: string;        // Thumbnail image URL
  shareToFeed?: boolean;    // Also post to main feed
  location?: string;        // Location
}
```

**Returns:** Media ID

**Video Requirements:**
- Format: MP4, MOV
- Max duration: 90 seconds
- Min duration: 3 seconds
- Aspect ratio: 9:16 recommended
- Max file size: 1 GB

**Example:**

```typescript
const reelId = await instagram.postReel({
  videoUrl: 'https://example.com/tutorial.mp4',
  caption: 'Quick tutorial! #howto #tutorial',
  coverUrl: 'https://example.com/thumbnail.jpg',
  shareToFeed: true,
  location: 'Studio'
});
```

### Stories

#### `postStory(options: StoryPostOptions): Promise<string>`

Post a 24-hour story.

**Parameters:**

```typescript
interface StoryPostOptions {
  imageUrl?: string;        // Story image URL
  videoUrl?: string;        // Story video URL
  link?: string;            // Swipe-up link (10k+ followers required)
  linkText?: string;        // Link button text
  location?: string;        // Location sticker
  hashtags?: string[];      // Hashtag stickers
  mention?: string;         // Mention username
}
```

**Returns:** Media ID

**Requirements:**
- Swipe-up links: 10,000+ followers or verified account
- Stories expire after 24 hours
- Max video: 15 seconds per story

**Example:**

```typescript
const storyId = await instagram.postStory({
  imageUrl: 'https://example.com/story.jpg',
  link: 'https://mystore.com/sale',
  linkText: 'Shop Now',
  hashtags: ['sale', 'limited'],
  mention: 'brand_partner'
});
```

### Scheduling

#### `schedulePosts(schedules: SchedulePostOptions[]): Promise<string[]>`

Schedule multiple posts for future publication.

**Parameters:**

```typescript
interface SchedulePostOptions {
  scheduledTime: Date;      // Publication time (15 min - 75 days)
  mediaType: 'image' | 'video' | 'carousel';
  imageUrl?: string;        // For image/video posts
  videoUrl?: string;
  media?: Array<{          // For carousels
    type: 'image' | 'video';
    url: string;
  }>;
  caption?: string;
  location?: string;
}
```

**Returns:** Array of scheduled container IDs

**Limits:**
- Min: 15 minutes in future
- Max: 75 days in future
- Max: 25 scheduled posts at once

**Example:**

```typescript
const baseTime = new Date();
baseTime.setHours(baseTime.getHours() + 1);

const scheduled = await instagram.schedulePosts([
  {
    scheduledTime: baseTime,
    mediaType: 'image',
    imageUrl: 'https://example.com/morning.jpg',
    caption: 'Good morning! ☀️'
  },
  {
    scheduledTime: new Date(baseTime.getTime() + 4 * 60 * 60 * 1000),
    mediaType: 'carousel',
    media: [...],
    caption: 'Afternoon update! 📸'
  }
]);

console.log('Scheduled:', scheduled.length, 'posts');
```

### Auto-Reply

#### `setAutoReplyRules(rules: AutoReplyRule[]): void`

Configure automatic comment reply rules.

**Parameters:**

```typescript
interface AutoReplyRule {
  trigger: string;          // Keyword or phrase to match
  response: string;         // Reply message
  caseSensitive?: boolean;  // Case-sensitive matching
  exactMatch?: boolean;     // Exact match only
}
```

**Example:**

```typescript
instagram.setAutoReplyRules([
  {
    trigger: 'price',
    response: 'Check our website for pricing: https://mystore.com',
    caseSensitive: false
  },
  {
    trigger: 'shipping',
    response: 'We offer free shipping on orders over $50!',
    caseSensitive: false
  },
  {
    trigger: 'dm',
    response: 'Sure! Sending you a DM now 📧',
    exactMatch: true
  }
]);
```

#### `autoReply(mediaId: string): Promise<number>`

Automatically reply to comments based on configured rules.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `mediaId` | `string` | Media ID to process comments |

**Returns:** Number of replies sent

**Example:**

```typescript
// Post content
const mediaId = await instagram.postFeed({...});

// Auto-reply to comments
const repliesCount = await instagram.autoReply(mediaId);
console.log(`Sent ${repliesCount} auto-replies`);
```

#### `replyToComment(commentId: string, message: string): Promise<string>`

Reply to a specific comment.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `commentId` | `string` | Comment ID |
| `message` | `string` | Reply message |

**Returns:** Reply ID

**Example:**

```typescript
const replyId = await instagram.replyToComment(
  'comment_12345',
  'Thank you for your support! ❤️'
);
```

### Analytics

#### `trackMetrics(mediaIds: string[]): Promise<MediaMetrics[]>`

Get performance metrics for multiple posts.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `mediaIds` | `string[]` | Array of media IDs |

**Returns:** Array of MediaMetrics

```typescript
interface MediaMetrics {
  mediaId: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  engagement: number;      // Calculated: (likes + comments + saves) / reach
  timestamp: Date;
}
```

**Example:**

```typescript
const metrics = await instagram.trackMetrics([
  'media_1',
  'media_2',
  'media_3'
]);

metrics.forEach(m => {
  console.log(`${m.mediaId}:`);
  console.log(`  Likes: ${m.likes.toLocaleString()}`);
  console.log(`  Engagement: ${(m.engagement * 100).toFixed(2)}%`);
});
```

#### `getAccountMetrics(period: 'day' | 'week' | 'days_28'): Promise<AccountMetrics>`

Get account-level analytics.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | `'day' \| 'week' \| 'days_28'` | Time period |

**Returns:** AccountMetrics

```typescript
interface AccountMetrics {
  followers: number;
  following: number;
  posts: number;
  reach: number;
  impressions: number;
  profileViews: number;
  websiteClicks: number;
  emailContacts: number;
  engagement: number;
  period: string;
}
```

**Example:**

```typescript
const weeklyMetrics = await instagram.getAccountMetrics('week');

console.log('Weekly Performance:');
console.log(`Followers: ${weeklyMetrics.followers.toLocaleString()}`);
console.log(`Reach: ${weeklyMetrics.reach.toLocaleString()}`);
console.log(`Engagement: ${(weeklyMetrics.engagement * 100).toFixed(2)}%`);
```

#### `getTopPosts(limit: number = 10, sortBy: 'likes' | 'comments' | 'engagement' = 'engagement'): Promise<MediaMetrics[]>`

Get top-performing posts.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `number` | `10` | Number of posts |
| `sortBy` | `'likes' \| 'comments' \| 'engagement'` | `'engagement'` | Sort criteria |

**Returns:** Array of MediaMetrics sorted by criteria

**Example:**

```typescript
const topPosts = await instagram.getTopPosts(5, 'engagement');

console.log('Top 5 Posts by Engagement:');
topPosts.forEach((post, i) => {
  console.log(`${i + 1}. ${post.mediaId}`);
  console.log(`   Engagement: ${(post.engagement * 100).toFixed(2)}%`);
});
```

### Hashtags

#### `searchHashtags(query: string): Promise<HashtagInfo[]>`

Search for hashtags and get popularity data.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `string` | Hashtag to search (without #) |

**Returns:** Array of HashtagInfo

```typescript
interface HashtagInfo {
  id: string;
  name: string;
  mediaCount: number;
}
```

**Example:**

```typescript
const hashtags = await instagram.searchHashtags('fitness');

hashtags.forEach(tag => {
  console.log(`#${tag.name}: ${tag.mediaCount.toLocaleString()} posts`);
});
```

#### `getHashtagPerformance(hashtagName: string): Promise<HashtagPerformance>`

Analyze hashtag performance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `hashtagName` | `string` | Hashtag name (without #) |

**Returns:** HashtagPerformance

```typescript
interface HashtagPerformance {
  hashtag: string;
  totalPosts: number;
  avgLikes: number;
  avgComments: number;
  avgReach: number;
  topPost: {
    mediaId: string;
    likes: number;
    comments: number;
  };
}
```

**Example:**

```typescript
const performance = await instagram.getHashtagPerformance('marketing');

console.log(`#${performance.hashtag}:`);
console.log(`Total posts: ${performance.totalPosts}`);
console.log(`Avg likes: ${performance.avgLikes.toFixed(0)}`);
console.log(`Top post: ${performance.topPost.mediaId}`);
```

#### `handleHashtags(caption: string, maxHashtags: number = 30): string[]`

Extract and optimize hashtags from caption.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `caption` | `string` | - | Caption with hashtags |
| `maxHashtags` | `number` | `30` | Max hashtags (Instagram limit) |

**Returns:** Array of hashtag strings (without #)

**Example:**

```typescript
const caption = 'Amazing product! #fitness #health #wellness #gym #workout';
const hashtags = instagram.handleHashtags(caption, 30);

console.log('Extracted hashtags:', hashtags);
// ['fitness', 'health', 'wellness', 'gym', 'workout']
```

---

## Examples

### Complete Posting Workflow

```typescript
import { InstagramAutomation } from './automation/InstagramAutomation';

async function postWithAnalytics() {
  const instagram = new InstagramAutomation({
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN!,
    businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!
  });

  // Post content
  const mediaId = await instagram.postFeed({
    imageUrl: 'https://example.com/product.jpg',
    caption: 'New product launch! 🚀 #newproduct #launch',
    location: 'San Francisco, CA'
  });

  console.log('Posted:', mediaId);

  // Wait 1 hour
  await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000));

  // Check performance
  const [metrics] = await instagram.trackMetrics([mediaId]);
  console.log('Performance:');
  console.log(`  Likes: ${metrics.likes}`);
  console.log(`  Comments: ${metrics.comments}`);
  console.log(`  Engagement: ${(metrics.engagement * 100).toFixed(2)}%`);
}
```

### Automated Engagement Campaign

```typescript
async function engagementCampaign() {
  const instagram = new InstagramAutomation({...});

  // Set up auto-reply rules
  instagram.setAutoReplyRules([
    {
      trigger: 'price',
      response: 'DM us for pricing! 💰',
      caseSensitive: false
    },
    {
      trigger: 'where to buy',
      response: 'Available on our website: https://store.com 🛒',
      caseSensitive: false
    }
  ]);

  // Post content
  const mediaId = await instagram.postFeed({
    imageUrl: 'https://example.com/product.jpg',
    caption: 'Limited time offer! Comment "price" for details 💬'
  });

  // Monitor and auto-reply every 5 minutes
  setInterval(async () => {
    const replies = await instagram.autoReply(mediaId);
    console.log(`Sent ${replies} auto-replies`);
  }, 5 * 60 * 1000);
}
```

### Weekly Content Schedule

```typescript
async function scheduleWeeklyContent() {
  const instagram = new InstagramAutomation({...});

  const now = new Date();
  const schedules = [];

  // Schedule posts for next 7 days at 10 AM and 4 PM
  for (let day = 1; day <= 7; day++) {
    // Morning post (10 AM)
    const morning = new Date(now);
    morning.setDate(now.getDate() + day);
    morning.setHours(10, 0, 0, 0);

    schedules.push({
      scheduledTime: morning,
      mediaType: 'image' as const,
      imageUrl: `https://example.com/day${day}-morning.jpg`,
      caption: `Day ${day} motivation! ☀️ #motivation #daily`
    });

    // Afternoon post (4 PM)
    const afternoon = new Date(morning);
    afternoon.setHours(16, 0, 0, 0);

    schedules.push({
      scheduledTime: afternoon,
      mediaType: 'carousel' as const,
      media: [
        { type: 'image' as const, url: `https://example.com/day${day}-1.jpg` },
        { type: 'image' as const, url: `https://example.com/day${day}-2.jpg` }
      ],
      caption: `Day ${day} highlights! 📸 #daily #content`
    });
  }

  const scheduled = await instagram.schedulePosts(schedules);
  console.log(`Scheduled ${scheduled.length} posts for the week!`);
}
```

### Performance Dashboard

```typescript
async function performanceDashboard() {
  const instagram = new InstagramAutomation({...});

  // Get account metrics
  const weeklyMetrics = await instagram.getAccountMetrics('week');

  console.log('=== Weekly Performance ===');
  console.log(`Followers: ${weeklyMetrics.followers.toLocaleString()}`);
  console.log(`Reach: ${weeklyMetrics.reach.toLocaleString()}`);
  console.log(`Engagement: ${(weeklyMetrics.engagement * 100).toFixed(2)}%`);

  // Get top posts
  const topPosts = await instagram.getTopPosts(5, 'engagement');

  console.log('\n=== Top 5 Posts ===');
  topPosts.forEach((post, i) => {
    console.log(`${i + 1}. ${post.mediaId}`);
    console.log(`   Likes: ${post.likes.toLocaleString()}`);
    console.log(`   Engagement: ${(post.engagement * 100).toFixed(2)}%`);
  });

  // Analyze hashtag performance
  const hashtagPerf = await instagram.getHashtagPerformance('marketing');

  console.log('\n=== Hashtag Analysis ===');
  console.log(`#${hashtagPerf.hashtag}`);
  console.log(`Total posts: ${hashtagPerf.totalPosts}`);
  console.log(`Avg likes: ${hashtagPerf.avgLikes.toFixed(0)}`);
}
```

---

## Error Handling

### Common Errors

```typescript
try {
  await instagram.postFeed({...});
} catch (error) {
  if (error.message.includes('Invalid access token')) {
    // Token expired or invalid
    console.error('Authentication failed. Refresh access token.');
  } else if (error.message.includes('rate limit')) {
    // Too many requests
    console.error('Rate limit exceeded. Wait before retrying.');
  } else if (error.message.includes('Invalid media')) {
    // Media format or size issue
    console.error('Media file issue. Check format and size.');
  } else {
    console.error('Post failed:', error.message);
  }
}
```

### Retry Logic

```typescript
async function postWithRetry(
  instagram: InstagramAutomation,
  options: MediaPostOptions,
  maxRetries = 3
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await instagram.postFeed(options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      console.log(`Retry ${i + 1}/${maxRetries}...`);
      await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Best Practices

### 1. Content Guidelines

- **Image specs**: 1080x1080 (1:1), 1080x1350 (4:5), 1080x566 (1.91:1)
- **Video specs**: 1080x1920 (9:16 for Reels), max 1 GB
- **Captions**: Max 2,200 characters
- **Hashtags**: 3-5 relevant hashtags (avoid max 30)
- **Posting frequency**: 1-2 posts per day optimal

### 2. Security

- ✅ Never commit access tokens
- ✅ Use environment variables
- ✅ Refresh tokens regularly (60-day expiry)
- ✅ Use short-lived tokens for production
- ✅ Implement token encryption

### 3. Performance

- ✅ Batch operations when possible
- ✅ Add delays between API calls (rate limiting)
- ✅ Cache frequently accessed data
- ✅ Monitor API quota usage
- ✅ Implement exponential backoff

### 4. Engagement

- ✅ Post at optimal times (use Instagram Insights)
- ✅ Respond to comments quickly
- ✅ Use auto-reply for common questions
- ✅ Analyze hashtag performance
- ✅ Track engagement metrics

### 5. Compliance

- ✅ Follow Instagram Community Guidelines
- ✅ Don't spam or use bots for fake engagement
- ✅ Respect copyright and attribution
- ✅ Provide accurate product information
- ✅ Disclose sponsored content (#ad #sponsored)

---

## API Limits

### Rate Limits

- **API calls**: 200 calls per hour per user
- **Graph API**: 4,800 calls per user per 24 hours
- **Publishing**: 25 posts per day
- **Scheduled posts**: 25 scheduled at once

### Content Limits

- **Images**: Max 8 MB
- **Videos**: Max 1 GB, 3-90 seconds
- **Carousels**: 2-10 items
- **Hashtags**: Max 30 per post
- **Caption**: Max 2,200 characters

---

## Support

### Documentation

- Instagram Graph API: https://developers.facebook.com/docs/instagram-api
- Content Publishing: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
- Insights: https://developers.facebook.com/docs/instagram-api/guides/insights

### Setup Guide

- [INSTAGRAM_SETUP.md](./INSTAGRAM_SETUP.md)

### Examples

- [instagram-automation-example.ts](../examples/instagram-automation-example.ts)

---

## License

MIT License - See LICENSE file for details

---

**Happy Automating! 🚀📸**
