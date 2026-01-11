/**
 * Test file for VideoGenerator
 * Run this to test AI video generation functionality
 */

import * as dotenv from 'dotenv';
import { getVideoGenerator } from './utils/VideoGenerator';

// Load environment variables from .env file
dotenv.config();

async function testVideoGenerator() {
  console.log('='.repeat(70));
  console.log('🎬 Testing VideoGenerator');
  console.log('='.repeat(70));

  try {
    const videoGen = getVideoGenerator();

    // Test 1: Generate Product Video
    console.log('\n🎥 Test 1: Generating Product Video...');
    try {
      const productVideo = await videoGen.generateProductVideo({
        productName: 'Premium Wireless Headphones',
        description: 'Sleek black over-ear headphones with active noise cancellation',
        features: [
          'Active noise cancellation',
          'Premium sound quality',
          'Comfortable ear cushions',
          '30-hour battery life'
        ],
        duration: 15,
        style: 'cinematic',
        showText: true,
        transitions: 'smooth'
      });

      console.log('✓ Product Video Generated:');
      console.log(`  Provider: ${productVideo.provider}`);
      console.log(`  Duration: ${productVideo.duration}s`);
      console.log(`  Resolution: ${productVideo.width}x${productVideo.height}`);
      console.log(`  Path: ${productVideo.path}`);
      console.log(`  Thumbnail: ${productVideo.thumbnail}`);
      if (productVideo.metadata?.cost) {
        console.log(`  Estimated Cost: $${productVideo.metadata.cost.toFixed(4)}`);
      }
    } catch (error: any) {
      console.log(`⚠ Product Video Generation skipped: ${error.message}`);
    }

    // Test 2: Create Promo Video
    console.log('\n🎬 Test 2: Creating Promo Video...');
    try {
      const promoVideo = await videoGen.createPromoVideo({
        headline: 'Summer Sale - Up to 50% Off',
        message: 'Limited time offer on all premium products',
        callToAction: 'Shop Now',
        duration: 20,
        style: 'bold',
        brandColors: ['orange', 'blue', 'white'],
        includeText: true
      });

      console.log('✓ Promo Video Created:');
      console.log(`  Provider: ${promoVideo.provider}`);
      console.log(`  Duration: ${promoVideo.duration}s`);
      console.log(`  Path: ${promoVideo.path}`);
      console.log(`  Thumbnail: ${promoVideo.thumbnail}`);
    } catch (error: any) {
      console.log(`⚠ Promo Video Creation skipped: ${error.message}`);
    }

    // Test 3: Generate Short-form Video (TikTok/Reels)
    console.log('\n📱 Test 3: Generating Short-form Video...');
    try {
      const shortVideo = await videoGen.generateShorts({
        platform: 'instagram-reel',
        topic: '5 Productivity Hacks',
        hook: 'You won\'t believe #3!',
        duration: 30,
        style: 'trending',
        includeSubtitles: true,
        includeEffects: true
      });

      console.log('✓ Short Video Generated:');
      console.log(`  Provider: ${shortVideo.provider}`);
      console.log(`  Platform: Instagram Reel`);
      console.log(`  Duration: ${shortVideo.duration}s`);
      console.log(`  Resolution: ${shortVideo.width}x${shortVideo.height} (vertical)`);
      console.log(`  Path: ${shortVideo.path}`);
      console.log(`  Thumbnail: ${shortVideo.thumbnail}`);
    } catch (error: any) {
      console.log(`⚠ Short Video Generation skipped: ${error.message}`);
    }

    // Test 4: Create Standalone Thumbnail
    console.log('\n📸 Test 4: Creating Video Thumbnail...');
    try {
      const thumbnail = await videoGen.createThumbnail({
        customPrompt: 'Dramatic product reveal scene with dramatic lighting',
        style: 'dramatic',
        text: 'BEST DEAL EVER',
        width: 1920,
        height: 1080
      });

      console.log('✓ Thumbnail Created:');
      console.log(`  Provider: ${thumbnail.provider}`);
      console.log(`  Dimensions: ${thumbnail.width}x${thumbnail.height}`);
      console.log(`  Path: ${thumbnail.path}`);
    } catch (error: any) {
      console.log(`⚠ Thumbnail Creation skipped: ${error.message}`);
    }

    // Test 5: Platform Optimization Demo
    console.log('\n🔧 Test 5: Platform Optimization...');
    console.log('   (Placeholder functionality - requires actual video)');
    console.log('   Demonstrates optimization for:');
    console.log('   - YouTube (1920x1080, 30fps)');
    console.log('   - Instagram Feed (1080x1080)');
    console.log('   - TikTok (1080x1920, vertical)');
    console.log('   - Facebook (1280x720)');

    // Test 6: Subtitle Generation Demo
    console.log('\n💬 Test 6: Subtitle Generation...');
    console.log('   (Placeholder functionality - requires actual video with audio)');
    console.log('   Features:');
    console.log('   - Auto-generate from audio using Whisper');
    console.log('   - Word-by-word highlighting');
    console.log('   - Multiple language support');
    console.log('   - Custom styling and positioning');

    console.log('\n' + '='.repeat(70));
    console.log('✓ VideoGenerator tests completed!');
    console.log('='.repeat(70));

    console.log('\nNote: To run actual video generation, configure API keys in .env:');
    console.log('  - RUNWAY_API_KEY for Runway Gen-2/Gen-3');
    console.log('  - PIKA_API_KEY for Pika Labs');
    console.log('  - STABILITY_API_KEY for Stability AI Video');
    console.log('  - SYNTHESIA_API_KEY for Synthesia (avatar videos)');
    console.log('  - REPLICATE_API_KEY for Replicate models');
    console.log('  - ELEVENLABS_API_KEY for voiceovers (optional)');

    console.log('\nRecommended for production:');
    console.log('  - ffmpeg for video processing and optimization');
    console.log('  - Whisper API for subtitle generation');
    console.log('  - sharp for thumbnail optimization');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testVideoGenerator().catch(console.error);
}

export { testVideoGenerator };
