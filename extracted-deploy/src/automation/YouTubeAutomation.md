# YouTube Automation System

Production-ready YouTube automation using Google YouTube Data API v3 with OAuth2 authentication.

## Features

### 🎥 Video Management
- ✅ Upload videos with full metadata
- ✅ Batch video uploads with rate limiting
- ✅ Schedule videos for future publication
- ✅ Update video metadata (title, description, tags)
- ✅ Bulk metadata updates
- ✅ Custom thumbnail uploads
- ✅ Delete videos
- ✅ Update privacy settings

### 📋 Playlist Management
- ✅ Create playlists
- ✅ Add videos to playlists
- ✅ Batch add multiple videos
- ✅ Remove videos from playlists
- ✅ Get all playlist videos

### 📊 Analytics & Tracking
- ✅ Get video statistics (views, likes, comments)
- ✅ Track performance of multiple videos
- ✅ Get channel statistics
- ✅ Find top performing videos
- ✅ Search videos

### 🔐 Authentication
- ✅ OAuth2 authentication flow
- ✅ Token refresh mechanism
- ✅ Secure credential management

### 💰 Monetization (Partner Program Required)
- ⚠️ Enable monetization (requires Content ID API)
- ⚠️ Check monetization status

---

## Prerequisites

### 1. Google Cloud Project Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3:
   - Navigate to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

### 2. OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure OAuth consent screen:
   - User Type: External (or Internal for workspace)
   - App name: Your app name
   - User support email: Your email
   - Scopes: Add YouTube scopes
4. Create OAuth client ID:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/oauth2callback`
5. Download credentials JSON

### 3. Install Dependencies

```bash
npm install googleapis
npm install @types/node --save-dev
```

---

## Installation

```bash
# Install the package
npm install googleapis

# Or add to your project
npm install googleapis @google-cloud/local-auth
```

---

## Quick Start

### 1. Initialize YouTube Automation

```typescript
import { YouTubeAutomation } from './automation/YouTubeAutomation';

const youtube = new YouTubeAutomation({
  clientId: 'your-client-id.apps.googleusercontent.com',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost:3000/oauth2callback'
});
```

### 2. Authenticate

```typescript
// Step 1: Get authorization URL
const authUrl = youtube.getAuthorizationUrl();
console.log('Visit this URL to authorize:', authUrl);

// Step 2: After user authorizes, exchange code for tokens
const code = 'authorization-code-from-redirect';
const { accessToken, refreshToken } = await youtube.authorize(code);

// Save tokens securely for future use
console.log('Access Token:', accessToken);
console.log('Refresh Token:', refreshToken);

// For subsequent uses, set tokens directly
youtube.setAccessToken(accessToken, refreshToken);
```

### 3. Upload a Video

```typescript
const videoId = await youtube.uploadVideo(
  '/path/to/video.mp4',
  {
    title: 'My Awesome Video',
    description: 'This is a great video about...',
    tags: ['tutorial', 'education', 'tech'],
    categoryId: '22', // People & Blogs
    privacyStatus: 'public',
    madeForKids: false,
    thumbnail: '/path/to/thumbnail.jpg'
  }
);

console.log('Video uploaded:', videoId);
```

---

## Detailed Usage

### Video Upload Options

```typescript
interface VideoUploadOptions {
  title: string;                    // Required: Video title
  description: string;               // Required: Video description
  tags?: string[];                   // Optional: Tags for discovery
  categoryId?: string;               // Optional: Video category (1-44)
  privacyStatus: 'public' | 'private' | 'unlisted';
  publishAt?: Date;                  // Optional: Schedule for future
  language?: string;                 // Optional: Video language (e.g., 'en')
  defaultLanguage?: string;          // Optional: Default language
  notifySubscribers?: boolean;       // Optional: Notify subscribers (default: true)
  madeForKids?: boolean;            // Required: COPPA compliance
  embeddable?: boolean;             // Optional: Allow embedding
  license?: 'youtube' | 'creativeCommon';
  publicStatsViewable?: boolean;    // Optional: Show view count
  thumbnail?: string;               // Optional: Path to thumbnail
  playlist?: string;                // Optional: Add to playlist ID
}
```

### Video Categories

Common category IDs:
- `1` - Film & Animation
- `2` - Autos & Vehicles
- `10` - Music
- `15` - Pets & Animals
- `17` - Sports
- `19` - Travel & Events
- `20` - Gaming
- `22` - People & Blogs
- `23` - Comedy
- `24` - Entertainment
- `25` - News & Politics
- `26` - Howto & Style
- `27` - Education
- `28` - Science & Technology

### Upload Video

```typescript
// Basic upload
const videoId = await youtube.uploadVideo(
  './my-video.mp4',
  {
    title: 'How to Build a SaaS App',
    description: 'Complete tutorial on building a SaaS application from scratch.',
    tags: ['saas', 'tutorial', 'coding'],
    categoryId: '27', // Education
    privacyStatus: 'public',
    madeForKids: false
  }
);

