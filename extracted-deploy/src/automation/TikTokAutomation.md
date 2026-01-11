# TikTok Automation API Documentation

Complete TikTok API automation system for content creators and social media managers.

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

The `TikTokAutomation` class provides a production-ready automation system for TikTok using the official TikTok API for Developers. It supports video uploads, scheduling, analytics, and engagement automation.

### Features

- ✅ **Video Upload**: Upload videos with full metadata
- ✅ **Scheduling**: Schedule videos up to 10 days in advance
- ✅ **Captions**: Auto-caption support
- ✅ **Duet/Stitch**: Control collaboration settings
- ✅ **Multi-Account**: Post to multiple accounts
- ✅ **Analytics**: Track performance metrics
- ✅ **Auto-Engagement**: Automated likes, comments, follows
- ✅ **OAuth Authentication**: Secure token management
- ✅ **Rate Limiting**: Built-in API quota management

### Requirements

- TikTok Developer account
- Registered TikTok app
- TikTok API access (Content Posting API)
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

### Setup TikTok App

1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Create new app
3. Add Content Posting API product
4. Configure OAuth settings
5. Get Client Key and Client Secret

**See full setup guide**: [TIKTOK_SETUP.md](./TIKTOK_SETUP.md)

### Initialize Client

```typescript
import { TikTokAutomation } from './automation/TikTokAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

const tiktok = new TikTokAutomation({
  clientKey: process.env.TIKTOK_CLIENT_KEY!,
  clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
  accessToken: process.env.TIKTOK_ACCESS_TOKEN,
  refreshToken: process.env.TIKTOK_REFRESH_TOKEN,
  redirectUri: 'http://localhost:3000/callback'
});
```

---

## Quick Start

### Upload a Video

```typescript
// Upload video to TikTok
const publishId = await tiktok.uploadVideo({
  videoPath: './my-video.mp4',
  title: 'Check out this amazing content!',
  description: 'Follow for more! 🚀',
  hashtags: ['fyp', 'viral', 'trending'],
  privacyLevel: 'PUBLIC_TO_EVERYONE',
  duetDisabled: false,
  stitchDisabled: false
});

console.log('Video published:', publishId);
```

### Schedule Videos

```typescript
// Schedule videos for future posting
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(18, 0, 0, 0); // 6 PM tomorrow

const publishIds = await tiktok.scheduleVideos([
  {
    videoPath: './video1.mp4',
    title: 'Part 1 of my series!',
    hashtags: ['series', 'part1'],
    scheduledTime: tomorrow
  },
  {
    videoPath: './video2.mp4',
    title: 'Part 2 coming soon!',
    hashtags: ['series', 'part2'],
    scheduledTime: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
  }
]);

console.log('Scheduled:', publishIds.length, 'videos');
```

### Track Analytics

```typescript
// Get video analytics
const analytics = await tiktok.trackAnalytics(['video_id_1', 'video_id_2']);

analytics.forEach(a => {
  console.log(`${a.videoId}:`);
  console.log(`  Views: ${a.views.toLocaleString()}`);
  console.log(`  Likes: ${a.likes.toLocaleString()}`);
  console.log(`  Engagement: ${(a.engagement * 100).toFixed(2)}%`);
});
```

---

## API Reference

### Constructor

```typescript
new TikTokAutomation(config: TikTokConfig)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config.clientKey` | `string` | Yes | TikTok App Client Key |
| `config.clientSecret` | `string` | Yes | TikTok App Client Secret |
| `config.accessToken` | `string` | No | User access token |
| `config.refreshToken` | `string` | No | Refresh token |
| `config.redirectUri` | `string` | No | OAuth redirect URI |

### Video Upload

#### `uploadVideo(options: VideoUploadOptions): Promise<string>`

Upload a video to TikTok.

**Parameters:**

