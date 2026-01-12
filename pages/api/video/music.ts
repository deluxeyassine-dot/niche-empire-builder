/**
 * FREE MUSIC GENERATION API
 * POST /api/video/music - Generate background music using free AI models
 *
 * Providers (all FREE):
 * - MusicGen (Facebook/Meta - best quality)
 * - Riffusion (Stable Diffusion for music)
 * - Suno (Free tier: 50 songs/month)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getUltimateVideoFactory } from '../../../src/services/UltimateVideoFactory';

interface MusicResponse {
  success: boolean;
  audioUrl?: string;
  audioBase64?: string;
  duration: number;
  provider: string;
  cost: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MusicResponse | { error: string }>
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Return available presets
  if (req.method === 'GET') {
    const factory = getUltimateVideoFactory();
    return res.status(200).json({
      success: true,
      presets: factory.getMusicPresets(),
      providers: ['musicgen', 'riffusion'],
      cost: 0,
      message: '100% FREE music generation!'
    } as any);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, duration, genre, mood, instrumental, provider } = req.body;

    if (!prompt && !genre) {
      return res.status(400).json({ error: 'Prompt or genre is required' });
    }

    const factory = getUltimateVideoFactory({
      huggingFaceToken: process.env.HUGGINGFACE_TOKEN
    });

    // Build prompt from genre/mood if not provided
    let musicPrompt = prompt;
    if (!musicPrompt) {
      const presets = factory.getMusicPresets();
      const preset = presets[mood || 'corporate'];
      musicPrompt = preset?.prompt || `${genre} music, ${mood} mood`;
    }

    const result = await factory.generateMusic({
      prompt: musicPrompt,
      duration: Math.min(duration || 30, 300), // Max 5 minutes
      genre,
      mood,
      instrumental: instrumental ?? true,
      provider: provider || 'auto'
    });

    return res.status(200).json({
      ...result,
      cost: 0 // Always FREE!
    });

  } catch (error: any) {
    console.error('Music generation error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '1mb' }
  }
};
