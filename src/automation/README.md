# Automation Systems

Production-ready automation systems for content creators and digital businesses.

## Available Automation Systems

### 1. YouTube Automation 🎥

**File**: `YouTubeAutomation.ts`

Comprehensive YouTube automation using Google YouTube Data API v3.

**Features:**
- ✅ Video uploads with full metadata
- ✅ Batch uploads with rate limiting
- ✅ Video scheduling
- ✅ Bulk metadata updates
- ✅ Playlist management
- ✅ Performance analytics
- ✅ OAuth2 authentication
- ✅ Token refresh mechanism

**Quick Start:**
```typescript
import { YouTubeAutomation } from './automation/YouTubeAutomation';

const youtube = new YouTubeAutomation({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost:3000/oauth2callback',
  accessToken: 'your-access-token',
  refreshToken: 'your-refresh-token'
});

// Upload video
const videoId = await youtube.uploadVideo(
  './video.mp4',
  {
    title: 'My Video',
    description: 'Video description',
    privacyStatus: 'public',
    madeForKids: false
  }
);
```

**Documentation:**
- 📚 [Full Documentation](./YouTubeAutomation.md)
- 🚀 [Setup Guide](./YOUTUBE_SETUP.md)
- 💡 [Examples](../examples/youtube-automation-example.ts)

---

### 2. Instagram Automation 📸

**File**: `InstagramAutomation.ts`

Comprehensive Instagram automation using Instagram Graph API.

**Features:**
- ✅ Feed posts (images and carousels)
- ✅ Reels posting
- ✅ Stories with links
- ✅ Post scheduling
- ✅ Auto-reply to comments
- ✅ Performance tracking
- ✅ Hashtag research and optimization
- ✅ OAuth authentication

**Quick Start:**
```typescript
import { InstagramAutomation } from './automation/InstagramAutomation';

const instagram = new InstagramAutomation({
  accessToken: 'your-access-token',
  businessAccountId: 'your-business-account-id'
});

// Post image
const mediaId = await instagram.postFeed({
  imageUrl: 'https://example.com/image.jpg',
  caption: 'Check out my post! #instagram #automation',
  location: 'San Francisco, CA'
});
```

**Documentation:**
- 📚 [Full Documentation](./InstagramAutomation.md)
- 🚀 [Setup Guide](./INSTAGRAM_SETUP.md)
- 💡 [Examples](../examples/instagram-automation-example.ts)

---

### 3. TikTok Automation 🎵

**File**: `TikTokAutomation.ts`

Comprehensive TikTok automation using TikTok API for Developers.

**Features:**
- ✅ Video uploads with full metadata
- ✅ Video scheduling (up to 10 days)
- ✅ Auto-caption support
- ✅ Duet/Stitch control
- ✅ Multi-account posting
- ✅ Performance analytics
- ✅ Auto-engagement (likes, comments, follows)
- ✅ OAuth authentication

**Quick Start:**
```typescript
import { TikTokAutomation } from './automation/TikTokAutomation';

const tiktok = new TikTokAutomation({
  clientKey: 'your-client-key',
  clientSecret: 'your-client-secret',
  accessToken: 'your-access-token'
});

// Upload video
const publishId = await tiktok.uploadVideo({
  videoPath: './video.mp4',
  title: 'Check this out!',
  hashtags: ['fyp', 'viral', 'trending'],
  privacyLevel: 'PUBLIC_TO_EVERYONE'
});
```

**Documentation:**
- 📚 [Full Documentation](./TikTokAutomation.md)
- 🚀 [Setup Guide](./TIKTOK_SETUP.md)
- 💡 [Examples](../examples/tiktok-automation-example.ts)

---

### 4. Pinterest Automation 📍

**File**: `PinterestAutomation.ts`

**E-COMMERCE PRIORITY** - Drive massive traffic and sales with Pinterest automation.

**Features:**
- ✅ Product pins with pricing & availability
- ✅ Shopping catalog bulk upload
- ✅ Traffic analytics & tracking
- ✅ Viral pin identification
- ✅ SEO optimization (keywords, hashtags)
- ✅ Board management
- ✅ Pin scheduling
- ✅ Conversion optimization
- ✅ OAuth authentication

