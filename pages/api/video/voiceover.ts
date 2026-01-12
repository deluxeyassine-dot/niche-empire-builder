/**
 * FREE VOICEOVER API
 * POST /api/video/voiceover - Generate voiceover using free TTS models
 *
 * Providers (all FREE):
 * - Coqui XTTS-v2 (Best quality)
 * - Bark (Most realistic)
 * - Piper (Fastest)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getUltimateVideoFactory } from '../../../src/services/UltimateVideoFactory';

interface VoiceoverResponse {
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
  res: NextApiResponse<VoiceoverResponse | { error: string }>
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Return available voices
  if (req.method === 'GET') {
    const factory = getUltimateVideoFactory();
    return res.status(200).json({
      success: true,
      voices: factory.getVoicePresets(),
      providers: ['coqui', 'bark', 'piper'],
      cost: 0,
      message: '100% FREE voiceover generation!'
    } as any);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice, language, speed, pitch, provider } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 10000) {
      return res.status(400).json({ error: 'Text too long (max 10000 characters)' });
    }

    const factory = getUltimateVideoFactory({
      huggingFaceToken: process.env.HUGGINGFACE_TOKEN
    });

    const result = await factory.generateVoiceover({
      text,
      voice,
      language: language || 'en',
      speed: speed || 1.0,
      pitch: pitch || 1.0,
      provider: provider || 'auto'
    });

    return res.status(200).json({
      ...result,
      cost: 0 // Always FREE!
    });

  } catch (error: any) {
    console.error('Voiceover error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '1mb' }
  }
};
