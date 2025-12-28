/**
 * VideoGenerator - AI-powered video generation utility
 *
 * Supports multiple video generation APIs including:
 * - Runway Gen-2/Gen-3
 * - Pika Labs
 * - Stability AI Video
 * - Google Imagen Video
 * - Synthesia (text-to-video with avatars)
 *
 * Features:
 * - Product video generation
 * - Promo video creation
 * - Short-form content (TikTok, Reels, Shorts)
 * - Subtitle generation and overlay
 * - Platform-specific optimization
 * - Thumbnail generation
 */

import { AIHelper } from './AIHelper';
import { getImageGenerator, GeneratedImage } from './ImageGenerator';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

/**
 * Supported video generation providers
 */
export type VideoProvider = 'runway' | 'pika' | 'stability-video' | 'synthesia' | 'replicate' | 'auto';

/**
 * Video generation options
 */
export interface VideoGenerationOptions {
  provider?: VideoProvider;
  prompt: string;
  negativePrompt?: string;
  duration?: number; // in seconds
  fps?: number;
  width?: number;
  height?: number;
  style?: string;
  motion?: 'low' | 'medium' | 'high';
  seed?: number;
  model?: string;
  imageToVideo?: boolean; // Convert image to video
  baseImage?: string; // Path to base image for image-to-video
}

/**
 * Product video options
 */
export interface ProductVideoOptions {
  productName: string;
  description: string;
  features?: string[];
  duration?: number; // 5-60 seconds
  style?: 'cinematic' | 'dynamic' | 'minimal' | 'energetic' | 'elegant';
  showText?: boolean;
  backgroundMusic?: boolean;
  voiceover?: boolean;
  transitions?: 'smooth' | 'quick' | 'dynamic';
}

/**
 * Promo video options
 */
export interface PromoVideoOptions {
  headline: string;
  message: string;
  callToAction?: string;
  duration?: number; // 15-30 seconds
  style?: 'corporate' | 'casual' | 'bold' | 'minimal' | 'creative';
  template?: string;
  brandColors?: string[];
  includeText?: boolean;
}

/**
 * Short video options (TikTok, Reels, Shorts)
 */
export interface ShortVideoOptions {
  platform: 'tiktok' | 'instagram-reel' | 'youtube-short';
  topic: string;
  hook: string; // Opening hook
  duration?: number; // 15-60 seconds
  style?: 'trending' | 'educational' | 'entertaining' | 'inspirational';
  includeSubtitles?: boolean;
  includeEffects?: boolean;
}

/**
 * Subtitle options
 */
export interface SubtitleOptions {
  language?: string;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  position?: 'top' | 'center' | 'bottom';
  highlightStyle?: 'none' | 'word' | 'box';
  autoGenerate?: boolean; // Auto-generate from audio
}

/**
 * Platform optimization options
 */
export interface PlatformOptimizationOptions {
  platform: 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'linkedin' | 'twitter';
  format?: 'feed' | 'story' | 'short' | 'long';
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  targetBitrate?: number;
  targetSize?: number; // Max file size in MB
}

/**
 * Thumbnail generation options
 */
export interface ThumbnailOptions {
  videoPath?: string;
  timestamp?: number; // Extract at specific time (seconds)
  style?: 'dramatic' | 'minimal' | 'text-overlay' | 'split-screen';
  text?: string;
  fontSize?: number;
  customPrompt?: string;
  width?: number;
  height?: number;
}

/**
 * Generated video result
 */
export interface GeneratedVideo {
  url?: string;
  path?: string;
  duration: number;
  width: number;
  height: number;
  fps: number;
  format: string;
  fileSize?: number;
  prompt: string;
  provider: string;
  thumbnail?: string;
  metadata?: {
    model?: string;
    seed?: number;
    cost?: number;
    generationTime?: number;
    processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  };
}

/**
 * API Configuration
 */
