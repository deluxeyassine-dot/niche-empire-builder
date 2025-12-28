# ImageGenerator Usage Guide

The `ImageGenerator` utility class provides AI-powered image generation capabilities for creating product images, logos, banners, and social media graphics.

## Features

- **Multiple AI Providers**: Support for OpenAI DALL-E, Stability AI, Replicate, and Google Imagen
- **Product Images**: Generate professional product photography
- **Logo Design**: Create brand logos with specific styles and colors
- **Banner Creation**: Design web, email, and social media banners
- **Social Graphics**: Create platform-optimized social media images
- **Image Optimization**: Optimize images for web use
- **Variations**: Generate multiple variations of existing images

## Setup

### 1. Install Dependencies

```bash
npm install dotenv
```

### 2. Configure API Keys

Add your API keys to the `.env` file:

```env
# Image Generation API Keys (at least one required)
OPENAI_API_KEY=sk-your-openai-key-here
STABILITY_API_KEY=sk-your-stability-key-here
REPLICATE_API_KEY=r8_your-replicate-key-here
GOOGLE_IMAGEN_API_KEY=your-google-imagen-key-here
GOOGLE_PROJECT_ID=your-google-project-id
```

### 3. Get API Keys

- **OpenAI DALL-E**: https://platform.openai.com/api-keys
- **Stability AI**: https://platform.stability.ai/account/keys
- **Replicate**: https://replicate.com/account/api-tokens
- **Google Imagen**: https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview

## Basic Usage

```typescript
import { getImageGenerator } from './utils/ImageGenerator';

const imageGen = getImageGenerator();
```

## Examples

### Generate Product Image

```typescript
const productImage = await imageGen.generateProductImage(
  'Premium Wireless Headphones',
  'Sleek black over-ear headphones with noise cancellation',
  {
    width: 1024,
    height: 1024,
    quality: 'hd',
    style: 'professional product photography',
    provider: 'openai' // optional, auto-selected if not specified
  }
);

console.log(`Image saved to: ${productImage.path}`);
console.log(`Image URL: ${productImage.url}`);
```

### Create Logo

```typescript
const logo = await imageGen.createLogo({
  brandName: 'EcoClean Pro',
  style: 'modern', // 'modern' | 'vintage' | 'minimalist' | 'bold' | 'elegant' | 'playful'
  colors: ['green', 'white'],
  symbols: ['leaf', 'water drop'],
  industry: 'eco-friendly cleaning products'
});

console.log(`Logo saved to: ${logo.path}`);
```

### Design Banner

```typescript
const banner = await imageGen.designBanner({
  type: 'web', // 'web' | 'email' | 'social' | 'print'
  width: 1200,
  height: 630,
  headline: 'Summer Sale - Up to 50% Off',
  subheadline: 'Limited Time Offer',
  theme: 'vibrant summer vibes',
  colors: ['orange', 'yellow', 'blue'],
  includeText: false
});

console.log(`Banner saved to: ${banner.path}`);
```

### Create Social Media Graphic

```typescript
const socialGraphic = await imageGen.createSocialGraphic({
  platform: 'instagram', // 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'tiktok'
  type: 'post', // 'post' | 'story' | 'cover' | 'profile'
  message: 'Sustainable living tips',
  style: 'minimalist, eco-friendly',
  brandColors: ['green', 'beige'],
  includeText: false
});

console.log(`Social graphic saved to: ${socialGraphic.path}`);
```

### Optimize Image

```typescript
const optimizedPath = await imageGen.optimizeImage(
  './generated-images/product.png',
  {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 80,
    format: 'jpg',
    compression: true
  }
);

console.log(`Optimized image: ${optimizedPath}`);
```

**Note**: Image optimization requires installing the `sharp` package:
```bash
npm install sharp
```

### Generate Variations

```typescript
const variations = await imageGen.generateVariations(
  baseImage, // Generated image object
  3, // Number of variations
  {
    seed: 12345, // Optional: for reproducible variations
    quality: 'hd'
  }
);

console.log(`Generated ${variations.length} variations`);
variations.forEach((img, i) => {
  console.log(`Variation ${i + 1}: ${img.path}`);
});
```

## Advanced Configuration

### Custom Configuration

