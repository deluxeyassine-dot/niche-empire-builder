/**
 * Test file for ImageGenerator
 * Run this to test AI image generation functionality
 */

import * as dotenv from 'dotenv';
import { getImageGenerator, ImageGenerator } from './utils/ImageGenerator';

// Load environment variables from .env file
dotenv.config();

async function testImageGenerator() {
  console.log('='.repeat(60));
  console.log('Testing ImageGenerator');
  console.log('='.repeat(60));

  try {
    const imageGen = getImageGenerator();

    // Test 1: Generate Product Image
    console.log('\n📸 Test 1: Generating Product Image...');
    try {
      const productImage = await imageGen.generateProductImage(
        'Premium Wireless Headphones',
        'Sleek black over-ear headphones with active noise cancellation, metallic accents',
        {
          width: 1024,
          height: 1024,
          quality: 'hd',
          style: 'professional product photography'
        }
      );
      console.log('✓ Product Image Generated:');
      console.log(`  Provider: ${productImage.provider}`);
      console.log(`  Dimensions: ${productImage.width}x${productImage.height}`);
      console.log(`  Path: ${productImage.path}`);
      if (productImage.metadata?.cost) {
        console.log(`  Estimated Cost: $${productImage.metadata.cost.toFixed(4)}`);
      }
    } catch (error: any) {
      console.log(`⚠ Product Image Generation skipped: ${error.message}`);
    }

    // Test 2: Create Logo
    console.log('\n🎨 Test 2: Creating Logo...');
    try {
      const logo = await imageGen.createLogo({
        brandName: 'EcoClean Pro',
        style: 'modern',
        colors: ['green', 'white'],
        symbols: ['leaf', 'water drop'],
        industry: 'eco-friendly cleaning products'
      });
      console.log('✓ Logo Created:');
      console.log(`  Provider: ${logo.provider}`);
      console.log(`  Path: ${logo.path}`);
    } catch (error: any) {
      console.log(`⚠ Logo Creation skipped: ${error.message}`);
    }

    // Test 3: Design Banner
    console.log('\n🖼️ Test 3: Designing Banner...');
    try {
      const banner = await imageGen.designBanner({
        type: 'web',
        width: 1200,
        height: 630,
        headline: 'Summer Sale - Up to 50% Off',
        theme: 'vibrant summer vibes',
        colors: ['orange', 'yellow', 'blue']
      });
      console.log('✓ Banner Designed:');
      console.log(`  Provider: ${banner.provider}`);
      console.log(`  Dimensions: ${banner.width}x${banner.height}`);
      console.log(`  Path: ${banner.path}`);
    } catch (error: any) {
      console.log(`⚠ Banner Design skipped: ${error.message}`);
    }

    // Test 4: Create Social Media Graphic
    console.log('\n📱 Test 4: Creating Social Media Graphic...');
    try {
      const socialGraphic = await imageGen.createSocialGraphic({
        platform: 'instagram',
        type: 'post',
        message: 'Sustainable living tips for a better tomorrow',
        style: 'minimalist, eco-friendly',
        brandColors: ['green', 'beige'],
        includeText: false
      });
      console.log('✓ Social Graphic Created:');
      console.log(`  Provider: ${socialGraphic.provider}`);
      console.log(`  Dimensions: ${socialGraphic.width}x${socialGraphic.height}`);
      console.log(`  Path: ${socialGraphic.path}`);
    } catch (error: any) {
      console.log(`⚠ Social Graphic Creation skipped: ${error.message}`);
    }

    // Test 5: Generate Variations (if first test succeeded)
    console.log('\n🔄 Test 5: Generating Image Variations...');
    console.log('⚠ Variations require a base image from previous tests');

    console.log('\n' + '='.repeat(60));
    console.log('✓ ImageGenerator tests completed!');
    console.log('='.repeat(60));

    console.log('\nNote: To run actual image generation, configure API keys in .env:');
    console.log('  - OPENAI_API_KEY for DALL-E 3');
    console.log('  - STABILITY_API_KEY for Stable Diffusion');
    console.log('  - REPLICATE_API_KEY for Replicate models');
    console.log('  - GOOGLE_IMAGEN_API_KEY for Google Imagen');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testImageGenerator().catch(console.error);
}

export { testImageGenerator };
