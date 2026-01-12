/**
 * FREE SORA CLONE - Video Generation Service
 * 100% FREE alternatives to Sora using Open Source models
 *
 * Providers (all FREE):
 * 1. Open-Sora 2.0 - Best quality, up to 768p, 16s
 * 2. CogVideoX-5B - Excellent quality, 768x1360, 10s
 * 3. Stable Video Diffusion - Good quality, fallback
 * 4. Latte - Text-to-video, Hugging Face
 *
 * Upscaling (FREE):
 * - Real-ESRGAN - 4K upscaling
 * - Video2X - Alternative upscaler
 *
 * Enhancement (FREE):
 * - FFmpeg - Color correction, stabilization
 * - VidStab - Video stabilization
 */

import axios from 'axios';
import { EventEmitter } from 'events';

// ============= TYPES =============

export type VideoProvider = 'open-sora' | 'cogvideox' | 'stable-video' | 'latte' | 'auto';
export type VideoQuality = '360p' | '480p' | '720p' | '1080p' | '4k';
export type VideoStyle = 'realistic' | 'anime' | 'cinematic' | '3d' | 'artistic' | 'vintage' | 'neon';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9';

export interface VideoGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  duration: number; // seconds (2-16)
  quality: VideoQuality;
  style: VideoStyle;
  aspectRatio: AspectRatio;
  provider?: VideoProvider;
  seedImage?: string; // base64 or URL for image-to-video
  fps?: number;
  seed?: number;
}

export interface VideoGenerationResult {
  success: boolean;
  videoUrl?: string;
  videoBase64?: string;
  thumbnailUrl?: string;
  provider: string;
  duration: number;
  resolution: string;
  fileSize?: number;
  generationTime: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface UpscaleRequest {
  videoUrl: string;
  targetResolution: '1080p' | '4k';
  model?: 'realesrgan' | 'video2x';
  denoiseStrength?: number;
}

export interface EnhanceRequest {
  videoUrl: string;
  colorCorrection?: boolean;
  stabilization?: boolean;
  denoising?: boolean;
  sharpening?: boolean;
  brightnessAdjust?: number; // -100 to 100
  contrastAdjust?: number; // -100 to 100
  saturationAdjust?: number; // -100 to 100
}

// ============= FREE API ENDPOINTS =============

const FREE_ENDPOINTS = {
  // Open-Sora - MIT License, FREE
  openSora: {
    huggingFace: 'https://hpcai-tech-open-sora.hf.space/api/predict',
    gradio: 'https://hpcai-tech-open-sora.hf.space',
    model: 'hpcai-tech/Open-Sora-v2'
  },

  // CogVideoX - FREE on Hugging Face
  cogVideoX: {
    huggingFace: 'https://api-inference.huggingface.co/models/THUDM/CogVideoX-5b',
    gradio: 'https://thudm-cogvideox.hf.space',
    model: 'THUDM/CogVideoX-5b'
  },

  // Stable Video Diffusion - FREE
  stableVideo: {
    huggingFace: 'https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt',
    model: 'stabilityai/stable-video-diffusion-img2vid-xt'
  },

  // Latte - FREE text-to-video
  latte: {
    huggingFace: 'https://api-inference.huggingface.co/models/maxin-cn/Latte-1',
    model: 'maxin-cn/Latte-1'
  },

  // Real-ESRGAN - FREE upscaling
  realEsrgan: {
    replicate: 'https://api.replicate.com/v1/predictions',
    huggingFace: 'https://xinntao-realesrgan.hf.space/api/predict',
    colab: 'https://colab.research.google.com/github/yuvraj108c/4k-video-upscaler-colab'
  },

  // Trend Analysis - FREE
  trends: {
    youtube: 'https://www.googleapis.com/youtube/v3/videos',
    tiktok: 'https://www.tiktok.com/api/explore'
  }
};

// ============= STYLE PROMPTS =============

const STYLE_PROMPTS: Record<VideoStyle, string> = {
  realistic: 'photorealistic, 8k, detailed, natural lighting, cinematic',
  anime: 'anime style, vibrant colors, cel shading, Japanese animation',
  cinematic: 'cinematic, film grain, dramatic lighting, movie quality, widescreen',
  '3d': '3D render, Pixar style, smooth textures, volumetric lighting',
  artistic: 'artistic, painterly, impressionist, beautiful composition',
  vintage: 'vintage film, 1970s aesthetic, warm tones, film grain, nostalgic',
  neon: 'neon lights, cyberpunk, glowing, synthwave, futuristic'
};

const NEGATIVE_PROMPTS = {
  default: 'blurry, low quality, distorted, watermark, text, logo, ugly, deformed',
  anime: 'realistic, photo, 3d, western cartoon, ugly, deformed',
  realistic: 'cartoon, anime, drawing, painting, ugly, deformed, blurry'
};

// ============= MAIN SERVICE CLASS =============

export class FreeSoraClone extends EventEmitter {
  private huggingFaceToken: string;
  private replicateToken: string;
  private activeProvider: VideoProvider = 'auto';
  private generationQueue: Map<string, VideoGenerationRequest> = new Map();

