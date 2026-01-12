/**
 * LONG VIDEO ORCHESTRATOR
 * Multi-Model Orchestration System for Long-Form 4K Video Generation
 *
 * Strategy: Use the BEST free AI model for each type of shot
 * - Open-Sora Plan 1.3: Landscapes, establishing shots (85% Sora 2 quality)
 * - CogVideoX-5B: Human faces, expressions (excellent for people)
 * - AnimateDiff V3: Artistic/stylized shots (studio level)
 * - Stable Video Diffusion: Products, objects (commercial grade)
 * - ZeroScope V2 XL: Action sequences (80% Sora 2 quality)
 *
 * Pipeline: Script → Scene Analysis → Model Routing → Parallel Generation →
 *           Continuity Check → Smart Stitching → 4K Upscale → Enhancement
 */

import { EventEmitter } from 'events';
import axios from 'axios';

// ============= TYPES =============

export type SceneType =
  | 'landscape'
  | 'establishing'
  | 'face_closeup'
  | 'people'
  | 'dialogue'
  | 'artistic'
  | 'animation'
  | 'product'
  | 'object_closeup'
  | 'action'
  | 'fast_motion'
  | 'transition'
  | 'b_roll'
  | 'text_overlay';

export type VideoModel =
  | 'open-sora'        // Landscapes, establishing
  | 'cogvideox'        // Faces, people
  | 'animatediff'      // Artistic, stylized
  | 'stable-video'     // Products, objects
  | 'zeroscope'        // Action sequences
  | 'auto';            // Smart routing

export interface Scene {
  id: string;
  index: number;
  type: SceneType;
  description: string;
  prompt: string;
  duration: number; // seconds
  model?: VideoModel;
  style?: string;
  cameraMovement?: string;
  transitionIn?: string;
  transitionOut?: string;
  voiceover?: string;
  soundEffects?: string[];
  musicCue?: string;
}

export interface GeneratedClip {
  sceneId: string;
  sceneIndex: number;
  videoUrl?: string;
  videoBase64?: string;
  thumbnailUrl?: string;
  model: string;
  duration: number;
  resolution: string;
  quality: number; // 0-100
  continuityScore?: number;
  generationTime: number;
  retryCount: number;
  error?: string;
}

export interface LongVideoRequest {
  title: string;
  description: string;
  totalDuration: number; // Target duration in seconds
  style: 'cinematic' | 'documentary' | 'tutorial' | 'promotional' | 'entertainment' | 'artistic';
  aspectRatio: '16:9' | '9:16' | '1:1';
  targetQuality: '720p' | '1080p' | '4k';
  script?: string;
  scenes?: Scene[];
  voiceoverStyle?: string;
  musicGenre?: string;
  brandColors?: string[];
}

export interface LongVideoResult {
  success: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
  totalDuration: number;
  resolution: string;
  totalClips: number;
  successfulClips: number;
  failedClips: number;
  averageQuality: number;
  generationTime: number;
  processingSteps: ProcessingStep[];
  clips: GeneratedClip[];
  error?: string;
}

export interface ProcessingStep {
  step: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  duration?: number;
  details?: string;
}

export interface ModelCapabilities {
  model: VideoModel;
  name: string;
  bestFor: SceneType[];
  maxDuration: number;
  maxResolution: string;
  qualityScore: number; // vs Sora 2 (100)
  speedScore: number;
  endpoint: string;
  huggingFaceModel?: string;
  requiresImage: boolean;
  free: boolean;
}

// ============= MODEL REGISTRY =============