interface APIConfig {
  runway?: {
    apiKey: string;
    model?: string;
  };
  pika?: {
    apiKey: string;
  };
  stabilityVideo?: {
    apiKey: string;
  };
  synthesia?: {
    apiKey: string;
  };
  replicate?: {
    apiKey: string;
  };
  elevenLabs?: {
    apiKey: string; // For voiceovers
  };
}

export class VideoGenerator {
  private config: APIConfig;
  private outputDir: string;
  private defaultProvider: VideoProvider;

  constructor(config: APIConfig = {}, outputDir: string = './generated-videos') {
    this.config = {
      runway: config.runway || {
        apiKey: process.env.RUNWAY_API_KEY || '',
        model: 'gen3'
      },
      pika: config.pika || {
        apiKey: process.env.PIKA_API_KEY || ''
      },
      stabilityVideo: config.stabilityVideo || {
        apiKey: process.env.STABILITY_API_KEY || ''
      },
      synthesia: config.synthesia || {
        apiKey: process.env.SYNTHESIA_API_KEY || ''
      },
      replicate: config.replicate || {
        apiKey: process.env.REPLICATE_API_KEY || ''
      },
      elevenLabs: config.elevenLabs || {
        apiKey: process.env.ELEVENLABS_API_KEY || ''
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
   * Generate a product video showcasing features
   *
   * @param options - Product video options
   * @returns Generated product video
   */
  async generateProductVideo(options: ProductVideoOptions): Promise<GeneratedVideo> {
    console.log(`🎬 Generating product video for: ${options.productName}`);

    const videoPrompt = this.buildProductVideoPrompt(options);

    const videoOptions: VideoGenerationOptions = {
      provider: this.defaultProvider,
      prompt: videoPrompt,
      duration: options.duration || 15,
      fps: 24,
      width: 1920,
      height: 1080,
      style: options.style || 'cinematic',
      motion: 'medium'
    };

    const video = await this.generate(videoOptions);

    // Generate thumbnail
    console.log('📸 Generating video thumbnail...');
    const thumbnail = await this.createThumbnail({
      videoPath: video.path,
      timestamp: Math.floor(video.duration / 2),
      style: 'dramatic'
    });

    video.thumbnail = thumbnail.path;

    return video;
  }

  /**
   * Create a promotional video
   *
   * @param options - Promo video options
   * @returns Generated promo video
   */
  async createPromoVideo(options: PromoVideoOptions): Promise<GeneratedVideo> {
    console.log(`🎥 Creating promo video: ${options.headline}`);

    const promoPrompt = this.buildPromoVideoPrompt(options);

    const videoOptions: VideoGenerationOptions = {
      provider: this.defaultProvider,
      prompt: promoPrompt,
      duration: options.duration || 20,
      fps: 30,
      width: 1920,
      height: 1080,
      style: options.style || 'corporate',
      motion: 'high'
    };

    const video = await this.generate(videoOptions);

    // Generate thumbnail
    const thumbnail = await this.createThumbnail({
      videoPath: video.path,
      text: options.headline,
      style: 'text-overlay'
    });

    video.thumbnail = thumbnail.path;

    return video;
  }

  /**
   * Generate short-form video content (TikTok, Reels, Shorts)
   *
   * @param options - Short video options
   * @returns Generated short video
   */
  async generateShorts(options: ShortVideoOptions): Promise<GeneratedVideo> {
    console.log(`📱 Generating ${options.platform} short: ${options.topic}`);

    const shortPrompt = this.buildShortVideoPrompt(options);
    const dimensions = this.getShortVideoDimensions(options.platform);

    const videoOptions: VideoGenerationOptions = {
      provider: this.defaultProvider,
      prompt: shortPrompt,
      duration: options.duration || 30,
      fps: 30,
      width: dimensions.width,
      height: dimensions.height,
      style: options.style || 'trending',
      motion: 'high'
    };

    const video = await this.generate(videoOptions);

    // Add subtitles if requested
    if (options.includeSubtitles) {
      console.log('💬 Adding subtitles...');
      const subtitledVideo = await this.addSubtitles(video, {
        position: 'center',
        highlightStyle: 'word',
        autoGenerate: true
      });

      // Update video path with subtitled version
      video.path = subtitledVideo.path;
    }

    // Generate thumbnail
    const thumbnail = await this.createThumbnail({
      videoPath: video.path,
      style: 'dramatic',
      text: options.hook
    });

    video.thumbnail = thumbnail.path;

    return video;
  }

  /**
   * Add subtitles to a video
   *
   * @param video - Video to add subtitles to
   * @param options - Subtitle options
   * @returns Video with subtitles
   */
  async addSubtitles(
    video: GeneratedVideo,
    options: SubtitleOptions = {}
  ): Promise<GeneratedVideo> {
    console.log(`💬 Adding subtitles to video...`);

    if (!video.path) {
      throw new Error('Video path is required for adding subtitles');
    }

    // Placeholder for subtitle generation
    // In production, this would:
    // 1. Extract audio from video
    // 2. Use speech-to-text API (Whisper, AssemblyAI, etc.)
    // 3. Generate SRT/VTT file
    // 4. Overlay subtitles using ffmpeg or similar

    const subtitledPath = video.path.replace(
      path.extname(video.path),
      `-subtitled${path.extname(video.path)}`
    );

    // Mock implementation
    console.log(`   Language: ${options.language || 'auto-detect'}`);
    console.log(`   Position: ${options.position || 'bottom'}`);
    console.log(`   Style: ${options.highlightStyle || 'word'}`);
    console.log(`   Output: ${subtitledPath}`);

    console.log(`⚠ Subtitle generation is a placeholder`);
    console.log(`   Recommended: Use ffmpeg with Whisper API for production`);
    console.log(`   Example: ffmpeg -i input.mp4 -vf subtitles=subs.srt output.mp4`);

    // Return original video with note about subtitles
    return {
      ...video,
      path: subtitledPath,
      metadata: {
        ...video.metadata,
        processingStatus: 'completed'
      }
    };
  }

  /**
   * Optimize video for specific platform
   *
   * @param video - Video to optimize
   * @param options - Platform optimization options
   * @returns Optimized video
   */
  async optimizeForPlatform(
    video: GeneratedVideo,
    options: PlatformOptimizationOptions
  ): Promise<GeneratedVideo> {
    console.log(`🔧 Optimizing video for ${options.platform}...`);

    if (!video.path) {
      throw new Error('Video path is required for optimization');
    }

    const platformSpecs = this.getPlatformSpecs(options.platform, options.format || 'feed');
    const optimizedPath = video.path.replace(
      path.extname(video.path),
      `-${options.platform}${path.extname(video.path)}`
    );

    // Placeholder for video optimization
    // In production, this would use ffmpeg:
    // ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset medium
    //        -vf scale=width:height -r fps -b:v bitrate output.mp4

    console.log(`   Platform: ${options.platform}`);
    console.log(`   Target dimensions: ${platformSpecs.width}x${platformSpecs.height}`);
    console.log(`   Target bitrate: ${options.targetBitrate || platformSpecs.bitrate}`);
    console.log(`   Quality: ${options.quality || 'high'}`);
    console.log(`   Output: ${optimizedPath}`);

    console.log(`⚠ Video optimization is a placeholder`);
    console.log(`   Recommended: Use ffmpeg for production optimization`);

    return {
      ...video,
      path: optimizedPath,
      width: platformSpecs.width,
      height: platformSpecs.height,
      metadata: {
        ...video.metadata,
        processingStatus: 'completed'
      }
    };
  }

  /**
   * Create a thumbnail for a video
   *
   * @param options - Thumbnail generation options
   * @returns Generated thumbnail image
   */
  async createThumbnail(options: ThumbnailOptions): Promise<GeneratedImage> {
    console.log('📸 Creating video thumbnail...');

    if (options.videoPath) {
      // Extract frame from video
      const timestamp = options.timestamp || 0;
      const thumbnailPath = options.videoPath.replace(
        path.extname(options.videoPath),
        `-thumb-${timestamp}s.jpg`
      );

      // Placeholder for frame extraction
      // In production, use ffmpeg:
      // ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 thumbnail.jpg

      console.log(`   Extracting frame at ${timestamp}s`);
      console.log(`   Output: ${thumbnailPath}`);
      console.log(`⚠ Frame extraction is a placeholder - use ffmpeg in production`);

      return {
        path: thumbnailPath,
        width: options.width || 1920,
        height: options.height || 1080,
        prompt: 'Video thumbnail',
        provider: 'frame-extraction'
      };
    }

    // Generate AI thumbnail if no video path provided
    if (options.customPrompt) {
      const imageGen = getImageGenerator();
      const thumbnail = await imageGen.generateProductImage(
        'Video Thumbnail',
        options.customPrompt,
        {
          width: options.width || 1920,
          height: options.height || 1080,
          style: 'cinematic, youtube thumbnail style'
        }
      );

      return thumbnail;
    }

    throw new Error('Either videoPath or customPrompt is required for thumbnail generation');
  }

  /**
   * Generate video using specified provider
   *
   * @param options - Video generation options
   * @returns Generated video result
   */
  private async generate(options: VideoGenerationOptions): Promise<GeneratedVideo> {
    const provider = options.provider || this.defaultProvider;
    const startTime = Date.now();

    console.log(`   Provider: ${provider}`);
    console.log(`   Duration: ${options.duration}s`);
    console.log(`   Resolution: ${options.width}x${options.height}`);

    try {
      let result: GeneratedVideo;

      switch (provider) {
        case 'runway':
          result = await this.generateWithRunway(options);
          break;
        case 'pika':
          result = await this.generateWithPika(options);
          break;
        case 'stability-video':
          result = await this.generateWithStabilityVideo(options);
          break;
        case 'synthesia':
          result = await this.generateWithSynthesia(options);
          break;
        case 'replicate':
          result = await this.generateWithReplicate(options);
          break;
        default:
          throw new Error(`Unsupported video provider: ${provider}`);
      }

      // Add generation metadata
      result.metadata = {
        ...result.metadata,
        generationTime: Date.now() - startTime,
        processingStatus: 'completed'
      };

      console.log(`✓ Video generated successfully in ${result.metadata.generationTime}ms`);

      return result;
    } catch (error: any) {
      console.error(AIHelper.formatError(error, 'video generation'));
      throw new Error(`Video generation failed: ${error.message}`);
    }
  }

  /**
   * Generate video using Runway Gen-2/Gen-3
   */
  private async generateWithRunway(options: VideoGenerationOptions): Promise<GeneratedVideo> {
    if (!this.config.runway?.apiKey) {
      throw new Error('Runway API key not configured');
    }

    const model = this.config.runway.model || 'gen3';

    const requestBody: any = {
      model: model,
      prompt: options.prompt,
      duration: options.duration || 5,
      width: options.width || 1280,
      height: options.height || 768,
      seed: options.seed
    };

    // If image-to-video
    if (options.imageToVideo && options.baseImage) {
      requestBody.image_path = options.baseImage;
      requestBody.mode = 'image_to_video';
    } else {
      requestBody.mode = 'text_to_video';
    }

    const response = await this.makeAPIRequest(
      'https://api.runwayml.com/v1/generate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.runway.apiKey}`
        },
        body: JSON.stringify(requestBody)
      }
    );

    // Poll for completion
    const result = await this.pollRunwayResult(response.id);
    const videoPath = await this.downloadVideo(result.url, 'runway');

    return {
      url: result.url,
      path: videoPath,
      duration: options.duration || 5,
      width: options.width || 1280,
      height: options.height || 768,
      fps: options.fps || 24,
      format: 'mp4',
      prompt: options.prompt,
      provider: 'runway',
      metadata: {
        model: model,
        cost: this.estimateRunwayCost(model, options.duration || 5)
      }
    };
  }

  /**
   * Generate video using Pika Labs
   */
  private async generateWithPika(options: VideoGenerationOptions): Promise<GeneratedVideo> {
    if (!this.config.pika?.apiKey) {
      throw new Error('Pika API key not configured');
    }

    const requestBody = {
      prompt: options.prompt,
      negative_prompt: options.negativePrompt,
      duration: options.duration || 3,
      fps: options.fps || 24,
      motion: options.motion || 'medium',
      aspect_ratio: `${options.width}:${options.height}`
    };

    const response = await this.makeAPIRequest(
      'https://api.pika.art/generate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.pika.apiKey}`
        },
        body: JSON.stringify(requestBody)
      }
    );

