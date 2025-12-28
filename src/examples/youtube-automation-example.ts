/**
 * YouTube Automation Example
 *
 * Demonstrates how to use the YouTubeAutomation class for various operations
 */

import { YouTubeAutomation } from '../automation/YouTubeAutomation';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

// ============================================================================
// Configuration
// ============================================================================

const config = {
  clientId: process.env.YOUTUBE_CLIENT_ID || '',
  clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
  redirectUri: process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
  accessToken: process.env.YOUTUBE_ACCESS_TOKEN,
  refreshToken: process.env.YOUTUBE_REFRESH_TOKEN
};

// ============================================================================
// Helper Functions
// ============================================================================

function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// ============================================================================
// Example 1: Authentication Flow
// ============================================================================

async function exampleAuthentication() {
  console.log('\n=== Example 1: Authentication Flow ===\n');

  const youtube = new YouTubeAutomation(config);

  // Step 1: Get authorization URL
  const authUrl = youtube.getAuthorizationUrl();
  console.log('1. Visit this URL to authorize the application:');
  console.log(authUrl);
  console.log('\n2. After authorization, you will be redirected to your redirect URI');
  console.log('3. Copy the "code" parameter from the redirect URL');

  // Step 2: Get authorization code from user
  const code = await promptUser('\nEnter the authorization code: ');

  // Step 3: Exchange code for tokens
  console.log('\nExchanging code for tokens...');
  const { accessToken, refreshToken } = await youtube.authorize(code);

  console.log('\n✅ Authorization successful!');
  console.log('\nSave these tokens in your .env file:');
  console.log(`YOUTUBE_ACCESS_TOKEN=${accessToken}`);
  console.log(`YOUTUBE_REFRESH_TOKEN=${refreshToken}`);

  return youtube;
}

// ============================================================================
// Example 2: Upload Single Video
// ============================================================================

async function exampleUploadVideo(youtube: YouTubeAutomation) {
  console.log('\n=== Example 2: Upload Single Video ===\n');

  const videoId = await youtube.uploadVideo(
    './sample-video.mp4', // Path to your video file
    {
      title: 'My First Automated Upload',
      description: `This video was uploaded using YouTube Data API v3!

🔥 Features:
- Automated video uploads
- Custom metadata
- Scheduled publishing
- And much more!

Subscribe for more content!`,
      tags: ['automation', 'youtube api', 'tutorial', 'programming'],
      categoryId: '28', // Science & Technology
      privacyStatus: 'private', // Start with private for testing
      madeForKids: false,
      embeddable: true,
      license: 'youtube',
      publicStatsViewable: true,
      notifySubscribers: false, // Don't notify for test uploads
      thumbnail: './sample-thumbnail.jpg' // Optional
    }
  );

  console.log(`\n✅ Video uploaded successfully!`);
  console.log(`Video ID: ${videoId}`);
  console.log(`Watch URL: https://www.youtube.com/watch?v=${videoId}`);
  console.log(`Studio URL: https://studio.youtube.com/video/${videoId}/edit`);

  return videoId;
}

// ============================================================================
// Example 3: Batch Upload Videos
// ============================================================================

async function exampleBatchUpload(youtube: YouTubeAutomation) {
  console.log('\n=== Example 3: Batch Upload Videos ===\n');

  const videos = [
    {
      path: './videos/intro.mp4',
      options: {
        title: 'Series Introduction - Part 1',
        description: 'Welcome to our video series!',
        tags: ['series', 'introduction', 'part1'],
        categoryId: '27', // Education
        privacyStatus: 'private' as const,
        madeForKids: false,
        thumbnail: './thumbnails/intro.jpg'
      }
    },
    {
      path: './videos/tutorial.mp4',
      options: {
        title: 'Complete Tutorial - Part 2',
        description: 'Step by step tutorial',
        tags: ['tutorial', 'guide', 'part2'],
        categoryId: '27',
        privacyStatus: 'private' as const,
        madeForKids: false,
        thumbnail: './thumbnails/tutorial.jpg'
      }
    },
    {
      path: './videos/conclusion.mp4',
      options: {
        title: 'Conclusion - Part 3',
        description: 'Wrapping up the series',
        tags: ['conclusion', 'summary', 'part3'],
        categoryId: '27',
        privacyStatus: 'private' as const,
        madeForKids: false,
        thumbnail: './thumbnails/conclusion.jpg'
      }
    }
  ];

  console.log(`Uploading ${videos.length} videos...`);
  const videoIds = await youtube.uploadVideoBatch(videos, 5000);

  console.log(`\n✅ Batch upload complete!`);
  console.log(`Uploaded ${videoIds.length} videos:`, videoIds);

  return videoIds;
}

// ============================================================================
// Example 4: Create Playlist and Add Videos
// ============================================================================

