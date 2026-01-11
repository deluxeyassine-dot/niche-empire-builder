# SEOOptimizer Usage Guide

The `SEOOptimizer` utility class provides comprehensive SEO optimization tools for improving search engine visibility and rankings.

## Features

- **Keyword Analysis**: Analyze content for keyword density, prominence, and distribution
- **Meta Tag Generation**: Create optimized meta tags (title, description, OG, Twitter)
- **Title Optimization**: Generate SEO-friendly titles with scoring
- **XML Sitemap**: Create search engine sitemaps
- **Schema.org Markup**: Generate structured data (JSON-LD)
- **Competitor Analysis**: Analyze competitor SEO strategies
- **Content Scoring**: Comprehensive SEO score with recommendations
- **Best Practices**: Built-in SEO guidelines and validation

## Setup

### Basic Usage

```typescript
import { getSEOOptimizer } from './utils/SEOOptimizer';

const seo = getSEOOptimizer();
```

## Examples

### 1. Analyze Keywords

```typescript
const analysis = await seo.analyzeKeywords(
  content,
  'smart home security' // Optional: primary keyword
);

console.log('Primary Keyword:', analysis.primaryKeyword);
console.log('Secondary Keywords:', analysis.secondaryKeywords);
console.log('Related Keywords:', analysis.relatedKeywords);
console.log('Long-tail Keywords:', analysis.longTailKeywords);

// Metrics
console.log('Keyword Density:', analysis.metrics.density + '%');
console.log('Keyword Prominence:', analysis.metrics.prominence + '%');
console.log('Keyword Distribution:', analysis.metrics.distribution + '%');

// Suggestions
analysis.suggestions.forEach(suggestion => {
  console.log('💡', suggestion);
});
```

**Metrics Explained:**
- **Density**: Percentage of keyword occurrences (ideal: 1-2%)
- **Prominence**: How early the keyword appears (higher is better)
- **Distribution**: How evenly distributed the keyword is (aim for 50%+)

### 2. Generate Meta Tags

```typescript
const metaTags = await seo.generateMetaTags({
  title: 'Complete Guide to Smart Home Security',
  description: 'Learn everything about smart home security systems...',
  url: 'https://example.com/smart-home-guide',
  image: 'https://example.com/og-image.jpg',
  keywords: ['smart home', 'security', 'IoT'],
  author: 'Yassine',
  siteName: 'Security Hub',
  type: 'article'
});

// Use in HTML
console.log(`<title>${metaTags.title}</title>`);
console.log(`<meta name="description" content="${metaTags.description}">`);
console.log(`<meta property="og:title" content="${metaTags.openGraph.title}">`);
console.log(`<meta property="og:description" content="${metaTags.openGraph.description}">`);
console.log(`<meta property="og:image" content="${metaTags.openGraph.image}">`);
console.log(`<meta name="twitter:card" content="${metaTags.twitter.card}">`);
```

**Output HTML:**
```html
<title>Complete Guide to Smart Home Security</title>
<meta name="description" content="Learn everything about smart home...">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://example.com/smart-home-guide">

<!-- Open Graph -->
<meta property="og:title" content="Complete Guide to Smart Home Security">
<meta property="og:description" content="Learn everything about...">
<meta property="og:type" content="article">
<meta property="og:url" content="https://example.com/smart-home-guide">
<meta property="og:image" content="https://example.com/og-image.jpg">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Complete Guide to Smart Home Security">
<meta name="twitter:description" content="Learn everything about...">
<meta name="twitter:image" content="https://example.com/og-image.jpg">
```

### 3. Optimize Title

```typescript
const optimizedTitle = await seo.optimizeTitles({
  content: articleContent,
  primaryKeyword: 'smart home security',
  brandName: 'SecureHome',
  separator: '|',
  maxLength: 60,
  includeYear: true,
  format: 'how-to' // 'default' | 'question' | 'how-to' | 'list' | 'comparison'
});

console.log('Primary Title:', optimizedTitle.primary);
console.log('SEO Score:', optimizedTitle.score + '/100');

// Alternative titles
optimizedTitle.alternatives.forEach((alt, i) => {
  console.log(`Alternative ${i + 1}:`, alt);
});

// Issues to fix
if (optimizedTitle.issues.length > 0) {
  console.log('Issues:');
  optimizedTitle.issues.forEach(issue => console.log('  -', issue));
}
```

**Title Formats:**
- **default**: "Keyword - Complete Guide"
- **question**: "What is Keyword? Complete Answer"
- **how-to**: "How to Keyword - Step by Step Guide"
- **list**: "10 Best Keyword Tips & Tricks"
- **comparison**: "Keyword Comparison - Which is Best?"

### 4. Create XML Sitemap

