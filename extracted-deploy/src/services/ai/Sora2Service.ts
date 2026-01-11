import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';

/**
 * Sora 2 AI Service
 *
 * Integration with OpenAI Sora 2 for:
 * - Text-to-video generation
 * - Image-to-video animation
 * - Video editing and extension
 * - Style transfer for videos
 *
 * Perfect for:
 * - YouTube content creation
 * - Social media videos
 * - Product demonstrations
 * - Marketing videos
 * - Educational content
 */

export interface Sora2Config {
  apiKey: string;
  baseURL?: string;
}

export interface VideoGenerationRequest {
  prompt: string;
  model?: 'sora-2.0' | 'sora-2.0-turbo';
  duration?: number; // seconds (5, 10, 15, 20)
  resolution?: '720p' | '1080p' | '4k';
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3';
  fps?: 24 | 30 | 60;
  style?: string;
  seed?: number;
  numVariations?: number;
}

export interface ImageToVideoRequest {
  image: string; // URL or base64
  prompt?: string;
  duration?: number;
  motion?: 'subtle' | 'moderate' | 'dynamic';
  cameraMovement?: 'static' | 'pan' | 'zoom' | 'rotate' | 'dolly';
}

export interface VideoExtensionRequest {
  video: string;
  direction?: 'forward' | 'backward';
  duration?: number; // additional seconds
  prompt?: string;
}

export interface VideoGenerationResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  resolution?: string;
  createdAt: number;
  completedAt?: number;
  error?: string;
  estimatedTime?: number; // seconds until completion
}

export class Sora2Service {
  private client: AxiosInstance;
  private config: Sora2Config;

