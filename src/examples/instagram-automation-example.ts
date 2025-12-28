/**
 * Instagram Automation Examples
 *
 * Complete examples showing how to use InstagramAutomation for:
 * - Feed posts and carousels
 * - Reels and stories
 * - Scheduling content
 * - Auto-reply to comments
 * - Track performance metrics
 * - Hashtag research
 */

import { InstagramAutomation } from '../automation/InstagramAutomation';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// Initialize Instagram automation
const instagram = new InstagramAutomation({
  accessToken: process.env.INSTAGRAM_ACCESS_TOKEN!,
  businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!
});

/**
 * Example 1: Post a Single Image
 */
async function example1_PostImage() {
  console.log('\n=== Example 1: Post Single Image ===\n');

  try {
    const mediaId = await instagram.postFeed({
      imageUrl: 'https://picsum.photos/1080/1080',
      caption: 'Beautiful sunset! 🌅 #nature #photography #sunset',
      location: 'San Francisco, CA'
    });

    console.log('✅ Image posted successfully!');
    console.log(`Media ID: ${mediaId}`);
    console.log(`View: https://www.instagram.com/p/${mediaId}`);
  } catch (error) {
    console.error('❌ Failed to post image:', error.message);
  }
}

/**
 * Example 2: Post a Carousel (Multiple Images)
 */
async function example2_PostCarousel() {
  console.log('\n=== Example 2: Post Carousel ===\n');

  try {
    const mediaId = await instagram.postCarousel({
      media: [
        { type: 'image', url: 'https://picsum.photos/1080/1080?random=1' },
        { type: 'image', url: 'https://picsum.photos/1080/1080?random=2' },
        { type: 'image', url: 'https://picsum.photos/1080/1080?random=3' }
      ],
      caption: 'Product showcase! Swipe to see all features 👉\n\n#product #ecommerce #newlaunch',
      location: 'Los Angeles, CA'
    });

    console.log('✅ Carousel posted successfully!');
    console.log(`Media ID: ${mediaId}`);
  } catch (error) {
    console.error('❌ Failed to post carousel:', error.message);
  }
}

/**
 * Example 3: Post a Reel
 */
async function example3_PostReel() {
  console.log('\n=== Example 3: Post Reel ===\n');

  try {
    const mediaId = await instagram.postReel({
      videoUrl: 'https://example.com/tutorial-video.mp4',
      caption: 'Quick tutorial! Learn this in 60 seconds ⏱️\n\n#tutorial #howto #educational',
      coverUrl: 'https://example.com/thumbnail.jpg',
      shareToFeed: true, // Also post to main feed
      location: 'New York, NY'
    });

    console.log('✅ Reel posted successfully!');
    console.log(`Media ID: ${mediaId}`);
  } catch (error) {
    console.error('❌ Failed to post reel:', error.message);
  }
}

/**
 * Example 4: Post a Story with Link
 */
async function example4_PostStory() {
  console.log('\n=== Example 4: Post Story ===\n');

  try {
    const mediaId = await instagram.postStory({
      imageUrl: 'https://picsum.photos/1080/1920',
      link: 'https://mystore.com/sale',
      linkText: 'Shop Now',
      hashtags: ['sale', 'limited', 'fashion'],
      location: 'Miami, FL'
    });

    console.log('✅ Story posted successfully!');
    console.log(`Media ID: ${mediaId}`);
    console.log('Note: Story will expire in 24 hours');
  } catch (error) {
    console.error('❌ Failed to post story:', error.message);
  }
}

/**
 * Example 5: Schedule Posts for the Week
 */
