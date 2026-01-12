/**
 * ULTIMATE VIDEO FACTORY API
 * POST /api/video/factory - Create complete video using the Ultimate Video Factory
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getUltimateVideoFactory, VideoFactoryRequest, VideoFactoryResult } from '../../../src/services/UltimateVideoFactory';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VideoFactoryResult | { error: string; details?: string }>
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const request: VideoFactoryRequest = req.body;

    // Validation
    if (!request.title || !request.description) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'title and description are required'
      });
    }

    if (!request.duration || request.duration < 5 || request.duration > 3600) {
      return res.status(400).json({
        error: 'Invalid duration',
        details: 'Duration must be between 5 and 3600 seconds'
      });
    }

    // Set defaults
    const factoryRequest: VideoFactoryRequest = {
      title: request.title,
      description: request.description,
      script: request.script,
      niche: request.niche,
      duration: request.duration,
      style: request.style || 'cinematic',
      aspectRatio: request.aspectRatio || '16:9',
      targetQuality: request.targetQuality || '1080p',
      fps: request.fps || 30,
      voiceover: request.voiceover,
      music: request.music,
      soundEffects: request.soundEffects ?? true,
      upscale: request.upscale ?? true,
      frameInterpolation: request.frameInterpolation ?? false,
      colorGrading: request.colorGrading || 'cinematic_teal_orange',
      filmGrain: request.filmGrain ?? false,
      stabilization: request.stabilization ?? true,
      watermark: request.watermark,
      intro: request.intro,
      outro: request.outro,
      priority: request.priority || 'normal',
      useColabGPU: request.useColabGPU ?? false,
      parallelProcessing: request.parallelProcessing ?? true
    };

    // Get factory instance
    const factory = getUltimateVideoFactory({
      huggingFaceToken: process.env.HUGGINGFACE_TOKEN
    });

    // Create video
    const result = await factory.createVideo(factoryRequest);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json({
        error: 'Video generation failed',
        details: result.error
      });
    }

  } catch (error: any) {
    console.error('Video factory error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    },
    responseLimit: false
  }
};