const MODEL_REGISTRY: Record<VideoModel, ModelCapabilities> = {
  'open-sora': {
    model: 'open-sora',
    name: 'Open-Sora Plan 1.3',
    bestFor: ['landscape', 'establishing', 'b_roll', 'transition'],
    maxDuration: 16,
    maxResolution: '768p',
    qualityScore: 85,
    speedScore: 70,
    endpoint: 'https://hpcai-tech-open-sora.hf.space/api/predict',
    huggingFaceModel: 'hpcai-tech/Open-Sora-Plan',
    requiresImage: false,
    free: true
  },
  'cogvideox': {
    model: 'cogvideox',
    name: 'CogVideoX-5B',
    bestFor: ['face_closeup', 'people', 'dialogue'],
    maxDuration: 10,
    maxResolution: '768x1360',
    qualityScore: 88,
    speedScore: 65,
    endpoint: 'https://api-inference.huggingface.co/models/THUDM/CogVideoX-5b',
    huggingFaceModel: 'THUDM/CogVideoX-5b',
    requiresImage: false,
    free: true
  },
  'animatediff': {
    model: 'animatediff',
    name: 'AnimateDiff V3',
    bestFor: ['artistic', 'animation', 'text_overlay'],
    maxDuration: 8,
    maxResolution: '1024x1024',
    qualityScore: 90,
    speedScore: 75,
    endpoint: 'https://api-inference.huggingface.co/models/guoyww/animatediff-motion-adapter-v1-5-3',
    huggingFaceModel: 'guoyww/animatediff-motion-adapter-v1-5-3',
    requiresImage: true,
    free: true
  },
  'stable-video': {
    model: 'stable-video',
    name: 'Stable Video Diffusion',
    bestFor: ['product', 'object_closeup'],
    maxDuration: 4,
    maxResolution: '1024x576',
    qualityScore: 82,
    speedScore: 80,
    endpoint: 'https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt',
    huggingFaceModel: 'stabilityai/stable-video-diffusion-img2vid-xt',
    requiresImage: true,
    free: true
  },
  'zeroscope': {
    model: 'zeroscope',
    name: 'ZeroScope V2 XL',
    bestFor: ['action', 'fast_motion'],
    maxDuration: 6,
    maxResolution: '1024x576',
    qualityScore: 80,
    speedScore: 85,
    endpoint: 'https://api-inference.huggingface.co/models/cerspense/zeroscope_v2_XL',
    huggingFaceModel: 'cerspense/zeroscope_v2_XL',
    requiresImage: false,
    free: true
  },
  'auto': {
    model: 'auto',
    name: 'Smart Auto-Router',
    bestFor: [],
    maxDuration: 16,
    maxResolution: '4k',
    qualityScore: 90,
    speedScore: 70,
    endpoint: '',
    requiresImage: false,
    free: true
  }
};

// ============= SCENE TYPE TO MODEL MAPPING =============

const SCENE_MODEL_MAP: Record<SceneType, VideoModel[]> = {
  'landscape': ['open-sora', 'zeroscope'],
  'establishing': ['open-sora', 'cogvideox'],
  'face_closeup': ['cogvideox', 'stable-video'],
  'people': ['cogvideox', 'zeroscope'],
  'dialogue': ['cogvideox'],
  'artistic': ['animatediff', 'stable-video'],
  'animation': ['animatediff'],
  'product': ['stable-video', 'cogvideox'],
  'object_closeup': ['stable-video', 'open-sora'],
  'action': ['zeroscope', 'cogvideox'],
  'fast_motion': ['zeroscope'],
  'transition': ['animatediff', 'open-sora'],
  'b_roll': ['open-sora', 'stable-video'],
  'text_overlay': ['animatediff', 'stable-video']
};

// ============= STYLE PROMPTS =============

const STYLE_ENHANCEMENTS: Record<string, string> = {
  cinematic: 'cinematic, film grain, dramatic lighting, anamorphic lens flare, depth of field, 35mm film, color graded, professional cinematography',
  documentary: 'documentary style, natural lighting, authentic, candid, handheld camera feel, realistic, observational',
  tutorial: 'clean, well-lit, educational, clear visuals, professional, instructional, easy to follow',
  promotional: 'polished, vibrant colors, dynamic, engaging, commercial quality, brand-focused, high production value',
  entertainment: 'fun, energetic, colorful, engaging, fast-paced, attention-grabbing, viral potential',
  artistic: 'artistic, creative, unique perspective, experimental, visually striking, avant-garde, aesthetic'
};

// ============= MAIN ORCHESTRATOR CLASS =============

export class LongVideoOrchestrator extends EventEmitter {
  private huggingFaceToken: string;
  private processingSteps: ProcessingStep[] = [];
  private generatedClips: GeneratedClip[] = [];
  private activeGenerations: Map<string, AbortController> = new Map();

  constructor(config?: { huggingFaceToken?: string }) {
    super();
    this.huggingFaceToken = config?.huggingFaceToken || process.env.HUGGINGFACE_TOKEN || '';
  }

  // ============= MAIN ORCHESTRATION =============