**Quick Start:**
```typescript
import { PinterestAutomation } from './automation/PinterestAutomation';

const pinterest = new PinterestAutomation({
  accessToken: 'your-access-token',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

// Create optimized product pin
const pinId = await pinterest.optimizeForShopping({
  boardId: 'your-board-id',
  imageUrl: 'https://yourstore.com/product.jpg',
  title: 'Organic Cotton T-Shirt',
  link: 'https://yourstore.com/products/tshirt',
  price: 29.99,
  salePrice: 19.99,
  availability: 'IN_STOCK'
}, {
  usePriceInTitle: true,
  addUrgency: true,
  targetKeywords: ['organic clothing']
});
```

**Why Pinterest for E-Commerce:**
- 📊 83% of users made purchases based on Pins
- 💰 50% higher average order value
- 🚀 Long-term traffic (80% engagement after publishing)
- 🎯 97% unbranded searches (discovery intent)

**Documentation:**
- 📚 [Full Documentation](./PinterestAutomation.md)
- 🚀 [Setup Guide](./PINTEREST_SETUP.md)
- 💡 [Examples](../examples/pinterest-automation-example.ts)

---

## Installation

### Install Dependencies

```bash
# Install all automation dependencies
npm install

# Or install specific packages
npm install googleapis  # YouTube automation
npm install axios form-data  # Instagram automation
```

### Environment Setup

Create `.env` file:

```env
# YouTube Automation
YOUTUBE_CLIENT_ID=your-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your-client-secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/oauth2callback
YOUTUBE_ACCESS_TOKEN=your-access-token
YOUTUBE_REFRESH_TOKEN=your-refresh-token

# Instagram Automation
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-business-account-id

# TikTok Automation
TIKTOK_CLIENT_KEY=your-tiktok-client-key
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
TIKTOK_REDIRECT_URI=http://localhost:3000/callback
TIKTOK_ACCESS_TOKEN=your-access-token
TIKTOK_REFRESH_TOKEN=your-refresh-token

# Pinterest Automation
PINTEREST_CLIENT_ID=your-pinterest-client-id
PINTEREST_CLIENT_SECRET=your-pinterest-client-secret
PINTEREST_REDIRECT_URI=https://yourdomain.com/auth/pinterest/callback
PINTEREST_ACCESS_TOKEN=your-access-token
PINTEREST_REFRESH_TOKEN=your-refresh-token
```

---

## Usage Examples

### YouTube Video Upload

```typescript
import { YouTubeAutomation } from './automation/YouTubeAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

async function uploadVideo() {
  const youtube = new YouTubeAutomation({
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    redirectUri: process.env.YOUTUBE_REDIRECT_URI!,
    accessToken: process.env.YOUTUBE_ACCESS_TOKEN,
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN
  });

  const videoId = await youtube.uploadVideo(
    './my-video.mp4',
    {
      title: 'Amazing Tutorial',
      description: 'Learn how to...',
      tags: ['tutorial', 'education'],
      categoryId: '27', // Education
      privacyStatus: 'public',
      madeForKids: false,
      thumbnail: './thumbnail.jpg'
    }
  );

  console.log('Uploaded:', videoId);
}

uploadVideo().catch(console.error);
```

### Batch Upload with Scheduling

```typescript
async function batchUploadAndSchedule() {
  const youtube = new YouTubeAutomation({...});

  // Upload videos
  const videos = [
    {
      path: './video1.mp4',
      options: {
        title: 'Part 1',
        description: 'First video',
        privacyStatus: 'private' as const,
        madeForKids: false
      }
    },
    {
      path: './video2.mp4',
      options: {
        title: 'Part 2',
        description: 'Second video',
        privacyStatus: 'private' as const,
        madeForKids: false
      }
    }
  ];

  const videoIds = await youtube.uploadVideoBatch(videos, 5000);

  // Schedule for publication
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await youtube.scheduleVideos(
    videoIds.map((videoId, index) => ({
      videoId,
      publishAt: new Date(tomorrow.getTime() + index * 24 * 60 * 60 * 1000),
      notifySubscribers: true
    }))
  );

  console.log('Videos uploaded and scheduled!');
}
```