```typescript
const sitemap = seo.createSitemap([
  {
    url: 'https://example.com/',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0
  },
  {
    url: 'https://example.com/products',
    changeFrequency: 'weekly',
    priority: 0.8,
    images: [
      {
        url: 'https://example.com/images/product.jpg',
        title: 'Product Image',
        caption: 'Our latest product'
      }
    ]
  },
  {
    url: 'https://example.com/blog/article',
    changeFrequency: 'monthly',
    priority: 0.6
  }
], 'sitemap.xml'); // Optional: save to file

console.log('Sitemap created!');
```

**Output XML:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-12-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- More URLs... -->
</urlset>
```

### 5. Generate Schema.org Markup

#### Product Schema

```typescript
const productSchema = seo.generateSchema('Product', {
  name: 'SmartGuard Pro Camera',
  description: '4K security camera with AI detection',
  image: 'https://example.com/product.jpg',
  brand: {
    '@type': 'Brand',
    name: 'SmartGuard'
  },
  offers: {
    '@type': 'Offer',
    price: '199.99',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://example.com/buy'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '524'
  }
});

// Add to HTML
console.log(`<script type="application/ld+json">${JSON.stringify(productSchema, null, 2)}</script>`);
```

#### Article Schema

```typescript
const articleSchema = seo.generateSchema('Article', {
  headline: 'Complete Guide to Smart Home Security',
  author: {
    '@type': 'Person',
    name: 'Yassine'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Security Hub',
    logo: {
      '@type': 'ImageObject',
      url: 'https://example.com/logo.jpg'
    }
  },
  image: 'https://example.com/article-image.jpg',
  datePublished: '2024-12-28',
  dateModified: '2024-12-28'
});
```

#### FAQ Schema

```typescript
const faqSchema = seo.generateSchema('FAQ', {
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is smart home security?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Smart home security refers to internet-connected devices...'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does smart home security cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Smart home security systems range from $100 to $1000+...'
      }
    }
  ]
});
```

**Supported Schema Types:**
- Product
- Article / BlogPosting
- Organization / LocalBusiness
- WebSite
- BreadcrumbList
- FAQ
- Review
- VideoObject

### 6. Score Content for SEO

```typescript
const seoScore = await seo.scoreContent({
  content: articleContent,
  url: 'https://example.com/article',
  targetKeyword: 'smart home security',
  metaTitle: 'Complete Guide to Smart Home Security - 2024',
  metaDescription: 'Learn everything about smart home security systems...',
  includeReadability: true // Optional, default: true
});

console.log(`Overall Score: ${seoScore.overallScore}/100 (${seoScore.category})`);

// Breakdown
console.log('Technical:', seoScore.breakdown.technical + '/100');
console.log('Content:', seoScore.breakdown.content + '/100');
console.log('Keywords:', seoScore.breakdown.keywords + '/100');
console.log('Readability:', seoScore.breakdown.readability + '/100');
console.log('Metadata:', seoScore.breakdown.metadata + '/100');

// Issues
if (seoScore.issues.critical.length > 0) {
  console.log('Critical Issues:');
  seoScore.issues.critical.forEach(issue => console.log('  ❌', issue));
}

if (seoScore.issues.warnings.length > 0) {
  console.log('Warnings:');
  seoScore.issues.warnings.forEach(issue => console.log('  ⚠', issue));
}

// Recommendations
console.log('Recommendations:');
seoScore.recommendations.forEach(rec => console.log('  💡', rec));

// Summary
console.log(`Passed: ${seoScore.passedChecks.length} checks`);
console.log(`Failed: ${seoScore.failedChecks.length} checks`);
```

**Score Categories:**
- **90-100**: Excellent - Well-optimized content
- **70-89**: Good - Minor improvements needed
- **50-69**: Fair - Several issues to address
- **0-49**: Poor - Major SEO problems

### 7. Analyze Competitors

```typescript
const competitorAnalysis = await seo.analyzeCompetitors(
  'https://competitor.com',
  ['smart home security', 'security cameras', 'home automation']
);

console.log('Competitor:', competitorAnalysis.competitor);
console.log('Keywords:', competitorAnalysis.keywords);

// What they're doing well
console.log('Strengths:');
competitorAnalysis.strengths.forEach(s => console.log('  +', s));

// Where they're lacking
console.log('Weaknesses:');
competitorAnalysis.weaknesses.forEach(w => console.log('  -', w));

// Opportunities to outrank them
console.log('Opportunities:');
competitorAnalysis.opportunities.forEach(o => console.log('  💡', o));
```

## Complete Workflow Example

```typescript
import { getSEOOptimizer } from './utils/SEOOptimizer';
import { getGeminiService } from './services/GeminiService';