```typescript
interface VideoUploadOptions {
  videoPath: string;           // Local video file path
  title: string;               // Video title
  description?: string;        // Video description
  hashtags?: string[];         // Hashtags (max 30)
  privacyLevel?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
  commentDisabled?: boolean;   // Disable comments
  duetDisabled?: boolean;      // Disable duets
  stitchDisabled?: boolean;    // Disable stitches
  coverTimestamp?: number;     // Cover frame time (seconds)
  brandContentToggle?: boolean; // Brand content flag
  brandOrganicToggle?: boolean;
}
```

**Returns:** Publish ID (string)

**Video Requirements:**
- Format: MP4, MOV, AVI, WebM
- Max size: 4 GB
- Min duration: 3 seconds
- Max duration: 10 minutes
- Aspect ratio: 9:16 (recommended)
- Resolution: 1080x1920 (recommended)

**Example:**

```typescript
const publishId = await tiktok.uploadVideo({
  videoPath: './tutorial.mp4',
  title: 'How to make viral TikTok content!',
  description: 'Follow these tips for viral videos 🚀',
  hashtags: ['fyp', 'viral', 'tutorial', 'contentcreator'],
  privacyLevel: 'PUBLIC_TO_EVERYONE',
  commentDisabled: false,
  duetDisabled: false,
  stitchDisabled: false,
  brandContentToggle: false
});
```

### Scheduling

#### `scheduleVideos(schedules: VideoScheduleOptions[]): Promise<string[]>`

Schedule multiple videos for future posting.

**Parameters:**

```typescript
interface VideoScheduleOptions {
  videoPath: string;
  title: string;
  description?: string;
  hashtags?: string[];
  scheduledTime: Date;         // 15 min - 10 days future
  privacyLevel?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
}
```

**Returns:** Array of publish IDs

**Limits:**
- Min: 15 minutes in future
- Max: 10 days in future
- Max scheduled posts: varies by account

**Example:**

```typescript
const now = new Date();
const schedules = [];

// Schedule 7 videos, one per day at 6 PM
for (let i = 0; i < 7; i++) {
  const postTime = new Date(now);
  postTime.setDate(now.getDate() + i + 1);
  postTime.setHours(18, 0, 0, 0);

  schedules.push({
    videoPath: `./day-${i + 1}.mp4`,
    title: `Day ${i + 1} of my challenge!`,
    hashtags: ['challenge', 'day' + (i + 1)],
    scheduledTime: postTime
  });
}

const publishIds = await tiktok.scheduleVideos(schedules);
console.log(`Scheduled ${publishIds.length} videos`);
```

### Captions

#### `addCaptions(publishId: string, captions: CaptionOptions[]): Promise<void>`

Add or configure captions for a video.

**Parameters:**

```typescript
interface CaptionOptions {
  text: string;
  position?: {
    x: number;  // 0-1
    y: number;  // 0-1
  };
  duration?: {
    start: number;  // seconds
    end: number;    // seconds
  };
  style?: {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    fontFamily?: string;
  };
}
```

**Note:** TikTok automatically generates captions. This method is for reference. Manual captions should be added during video editing.

**Example:**

```typescript
await tiktok.addCaptions('publish_id', [
  {
    text: 'Welcome to my channel!',
    duration: { start: 0, end: 3 },
    style: {
      fontSize: 24,
      color: '#FFFFFF',
      backgroundColor: '#000000'
    }
  },
  {
    text: 'Like and follow!',
    duration: { start: 57, end: 60 }
  }
]);
```

### Duet/Stitch Settings

#### `enableDuetStitch(publishId: string, settings: DuetStitchSettings): Promise<void>`

Enable or disable duet and stitch features.

**Parameters:**

```typescript
interface DuetStitchSettings {
  duetEnabled: boolean;
  stitchEnabled: boolean;
}
```

**Example:**

```typescript
// Enable duet and stitch
await tiktok.enableDuetStitch('publish_id', {
  duetEnabled: true,
  stitchEnabled: true
});

// Disable both
await tiktok.enableDuetStitch('publish_id', {
  duetEnabled: false,
  stitchEnabled: false
});
```