async function examplePlaylistManagement(youtube: YouTubeAutomation, videoIds: string[]) {
  console.log('\n=== Example 4: Playlist Management ===\n');

  // Create playlist
  console.log('Creating playlist...');
  const playlistId = await youtube.createPlaylist({
    title: 'My Automated Playlist',
    description: 'This playlist was created using the YouTube API',
    privacyStatus: 'public',
    tags: ['automation', 'playlist', 'collection']
  });

  console.log(`✅ Playlist created: ${playlistId}`);
  console.log(`URL: https://www.youtube.com/playlist?list=${playlistId}`);

  // Add videos to playlist
  console.log('\nAdding videos to playlist...');
  await youtube.addToPlaylist(playlistId, videoIds);

  console.log(`✅ Added ${videoIds.length} videos to playlist`);

  // Get playlist videos
  const playlistVideos = await youtube.getPlaylistVideos(playlistId);
  console.log(`\nPlaylist now contains ${playlistVideos.length} videos`);

  return playlistId;
}

// ============================================================================
// Example 5: Schedule Videos
// ============================================================================

async function exampleScheduleVideos(youtube: YouTubeAutomation, videoIds: string[]) {
  console.log('\n=== Example 5: Schedule Videos ===\n');

  const now = new Date();
  const schedules = videoIds.map((videoId, index) => ({
    videoId,
    publishAt: new Date(now.getTime() + (index + 1) * 24 * 60 * 60 * 1000), // Each day
    notifySubscribers: true
  }));

  console.log('Scheduling videos for future publication...');
  await youtube.scheduleVideos(schedules);

  console.log('\n✅ Videos scheduled:');
  schedules.forEach((schedule, index) => {
    console.log(`Video ${index + 1}: ${schedule.videoId} → ${schedule.publishAt.toLocaleString()}`);
  });
}

// ============================================================================
// Example 6: Update Metadata in Bulk
// ============================================================================

async function exampleBulkMetadata(youtube: YouTubeAutomation, videoIds: string[]) {
  console.log('\n=== Example 6: Bulk Metadata Update ===\n');

  const updates = videoIds.map((videoId, index) => ({
    videoId,
    title: `Updated Title - Part ${index + 1}`,
    description: `Updated description for part ${index + 1}\n\n📺 Subscribe for more!`,
    tags: ['updated', 'optimized', 'seo', `part${index + 1}`]
  }));

  console.log(`Updating metadata for ${updates.length} videos...`);
  await youtube.setBulkMetadata(updates);

  console.log('\n✅ Bulk metadata update complete!');
}

// ============================================================================
// Example 7: Track Performance
// ============================================================================

async function exampleTrackPerformance(youtube: YouTubeAutomation, videoIds: string[]) {
  console.log('\n=== Example 7: Track Performance ===\n');

  console.log('Fetching analytics for videos...');
  const analytics = await youtube.trackPerformance(videoIds);

  console.log('\n📊 Video Performance:\n');
  analytics.forEach((stats, index) => {
    console.log(`Video ${index + 1} (${stats.videoId}):`);
    console.log(`  Views: ${stats.views.toLocaleString()}`);
    console.log(`  Likes: ${stats.likes.toLocaleString()}`);
    console.log(`  Comments: ${stats.comments.toLocaleString()}`);
    console.log(`  Published: ${new Date(stats.publishedAt).toLocaleDateString()}`);
    console.log('');
  });

  // Calculate totals
  const totals = analytics.reduce(
    (acc, stats) => ({
      views: acc.views + stats.views,
      likes: acc.likes + stats.likes,
      comments: acc.comments + stats.comments
    }),
    { views: 0, likes: 0, comments: 0 }
  );

  console.log('📈 Totals:');
  console.log(`  Total Views: ${totals.views.toLocaleString()}`);
  console.log(`  Total Likes: ${totals.likes.toLocaleString()}`);
  console.log(`  Total Comments: ${totals.comments.toLocaleString()}`);
}

// ============================================================================
// Example 8: Channel Statistics
// ============================================================================

async function exampleChannelStats(youtube: YouTubeAutomation) {
  console.log('\n=== Example 8: Channel Statistics ===\n');

  const stats = await youtube.getChannelStatistics();

  console.log('📺 Channel Statistics:\n');
  console.log(`Subscribers: ${stats.subscribers.toLocaleString()}`);
  console.log(`Total Views: ${stats.views.toLocaleString()}`);
  console.log(`Total Videos: ${stats.videos.toLocaleString()}`);

  if (stats.subscribers > 0) {
    const avgViewsPerVideo = Math.round(stats.views / stats.videos);
    console.log(`\nAvg Views/Video: ${avgViewsPerVideo.toLocaleString()}`);
  }
}

// ============================================================================
// Example 9: Top Performing Videos
// ============================================================================

async function exampleTopVideos(youtube: YouTubeAutomation) {
  console.log('\n=== Example 9: Top Performing Videos ===\n');

  const topVideos = await youtube.getTopVideos(10);

  console.log('🏆 Top 10 Videos by Views:\n');
  topVideos.forEach((video, index) => {
    console.log(`${index + 1}. ${video.videoId}`);
    console.log(`   Views: ${video.views.toLocaleString()}`);
    console.log(`   Likes: ${video.likes.toLocaleString()}`);
    console.log(`   URL: https://www.youtube.com/watch?v=${video.videoId}`);
    console.log('');
  });
}

