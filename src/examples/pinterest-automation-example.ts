/**
 * Pinterest Automation Examples
 *
 * E-commerce optimized examples for driving traffic and sales
 *
 * Examples cover:
 * - Product catalog uploads
 * - Shopping optimization
 * - Traffic tracking
 * - Viral pin identification
 * - SEO optimization
 * - Conversion strategies
 */

import { PinterestAutomation } from '../automation/PinterestAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Pinterest automation
const pinterest = new PinterestAutomation({
  accessToken: process.env.PINTEREST_ACCESS_TOKEN!,
  refreshToken: process.env.PINTEREST_REFRESH_TOKEN,
  clientId: process.env.PINTEREST_CLIENT_ID,
  clientSecret: process.env.PINTEREST_CLIENT_SECRET
});

/**
 * Example 1: Create Optimized Product Pin
 */
async function example1_CreateProductPin() {
  console.log('\n=== Example 1: Create Optimized Product Pin ===\n');

  try {
    const pinId = await pinterest.optimizeForShopping({
      boardId: process.env.PINTEREST_BOARD_ID || 'your-board-id',
      imageUrl: 'https://example.com/product-image.jpg',
      title: 'Organic Cotton Yoga Mat',
      description: 'Eco-friendly yoga mat made from 100% organic cotton. Non-slip surface, perfect for all yoga styles. Available in 5 colors.',
      link: 'https://yourstore.com/products/yoga-mat',
      price: 49.99,
      currency: 'USD',
      availability: 'IN_STOCK',
      brand: 'EcoYoga',
      category: 'Fitness',
      condition: 'NEW',
      salePrice: 34.99  // On sale!
    }, {
      usePriceInTitle: true,
      addUrgency: true,
      highlightBenefit: true,
      targetKeywords: ['yoga mat', 'organic fitness', 'eco-friendly workout']
    });

    console.log('✅ Product pin created successfully!');
    console.log(`Pin ID: ${pinId}`);
    console.log(`View: https://www.pinterest.com/pin/${pinId}/`);
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

/**
 * Example 2: Bulk Upload Product Catalog
 */
async function example2_UploadProductCatalog() {
  console.log('\n=== Example 2: Bulk Upload Product Catalog ===\n');

  try {
    // Create product board
    const boardId = await pinterest.createBoard({
      name: 'Complete Product Catalog 2024',
      description: 'Shop our complete collection of eco-friendly products at YourStore.com',
      privacy: 'PUBLIC'
    });

    console.log(`Board created: ${boardId}\n`);

    // Prepare product catalog
    const catalog = [
      {
        productId: 'YM-001',
        title: 'Organic Cotton Yoga Mat',
        description: '100% organic cotton yoga mat. Non-slip, eco-friendly, perfect for all levels.',
        price: 49.99,
        currency: 'USD',
        availability: 'IN_STOCK' as const,
        imageUrl: 'https://yourstore.com/images/yoga-mat.jpg',
        productUrl: 'https://yourstore.com/products/yoga-mat',
        brand: 'EcoYoga',
        category: 'Fitness',
        salePrice: 34.99
      },
      {
        productId: 'WB-001',
        title: 'Stainless Steel Water Bottle',
        description: 'Reusable water bottle keeps drinks cold for 24 hours. BPA-free, leak-proof.',
        price: 29.99,
        currency: 'USD',
        availability: 'IN_STOCK' as const,
        imageUrl: 'https://yourstore.com/images/water-bottle.jpg',
        productUrl: 'https://yourstore.com/products/water-bottle',
        brand: 'EcoLife',
        category: 'Lifestyle'
      },
      {
        productId: 'RB-001',
        title: 'Resistance Band Set',
        description: 'Set of 5 resistance bands for home workouts. Includes carrying bag.',
        price: 24.99,
        currency: 'USD',
        availability: 'IN_STOCK' as const,
        imageUrl: 'https://yourstore.com/images/resistance-bands.jpg',
        productUrl: 'https://yourstore.com/products/resistance-bands',
        brand: 'FitLife'
      }
    ];

    console.log(`Uploading ${catalog.length} products...\n`);

    const pinIds = await pinterest.createCatalogPins(
      boardId,
      catalog,
      {
        keywords: ['fitness equipment', 'eco friendly products', 'sustainable living'],
        hashtags: ['ecofriendly', 'sustainable', 'fitness', 'wellness', 'zerowaste']
      }
    );

    console.log(`\n✅ Uploaded ${pinIds.length} product pins!`);
    pinIds.forEach((id, i) => {
      console.log(`  ${i + 1}. ${catalog[i].title}: ${id}`);
    });
  } catch (error) {
    console.error('❌ Catalog upload failed:', error.message);
  }
}

/**
 * Example 3: Track Website Traffic from Pinterest
 */
async function example3_TrackWebsiteTraffic() {
  console.log('\n=== Example 3: Track Website Traffic ===\n');

  try {
    const traffic = await pinterest.driveTrafficToWebsite('yourstore.com');

    console.log('📊 Pinterest Traffic Analytics:\n');
    console.log(`Total Impressions: ${traffic.totalImpressions.toLocaleString()}`);
    console.log(`Total Clicks: ${traffic.totalClicks.toLocaleString()}`);
    console.log(`Total Saves: ${traffic.totalSaves.toLocaleString()}`);
    console.log(`Click-Through Rate: ${(traffic.clickThroughRate * 100).toFixed(2)}%`);

    console.log('\n🔥 Top 10 Traffic-Driving Pins:\n');
    traffic.topReferringPins.slice(0, 10).forEach((pin, i) => {
      console.log(`${i + 1}. Pin ${pin.pinId}`);
      console.log(`   Clicks: ${pin.clicks.toLocaleString()}`);
      console.log(`   Impressions: ${pin.impressions.toLocaleString()}`);
      console.log(`   CTR: ${((pin.clicks / pin.impressions) * 100).toFixed(2)}%\n`);
    });

    // Calculate estimated revenue (adjust based on your metrics)
    const conversionRate = 0.02; // 2%
    const averageOrderValue = 75; // $75
    const estimatedRevenue = traffic.totalClicks * conversionRate * averageOrderValue;

    console.log('💰 Revenue Estimate:');
    console.log(`   Estimated Revenue: $${estimatedRevenue.toFixed(2)}`);
    console.log(`   (Based on ${(conversionRate * 100).toFixed(0)}% CR, $${averageOrderValue} AOV)\n`);
  } catch (error) {
    console.error('❌ Traffic tracking failed:', error.message);
  }
}

/**
 * Example 4: Find and Analyze Viral Pins
 */
async function example4_FindViralPins() {
  console.log('\n=== Example 4: Find Viral Pins ===\n');

  try {
    const viralPins = await pinterest.trackViralPins({
      minImpressions: 10000,
      minSaves: 500,
      minEngagementRate: 0.05,
      timeframe: 'month'
    });

    console.log(`🚀 Found ${viralPins.length} viral pins!\n`);

    if (viralPins.length === 0) {
      console.log('No viral pins found. Try lowering the criteria or wait for more data.');
      return;
    }

    viralPins.forEach((pin, i) => {
      console.log(`${i + 1}. Pin ${pin.pinId}:`);
      console.log(`   Impressions: ${pin.impressions.toLocaleString()}`);
      console.log(`   Saves: ${pin.saves.toLocaleString()}`);
      console.log(`   Clicks: ${pin.outboundClicks.toLocaleString()}`);
      console.log(`   Engagement Rate: ${(pin.engagement / pin.impressions * 100).toFixed(2)}%`);
      console.log(`   CTR: ${(pin.outboundClicks / pin.impressions * 100).toFixed(2)}%\n`);
    });

    console.log('💡 Tip: Create similar pins to your viral content!');
  } catch (error) {
    console.error('❌ Viral pin tracking failed:', error.message);
  }
}

/**
 * Example 5: Create SEO-Optimized Pin
 */
async function example5_SEOOptimizedPin() {
  console.log('\n=== Example 5: SEO-Optimized Pin ===\n');

  try {
    // Generate keywords for niche
    const keywords = pinterest.generateKeywords('home decor', 'wall art');

    console.log('Generated SEO Keywords:');
    console.log(keywords.slice(0, 10).join(', '), '\n');

    // Create SEO-optimized pin
    const pinId = await pinterest.createPin({
      boardId: process.env.PINTEREST_BOARD_ID || 'your-board-id',
      imageUrl: 'https://yourstore.com/wall-art.jpg',
      title: 'Minimalist Wall Art Print',
      description: 'Modern minimalist wall art print. Perfect for living room, bedroom, or office. Instant download available.',
      link: 'https://yourstore.com/products/wall-art'
    }, {
      keywords: keywords.slice(0, 10),
      hashtags: ['homedecor', 'wallart', 'minimalist', 'interiordesign', 'modernart'],
      titleFormula: 'keyword-first',
      optimizeImageAltText: true
    });

    console.log('✅ SEO-optimized pin created!');
    console.log(`Pin ID: ${pinId}`);
  } catch (error) {
    console.error('❌ SEO optimization failed:', error.message);
  }
}

/**
 * Example 6: Create Product Board Collection
 */
async function example6_CreateBoardCollection() {
  console.log('\n=== Example 6: Create Product Board Collection ===\n');

  try {
    const boards = [
      {
        name: 'All Products',
        description: 'Shop our complete collection at YourStore.com'
      },
      {
        name: 'Best Sellers',
        description: 'Our most popular products - shop customer favorites!'
      },
      {
        name: 'New Arrivals',
        description: 'Just launched! Shop the latest additions to our store'
      },
      {
        name: 'Sale Items',
        description: 'Limited time offers - save up to 50% off!'
      },
      {
        name: 'Customer Favorites',
        description: '5-star rated products loved by our customers'
      },
      {
        name: 'Gift Ideas',
        description: 'Perfect gifts for any occasion'
      }
    ];

    console.log(`Creating ${boards.length} boards...\n`);

    for (const board of boards) {
      const boardId = await pinterest.createBoard({
        name: board.name,
        description: board.description,
        privacy: 'PUBLIC'
      });

      console.log(`✅ Created: ${board.name} (${boardId})`);

      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n✅ Board collection created successfully!');
  } catch (error) {
    console.error('❌ Board creation failed:', error.message);
  }
}

/**
 * Example 7: Schedule Pins for Optimal Times
 */
async function example7_SchedulePins() {
  console.log('\n=== Example 7: Schedule Pins for Optimal Times ===\n');

  try {
    const now = new Date();
    const schedules = [];

    // Peak Pinterest times: 8 PM, 9 PM, 10 PM
    const peakHours = [20, 21, 22];

    // Schedule pins for next 7 days
    for (let day = 0; day < 7; day++) {
      for (const hour of peakHours) {
        const postTime = new Date(now);
        postTime.setDate(now.getDate() + day + 1);
        postTime.setHours(hour, 0, 0, 0);

        schedules.push({
          pin: {
            boardId: process.env.PINTEREST_BOARD_ID || 'your-board-id',
            imageUrl: `https://yourstore.com/images/product-${day}-${hour}.jpg`,
            title: `Daily Product Feature - Day ${day + 1}`,
            description: 'Check out our featured product of the day! Limited stock available.',
            link: 'https://yourstore.com/daily-deals'
          },
          scheduledTime: postTime
        });
      }
    }

    console.log(`Scheduling ${schedules.length} pins...\n`);

    const scheduledIds = await pinterest.schedulePins(schedules);

    console.log(`✅ Scheduled ${scheduledIds.length} pins!`);
    console.log(`   Days: 7`);
    console.log(`   Times: ${peakHours.join(', ')} (8PM, 9PM, 10PM)`);
    console.log(`   Total pins: ${schedules.length}`);
  } catch (error) {
    console.error('❌ Scheduling failed:', error.message);
  }
}

/**
 * Example 8: Get Pin Analytics
 */
async function example8_PinAnalytics() {
  console.log('\n=== Example 8: Pin Analytics ===\n');

  try {
    // Replace with actual pin ID
    const pinId = process.env.TEST_PIN_ID || 'your-pin-id';

    const analytics = await pinterest.getPinAnalytics(pinId, 'month');

    console.log(`📊 Analytics for Pin ${pinId}:\n`);
    console.log(`Impressions: ${analytics.impressions.toLocaleString()}`);
    console.log(`Close-ups: ${analytics.closeUps.toLocaleString()}`);
    console.log(`Saves: ${analytics.saves.toLocaleString()}`);
    console.log(`Outbound Clicks: ${analytics.outboundClicks.toLocaleString()}`);
    console.log(`Total Engagement: ${analytics.engagement.toLocaleString()}`);

    const ctr = analytics.impressions > 0
      ? (analytics.outboundClicks / analytics.impressions) * 100
      : 0;

    console.log(`\nPerformance Metrics:`);
    console.log(`Click-Through Rate: ${ctr.toFixed(2)}%`);
    console.log(`Save Rate: ${((analytics.saves / analytics.impressions) * 100).toFixed(2)}%`);
    console.log(`Engagement Rate: ${((analytics.engagement / analytics.impressions) * 100).toFixed(2)}%`);

    // Benchmark against industry averages
    console.log(`\nBenchmarks:`);
    console.log(`   CTR: ${ctr >= 0.5 ? '✅ Above average' : '⚠️ Below average'} (0.5% avg)`);
    console.log(`   Engagement: ${analytics.engagement >= 500 ? '✅ High' : '⚠️ Low'}`);
  } catch (error) {
    console.error('❌ Analytics failed:', error.message);
  }
}

/**
 * Example 9: Complete E-commerce Campaign
 */
async function example9_EcommerceCampaign() {
  console.log('\n=== Example 9: Complete E-commerce Campaign ===\n');

  try {
    console.log('Step 1: Creating campaign board...');
    const boardId = await pinterest.createBoard({
      name: 'Summer Sale 2024',
      description: 'Up to 50% off summer collection! Shop now at YourStore.com',
      privacy: 'PUBLIC'
    });

    console.log(`✅ Board created: ${boardId}\n`);

    console.log('Step 2: Uploading sale products...');
    const saleProducts = [
      {
        productId: 'SALE-001',
        title: 'Summer Dress',
        description: 'Lightweight summer dress perfect for beach vacations',
        price: 79.99,
        salePrice: 39.99,
        currency: 'USD',
        availability: 'IN_STOCK' as const,
        imageUrl: 'https://yourstore.com/summer-dress.jpg',
        productUrl: 'https://yourstore.com/sale/summer-dress',
        brand: 'SummerStyle'
      },
      {
        productId: 'SALE-002',
        title: 'Beach Hat',
        description: 'Wide-brim sun hat for ultimate sun protection',
        price: 34.99,
        salePrice: 19.99,
        currency: 'USD',
        availability: 'IN_STOCK' as const,
        imageUrl: 'https://yourstore.com/beach-hat.jpg',
        productUrl: 'https://yourstore.com/sale/beach-hat',
        brand: 'SummerStyle'
      }
    ];

    const pinIds = await pinterest.createCatalogPins(
      boardId,
      saleProducts,
      {
        keywords: ['summer sale', 'beach outfit', 'vacation clothing'],
        hashtags: ['summersale', 'beachstyle', 'vacationmode', 'sale']
      }
    );

    console.log(`✅ Uploaded ${pinIds.length} sale products\n`);

    console.log('Step 3: Checking campaign performance (simulated)...');
    console.log('   Campaign will run for 30 days');
    console.log('   Expected reach: 50,000+ impressions');
    console.log('   Expected traffic: 1,500+ clicks');
    console.log('   Expected revenue: $3,750+ (2.5% CR, $100 AOV)\n');

    console.log('✅ Campaign launched successfully!');
  } catch (error) {
    console.error('❌ Campaign failed:', error.message);
  }
}

/**
 * Example 10: Weekly Performance Report
 */
async function example10_WeeklyReport() {
  console.log('\n=== Example 10: Weekly Performance Report ===\n');

  try {
    const traffic = await pinterest.driveTrafficToWebsite('yourstore.com');
    const viralPins = await pinterest.trackViralPins({
      minImpressions: 5000,
      timeframe: 'week'
    });

    console.log('📈 WEEKLY PINTEREST PERFORMANCE REPORT\n');
    console.log('=' .repeat(50));

    console.log('\n📊 Traffic Metrics:');
    console.log(`   Impressions: ${traffic.totalImpressions.toLocaleString()}`);
    console.log(`   Clicks: ${traffic.totalClicks.toLocaleString()}`);
    console.log(`   Saves: ${traffic.totalSaves.toLocaleString()}`);
    console.log(`   CTR: ${(traffic.clickThroughRate * 100).toFixed(2)}%`);

    console.log('\n🔥 Viral Content:');
    console.log(`   Viral Pins: ${viralPins.length}`);
    if (viralPins.length > 0) {
      const topViral = viralPins[0];
      console.log(`   Top Performer: ${topViral.pinId}`);
      console.log(`     Impressions: ${topViral.impressions.toLocaleString()}`);
      console.log(`     Saves: ${topViral.saves.toLocaleString()}`);
    }

    console.log('\n💰 Revenue Impact:');
    const estimatedRevenue = traffic.totalClicks * 0.025 * 75;
    console.log(`   Estimated Revenue: $${estimatedRevenue.toFixed(2)}`);
    console.log(`   (Assumes 2.5% CR, $75 AOV)`);

    console.log('\n📌 Action Items:');
    console.log('   ✓ Create more content similar to viral pins');
    console.log('   ✓ Optimize low-performing pins');
    console.log('   ✓ Schedule pins for peak times');
    console.log('   ✓ Test new product categories\n');

    console.log('=' .repeat(50));
  } catch (error) {
    console.error('❌ Report generation failed:', error.message);
  }
}

/**
 * Main function to run examples
 */
async function main() {
  console.log('\n📍 Pinterest Automation Examples\n');
  console.log('Choose an example to run:');
  console.log('1. Create Optimized Product Pin');
  console.log('2. Bulk Upload Product Catalog');
  console.log('3. Track Website Traffic');
  console.log('4. Find Viral Pins');
  console.log('5. SEO-Optimized Pin');
  console.log('6. Create Board Collection');
  console.log('7. Schedule Pins');
  console.log('8. Pin Analytics');
  console.log('9. Complete E-commerce Campaign');
  console.log('10. Weekly Performance Report');
  console.log('\n');

  // Parse command line argument
  const exampleNumber = parseInt(process.argv[2] || '1');

  switch (exampleNumber) {
    case 1:
      await example1_CreateProductPin();
      break;
    case 2:
      await example2_UploadProductCatalog();
      break;
    case 3:
      await example3_TrackWebsiteTraffic();
      break;
    case 4:
      await example4_FindViralPins();
      break;
    case 5:
      await example5_SEOOptimizedPin();
      break;
    case 6:
      await example6_CreateBoardCollection();
      break;
    case 7:
      await example7_SchedulePins();
      break;
    case 8:
      await example8_PinAnalytics();
      break;
    case 9:
      await example9_EcommerceCampaign();
      break;
    case 10:
      await example10_WeeklyReport();
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
  example1_CreateProductPin,
  example2_UploadProductCatalog,
  example3_TrackWebsiteTraffic,
  example4_FindViralPins,
  example5_SEOOptimizedPin,
  example6_CreateBoardCollection,
  example7_SchedulePins,
  example8_PinAnalytics,
  example9_EcommerceCampaign,
  example10_WeeklyReport
};