### Multi-Account Posting

#### `postToMultipleAccounts(options: MultiAccountPostOptions): Promise<Result[]>`

Post same video to multiple TikTok accounts.

**Parameters:**

```typescript
interface MultiAccountPostOptions {
  accounts: Array<{
    accessToken: string;
    openId: string;
  }>;
  videoPath: string;
  title: string;
  description?: string;
  hashtags?: string[];
  delayBetweenPosts?: number;  // milliseconds
}
```

**Returns:**

```typescript
Array<{
  openId: string;
  publishId: string;
  success: boolean;
  error?: string;
}>
```

**Example:**

```typescript
const results = await tiktok.postToMultipleAccounts({
  accounts: [
    {
      accessToken: 'token_account_1',
      openId: 'user_1'
    },
    {
      accessToken: 'token_account_2',
      openId: 'user_2'
    },
    {
      accessToken: 'token_account_3',
      openId: 'user_3'
    }
  ],
  videoPath: './viral-content.mp4',
  title: 'Check this out!',
  hashtags: ['fyp', 'viral'],
  delayBetweenPosts: 5000  // 5 seconds between posts
});

results.forEach(r => {
  if (r.success) {
    console.log(`✅ Posted to ${r.openId}: ${r.publishId}`);
  } else {
    console.log(`❌ Failed for ${r.openId}: ${r.error}`);
  }
});
```

### Analytics

#### `trackAnalytics(videoIds: string[]): Promise<VideoAnalytics[]>`

Get performance metrics for videos.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `videoIds` | `string[]` | Array of video IDs |

**Returns:** Array of VideoAnalytics

```typescript
interface VideoAnalytics {
  videoId: string;
  createTime: number;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  playTime: number;        // Total watch time
  avgWatchTime: number;    // Average watch time
  completionRate: number;  // 0-1
  engagement: number;      // 0-1
  reach: number;           // Unique viewers
}
```

**Example:**

```typescript
const analytics = await tiktok.trackAnalytics([
  'video_1',
  'video_2',
  'video_3'
]);

analytics.forEach(a => {
  console.log(`\n${a.title}`);
  console.log(`  Views: ${a.views.toLocaleString()}`);
  console.log(`  Likes: ${a.likes.toLocaleString()}`);
  console.log(`  Comments: ${a.comments.toLocaleString()}`);
  console.log(`  Shares: ${a.shares.toLocaleString()}`);
  console.log(`  Engagement: ${(a.engagement * 100).toFixed(2)}%`);
  console.log(`  Completion: ${(a.completionRate * 100).toFixed(0)}%`);
});
```

#### `getAccountAnalytics(period?: 'day' | 'week' | 'month'): Promise<AccountAnalytics>`

Get account-level analytics.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | `'day' \| 'week' \| 'month'` | `'week'` | Time period |

**Returns:** AccountAnalytics

```typescript
interface AccountAnalytics {
  followers: number;
  following: number;
  totalVideos: number;
  totalLikes: number;
  totalViews: number;
  avgEngagement: number;
  followerGrowth: number;
  period: string;
}
```

**Example:**

```typescript
const weeklyStats = await tiktok.getAccountAnalytics('week');

console.log('Weekly Performance:');
console.log(`  Followers: ${weeklyStats.followers.toLocaleString()}`);
console.log(`  Total Videos: ${weeklyStats.totalVideos}`);
console.log(`  Total Views: ${weeklyStats.totalViews.toLocaleString()}`);
console.log(`  Avg Engagement: ${(weeklyStats.avgEngagement * 100).toFixed(2)}%`);
```

#### `getTopVideos(limit?: number, sortBy?: 'views' | 'likes' | 'engagement'): Promise<VideoAnalytics[]>`

Get top performing videos.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `number` | `10` | Number of videos |
| `sortBy` | `'views' \| 'likes' \| 'engagement'` | `'views'` | Sort criteria |

**Returns:** Array of VideoAnalytics

