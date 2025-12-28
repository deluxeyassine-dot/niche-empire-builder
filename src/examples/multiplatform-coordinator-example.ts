/**
 * Multi-Platform Coordinator Examples
 *
 * Comprehensive examples showing how to manage all social media platforms
 * from one unified system.
 *
 * Examples cover:
 * - Unified posting across platforms
 * - Cross-platform analytics
 * - Content synchronization
 * - Coordinated scheduling
 * - Performance optimization
 */

import { MultiPlatformCoordinator } from '../automation/MultiPlatformCoordinator';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize the coordinator with all platforms
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
    accessToken: process.env.TIKTOK_ACCESS_TOKEN,
    refreshToken: process.env.TIKTOK_REFRESH_TOKEN
  },
  pinterest: {
    accessToken: process.env.PINTEREST_ACCESS_TOKEN!,
    clientId: process.env.PINTEREST_CLIENT_ID,
    clientSecret: process.env.PINTEREST_CLIENT_SECRET
  }
});

/**
 * Example 1: Post to All Platforms
 */
async function example1_PostToAllPlatforms() {
  console.log('\n=== Example 1: Post to All Platforms ===\n');

  try {
    const results = await coordinator.postToAllPlatforms({
      content: {
        title: 'New Product Launch! 🚀',
        description: `
          Introducing our latest innovation - the SmartWidget Pro!

          Features:
          ✨ 3x faster performance
          💪 Built to last
          🌍 Eco-friendly materials
          💰 Special launch price: $99.99

          Limited stock available - order now!
        `,
        media: {
          type: 'image',
          url: 'https://yourstore.com/images/smartwidget-pro.jpg',
          width: 1200,
          height: 1200
        },
        link: 'https://yourstore.com/products/smartwidget-pro',
        tags: ['newproduct', 'innovation', 'tech', 'gadgets', 'launch'],
        price: 99.99,
        currency: 'USD',
        availability: 'IN_STOCK',
        productId: 'SMART-001'
      },
      crossPromote: true,
      adaptContent: true
    });

    console.log('\n✅ Posted to all platforms!\n');

    results.forEach((postId, platform) => {
      console.log(`${platform}: ${postId}`);
    });

    console.log(`\nTotal platforms: ${results.size}`);
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

/**
 * Example 2: Track Unified Analytics
 */
async function example2_UnifiedAnalytics() {
  console.log('\n=== Example 2: Unified Analytics ===\n');

  try {
    const analytics = await coordinator.trackAllMetrics('week');

    console.log('📊 WEEKLY PERFORMANCE DASHBOARD\n');
    console.log('═══════════════════════════════════════\n');

    console.log('🌐 OVERALL METRICS:');
    console.log(`   Total Reach: ${analytics.totalReach.toLocaleString()}`);
    console.log(`   Total Engagement: ${analytics.totalEngagement.toLocaleString()}`);
    console.log(`   Total Clicks: ${analytics.totalClicks.toLocaleString()}`);
    console.log(`   Avg Engagement Rate: ${(analytics.averageEngagementRate * 100).toFixed(2)}%`);
    console.log(`   Top Platform: ${analytics.topPlatform} 🏆\n`);

    console.log('📈 PLATFORM BREAKDOWN:\n');

    analytics.platforms.forEach(p => {
      const engagementRate = p.impressions > 0
        ? (p.engagement / p.impressions) * 100
        : 0;

      console.log(`${p.platform.toUpperCase()}:`);
      console.log(`   Impressions: ${p.impressions.toLocaleString()}`);
      console.log(`   Engagement: ${p.engagement.toLocaleString()}`);
      console.log(`   Rate: ${engagementRate.toFixed(2)}%`);

      if (p.clicks !== undefined) {
        console.log(`   Clicks: ${p.clicks.toLocaleString()}`);
      }
      if (p.followers !== undefined) {
        console.log(`   Followers: ${p.followers.toLocaleString()}`);
      }
      console.log('');
    });

    console.log('💡 RECOMMENDATIONS:\n');
    analytics.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });

    console.log('\n═══════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Analytics failed:', error.message);
  }
}