async function example5_ScheduleWeeklyContent() {
  console.log('\n=== Example 5: Schedule Weekly Content ===\n');

  const now = new Date();
  const schedules = [];

  // Schedule posts for next 7 days at 10 AM
  for (let day = 1; day <= 7; day++) {
    const scheduledTime = new Date(now);
    scheduledTime.setDate(now.getDate() + day);
    scheduledTime.setHours(10, 0, 0, 0);

    schedules.push({
      scheduledTime,
      mediaType: 'image' as const,
      imageUrl: `https://picsum.photos/1080/1080?random=${day}`,
      caption: `Day ${day} of daily content! 📅\n\n#daily #consistency #growth`
    });
  }

  try {
    const scheduledIds = await instagram.schedulePosts(schedules);
    console.log(`✅ Scheduled ${scheduledIds.length} posts for the week!`);
    scheduledIds.forEach((id, i) => {
      console.log(`  ${i + 1}. ${id}`);
    });
  } catch (error) {
    console.error('❌ Failed to schedule posts:', error.message);
  }
}

/**
 * Example 6: Auto-Reply to Comments
 */
async function example6_AutoReply() {
  console.log('\n=== Example 6: Auto-Reply to Comments ===\n');

  // Set up auto-reply rules
  instagram.setAutoReplyRules([
    {
      trigger: 'price',
      response: 'Check our website for pricing: https://mystore.com 💰',
      caseSensitive: false
    },
    {
      trigger: 'shipping',
      response: 'We offer free shipping on orders over $50! 📦',
      caseSensitive: false
    },
    {
      trigger: 'link',
      response: 'Link in bio! 🔗 Or visit: https://mystore.com',
      caseSensitive: false
    },
    {
      trigger: 'dm',
      response: 'Sure! Sending you a DM now 📧',
      exactMatch: true
    }
  ]);

  try {
    // Post content
    const mediaId = await instagram.postFeed({
      imageUrl: 'https://picsum.photos/1080/1080',
      caption: 'New product alert! 🚨\nComment "price" for details!\n\n#newproduct #launch'
    });

    console.log(`✅ Posted: ${mediaId}`);
    console.log('Auto-reply rules configured. Monitoring comments...');

    // Monitor and auto-reply every 5 minutes
    const interval = setInterval(async () => {
      try {
        const repliesCount = await instagram.autoReply(mediaId);
        if (repliesCount > 0) {
          console.log(`✅ Sent ${repliesCount} auto-replies`);
        }
      } catch (error) {
        console.error('❌ Auto-reply error:', error.message);
      }
    }, 5 * 60 * 1000);

    // Run for 1 hour, then stop
    setTimeout(() => {
      clearInterval(interval);
      console.log('Auto-reply monitoring stopped.');
    }, 60 * 60 * 1000);

  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

/**
 * Example 7: Track Performance Metrics
 */
async function example7_TrackMetrics() {
  console.log('\n=== Example 7: Track Performance Metrics ===\n');

  try {
    // Get recent posts (replace with your actual media IDs)
    const mediaIds = ['media_id_1', 'media_id_2', 'media_id_3'];

    const metrics = await instagram.trackMetrics(mediaIds);

    console.log('Post Performance:');
    metrics.forEach((m, i) => {
      console.log(`\n${i + 1}. Media ID: ${m.mediaId}`);
      console.log(`   Likes: ${m.likes.toLocaleString()}`);
      console.log(`   Comments: ${m.comments.toLocaleString()}`);
      console.log(`   Shares: ${m.shares.toLocaleString()}`);
      console.log(`   Saves: ${m.saves.toLocaleString()}`);
      console.log(`   Reach: ${m.reach.toLocaleString()}`);
      console.log(`   Impressions: ${m.impressions.toLocaleString()}`);
      console.log(`   Engagement: ${(m.engagement * 100).toFixed(2)}%`);
    });
  } catch (error) {
    console.error('❌ Failed to get metrics:', error.message);
  }
}

/**
 * Example 8: Weekly Performance Dashboard
 */
async function example8_PerformanceDashboard() {
  console.log('\n=== Example 8: Weekly Performance Dashboard ===\n');

  try {
    // Get account metrics
    const weeklyMetrics = await instagram.getAccountMetrics('week');

    console.log('📊 Weekly Account Metrics:');
    console.log(`   Followers: ${weeklyMetrics.followers.toLocaleString()}`);
    console.log(`   Following: ${weeklyMetrics.following.toLocaleString()}`);
    console.log(`   Total Posts: ${weeklyMetrics.posts.toLocaleString()}`);
    console.log(`   Reach: ${weeklyMetrics.reach.toLocaleString()}`);
    console.log(`   Impressions: ${weeklyMetrics.impressions.toLocaleString()}`);
    console.log(`   Profile Views: ${weeklyMetrics.profileViews.toLocaleString()}`);
    console.log(`   Website Clicks: ${weeklyMetrics.websiteClicks.toLocaleString()}`);
    console.log(`   Engagement Rate: ${(weeklyMetrics.engagement * 100).toFixed(2)}%`);

    // Get top performing posts
    const topPosts = await instagram.getTopPosts(5, 'engagement');

    console.log('\n🏆 Top 5 Posts by Engagement:');
    topPosts.forEach((post, i) => {
      console.log(`\n${i + 1}. Media ID: ${post.mediaId}`);
      console.log(`   Engagement: ${(post.engagement * 100).toFixed(2)}%`);
      console.log(`   Likes: ${post.likes.toLocaleString()}`);
      console.log(`   Comments: ${post.comments.toLocaleString()}`);
    });
  } catch (error) {
    console.error('❌ Failed to get dashboard:', error.message);
  }
}

/**
 * Example 9: Hashtag Research
 */
async function example9_HashtagResearch() {
  console.log('\n=== Example 9: Hashtag Research ===\n');

  const keywords = ['fitness', 'fashion', 'food'];

  for (const keyword of keywords) {
    try {
      const hashtags = await instagram.searchHashtags(keyword);

      console.log(`\nHashtags for "${keyword}":`);
      hashtags.slice(0, 5).forEach(tag => {
        console.log(`  #${tag.name}: ${tag.mediaCount.toLocaleString()} posts`);
      });
    } catch (error) {
      console.error(`❌ Failed to search "${keyword}":`, error.message);
    }
  }
}

/**
 * Example 10: Analyze Hashtag Performance
 */
async function example10_HashtagPerformance() {
  console.log('\n=== Example 10: Hashtag Performance Analysis ===\n');

  const hashtagsToAnalyze = ['marketing', 'entrepreneur', 'smallbusiness'];

  for (const hashtag of hashtagsToAnalyze) {
    try {
      const performance = await instagram.getHashtagPerformance(hashtag);

      console.log(`\n#${performance.hashtag}:`);
      console.log(`  Total Posts: ${performance.totalPosts}`);
      console.log(`  Avg Likes: ${performance.avgLikes.toFixed(0)}`);
      console.log(`  Avg Comments: ${performance.avgComments.toFixed(0)}`);
      console.log(`  Avg Reach: ${performance.avgReach.toFixed(0)}`);
      console.log(`  Top Post: ${performance.topPost.mediaId}`);
      console.log(`    Likes: ${performance.topPost.likes.toLocaleString()}`);
    } catch (error) {
      console.error(`❌ Failed to analyze #${hashtag}:`, error.message);
    }
  }
}

/**
 * Example 11: Complete Content Campaign
 */
async function example11_ContentCampaign() {
  console.log('\n=== Example 11: Complete Content Campaign ===\n');

  try {
    // 1. Research hashtags
    console.log('Step 1: Researching hashtags...');
    const hashtags = await instagram.searchHashtags('product');
    const topHashtags = hashtags.slice(0, 5).map(h => h.name);
    console.log(`✅ Found hashtags: ${topHashtags.join(', ')}`);

    // 2. Post carousel
    console.log('\nStep 2: Posting carousel...');
    const caption = `Product launch! 🚀\n\nSwipe to see all features 👉\n\n#${topHashtags.join(' #')}`;

    const mediaId = await instagram.postCarousel({
      media: [
        { type: 'image', url: 'https://picsum.photos/1080/1080?random=10' },
        { type: 'image', url: 'https://picsum.photos/1080/1080?random=11' },
        { type: 'image', url: 'https://picsum.photos/1080/1080?random=12' }
      ],
      caption,
      location: 'San Francisco, CA'
    });
    console.log(`✅ Posted: ${mediaId}`);

    // 3. Set up auto-reply
    console.log('\nStep 3: Configuring auto-reply...');
    instagram.setAutoReplyRules([
      {
        trigger: 'info',
        response: 'Visit our website for more info: https://mystore.com 🔗',
        caseSensitive: false
      }
    ]);
    console.log('✅ Auto-reply configured');

    // 4. Monitor performance
    console.log('\nStep 4: Monitoring performance (waiting 1 hour)...');
    await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000));

    const [metrics] = await instagram.trackMetrics([mediaId]);
    console.log('\n📊 Campaign Results:');
    console.log(`   Likes: ${metrics.likes.toLocaleString()}`);
    console.log(`   Comments: ${metrics.comments.toLocaleString()}`);
    console.log(`   Engagement: ${(metrics.engagement * 100).toFixed(2)}%`);

  } catch (error) {
    console.error('❌ Campaign failed:', error.message);
  }
}