// Upload with scheduling
const videoId = await youtube.uploadVideo(
  './scheduled-video.mp4',
  {
    title: 'Tomorrow\'s Video',
    description: 'This will be published tomorrow',
    privacyStatus: 'private',
    publishAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    notifySubscribers: true,
    madeForKids: false
  }
);

// Upload with custom thumbnail
const videoId = await youtube.uploadVideo(
  './video.mp4',
  {
    title: 'Video with Custom Thumbnail',
    description: 'Beautiful thumbnail included',
    privacyStatus: 'public',
    thumbnail: './thumbnail.jpg',
    madeForKids: false
  }
);
```

### Batch Upload

```typescript
const videos = [
  {
    path: './video1.mp4',
    options: {
      title: 'Video 1',
      description: 'First video',
      privacyStatus: 'public' as const,
      madeForKids: false
    }
  },
  {
    path: './video2.mp4',
    options: {
      title: 'Video 2',
      description: 'Second video',
      privacyStatus: 'public' as const,
      madeForKids: false
    }
  }
];

const videoIds = await youtube.uploadVideoBatch(videos, 5000); // 5s delay between uploads
console.log('Uploaded videos:', videoIds);
```

### Schedule Videos

```typescript
// Schedule single video
await youtube.scheduleVideo({
  videoId: 'abc123',
  publishAt: new Date('2024-12-31T12:00:00Z'),
  notifySubscribers: true
});

// Schedule multiple videos
const schedules = [
  {
    videoId: 'video1',
    publishAt: new Date('2024-12-25T10:00:00Z'),
    notifySubscribers: true
  },
  {
    videoId: 'video2',
    publishAt: new Date('2024-12-26T10:00:00Z'),
    notifySubscribers: true
  }
];

await youtube.scheduleVideos(schedules);

// Cancel schedule
await youtube.cancelSchedule('abc123');
```

### Update Metadata

```typescript
// Update single video
await youtube.updateMetadata({
  videoId: 'abc123',
  title: 'New Title',
  description: 'Updated description',
  tags: ['new', 'tags']
});

// Bulk metadata update
const updates = [
  {
    videoId: 'video1',
    title: 'Updated Title 1',
    description: 'New description 1'
  },
  {
    videoId: 'video2',
    title: 'Updated Title 2',
    tags: ['tag1', 'tag2', 'tag3']
  }
];

await youtube.setBulkMetadata(updates);
```

### Playlist Management

```typescript
// Create playlist
const playlistId = await youtube.createPlaylist({
  title: 'My Tutorial Series',
  description: 'Complete series of tutorials',
  privacyStatus: 'public',
  tags: ['tutorials', 'series']
});

// Add video to playlist
await youtube.addVideoToPlaylist(playlistId, 'video123');

// Add multiple videos
await youtube.addToPlaylist(playlistId, ['video1', 'video2', 'video3']);

// Get all videos in playlist
const videoIds = await youtube.getPlaylistVideos(playlistId);
console.log('Playlist contains:', videoIds);
```

### Analytics & Performance

```typescript
// Get video statistics
const stats = await youtube.getVideoStatistics('video123');
console.log('Views:', stats.views);
console.log('Likes:', stats.likes);
console.log('Comments:', stats.comments);

// Track multiple videos
const analytics = await youtube.trackPerformance([
  'video1',
  'video2',
  'video3'
]);

analytics.forEach(stats => {
  console.log(`${stats.videoId}: ${stats.views} views, ${stats.likes} likes`);
});

// Get channel statistics
const channelStats = await youtube.getChannelStatistics();
console.log('Subscribers:', channelStats.subscribers);
console.log('Total views:', channelStats.views);
console.log('Video count:', channelStats.videos);

// Get top performing videos
const topVideos = await youtube.getTopVideos(10);
topVideos.forEach((video, index) => {
  console.log(`#${index + 1}: ${video.videoId} - ${video.views} views`);
});
```

### Utility Methods

```typescript
// Get video details
const video = await youtube.getVideoDetails('video123');
console.log('Title:', video.snippet?.title);
console.log('Duration:', video.contentDetails?.duration);

// Update privacy
await youtube.updatePrivacy('video123', 'unlisted');

// Delete video
await youtube.deleteVideo('video123');

// Get categories
const categories = await youtube.getCategories('US');
categories.forEach(cat => {
  console.log(`${cat.id}: ${cat.title}`);
});