/**
 * Example 3: Cross-Platform Content Sync
 */
async function example3_ContentSync() {
  console.log('\n=== Example 3: Content Sync ===\n');

  try {
    console.log('Scenario: Viral TikTok video, share to other platforms\n');

    // Simulate having a viral TikTok post
    const viralTikTokId = 'viral-video-123';

    const synced = await coordinator.syncContent(
      {
        platform: 'tiktok',
        postId: viralTikTokId
      },
      ['youtube', 'instagram', 'pinterest']
    );

    console.log('✅ Content synced!\n');

    synced.forEach((postId, platform) => {
      console.log(`   ${platform}: ${postId}`);
    });

    console.log(`\nSynced to ${synced.size} additional platforms`);
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }
}

/**
 * Example 4: Coordinated Scheduling
 */
async function example4_CoordinatedScheduling() {
  console.log('\n=== Example 4: Coordinated Scheduling ===\n');

  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Optimal times for each platform
    const schedules = [
      {
        platform: 'youtube' as const,
        time: new Date(tomorrow.setHours(14, 0, 0, 0)) // 2 PM
      },
      {
        platform: 'instagram' as const,
        time: new Date(tomorrow.setHours(19, 0, 0, 0)) // 7 PM
      },
      {
        platform: 'tiktok' as const,
        time: new Date(tomorrow.setHours(21, 0, 0, 0)) // 9 PM
      },
      {
        platform: 'pinterest' as const,
        time: new Date(tomorrow.setHours(20, 0, 0, 0)) // 8 PM
      }
    ];

    const scheduled = await coordinator.scheduleAcrossAll({
      content: {
        title: 'Weekly Update: What\'s New',
        description: 'Check out this week\'s updates and new features!',
        media: {
          type: 'image',
          url: 'https://example.com/weekly-update.jpg'
        },
        link: 'https://yourstore.com/updates',
        tags: ['update', 'news', 'weekly']
      },
      platforms: ['youtube', 'instagram', 'tiktok', 'pinterest'],
      schedules,
      stagger: 15 // 15 minutes between posts
    });

    console.log('✅ Content scheduled across all platforms!\n');

    scheduled.forEach((postIds, platform) => {
      console.log(`${platform}:`);
      postIds.forEach((id, i) => {
        console.log(`   Post ${i + 1}: ${id}`);
      });
    });

    console.log('\n📅 Schedule Summary:');
    schedules.forEach(s => {
      console.log(`   ${s.platform}: ${s.time.toLocaleString()}`);
    });
  } catch (error) {
    console.error('❌ Scheduling failed:', error.message);
  }
}

/**
 * Example 5: Cross-Promotion
 */
async function example5_CrossPromotion() {
  console.log('\n=== Example 5: Cross-Promotion ===\n');

  try {
    console.log('Scenario: New YouTube video, promote on other platforms\n');

    const promos = await coordinator.crossPromote({
      mainPlatform: 'youtube',
      postId: 'new-youtube-video-id',
      promotionPlatforms: ['instagram', 'tiktok', 'pinterest'],
      message: '🎥 New video is live! Watch the full tutorial on YouTube 👉'
    });

    console.log('✅ Cross-promotion complete!\n');

    promos.forEach((postId, platform) => {
      console.log(`   Promoted on ${platform}: ${postId}`);
    });

    console.log(`\nPromoted on ${promos.size} platforms`);
  } catch (error) {
    console.error('❌ Cross-promotion failed:', error.message);
  }
}

/**
 * Example 6: Platform Optimization
 */