/**
 * Example 12: Scheduled Story Campaign
 */
async function example12_StorySeriesCampaign() {
  console.log('\n=== Example 12: Scheduled Story Series ===\n');

  try {
    const now = new Date();
    const stories = [];

    // Schedule 5 stories, 4 hours apart
    for (let i = 0; i < 5; i++) {
      const scheduledTime = new Date(now.getTime() + i * 4 * 60 * 60 * 1000);

      stories.push({
        scheduledTime,
        mediaType: 'image' as const,
        imageUrl: `https://picsum.photos/1080/1920?random=${20 + i}`,
        caption: `Story ${i + 1}/5\n\n#storytelling #series`
      });
    }

    const scheduledIds = await instagram.schedulePosts(stories);
    console.log(`✅ Scheduled ${scheduledIds.length} stories!`);

    stories.forEach((story, i) => {
      console.log(`  ${i + 1}. Posts at: ${story.scheduledTime.toLocaleString()}`);
    });
  } catch (error) {
    console.error('❌ Failed to schedule stories:', error.message);
  }
}

/**
 * Main function to run all examples
 */
async function main() {
  console.log('Instagram Automation Examples\n');
  console.log('Choose an example to run:');
  console.log('1. Post Single Image');
  console.log('2. Post Carousel');
  console.log('3. Post Reel');
  console.log('4. Post Story');
  console.log('5. Schedule Weekly Content');
  console.log('6. Auto-Reply to Comments');
  console.log('7. Track Performance Metrics');
  console.log('8. Weekly Performance Dashboard');
  console.log('9. Hashtag Research');
  console.log('10. Hashtag Performance Analysis');
  console.log('11. Complete Content Campaign');
  console.log('12. Scheduled Story Series');
  console.log('\n');

  // Parse command line argument
  const exampleNumber = parseInt(process.argv[2] || '1');

  switch (exampleNumber) {
    case 1:
      await example1_PostImage();
      break;
    case 2:
      await example2_PostCarousel();
      break;
    case 3:
      await example3_PostReel();
      break;
    case 4:
      await example4_PostStory();
      break;
    case 5:
      await example5_ScheduleWeeklyContent();
      break;
    case 6:
      await example6_AutoReply();
      break;
    case 7:
      await example7_TrackMetrics();
      break;
    case 8:
      await example8_PerformanceDashboard();
      break;
    case 9:
      await example9_HashtagResearch();
      break;
    case 10:
      await example10_HashtagPerformance();
      break;
    case 11:
      await example11_ContentCampaign();
      break;
    case 12:
      await example12_StorySeriesCampaign();
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
  example1_PostImage,
  example2_PostCarousel,
  example3_PostReel,
  example4_PostStory,
  example5_ScheduleWeeklyContent,
  example6_AutoReply,
  example7_TrackMetrics,
  example8_PerformanceDashboard,
  example9_HashtagResearch,
  example10_HashtagPerformance,
  example11_ContentCampaign,
  example12_StorySeriesCampaign
};
