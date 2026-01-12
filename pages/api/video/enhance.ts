/**
 * FREE VIDEO ENHANCEMENT API
 * Enhance videos with color correction, stabilization, and more (FREE)
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
      colorCorrection = true,
      stabilization = false,
      denoising = false,
      sharpening = false,
      brightnessAdjust = 0,
      contrastAdjust = 0,
      saturationAdjust = 0
    } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ success: false, error: 'Video URL is required' });
    }

    const soraClone = getFreeSoraClone();

    const result = await soraClone.enhanceVideo({
      videoUrl,
      colorCorrection,
      stabilization,
      denoising,
      sharpening,
      brightnessAdjust,
      contrastAdjust,
      saturationAdjust
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        data: {
          videoUrl: result.videoUrl,
          ffmpegCommand: result.metadata?.ffmpegCommand,
          appliedFilters: result.metadata?.filters,
          processingTime: result.generationTime
        },
        cost: '$0.00 (FREE - FFmpeg)'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Enhancement failed'
      });
    }

  } catch (error: any) {
    console.error('Video enhancement error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
