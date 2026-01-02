import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';

/**
 * Ideogram AI Service
 *
 * Integration with Ideogram.ai for:
 * - AI text rendering in images
 * - Logo generation
 * - Typography designs
 * - Branded graphics
 * - Social media templates
 *
 * Perfect for:
 * - T-shirt designs
 * - Quote graphics
 * - Logo creation
 * - Brand materials
 * - Typography art
 */

export interface IdeogramConfig {
  apiKey: string;
  baseURL?: string;
}

export interface TextToImageRequest {
  prompt: string;
  text?: string; // Text to render in the image
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  model?: 'V_2' | 'V_2_TURBO' | 'V_1' | 'V_1_TURBO';
  magicPromptOption?: 'AUTO' | 'ON' | 'OFF';
  styleType?: 'general' | 'realistic' | 'design' | 'render_3d' | 'anime';
  negativePrompt?: string;
  seed?: number;
  numImages?: number;
}

export interface LogoGenerationRequest {
  businessName: string;
  industry: string;
  style?: 'modern' | 'minimalist' | 'vintage' | 'playful' | 'elegant' | 'bold';
  colors?: string[];
  includeText?: boolean;
  symbolType?: 'abstract' | 'lettermark' | 'icon' | 'mascot' | 'emblem';
}

export interface TypographyRequest {
  text: string;
  style: 'modern' | 'vintage' | 'handwritten' | 'bold' | 'elegant' | 'grunge' | 'neon';
  theme?: string;
  colorScheme?: string[];
  layout?: 'centered' | 'left' | 'right' | 'scattered' | 'circular';
}

export interface GenerationResponse {
  requestId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  images?: Array<{
    url: string;
    prompt: string;
    resolution: string;
    seed?: number;
  }>;
  createdAt: string;
  error?: string;
}

export class IdeogramService {
  private client: AxiosInstance;
  private config: IdeogramConfig;

