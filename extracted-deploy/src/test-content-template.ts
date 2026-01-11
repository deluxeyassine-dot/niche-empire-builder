/**
 * Test file for ContentTemplate
 * Run this to generate marketing content for different platforms
 */

import * as dotenv from 'dotenv';
import { getContentTemplate } from './templates/content/ContentTemplate';

// Load environment variables
dotenv.config();

async function testContentTemplate() {
  console.log('='.repeat(70));
  console.log('📝 Testing ContentTemplate - Marketing Content Generator');
  console.log('='.repeat(70));

  try {
    const template = getContentTemplate();

    // Test 1: Create Blog Post
    console.log('\n📰 Test 1: Creating Blog Post...');

    const blogPost = template.createBlogPost({
      title: 'The Ultimate Guide to Smart Home Security in 2024',
      topic: 'smart home security',
      keywords: ['smart home', 'security cameras', 'home automation', 'IoT security'],
      targetAudience: 'homeowners',
      tone: 'professional',
      wordCount: 2000,
      includeImages: true,
      includeToc: true,
      includeFaq: true,
      author: {
        name: 'Sarah Mitchell',
        bio: 'Smart home security expert with 10+ years of experience',
        avatar: 'https://example.com/sarah.jpg'
      },
      category: 'Home Security',
      tags: ['security', 'smart home', 'technology', 'safety'],
      metaDescription: 'Discover the complete guide to securing your smart home. Expert tips, product reviews, and best practices for 2024.'
    });

    console.log('✓ Blog Post Created:');
    console.log(`  ID: ${blogPost.id}`);
    console.log(`  Title: ${blogPost.title}`);
    console.log(`  Slug: ${blogPost.slug}`);
    console.log(`  Meta Title: ${blogPost.metaTitle}`);
    console.log(`  Meta Description: ${blogPost.metaDescription}`);
    console.log(`  SEO:`);
    console.log(`    Focus Keyword: ${blogPost.seo.focusKeyword}`);
    console.log(`    Keywords: ${blogPost.seo.keywords.join(', ')}`);
    console.log(`    Reading Time: ${blogPost.seo.readingTime} minutes`);
    console.log(`    Word Count: ${blogPost.seo.wordCount}`);
    console.log(`  Content Sections: ${blogPost.content.sections.length}`);
    console.log(`  Table of Contents: ${blogPost.content.tableOfContents?.length || 0} items`);
    console.log(`  FAQ Items: ${blogPost.content.faq?.length || 0}`);
    console.log(`  Images: ${blogPost.images?.length || 0}`);
    console.log(`  Schema Type: ${blogPost.schema['@type']}`);

    // Test 2: Generate Social Media Posts
    console.log('\n📱 Test 2: Generating Social Media Posts...');

    const platforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'] as const;

    for (const platform of platforms) {
      const socialPost = template.generateSocialPost({
        platform,
        message: 'Just launched our new SmartGuard Pro Camera! 4K quality, AI detection, and night vision up to 100ft. Perfect for keeping your home safe.',
        topic: 'smart home security camera launch',
        includeHashtags: true,
        includeEmojis: platform !== 'linkedin',
        includeCallToAction: true,
        targetUrl: 'https://example.com/smart-camera',
        mediaType: 'image'
      });

      console.log(`\n  ${platform.toUpperCase()}:`);
      console.log(`    Character Count: ${socialPost.optimization.characterCount}`);
      console.log(`    Hashtags: ${socialPost.content.hashtags.slice(0, 5).join(', ')}`);
      console.log(`    Engagement Potential: ${socialPost.optimization.engagementPotential}`);
      console.log(`    Best Time to Post: ${socialPost.scheduling?.bestTimeToPost}`);
      console.log(`    A/B Test Variants: ${socialPost.variants?.length}`);
      console.log(`    Preview: ${socialPost.content.text.substring(0, 100)}...`);
    }

    // Test 3: Create Video Script
    console.log('\n🎬 Test 3: Creating Video Scripts...');

    const videoTypes = [
      { type: 'product-demo' as const, duration: 60, platform: 'youtube' as const },
      { type: 'shorts' as const, duration: 30, platform: 'tiktok' as const },
      { type: 'tutorial' as const, duration: 180, platform: 'youtube' as const }
    ];

    for (const videoSpec of videoTypes) {
      const videoScript = template.createVideoScript({
        title: 'SmartGuard Pro Camera Setup and Features',
        duration: videoSpec.duration,
        type: videoSpec.type,
        platform: videoSpec.platform,
        tone: 'energetic',
        targetAudience: 'homeowners',
        callToAction: 'Get yours today at smartguard.com',
        includeSubtitles: true,
        product: 'SmartGuard Pro Camera'
      });

      console.log(`\n  ${videoSpec.type.toUpperCase()} (${videoSpec.duration}s):`);
      console.log(`    Total Scenes: ${videoScript.scenes.length}`);
      console.log(`    Word Count: ${videoScript.metadata.wordCount}`);
      console.log(`    Pacing: ${videoScript.metadata.pacing}`);
      console.log(`    Hook: "${videoScript.structure.hook.dialogue.substring(0, 60)}..."`);
      console.log(`    Subtitles: ${videoScript.subtitles?.length || 0} blocks`);
      console.log(`    Visual Cues: ${videoScript.visualCues.length}`);
      console.log(`    Audio Notes: ${videoScript.audioNotes.length}`);
    }

    // Test 4: Write Email Copy
    console.log('\n📧 Test 4: Writing Email Copy...');

    const emailTypes = [
      { purpose: 'welcome' as const, subject: 'Welcome to SmartHome Pro!' },
      { purpose: 'promotional' as const, subject: 'Save 25% on Smart Cameras This Week' },
      { purpose: 'abandoned-cart' as const, subject: 'Your SmartGuard Pro is waiting' }
    ];

    for (const emailSpec of emailTypes) {
      const emailCopy = template.writeEmailCopy({
        subject: emailSpec.subject,
        purpose: emailSpec.purpose,
        recipientName: 'Yassine',
        tone: emailSpec.purpose === 'welcome' ? 'friendly' : 'urgent',
        includePreheader: true,
        callToAction: 'Shop Now',
        targetUrl: 'https://example.com/shop',
        product: 'SmartGuard Pro Camera',
        offer: emailSpec.purpose === 'promotional' ? {
          type: 'discount',
          value: '25%',
          expiryDate: new Date('2024-12-31')
        } : undefined
      });

      console.log(`\n  ${emailSpec.purpose.toUpperCase()}:`);
      console.log(`    Subject: ${emailCopy.subject}`);
      console.log(`    Preheader: ${emailCopy.preheader}`);
      console.log(`    Subject Line Score: ${emailCopy.optimization.subjectLineScore}/100`);
      console.log(`    Spam Score: ${emailCopy.optimization.spamScore}/10 (lower is better)`);
      console.log(`    Read Time: ${emailCopy.optimization.estimatedReadTime} min`);
      console.log(`    Template: ${emailCopy.design.template}`);
      console.log(`    Body Sections: ${emailCopy.content.body.length}`);
      console.log(`    A/B Variants: ${emailCopy.variants?.length}`);
      if (emailCopy.variants && emailCopy.variants.length > 0) {
        console.log(`    Variant B Subject: ${emailCopy.variants[1].subject}`);
      }
    }

    // Test 5: Generate Ad Copy
    console.log('\n📢 Test 5: Generating Ad Copy...');

    const adPlatforms = [
      { platform: 'google' as const, adType: 'search' as const },
      { platform: 'facebook' as const, adType: 'display' as const },
      { platform: 'instagram' as const, adType: 'carousel' as const },
      { platform: 'linkedin' as const, adType: 'display' as const }
    ];

    for (const adSpec of adPlatforms) {
      const adCopy = template.generateAdCopy({
        platform: adSpec.platform,
        adType: adSpec.adType,
        product: 'SmartGuard Pro Camera',
        targetAudience: 'homeowners aged 30-55',
        budget: 1000,
        objective: 'conversion',
        keywords: ['smart camera', 'home security', 'security camera', '4k camera'],
        callToAction: 'Buy Now',
        offer: 'Free shipping + 30-day trial',
        tone: 'direct'
      });

      console.log(`\n  ${adSpec.platform.toUpperCase()} - ${adSpec.adType}:`);
      console.log(`    Headline: ${adCopy.content.headline}`);
      if (adCopy.content.subheadline) {
        console.log(`    Subheadline: ${adCopy.content.subheadline}`);
      }
      console.log(`    Body: ${adCopy.content.body}`);
      console.log(`    CTA: ${adCopy.content.callToAction}`);
      console.log(`    Character Limits:`);
      console.log(`      Headline: ${adCopy.specifications.headlineLength}/${adCopy.specifications.characterLimits.headline}`);
      console.log(`      Body: ${adCopy.specifications.bodyLength}/${adCopy.specifications.characterLimits.body}`);
      console.log(`    Meets Requirements: ${adCopy.specifications.meetsRequirements ? 'Yes' : 'No'}`);
      console.log(`    Relevance Score: ${adCopy.optimization.relevanceScore.toFixed(1)}%`);
      console.log(`    Quality Score: ${adCopy.optimization.qualityScore}/100`);
      console.log(`    A/B Variants: ${adCopy.variants.length}`);
      console.log(`    Optimization Tips: ${adCopy.optimization.suggestions.slice(0, 2).join(', ')}`);
    }

    // Test 6: Create Landing Page
    console.log('\n🚀 Test 6: Creating Landing Page...');

    const landingPage = template.createLandingPage({
      title: 'SmartGuard Pro - Professional Home Security',
      purpose: 'product-launch',
      product: 'SmartGuard Pro Camera',
      offer: 'Launch Special: 25% off + Free Shipping',
      targetAudience: 'homeowners',
      includeTestimonials: true,
      includeFeatures: true,
      includePricing: true,
      includeFaq: true,
      callToAction: 'Get Your Camera Today',
      formFields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Yassine'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'yassine@example.com'
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'phone',
          required: false,
          placeholder: '+1 (555) 123-4567'
        }
      ],
      socialProof: [
        {
          type: 'testimonial',
          content: 'This camera has completely transformed how I monitor my home. Crystal clear video!',
          author: 'Sarah J.',
          rating: 5
        },
        {
          type: 'testimonial',
          content: 'Easy to install and the AI detection is amazing. No more false alerts!',
          author: 'Mike C.',
          rating: 5
        },
        {
          type: 'statistic',
          content: '10,000+ Happy Customers'
        }
      ]
    });

    console.log('✓ Landing Page Created:');
    console.log(`  ID: ${landingPage.id}`);
    console.log(`  Title: ${landingPage.title}`);
    console.log(`  Slug: ${landingPage.slug}`);
    console.log(`  Total Sections: ${landingPage.sections.length}`);
    console.log(`  Section Types:`);
    landingPage.sections.forEach(section => {
      console.log(`    - ${section.type}: ${section.title || '(no title)'}`);
    });
    console.log(`  SEO:`);
    console.log(`    Meta Title: ${landingPage.seo.metaTitle}`);
    console.log(`    Meta Description: ${landingPage.seo.metaDescription}`);
    console.log(`    Keywords: ${landingPage.seo.keywords.slice(0, 5).join(', ')}`);
    console.log(`  Conversion Elements:`);
    console.log(`    Primary CTA: ${landingPage.conversion.primaryCta.text}`);
    console.log(`    Form Fields: ${landingPage.conversion.formFields?.length}`);
    console.log(`    Trust Signals: ${landingPage.conversion.trustSignals.length}`);
    console.log(`  Hero:`);
    console.log(`    Headline: ${landingPage.design.hero.headline}`);
    console.log(`    Subheadline: ${landingPage.design.hero.subheadline.substring(0, 80)}...`);
    console.log(`    CTA Button: ${landingPage.design.hero.ctaButton.text}`);
    console.log(`  Performance:`);
    console.log(`    Load Time: ${landingPage.performance.loadTime}`);
    console.log(`    Mobile Optimized: ${landingPage.performance.mobileOptimized}`);
    console.log(`    Conversion Optimized: ${landingPage.performance.conversionOptimized}`);

    console.log('\n' + '='.repeat(70));
    console.log('✅ ContentTemplate Testing Complete!');
    console.log('='.repeat(70));

    console.log('\n📊 Summary:');
    console.log('  ✓ Blog Post: SEO-optimized with ToC and FAQ');
    console.log('  ✓ Social Posts: 5 platforms with A/B variants');
    console.log('  ✓ Video Scripts: 3 types with timing and subtitles');
    console.log('  ✓ Email Copy: 3 purposes with optimization scores');
    console.log('  ✓ Ad Copy: 4 platforms with quality scores');
    console.log('  ✓ Landing Page: Full conversion-optimized structure');

    console.log('\n🎯 Features Demonstrated:');
    console.log('  ✓ Platform-specific optimization');
    console.log('  ✓ Character limits and specifications');
    console.log('  ✓ SEO and Schema.org markup');
    console.log('  ✓ A/B testing variants');
    console.log('  ✓ Readability and engagement scoring');
    console.log('  ✓ Best practices for each platform');
    console.log('  ✓ Conversion optimization');
    console.log('  ✓ Mobile responsiveness');

    console.log('\n💡 Content Types Generated:');
    console.log('  • Blog Post: 2000 words, professional tone, full SEO');
    console.log('  • Social Media: 5 platforms, 3 variants each');
    console.log('  • Video Scripts: Product demo, shorts, tutorial');
    console.log('  • Email: Welcome, promotional, cart recovery');
    console.log('  • Ads: Google, Facebook, Instagram, LinkedIn');
    console.log('  • Landing Page: Product launch with 8 sections');

    console.log('\n🎬 Use Cases:');
    console.log('  • Product launches and promotions');
    console.log('  • Content marketing campaigns');
    console.log('  • Social media management');
    console.log('  • Email marketing automation');
    console.log('  • Paid advertising campaigns');
    console.log('  • Conversion rate optimization');
    console.log('  • Multi-channel marketing');

    console.log('\n📈 Optimization Metrics Tracked:');
    console.log('  • SEO scores and keyword density');
    console.log('  • Readability scores');
    console.log('  • Engagement potential');
    console.log('  • Subject line effectiveness');
    console.log('  • Spam scores');
    console.log('  • Ad relevance and quality');
    console.log('  • Character limit compliance');
    console.log('  • Conversion optimization');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testContentTemplate().catch(console.error);
}

export { testContentTemplate };