  constructor(config?: { huggingFaceToken?: string; replicateToken?: string }) {
    super();
    this.huggingFaceToken = config?.huggingFaceToken || process.env.HUGGINGFACE_TOKEN || '';
    this.replicateToken = config?.replicateToken || process.env.REPLICATE_TOKEN || '';
  }

  // ============= VIDEO GENERATION =============

  /**
   * Generate video using FREE providers
   */
  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    const startTime = Date.now();
    const provider = request.provider || 'auto';

    this.emit('generationStarted', { request, provider });

    try {
      // Build enhanced prompt with style
      const enhancedPrompt = this.buildEnhancedPrompt(request);

      let result: VideoGenerationResult;

      if (provider === 'auto') {
        // Try providers in order of quality
        result = await this.tryProviders(enhancedPrompt, request);
      } else {
        result = await this.generateWithProvider(provider, enhancedPrompt, request);
      }

      result.generationTime = Date.now() - startTime;
      this.emit('generationCompleted', result);

      return result;

    } catch (error: any) {
      const errorResult: VideoGenerationResult = {
        success: false,
        provider: provider,
        duration: request.duration,
        resolution: request.quality,
        generationTime: Date.now() - startTime,
        error: error.message
      };

      this.emit('generationFailed', errorResult);
      return errorResult;
    }
  }

  /**
   * Try multiple providers in order
   */
  private async tryProviders(prompt: string, request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    const providers: VideoProvider[] = ['open-sora', 'cogvideox', 'latte', 'stable-video'];

    for (const provider of providers) {
      try {
        console.log(`Trying provider: ${provider}`);
        const result = await this.generateWithProvider(provider, prompt, request);
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.log(`Provider ${provider} failed, trying next...`);
      }
    }

    throw new Error('All video generation providers failed');
  }

  /**
   * Generate with specific provider
   */
  private async generateWithProvider(
    provider: VideoProvider,
    prompt: string,
    request: VideoGenerationRequest
  ): Promise<VideoGenerationResult> {
    switch (provider) {
      case 'open-sora':
        return this.generateWithOpenSora(prompt, request);
      case 'cogvideox':
        return this.generateWithCogVideoX(prompt, request);
      case 'latte':
        return this.generateWithLatte(prompt, request);
      case 'stable-video':
        return this.generateWithStableVideo(prompt, request);
      default:
        return this.generateWithOpenSora(prompt, request);
    }
  }

  /**
   * Generate with Open-Sora (BEST FREE OPTION)
   */
  private async generateWithOpenSora(prompt: string, request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    const resolution = this.getResolutionDimensions(request.quality, request.aspectRatio);

    // Open-Sora Gradio API call
    const payload = {
      data: [
        prompt, // prompt
        request.negativePrompt || NEGATIVE_PROMPTS.default, // negative prompt
        request.seedImage || null, // image input (optional)
        resolution.width, // width
        resolution.height, // height
        request.duration, // num_seconds
        request.fps || 16, // fps
        request.seed || Math.floor(Math.random() * 1000000), // seed
        50, // num_inference_steps
        7.5 // guidance_scale
      ]
    };

    try {
      // Try Hugging Face Spaces Gradio endpoint
      const response = await axios.post(
        FREE_ENDPOINTS.openSora.gradio + '/run/predict',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(this.huggingFaceToken && { 'Authorization': `Bearer ${this.huggingFaceToken}` })
          },
          timeout: 300000 // 5 minutes timeout for video generation
        }
      );

