/**
 * Complete Product Creation Example
 *
 * Demonstrates how to use GeminiService and ImageGenerator together
 * to create a complete product package with description and images.
 */

import * as dotenv from 'dotenv';
import { getGeminiService } from '../services/GeminiService';
import { getImageGenerator } from '../utils/ImageGenerator';

// Load environment variables
dotenv.config();

async function createCompleteProduct() {
  console.log('='.repeat(70));
  console.log('🚀 Complete Product Creation Pipeline');
  console.log('='.repeat(70));

  try {
    // Initialize services
    const gemini = getGeminiService();
    const imageGen = getImageGenerator();

    // Step 1: Generate Brand Identity
    console.log('\n📝 Step 1: Creating Brand Identity...');
    const brand = await gemini.generateBrandName({
      niche: 'sustainable home products',
      style: 'modern',
      length: 'medium',
      targetAudience: 'eco-conscious millennials'
    });

    console.log(`✓ Brand Name: ${brand.name}`);
    console.log(`  Reasoning: ${brand.reasoning}`);

    // Step 2: Create Tagline
    console.log('\n📝 Step 2: Creating Brand Tagline...');
    const tagline = await gemini.createTagline({
      brandName: brand.name,
      niche: 'sustainable home products',
      values: ['sustainability', 'quality', 'innovation'],
      tone: 'professional'
    });

    console.log(`✓ Tagline: ${tagline.primary}`);

    // Step 3: Generate Product Description
    console.log('\n📝 Step 3: Generating Product Description...');
    const product = await gemini.generateProductDescription({
      productName: 'Eco-Friendly Bamboo Kitchen Set',
      features: [
        'Made from 100% sustainable bamboo',
        'BPA-free and food-safe',
        'Includes 5 essential kitchen tools',
        'Dishwasher safe',
        'Ergonomic design'
      ],
      benefits: [
        'Reduces plastic waste',
        'Durable and long-lasting',
        'Natural antibacterial properties',
        'Stylish and modern look'
      ],
      category: 'Kitchen & Dining',
      tone: 'persuasive',
      length: 'medium'
    });

    console.log(`✓ Product Description Generated:`);
    console.log(`  Headline: ${product.headline}`);
    console.log(`  Short: ${product.shortDescription.substring(0, 100)}...`);

    // Step 4: Generate Product Images
    console.log('\n📸 Step 4: Generating Product Images...');

    try {
      // Main product image
      const mainImage = await imageGen.generateProductImage(
        'Eco-Friendly Bamboo Kitchen Set',
        product.longDescription,
        {
          width: 1024,
          height: 1024,
          quality: 'hd',
          style: 'professional product photography, white background'
        }
      );

      console.log(`✓ Main Product Image:`);
      console.log(`  Path: ${mainImage.path}`);
      console.log(`  Provider: ${mainImage.provider}`);
      if (mainImage.metadata?.cost) {
        console.log(`  Cost: $${mainImage.metadata.cost.toFixed(4)}`);
      }

      // Generate variations for different angles/styles
      console.log('\n📸 Generating Product Variations...');
      const variations = await imageGen.generateVariations(
        mainImage,
        2,
        {
          style: 'lifestyle photography, in-use scenario'
        }
      );

      console.log(`✓ Generated ${variations.length} variations`);
      variations.forEach((img, i) => {
        console.log(`  Variation ${i + 1}: ${img.path}`);
      });

    } catch (error: any) {
      console.log(`⚠ Image generation skipped: ${error.message}`);
      console.log(`  (Configure image API keys in .env to enable)`);
    }

    // Step 5: Create Brand Logo
    console.log('\n🎨 Step 5: Creating Brand Logo...');

    try {
      const logo = await imageGen.createLogo({
        brandName: brand.name,
        style: 'modern',
        colors: ['green', 'brown', 'white'],
        symbols: ['leaf', 'bamboo'],
        industry: 'sustainable home products'
      });

      console.log(`✓ Brand Logo:`);
      console.log(`  Path: ${logo.path}`);
      console.log(`  Provider: ${logo.provider}`);

    } catch (error: any) {
      console.log(`⚠ Logo creation skipped: ${error.message}`);
    }

    // Step 6: Generate Social Media Content
    console.log('\n📱 Step 6: Creating Social Media Content...');

    const socialPost = await gemini.generateSocialPost({
      platform: 'instagram',
      topic: 'sustainable bamboo kitchen tools',
      tone: 'friendly',
      includeHashtags: true,
      includeEmojis: true
    });

    console.log(`✓ Social Media Post:`);
    console.log(`  Caption: ${socialPost.caption.substring(0, 100)}...`);
    console.log(`  Hashtags: ${socialPost.hashtags.slice(0, 5).join(' ')}`);

    // Create social media graphic
    try {
      const socialGraphic = await imageGen.createSocialGraphic({
        platform: 'instagram',
        type: 'post',
        message: 'Sustainable living made easy',
        style: 'minimalist, eco-friendly, warm colors',
        brandColors: ['green', 'beige', 'brown'],
        includeText: false
      });

      console.log(`✓ Social Media Graphic:`);
      console.log(`  Path: ${socialGraphic.path}`);
      console.log(`  Dimensions: ${socialGraphic.width}x${socialGraphic.height}`);

    } catch (error: any) {
      console.log(`⚠ Social graphic creation skipped: ${error.message}`);
    }

    // Step 7: Create Marketing Banner
    console.log('\n🖼️ Step 7: Creating Marketing Banner...');

    try {
      const banner = await imageGen.designBanner({
        type: 'web',
        width: 1200,
        height: 630,
        headline: 'Go Green with Bamboo',
        subheadline: '50% Off Launch Sale',
        theme: 'eco-friendly, natural, sustainable',
        colors: ['green', 'brown', 'cream'],
        includeText: false
      });

      console.log(`✓ Marketing Banner:`);
      console.log(`  Path: ${banner.path}`);

    } catch (error: any) {
      console.log(`⚠ Banner creation skipped: ${error.message}`);
    }

    // Step 8: Generate Blog Content
    console.log('\n📄 Step 8: Generating Blog Content...');

    const blogContent = await gemini.createContent({
      topic: 'Why bamboo kitchen tools are the sustainable choice',
      type: 'blog',
      tone: 'informative',
      length: 500,
      keywords: ['sustainable', 'bamboo', 'eco-friendly', 'kitchen']
    });

    console.log(`✓ Blog Content Generated:`);
    console.log(`  Preview: ${blogContent.substring(0, 150)}...`);
    console.log(`  Length: ${blogContent.length} characters`);

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ Complete Product Package Created!');
    console.log('='.repeat(70));
    console.log('\nPackage Contents:');
    console.log(`  • Brand Name: ${brand.name}`);
    console.log(`  • Tagline: ${tagline.primary}`);
    console.log(`  • Product Description: ✓`);
    console.log(`  • Product Images: Attempted`);
    console.log(`  • Brand Logo: Attempted`);
    console.log(`  • Social Media Content: ✓`);
    console.log(`  • Marketing Banner: Attempted`);
    console.log(`  • Blog Content: ✓`);
    console.log('\nAll generated content is ready for use!');
    console.log('Images saved to: ./generated-images/');
    console.log('='.repeat(70));

  } catch (error: any) {
    console.error('\n❌ Error in product creation pipeline:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run if executed directly
if (require.main === module) {
  createCompleteProduct().catch(console.error);
}

export { createCompleteProduct };
