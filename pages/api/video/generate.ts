/**
 * FREE VIDEO GENERATION API
 * Endpoint for generating videos using Open-Sora, CogVideoX, and other free providers
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { FreeSoraClone, getFreeSoraClone } from '../../../src/services/FreeSoraClone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      prompt,
      negativePrompt,
      duration = 6,
      quality = '720p',
      style = 'cinematic',
      aspectRatio = '16:9',
      provider = 'auto',
      seedImage
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const soraClone = getFreeSoraClone({
      huggingFaceToken: process.env.HUGGINGFACE_TOKEN
    });

    const result = await soraClone.generateVideo({
      prompt,
      negativePrompt,
      duration: Math.min(Math.max(duration, 2), 16), // 2-16 seconds
      quality,
      style,
      aspectRatio,
      provider,
      seedImage
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        data: {
          videoUrl: result.videoUrl,
          videoBase64: result.videoBase64,
          thumbnailUrl: result.thumbnailUrl,
          provider: result.provider,
          duration: result.duration,
          resolution: result.resolution,
          generationTime: result.generationTime,
          metadata: result.metadata
        },
        cost: '$0.00 (FREE)'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Video generation failed'
      });
    }

  } catch (error: any) {
    console.error('Video generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb', // For image uploads
    },
    responseLimit: false,
  },
};
