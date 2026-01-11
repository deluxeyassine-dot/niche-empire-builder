/**
 * TikTok Automation Examples
 *
 * Complete examples showing how to use TikTokAutomation for:
 * - Video uploads
 * - Scheduling content
 * - Multi-account posting
 * - Analytics tracking
 * - Auto-engagement
 */

import { TikTokAutomation } from '../automation/TikTokAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize TikTok automation
const tiktok = new TikTokAutomation({
  clientKey: process.env.TIKTOK_CLIENT_KEY!,
  clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
  accessToken: process.env.TIKTOK_ACCESS_TOKEN,
  refreshToken: process.env.TIKTOK_REFRESH_TOKEN,
  redirectUri: process.env.TIKTOK_REDIRECT_URI
});

/**
 * Example 1: Upload a Single Video
 */
async function example1_UploadVideo() {
  console.log('\n=== Example 1: Upload Single Video ===\n');

  try {
    const publishId = await tiktok.uploadVideo({
      videoPath: './videos/my-content.mp4',
      title: 'Check out this amazing content!',
      description: 'Follow for more! 🚀',
      hashtags: ['fyp', 'viral', 'trending', 'foryou'],
      privacyLevel: 'PUBLIC_TO_EVERYONE',
      commentDisabled: false,
      duetDisabled: false,
      stitchDisabled: false
    });

    console.log('✅ Video uploaded successfully!');
    console.log(`Publish ID: ${publishId}`);

    // Get video info
    const info = await tiktok.getVideoInfo(publishId);
    console.log(`Share URL: ${info.shareUrl}`);
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

/**
 * Example 2: Schedule Videos for the Week
 */
async function example2_ScheduleWeeklyVideos() {
  console.log('\n=== Example 2: Schedule Weekly Videos ===\n');

  try {
    const now = new Date();
    const schedules = [];

    // Schedule 7 videos, one per day at 6 PM
    for (let day = 1; day <= 7; day++) {
      const postTime = new Date(now);
      postTime.setDate(now.getDate() + day);
      postTime.setHours(18, 0, 0, 0);

      schedules.push({
        videoPath: `./videos/day-${day}.mp4`,
        title: `Day ${day} of my 7-day challenge!`,
        hashtags: ['challenge', '7daychallenge', 'fyp', `day${day}`],
        scheduledTime: postTime,
        privacyLevel: 'PUBLIC_TO_EVERYONE' as const
      });
    }

    const publishIds = await tiktok.scheduleVideos(schedules);

    console.log(`✅ Scheduled ${publishIds.length} videos for the week!`);
    schedules.forEach((schedule, i) => {
      console.log(`  ${i + 1}. Day ${i + 1} - ${schedule.scheduledTime.toLocaleString()}`);
    });
  } catch (error) {
    console.error('❌ Scheduling failed:', error.message);
  }
}

/**
 * Example 3: Upload with Custom Duet/Stitch Settings
 */
async function example3_CustomSettings() {
  console.log('\n=== Example 3: Custom Duet/Stitch Settings ===\n');

  try {
    // Upload video with duet/stitch disabled
    const publishId = await tiktok.uploadVideo({
      videoPath: './videos/exclusive-content.mp4',
      title: 'Exclusive content - no duets or stitches!',
      hashtags: ['exclusive', 'original'],
      duetDisabled: true,
      stitchDisabled: true,
      commentDisabled: false
    });

    console.log('✅ Video uploaded with custom settings');
    console.log(`Publish ID: ${publishId}`);
    console.log('  Duets: Disabled');
    console.log('  Stitches: Disabled');
    console.log('  Comments: Enabled');
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

/**
 * Example 4: Enable Duet/Stitch for Existing Video
 */
async function example4_EnableDuetStitch() {
  console.log('\n=== Example 4: Enable Duet/Stitch ===\n');

  try {
    // First upload a video
    const publishId = await tiktok.uploadVideo({
      videoPath: './videos/collab-ready.mp4',
      title: 'Ready to collaborate!',
      hashtags: ['duet', 'collab', 'collaborate']
    });

    // Enable duet and stitch
    await tiktok.enableDuetStitch(publishId, {
      duetEnabled: true,
      stitchEnabled: true
    });

    console.log('✅ Collaboration features enabled!');
    console.log(`Video ID: ${publishId}`);
    console.log('  Duet: Enabled');
    console.log('  Stitch: Enabled');
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

/**
 * Example 5: Post to Multiple Accounts
 */
async function example5_MultiAccountPost() {
  console.log('\n=== Example 5: Multi-Account Posting ===\n');

  try {
    const results = await tiktok.postToMultipleAccounts({
      accounts: [
        {
          accessToken: process.env.TIKTOK_ACCOUNT1_TOKEN!,
          openId: process.env.TIKTOK_ACCOUNT1_ID!
        },
        {
          accessToken: process.env.TIKTOK_ACCOUNT2_TOKEN!,
          openId: process.env.TIKTOK_ACCOUNT2_ID!
        },
        {
          accessToken: process.env.TIKTOK_ACCOUNT3_TOKEN!,
          openId: process.env.TIKTOK_ACCOUNT3_ID!
        }
      ],
      videoPath: './videos/viral-content.mp4',
      title: 'This is going viral! 🔥',
      hashtags: ['viral', 'trending', 'fyp'],
      delayBetweenPosts: 5000 // 5 seconds between posts
    });

    const successful = results.filter(r => r.success).length;
    console.log(`✅ Posted to ${successful}/${results.length} accounts\n`);

    results.forEach((result, i) => {
      if (result.success) {
        console.log(`  ✅ Account ${i + 1}: ${result.publishId}`);
      } else {
        console.log(`  ❌ Account ${i + 1}: ${result.error}`);
      }
    });
  } catch (error) {
    console.error('❌ Multi-account posting failed:', error.message);
  }
}

/**
 * Example 6: Track Video Analytics
 */
async function example6_TrackAnalytics() {
  console.log('\n=== Example 6: Track Video Analytics ===\n');

  try {
    // Get video IDs (replace with actual IDs)
    const videoIds = ['video_id_1', 'video_id_2', 'video_id_3'];

    const analytics = await tiktok.trackAnalytics(videoIds);

    console.log('Video Performance:\n');
    analytics.forEach((a, i) => {
      console.log(`${i + 1}. ${a.title}`);
      console.log(`   Views: ${a.views.toLocaleString()}`);
      console.log(`   Likes: ${a.likes.toLocaleString()}`);
      console.log(`   Comments: ${a.comments.toLocaleString()}`);
      console.log(`   Shares: ${a.shares.toLocaleString()}`);
      console.log(`   Engagement: ${(a.engagement * 100).toFixed(2)}%`);
      console.log(`   Completion: ${(a.completionRate * 100).toFixed(0)}%\n`);
    });
  } catch (error) {
    console.error('❌ Analytics failed:', error.message);
  }
}

/**
 * Example 7: Get Account Analytics
 */
async function example7_AccountAnalytics() {
  console.log('\n=== Example 7: Account Analytics ===\n');

  try {
    // Get weekly account stats
    const weeklyStats = await tiktok.getAccountAnalytics('week');

    console.log('📊 Weekly Account Performance:\n');
    console.log(`Followers: ${weeklyStats.followers.toLocaleString()}`);
    console.log(`Following: ${weeklyStats.following.toLocaleString()}`);
    console.log(`Total Videos: ${weeklyStats.totalVideos}`);
    console.log(`Total Likes: ${weeklyStats.totalLikes.toLocaleString()}`);
    console.log(`Total Views: ${weeklyStats.totalViews.toLocaleString()}`);
    console.log(`Avg Engagement: ${(weeklyStats.avgEngagement * 100).toFixed(2)}%`);

    if (weeklyStats.followerGrowth > 0) {
      console.log(`Follower Growth: +${weeklyStats.followerGrowth.toLocaleString()}`);
    }
  } catch (error) {
    console.error('❌ Failed to get account analytics:', error.message);
  }
}

/**
 * Example 8: Get Top Performing Videos
 */
async function example8_TopVideos() {
  console.log('\n=== Example 8: Top Performing Videos ===\n');

  try {
    // Get top 10 videos by engagement
    const topVideos = await tiktok.getTopVideos(10, 'engagement');

    console.log('🏆 Top 10 Videos by Engagement:\n');
    topVideos.forEach((video, i) => {
      console.log(`${i + 1}. ${video.title}`);
      console.log(`   Views: ${video.views.toLocaleString()}`);
      console.log(`   Likes: ${video.likes.toLocaleString()}`);
      console.log(`   Engagement: ${(video.engagement * 100).toFixed(2)}%\n`);
    });

    // Also get top by views
    const topByViews = await tiktok.getTopVideos(5, 'views');
    console.log('\n👀 Top 5 Videos by Views:\n');
    topByViews.forEach((video, i) => {
      console.log(`${i + 1}. ${video.title}: ${video.views.toLocaleString()} views`);
    });
  } catch (error) {
    console.error('❌ Failed to get top videos:', error.message);
  }
}

/**
 * Example 9: Auto-Engagement Setup
 */
async function example9_AutoEngage() {
  console.log('\n=== Example 9: Auto-Engagement ===\n');

  try {
    // Set up auto-engagement rules
    tiktok.setAutoEngageRules([
      {
        hashtag: 'fitness',
        action: 'like',
        maxPerHour: 30
      },
      {
        hashtag: 'workout',
        action: 'comment',
        maxPerHour: 20,
        commentTemplates: [
          'Great workout! 💪',
          'Love this! 🔥',
          'Inspiring content! 💯',
          'Keep it up! 👏'
        ]
      },
      {
        keyword: 'fitness coach',
        action: 'follow',
        maxPerHour: 10
      }
    ]);

    console.log('✅ Auto-engagement rules configured');
    console.log('  - Like fitness videos (max 30/hour)');
    console.log('  - Comment on workout videos (max 20/hour)');
    console.log('  - Follow fitness coaches (max 10/hour)');

    // Execute auto-engagement
    console.log('\nExecuting auto-engagement...');
    const stats = await tiktok.autoEngage();

    console.log('\n📊 Auto-Engagement Results:');
    console.log(`  Likes: ${stats.likes}`);
    console.log(`  Comments: ${stats.comments}`);
    console.log(`  Follows: ${stats.follows}`);
  } catch (error) {
    console.error('❌ Auto-engagement failed:', error.message);
  }
}

/**
 * Example 10: Get Video List
 */
async function example10_VideoList() {
  console.log('\n=== Example 10: Get Video List ===\n');

  try {
    const videos = await tiktok.getVideoList(20);

    console.log(`Found ${videos.length} videos:\n`);
    videos.forEach((video, i) => {
      console.log(`${i + 1}. ${video.title}`);
      console.log(`   Duration: ${video.duration}s`);
      console.log(`   Share URL: ${video.shareUrl}`);
      console.log(`   Posted: ${new Date(video.createTime * 1000).toLocaleDateString()}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to get video list:', error.message);
  }
}

/**
 * Example 11: Complete Content Campaign
 */
async function example11_ContentCampaign() {
  console.log('\n=== Example 11: Complete Content Campaign ===\n');

  try {
    console.log('Step 1: Upload campaign video...');
    const publishId = await tiktok.uploadVideo({
      videoPath: './videos/campaign.mp4',
      title: 'Big announcement! 🎉',
      hashtags: ['announcement', 'news', 'update', 'fyp'],
      privacyLevel: 'PUBLIC_TO_EVERYONE',
      duetDisabled: false,
      stitchDisabled: false
    });

    console.log(`✅ Video uploaded: ${publishId}`);

    console.log('\nStep 2: Enable collaboration features...');
    await tiktok.enableDuetStitch(publishId, {
      duetEnabled: true,
      stitchEnabled: true
    });

    console.log('✅ Duet and Stitch enabled');

    console.log('\nStep 3: Wait 1 hour for initial engagement...');
    // In production, you'd actually wait
    // await new Promise(r => setTimeout(r, 60 * 60 * 1000));

    console.log('\nStep 4: Check performance...');
    const [analytics] = await tiktok.trackAnalytics([publishId]);

    console.log('\n📊 Campaign Results:');
    console.log(`  Views: ${analytics.views.toLocaleString()}`);
    console.log(`  Likes: ${analytics.likes.toLocaleString()}`);
    console.log(`  Comments: ${analytics.comments.toLocaleString()}`);
    console.log(`  Shares: ${analytics.shares.toLocaleString()}`);
    console.log(`  Engagement: ${(analytics.engagement * 100).toFixed(2)}%`);

    console.log('\n✅ Campaign completed successfully!');
  } catch (error) {
    console.error('❌ Campaign failed:', error.message);
  }
}

/**
 * Example 12: Scheduled Content Series
 */
async function example12_ContentSeries() {
  console.log('\n=== Example 12: Scheduled Content Series ===\n');

  try {
    const now = new Date();
    const series = [];

    // Create 30-day content series
    for (let day = 1; day <= 30; day++) {
      const postTime = new Date(now);
      postTime.setDate(now.getDate() + day);
      postTime.setHours(18, 0, 0, 0); // 6 PM daily

      series.push({
        videoPath: `./videos/series/day-${day}.mp4`,
        title: `30-Day Challenge - Day ${day}! 💪`,
        hashtags: ['30daychallenge', 'day' + day, 'fyp', 'challenge'],
        scheduledTime: postTime,
        privacyLevel: 'PUBLIC_TO_EVERYONE' as const
      });
    }

    console.log('Scheduling 30-day content series...');
    const publishIds = await tiktok.scheduleVideos(series);

    console.log(`\n✅ Scheduled ${publishIds.length} videos for 30-day series!`);
    console.log(`Start date: ${series[0].scheduledTime.toLocaleDateString()}`);
    console.log(`End date: ${series[29].scheduledTime.toLocaleDateString()}`);
    console.log(`Post time: 6:00 PM daily`);

    console.log('\nScheduled videos:');
    series.slice(0, 5).forEach((s, i) => {
      console.log(`  Day ${i + 1}: ${s.scheduledTime.toLocaleDateString()}`);
    });
    console.log('  ...');
    console.log(`  Day 30: ${series[29].scheduledTime.toLocaleDateString()}`);
  } catch (error) {
    console.error('❌ Series scheduling failed:', error.message);
  }
}

/**
 * Main function to run examples
 */
async function main() {
  console.log('TikTok Automation Examples\n');
  console.log('Choose an example to run:');
  console.log('1. Upload Single Video');
  console.log('2. Schedule Weekly Videos');
  console.log('3. Custom Duet/Stitch Settings');
  console.log('4. Enable Duet/Stitch');
  console.log('5. Multi-Account Posting');
  console.log('6. Track Video Analytics');
  console.log('7. Account Analytics');
  console.log('8. Top Performing Videos');
  console.log('9. Auto-Engagement');
  console.log('10. Get Video List');
  console.log('11. Complete Content Campaign');
  console.log('12. Scheduled Content Series');
  console.log('\n');

  // Parse command line argument
  const exampleNumber = parseInt(process.argv[2] || '1');

  switch (exampleNumber) {
    case 1:
      await example1_UploadVideo();
      break;
    case 2:
      await example2_ScheduleWeeklyVideos();
      break;
    case 3:
      await example3_CustomSettings();
      break;
    case 4:
      await example4_EnableDuetStitch();
      break;
    case 5:
      await example5_MultiAccountPost();
      break;
    case 6:
      await example6_TrackAnalytics();
      break;
    case 7:
      await example7_AccountAnalytics();
      break;
    case 8:
      await example8_TopVideos();
      break;
    case 9:
      await example9_AutoEngage();
      break;
    case 10:
      await example10_VideoList();
      break;
    case 11:
      await example11_ContentCampaign();
      break;
    case 12:
      await example12_ContentSeries();
      break;
    default:
      console.log('Invalid example number. Please choose 1-12.');
      process.exit(1);
  }

  console.log('\n✅ Example completed!');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
}

// Export examples for testing
export {
  example1_UploadVideo,
  example2_ScheduleWeeklyVideos,
  example3_CustomSettings,
  example4_EnableDuetStitch,
  example5_MultiAccountPost,
  example6_TrackAnalytics,
  example7_AccountAnalytics,
  example8_TopVideos,
  example9_AutoEngage,
  example10_VideoList,
  example11_ContentCampaign,
  example12_ContentSeries
};