**Example:**

```typescript
const topVideos = await tiktok.getTopVideos(5, 'engagement');

console.log('Top 5 Videos by Engagement:');
topVideos.forEach((video, i) => {
  console.log(`${i + 1}. ${video.title}`);
  console.log(`   Views: ${video.views.toLocaleString()}`);
  console.log(`   Engagement: ${(video.engagement * 100).toFixed(2)}%`);
});
```

### Auto-Engagement

#### `setAutoEngageRules(rules: AutoEngageRule[]): void`

Configure automatic engagement rules.

**Parameters:**

```typescript
interface AutoEngageRule {
  hashtag?: string;            // Target hashtag
  keyword?: string;            // Target keyword
  action: 'like' | 'comment' | 'follow';
  maxPerHour?: number;         // Rate limit
  commentTemplates?: string[]; // For comment action
}
```

**Example:**

```typescript
tiktok.setAutoEngageRules([
  {
    hashtag: 'fitness',
    action: 'like',
    maxPerHour: 30
  },
  {
    keyword: 'workout',
    action: 'comment',
    maxPerHour: 20,
    commentTemplates: [
      'Great content! 💪',
      'Love this! 🔥',
      'Amazing workout! 💯'
    ]
  },
  {
    hashtag: 'fitnesscoach',
    action: 'follow',
    maxPerHour: 10
  }
]);
```

#### `autoEngage(): Promise<{ likes: number; comments: number; follows: number }>`

Execute auto-engagement based on configured rules.

**Returns:** Engagement statistics

**Example:**

```typescript
const stats = await tiktok.autoEngage();

console.log('Auto-Engagement Results:');
console.log(`  Likes: ${stats.likes}`);
console.log(`  Comments: ${stats.comments}`);
console.log(`  Follows: ${stats.follows}`);
```

### Video Info

#### `getVideoInfo(publishId: string): Promise<VideoInfo>`

Get detailed video information.

**Example:**

```typescript
const info = await tiktok.getVideoInfo('publish_id');

console.log('Video Info:');
console.log(`  Title: ${info.title}`);
console.log(`  Duration: ${info.duration}s`);
console.log(`  Share URL: ${info.shareUrl}`);
console.log(`  Embed: ${info.embedLink}`);
```

#### `getVideoList(maxCount?: number): Promise<VideoInfo[]>`

Get list of user's videos.

**Example:**

```typescript
const videos = await tiktok.getVideoList(50);

console.log(`Found ${videos.length} videos`);
videos.forEach(v => {
  console.log(`  ${v.title} - ${v.duration}s`);
});
```

---

## Examples

### Complete Upload Workflow

```typescript
async function uploadWithAnalytics() {
  const tiktok = new TikTokAutomation({...});

  // Upload video
  const publishId = await tiktok.uploadVideo({
    videoPath: './my-content.mp4',
    title: 'My viral video!',
    hashtags: ['fyp', 'viral', 'trending']
  });

  console.log('Uploaded:', publishId);

  // Wait 1 hour
  await new Promise(r => setTimeout(r, 60 * 60 * 1000));

  // Check performance
  const [analytics] = await tiktok.trackAnalytics([publishId]);

  console.log('Performance:');
  console.log(`  Views: ${analytics.views.toLocaleString()}`);
  console.log(`  Engagement: ${(analytics.engagement * 100).toFixed(2)}%`);
}
```

### Automated Content Schedule

```typescript
async function scheduleWeeklyContent() {
  const tiktok = new TikTokAutomation({...});

  const now = new Date();
  const schedules = [];

  // Post daily at 6 PM for next week
  for (let day = 1; day <= 7; day++) {
    const postTime = new Date(now);
    postTime.setDate(now.getDate() + day);
    postTime.setHours(18, 0, 0, 0);

    schedules.push({
      videoPath: `./content/day-${day}.mp4`,
      title: `Day ${day} of my 7-day challenge!`,
      hashtags: ['challenge', '7daychallenge', 'fyp'],
      scheduledTime: postTime
    });
  }

  const publishIds = await tiktok.scheduleVideos(schedules);
  console.log(`Scheduled ${publishIds.length} videos for the week!`);
}
```