### Create Playlist and Add Videos

```typescript
async function createPlaylistWithVideos() {
  const youtube = new YouTubeAutomation({...});

  // Create playlist
  const playlistId = await youtube.createPlaylist({
    title: 'My Tutorial Series',
    description: 'Complete series of tutorials',
    privacyStatus: 'public'
  });

  // Upload videos and add to playlist
  const videoIds = await youtube.uploadVideoBatch([...]);
  await youtube.addToPlaylist(playlistId, videoIds);

  console.log('Playlist created and populated!');
}
```

### Track Performance

```typescript
async function trackVideoPerformance() {
  const youtube = new YouTubeAutomation({...});

  // Get statistics for multiple videos
  const analytics = await youtube.trackPerformance([
    'video1',
    'video2',
    'video3'
  ]);

  analytics.forEach(stats => {
    console.log(`${stats.videoId}:`);
    console.log(`  Views: ${stats.views.toLocaleString()}`);
    console.log(`  Likes: ${stats.likes.toLocaleString()}`);
    console.log(`  Comments: ${stats.comments.toLocaleString()}`);
  });

  // Get channel statistics
  const channelStats = await youtube.getChannelStatistics();
  console.log('Channel:', channelStats);

  // Get top videos
  const topVideos = await youtube.getTopVideos(10);
  console.log('Top 10:', topVideos);
}
```

### Instagram Feed Post

```typescript
import { InstagramAutomation } from './automation/InstagramAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

async function postToInstagram() {
  const instagram = new InstagramAutomation({
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN!,
    businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!
  });

  const mediaId = await instagram.postFeed({
    imageUrl: 'https://example.com/product.jpg',
    caption: 'Check out our new product! 🚀 #product #launch',
    location: 'San Francisco, CA'
  });

  console.log('Posted:', mediaId);
}

postToInstagram().catch(console.error);
```

### Schedule Instagram Content

```typescript
async function scheduleInstagramPosts() {
  const instagram = new InstagramAutomation({...});

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const scheduled = await instagram.schedulePosts([
    {
      scheduledTime: tomorrow,
      mediaType: 'image',
      imageUrl: 'https://example.com/morning.jpg',
      caption: 'Good morning! ☀️ #morning #motivation'
    },
    {
      scheduledTime: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000),
      mediaType: 'carousel',
      media: [
        { type: 'image', url: 'https://example.com/img1.jpg' },
        { type: 'image', url: 'https://example.com/img2.jpg' }
      ],
      caption: 'Afternoon highlights! 📸 #content'
    }
  ]);

  console.log('Scheduled:', scheduled.length, 'posts');
}
```

### Auto-Reply and Track Performance

```typescript
async function autoEngagement() {
  const instagram = new InstagramAutomation({...});

  // Set up auto-reply
  instagram.setAutoReplyRules([
    {
      trigger: 'price',
      response: 'Check our website: https://mystore.com 💰',
      caseSensitive: false
    }
  ]);

  // Post and monitor
  const mediaId = await instagram.postFeed({
    imageUrl: 'https://example.com/product.jpg',
    caption: 'New product! Comment "price" for details 💬'
  });

  // Auto-reply to comments
  const repliesCount = await instagram.autoReply(mediaId);
  console.log(`Sent ${repliesCount} auto-replies`);

  // Track performance
  const [metrics] = await instagram.trackMetrics([mediaId]);
  console.log('Performance:', metrics);
}
```

### TikTok Video Upload

```typescript
import { TikTokAutomation } from './automation/TikTokAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

async function uploadToTikTok() {
  const tiktok = new TikTokAutomation({
    clientKey: process.env.TIKTOK_CLIENT_KEY!,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
    accessToken: process.env.TIKTOK_ACCESS_TOKEN!
  });

  const publishId = await tiktok.uploadVideo({
    videoPath: './my-video.mp4',
    title: 'Check out this viral content!',
    hashtags: ['fyp', 'viral', 'trending'],
    privacyLevel: 'PUBLIC_TO_EVERYONE',
    duetDisabled: false,
    stitchDisabled: false
  });

  console.log('Posted:', publishId);
}

uploadToTikTok().catch(console.error);
```

