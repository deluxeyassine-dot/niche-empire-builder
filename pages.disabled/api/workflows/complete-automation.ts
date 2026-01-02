/**
 * API Route: Run Complete End-to-End Automation
 * POST /api/workflows/complete-automation
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { orchestrator } from '../../../src/lib/agent-orchestrator';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platforms = ['youtube', 'instagram', 'tiktok'] } = req.body;

    const result = await orchestrator.runCompleteAutomation(platforms);

    res.status(200).json({
      success: true,
      automation: result,
    });
  } catch (error) {
    console.error('Error running complete automation:', error);
    res.status(500).json({
      error: 'Failed to run complete automation',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