async function example6_PlatformOptimization() {
  console.log('\n=== Example 6: Platform Optimization ===\n');

  try {
    const optimizations = await coordinator.optimizePerPlatform();

    console.log('🎯 OPTIMIZATION RECOMMENDATIONS\n');
    console.log('═══════════════════════════════════════\n');

    optimizations.forEach((opt, platform) => {
      console.log(`${platform.toUpperCase()}:\n`);

      console.log('   Current Performance:');
      console.log(`      Impressions: ${opt.currentPerformance.impressions.toLocaleString()}`);
      console.log(`      Engagement: ${opt.currentPerformance.engagement.toLocaleString()}\n`);

      console.log('   Recommendations:');
      opt.recommendations.forEach(rec => {
        console.log(`      ${rec.type.toUpperCase()}: ${rec.suggestion}`);
        console.log(`         Expected: ${rec.expectedImprovement}\n`);
      });
    });

    console.log('═══════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
  }
}

/**
 * Example 7: Best Platform Detection
 */
async function example7_BestPlatformDetection() {
  console.log('\n=== Example 7: Best Platform Detection ===\n');

  try {
    console.log('Finding optimal platforms for different content types...\n');

    const bestForVideo = await coordinator.getBestPlatformFor('video');
    const bestForImage = await coordinator.getBestPlatformFor('image');
    const bestForProduct = await coordinator.getBestPlatformFor('product');

    console.log('📊 Recommended Platforms:\n');
    console.log(`   Video Content → ${bestForVideo}`);
    console.log(`   Image Content → ${bestForImage}`);
    console.log(`   Product Content → ${bestForProduct}`);

    console.log('\n💡 Using best platform for product post...\n');

    // Post product to optimal platform
    const results = await coordinator.postToAllPlatforms({
      content: {
        title: 'Premium Organic Cotton T-Shirt',
        description: 'Soft, sustainable, perfect fit. Available in 10 colors.',
        media: {
          type: 'image',
          url: 'https://yourstore.com/tshirt.jpg'
        },
        link: 'https://yourstore.com/products/tshirt',
        tags: ['organic', 'sustainable', 'fashion'],
        price: 29.99,
        currency: 'USD',
        availability: 'IN_STOCK'
      },
      platforms: [bestForProduct], // Only best platform
      adaptContent: true
    });

    console.log(`✅ Posted to ${bestForProduct}: ${results.get(bestForProduct)}`);
  } catch (error) {
    console.error('❌ Detection failed:', error.message);
  }
}

/**
 * Example 8: Complete Product Launch Campaign
 */
async function example8_ProductLaunchCampaign() {
  console.log('\n=== Example 8: Complete Product Launch Campaign ===\n');

  try {
    console.log('🚀 PRODUCT LAUNCH CAMPAIGN\n');
    console.log('Product: UltraWidget Pro\n');

    // Step 1: Create product content
    const productContent = {
      title: 'Introducing UltraWidget Pro',
      description: `
        Revolutionary widget technology!

        ✨ 3x faster than competitors
        💪 Lifetime warranty
        🌍 100% sustainable materials
        🎁 Limited launch offer: Only $99.99

        Order now and get FREE shipping!
      `,
      media: {
        type: 'image',
        url: 'https://yourstore.com/ultrawidget-pro.jpg',
        width: 1200,
        height: 1200
      },
      link: 'https://yourstore.com/ultrawidget-pro',
      tags: ['newproduct', 'innovation', 'tech', 'sale', 'limitedoffer'],
      price: 99.99,
      currency: 'USD',
      availability: 'IN_STOCK',
      productId: 'ULTRA-PRO-001'
    };

    // Step 2: Post to all platforms
    console.log('Step 1: Posting to all platforms...\n');

    const postResults = await coordinator.postToAllPlatforms({
      content: productContent,
      crossPromote: true,
      adaptContent: true
    });

    console.log(`✅ Posted to ${postResults.size} platforms\n`);

    // Step 3: Wait for initial engagement (simulated)
    console.log('Step 2: Monitoring initial engagement (simulated)...\n');

    // Step 4: Get analytics
    console.log('Step 3: Checking campaign performance...\n');

    const analytics = await coordinator.trackAllMetrics('day');

    console.log('📊 Campaign Performance:\n');
    console.log(`   Total Reach: ${analytics.totalReach.toLocaleString()}`);
    console.log(`   Total Engagement: ${analytics.totalEngagement.toLocaleString()}`);
    console.log(`   Total Clicks: ${analytics.totalClicks.toLocaleString()}`);
    console.log(`   Top Platform: ${analytics.topPlatform}\n`);

    // Step 5: Cross-promote top performer
    console.log('Step 4: Cross-promoting top performer...\n');

    const topPost = postResults.get(analytics.topPlatform);
    if (topPost) {
      const otherPlatforms = coordinator.getEnabledPlatforms()
        .filter(p => p !== analytics.topPlatform);

      await coordinator.crossPromote({
        mainPlatform: analytics.topPlatform,
        postId: topPost,
        promotionPlatforms: otherPlatforms,
        message: `🔥 Going viral on ${analytics.topPlatform}! Check out our new product 👉`
      });

      console.log(`✅ Cross-promoted from ${analytics.topPlatform}\n`);
    }

    // Step 6: Calculate ROI
    const estimatedClicks = analytics.totalClicks;
    const conversionRate = 0.025; // 2.5%
    const averageOrderValue = 99.99;
    const estimatedRevenue = estimatedClicks * conversionRate * averageOrderValue;

    console.log('💰 Campaign ROI:');
    console.log(`   Estimated Clicks: ${estimatedClicks.toLocaleString()}`);
    console.log(`   Conversion Rate: ${(conversionRate * 100).toFixed(1)}%`);
    console.log(`   Estimated Revenue: $${estimatedRevenue.toFixed(2)}\n`);

    console.log('✅ Campaign Complete!\n');
  } catch (error) {
    console.error('❌ Campaign failed:', error.message);
  }
}

/**
 * Example 9: Weekly Content Calendar
 */
async function example9_WeeklyContentCalendar() {
  console.log('\n=== Example 9: Weekly Content Calendar ===\n');

  try {
    const now = new Date();
    const contentPlan = [
      {
        day: 'Monday',
        content: {
          title: 'Monday Motivation: Start Strong!',
          description: '5 tips to crush your week 💪',
          media: { type: 'image' as const, url: 'https://example.com/monday.jpg' },
          tags: ['motivation', 'monday', 'productivity']
        },
        time: { hour: 9, minute: 0 }
      },
      {
        day: 'Wednesday',
        content: {
          title: 'Product Spotlight: Customer Favorite',
          description: 'See why customers love this product!',
          media: { type: 'image' as const, url: 'https://example.com/product.jpg' },
          tags: ['product', 'showcase'],
          price: 49.99,
          currency: 'USD'
        },
        time: { hour: 14, minute: 0 }
      },
      {
        day: 'Friday',
        content: {
          title: 'Friday Feeling: Weekend Prep',
          description: 'Get ready for an amazing weekend!',
          media: { type: 'image' as const, url: 'https://example.com/friday.jpg' },
          tags: ['friday', 'weekend', 'lifestyle']
        },
        time: { hour: 16, minute: 0 }
      }
    ];

    console.log('📅 Scheduling weekly content calendar...\n');

    for (const plan of contentPlan) {
      const scheduleDate = new Date(now);
      const dayOffset = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(plan.day);
      scheduleDate.setDate(now.getDate() + (dayOffset - now.getDay() + 7) % 7);
      scheduleDate.setHours(plan.time.hour, plan.time.minute, 0, 0);

      await coordinator.postToAllPlatforms({
        content: plan.content,
        scheduleTime: scheduleDate,
        crossPromote: true,
        adaptContent: true
      });

      console.log(`✅ ${plan.day}: Scheduled for ${scheduleDate.toLocaleString()}`);
    }

    console.log('\n✅ Week planned!\n');
  } catch (error) {
    console.error('❌ Calendar creation failed:', error.message);
  }
}

/**
 * Example 10: Performance Dashboard
 */
async function example10_PerformanceDashboard() {
  console.log('\n=== Example 10: Performance Dashboard ===\n');

  try {
    const daily = await coordinator.trackAllMetrics('day');
    const weekly = await coordinator.trackAllMetrics('week');
    const monthly = await coordinator.trackAllMetrics('month');

    console.log('═══════════════════════════════════════════');
    console.log('      SOCIAL MEDIA PERFORMANCE DASHBOARD');
    console.log('═══════════════════════════════════════════\n');

    console.log('📊 TIMEFRAME COMPARISON:\n');

    console.log('Daily:');
    console.log(`   Reach: ${daily.totalReach.toLocaleString()}`);
    console.log(`   Engagement: ${daily.totalEngagement.toLocaleString()}`);
    console.log(`   Clicks: ${daily.totalClicks.toLocaleString()}\n`);

    console.log('Weekly:');
    console.log(`   Reach: ${weekly.totalReach.toLocaleString()}`);
    console.log(`   Engagement: ${weekly.totalEngagement.toLocaleString()}`);
    console.log(`   Clicks: ${weekly.totalClicks.toLocaleString()}\n`);

    console.log('Monthly:');
    console.log(`   Reach: ${monthly.totalReach.toLocaleString()}`);
    console.log(`   Engagement: ${monthly.totalEngagement.toLocaleString()}`);
    console.log(`   Clicks: ${monthly.totalClicks.toLocaleString()}\n`);

    console.log('🏆 TOP PLATFORMS:\n');
    console.log(`   Best Overall: ${monthly.topPlatform}`);
    console.log(`   Engagement Rate: ${(monthly.averageEngagementRate * 100).toFixed(2)}%\n`);

    console.log('💡 ACTION ITEMS:\n');
    monthly.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });

    console.log('\n═══════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Dashboard failed:', error.message);
  }
}