### Schedule TikTok Videos

```typescript
async function scheduleTikTokContent() {
  const tiktok = new TikTokAutomation({...});

  const now = new Date();
  const schedules = [];

  // Schedule videos for next 7 days at 6 PM
  for (let day = 1; day <= 7; day++) {
    const postTime = new Date(now);
    postTime.setDate(now.getDate() + day);
    postTime.setHours(18, 0, 0, 0);

    schedules.push({
      videoPath: `./videos/day-${day}.mp4`,
      title: `Day ${day} of my challenge!`,
      hashtags: ['challenge', 'fyp', `day${day}`],
      scheduledTime: postTime
    });
  }

  const publishIds = await tiktok.scheduleVideos(schedules);
  console.log('Scheduled:', publishIds.length, 'videos');
}
```

### Multi-Account and Analytics

```typescript
async function tiktokCampaign() {
  const tiktok = new TikTokAutomation({...});

  // Post to multiple accounts
  const results = await tiktok.postToMultipleAccounts({
    accounts: [
      { accessToken: 'token1', openId: 'user1' },
      { accessToken: 'token2', openId: 'user2' }
    ],
    videoPath: './campaign.mp4',
    title: 'Big announcement! 🎉',
    hashtags: ['announcement', 'fyp'],
    delayBetweenPosts: 5000
  });

  console.log('Posted to', results.filter(r => r.success).length, 'accounts');

  // Track analytics
  const analytics = await tiktok.trackAnalytics(
    results.filter(r => r.success).map(r => r.publishId)
  );

  analytics.forEach(a => {
    console.log(`${a.videoId}: ${a.views} views, ${(a.engagement * 100).toFixed(2)}% engagement`);
  });
}
```

### Pinterest Product Pin & Traffic

```typescript
import { PinterestAutomation } from './automation/PinterestAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

async function pinterestEcommerce() {
  const pinterest = new PinterestAutomation({
    accessToken: process.env.PINTEREST_ACCESS_TOKEN!
  });

  // Create optimized product pin
  const pinId = await pinterest.optimizeForShopping({
    boardId: 'products-board-id',
    imageUrl: 'https://yourstore.com/product.jpg',
    title: 'Handmade Ceramic Mug',
    description: 'Beautiful handmade ceramic mug. Perfect for coffee lovers!',
    link: 'https://yourstore.com/products/ceramic-mug',
    price: 24.99,
    currency: 'USD',
    availability: 'IN_STOCK',
    brand: 'Artisan Pottery'
  }, {
    usePriceInTitle: true,
    targetKeywords: ['ceramic mug', 'handmade pottery']
  });

  console.log('Product pin created:', pinId);

  // Track traffic to website
  const traffic = await pinterest.driveTrafficToWebsite('yourstore.com');

  console.log('Pinterest Traffic:');
  console.log(`  Clicks: ${traffic.totalClicks.toLocaleString()}`);
  console.log(`  CTR: ${(traffic.clickThroughRate * 100).toFixed(2)}%`);

  // Find viral pins
  const viral = await pinterest.trackViralPins({
    minImpressions: 10000,
    minSaves: 500
  });

  console.log(`Found ${viral.length} viral pins!`);
}

pinterestEcommerce().catch(console.error);
```

### Pinterest Catalog Upload

```typescript
async function uploadProductCatalog() {
  const pinterest = new PinterestAutomation({...});

  const catalog = [
    {
      productId: 'PROD-001',
      title: 'Product 1',
      description: 'Product description',
      price: 29.99,
      currency: 'USD',
      availability: 'IN_STOCK',
      imageUrl: 'https://store.com/product1.jpg',
      productUrl: 'https://store.com/products/1',
      brand: 'YourBrand'
    },
    // ... more products
  ];

  const pinIds = await pinterest.createCatalogPins(
    'catalog-board-id',
    catalog,
    {
      keywords: ['product category', 'niche'],
      hashtags: ['shopping', 'deals']
    }
  );

  console.log(`Uploaded ${pinIds.length} products`);
}
```

---

## API Quotas