// Search videos
const searchResults = await youtube.searchVideos('tutorial', 10);
console.log('Found videos:', searchResults);
```

---

## Complete Example

```typescript
import { YouTubeAutomation } from './automation/YouTubeAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Initialize
  const youtube = new YouTubeAutomation({
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    redirectUri: process.env.YOUTUBE_REDIRECT_URI!,
    accessToken: process.env.YOUTUBE_ACCESS_TOKEN,
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN
  });

  // Create playlist
  const playlistId = await youtube.createPlaylist({
    title: 'My Video Series',
    description: 'A collection of my best videos',
    privacyStatus: 'public'
  });

  // Upload videos
  const videos = [
    {
      path: './videos/intro.mp4',
      options: {
        title: 'Introduction to the Series',
        description: 'Welcome to my video series!',
        tags: ['intro', 'series', 'tutorial'],
        categoryId: '27',
        privacyStatus: 'public' as const,
        playlist: playlistId,
        madeForKids: false,
        thumbnail: './thumbnails/intro.jpg'
      }
    },
    {
      path: './videos/part1.mp4',
      options: {
        title: 'Part 1: Getting Started',
        description: 'In this part we cover the basics',
        tags: ['tutorial', 'part1', 'basics'],
        categoryId: '27',
        privacyStatus: 'public' as const,
        playlist: playlistId,
        madeForKids: false,
        thumbnail: './thumbnails/part1.jpg'
      }
    }
  ];

  const videoIds = await youtube.uploadVideoBatch(videos);

  // Track performance
  const analytics = await youtube.trackPerformance(videoIds);
  console.log('Performance:', analytics);

  // Get channel stats
  const channelStats = await youtube.getChannelStatistics();
  console.log('Channel stats:', channelStats);
}

main().catch(console.error);
```

---

## Environment Variables

Create a `.env` file:

```env
YOUTUBE_CLIENT_ID=your-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your-client-secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/oauth2callback
YOUTUBE_ACCESS_TOKEN=your-access-token
YOUTUBE_REFRESH_TOKEN=your-refresh-token
```

---

## API Quota Limits

YouTube Data API v3 has daily quotas:
- **Default quota**: 10,000 units per day
- **Video upload**: 1,600 units
- **Video update**: 50 units
- **Playlist insert**: 50 units
- **Video list**: 1 unit

### Managing Quotas

```typescript
// Add delays between operations
await new Promise(resolve => setTimeout(resolve, 1000));

// Batch operations efficiently
const videoIds = await youtube.uploadVideoBatch(videos, 5000);

// Request quota increase from Google if needed
```

---

## Error Handling

```typescript
try {
  const videoId = await youtube.uploadVideo('./video.mp4', options);
} catch (error) {
  if (error.message.includes('quota exceeded')) {
    console.error('Daily quota exceeded. Try again tomorrow.');
  } else if (error.message.includes('403')) {
    console.error('Insufficient permissions or quota exceeded');
  } else {
    console.error('Upload failed:', error.message);
  }
}
```

---

## Best Practices

### 1. Token Management
```typescript
// Store tokens securely (use encryption in production)
import * as fs from 'fs';

// Save tokens
fs.writeFileSync('.youtube-tokens.json', JSON.stringify({
  accessToken,
  refreshToken
}, null, 2));

// Load tokens
const tokens = JSON.parse(fs.readFileSync('.youtube-tokens.json', 'utf-8'));
youtube.setAccessToken(tokens.accessToken, tokens.refreshToken);
```

### 2. Rate Limiting
```typescript
// Add delays between operations
async function uploadWithDelay(videos) {
  for (const video of videos) {
    await youtube.uploadVideo(video.path, video.options);
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5s delay
  }
}
```

### 3. Error Recovery
```typescript
async function uploadWithRetry(videoPath, options, maxRetries = 3) {
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

### 4. Batch Operations
```typescript
// Process in chunks to avoid memory issues
const chunks = [];
for (let i = 0; i < videos.length; i += 10) {
  chunks.push(videos.slice(i, i + 10));
}

for (const chunk of chunks) {
  await youtube.uploadVideoBatch(chunk);
  await new Promise(resolve => setTimeout(resolve, 60000)); // 1 min between chunks
}
```

---

## Troubleshooting

### Issue: "Invalid Credentials"
**Solution**: Regenerate OAuth credentials and re-authorize

### Issue: "Quota Exceeded"
**Solution**: Wait until quota resets (midnight Pacific Time) or request increase

### Issue: "Video Upload Failed"
**Solution**: Check file format (MP4, MOV, AVI, WMV, FLV supported), size (<256GB), and duration (<12 hours)

### Issue: "Thumbnail Upload Failed"
**Solution**: Ensure image is JPG/PNG, <2MB, and 1280x720 resolution

---

## Security Considerations

1. **Never commit credentials** to version control
2. **Use environment variables** for sensitive data
3. **Encrypt tokens at rest** in production
4. **Implement rate limiting** to avoid quota exhaustion
5. **Validate user input** before API calls
6. **Use HTTPS** for OAuth redirects in production
7. **Rotate credentials** regularly

---

## License

MIT

---

## Support

For issues related to:
- **YouTube API**: [YouTube API Support](https://developers.google.com/youtube/v3/support)
- **Quotas**: [Request quota increase](https://support.google.com/youtube/contact/yt_api_form)
- **Authentication**: [OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)

---

## Additional Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3/docs)
- [OAuth2 for Web Apps](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Video Upload Guide](https://developers.google.com/youtube/v3/guides/uploading_a_video)
- [API Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