### Multi-Account Campaign

```typescript
async function multiAccountCampaign() {
  const tiktok = new TikTokAutomation({...});

  const results = await tiktok.postToMultipleAccounts({
    accounts: [
      { accessToken: 'token1', openId: 'account1' },
      { accessToken: 'token2', openId: 'account2' },
      { accessToken: 'token3', openId: 'account3' }
    ],
    videoPath: './campaign-video.mp4',
    title: 'Big announcement! 🎉',
    hashtags: ['announcement', 'news'],
    delayBetweenPosts: 10000
  });

  const successful = results.filter(r => r.success).length;
  console.log(`Posted to ${successful}/${results.length} accounts`);
}
```

---

## Error Handling

### Common Errors

```typescript
try {
  await tiktok.uploadVideo({...});
} catch (error) {
  if (error.message.includes('Invalid access token')) {
    // Token expired
    await tiktok.refreshAccessToken();
  } else if (error.message.includes('rate limit')) {
    // Too many requests
    console.error('Rate limit exceeded. Wait before retry.');
  } else if (error.message.includes('file not found')) {
    // Video file issue
    console.error('Check video file path');
  } else {
    console.error('Upload failed:', error.message);
  }
}
```

### Retry Logic

```typescript
async function uploadWithRetry(
  tiktok: TikTokAutomation,
  options: VideoUploadOptions,
  maxRetries = 3
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await tiktok.uploadVideo(options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      console.log(`Retry ${i + 1}/${maxRetries}...`);
      await new Promise(r => setTimeout(r, 5000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Best Practices

### 1. Content Guidelines

- **Video specs**: 1080x1920 (9:16), MP4 format
- **Duration**: 15-60 seconds optimal
- **File size**: Under 287 MB recommended
- **Captions**: Use auto-captions for accessibility
- **Hashtags**: 3-5 relevant hashtags
- **Posting time**: Peak hours (6-10 PM local time)

### 2. Security

- ✅ Never commit access tokens
- ✅ Use environment variables
- ✅ Refresh tokens regularly
- ✅ Implement token encryption
- ✅ Monitor API usage

### 3. Performance

- ✅ Schedule posts for peak times
- ✅ Add delays between operations
- ✅ Monitor analytics daily
- ✅ A/B test content
- ✅ Respond to comments

### 4. Engagement

- ✅ Post consistently (1-3 times daily)
- ✅ Use trending sounds
- ✅ Engage with comments
- ✅ Collaborate with others (duet/stitch)
- ✅ Analyze top performers

### 5. Compliance

- ✅ Follow TikTok Community Guidelines
- ✅ Respect copyright (music, content)
- ✅ Don't spam or use bots
- ✅ Disclose sponsored content
- ✅ Age-appropriate content

---

## API Limits

### Rate Limits

- **API calls**: 1000 calls per day (varies by endpoint)
- **Video uploads**: No official limit (respect rate limiting)
- **Engagement**: Limited to prevent spam

### Content Limits

- **Video size**: Max 4 GB
- **Duration**: 3 seconds - 10 minutes
- **Hashtags**: Max 30
- **Caption**: Max 2200 characters
- **Schedule**: 15 min - 10 days future

---

## Support

### Documentation

- TikTok API: https://developers.tiktok.com/doc
- Content Posting: https://developers.tiktok.com/doc/content-posting-api-get-started
- Login Kit: https://developers.tiktok.com/doc/login-kit-web

### Setup Guide

- [TIKTOK_SETUP.md](./TIKTOK_SETUP.md)

### Examples

- [tiktok-automation-example.ts](../examples/tiktok-automation-example.ts)

---

## License

MIT License - See LICENSE file for details

---

**Happy Creating! 🎵🎬**