### YouTube Data API v3

- **Default Daily Quota**: 10,000 units
- **Video Upload**: 1,600 units
- **Video Update**: 50 units
- **Playlist Insert**: 50 units

### Instagram Graph API

- **Rate Limit**: 200 calls per hour per user
- **Daily Limit**: 4,800 calls per user per 24 hours
- **Publishing**: 25 posts per day
- **Scheduled Posts**: 25 scheduled at once
- **Content Limits**: Images max 8 MB, videos max 1 GB

### TikTok API

- **Rate Limit**: ~1000 calls per day (varies by endpoint)
- **Video Upload**: No strict limit (respect rate limiting)
- **Scheduling**: Up to 10 days in advance
- **Content Limits**: Videos max 4 GB, 3s-10min duration
- **Access Token**: Valid for 24 hours

### Pinterest API

- **Rate Limit**: 180 requests per minute per user
- **Daily Limit**: 10,000 requests per hour (app-wide)
- **Pin Creation**: Recommended max 500 pins per day
- **Image Size**: Max 32 MB per image
- **Content Limits**: 100 char title, 500 char description
- **Access Token**: Refresh every 24 hours

### Quota Management Tips

1. **Batch operations**: Upload multiple videos in one session
2. **Cache data**: Store frequently accessed information
3. **Rate limiting**: Add delays between operations
4. **Request increase**: Apply for higher quota if needed

---

## Authentication

### YouTube OAuth2 Setup

1. Create Google Cloud project
2. Enable YouTube Data API v3
3. Create OAuth2 credentials
4. Configure consent screen
5. Add test users (for development)

**Full setup guide**: [YOUTUBE_SETUP.md](./YOUTUBE_SETUP.md)

### First-Time Authentication

```typescript
import { YouTubeAutomation } from './automation/YouTubeAutomation';

async function authenticate() {
  const youtube = new YouTubeAutomation({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    redirectUri: 'http://localhost:3000/oauth2callback'
  });

  // Get authorization URL
  const authUrl = youtube.getAuthorizationUrl();
  console.log('Visit:', authUrl);

  // After user authorizes, exchange code for tokens
  const code = 'authorization-code-from-redirect';
  const { accessToken, refreshToken } = await youtube.authorize(code);

  // Save tokens for future use
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
}
```

### Instagram OAuth Setup

1. Create Facebook Developer account
2. Create Facebook app (Business type)
3. Add Instagram Graph API product
4. Connect Instagram Business account
5. Get access tokens

**Full setup guide**: [INSTAGRAM_SETUP.md](./INSTAGRAM_SETUP.md)

### Get Instagram Access Token

```typescript
// Use Graph API Explorer to get token
// https://developers.facebook.com/tools/explorer/

// Initialize Instagram automation
import { InstagramAutomation } from './automation/InstagramAutomation';

const instagram = new InstagramAutomation({
  accessToken: 'your-long-lived-access-token',
  businessAccountId: 'your-instagram-business-account-id'
});

// Test connection
const mediaId = await instagram.postFeed({
  imageUrl: 'https://example.com/test.jpg',
  caption: 'Test post! 🚀'
});
```

### TikTok OAuth Setup

1. Create TikTok Developer account
2. Create app and add Content Posting API
3. Configure OAuth redirect URIs
4. Get Client Key and Client Secret
5. Request API scopes

**Full setup guide**: [TIKTOK_SETUP.md](./TIKTOK_SETUP.md)

### Get TikTok Access Token

```typescript
import { TikTokAutomation } from './automation/TikTokAutomation';

async function authenticateTikTok() {
  const tiktok = new TikTokAutomation({
    clientKey: 'your-client-key',
    clientSecret: 'your-client-secret',
    redirectUri: 'http://localhost:3000/callback'
  });

  // Get authorization URL
  const authUrl = tiktok.getAuthorizationUrl([
    'user.info.basic',
    'video.upload',
    'video.publish',
    'video.list'
  ]);

  console.log('Visit:', authUrl);

  // After user authorizes, exchange code for tokens
  const code = 'authorization-code-from-callback';
  const { accessToken, refreshToken } = await tiktok.authorize(code);

  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
}
```

