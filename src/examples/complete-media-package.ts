/**
 * Complete Media Package Creation Example
 *
 * Demonstrates how to use GeminiService, ImageGenerator, and VideoGenerator
 * together to create a complete media package for a product launch.
 */

import * as dotenv from 'dotenv';
import { getGeminiService } from '../services/GeminiService';
import { getImageGenerator } from '../utils/ImageGenerator';
import { getVideoGenerator } from '../utils/VideoGenerator';

// Load environment variables
dotenv.config();

async function createCompleteMediaPackage() {
  console.log('='.repeat(80));
  console.log('🚀 Complete Media Package Creation Pipeline');
  console.log('='.repeat(80));

  try {
    // Initialize services
    const gemini = getGeminiService();
    const imageGen = getImageGenerator();
    const videoGen = getVideoGenerator();

    // ========== PHASE 1: Brand & Content Creation ==========
    console.log('\n' + '='.repeat(80));
    console.log('PHASE 1: Brand & Content Creation');
    console.log('='.repeat(80));

    // Step 1: Generate Brand Identity
    console.log('\n📝 Step 1: Creating Brand Identity...');
    const brand = await gemini.generateBrandName({
      niche: 'premium smart home devices',
      style: 'modern',
      length: 'medium',
      targetAudience: 'tech-savvy homeowners'
    });

    console.log(`✓ Brand Name: ${brand.name}`);
    console.log(`  Reasoning: ${brand.reasoning}`);
    console.log(`  Alternatives: ${brand.alternatives.slice(0, 3).join(', ')}`);

    // Step 2: Create Tagline
    console.log('\n📝 Step 2: Creating Brand Tagline...');
    const tagline = await gemini.createTagline({
      brandName: brand.name,
      niche: 'smart home technology',
      values: ['innovation', 'simplicity', 'security'],
      tone: 'professional'
    });

    console.log(`✓ Tagline: ${tagline.primary}`);

    // Step 3: Generate Product Description
    console.log('\n📝 Step 3: Generating Product Description...');
    const product = await gemini.generateProductDescription({
      productName: 'SmartGuard Pro Security Camera',
      features: [
        '4K Ultra HD resolution',
        'AI-powered motion detection',
        '360-degree rotation',
        'Night vision capability',
        'Two-way audio',
        'Cloud storage included'
      ],
      benefits: [
        'Monitor your home from anywhere',
        'Receive instant alerts',
        'Deter intruders automatically',
        'Easy installation, no wiring needed'
      ],
      category: 'Smart Home Security',
      tone: 'persuasive',
      length: 'medium'
    });

    console.log(`✓ Product Description:`);
    console.log(`  Headline: ${product.headline}`);
    console.log(`  Short: ${product.shortDescription.substring(0, 100)}...`);

    // ========== PHASE 2: Visual Assets ==========
    console.log('\n' + '='.repeat(80));
    console.log('PHASE 2: Visual Assets Creation');
    console.log('='.repeat(80));

    let mainImage, logo, socialGraphic, banner;

    try {
      // Step 4: Generate Product Images
      console.log('\n📸 Step 4: Generating Product Images...');

      mainImage = await imageGen.generateProductImage(
        'SmartGuard Pro Security Camera',
        product.longDescription,
        {
          width: 1024,
          height: 1024,
          quality: 'hd',
          style: 'professional product photography, white background'
        }
      );

      console.log(`✓ Main Product Image: ${mainImage.path}`);

      // Generate variations
      const variations = await imageGen.generateVariations(mainImage, 2, {
        style: 'lifestyle photography, home setting'
      });

      console.log(`✓ Generated ${variations.length} lifestyle variations`);

      // Step 5: Create Brand Logo
      console.log('\n🎨 Step 5: Creating Brand Logo...');

      logo = await imageGen.createLogo({
        brandName: brand.name,
        style: 'modern',
        colors: ['blue', 'silver', 'white'],
        symbols: ['shield', 'tech'],
        industry: 'smart home security'
      });

      console.log(`✓ Brand Logo: ${logo.path}`);

      // Step 6: Create Social Media Graphics
      console.log('\n📱 Step 6: Creating Social Media Graphics...');

      socialGraphic = await imageGen.createSocialGraphic({
        platform: 'instagram',
        type: 'post',
        message: 'Advanced home security made simple',
        style: 'modern, tech-focused, clean',
        brandColors: ['blue', 'white'],
        includeText: false
      });

      console.log(`✓ Instagram Post Graphic: ${socialGraphic.path}`);

      // Step 7: Design Marketing Banner
      console.log('\n🖼️ Step 7: Designing Marketing Banner...');

      banner = await imageGen.designBanner({
        type: 'web',
        width: 1200,
        height: 630,
        headline: 'Protect What Matters Most',
        subheadline: 'Advanced AI Security - Now Available',
        theme: 'secure, modern, tech-forward',
        colors: ['blue', 'dark gray', 'white']
      });

      console.log(`✓ Marketing Banner: ${banner.path}`);

    } catch (error: any) {
      console.log(`⚠ Image generation skipped: ${error.message}`);
      console.log(`  (Configure image API keys in .env to enable)`);
    }

    // ========== PHASE 3: Video Content ==========
    console.log('\n' + '='.repeat(80));
    console.log('PHASE 3: Video Content Creation');
    console.log('='.repeat(80));

    try {
      // Step 8: Generate Product Demo Video
      console.log('\n🎬 Step 8: Generating Product Demo Video...');

      const productVideo = await videoGen.generateProductVideo({
        productName: 'SmartGuard Pro Security Camera',
        description: product.longDescription,
        features: [
          '4K Ultra HD resolution',
          'AI-powered detection',
          '360-degree coverage',
          'Night vision'
        ],
        duration: 15,
        style: 'cinematic',
        showText: true,
        transitions: 'smooth'
      });

      console.log(`✓ Product Demo Video:`);
      console.log(`  Path: ${productVideo.path}`);
      console.log(`  Duration: ${productVideo.duration}s`);
      console.log(`  Thumbnail: ${productVideo.thumbnail}`);

      // Step 9: Create Promotional Video
      console.log('\n🎥 Step 9: Creating Promotional Video...');

      const promoVideo = await videoGen.createPromoVideo({
        headline: 'Introducing SmartGuard Pro',
        message: 'The future of home security is here',
        callToAction: 'Pre-order Now',
        duration: 20,
        style: 'bold',
        brandColors: ['blue', 'white', 'silver'],
        includeText: true
      });

      console.log(`✓ Promotional Video:`);
      console.log(`  Path: ${promoVideo.path}`);
      console.log(`  Duration: ${promoVideo.duration}s`);

      // Step 10: Generate Social Media Shorts
      console.log('\n📱 Step 10: Generating Social Media Shorts...');

      const tiktokShort = await videoGen.generateShorts({
        platform: 'tiktok',
        topic: 'Home security made smart',
        hook: 'Your home deserves the best protection',
        duration: 30,
        style: 'trending',
        includeSubtitles: true,
        includeEffects: true
      });

      console.log(`✓ TikTok Short:`);
      console.log(`  Path: ${tiktokShort.path}`);
      console.log(`  Format: ${tiktokShort.width}x${tiktokShort.height} (vertical)`);

      const reelShort = await videoGen.generateShorts({
        platform: 'instagram-reel',
        topic: 'SmartGuard Pro features showcase',
        hook: 'See what makes it different',
        duration: 30,
        style: 'entertaining',
        includeSubtitles: true
      });

      console.log(`✓ Instagram Reel:`);
      console.log(`  Path: ${reelShort.path}`);

      // Step 11: Optimize Videos for Platforms
      console.log('\n🔧 Step 11: Optimizing Videos for Platforms...');

      const youtubeVideo = await videoGen.optimizeForPlatform(productVideo, {
        platform: 'youtube',
        format: 'feed',
        quality: 'high'
      });

      console.log(`✓ YouTube-optimized: ${youtubeVideo.path}`);

    } catch (error: any) {
      console.log(`⚠ Video generation skipped: ${error.message}`);
      console.log(`  (Configure video API keys in .env to enable)`);
    }

    // ========== PHASE 4: Content Marketing ==========
    console.log('\n' + '='.repeat(80));
    console.log('PHASE 4: Content Marketing Materials');
    console.log('='.repeat(80));

    // Step 12: Generate Social Media Posts
    console.log('\n📱 Step 12: Generating Social Media Posts...');

    const instagramPost = await gemini.generateSocialPost({
      platform: 'instagram',
      topic: 'SmartGuard Pro launch announcement',
      tone: 'excited',
      includeHashtags: true,
      includeEmojis: true
    });

    console.log(`✓ Instagram Post:`);
    console.log(`  Caption: ${instagramPost.caption.substring(0, 80)}...`);
    console.log(`  Hashtags: ${instagramPost.hashtags.slice(0, 5).join(' ')}`);

    // Step 13: Create Blog Content
    console.log('\n📄 Step 13: Generating Blog Content...');

    const blogPost = await gemini.createContent({
      topic: 'Why smart security cameras are essential for modern homes',
      type: 'blog',
      tone: 'informative',
      length: 800,
      keywords: ['smart home', 'security', 'AI camera', 'home automation']
    });

    console.log(`✓ Blog Post Generated:`);
    console.log(`  Preview: ${blogPost.substring(0, 150)}...`);
    console.log(`  Length: ${blogPost.length} characters`);

    // Step 14: Create Email Marketing Content
    console.log('\n📧 Step 14: Creating Email Marketing Content...');

    const emailContent = await gemini.createContent({
      topic: 'Launch announcement for SmartGuard Pro Security Camera',
      type: 'email',
      tone: 'professional',
      length: 400
    });

    console.log(`✓ Email Content:`);
    console.log(`  Preview: ${emailContent.substring(0, 100)}...`);

    // ========== FINAL SUMMARY ==========
    console.log('\n' + '='.repeat(80));
    console.log('✅ COMPLETE MEDIA PACKAGE CREATED!');
    console.log('='.repeat(80));

    console.log('\n📦 Package Contents:');
    console.log('\n🏢 Brand Identity:');
    console.log(`  • Brand Name: ${brand.name}`);
    console.log(`  • Tagline: ${tagline.primary}`);
    console.log(`  • Logo: ${logo?.path || 'Pending'}`);

    console.log('\n📝 Content:');
    console.log(`  • Product Description: ✓`);
    console.log(`  • Blog Post: ✓ (${blogPost.length} chars)`);
    console.log(`  • Email Content: ✓`);
    console.log(`  • Social Posts: ✓`);

    console.log('\n📸 Visual Assets:');
    console.log(`  • Main Product Image: ${mainImage?.path || 'Pending'}`);
    console.log(`  • Product Variations: Attempted`);
    console.log(`  • Social Graphics: ${socialGraphic?.path || 'Pending'}`);
    console.log(`  • Marketing Banner: ${banner?.path || 'Pending'}`);

    console.log('\n🎬 Video Assets:');
    console.log(`  • Product Demo Video: Attempted (15s)`);
    console.log(`  • Promotional Video: Attempted (20s)`);
    console.log(`  • TikTok Short: Attempted (30s)`);
    console.log(`  • Instagram Reel: Attempted (30s)`);
    console.log(`  • Platform-optimized versions: Attempted`);

    console.log('\n💾 Output Locations:');
    console.log(`  • Images: ./generated-images/`);
    console.log(`  • Videos: ./generated-videos/`);

    console.log('\n🎯 Next Steps:');
    console.log(`  1. Review and refine generated content`);
    console.log(`  2. Add voiceovers to videos (optional)`);
    console.log(`  3. Customize colors and branding`);
    console.log(`  4. Upload to social media platforms`);
    console.log(`  5. Schedule content calendar`);
    console.log(`  6. Launch product campaign!`);

    console.log('\n' + '='.repeat(80));
    console.log('🎉 Media package generation complete!');
    console.log('='.repeat(80));

  } catch (error: any) {
    console.error('\n❌ Error in media package creation:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run if executed directly
if (require.main === module) {
  createCompleteMediaPackage().catch(console.error);
}

export { createCompleteMediaPackage };
