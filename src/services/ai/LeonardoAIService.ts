import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';

/**
 * Leonardo AI Service
 *
 * Integration with Leonardo.AI for:
 * - AI image generation with multiple models
 * - Fine-tuned custom models
 * - Image upscaling
 * - Background removal
 * - Image variations
 *
 * Perfect for:
 * - Product imagery
 * - Character design
 * - Concept art
 * - Marketing visuals
 * - Game assets
 */

export interface LeonardoConfig {
  apiKey: string;
  baseURL?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  modelId?: string; // Custom or platform model
  width?: number;
  height?: number;
  numImages?: number;
  guidanceScale?: number;
  steps?: number;
  seed?: number;
  scheduler?: string;
  presetStyle?: string;
  photoReal?: boolean;
  alchemyMode?: boolean;
  controlnets?: any[];
}

export interface ImageGenerationResponse {
  generationId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED';
  images?: Array<{
    id: string;
    url: string;
    likelyhood?: number;
    nsfw?: boolean;
  }>;
  modelId?: string;
  prompt?: string;
  createdAt: string;
}

export interface UpscaleRequest {
  imageId: string;
  upscaleMultiplier?: 1.5 | 2;
  creativityStrength?: number;
}

export interface BackgroundRemovalRequest {
  imageId: string;
}

export class LeonardoAIService {
  private client: AxiosInstance;
  private config: LeonardoConfig;

  // Popular Leonardo models
  private readonly MODELS = {
    'leonardo-phoenix': '6b645e3a-d64f-4341-a6d8-7a3690fbf042',
    'leonardo-kino-xl': 'aa77f04e-3eec-4034-9c07-d0f619684628',
    'leonardo-diffusion-xl': '2067ae52-33fd-4a82-bb92-c2c55e7d2786',
    'leonardo-vision-xl': '5c232a9e-9061-4777-980a-ddc8e65647c6',
    'photoreal': 'cd2b2a15-9760-4174-a5ff-4d2925057376',
    'anime-pastel-dream': '1e60896f-3c26-4296-8ecc-53e2afecc132',
  };

