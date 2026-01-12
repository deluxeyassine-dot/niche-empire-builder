/**
 * FREE TREND ANALYSIS API
 * Get trending video topics and AI-generated video ideas (FREE)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getFreeSoraClone } from '../../../src/services/FreeSoraClone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const soraClone = getFreeSoraClone();

  try {
    if (req.method === 'GET') {
      // Get trending topics
      const trends = await soraClone.getTrendingTopics();

      res.status(200).json({
        success: true,
        data: {
          trends,
          updatedAt: new Date().toISOString()
        }
      });

    } else if (req.method === 'POST') {
      // Generate video ideas for a niche
      const { niche } = req.body;

      if (!niche) {
        return res.status(400).json({ success: false, error: 'Niche is required' });
      }

      const ideas = await soraClone.generateVideoIdeas(niche);

      res.status(200).json({
        success: true,
        data: {
          niche,
          ideas,
          count: ideas.length
        }
      });

    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }

  } catch (error: any) {
    console.error('Trends API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
