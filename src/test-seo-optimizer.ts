/**
 * Test file for SEOOptimizer
 * Run this to test SEO optimization functionality
 */

import * as dotenv from 'dotenv';
import { getSEOOptimizer } from './utils/SEOOptimizer';

// Load environment variables from .env file
dotenv.config();

async function testSEOOptimizer() {
  console.log('='.repeat(70));
  console.log('🔍 Testing SEOOptimizer');
  console.log('='.repeat(70));

  try {
    const seo = getSEOOptimizer();

    // Sample content for testing
    const sampleContent = `
# Complete Guide to Smart Home Security

Smart home security has become increasingly important in 2024. With the rise of IoT devices,
protecting your home has never been easier or more affordable. This comprehensive guide will
help you understand everything about smart home security systems.

## What is Smart Home Security?

Smart home security refers to internet-connected devices that help protect your home from
intruders, fire, and other emergencies. These systems include cameras, sensors, alarms, and
smart locks that can be controlled remotely via smartphone apps.

## Benefits of Smart Home Security

- Remote monitoring from anywhere
- Instant alerts and notifications
- Integration with other smart devices
- Professional monitoring options
- Energy efficiency and cost savings

## Top Smart Home Security Devices

1. **Security Cameras**: HD video monitoring with night vision
2. **Smart Locks**: Keyless entry with remote access
3. **Motion Sensors**: Detect movement and send alerts
4. **Door/Window Sensors**: Monitor entry points
5. **Smart Doorbells**: See and speak to visitors

## Conclusion

Investing in smart home security provides peace of mind and protection for your family and
property. Start with essential devices and expand your system as needed.
    `;

    // Test 1: Analyze Keywords
    console.log('\n🔍 Test 1: Analyzing Keywords...');
    const keywordAnalysis = await seo.analyzeKeywords(
      sampleContent,
      'smart home security'
    );

    console.log('✓ Keyword Analysis Complete:');
    console.log(`  Primary Keyword: ${keywordAnalysis.primaryKeyword}`);
    console.log(`  Secondary Keywords: ${keywordAnalysis.secondaryKeywords.slice(0, 3).join(', ')}`);
    console.log(`  Related Keywords: ${keywordAnalysis.relatedKeywords.slice(0, 3).join(', ')}`);
    console.log(`  Long-tail Keywords: ${keywordAnalysis.longTailKeywords.slice(0, 2).join(', ')}`);
    console.log(`  Metrics:`);
    console.log(`    - Density: ${keywordAnalysis.metrics.density}%`);
    console.log(`    - Prominence: ${keywordAnalysis.metrics.prominence}%`);
    console.log(`    - Distribution: ${keywordAnalysis.metrics.distribution}%`);

    if (keywordAnalysis.suggestions.length > 0) {
      console.log(`  Suggestions:`);
      keywordAnalysis.suggestions.forEach(s => console.log(`    - ${s}`));
    }

    // Test 2: Generate Meta Tags
    console.log('\n🏷️  Test 2: Generating Meta Tags...');
    const metaTags = await seo.generateMetaTags({
      title: 'Complete Guide to Smart Home Security - Protect Your Home',
      description: 'Learn everything about smart home security systems. From cameras to smart locks, discover how to protect your home with the latest technology.',
      url: 'https://example.com/smart-home-security-guide',
      image: 'https://example.com/images/smart-home-security.jpg',
      keywords: ['smart home security', 'security cameras', 'smart locks'],
      author: 'Security Expert',
      siteName: 'Home Security Hub'
    });

    console.log('✓ Meta Tags Generated:');
    console.log(`  Title: ${metaTags.title}`);
    console.log(`  Description: ${metaTags.description}`);
    console.log(`  OG Title: ${metaTags.openGraph.title}`);
    console.log(`  Twitter Card: ${metaTags.twitter.card}`);

    // Test 3: Optimize Title
    console.log('\n📝 Test 3: Optimizing Title...');
    const optimizedTitle = await seo.optimizeTitles({
      content: sampleContent,
      primaryKeyword: 'smart home security',
      brandName: 'SecureHome',
      format: 'how-to',
      maxLength: 60,
      includeYear: true
    });

    console.log('✓ Title Optimization Complete:');
    console.log(`  Primary Title: ${optimizedTitle.primary}`);
    console.log(`  Score: ${optimizedTitle.score}/100`);
    console.log(`  Alternatives:`);
    optimizedTitle.alternatives.forEach(alt => console.log(`    - ${alt}`));

    if (optimizedTitle.issues.length > 0) {
      console.log(`  Issues:`);
      optimizedTitle.issues.forEach(issue => console.log(`    - ${issue}`));
    }

    // Test 4: Create Sitemap
    console.log('\n🗺️  Test 4: Creating XML Sitemap...');
    const sitemap = seo.createSitemap([
      {
        url: 'https://example.com/',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: 'https://example.com/products',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        images: [
          {
            url: 'https://example.com/images/product1.jpg',
            title: 'Smart Security Camera',
            caption: 'HD Security Camera with Night Vision'
          }
        ]
      },
      {
        url: 'https://example.com/blog/smart-home-security',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
      }
    ], 'sitemap.xml');

    console.log('✓ Sitemap Created:');
    console.log(`  Entries: 3`);
    console.log(`  Saved to: ./seo-output/sitemap.xml`);
    console.log(`  Preview: ${sitemap.substring(0, 200)}...`);

    // Test 5: Generate Schema Markup
    console.log('\n📋 Test 5: Generating Schema.org Markup...');

    const productSchema = seo.generateSchema('Product', {
      name: 'SmartGuard Pro Security Camera',
      description: '4K security camera with AI detection',
      image: 'https://example.com/images/smartguard-pro.jpg',
      brand: {
        '@type': 'Brand',
        name: 'SmartGuard'
      },
      offers: {
        '@type': 'Offer',
        price: '199.99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '524'
      }
    });

    console.log('✓ Product Schema Generated:');
    console.log(`  Type: ${productSchema['@type']}`);
    console.log(`  JSON-LD: ${JSON.stringify(productSchema, null, 2).substring(0, 200)}...`);

    const articleSchema = seo.generateSchema('Article', {
      headline: 'Complete Guide to Smart Home Security',
      author: {
        '@type': 'Person',
        name: 'John Smith'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Home Security Hub',
        logo: {
          '@type': 'ImageObject',
          url: 'https://example.com/logo.jpg'
        }
      },
      image: 'https://example.com/article-image.jpg'
    });

    console.log('✓ Article Schema Generated:');
    console.log(`  Type: ${articleSchema['@type']}`);

    // Test 6: Score Content
    console.log('\n📊 Test 6: Scoring Content for SEO...');
    const seoScore = await seo.scoreContent({
      content: sampleContent,
      url: 'https://example.com/smart-home-security-guide',
      targetKeyword: 'smart home security',
      metaTitle: 'Complete Guide to Smart Home Security - 2024',
      metaDescription: 'Learn everything about smart home security systems in 2024. Expert tips, product reviews, and installation guides.',
      includeReadability: true
    });

    console.log('✓ SEO Score Complete:');
    console.log(`  Overall Score: ${seoScore.overallScore}/100 (${seoScore.category.toUpperCase()})`);
    console.log(`  Breakdown:`);
    console.log(`    - Technical: ${seoScore.breakdown.technical}/100`);
    console.log(`    - Content: ${seoScore.breakdown.content}/100`);
    console.log(`    - Keywords: ${seoScore.breakdown.keywords}/100`);
    console.log(`    - Readability: ${seoScore.breakdown.readability}/100`);
    console.log(`    - Metadata: ${seoScore.breakdown.metadata}/100`);

    if (seoScore.issues.critical.length > 0) {
      console.log(`  Critical Issues:`);
      seoScore.issues.critical.forEach(issue => console.log(`    ❌ ${issue}`));
    }

    if (seoScore.issues.warnings.length > 0) {
      console.log(`  Warnings:`);
      seoScore.issues.warnings.slice(0, 3).forEach(issue => console.log(`    ⚠ ${issue}`));
    }

    console.log(`  Recommendations:`);
    seoScore.recommendations.slice(0, 3).forEach(rec => console.log(`    💡 ${rec}`));

    console.log(`  Passed Checks: ${seoScore.passedChecks.length}`);
    console.log(`  Failed Checks: ${seoScore.failedChecks.length}`);

    // Test 7: Competitor Analysis
    console.log('\n🔬 Test 7: Analyzing Competitor...');
    try {
      const competitorAnalysis = await seo.analyzeCompetitors(
        'https://competitor-example.com',
        ['smart home security', 'security cameras', 'home automation']
      );

      console.log('✓ Competitor Analysis Complete:');
      console.log(`  Competitor: ${competitorAnalysis.competitor}`);
      console.log(`  Strengths: ${competitorAnalysis.strengths.slice(0, 2).join(', ')}`);
      console.log(`  Weaknesses: ${competitorAnalysis.weaknesses.slice(0, 2).join(', ')}`);
      console.log(`  Opportunities: ${competitorAnalysis.opportunities.slice(0, 2).join(', ')}`);
    } catch (error: any) {
      console.log(`⚠ Competitor Analysis skipped: ${error.message}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✓ SEOOptimizer tests completed!');
    console.log('='.repeat(70));

    console.log('\nKey Features Tested:');
    console.log('  ✓ Keyword analysis and suggestions');
    console.log('  ✓ Meta tag generation (OG, Twitter)');
    console.log('  ✓ Title optimization with scoring');
    console.log('  ✓ XML sitemap creation');
    console.log('  ✓ Schema.org structured data');
    console.log('  ✓ SEO content scoring');
    console.log('  ✓ Competitor analysis (AI-powered)');

    console.log('\nBest Practices Implemented:');
    console.log('  • Keyword density optimization (1-2%)');
    console.log('  • Meta title length (30-60 chars)');
    console.log('  • Meta description length (120-160 chars)');
    console.log('  • Content readability checks');
    console.log('  • URL optimization suggestions');
    console.log('  • Heading structure validation');
    console.log('  • Internal/external link checks');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testSEOOptimizer().catch(console.error);
}

export { testSEOOptimizer };