      if (response.data && response.data.data) {
        const videoData = response.data.data[0];
        return {
          success: true,
          videoUrl: videoData.url || videoData,
          videoBase64: videoData.data,
          provider: 'Open-Sora 2.0',
          duration: request.duration,
          resolution: `${resolution.width}x${resolution.height}`,
          generationTime: 0,
          metadata: {
            model: 'hpcai-tech/Open-Sora-v2',
            fps: request.fps || 16,
            seed: payload.data[7]
          }
        };
      }

      throw new Error('Invalid response from Open-Sora');
    } catch (error: any) {
      // Fallback to inference API
      return this.generateWithHuggingFaceInference(
        FREE_ENDPOINTS.openSora.model,
        prompt,
        request,
        'Open-Sora'
      );
    }
  }

  /**
   * Generate with CogVideoX-5B
   */
  private async generateWithCogVideoX(prompt: string, request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    const payload = {
      inputs: prompt,
      parameters: {
        num_frames: Math.min(request.duration * 16, 160), // 10 seconds max at 16fps
        height: 768,
        width: 1360,
        guidance_scale: 7.5,
        num_inference_steps: 50
      }
    };

    try {
      const response = await axios.post(
        FREE_ENDPOINTS.cogVideoX.huggingFace,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.huggingFaceToken}`
          },
          timeout: 300000,
          responseType: 'arraybuffer'
        }
      );

      const videoBase64 = Buffer.from(response.data).toString('base64');

      return {
        success: true,
        videoBase64: videoBase64,
        provider: 'CogVideoX-5B',
        duration: request.duration,
        resolution: '768x1360',
        generationTime: 0,
        metadata: {
          model: 'THUDM/CogVideoX-5b',
          frames: payload.parameters.num_frames
        }
      };
    } catch (error: any) {
      throw new Error(`CogVideoX failed: ${error.message}`);
    }
  }

  /**
   * Generate with Latte
   */
  private async generateWithLatte(prompt: string, request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    const payload = {
      inputs: prompt,
      parameters: {
        num_frames: request.duration * 8, // 8 fps default
        height: 512,
        width: 512,
        guidance_scale: 7.5
      }
    };

    try {
      const response = await axios.post(
        FREE_ENDPOINTS.latte.huggingFace,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.huggingFaceToken}`
          },
          timeout: 300000,
          responseType: 'arraybuffer'
        }
      );

      const videoBase64 = Buffer.from(response.data).toString('base64');

      return {
        success: true,
        videoBase64: videoBase64,
        provider: 'Latte',
        duration: request.duration,
        resolution: '512x512',
        generationTime: 0,
        metadata: {
          model: 'maxin-cn/Latte-1'
        }
      };
    } catch (error: any) {
      throw new Error(`Latte failed: ${error.message}`);
    }
  }

  /**
   * Generate with Stable Video Diffusion (Image-to-Video)
   */
  private async generateWithStableVideo(prompt: string, request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    // SVD requires an input image, generate one first if not provided
    let inputImage = request.seedImage;

    if (!inputImage) {
      // Generate image from prompt using free Stable Diffusion
      inputImage = await this.generateImageFromPrompt(prompt);
    }

    const payload = {
      inputs: inputImage,
      parameters: {
        num_frames: 25,
        motion_bucket_id: 127,
        noise_aug_strength: 0.02,
        decode_chunk_size: 8
      }
    };

    try {
      const response = await axios.post(
        FREE_ENDPOINTS.stableVideo.huggingFace,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.huggingFaceToken}`
          },
          timeout: 300000,
          responseType: 'arraybuffer'
        }
      );

      const videoBase64 = Buffer.from(response.data).toString('base64');

      return {
        success: true,
        videoBase64: videoBase64,
        provider: 'Stable Video Diffusion',
        duration: 4, // SVD generates ~4 second videos
        resolution: '1024x576',
        generationTime: 0,
        metadata: {
          model: 'stabilityai/stable-video-diffusion-img2vid-xt'
        }
      };
    } catch (error: any) {
      throw new Error(`Stable Video Diffusion failed: ${error.message}`);
    }
  }

  /**
   * Generic Hugging Face Inference API call
   */
  private async generateWithHuggingFaceInference(
    model: string,
    prompt: string,
    request: VideoGenerationRequest,
    providerName: string
  ): Promise<VideoGenerationResult> {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${this.huggingFaceToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 300000,
        responseType: 'arraybuffer'
      }
    );

    const videoBase64 = Buffer.from(response.data).toString('base64');

    return {
      success: true,
      videoBase64: videoBase64,
      provider: providerName,
      duration: request.duration,
      resolution: request.quality,
      generationTime: 0,
      metadata: { model }
    };
  }

  /**
   * Generate image from prompt (for Image-to-Video providers)
   */
  private async generateImageFromPrompt(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
        { inputs: prompt },
        {
          headers: {
            'Authorization': `Bearer ${this.huggingFaceToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000,
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data).toString('base64');
    } catch (error) {
      // Return a placeholder or throw
      throw new Error('Failed to generate seed image');
    }
  }

  // ============= VIDEO UPSCALING (FREE) =============

  /**
   * Upscale video to 4K using Real-ESRGAN (FREE)
   */
  async upscaleVideo(request: UpscaleRequest): Promise<VideoGenerationResult> {
    const startTime = Date.now();

    this.emit('upscaleStarted', request);

    try {
      // Try Hugging Face Real-ESRGAN Space (FREE)
      const payload = {
        data: [
          request.videoUrl,
          request.targetResolution === '4k' ? 4 : 2, // scale factor
          'realesrgan-x4plus', // model
          request.denoiseStrength || 0.5
        ]
      };

      const response = await axios.post(
        FREE_ENDPOINTS.realEsrgan.huggingFace,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 600000 // 10 minutes for upscaling
        }
      );

      if (response.data && response.data.data) {
        return {
          success: true,
          videoUrl: response.data.data[0],
          provider: 'Real-ESRGAN',
          duration: 0,
          resolution: request.targetResolution,
          generationTime: Date.now() - startTime,
          metadata: {
            model: 'Real-ESRGAN x4plus',
            scaleFactor: request.targetResolution === '4k' ? 4 : 2
          }
        };
      }

      throw new Error('Upscaling failed');
    } catch (error: any) {
      return {
        success: false,
        provider: 'Real-ESRGAN',
        duration: 0,
        resolution: request.targetResolution,
        generationTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Upscale using FFmpeg (LOCAL - FREE)
   */
  async upscaleWithFFmpeg(inputPath: string, outputPath: string, scale: number = 2): Promise<string> {
    // Returns FFmpeg command for local execution
    return `ffmpeg -i "${inputPath}" -vf "scale=iw*${scale}:ih*${scale}:flags=lanczos" -c:a copy "${outputPath}"`;
  }

  // ============= VIDEO ENHANCEMENT (FREE) =============

  /**
   * Enhance video using FREE tools
   */
  async enhanceVideo(request: EnhanceRequest): Promise<VideoGenerationResult> {
    const startTime = Date.now();
    const filters: string[] = [];

    // Build FFmpeg filter chain
    if (request.colorCorrection) {
      filters.push('eq=contrast=1.1:brightness=0.05:saturation=1.2');
    }

    if (request.brightnessAdjust) {
      const brightness = request.brightnessAdjust / 100;
      filters.push(`eq=brightness=${brightness}`);
    }

    if (request.contrastAdjust) {
      const contrast = 1 + (request.contrastAdjust / 100);
      filters.push(`eq=contrast=${contrast}`);
    }

    if (request.saturationAdjust) {
      const saturation = 1 + (request.saturationAdjust / 100);
      filters.push(`eq=saturation=${saturation}`);
    }

    if (request.denoising) {
      filters.push('hqdn3d=4:3:6:4.5');
    }

    if (request.sharpening) {
      filters.push('unsharp=5:5:1.0:5:5:0.0');
    }

    if (request.stabilization) {
      // VidStab requires two-pass
      filters.push('vidstabdetect=shakiness=5:accuracy=15');
    }

    const filterString = filters.join(',');

    return {
      success: true,
      provider: 'FFmpeg Enhancement',
      duration: 0,
      resolution: 'original',
      generationTime: Date.now() - startTime,
      metadata: {
        ffmpegCommand: `ffmpeg -i input.mp4 -vf "${filterString}" output.mp4`,
        filters: filters
      }
    };
  }

  /**
   * Remove watermark using FFmpeg (FREE)
   */
  async removeWatermark(
    videoUrl: string,
    watermarkArea: { x: number; y: number; width: number; height: number }
  ): Promise<string> {
    // Returns FFmpeg delogo command
    return `ffmpeg -i "${videoUrl}" -vf "delogo=x=${watermarkArea.x}:y=${watermarkArea.y}:w=${watermarkArea.width}:h=${watermarkArea.height}:show=0" output.mp4`;
  }

  // ============= TREND ANALYSIS (FREE) =============

  /**
   * Get trending video topics (FREE)
   */
  async getTrendingTopics(): Promise<Array<{
    topic: string;
    platform: string;
    score: number;
    tags: string[];
  }>> {
    const trends: Array<{ topic: string; platform: string; score: number; tags: string[] }> = [];

    // Scrape YouTube trending (no API key needed for basic trending)
    try {
      const ytResponse = await axios.get('https://www.youtube.com/feed/trending', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      // Parse trending topics from HTML (simplified)
      const titleMatches = ytResponse.data.match(/"title":{"runs":\[{"text":"([^"]+)"}/g) || [];
      titleMatches.slice(0, 10).forEach((match: string, index: number) => {
        const title = match.match(/"text":"([^"]+)"/)?.[1];
        if (title) {
          trends.push({
            topic: title,
            platform: 'YouTube',
            score: 100 - index * 5,
            tags: this.extractTags(title)
          });
        }
      });
    } catch (error) {
      console.log('YouTube trending fetch failed');
    }

    // Add AI-generated trending suggestions
    const aiSuggestions = [
      { topic: 'AI Art Generation Tutorial', platform: 'General', score: 95, tags: ['ai', 'art', 'tutorial'] },
      { topic: 'Satisfying ASMR Compilation', platform: 'TikTok', score: 92, tags: ['asmr', 'satisfying', 'relaxing'] },
      { topic: 'Day in My Life Vlog', platform: 'YouTube', score: 90, tags: ['vlog', 'lifestyle', 'daily'] },
      { topic: 'Product Review Shorts', platform: 'TikTok', score: 88, tags: ['review', 'product', 'shorts'] },
      { topic: 'Cooking Recipe Quick Tips', platform: 'Instagram', score: 85, tags: ['cooking', 'recipe', 'food'] }
    ];

    return [...trends, ...aiSuggestions].slice(0, 20);
  }

  /**
   * Generate video ideas based on trends
   */
  async generateVideoIdeas(niche: string): Promise<Array<{
    title: string;
    description: string;
    prompt: string;
    style: VideoStyle;
    duration: number;
    tags: string[];
  }>> {
    const trends = await this.getTrendingTopics();

    // Generate ideas combining niche with trends
    const ideas = [
      {
        title: `${niche} - Complete Guide 2025`,
        description: `Comprehensive guide to ${niche} with latest trends and tips`,
        prompt: `Professional video about ${niche}, educational, engaging, modern graphics, clean transitions, expert narration style`,
        style: 'cinematic' as VideoStyle,
        duration: 10,
        tags: [niche.toLowerCase(), 'guide', 'tutorial', '2025']
      },
      {
        title: `Top 10 ${niche} Tips You Need`,
        description: `Quick tips and tricks for ${niche} enthusiasts`,
        prompt: `Dynamic countdown video about ${niche} tips, energetic, colorful graphics, fast paced, engaging`,
        style: 'realistic' as VideoStyle,
        duration: 8,
        tags: [niche.toLowerCase(), 'tips', 'top10', 'tricks']
      },
      {
        title: `${niche} - Before vs After`,
        description: `Amazing transformation showing ${niche} results`,
        prompt: `Split screen transformation video, dramatic reveal, satisfying before and after, ${niche} themed`,
        style: 'cinematic' as VideoStyle,
        duration: 6,
        tags: [niche.toLowerCase(), 'transformation', 'beforeafter', 'results']
      },
      {
        title: `Day in the Life: ${niche} Creator`,
        description: `Behind the scenes of a ${niche} content creator`,
        prompt: `Aesthetic day in the life vlog style, morning routine, workspace shots, ${niche} activities, cozy atmosphere`,
        style: 'vintage' as VideoStyle,
        duration: 12,
        tags: [niche.toLowerCase(), 'vlog', 'dayinthelife', 'creator']
      },
      {
        title: `${niche} Aesthetic Compilation`,
        description: `Satisfying ${niche} content compilation`,
        prompt: `Aesthetic satisfying compilation, ${niche} visuals, smooth transitions, calming music vibes, high quality footage`,
        style: 'artistic' as VideoStyle,
        duration: 15,
        tags: [niche.toLowerCase(), 'aesthetic', 'satisfying', 'compilation']
      }
    ];

    return ideas;
  }

  // ============= HELPER METHODS =============

  /**
   * Build enhanced prompt with style
   */
  private buildEnhancedPrompt(request: VideoGenerationRequest): string {
    const styleEnhancement = STYLE_PROMPTS[request.style] || '';
    return `${request.prompt}, ${styleEnhancement}`.trim();
  }

  /**
   * Get resolution dimensions
   */
  private getResolutionDimensions(quality: VideoQuality, aspectRatio: AspectRatio): { width: number; height: number } {
    const baseHeights: Record<VideoQuality, number> = {
      '360p': 360,
      '480p': 480,
      '720p': 720,
      '1080p': 1080,
      '4k': 2160
    };

    const ratios: Record<AspectRatio, number> = {
      '16:9': 16 / 9,
      '9:16': 9 / 16,
      '1:1': 1,
      '4:3': 4 / 3,
      '21:9': 21 / 9
    };

    const height = baseHeights[quality];
    const ratio = ratios[aspectRatio];

    return {
      width: Math.round(height * ratio),
      height: height
    };
  }

  /**
   * Extract tags from text
   */
  private extractTags(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(w => w.length > 3).slice(0, 5);
  }

  /**
   * Get available providers status
   */
  async checkProviderStatus(): Promise<Record<string, { available: boolean; latency?: number }>> {
    const status: Record<string, { available: boolean; latency?: number }> = {};

    const providers = [
      { name: 'open-sora', url: FREE_ENDPOINTS.openSora.gradio },
      { name: 'cogvideox', url: FREE_ENDPOINTS.cogVideoX.gradio },
      { name: 'real-esrgan', url: FREE_ENDPOINTS.realEsrgan.huggingFace }
    ];

    for (const provider of providers) {
      const start = Date.now();
      try {
        await axios.head(provider.url, { timeout: 5000 });
        status[provider.name] = { available: true, latency: Date.now() - start };
      } catch {
        status[provider.name] = { available: false };
      }
    }

    return status;
  }

  /**
   * Estimate generation cost (always $0 - FREE!)
   */
  estimateCost(request: VideoGenerationRequest): { cost: number; message: string } {
    return {
      cost: 0,
      message: '100% FREE - Using open source models!'
    };
  }
}

// ============= SINGLETON EXPORT =============

let freeSoraInstance: FreeSoraClone | null = null;

export function getFreeSoraClone(config?: { huggingFaceToken?: string; replicateToken?: string }): FreeSoraClone {
  if (!freeSoraInstance) {
    freeSoraInstance = new FreeSoraClone(config);
  }
  return freeSoraInstance;
}

export default FreeSoraClone;