---

## Error Handling

### Common Errors

```typescript
try {
  await youtube.uploadVideo(videoPath, options);
} catch (error) {
  if (error.message.includes('quota exceeded')) {
    // Daily quota reached
    console.error('Quota exceeded. Try tomorrow.');
  } else if (error.message.includes('403')) {
    // Permission or quota issue
    console.error('Insufficient permissions or quota exceeded');
  } else if (error.message.includes('not found')) {
    // File not found
    console.error('Video file not found');
  } else {
    console.error('Upload failed:', error.message);
  }
}
```

### Retry Logic

```typescript
async function uploadWithRetry(
  youtube: YouTubeAutomation,
  videoPath: string,
  options: VideoUploadOptions,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await youtube.uploadVideo(videoPath, options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries}...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}
```

---

## Best Practices

### 1. Security

- ✅ Never commit credentials to version control
- ✅ Use environment variables
- ✅ Encrypt tokens at rest (production)
- ✅ Rotate credentials regularly
- ✅ Use HTTPS for OAuth redirects

### 2. Performance

- ✅ Batch operations when possible
- ✅ Add delays between uploads (rate limiting)
- ✅ Cache frequently accessed data
- ✅ Monitor quota usage
- ✅ Implement exponential backoff

### 3. Reliability

- ✅ Implement retry logic
- ✅ Handle errors gracefully
- ✅ Log all operations
- ✅ Monitor success rates
- ✅ Set up alerts for failures

### 4. Compliance

- ✅ Follow YouTube Terms of Service
- ✅ Respect COPPA regulations (madeForKids flag)
- ✅ Include accurate metadata
- ✅ Don't spam or manipulate metrics
- ✅ Provide proper attribution

---

## File Structure

```
src/automation/
├── YouTubeAutomation.ts       # Main YouTube automation class
├── YouTubeAutomation.md       # Full documentation
├── YOUTUBE_SETUP.md           # Setup guide
├── README.md                  # This file
└── [Future automation systems]

src/examples/
└── youtube-automation-example.ts  # Usage examples
```

---

## Completed Automation Systems

- ✅ **YouTube Automation** - YouTube Data API v3 (COMPLETE)
- ✅ **Instagram Automation** - Instagram Graph API (COMPLETE)
- ✅ **TikTok Automation** - TikTok Content Posting API (COMPLETE)
- ✅ **Pinterest Automation** - Pinterest API v5 (COMPLETE) **⭐ E-COMMERCE PRIORITY**

## Future Automation Systems

Planned automation systems:

- 🐦 **Twitter/X Automation** - Twitter API v2
- 📺 **Twitch Automation** - Twitch API
- 💼 **LinkedIn Automation** - LinkedIn API
- 📧 **Email Automation** - SendGrid/Mailchimp
- 📊 **Analytics Automation** - Google Analytics
- 💬 **Discord Automation** - Discord Bot API
- 🎮 **Kick Automation** - Kick.com API

---

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### Manual Testing

```bash
# Run examples
ts-node src/examples/youtube-automation-example.ts
```

---

## Contributing

When adding new automation systems:

1. Create main class file (e.g., `TikTokAutomation.ts`)
2. Add comprehensive documentation (e.g., `TikTokAutomation.md`)
3. Create setup guide (e.g., `TIKTOK_SETUP.md`)
4. Add examples to `src/examples/`
5. Update this README
6. Add tests
7. Update package.json with dependencies

---

## Support

### Documentation
- YouTube: [YouTubeAutomation.md](./YouTubeAutomation.md)
- Setup: [YOUTUBE_SETUP.md](./YOUTUBE_SETUP.md)
- Examples: [youtube-automation-example.ts](../examples/youtube-automation-example.ts)

### External Resources
- YouTube API: https://developers.google.com/youtube/v3
- OAuth2: https://developers.google.com/identity/protocols/oauth2
- Quotas: https://developers.google.com/youtube/v3/determine_quota_cost

### Issues
Report issues at: [GitHub Issues](https://github.com/yourusername/niche-empire-builder/issues)

---

## License

MIT License - See LICENSE file for details

---

**Happy Automating! 🚀**
