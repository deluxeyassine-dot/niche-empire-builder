/**
 * Test file for GeminiService with AIHelper integration
 * Run this to test the AI functionality
 */

import * as dotenv from 'dotenv';
import { getGeminiService } from './services/GeminiService';

// Load environment variables from .env file
dotenv.config();

async function testGeminiService() {
  console.log('='.repeat(60));
  console.log('Testing GeminiService with AIHelper Integration');
  console.log('='.repeat(60));

  try {
    const gemini = getGeminiService();

    // Test 1: Generate Brand Name
    console.log('\n📝 Test 1: Generating Brand Name...');
    const brandName = await gemini.generateBrandName({
      niche: 'eco-friendly cleaning products',
      style: 'modern',
      length: 'medium'
    });
    console.log('✓ Brand Name Generated:');
    console.log(`  Primary: ${brandName.name}`);
    console.log(`  Reasoning: ${brandName.reasoning}`);
    console.log(`  Alternatives: ${brandName.alternatives.join(', ')}`);

    // Test 2: Create Tagline
    console.log('\n📝 Test 2: Creating Tagline...');
    const tagline = await gemini.createTagline({
      brandName: brandName.name,
      niche: 'eco-friendly cleaning',
      tone: 'professional'
    });
    console.log('✓ Tagline Created:');
    console.log(`  Primary: ${tagline.primary}`);
    console.log(`  Alternatives: ${tagline.alternatives.slice(0, 3).join(', ')}`);

    // Test 3: Generate Social Post
    console.log('\n📝 Test 3: Generating Social Media Post...');
    const socialPost = await gemini.generateSocialPost({
      platform: 'instagram',
      topic: 'sustainable living tips',
      tone: 'friendly',
      includeHashtags: true
    });
    console.log('✓ Social Post Generated:');
    console.log(`  Caption: ${socialPost.caption.substring(0, 100)}...`);
    console.log(`  Hashtags: ${socialPost.hashtags.join(' ')}`);

    console.log('\n' + '='.repeat(60));
    console.log('✓ All tests completed successfully!');
    console.log('='.repeat(60));
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testGeminiService().catch(console.error);
}

export { testGeminiService };