```typescript
import { ImageGenerator } from './utils/ImageGenerator';

const imageGen = new ImageGenerator(
  {
    openai: {
      apiKey: 'your-key',
      model: 'dall-e-3'
    },
    stability: {
      apiKey: 'your-key',
      engineId: 'stable-diffusion-xl-1024-v1-0'
    }
  },
  './custom-output-directory'
);
```

### Provider-Specific Options

```typescript
const image = await imageGen.generateProductImage(
  'Product Name',
  'Description',
  {
    provider: 'stability',
    steps: 50, // Inference steps (Stability AI)
    guidanceScale: 7.5, // CFG scale (Stability AI)
    seed: 42, // Seed for reproducibility
    negativePrompt: 'blurry, low quality, watermark'
  }
);
```

## Social Media Dimensions

The ImageGenerator automatically uses optimal dimensions for each platform:

| Platform  | Type    | Dimensions      |
|-----------|---------|-----------------|
| Instagram | Post    | 1080 x 1080     |
| Instagram | Story   | 1080 x 1920     |
| Facebook  | Post    | 1200 x 630      |
| Facebook  | Cover   | 820 x 312       |
| Twitter   | Post    | 1200 x 675      |
| Twitter   | Cover   | 1500 x 500      |
| LinkedIn  | Post    | 1200 x 627      |
| LinkedIn  | Cover   | 1584 x 396      |
| Pinterest | Post    | 1000 x 1500     |
| TikTok    | Post    | 1080 x 1920     |

## Cost Estimation

The ImageGenerator includes cost estimation for each generation:

```typescript
const image = await imageGen.generateProductImage(...);

if (image.metadata?.cost) {
  console.log(`Estimated cost: $${image.metadata.cost.toFixed(4)}`);
}
```

### Pricing Reference (Approximate)

- **DALL-E 3**: $0.04 - $0.08 per image
- **DALL-E 2**: $0.02 per image
- **Stability AI**: ~$0.002 - $0.01 per image
- **Replicate**: ~$0.01 per image (varies by model)

## Error Handling

The ImageGenerator includes robust error handling with retry logic:

```typescript
try {
  const image = await imageGen.generateProductImage(...);
  console.log('Success:', image.path);
} catch (error) {
  console.error('Failed to generate image:', error.message);
  // Fallback logic here
}
```

## Best Practices

1. **API Keys**: Keep API keys secure in `.env` file, never commit them
2. **Rate Limits**: The utility includes automatic retry and rate limiting
3. **Quality**: Use `quality: 'hd'` for production images
4. **Prompts**: Be specific and detailed for better results
5. **Negative Prompts**: Use to avoid unwanted elements
6. **Output Directory**: Ensure write permissions for the output directory
7. **Cost Management**: Monitor costs, especially with DALL-E 3

## Troubleshooting

### "No API keys configured"
- Ensure at least one API key is set in `.env`
- Check that the `.env` file is in the project root
- Verify `dotenv.config()` is called before using ImageGenerator

### "Image generation failed"
- Check API key validity
- Verify account has credits/quota
- Check network connectivity
- Review error message for specific provider issues

### "Rate limit exceeded"
- Wait for rate limit reset (automatically handled)
- Reduce concurrent requests
- Consider upgrading API plan

## Testing

Run the test file to verify setup:

```bash
npx ts-node src/test-image-generator.ts
```

## Integration Example

```typescript
import { getImageGenerator } from './utils/ImageGenerator';
import { getGeminiService } from './services/GeminiService';

// Generate product description
const gemini = getGeminiService();
const description = await gemini.generateProductDescription({
  productName: 'Eco Water Bottle',
  features: ['Stainless steel', 'Double-walled'],
  benefits: ['Keeps drinks cold for 24h'],
  category: 'Drinkware'
});

// Generate product image
const imageGen = getImageGenerator();
const productImage = await imageGen.generateProductImage(
  'Eco Water Bottle',
  description.longDescription,
  {
    quality: 'hd',
    style: 'professional product photography'
  }
);

console.log('Product ready!');
console.log('Description:', description.shortDescription);
console.log('Image:', productImage.path);
```

## Future Enhancements

- Image editing and inpainting
- Background removal
- Upscaling support
- Batch generation optimization
- Image-to-image transformations
- Style transfer
- Custom model fine-tuning support