  constructor(config: IdeogramConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL || 'https://api.ideogram.ai/v1',
      headers: {
        'Api-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 120000,
    });
  }

  /**
   * Generate image with text rendering
   */
  async generateImage(request: TextToImageRequest): Promise<GenerationResponse> {
    const response = await this.client.post('/generate', {
      image_request: {
        prompt: request.prompt,
        aspect_ratio: request.aspectRatio || '1:1',
        model: request.model || 'V_2',
        magic_prompt_option: request.magicPromptOption || 'AUTO',
        style_type: request.styleType || 'general',
        negative_prompt: request.negativePrompt,
        seed: request.seed,
        num_images: request.numImages || 1,
      },
    });

    return this.mapResponse(response.data);
  }

  /**
   * Generate logo design
   */
  async generateLogo(request: LogoGenerationRequest): Promise<GenerationResponse> {
    const styleDescriptions = {
      modern: 'clean, contemporary, sleek lines, professional',
      minimalist: 'simple, minimal, elegant, negative space',
      vintage: 'retro, classic, timeless, traditional',
      playful: 'fun, energetic, creative, dynamic',
      elegant: 'sophisticated, refined, luxurious, premium',
      bold: 'strong, impactful, powerful, confident',
    };

    const symbolDescriptions = {
      abstract: 'abstract geometric shapes',
      lettermark: 'stylized letters and typography',
      icon: 'symbolic icon',
      mascot: 'character or mascot',
      emblem: 'badge or emblem style',
    };

    const style = request.style || 'modern';
    const symbolType = request.symbolType || 'abstract';

    let prompt = `Professional logo design for ${request.businessName}, ${request.industry} business. `;
    prompt += `${styleDescriptions[style]} style, `;
    prompt += `${symbolDescriptions[symbolType]}. `;

    if (request.includeText !== false) {
      prompt += `Include text "${request.businessName}". `;
    }

    if (request.colors && request.colors.length > 0) {
      prompt += `Color scheme: ${request.colors.join(', ')}. `;
    }

    prompt += 'Clean, professional, scalable vector style, white background.';

    return this.generateImage({
      prompt,
      aspectRatio: '1:1',
      styleType: 'design',
      model: 'V_2',
      numImages: 4,
    });
  }

  /**
   * Generate typography design
   */
  async generateTypography(request: TypographyRequest): Promise<GenerationResponse> {
    const styleDescriptions = {
      modern: 'modern, clean typography, sans-serif, contemporary design',
      vintage: 'vintage typography, retro fonts, classic lettering',
      handwritten: 'handwritten style, script font, organic lettering',
      bold: 'bold typography, strong fonts, impactful letters',
      elegant: 'elegant typography, serif fonts, sophisticated lettering',
      grunge: 'grunge typography, distressed fonts, textured letters',
      neon: 'neon typography, glowing letters, electric style',
    };

    const layoutDescriptions = {
      centered: 'centered, balanced composition',
      left: 'left-aligned, asymmetric layout',
      right: 'right-aligned, dynamic composition',
      scattered: 'scattered arrangement, creative layout',
      circular: 'circular arrangement, radial design',
    };

    let prompt = `Typography design with text "${request.text}". `;
    prompt += `${styleDescriptions[request.style]}. `;

    if (request.layout) {
      prompt += `${layoutDescriptions[request.layout]}. `;
    }

    if (request.theme) {
      prompt += `Theme: ${request.theme}. `;
    }

    if (request.colorScheme && request.colorScheme.length > 0) {
      prompt += `Colors: ${request.colorScheme.join(', ')}. `;
    }

    prompt += 'Professional design, high quality, suitable for printing.';

    return this.generateImage({
      prompt,
      styleType: 'design',
      model: 'V_2',
      numImages: 4,
    });
  }

  /**
   * Generate quote graphic
   */
  async generateQuoteGraphic(
    quote: string,
    author?: string,
    style: 'minimalist' | 'decorative' | 'modern' | 'vintage' = 'minimalist',
    aspectRatio: '1:1' | '16:9' | '9:16' = '1:1'
  ): Promise<GenerationResponse> {
    let prompt = `Beautiful quote graphic with text "${quote}"`;

    if (author) {
      prompt += ` - ${author}`;
    }

    const stylePrompts = {
      minimalist: '. Minimalist design, clean typography, simple background, elegant',
      decorative: '. Decorative elements, ornamental borders, artistic flourishes, beautiful details',
      modern: '. Modern design, contemporary typography, bold colors, professional',
      vintage: '. Vintage style, classic typography, retro aesthetic, nostalgic feel',
    };

    prompt += stylePrompts[style];

    return this.generateImage({
      prompt,
      aspectRatio,
      styleType: 'design',
      model: 'V_2',
    });
  }

  /**
   * Generate social media graphic
   */
  async generateSocialMedia(
    message: string,
    platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest',
    theme: string
  ): Promise<GenerationResponse> {
    const aspectRatios: Record<string, '1:1' | '16:9' | '9:16' | '4:3'> = {
      instagram: '1:1',
      facebook: '16:9',
      twitter: '16:9',
      linkedin: '1:1',
      pinterest: '9:16',
    };

    const prompt = `Social media graphic for ${platform} with text "${message}". Theme: ${theme}. Eye-catching, professional design, vibrant colors, suitable for ${platform}.`;

    return this.generateImage({
      prompt,
      aspectRatio: aspectRatios[platform],
      styleType: 'design',
      model: 'V_2_TURBO',
    });
  }

  /**
   * Generate t-shirt design
   */
  async generateTShirtDesign(
    concept: string,
    text?: string,
    style: 'graphic' | 'typography' | 'illustrated' | 'minimal' = 'graphic'
  ): Promise<GenerationResponse> {
    let prompt = `T-shirt design concept: ${concept}. `;

    if (text) {
      prompt += `With text "${text}". `;
    }

    const stylePrompts = {
      graphic: 'Bold graphic design, vector style, print-ready',
      typography: 'Typography-focused, creative lettering, text art',
      illustrated: 'Illustrated design, artistic, detailed drawing',
      minimal: 'Minimalist design, simple, clean, modern',
    };

    prompt += stylePrompts[style];
    prompt += '. Centered composition, transparent or simple background, suitable for apparel printing.';

    return this.generateImage({
      prompt,
      aspectRatio: '1:1',
      styleType: 'design',
      model: 'V_2',
      numImages: 4,
    });
  }

  /**
   * Generate poster design
   */
  async generatePoster(
    title: string,
    subtitle: string,
    theme: string,
    style: 'modern' | 'vintage' | 'minimalist' | 'bold' = 'modern'
  ): Promise<GenerationResponse> {
    const prompt = `Poster design with title "${title}" and subtitle "${subtitle}". Theme: ${theme}. ${style} style, professional layout, eye-catching typography, suitable for printing.`;

    return this.generateImage({
      prompt,
      aspectRatio: '4:3',
      styleType: 'design',
      model: 'V_2',
    });
  }

  /**
   * Generate business card design
   */
  async generateBusinessCard(
    name: string,
    title: string,
    company: string,
    style: 'professional' | 'creative' | 'minimalist' | 'luxurious' = 'professional'
  ): Promise<GenerationResponse> {
    const prompt = `Business card design for ${name}, ${title} at ${company}. ${style} style, elegant typography, professional layout, print-ready design.`;

    return this.generateImage({
      prompt,
      aspectRatio: '16:9',
      styleType: 'design',
      model: 'V_2',
    });
  }

  /**
   * Get generation result
   */
  async getGeneration(requestId: string): Promise<GenerationResponse> {
    const response = await this.client.get(`/result/${requestId}`);
    return this.mapResponse(response.data);
  }

  /**
   * Wait for generation to complete
   */
  async waitForCompletion(
    requestId: string,
    maxWaitTime = 300000,
    pollInterval = 3000
  ): Promise<GenerationResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const result = await this.getGeneration(requestId);

      if (result.status === 'completed') {
        return result;
      }

      if (result.status === 'failed') {
        throw new Error(`Generation failed: ${result.error}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Generation timed out');
  }

  /**
   * Generate and wait for completion
   */
  async generateImageSync(request: TextToImageRequest): Promise<GenerationResponse> {
    const generation = await this.generateImage(request);
    return this.waitForCompletion(generation.requestId);
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
   * Remix/remix an existing image
   */
  async remixImage(
    imageUrl: string,
    newPrompt: string,
    weight = 50
  ): Promise<GenerationResponse> {
    const response = await this.client.post('/remix', {
      image_request: {
        image_url: imageUrl,
        prompt: newPrompt,
        weight: weight,
        model: 'V_2',
      },
    });

    return this.mapResponse(response.data);
  }

  /**
   * Describe image (reverse prompt)
   */
  async describeImage(imageUrl: string): Promise<string> {
    const response = await this.client.post('/describe', {
      image_url: imageUrl,
    });

    return response.data.description;
  }

  /**
   * Get account usage
   */
  async getUsage(): Promise<{
    creditsUsed: number;
    creditsRemaining: number;
    generationsCount: number;
  }> {
    const response = await this.client.get('/usage');

    return {
      creditsUsed: response.data.credits_used,
      creditsRemaining: response.data.credits_remaining,
      generationsCount: response.data.generations_count,
    };
  }

  /**
   * Batch generate designs
   */
  async batchGenerate(
    requests: TextToImageRequest[]
  ): Promise<GenerationResponse[]> {
    const generations = requests.map(req => this.generateImage(req));
    const results = await Promise.all(generations);

    return Promise.all(
      results.map(result => this.waitForCompletion(result.requestId))
    );
  }

  /**
   * Generate variations of a design
   */
  async generateVariations(
    prompt: string,
    count: number,
    options?: Partial<TextToImageRequest>
  ): Promise<GenerationResponse> {
    return this.generateImage({
      prompt,
      numImages: Math.min(count, 8),
      ...options,
    });
  }

  /**
   * Map API response to standard format
   */
  private mapResponse(data: any): GenerationResponse {
    return {
      requestId: data.request_id || data.id,
      status: data.status || 'completed',
      images: data.data?.map((img: any) => ({
        url: img.url,
        prompt: img.prompt,
        resolution: img.resolution,
        seed: img.seed,
      })),
      createdAt: data.created_at || new Date().toISOString(),
      error: data.error,
    };
  }

  /**
   * Optimize prompt for text rendering
   */
  optimizePromptForText(text: string, context: string): string {
    return `${context}. Include readable text that says "${text}". Clear typography, legible letters, professional design.`;
  }

  /**
   * Estimate cost for generation
   */
  estimateCost(request: TextToImageRequest): number {
    const baseCredits = 1;
    const modelMultipliers = {
      V_2: 1.0,
      V_2_TURBO: 0.5,
      V_1: 0.8,
      V_1_TURBO: 0.4,
    };

    const imageMultiplier = request.numImages || 1;
    const modelMultiplier = modelMultipliers[request.model || 'V_2'];

    return Math.ceil(baseCredits * imageMultiplier * modelMultiplier);
  }
}

export default IdeogramService;
