/**
 * ImageGenerator - AI-powered image generation utility
 *
 * Supports multiple image generation APIs including:
 * - OpenAI DALL-E 3
 * - Stability AI (Stable Diffusion)
 * - Google Imagen
 * - Midjourney (via API)
 *
 * Features:
 * - Product image generation
 * - Logo creation
 * - Banner design
 * - Social media graphics
 * - Image optimization
 * - Variation generation
 */

import { AIHelper } from './AIHelper';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

/**
 * Supported image generation providers
 */
export type ImageProvider = 'openai' | 'stability' | 'google-imagen' | 'replicate' | 'auto';

/**
 * Image generation options
 */
export interface ImageGenerationOptions {
  provider?: ImageProvider;
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  style?: string;
  quality?: 'standard' | 'hd' | 'ultra';
  numberOfImages?: number;
  seed?: number;
  steps?: number;
  guidanceScale?: number;
  model?: string;
}

/**
 * Image optimization options
 */
export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'png' | 'jpg' | 'webp';
  compression?: boolean;
}

/**
 * Generated image result
 */
export interface GeneratedImage {
  url?: string;
  base64?: string;
  path?: string;
  width: number;
  height: number;
  prompt: string;
  provider: string;
  metadata?: {
    model?: string;
    seed?: number;
    cost?: number;
    generationTime?: number;
  };
}

/**
 * Logo generation options
 */
export interface LogoOptions {
  brandName: string;
  style?: 'modern' | 'vintage' | 'minimalist' | 'bold' | 'elegant' | 'playful';
  colors?: string[];
  symbols?: string[];
  industry?: string;
  format?: 'png' | 'svg';
}

/**
 * Banner design options
 */
export interface BannerOptions {
  type: 'web' | 'email' | 'social' | 'print';
  width: number;
  height: number;
  headline?: string;
  subheadline?: string;
  theme?: string;
  colors?: string[];
  includeText?: boolean;
}

/**
 * Social graphic options
 */
export interface SocialGraphicOptions {
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'tiktok';
  type: 'post' | 'story' | 'cover' | 'profile';
  message?: string;
  style?: string;
  brandColors?: string[];
  includeText?: boolean;
}

/**
 * API Configuration
 */
interface APIConfig {
  openai?: {
    apiKey: string;
    model?: string;
  };
  stability?: {
    apiKey: string;
    engineId?: string;
  };
  googleImagen?: {
    apiKey: string;
    projectId?: string;
  };
  replicate?: {
    apiKey: string;
  };
}

export class ImageGenerator {
  private config: APIConfig;
  private outputDir: string;
  private defaultProvider: ImageProvider;