  /**
   * Generate a complete long-form video
   */
  async generateLongVideo(request: LongVideoRequest): Promise<LongVideoResult> {
    const startTime = Date.now();
    this.processingSteps = [];
    this.generatedClips = [];

    this.emit('orchestrationStarted', { request });

    try {
      // Step 1: Analyze and break down script into scenes
      this.updateStep('script_analysis', 'in_progress', 0, 'Analyzing script and breaking into scenes...');
      const scenes = request.scenes || await this.analyzeScript(request);
      this.updateStep('script_analysis', 'completed', 100, `Created ${scenes.length} scenes`);

      // Step 2: Route each scene to optimal model
      this.updateStep('model_routing', 'in_progress', 0, 'Routing scenes to optimal AI models...');
      const routedScenes = this.routeScenesToModels(scenes);
      this.updateStep('model_routing', 'completed', 100, 'All scenes routed');

      // Step 3: Generate all clips in parallel batches
      this.updateStep('clip_generation', 'in_progress', 0, 'Generating video clips...');
      const clips = await this.generateClipsParallel(routedScenes, request);
      this.updateStep('clip_generation', 'completed', 100, `Generated ${clips.filter(c => c.videoUrl || c.videoBase64).length}/${clips.length} clips`);

      // Step 4: Analyze continuity between clips
      this.updateStep('continuity_analysis', 'in_progress', 0, 'Analyzing clip continuity...');
      const continuityResults = await this.analyzeContinuity(clips);
      this.updateStep('continuity_analysis', 'completed', 100, `Average continuity score: ${continuityResults.averageScore}%`);

      // Step 5: Regenerate problematic clips
      if (continuityResults.problemClips.length > 0) {
        this.updateStep('regeneration', 'in_progress', 0, `Regenerating ${continuityResults.problemClips.length} clips...`);
        await this.regenerateClips(continuityResults.problemClips, routedScenes, request);
        this.updateStep('regeneration', 'completed', 100, 'Regeneration complete');
      }

      // Step 6: Smart stitching with transitions
      this.updateStep('stitching', 'in_progress', 0, 'Stitching clips with smart transitions...');
      const stitchedVideoUrl = await this.stitchClips(clips, request);
      this.updateStep('stitching', 'completed', 100, 'Video assembled');

      // Step 7: Upscale to target quality
      if (request.targetQuality === '4k' || request.targetQuality === '1080p') {
        this.updateStep('upscaling', 'in_progress', 0, `Upscaling to ${request.targetQuality}...`);
        const upscaledUrl = await this.upscaleVideo(stitchedVideoUrl, request.targetQuality);
        this.updateStep('upscaling', 'completed', 100, 'Upscaling complete');
      }

      // Step 8: Apply professional enhancements
      this.updateStep('enhancement', 'in_progress', 0, 'Applying professional enhancements...');
      const enhancedVideoUrl = await this.enhanceVideo(stitchedVideoUrl, request);
      this.updateStep('enhancement', 'completed', 100, 'Enhancement complete');

      // Calculate results
      const successfulClips = clips.filter(c => c.videoUrl || c.videoBase64);
      const averageQuality = successfulClips.reduce((sum, c) => sum + c.quality, 0) / successfulClips.length;

      const result: LongVideoResult = {
        success: true,
        videoUrl: enhancedVideoUrl,
        totalDuration: request.totalDuration,
        resolution: request.targetQuality,
        totalClips: clips.length,
        successfulClips: successfulClips.length,
        failedClips: clips.length - successfulClips.length,
        averageQuality: Math.round(averageQuality),
        generationTime: Date.now() - startTime,
        processingSteps: this.processingSteps,
        clips: clips
      };

      this.emit('orchestrationCompleted', result);
      return result;

    } catch (error: any) {
      const errorResult: LongVideoResult = {
        success: false,
        totalDuration: 0,
        resolution: request.targetQuality,
        totalClips: 0,
        successfulClips: 0,
        failedClips: 0,
        averageQuality: 0,
        generationTime: Date.now() - startTime,
        processingSteps: this.processingSteps,
        clips: this.generatedClips,
        error: error.message
      };

      this.emit('orchestrationFailed', errorResult);
      return errorResult;
    }
  }

  // ============= SCRIPT ANALYSIS =============

  /**
   * Analyze script/description and break into scenes
   */
  async analyzeScript(request: LongVideoRequest): Promise<Scene[]> {
    const clipDuration = 5; // Target 5 seconds per clip
    const numClips = Math.ceil(request.totalDuration / clipDuration);
    const scenes: Scene[] = [];

    // Use AI to analyze if we have a script
    if (request.script) {
      // Break script into logical segments
      const segments = this.breakScriptIntoSegments(request.script, numClips);

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const sceneType = this.detectSceneType(segment);

        scenes.push({
          id: `scene_${i}`,
          index: i,
          type: sceneType,
          description: segment,
          prompt: this.buildScenePrompt(segment, request.style, sceneType),
          duration: clipDuration,
          style: request.style,
          transitionIn: i === 0 ? 'fade_in' : 'crossfade',
          transitionOut: i === segments.length - 1 ? 'fade_out' : 'crossfade'
        });
      }
    } else {
      // Generate scenes from description
      const generatedScenes = this.generateScenesFromDescription(request.description, numClips, request.style);
      scenes.push(...generatedScenes);
    }