  constructor(config: Sora2Config) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL || 'https://api.openai.com/v1/video',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 300000, // 5 minutes
    });
  }

  /**
   * Generate video from text prompt
   */
  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const response = await this.client.post('/generations', {
      model: request.model || 'sora-2.0',
      prompt: request.prompt,
      duration: request.duration || 10,
      resolution: request.resolution || '1080p',
      aspect_ratio: request.aspectRatio || '16:9',
      fps: request.fps || 30,
      style: request.style,
      seed: request.seed,
      n: request.numVariations || 1,
    });

    return this.mapResponse(response.data);
  }

  /**
   * Generate YouTube video content
   */
  async generateYouTubeVideo(
    topic: string,
    duration: number = 60,
    style: 'educational' | 'entertainment' | 'cinematic' | 'vlog' = 'educational'
  ): Promise<VideoGenerationResponse> {
    const stylePrompts = {
      educational: ', clear visuals, professional, informative, engaging',
      entertainment: ', dynamic, energetic, engaging, fun, vibrant',
      cinematic: ', cinematic lighting, epic, dramatic, professional cinematography',
      vlog: ', casual, authentic, relatable, personal perspective',
    };

    const prompt = `Create a compelling video about ${topic}${stylePrompts[style]}. High quality production, smooth transitions, visually engaging.`;

    return this.generateVideo({
      prompt,
      duration,
      resolution: '1080p',
      aspectRatio: '16:9',
      fps: 30,
    });
  }

  /**
   * Generate short-form video for TikTok/Reels/Shorts
   */
  async generateShortFormVideo(
    concept: string,
    hook: string
  ): Promise<VideoGenerationResponse> {
    const prompt = `Create a captivating ${concept} video. Opening hook: "${hook}". Vertical format optimized for mobile viewing. Fast-paced, attention-grabbing, trendy style, smooth transitions.`;

    return this.generateVideo({
      prompt,
      duration: 15,
      resolution: '1080p',
      aspectRatio: '9:16',
      fps: 30,
    });
  }

  /**
   * Generate product demonstration video
   */
  async generateProductDemo(
    productName: string,
    features: string[],
    duration: number = 30
  ): Promise<VideoGenerationResponse> {
    const featuresText = features.join(', ');
    const prompt = `Professional product demonstration video for ${productName}. Showcase features: ${featuresText}. Clean, modern aesthetic, product-focused, professional lighting, smooth camera movements.`;

    return this.generateVideo({
      prompt,
      duration,
      resolution: '1080p',
      aspectRatio: '16:9',
      fps: 30,
      style: 'commercial',
    });
  }

  /**
   * Animate image to video
   */
  async animateImage(request: ImageToVideoRequest): Promise<VideoGenerationResponse> {
    const response = await this.client.post('/img2vid', {
      image: request.image,
      prompt: request.prompt,
      duration: request.duration || 5,
      motion_strength: request.motion || 'moderate',
      camera_movement: request.cameraMovement || 'static',
    });

    return this.mapResponse(response.data);
  }

  /**
   * Extend existing video
   */
  async extendVideo(request: VideoExtensionRequest): Promise<VideoGenerationResponse> {
    const response = await this.client.post('/extend', {
      video: request.video,
      direction: request.direction || 'forward',
      duration: request.duration || 5,
      prompt: request.prompt,
    });

    return this.mapResponse(response.data);
  }

  /**
   * Apply style transfer to video
   */
  async styleTransfer(
    video: string,
    style: 'anime' | 'oil-painting' | 'watercolor' | 'sketch' | 'cyberpunk' | 'vintage'
  ): Promise<VideoGenerationResponse> {
    const response = await this.client.post('/style-transfer', {
      video,
      style,
      strength: 0.8,
    });

    return this.mapResponse(response.data);
  }

  /**
   * Generate B-roll footage
   */
  async generateBRoll(
    topic: string,
    shots: string[],
    totalDuration: number = 30
  ): Promise<VideoGenerationResponse[]> {
    const durationPerShot = totalDuration / shots.length;

    const generations = shots.map(shot =>
      this.generateVideo({
        prompt: `B-roll footage: ${shot} for ${topic}. Cinematic, professional, smooth camera movement, high quality`,
        duration: Math.ceil(durationPerShot),
        resolution: '1080p',
        aspectRatio: '16:9',
        fps: 30,
      })
    );

    return Promise.all(generations);
  }

  /**
   * Get generation status
   */
  async getStatus(generationId: string): Promise<VideoGenerationResponse> {
    const response = await this.client.get(`/generations/${generationId}`);
    return this.mapResponse(response.data);
  }

  /**
   * Wait for video generation to complete
   */
  async waitForCompletion(
    generationId: string,
    maxWaitTime = 600000, // 10 minutes
    pollInterval = 10000 // 10 seconds
  ): Promise<VideoGenerationResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getStatus(generationId);

      if (status.status === 'completed') {
        return status;
      }

      if (status.status === 'failed') {
        throw new Error(`Video generation failed: ${status.error}`);
      }

      // Log progress
      if (status.estimatedTime) {
        console.log(`⏳ Estimated time remaining: ${status.estimatedTime}s`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Video generation timed out');
  }

  /**
   * Generate video and wait for completion
   */
  async generateVideoSync(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const generation = await this.generateVideo(request);

    if (generation.status === 'completed') {
      return generation;
    }

    return this.waitForCompletion(generation.id);
  }

  /**
   * Download generated video
   */
  async downloadVideo(videoUrl: string, outputPath: string): Promise<void> {
    const response = await axios.get(videoUrl, {
      responseType: 'stream',
    });

    const writer = await fs.open(outputPath, 'w');
    const stream = response.data;

    for await (const chunk of stream) {
      await writer.write(chunk);
    }

    await writer.close();
  }

  /**
   * Generate video variations
   */
  async generateVariations(
    prompt: string,
    count: number,
    options?: Partial<VideoGenerationRequest>
  ): Promise<VideoGenerationResponse[]> {
    const generations: Promise<VideoGenerationResponse>[] = [];

    for (let i = 0; i < count; i++) {
      generations.push(
        this.generateVideo({
          prompt,
          ...options,
          seed: options?.seed ? options.seed + i : Math.floor(Math.random() * 1000000),
        })
      );
    }

    return Promise.all(generations);
  }

  /**
   * Get video thumbnail
   */
  async getThumbnail(generationId: string): Promise<string> {
    const response = await this.client.get(`/generations/${generationId}/thumbnail`);
    return response.data.thumbnail_url;
  }

  /**
   * List recent generations
   */
  async listGenerations(limit = 20): Promise<VideoGenerationResponse[]> {
    const response = await this.client.get('/generations', {
      params: { limit },
    });

    return response.data.generations.map((gen: any) => this.mapResponse(gen));
  }

  /**
   * Cancel generation
   */
  async cancelGeneration(generationId: string): Promise<void> {
    await this.client.post(`/generations/${generationId}/cancel`);
  }

  /**
   * Get account usage
   */
  async getUsage(): Promise<{
    secondsUsed: number;
    secondsLimit: number;
    generationsCount: number;
  }> {
    const response = await this.client.get('/usage');
    return {
      secondsUsed: response.data.seconds_used,
      secondsLimit: response.data.seconds_limit,
      generationsCount: response.data.generations_count,
    };
  }

  /**
   * Estimate cost for video generation
   */
  estimateCost(request: VideoGenerationRequest): number {
    const baseCreditsPerSecond = 1;
    const duration = request.duration || 10;

    const resolutionMultipliers = {
      '720p': 1.0,
      '1080p': 1.5,
      '4k': 3.0,
    };

    const modelMultipliers = {
      'sora-2.0': 1.0,
      'sora-2.0-turbo': 0.5,
    };

    const resolutionMultiplier = resolutionMultipliers[request.resolution || '1080p'];
    const modelMultiplier = modelMultipliers[request.model || 'sora-2.0'];
    const variationsMultiplier = request.numVariations || 1;

    return Math.ceil(
      baseCreditsPerSecond * duration * resolutionMultiplier * modelMultiplier * variationsMultiplier
    );
  }

  /**
   * Map API response to standard format
   */
  private mapResponse(data: any): VideoGenerationResponse {
    return {
      id: data.id,
      status: data.status,
      videoUrl: data.video_url || data.output?.video_url,
      thumbnailUrl: data.thumbnail_url || data.output?.thumbnail_url,
      duration: data.duration,
      resolution: data.resolution,
      createdAt: data.created_at || Date.now(),
      completedAt: data.completed_at,
      error: data.error,
      estimatedTime: data.estimated_time,
    };
  }

  /**
   * Optimize prompt for better video results
   */
  optimizePrompt(basicPrompt: string, purpose: 'youtube' | 'social' | 'commercial' = 'youtube'): string {
    let optimized = basicPrompt;

    const purposeSuffixes = {
      youtube: '. Professional quality, engaging visuals, smooth camera movements, good pacing, clear and crisp.',
      social: '. Attention-grabbing, fast-paced, trendy, mobile-optimized, hook in first 3 seconds.',
      commercial: '. Cinematic, premium quality, professional lighting, polished, brand-focused, high production value.',
    };

    optimized += purposeSuffixes[purpose];

    return optimized;
  }

  /**
   * Create video series (multiple related videos)
   */
  async createVideoSeries(
    topic: string,
    episodes: Array<{ title: string; description: string }>,
    episodeDuration: number = 30
  ): Promise<VideoGenerationResponse[]> {
    const generations = episodes.map((episode, index) =>
      this.generateVideo({
        prompt: `Episode ${index + 1}: ${episode.title}. ${episode.description}. Part of a series about ${topic}. Professional, consistent style, engaging content.`,
        duration: episodeDuration,
        resolution: '1080p',
        aspectRatio: '16:9',
        fps: 30,
      })
    );

    return Promise.all(generations);
  }
}

export default Sora2Service;