// ============================================================================
// Example 10: Complete Workflow
// ============================================================================

async function exampleCompleteWorkflow(youtube: YouTubeAutomation) {
  console.log('\n=== Example 10: Complete Workflow ===\n');

  // 1. Create playlist
  const playlistId = await youtube.createPlaylist({
    title: 'Complete Tutorial Series',
    description: 'A comprehensive tutorial series',
    privacyStatus: 'public'
  });

  console.log(`✅ Created playlist: ${playlistId}`);

  // 2. Upload videos
  const videos = [
    {
      path: './series/video1.mp4',
      options: {
        title: 'Tutorial Part 1',
        description: 'Introduction',
        tags: ['tutorial', 'part1'],
        categoryId: '27',
        privacyStatus: 'private' as const,
        playlist: playlistId,
        madeForKids: false
      }
    }
    // Add more videos...
  ];

  console.log('\n📤 Uploading videos...');
  const videoIds = await youtube.uploadVideoBatch(videos);

  // 3. Schedule publication
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  console.log('\n📅 Scheduling videos...');
  await youtube.scheduleVideos(
    videoIds.map((videoId, index) => ({
      videoId,
      publishAt: new Date(tomorrow.getTime() + index * 24 * 60 * 60 * 1000),
      notifySubscribers: true
    }))
  );

  // 4. Optimize metadata
  console.log('\n✏️ Optimizing metadata...');
  await youtube.setBulkMetadata(
    videoIds.map((videoId, index) => ({
      videoId,
      title: `Complete Tutorial - Part ${index + 1} [2024]`,
      description: `Part ${index + 1} of our comprehensive tutorial series.

🎯 What you'll learn:
- Key concepts
- Practical examples
- Best practices

💡 Resources:
- Download code: https://example.com
- Join community: https://discord.gg/example

📺 Subscribe for more tutorials!`,
      tags: ['tutorial', '2024', 'complete guide', `part${index + 1}`, 'education']
    }))
  );

  console.log('\n🎉 Complete workflow finished!');
  console.log(`Created ${videoIds.length} videos in playlist ${playlistId}`);
}

// ============================================================================
// Main Function
// ============================================================================

async function main() {
  console.log('YouTube Automation Examples');
  console.log('===========================\n');

  try {
    // Check if we have credentials
    if (!config.accessToken || !config.refreshToken) {
      console.log('⚠️  No access token found. Starting authentication flow...\n');
      await exampleAuthentication();
      console.log('\n✅ Authentication complete!');
      console.log('Please update your .env file with the tokens and run the script again.');
      return;
    }

    // Initialize YouTube automation
    const youtube = new YouTubeAutomation(config);

    // Get user choice
    console.log('Select an example to run:');
    console.log('1. Upload Single Video');
    console.log('2. Batch Upload Videos');
    console.log('3. Create Playlist and Add Videos');
    console.log('4. Schedule Videos');
    console.log('5. Update Metadata in Bulk');
    console.log('6. Track Performance');
    console.log('7. Channel Statistics');
    console.log('8. Top Performing Videos');
    console.log('9. Complete Workflow');
    console.log('0. Run All Examples');

    const choice = await promptUser('\nEnter your choice (0-9): ');

    switch (choice) {
      case '1':
        await exampleUploadVideo(youtube);
        break;
      case '2':
        await exampleBatchUpload(youtube);
        break;
      case '3': {
        const videoIds = ['video1', 'video2', 'video3']; // Replace with actual IDs
        await examplePlaylistManagement(youtube, videoIds);
        break;
      }
      case '4': {
        const videoIds = ['video1', 'video2', 'video3']; // Replace with actual IDs
        await exampleScheduleVideos(youtube, videoIds);
        break;
      }
      case '5': {
        const videoIds = ['video1', 'video2', 'video3']; // Replace with actual IDs
        await exampleBulkMetadata(youtube, videoIds);
        break;
      }
      case '6': {
        const videoIds = ['video1', 'video2', 'video3']; // Replace with actual IDs
        await exampleTrackPerformance(youtube, videoIds);
        break;
      }
      case '7':
        await exampleChannelStats(youtube);
        break;
      case '8':
        await exampleTopVideos(youtube);
        break;
      case '9':
        await exampleCompleteWorkflow(youtube);
        break;
      case '0':
        console.log('\n🚀 Running all examples...\n');
        await exampleChannelStats(youtube);
        await exampleTopVideos(youtube);
        // Add more as needed
        break;
      default:
        console.log('Invalid choice');
    }

    console.log('\n✅ All done!');
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  exampleAuthentication,
  exampleUploadVideo,
  exampleBatchUpload,
  examplePlaylistManagement,
  exampleScheduleVideos,
  exampleBulkMetadata,
  exampleTrackPerformance,
  exampleChannelStats,
  exampleTopVideos,
  exampleCompleteWorkflow
};