  constructor(config: APIConfig = {}, outputDir: string = './generated-images') {
    this.config = {
      openai: config.openai || {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: 'dall-e-3'
      },
      stability: config.stability || {
        apiKey: process.env.STABILITY_API_KEY || '',
        engineId: 'stable-diffusion-xl-1024-v1-0'
      },
      googleImagen: config.googleImagen || {
        apiKey: process.env.GOOGLE_IMAGEN_API_KEY || '',
        projectId: process.env.GOOGLE_PROJECT_ID || ''
      },
      replicate: config.replicate || {
        apiKey: process.env.REPLICATE_API_KEY || ''
      }
    };

    this.outputDir = outputDir;
    this.defaultProvider = this.determineDefaultProvider();

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate a product image from description
   *
   * @param productName - Name of the product
   * @param description - Product description
   * @param options - Additional generation options
   * @returns Generated product image
   */
  async generateProductImage(
    productName: string,
    description: string,
    options: Partial<ImageGenerationOptions> = {}
  ): Promise<GeneratedImage> {
    const enhancedPrompt = this.buildProductPrompt(productName, description, options);

    const imageOptions: ImageGenerationOptions = {
      provider: options.provider || this.defaultProvider,
      prompt: enhancedPrompt,
      negativePrompt: options.negativePrompt || 'blurry, low quality, distorted, watermark, text, logo',
      width: options.width || 1024,
      height: options.height || 1024,
      quality: options.quality || 'hd',
      numberOfImages: 1,
      style: options.style || 'photorealistic',
      ...options
    };

    console.log(`Generating product image for: ${productName}`);

    return await this.generate(imageOptions);
  }

  /**
   * Create a logo design
   *
   * @param options - Logo generation options
   * @returns Generated logo image
   */
  async createLogo(options: LogoOptions): Promise<GeneratedImage> {
    const logoPrompt = this.buildLogoPrompt(options);

    const imageOptions: ImageGenerationOptions = {
      provider: this.defaultProvider,
      prompt: logoPrompt,
      negativePrompt: 'photo, photorealistic, 3d render, blurry, text in background, watermark',
      width: 1024,
      height: 1024,
      quality: 'hd',
      numberOfImages: 1,
      style: 'vector art, logo design'
    };

    console.log(`Creating logo for: ${options.brandName}`);

    return await this.generate(imageOptions);
  }

  /**
   * Design a banner/header image
   *
   * @param options - Banner design options
   * @returns Generated banner image
   */
  async designBanner(options: BannerOptions): Promise<GeneratedImage> {
    const bannerPrompt = this.buildBannerPrompt(options);

    const imageOptions: ImageGenerationOptions = {
      provider: this.defaultProvider,
      prompt: bannerPrompt,
      negativePrompt: 'blurry, low quality, pixelated, distorted',
      width: options.width,
      height: options.height,
      quality: 'hd',
      numberOfImages: 1
    };

    console.log(`Designing banner: ${options.type} (${options.width}x${options.height})`);

    return await this.generate(imageOptions);
  }

  /**
   * Create social media graphic
   *
   * @param options - Social graphic options
   * @returns Generated social media image
   */
  async createSocialGraphic(options: SocialGraphicOptions): Promise<GeneratedImage> {
    const socialPrompt = this.buildSocialGraphicPrompt(options);
    const dimensions = this.getSocialMediaDimensions(options.platform, options.type);

    const imageOptions: ImageGenerationOptions = {
      provider: this.defaultProvider,
      prompt: socialPrompt,
      negativePrompt: 'blurry, low quality, watermark, text overlay',
      width: dimensions.width,
      height: dimensions.height,
      quality: 'hd',
      numberOfImages: 1,
      style: options.style || 'social media, engaging, vibrant'
    };

    console.log(`Creating ${options.platform} ${options.type} graphic`);

    return await this.generate(imageOptions);
  }

  /**
   * Optimize an existing image
   *
   * @param imagePath - Path to the image to optimize
   * @param options - Optimization options
   * @returns Path to optimized image
   */
  async optimizeImage(
    imagePath: string,
    options: ImageOptimizationOptions = {}
  ): Promise<string> {
    console.log(`Optimizing image: ${imagePath}`);

    // Note: For production, you'd use sharp, jimp, or similar library
    // This is a placeholder implementation
    const optimizedPath = imagePath.replace(
      path.extname(imagePath),
      `-optimized${path.extname(imagePath)}`
    );

    // Placeholder: In production, implement actual image optimization
    // using libraries like sharp:
    // const sharp = require('sharp');
    // await sharp(imagePath)
    //   .resize(options.maxWidth, options.maxHeight, { fit: 'inside' })
    //   .jpeg({ quality: options.quality || 80 })
    //   .toFile(optimizedPath);

    console.log(`Image optimization placeholder - would create: ${optimizedPath}`);
    console.log(`Recommended: Install 'sharp' package for actual optimization`);

    return optimizedPath;
  }

  /**
   * Generate variations of an existing image
   *
   * @param baseImage - Base image to create variations from
   * @param numberOfVariations - Number of variations to generate
   * @param options - Additional generation options
   * @returns Array of generated variations
   */
  async generateVariations(
    baseImage: GeneratedImage,
    numberOfVariations: number = 3,
    options: Partial<ImageGenerationOptions> = {}
  ): Promise<GeneratedImage[]> {
    console.log(`Generating ${numberOfVariations} variations of image`);

    const variations: GeneratedImage[] = [];

    for (let i = 0; i < numberOfVariations; i++) {
      const variationOptions: ImageGenerationOptions = {
        provider: options.provider || this.defaultProvider,
        prompt: baseImage.prompt,
        width: options.width || baseImage.width,
        height: options.height || baseImage.height,
        quality: options.quality || 'hd',
        numberOfImages: 1,
        seed: options.seed ? options.seed + i : undefined,
        ...options
      };

      try {
        const variation = await this.generate(variationOptions);
        variations.push(variation);

        // Small delay between variations to avoid rate limits
        if (i < numberOfVariations - 1) {
          await this.sleep(1000);
        }
      } catch (error) {
        console.error(`Failed to generate variation ${i + 1}:`, error);
      }
    }

    return variations;
  }

  /**
   * Generate image using specified provider
   *
   * @param options - Image generation options
   * @returns Generated image result
   */
  private async generate(options: ImageGenerationOptions): Promise<GeneratedImage> {
    const provider = options.provider || this.defaultProvider;
    const startTime = Date.now();

    try {
      let result: GeneratedImage;

      switch (provider) {
        case 'openai':
          result = await this.generateWithOpenAI(options);
          break;
        case 'stability':
          result = await this.generateWithStability(options);
          break;
        case 'google-imagen':
          result = await this.generateWithGoogleImagen(options);
          break;
        case 'replicate':
          result = await this.generateWithReplicate(options);
          break;
        default:
          throw new Error(`Unsupported image provider: ${provider}`);
      }

      // Add generation metadata
      result.metadata = {
        ...result.metadata,
        generationTime: Date.now() - startTime
      };

      console.log(`Image generated successfully in ${result.metadata.generationTime}ms`);

      return result;
    } catch (error: any) {
      console.error(AIHelper.formatError(error, 'image generation'));
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  /**
   * Generate image using OpenAI DALL-E
   */
  private async generateWithOpenAI(options: ImageGenerationOptions): Promise<GeneratedImage> {
    if (!this.config.openai?.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const requestBody = {
      model: this.config.openai.model || 'dall-e-3',
      prompt: options.prompt,
      n: options.numberOfImages || 1,
      size: `${options.width}x${options.height}`,
      quality: options.quality || 'standard',
      response_format: 'url'
    };

    const response = await this.makeAPIRequest(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.openai.apiKey}`
        },
        body: JSON.stringify(requestBody)
      }
    );

    const imageUrl = response.data[0].url;
    const savedPath = await this.downloadImage(imageUrl, 'openai');

    return {
      url: imageUrl,
      path: savedPath,
      width: options.width || 1024,
      height: options.height || 1024,
      prompt: options.prompt,
      provider: 'openai',
      metadata: {
        model: requestBody.model,
        cost: this.estimateOpenAICost(requestBody.model, requestBody.quality)
      }
    };
  }

  /**
   * Generate image using Stability AI
   */
  private async generateWithStability(options: ImageGenerationOptions): Promise<GeneratedImage> {
    if (!this.config.stability?.apiKey) {
      throw new Error('Stability AI API key not configured');
    }

    const engineId = this.config.stability.engineId || 'stable-diffusion-xl-1024-v1-0';

    const requestBody = {
      text_prompts: [
        {
          text: options.prompt,
          weight: 1
        }
      ],
      cfg_scale: options.guidanceScale || 7,
      height: options.height || 1024,
      width: options.width || 1024,
      steps: options.steps || 30,
      samples: options.numberOfImages || 1,
      seed: options.seed || 0
    };

    if (options.negativePrompt) {
      requestBody.text_prompts.push({
        text: options.negativePrompt,
        weight: -1
      });
    }

    const response = await this.makeAPIRequest(
      `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.stability.apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    const base64Image = response.artifacts[0].base64;
    const savedPath = await this.saveBase64Image(base64Image, 'stability');

    return {
      base64: base64Image,
      path: savedPath,
      width: options.width || 1024,
      height: options.height || 1024,
      prompt: options.prompt,
      provider: 'stability',
      metadata: {
        model: engineId,
        seed: response.artifacts[0].seed,
        cost: this.estimateStabilityCost(engineId, options.steps || 30)
      }
    };
  }

  /**
   * Generate image using Google Imagen
   */
  private async generateWithGoogleImagen(options: ImageGenerationOptions): Promise<GeneratedImage> {
    if (!this.config.googleImagen?.apiKey) {
      throw new Error('Google Imagen API key not configured');
    }

    // Placeholder for Google Imagen API call
    // Actual implementation would depend on Google's Imagen API structure
    console.warn('Google Imagen integration is a placeholder - implement based on actual API');

    throw new Error('Google Imagen integration not yet implemented');
  }

  /**
   * Generate image using Replicate
   */
  private async generateWithReplicate(options: ImageGenerationOptions): Promise<GeneratedImage> {
    if (!this.config.replicate?.apiKey) {
      throw new Error('Replicate API key not configured');
    }

    const model = options.model || 'stability-ai/sdxl:latest';

    const requestBody = {
      version: model,
      input: {
        prompt: options.prompt,
        negative_prompt: options.negativePrompt,
        width: options.width || 1024,
        height: options.height || 1024,
        num_outputs: options.numberOfImages || 1,
        guidance_scale: options.guidanceScale || 7.5,
        num_inference_steps: options.steps || 50,
        seed: options.seed
      }
    };

    const response = await this.makeAPIRequest(
      'https://api.replicate.com/v1/predictions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.config.replicate.apiKey}`
        },
        body: JSON.stringify(requestBody)
      }
    );

    // Poll for completion
    const result = await this.pollReplicateResult(response.id);
    const imageUrl = result.output[0];
    const savedPath = await this.downloadImage(imageUrl, 'replicate');

    return {
      url: imageUrl,
      path: savedPath,
      width: options.width || 1024,
      height: options.height || 1024,
      prompt: options.prompt,
      provider: 'replicate',
      metadata: {
        model: model,
        cost: 0.01 // Approximate cost
      }
    };
  }

  // ==================== Prompt Building Methods ====================

  private buildProductPrompt(
    productName: string,
    description: string,
    options: Partial<ImageGenerationOptions>
  ): string {
    let prompt = `Professional product photography of ${productName}. ${description}. `;
    prompt += `Studio lighting, white background, high resolution, commercial quality. `;

    if (options.style) {
      prompt += `Style: ${options.style}. `;
    }

    prompt += `Sharp focus, detailed, 8k quality.`;

    return prompt;
  }

  private buildLogoPrompt(options: LogoOptions): string {
    let prompt = `Professional logo design for "${options.brandName}". `;

    if (options.style) {
      prompt += `${options.style} style. `;
    }

    if (options.industry) {
      prompt += `Industry: ${options.industry}. `;
    }

    if (options.colors && options.colors.length > 0) {
      prompt += `Color scheme: ${options.colors.join(', ')}. `;
    }

    if (options.symbols && options.symbols.length > 0) {
      prompt += `Incorporate: ${options.symbols.join(', ')}. `;
    }

    prompt += `Clean, professional, memorable, scalable, vector-style design. `;
    prompt += `Simple, iconic, suitable for branding.`;

    return prompt;
  }

  private buildBannerPrompt(options: BannerOptions): string {
    let prompt = `Professional ${options.type} banner design. `;

    if (options.headline) {
      prompt += `Main message: "${options.headline}". `;
    }

    if (options.theme) {
      prompt += `Theme: ${options.theme}. `;
    }

    if (options.colors && options.colors.length > 0) {
      prompt += `Color palette: ${options.colors.join(', ')}. `;
    }

    prompt += `Eye-catching, professional, modern design. `;
    prompt += `High quality, suitable for ${options.type} use.`;

    return prompt;
  }

  private buildSocialGraphicPrompt(options: SocialGraphicOptions): string {
    let prompt = `${options.platform} ${options.type} graphic. `;

    if (options.message) {
      prompt += `Message/theme: "${options.message}". `;
    }

    if (options.style) {
      prompt += `Style: ${options.style}. `;
    }

    if (options.brandColors && options.brandColors.length > 0) {
      prompt += `Brand colors: ${options.brandColors.join(', ')}. `;
    }

    prompt += `Engaging, eye-catching, social media optimized. `;
    prompt += `Professional quality, suitable for ${options.platform}.`;

    return prompt;
  }

  // ==================== Helper Methods ====================

  private getSocialMediaDimensions(
    platform: string,
    type: string
  ): { width: number; height: number } {
    const dimensions: Record<string, Record<string, { width: number; height: number }>> = {
      instagram: {
        post: { width: 1080, height: 1080 },
        story: { width: 1080, height: 1920 },
        cover: { width: 1080, height: 1080 }
      },
      facebook: {
        post: { width: 1200, height: 630 },
        cover: { width: 820, height: 312 },
        profile: { width: 180, height: 180 }
      },
      twitter: {
        post: { width: 1200, height: 675 },
        cover: { width: 1500, height: 500 },
        profile: { width: 400, height: 400 }
      },
      linkedin: {
        post: { width: 1200, height: 627 },
        cover: { width: 1584, height: 396 },
        profile: { width: 400, height: 400 }
      },
      pinterest: {
        post: { width: 1000, height: 1500 }
      },
      tiktok: {
        post: { width: 1080, height: 1920 }
      }
    };

    return dimensions[platform]?.[type] || { width: 1200, height: 1200 };
  }

  private async downloadImage(url: string, provider: string): Promise<string> {
    const timestamp = Date.now();
    const filename = `${provider}-${timestamp}.png`;
    const filepath = path.join(this.outputDir, filename);

    await this.downloadFile(url, filepath);

    console.log(`Image saved to: ${filepath}`);
    return filepath;
  }

  private async saveBase64Image(base64Data: string, provider: string): Promise<string> {
    const timestamp = Date.now();
    const filename = `${provider}-${timestamp}.png`;
    const filepath = path.join(this.outputDir, filename);

    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filepath, buffer);

    console.log(`Image saved to: ${filepath}`);
    return filepath;
  }

  private async downloadFile(url: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      const file = fs.createWriteStream(filepath);

      protocol.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (error) => {
        fs.unlink(filepath, () => {});
        reject(error);
      });
    });
  }

  private async makeAPIRequest(url: string, options: any): Promise<any> {
    return await AIHelper.retryWithBackoff(async () => {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      return await response.json();
    }, { maxRetries: 3 });
  }

  private async pollReplicateResult(predictionId: string, maxAttempts: number = 60): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await this.makeAPIRequest(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${this.config.replicate?.apiKey}`
          }
        }
      );

      if (response.status === 'succeeded') {
        return response;
      }

      if (response.status === 'failed') {
        throw new Error(`Replicate prediction failed: ${response.error}`);
      }

      // Wait before polling again
      await this.sleep(2000);
    }

    throw new Error('Replicate prediction timed out');
  }

  private determineDefaultProvider(): ImageProvider {
    if (this.config.openai?.apiKey) return 'openai';
    if (this.config.stability?.apiKey) return 'stability';
    if (this.config.replicate?.apiKey) return 'replicate';
    if (this.config.googleImagen?.apiKey) return 'google-imagen';

    console.warn('No image generation API keys configured. Set OPENAI_API_KEY, STABILITY_API_KEY, or REPLICATE_API_KEY in .env');
    return 'openai'; // Default fallback
  }

  private estimateOpenAICost(model: string, quality: string): number {
    // DALL-E 3 pricing (as of 2024)
    if (model === 'dall-e-3') {
      return quality === 'hd' ? 0.08 : 0.04; // Per image
    }
    return 0.02; // DALL-E 2 pricing
  }

  private estimateStabilityCost(engineId: string, steps: number): number {
    // Stability AI pricing (approximate)
    const basePrice = 0.002;
    const stepMultiplier = steps / 30;
    return basePrice * stepMultiplier;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Export singleton instance getter
 */
let imageGeneratorInstance: ImageGenerator | null = null;

export function getImageGenerator(
  config?: APIConfig,
  outputDir?: string
): ImageGenerator {
  if (!imageGeneratorInstance) {
    imageGeneratorInstance = new ImageGenerator(config, outputDir);
  }
  return imageGeneratorInstance;
}
