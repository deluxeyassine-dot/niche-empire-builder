/**
 * FREE VIDEO UPSCALING API
 * Upscale videos to 4K using Real-ESRGAN (FREE)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getFreeSoraClone } from '../../../src/services/FreeSoraClone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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
      videoUrl,
      targetResolution = '4k',
      model = 'realesrgan',
      denoiseStrength = 0.5
    } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ success: false, error: 'Video URL is required' });
    }

    const soraClone = getFreeSoraClone();

    const result = await soraClone.upscaleVideo({
      videoUrl,
      targetResolution,
      model,
      denoiseStrength
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        data: {
          videoUrl: result.videoUrl,
          resolution: result.resolution,
          provider: result.provider,
          processingTime: result.generationTime,
          metadata: result.metadata
        },
        cost: '$0.00 (FREE - Real-ESRGAN)'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Upscaling failed'
      });
    }

  } catch (error: any) {
    console.error('Video upscaling error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