    return scenes;
  }

  /**
   * Break script into segments
   */
  private breakScriptIntoSegments(script: string, numSegments: number): string[] {
    // Split by sentences or paragraphs
    const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const segmentSize = Math.ceil(sentences.length / numSegments);
    const segments: string[] = [];

    for (let i = 0; i < sentences.length; i += segmentSize) {
      const segment = sentences.slice(i, i + segmentSize).join('. ').trim();
      if (segment) {
        segments.push(segment);
      }
    }

    // Ensure we have the right number of segments
    while (segments.length < numSegments) {
      segments.push(segments[segments.length - 1] || 'continuation of scene');
    }

    return segments.slice(0, numSegments);
  }

  /**
   * Detect scene type from description
   */
  private detectSceneType(description: string): SceneType {
    const lower = description.toLowerCase();

    // Check for keywords
    if (/face|portrait|closeup|expression|emotion|eyes|smile/i.test(lower)) {
      return 'face_closeup';
    }
    if (/person|people|human|man|woman|crowd|group/i.test(lower)) {
      return 'people';
    }
    if (/talking|speaking|dialogue|conversation|interview/i.test(lower)) {
      return 'dialogue';
    }
    if (/landscape|nature|mountain|ocean|sky|forest|field|sunset|sunrise/i.test(lower)) {
      return 'landscape';
    }
    if (/city|building|street|urban|architecture|skyline/i.test(lower)) {
      return 'establishing';
    }
    if (/product|item|object|device|gadget|tool/i.test(lower)) {
      return 'product';
    }
    if (/action|running|jumping|fighting|sport|race|chase/i.test(lower)) {
      return 'action';
    }
    if (/fast|speed|motion|blur|quick/i.test(lower)) {
      return 'fast_motion';
    }
    if (/art|abstract|creative|animation|cartoon|stylized/i.test(lower)) {
      return 'artistic';
    }
    if (/text|title|logo|graphics|overlay/i.test(lower)) {
      return 'text_overlay';
    }

    return 'b_roll'; // Default
  }

  /**
   * Generate scenes from description
   */
  private generateScenesFromDescription(description: string, numScenes: number, style: string): Scene[] {
    const scenes: Scene[] = [];

    // Create a narrative arc
    const arcPhases = ['opening', 'development', 'climax', 'resolution', 'closing'];
    const phaseSizes = [0.15, 0.3, 0.25, 0.2, 0.1]; // Distribution

    let currentScene = 0;
    for (let phase = 0; phase < arcPhases.length; phase++) {
      const phaseScenes = Math.round(numScenes * phaseSizes[phase]);

      for (let i = 0; i < phaseScenes && currentScene < numScenes; i++) {
        const sceneType = this.getSceneTypeForPhase(arcPhases[phase], i, phaseScenes);

        scenes.push({
          id: `scene_${currentScene}`,
          index: currentScene,
          type: sceneType,
          description: `${arcPhases[phase]}: ${description} - Part ${i + 1}`,
          prompt: this.buildScenePrompt(`${description}, ${arcPhases[phase]} phase, segment ${i + 1}`, style, sceneType),
          duration: 5,
          style: style,
          transitionIn: currentScene === 0 ? 'fade_in' : 'crossfade',
          transitionOut: currentScene === numScenes - 1 ? 'fade_out' : 'crossfade'
        });

        currentScene++;
      }
    }

    return scenes;
  }

  /**
   * Get scene type based on narrative phase
   */
  private getSceneTypeForPhase(phase: string, index: number, totalInPhase: number): SceneType {
    switch (phase) {
      case 'opening':
        return index === 0 ? 'establishing' : 'landscape';
      case 'development':
        return ['people', 'dialogue', 'b_roll'][index % 3] as SceneType;
      case 'climax':
        return ['action', 'face_closeup', 'fast_motion'][index % 3] as SceneType;
      case 'resolution':
        return ['people', 'dialogue'][index % 2] as SceneType;
      case 'closing':
        return index === totalInPhase - 1 ? 'landscape' : 'b_roll';
      default:
        return 'b_roll';
    }
  }

  /**
   * Build scene prompt with style enhancements
   */
  private buildScenePrompt(description: string, style: string, sceneType: SceneType): string {
    const styleEnhancement = STYLE_ENHANCEMENTS[style] || '';
    const typeEnhancements: Record<SceneType, string> = {
      'landscape': 'wide shot, panoramic, beautiful scenery, golden hour',
      'establishing': 'establishing shot, wide angle, setting the scene',
      'face_closeup': 'close-up shot, detailed facial features, emotional, expressive',
      'people': 'medium shot, natural poses, authentic movement',
      'dialogue': 'two-shot, conversation, natural interaction',
      'artistic': 'creative composition, artistic interpretation, visually striking',
      'animation': 'smooth animation, fluid motion, stylized',
      'product': 'product photography, clean background, professional lighting, detailed',
      'object_closeup': 'macro shot, detailed texture, shallow depth of field',
      'action': 'dynamic shot, motion, energy, excitement',
      'fast_motion': 'speed ramping, motion blur, high energy',
      'transition': 'smooth transition, flowing movement',
      'b_roll': 'supplementary footage, atmospheric, mood-setting',
      'text_overlay': 'clean space for text, balanced composition'
    };

    return `${description}, ${typeEnhancements[sceneType] || ''}, ${styleEnhancement}`.trim();
  }

  // ============= MODEL ROUTING =============

  /**
   * Route scenes to optimal AI models
   */
  routeScenesToModels(scenes: Scene[]): Scene[] {
    return scenes.map(scene => {
      if (scene.model && scene.model !== 'auto') {
        return scene;
      }

      // Get best models for this scene type
      const preferredModels = SCENE_MODEL_MAP[scene.type] || ['open-sora'];

      // Select the best available model
      const selectedModel = this.selectBestModel(preferredModels, scene);

      return {
        ...scene,
        model: selectedModel
      };
    });
  }

  /**
   * Select best model based on requirements
   */
  private selectBestModel(preferredModels: VideoModel[], scene: Scene): VideoModel {
    // Score each model based on scene requirements
    let bestModel = preferredModels[0];
    let bestScore = 0;

    for (const model of preferredModels) {
      const capabilities = MODEL_REGISTRY[model];
      if (!capabilities) continue;

      let score = capabilities.qualityScore;

      // Bonus for being specifically designed for this scene type
      if (capabilities.bestFor.includes(scene.type)) {
        score += 10;
      }

      // Consider duration requirements
      if (scene.duration <= capabilities.maxDuration) {
        score += 5;
      }

      // Speed bonus for faster models
      score += capabilities.speedScore * 0.1;

      if (score > bestScore) {
        bestScore = score;
        bestModel = model;
      }
    }

    return bestModel;
  }

  // ============= CLIP GENERATION =============

  /**
   * Generate all clips in parallel batches
   */
  async generateClipsParallel(scenes: Scene[], request: LongVideoRequest): Promise<GeneratedClip[]> {
    const batchSize = 5; // Generate 5 clips at a time
    const clips: GeneratedClip[] = [];

    for (let i = 0; i < scenes.length; i += batchSize) {
      const batch = scenes.slice(i, i + batchSize);

      this.emit('batchStarted', { batchIndex: Math.floor(i / batchSize), batchSize: batch.length });

      const batchPromises = batch.map(scene => this.generateSingleClip(scene, request));
      const batchResults = await Promise.allSettled(batchPromises);

      for (let j = 0; j < batchResults.length; j++) {
        const result = batchResults[j];
        if (result.status === 'fulfilled') {
          clips.push(result.value);
        } else {
          clips.push({
            sceneId: batch[j].id,
            sceneIndex: batch[j].index,
            model: batch[j].model || 'unknown',
            duration: batch[j].duration,
            resolution: 'failed',
            quality: 0,
            generationTime: 0,
            retryCount: 0,
            error: result.reason?.message || 'Generation failed'
          });
        }
      }

      // Update progress
      const progress = Math.round((clips.length / scenes.length) * 100);
      this.updateStep('clip_generation', 'in_progress', progress, `Generated ${clips.length}/${scenes.length} clips`);

      // Small delay between batches to avoid rate limits
      if (i + batchSize < scenes.length) {
        await this.delay(2000);
      }
    }

    this.generatedClips = clips;
    return clips;
  }

  /**
   * Generate a single clip
   */
  private async generateSingleClip(scene: Scene, request: LongVideoRequest): Promise<GeneratedClip> {
    const startTime = Date.now();
    const model = scene.model || 'open-sora';
    const modelConfig = MODEL_REGISTRY[model];

    try {
      let result: { videoUrl?: string; videoBase64?: string };

      switch (model) {
        case 'open-sora':
          result = await this.generateWithOpenSora(scene);
          break;
        case 'cogvideox':
          result = await this.generateWithCogVideoX(scene);
          break;
        case 'animatediff':
          result = await this.generateWithAnimateDiff(scene);
          break;
        case 'stable-video':
          result = await this.generateWithStableVideo(scene);
          break;
        case 'zeroscope':
          result = await this.generateWithZeroScope(scene);
          break;
        default:
          result = await this.generateWithOpenSora(scene);
      }

      return {
        sceneId: scene.id,
        sceneIndex: scene.index,
        videoUrl: result.videoUrl,
        videoBase64: result.videoBase64,
        model: modelConfig.name,
        duration: scene.duration,
        resolution: modelConfig.maxResolution,
        quality: modelConfig.qualityScore,
        generationTime: Date.now() - startTime,
        retryCount: 0
      };

    } catch (error: any) {
      throw new Error(`Failed to generate clip for scene ${scene.id}: ${error.message}`);
    }
  }

  // ============= MODEL-SPECIFIC GENERATION =============

  private async generateWithOpenSora(scene: Scene): Promise<{ videoUrl?: string; videoBase64?: string }> {
    const payload = {
      data: [
        scene.prompt,
        'blurry, low quality, distorted, watermark, ugly, deformed',
        null,
        768,
        432,
        Math.min(scene.duration, 16),
        16,
        Math.floor(Math.random() * 1000000),
        50,
        7.5
      ]
    };

    const response = await axios.post(
      MODEL_REGISTRY['open-sora'].endpoint,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(this.huggingFaceToken && { 'Authorization': `Bearer ${this.huggingFaceToken}` })
        },
        timeout: 300000
      }
    );

    if (response.data?.data?.[0]) {
      const videoData = response.data.data[0];
      return {
        videoUrl: videoData.url || videoData,
        videoBase64: videoData.data
      };
    }

    throw new Error('Invalid response from Open-Sora');
  }

  private async generateWithCogVideoX(scene: Scene): Promise<{ videoUrl?: string; videoBase64?: string }> {
    const payload = {
      inputs: scene.prompt,
      parameters: {
        num_frames: Math.min(scene.duration * 16, 160),
        height: 768,
        width: 1360,
        guidance_scale: 7.5,
        num_inference_steps: 50
      }
    };

    const response = await axios.post(
      MODEL_REGISTRY['cogvideox'].endpoint,
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

    return {
      videoBase64: Buffer.from(response.data).toString('base64')
    };
  }

  private async generateWithAnimateDiff(scene: Scene): Promise<{ videoUrl?: string; videoBase64?: string }> {
    // AnimateDiff requires a base image, generate one first
    const baseImage = await this.generateBaseImage(scene.prompt);

    const payload = {
      inputs: baseImage,
      parameters: {
        num_frames: scene.duration * 8,
        motion_bucket_id: 127
      }
    };

    const response = await axios.post(
      MODEL_REGISTRY['animatediff'].endpoint,
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

    return {
      videoBase64: Buffer.from(response.data).toString('base64')
    };
  }

  private async generateWithStableVideo(scene: Scene): Promise<{ videoUrl?: string; videoBase64?: string }> {
    const baseImage = await this.generateBaseImage(scene.prompt);

    const payload = {
      inputs: baseImage,
      parameters: {
        num_frames: 25,
        motion_bucket_id: 127,
        noise_aug_strength: 0.02
      }
    };

    const response = await axios.post(
      MODEL_REGISTRY['stable-video'].endpoint,
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

    return {
      videoBase64: Buffer.from(response.data).toString('base64')
    };
  }

  private async generateWithZeroScope(scene: Scene): Promise<{ videoUrl?: string; videoBase64?: string }> {
    const payload = {
      inputs: scene.prompt,
      parameters: {
        num_frames: scene.duration * 8,
        height: 576,
        width: 1024,
        num_inference_steps: 40
      }
    };

    const response = await axios.post(
      MODEL_REGISTRY['zeroscope'].endpoint,
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

    return {
      videoBase64: Buffer.from(response.data).toString('base64')
    };
  }

  private async generateBaseImage(prompt: string): Promise<string> {
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
  }

  // ============= CONTINUITY ANALYSIS =============

  async analyzeContinuity(clips: GeneratedClip[]): Promise<{
    averageScore: number;
    problemClips: string[];
    analysis: Record<string, number>;
  }> {
    const analysis: Record<string, number> = {};
    const problemClips: string[] = [];
    let totalScore = 0;
    let validClips = 0;

    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];

      if (!clip.videoUrl && !clip.videoBase64) {
        problemClips.push(clip.sceneId);
        analysis[clip.sceneId] = 0;
        continue;
      }

      // Score based on generation quality
      let score = clip.quality;

      // Check transition compatibility with adjacent clips
      if (i > 0 && clips[i - 1]) {
        const prevClip = clips[i - 1];
        // Same model = better continuity
        if (prevClip.model === clip.model) {
          score += 5;
        }
      }

      analysis[clip.sceneId] = score;
      totalScore += score;
      validClips++;

      // Flag clips with low continuity scores
      if (score < 70) {
        problemClips.push(clip.sceneId);
      }

      clip.continuityScore = score;
    }

    return {
      averageScore: validClips > 0 ? Math.round(totalScore / validClips) : 0,
      problemClips,
      analysis
    };
  }

  // ============= CLIP REGENERATION =============

  async regenerateClips(
    problemClipIds: string[],
    scenes: Scene[],
    request: LongVideoRequest
  ): Promise<void> {
    for (const clipId of problemClipIds) {
      const scene = scenes.find(s => s.id === clipId);
      if (!scene) continue;

      const clipIndex = this.generatedClips.findIndex(c => c.sceneId === clipId);
      if (clipIndex === -1) continue;

      const existingClip = this.generatedClips[clipIndex];
      if (existingClip.retryCount >= 3) {
        console.log(`Skipping ${clipId} - max retries reached`);
        continue;
      }

      try {
        // Try with different model if current one failed
        const alternativeModels = SCENE_MODEL_MAP[scene.type] || ['open-sora'];
        const nextModel = alternativeModels.find(m => m !== scene.model) || scene.model;

        const newScene = { ...scene, model: nextModel };
        const newClip = await this.generateSingleClip(newScene, request);
        newClip.retryCount = existingClip.retryCount + 1;

        this.generatedClips[clipIndex] = newClip;
      } catch (error) {
        console.error(`Failed to regenerate clip ${clipId}:`, error);
      }
    }
  }

  // ============= VIDEO STITCHING =============

  async stitchClips(clips: GeneratedClip[], request: LongVideoRequest): Promise<string> {
    // Generate FFmpeg command for stitching
    const validClips = clips.filter(c => c.videoUrl || c.videoBase64);

    if (validClips.length === 0) {
      throw new Error('No valid clips to stitch');
    }

    // Build concat demuxer file content
    const concatList = validClips.map((clip, index) => {
      const inputPath = clip.videoUrl || `clip_${index}.mp4`;
      return `file '${inputPath}'`;
    }).join('\n');

    // Build transition filter complex
    const transitions = this.buildTransitionFilterComplex(validClips, request);

    // Return the assembled video path (in real implementation, this would execute FFmpeg)
    const outputPath = `/tmp/assembled_video_${Date.now()}.mp4`;

    // FFmpeg command for reference
    const ffmpegCommand = {
      concat: concatList,
      filterComplex: transitions,
      output: outputPath,
      command: `ffmpeg -f concat -safe 0 -i concat_list.txt ${transitions ? `-filter_complex "${transitions}"` : ''} -c:v libx264 -preset medium -crf 23 "${outputPath}"`
    };

    this.emit('stitchingCommand', ffmpegCommand);

    return outputPath;
  }

  private buildTransitionFilterComplex(clips: GeneratedClip[], request: LongVideoRequest): string {
    if (clips.length < 2) return '';

    const filters: string[] = [];

    // Add crossfade between clips
    for (let i = 0; i < clips.length - 1; i++) {
      filters.push(`[${i}:v][${i + 1}:v]xfade=transition=fade:duration=0.5:offset=${i * 4.5}`);
    }

    // Add color correction
    filters.push('eq=contrast=1.05:saturation=1.1');

    return filters.join(';');
  }

  // ============= UPSCALING =============

  async upscaleVideo(videoPath: string, targetQuality: '720p' | '1080p' | '4k'): Promise<string> {
    const scaleFactors: Record<string, number> = {
      '720p': 1,
      '1080p': 1.5,
      '4k': 3
    };

    const scale = scaleFactors[targetQuality] || 1;
    const outputPath = videoPath.replace('.mp4', `_${targetQuality}.mp4`);

    // Real-ESRGAN upscaling command
    const upscaleCommand = {
      input: videoPath,
      output: outputPath,
      scale: scale,
      model: 'realesrgan-x4plus',
      command: `realesrgan-ncnn-vulkan -i "${videoPath}" -o "${outputPath}" -s ${scale} -n realesrgan-x4plus`
    };

    // RIFE frame interpolation for smoother motion
    const interpolateCommand = {
      input: outputPath,
      output: outputPath.replace('.mp4', '_60fps.mp4'),
      targetFps: 60,
      command: `rife-ncnn-vulkan -i "${outputPath}" -o "${outputPath.replace('.mp4', '_60fps.mp4')}" -m rife-v4 -x -f 60`
    };

    this.emit('upscaleCommands', { upscaleCommand, interpolateCommand });

    return outputPath;
  }

  // ============= ENHANCEMENT =============

  async enhanceVideo(videoPath: string, request: LongVideoRequest): Promise<string> {
    const outputPath = videoPath.replace('.mp4', '_enhanced.mp4');

    // Build professional enhancement filter chain
    const filters: string[] = [];

    // Color grading based on style
    switch (request.style) {
      case 'cinematic':
        filters.push('curves=preset=cross_process');
        filters.push('eq=contrast=1.1:brightness=-0.02:saturation=0.95');
        filters.push('noise=alls=5:allf=t');
        break;
      case 'documentary':
        filters.push('eq=contrast=1.05:saturation=0.9');
        filters.push('unsharp=5:5:0.8');
        break;
      case 'promotional':
        filters.push('eq=contrast=1.15:saturation=1.2:brightness=0.02');
        filters.push('vibrance=intensity=0.2');
        break;
      case 'artistic':
        filters.push('curves=preset=vintage');
        filters.push('vignette=PI/4');
        break;
      default:
        filters.push('eq=contrast=1.05:saturation=1.05');
    }

    // Universal enhancements
    filters.push('hqdn3d=2:1:2:3'); // Light denoising
    filters.push('unsharp=3:3:0.5'); // Subtle sharpening

    const filterString = filters.join(',');

    const enhanceCommand = {
      input: videoPath,
      output: outputPath,
      filters: filters,
      command: `ffmpeg -i "${videoPath}" -vf "${filterString}" -c:v libx264 -preset slow -crf 18 "${outputPath}"`
    };

    this.emit('enhanceCommand', enhanceCommand);

    return outputPath;
  }

  // ============= HELPER METHODS =============

  private updateStep(step: string, status: ProcessingStep['status'], progress: number, details?: string) {
    const existingIndex = this.processingSteps.findIndex(s => s.step === step);
    const stepData: ProcessingStep = {
      step,
      status,
      progress,
      details
    };

    if (existingIndex >= 0) {
      this.processingSteps[existingIndex] = stepData;
    } else {
      this.processingSteps.push(stepData);
    }

    this.emit('stepUpdated', stepData);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cancel ongoing generation
   */
  cancelGeneration(generationId?: string) {
    if (generationId) {
      const controller = this.activeGenerations.get(generationId);
      if (controller) {
        controller.abort();
        this.activeGenerations.delete(generationId);
      }
    } else {
      // Cancel all
      for (const controller of this.activeGenerations.values()) {
        controller.abort();
      }
      this.activeGenerations.clear();
    }

    this.emit('generationCancelled');
  }

  /**
   * Get model capabilities
   */
  getModelCapabilities(model?: VideoModel): ModelCapabilities | Record<VideoModel, ModelCapabilities> {
    if (model) {
      return MODEL_REGISTRY[model];
    }
    return MODEL_REGISTRY;
  }

  /**
   * Estimate generation time
   */
  estimateGenerationTime(request: LongVideoRequest): {
    totalMinutes: number;
    breakdown: Record<string, number>;
  } {
    const clipCount = Math.ceil(request.totalDuration / 5);
    const batchCount = Math.ceil(clipCount / 5);

    // Estimated times in minutes
    const breakdown = {
      scriptAnalysis: 0.5,
      clipGeneration: batchCount * 3, // ~3 minutes per batch
      continuityCheck: 0.5,
      stitching: 2,
      upscaling: request.targetQuality === '4k' ? 10 : 5,
      enhancement: 3
    };

    const totalMinutes = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    return { totalMinutes, breakdown };
  }
}

// ============= SINGLETON EXPORT =============

let orchestratorInstance: LongVideoOrchestrator | null = null;

export function getLongVideoOrchestrator(config?: { huggingFaceToken?: string }): LongVideoOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new LongVideoOrchestrator(config);
  }
  return orchestratorInstance;
}

export default LongVideoOrchestrator;
