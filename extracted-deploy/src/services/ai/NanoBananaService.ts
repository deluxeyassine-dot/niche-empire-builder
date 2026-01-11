import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';

/**
 * NanoBanana AI Service
 *
 * Integration with NanoBanana API for:
 * - AI image generation
 * - Text-to-image
 * - Image-to-image
 * - Style transfer
 * - Upscaling
 *
 * Perfect for:
 * - Wall art creation
 * - Product mockups
 * - Marketing materials
 * - Social media graphics
 */

export interface NanoBananaConfig {
  apiKey: string;
  baseURL?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  model?: string;
  width?: number;
  height?: number;
  numInferenceSteps?: number;
  guidanceScale?: number;
  numImages?: number;
  seed?: number;
  scheduler?: string;
  style?: string;
}

export interface ImageGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  images?: string[]; // URLs or base64
  createdAt: number;
  finishedAt?: number;
  error?: string;
}

export interface UpscaleRequest {
  image: string; // URL or base64
  scale?: 2 | 4;
  model?: string;
}

export interface StyleTransferRequest {
  contentImage: string;
  styleImage: string;
  strength?: number;
}

export class NanoBananaService {
  private client: AxiosInstance;
  private config: NanoBananaConfig;

  constructor(config: NanoBananaConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL || 'https://api.nanobanana.ai/v1',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 120000, // 2 minutes
    });
  }

  /**
   * Generate image from text prompt
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const response = await this.client.post('/generate', {
      prompt: request.prompt,
      negative_prompt: request.negativePrompt || 'blurry, low quality, distorted',
      model: request.model || 'sdxl-1.0',
      width: request.width || 1024,
      height: request.height || 1024,
      num_inference_steps: request.numInferenceSteps || 30,
      guidance_scale: request.guidanceScale || 7.5,
      num_images: request.numImages || 1,
      seed: request.seed,
      scheduler: request.scheduler || 'DPMSolverMultistep',
      style: request.style,
    });

    return this.mapResponse(response.data);
  }

  /**
   * Generate image with specific style
   */
  async generateWithStyle(
    prompt: string,
    style: 'realistic' | 'anime' | 'digital-art' | 'fantasy' | 'photographic' | '3d-model' | 'vintage' | 'minimalist'
  ): Promise<ImageGenerationResponse> {
    const stylePrompts = {
      realistic: ', highly detailed, photorealistic, 8k, professional photography',
      anime: ', anime style, manga, cel shaded, vibrant colors',
      'digital-art': ', digital art, artstation, concept art, highly detailed',
      fantasy: ', fantasy art, magical, ethereal, dreamy atmosphere',
      photographic: ', professional photography, studio lighting, sharp focus, bokeh',
      '3d-model': ', 3d render, octane render, unreal engine, highly detailed',
      vintage: ', vintage style, retro, aged, nostalgic, film grain',
      minimalist: ', minimalist, clean, simple, modern design, negative space',
    };

    return this.generateImage({
      prompt: prompt + stylePrompts[style],
      style,
    });
  }

  /**
   * Generate wallart suitable image
   */
  async generateWallArt(theme: string, style: string, size: { width: number; height: number }): Promise<ImageGenerationResponse> {
    const prompt = `Beautiful ${style} wall art featuring ${theme}, suitable for printing, high quality, professional artwork, vibrant colors, centered composition`;

    return this.generateImage({
      prompt,
      width: size.width,
      height: size.height,
      numInferenceSteps: 50,
      guidanceScale: 8.5,
    });
  }

  /**
   * Generate clipart element
   */
  async generateClipart(subject: string, style: string): Promise<ImageGenerationResponse> {
    const prompt = `${style} style clipart of ${subject}, isolated on transparent background, clean lines, high quality illustration, centered, professional`;

    return this.generateImage({
      prompt,
      negativePrompt: 'background, busy, cluttered, blurry, low quality, photographic',
      width: 1024,
      height: 1024,
      guidanceScale: 9,
    });
  }

  /**
   * Generate product mockup background
   */
  async generateMockupBackground(style: string): Promise<ImageGenerationResponse> {
    const prompt = `${style} product photography background, professional studio setup, clean aesthetic, suitable for product mockups, high quality`;

    return this.generateImage({
      prompt,
      width: 1920,
      height: 1080,
      guidanceScale: 7,
    });
  }

  /**
   * Upscale image
   */
  async upscaleImage(request: UpscaleRequest): Promise<ImageGenerationResponse> {
    const response = await this.client.post('/upscale', {
      image: request.image,
      scale: request.scale || 4,
      model: request.model || 'real-esrgan',
    });

    return this.mapResponse(response.data);
  }

  /**
   * Apply style transfer
   */
  async styleTransfer(request: StyleTransferRequest): Promise<ImageGenerationResponse> {
    const response = await this.client.post('/style-transfer', {
      content_image: request.contentImage,
      style_image: request.styleImage,
      strength: request.strength || 0.8,
    });

    return this.mapResponse(response.data);
  }

  /**
   * Image to image transformation
   */
  async imageToImage(
    sourceImage: string,
    prompt: string,
    strength = 0.7
  ): Promise<ImageGenerationResponse> {
    const response = await this.client.post('/img2img', {
      image: sourceImage,
      prompt,
      strength,
      num_inference_steps: 40,
      guidance_scale: 7.5,
    });

    return this.mapResponse(response.data);
  }

  /**
   * Get generation status
   */
  async getStatus(generationId: string): Promise<ImageGenerationResponse> {
    const response = await this.client.get(`/generations/${generationId}`);
    return this.mapResponse(response.data);
  }

  /**
   * Wait for generation to complete
   */
  async waitForCompletion(
    generationId: string,
    maxWaitTime = 300000, // 5 minutes
    pollInterval = 3000 // 3 seconds
  ): Promise<ImageGenerationResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getStatus(generationId);

      if (status.status === 'completed') {
        return status;
      }

      if (status.status === 'failed') {
        throw new Error(`Generation failed: ${status.error}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Generation timed out');
  }

  /**
   * Generate and wait for completion
   */
  async generateImageSync(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const generation = await this.generateImage(request);

    if (generation.status === 'completed') {
      return generation;
    }

    return this.waitForCompletion(generation.id);
  }

  /**
   * Download generated image
   */
  async downloadImage(imageUrl: string, outputPath: string): Promise<void> {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    await fs.writeFile(outputPath, response.data);
  }

  /**
   * Generate multiple variations
   */
  async generateVariations(
    prompt: string,
    count: number,
    options?: Partial<ImageGenerationRequest>
  ): Promise<ImageGenerationResponse[]> {
    const generations: Promise<ImageGenerationResponse>[] = [];

    for (let i = 0; i < count; i++) {
      generations.push(
        this.generateImage({
          prompt,
          ...options,
          seed: options?.seed ? options.seed + i : undefined,
        })
      );
    }

    return Promise.all(generations);
  }

  /**
   * Batch generate images
   */
  async batchGenerate(
    requests: ImageGenerationRequest[]
  ): Promise<ImageGenerationResponse[]> {
    const generations = requests.map(request => this.generateImageSync(request));
    return Promise.all(generations);
  }

  /**
   * Get available models
   */
  async getModels(): Promise<string[]> {
    const response = await this.client.get('/models');
    return response.data.models || [];
  }

  /**
   * Get account credits
   */
  async getCredits(): Promise<number> {
    const response = await this.client.get('/account/credits');
    return response.data.credits || 0;
  }

  /**
   * Estimate cost for generation
   */
  estimateCost(request: ImageGenerationRequest): number {
    const baseCredits = 1;
    const resolutionMultiplier = ((request.width || 1024) * (request.height || 1024)) / (1024 * 1024);
    const imageMultiplier = request.numImages || 1;
    const stepMultiplier = (request.numInferenceSteps || 30) / 30;

    return Math.ceil(baseCredits * resolutionMultiplier * imageMultiplier * stepMultiplier);
  }

  /**
   * Map API response to standard format
   */
  private mapResponse(data: any): ImageGenerationResponse {
    return {
      id: data.id || data.generation_id,
      status: data.status,
      images: data.images || data.output?.images,
      createdAt: data.created_at || Date.now(),
      finishedAt: data.finished_at,
      error: data.error,
    };
  }

  /**
   * Optimize prompt for better results
   */
  optimizePrompt(basicPrompt: string, quality: 'standard' | 'high' | 'ultra' = 'high'): string {
    let optimized = basicPrompt;

    const qualitySuffixes = {
      standard: ', good quality, clear details',
      high: ', highly detailed, professional quality, 8k, sharp focus, vibrant colors',
      ultra: ', masterpiece, best quality, ultra detailed, 8k uhd, professional, award winning, incredibly detailed, perfect composition',
    };

    optimized += qualitySuffixes[quality];

    return optimized;
  }
}

export default NanoBananaService;