async function optimizeContent() {
  const seo = getSEOOptimizer();
  const gemini = getGeminiService();

  // 1. Create content
  const content = await gemini.createContent({
    topic: 'Smart home security for beginners',
    type: 'blog',
    length: 1000
  });

  // 2. Analyze keywords
  const keywords = await seo.analyzeKeywords(content, 'smart home security');
  console.log('Target keyword:', keywords.primaryKeyword);

  // 3. Optimize title
  const title = await seo.optimizeTitles({
    content,
    primaryKeyword: keywords.primaryKeyword,
    brandName: 'SecureHome',
    format: 'how-to'
  });

  // 4. Generate meta tags
  const meta = await seo.generateMetaTags({
    title: title.primary,
    description: content.substring(0, 155),
    keywords: keywords.secondaryKeywords
  });

  // 5. Score the content
  const score = await seo.scoreContent({
    content,
    targetKeyword: keywords.primaryKeyword,
    metaTitle: meta.title,
    metaDescription: meta.description
  });

  console.log('SEO Score:', score.overallScore + '/100');

  // 6. Generate schema markup
  const schema = seo.generateSchema('Article', {
    headline: title.primary,
    author: { '@type': 'Person', name: 'SEO Expert' },
    publisher: {
      '@type': 'Organization',
      name: 'SecureHome',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.jpg'
      }
    }
  });

  return {
    content,
    title: title.primary,
    meta,
    schema,
    seoScore: score
  };
}
```

## SEO Best Practices

### Keyword Optimization
- **Density**: Aim for 1-2% keyword density
- **Placement**: Include keyword in first 100 words
- **Distribution**: Spread keyword throughout content
- **Variations**: Use related keywords and long-tail phrases

### Content Guidelines
- **Length**: Minimum 300 words, 600+ recommended
- **Headings**: Use H1, H2, H3 hierarchy
- **Lists**: Include bulleted or numbered lists
- **Links**: Add internal and external links
- **Images**: Include alt text with keywords

### Meta Tags
- **Title**: 30-60 characters, include keyword
- **Description**: 120-160 characters, compelling copy
- **Keywords**: 5-10 relevant keywords (meta keywords deprecated)
- **Canonical**: Set canonical URL to avoid duplicates

### Technical SEO
- **URL**: Short, descriptive, lowercase with hyphens
- **Sitemap**: Update XML sitemap regularly
- **Schema**: Add structured data for rich snippets
- **Mobile**: Ensure mobile-friendly design
- **Speed**: Optimize page load time

### Readability
- **Sentences**: Keep under 25 words on average
- **Paragraphs**: Max 150 words per paragraph
- **Subheadings**: Break content into sections
- **White space**: Use line breaks and spacing
- **Formatting**: Use bold, italics, quotes

## Common SEO Checks

The SEOOptimizer automatically checks for:

✅ **Technical**
- URL length and structure
- Content length (minimum words)
- Mobile responsiveness indicators
- Page structure elements

✅ **Content Quality**
- Heading hierarchy (H1, H2, H3)
- List usage (bullets, numbers)
- Internal and external links
- Image presence and optimization

✅ **Keyword Usage**
- Keyword density (not too low/high)
- Keyword prominence (early appearance)
- Keyword distribution (throughout content)
- Keyword stuffing detection

✅ **Readability**
- Average sentence length
- Paragraph length
- Reading level
- Content structure

✅ **Metadata**
- Meta title length and keyword
- Meta description length and keyword
- OG tags presence
- Twitter card tags

## Integration with Other Tools

### With GeminiService (Content Creation)

```typescript
const gemini = getGeminiService();
const seo = getSEOOptimizer();

// Generate SEO-optimized content
const content = await gemini.createContent({
  topic: 'smart home security',
  type: 'blog',
  length: 800,
  keywords: ['smart home', 'security', 'IoT']
});

// Optimize for SEO
const keywords = await seo.analyzeKeywords(content);
const score = await seo.scoreContent({
  content,
  targetKeyword: keywords.primaryKeyword
});
```

### With ImageGenerator (Image SEO)

```typescript
const imageGen = getImageGenerator();
const seo = getSEOOptimizer();

// Generate image
const image = await imageGen.generateProductImage(...);

// Add to sitemap with image SEO
const sitemap = seo.createSitemap([{
  url: 'https://example.com/product',
  images: [{
    url: image.url,
    title: 'Product Name - Keywords',
    caption: 'SEO-optimized caption'
  }]
}]);
```

## Testing

Run the test file to see all features in action:

```bash
npx ts-node src/test-seo-optimizer.ts
```

## Output Files

The SEOOptimizer can save files to the output directory:

- **seo-output/sitemap.xml** - XML sitemap
- **seo-output/robots.txt** - Robots.txt file (if generated)
- **seo-output/schema.json** - Schema markup examples

## Best Practices Checklist

Before publishing content, ensure you:

- [ ] Analyzed keywords and optimized density (1-2%)
- [ ] Created SEO-friendly title (30-60 chars, includes keyword)
- [ ] Wrote compelling meta description (120-160 chars)
- [ ] Added OG and Twitter meta tags
- [ ] Included Schema.org markup
- [ ] Scored content (aim for 70+/100)
- [ ] Fixed all critical SEO issues
- [ ] Optimized images with alt text
- [ ] Added internal and external links
- [ ] Updated sitemap
- [ ] Set canonical URL
- [ ] Tested on mobile devices

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Moz SEO Learning Center](https://moz.com/learn/seo)