  constructor(config: LeonardoConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL || 'https://cloud.leonardo.ai/api/rest/v1',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 120000,
    });
  }

  /**
   * Generate images from text prompt
   */
  async generateImages(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const response = await this.client.post('/generations', {
      prompt: request.prompt,
      negative_prompt: request.negativePrompt,
      modelId: request.modelId || this.MODELS['leonardo-phoenix'],
      width: request.width || 1024,
      height: request.height || 1024,
      num_images: request.numImages || 1,
      guidance_scale: request.guidanceScale || 7,
      num_inference_steps: request.steps || 30,
      seed: request.seed,
      scheduler: request.scheduler,
      presetStyle: request.presetStyle,
      photoReal: request.photoReal,
      alchemy: request.alchemyMode,
      controlnets: request.controlnets,
    });

    return {
      generationId: response.data.sdGenerationJob.generationId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Generate with PhotoReal mode (ultra-realistic)
   */
  async generatePhotoReal(
    prompt: string,
    options?: Partial<ImageGenerationRequest>
  ): Promise<ImageGenerationResponse> {
    return this.generateImages({
      prompt,
      modelId: this.MODELS['photoreal'],
      photoReal: true,
      alchemyMode: true,
      guidanceScale: 8,
      steps: 40,
      ...options,
    });
  }

  /**
   * Generate product images
   */
  async generateProductImage(
    productDescription: string,
    background: 'white' | 'lifestyle' | 'studio' | 'custom' = 'white',
    customBackground?: string
  ): Promise<ImageGenerationResponse> {
    let prompt = `Professional product photography of ${productDescription}, `;

    const backgroundPrompts = {
      white: 'clean white background, studio lighting, centered, professional e-commerce photo',
      lifestyle: 'lifestyle setting, natural environment, in-context use, professional photography',
      studio: 'studio setup, professional lighting, gradient background, commercial photography',
      custom: customBackground || '',
    };

    prompt += backgroundPrompts[background];

    return this.generatePhotoReal(prompt, {
      width: 1024,
      height: 1024,
      numImages: 4,
    });
  }

  /**
   * Generate character designs
   */
  async generateCharacter(
    description: string,
    style: 'realistic' | 'anime' | 'cartoon' | 'fantasy' = 'realistic'
  ): Promise<ImageGenerationResponse> {
    const styleModels = {
      realistic: this.MODELS['photoreal'],
      anime: this.MODELS['anime-pastel-dream'],
      cartoon: this.MODELS['leonardo-diffusion-xl'],
      fantasy: this.MODELS['leonardo-vision-xl'],
    };

    const prompt = `Character design: ${description}, full body, character sheet, professional illustration, highly detailed`;

    return this.generateImages({
      prompt,
      modelId: styleModels[style],
      width: 768,
      height: 1024,
      numImages: 4,
      guidanceScale: 7.5,
    });
  }

  /**
   * Generate concept art
   */
  async generateConceptArt(
    concept: string,
    artStyle: string
  ): Promise<ImageGenerationResponse> {
    const prompt = `Concept art of ${concept}, ${artStyle} style, highly detailed, professional illustration, artstation quality`;

    return this.generateImages({
      prompt,
      modelId: this.MODELS['leonardo-vision-xl'],
      width: 1344,
      height: 768,
      numImages: 4,
      alchemyMode: true,
    });
  }

  /**
   * Generate marketing visuals
   */
  async generateMarketingVisual(
    theme: string,
    message: string,
    format: 'square' | 'portrait' | 'landscape' = 'square'
  ): Promise<ImageGenerationResponse> {
    const dimensions = {
      square: { width: 1024, height: 1024 },
      portrait: { width: 768, height: 1024 },
      landscape: { width: 1344, height: 768 },
    };

    const prompt = `Marketing visual for ${theme}: ${message}. Professional design, eye-catching, modern, commercial quality, vibrant colors`;

    return this.generateImages({
      prompt,
      ...dimensions[format],
      alchemyMode: true,
      guidanceScale: 8,
    });
  }

  /**
   * Get generation status and results
   */
  async getGeneration(generationId: string): Promise<ImageGenerationResponse> {
    const response = await this.client.get(`/generations/${generationId}`);

    const generation = response.data.generations_by_pk;

    return {
      generationId: generation.id,
      status: generation.status,
      images: generation.generated_images?.map((img: any) => ({
        id: img.id,
        url: img.url,
        likelyhood: img.likelyhood,
        nsfw: img.nsfw,
      })),
      modelId: generation.modelId,
      prompt: generation.prompt,
      createdAt: generation.createdAt,
    };
  }

  /**
   * Wait for generation to complete
   */
  async waitForCompletion(
    generationId: string,
    maxWaitTime = 300000,
    pollInterval = 3000
  ): Promise<ImageGenerationResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const result = await this.getGeneration(generationId);

      if (result.status === 'COMPLETE') {
        return result;
      }

      if (result.status === 'FAILED') {
        throw new Error('Generation failed');
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Generation timed out');
  }

  /**
   * Generate and wait for completion
   */
  async generateImagesSync(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const generation = await this.generateImages(request);
    return this.waitForCompletion(generation.generationId);
  }

  /**
   * Upscale image
   */
  async upscaleImage(request: UpscaleRequest): Promise<{ variationId: string }> {
    const response = await this.client.post('/variations/upscale', {
      id: request.imageId,
      upscaleMultiplier: request.upscaleMultiplier || 2,
      creativityStrength: request.creativityStrength || 5,
    });

    return {
      variationId: response.data.sdUpscaleJob.id,
    };
  }

  /**
   * Remove background from image
   */
  async removeBackground(imageId: string): Promise<{ variationId: string }> {
    const response = await this.client.post('/variations/nobg', {
      id: imageId,
    });

    return {
      variationId: response.data.sdNobgJob.id,
    };
  }

  /**
   * Get upscale/variation result
   */
  async getVariation(variationId: string): Promise<any> {
    const response = await this.client.get(`/variations/${variationId}`);
    return response.data;
  }

  /**
   * Create image variations
   */
  async createVariations(imageId: string, count: number = 4): Promise<ImageGenerationResponse> {
    const response = await this.client.post('/variations/create', {
      id: imageId,
      num_images: count,
    });

    return {
      generationId: response.data.sdGenerationJob.generationId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Download image
   */
  async downloadImage(imageUrl: string, outputPath: string): Promise<void> {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    await fs.writeFile(outputPath, response.data);
  }

  /**
   * List available models
   */
  async listModels(): Promise<any[]> {
    const response = await this.client.get('/platformModels');
    return response.data.custom_models || [];
  }

  /**
   * Get user info
   */
  async getUserInfo(): Promise<any> {
    const response = await this.client.get('/me');
    return response.data.user_details[0];
  }

  /**
   * Get token balance
   */
  async getTokenBalance(): Promise<number> {
    const userInfo = await this.getUserInfo();
    return userInfo.tokenRenewalBalance || 0;
  }

  /**
   * Batch generate with multiple prompts
   */
  async batchGenerate(
    prompts: string[],
    options?: Partial<ImageGenerationRequest>
  ): Promise<ImageGenerationResponse[]> {
    const generations = prompts.map(prompt =>
      this.generateImages({
        prompt,
        ...options,
      })
    );

    const results = await Promise.all(generations);

    // Wait for all to complete
    return Promise.all(
      results.map(result => this.waitForCompletion(result.generationId))
    );
  }

  /**
   * Generate with style preset
   */
  async generateWithPreset(
    prompt: string,
    preset: 'cinematic' | 'creative' | 'vibrant' | 'none' = 'none'
  ): Promise<ImageGenerationResponse> {
    return this.generateImages({
      prompt,
      presetStyle: preset,
      alchemyMode: true,
    });
  }

  /**
   * Estimate cost for generation
   */
  estimateCost(request: ImageGenerationRequest): number {
    const baseTokens = 1;
    const imageMultiplier = request.numImages || 1;
    const resolutionMultiplier =
      ((request.width || 1024) * (request.height || 1024)) / (1024 * 1024);
    const alchemyMultiplier = request.alchemyMode ? 2 : 1;
    const photoRealMultiplier = request.photoReal ? 3 : 1;

    return Math.ceil(
      baseTokens * imageMultiplier * resolutionMultiplier * alchemyMultiplier * photoRealMultiplier
    );
  }

  /**
   * Get popular models list
   */
  getPopularModels(): Record<string, string> {
    return this.MODELS;
  }

  /**
   * Optimize prompt for Leonardo AI
   */
  optimizePrompt(basicPrompt: string, quality: 'standard' | 'high' | 'ultra' = 'high'): string {
    let optimized = basicPrompt;

    const qualitySuffixes = {
      standard: ', good quality, detailed',
      high: ', highly detailed, professional quality, sharp focus, 8k',
      ultra: ', masterpiece, ultra detailed, professional, award winning, perfect composition, photorealistic, 8k uhd',
    };

    optimized += qualitySuffixes[quality];

    // Add negative prompts
    const negativePrompt = 'blurry, low quality, distorted, ugly, bad anatomy, worst quality';

    return optimized;
  }
}

export default LeonardoAIService;