    // Poll for completion
    const result = await this.pollPikaResult(response.job_id);
    const videoPath = await this.downloadVideo(result.video_url, 'pika');

    return {
      url: result.video_url,
      path: videoPath,
      duration: options.duration || 3,
      width: options.width || 1280,
      height: options.height || 768,
      fps: options.fps || 24,
      format: 'mp4',
      prompt: options.prompt,
      provider: 'pika',
      metadata: {
        cost: this.estimatePikaCost(options.duration || 3)
      }
    };
  }

  /**
   * Generate video using Stability AI Video
   */
  private async generateWithStabilityVideo(options: VideoGenerationOptions): Promise<GeneratedVideo> {
    if (!this.config.stabilityVideo?.apiKey) {
      throw new Error('Stability AI API key not configured');
    }

    const requestBody = {
      prompt: options.prompt,
      negative_prompt: options.negativePrompt,
      cfg_scale: 7,
      motion_bucket_id: options.motion === 'high' ? 180 : options.motion === 'low' ? 60 : 127,
      seed: options.seed || 0
    };

    // Add base image if image-to-video
    if (options.imageToVideo && options.baseImage) {
      const imageData = fs.readFileSync(options.baseImage, { encoding: 'base64' });
      requestBody['image'] = imageData;
    }

    const response = await this.makeAPIRequest(
      'https://api.stability.ai/v2alpha/generation/image-to-video',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.stabilityVideo.apiKey}`
        },
        body: JSON.stringify(requestBody)
      }
    );

    const result = await this.pollStabilityResult(response.id);
    const videoPath = await this.downloadVideo(result.video, 'stability');

    return {
      url: result.video,
      path: videoPath,
      duration: 4, // Stability typically generates 4s videos
      width: options.width || 1024,
      height: options.height || 576,
      fps: 24,
      format: 'mp4',
      prompt: options.prompt,
      provider: 'stability-video',
      metadata: {
        seed: result.seed,
        cost: 0.05 // Approximate cost
      }
    };
  }

  /**
   * Generate video using Synthesia (avatar-based)
   */
  private async generateWithSynthesia(options: VideoGenerationOptions): Promise<GeneratedVideo> {
    if (!this.config.synthesia?.apiKey) {
      throw new Error('Synthesia API key not configured');
    }

    // Synthesia is specifically for avatar/presenter videos
    const requestBody = {
      test: false,
      title: 'Generated Video',
      input: [
        {
          scriptText: options.prompt,
          avatar: 'anna_costume1_cameraA',
          background: 'green_screen',
          voice: 'en-US-JennyNeural'
        }
      ]
    };

    const response = await this.makeAPIRequest(
      'https://api.synthesia.io/v2/videos',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.config.synthesia.apiKey
        },
        body: JSON.stringify(requestBody)
      }
    );

    // Poll for completion
    const result = await this.pollSynthesiaResult(response.id);
    const videoPath = await this.downloadVideo(result.download, 'synthesia');

    return {
      url: result.download,
      path: videoPath,
      duration: result.duration || 30,
      width: 1920,
      height: 1080,
      fps: 25,
      format: 'mp4',
      prompt: options.prompt,
      provider: 'synthesia',
      metadata: {
        cost: 0.30 // Approximate cost per video
      }
    };
  }

  /**
   * Generate video using Replicate
   */
  private async generateWithReplicate(options: VideoGenerationOptions): Promise<GeneratedVideo> {
    if (!this.config.replicate?.apiKey) {
      throw new Error('Replicate API key not configured');
    }

    const model = options.model || 'stability-ai/stable-video-diffusion:latest';

    const requestBody: any = {
      version: model,
      input: {
        prompt: options.prompt,
        num_frames: (options.duration || 3) * (options.fps || 24),
        fps: options.fps || 24,
        motion_bucket_id: options.motion === 'high' ? 180 : 127,
        seed: options.seed
      }
    };

    if (options.imageToVideo && options.baseImage) {
      requestBody.input.image = options.baseImage;
    }

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
    const videoUrl = result.output;
    const videoPath = await this.downloadVideo(videoUrl, 'replicate');

    return {
      url: videoUrl,
      path: videoPath,
      duration: options.duration || 3,
      width: options.width || 1024,
      height: options.height || 576,
      fps: options.fps || 24,
      format: 'mp4',
      prompt: options.prompt,
      provider: 'replicate',
      metadata: {
        model: model,
        cost: 0.01 // Approximate cost
      }
    };
  }

  // ==================== Prompt Building Methods ====================

  private buildProductVideoPrompt(options: ProductVideoOptions): string {
    let prompt = `Professional product video showcasing ${options.productName}. `;
    prompt += `${options.description}. `;

    if (options.features && options.features.length > 0) {
      prompt += `Key features: ${options.features.join(', ')}. `;
    }

    if (options.style) {
      prompt += `Style: ${options.style}, `;
    }

    prompt += `Smooth camera movements, professional lighting, high-quality production. `;
    prompt += `Studio setting, clean background. `;

    if (options.transitions) {
      prompt += `${options.transitions} transitions between shots. `;
    }

    return prompt;
  }

  private buildPromoVideoPrompt(options: PromoVideoOptions): string {
    let prompt = `Professional promotional video. `;
    prompt += `Main message: "${options.headline}". `;
    prompt += `${options.message}. `;

    if (options.style) {
      prompt += `Style: ${options.style}. `;
    }

    if (options.brandColors && options.brandColors.length > 0) {
      prompt += `Color scheme: ${options.brandColors.join(', ')}. `;
    }

    prompt += `Dynamic, engaging, attention-grabbing. `;

    if (options.callToAction) {
      prompt += `Call to action: ${options.callToAction}. `;
    }

    prompt += `Professional quality, marketing video.`;

    return prompt;
  }

  private buildShortVideoPrompt(options: ShortVideoOptions): string {
    let prompt = `${options.platform} short-form video. `;
    prompt += `Topic: ${options.topic}. `;
    prompt += `Opening hook: "${options.hook}". `;

    if (options.style) {
      prompt += `Style: ${options.style}. `;
    }

    prompt += `Fast-paced, engaging, vertical format. `;
    prompt += `Attention-grabbing, optimized for social media. `;
    prompt += `Dynamic camera work, quick cuts, trending style.`;

    return prompt;
  }

  // ==================== Helper Methods ====================

  private getShortVideoDimensions(platform: string): { width: number; height: number } {
    // All short-form content is vertical 9:16
    return {
      width: 1080,
      height: 1920
    };
  }

  private getPlatformSpecs(platform: string, format: string): any {
    const specs: Record<string, any> = {
      youtube: {
        feed: { width: 1920, height: 1080, bitrate: '8000k', fps: 30 },
        short: { width: 1080, height: 1920, bitrate: '5000k', fps: 30 }
      },
      instagram: {
        feed: { width: 1080, height: 1080, bitrate: '5000k', fps: 30 },
        story: { width: 1080, height: 1920, bitrate: '5000k', fps: 30 },
        reel: { width: 1080, height: 1920, bitrate: '5000k', fps: 30 }
      },
      tiktok: {
        feed: { width: 1080, height: 1920, bitrate: '4000k', fps: 30 }
      },
      facebook: {
        feed: { width: 1280, height: 720, bitrate: '4000k', fps: 30 }
      },
      linkedin: {
        feed: { width: 1280, height: 720, bitrate: '5000k', fps: 30 }
      },
      twitter: {
        feed: { width: 1280, height: 720, bitrate: '5000k', fps: 30 }
      }
    };

    return specs[platform]?.[format] || specs.youtube.feed;
  }

  private async downloadVideo(url: string, provider: string): Promise<string> {
    const timestamp = Date.now();
    const filename = `${provider}-${timestamp}.mp4`;
    const filepath = path.join(this.outputDir, filename);

    await this.downloadFile(url, filepath);

    console.log(`   Video saved to: ${filepath}`);
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

  // Polling methods for async video generation
  private async pollRunwayResult(jobId: string, maxAttempts: number = 120): Promise<any> {
    return this.pollResult(
      `https://api.runwayml.com/v1/tasks/${jobId}`,
      { 'Authorization': `Bearer ${this.config.runway?.apiKey}` },
      maxAttempts
    );
  }

  private async pollPikaResult(jobId: string, maxAttempts: number = 120): Promise<any> {
    return this.pollResult(
      `https://api.pika.art/jobs/${jobId}`,
      { 'Authorization': `Bearer ${this.config.pika?.apiKey}` },
      maxAttempts
    );
  }

  private async pollStabilityResult(jobId: string, maxAttempts: number = 120): Promise<any> {
    return this.pollResult(
      `https://api.stability.ai/v2alpha/generation/image-to-video/result/${jobId}`,
      { 'Authorization': `Bearer ${this.config.stabilityVideo?.apiKey}` },
      maxAttempts
    );
  }

  private async pollSynthesiaResult(videoId: string, maxAttempts: number = 180): Promise<any> {
    return this.pollResult(
      `https://api.synthesia.io/v2/videos/${videoId}`,
      { 'Authorization': this.config.synthesia?.apiKey || '' },
      maxAttempts,
      10000 // 10 second intervals for Synthesia
    );
  }

  private async pollReplicateResult(predictionId: string, maxAttempts: number = 120): Promise<any> {
    return this.pollResult(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      { 'Authorization': `Token ${this.config.replicate?.apiKey}` },
      maxAttempts
    );
  }

  private async pollResult(
    url: string,
    headers: any,
    maxAttempts: number,
    interval: number = 5000
  ): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await this.makeAPIRequest(url, { headers });

      const status = response.status || response.state;

      if (status === 'succeeded' || status === 'completed' || status === 'complete') {
        return response;
      }

      if (status === 'failed' || status === 'error') {
        throw new Error(`Video generation failed: ${response.error || 'Unknown error'}`);
      }

      // Log progress
      if (i % 10 === 0) {
        console.log(`   Polling... (${i + 1}/${maxAttempts}) Status: ${status}`);
      }

      await this.sleep(interval);
    }

    throw new Error('Video generation timed out');
  }

  private determineDefaultProvider(): VideoProvider {
    if (this.config.runway?.apiKey) return 'runway';
    if (this.config.pika?.apiKey) return 'pika';
    if (this.config.replicate?.apiKey) return 'replicate';
    if (this.config.stabilityVideo?.apiKey) return 'stability-video';
    if (this.config.synthesia?.apiKey) return 'synthesia';

    console.warn('No video generation API keys configured. Set RUNWAY_API_KEY, PIKA_API_KEY, or REPLICATE_API_KEY in .env');
    return 'runway'; // Default fallback
  }

  private estimateRunwayCost(model: string, duration: number): number {
    // Runway pricing (approximate)
    const pricePerSecond = model === 'gen3' ? 0.10 : 0.05;
    return duration * pricePerSecond;
  }

  private estimatePikaCost(duration: number): number {
    // Pika pricing (approximate)
    return duration * 0.05;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Export singleton instance getter
 */
let videoGeneratorInstance: VideoGenerator | null = null;

export function getVideoGenerator(
  config?: APIConfig,
  outputDir?: string
): VideoGenerator {
  if (!videoGeneratorInstance) {
    videoGeneratorInstance = new VideoGenerator(config, outputDir);
  }
  return videoGeneratorInstance;
}