/**
 * Main function to run examples
 */
async function main() {
  console.log('\n🌐 Multi-Platform Coordinator Examples\n');
  console.log(`Enabled platforms: ${coordinator.getEnabledPlatforms().join(', ')}\n`);

  console.log('Choose an example to run:');
  console.log('1. Post to All Platforms');
  console.log('2. Unified Analytics');
  console.log('3. Content Sync');
  console.log('4. Coordinated Scheduling');
  console.log('5. Cross-Promotion');
  console.log('6. Platform Optimization');
  console.log('7. Best Platform Detection');
  console.log('8. Complete Product Launch Campaign');
  console.log('9. Weekly Content Calendar');
  console.log('10. Performance Dashboard');
  console.log('\n');

  // Parse command line argument
  const exampleNumber = parseInt(process.argv[2] || '1');

  switch (exampleNumber) {
    case 1:
      await example1_PostToAllPlatforms();
      break;
    case 2:
      await example2_UnifiedAnalytics();
      break;
    case 3:
      await example3_ContentSync();
      break;
    case 4:
      await example4_CoordinatedScheduling();
      break;
    case 5:
      await example5_CrossPromotion();
      break;
    case 6:
      await example6_PlatformOptimization();
      break;
    case 7:
      await example7_BestPlatformDetection();
      break;
    case 8:
      await example8_ProductLaunchCampaign();
      break;
    case 9:
      await example9_WeeklyContentCalendar();
      break;
    case 10:
      await example10_PerformanceDashboard();
      break;
    default:
      console.log('Invalid example number. Please choose 1-10.');
      process.exit(1);
  }

  console.log('\n✅ Example completed!\n');
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
  example1_PostToAllPlatforms,
  example2_UnifiedAnalytics,
  example3_ContentSync,
  example4_CoordinatedScheduling,
  example5_CrossPromotion,
  example6_PlatformOptimization,
  example7_BestPlatformDetection,
  example8_ProductLaunchCampaign,
  example9_WeeklyContentCalendar,
  example10_PerformanceDashboard
};
