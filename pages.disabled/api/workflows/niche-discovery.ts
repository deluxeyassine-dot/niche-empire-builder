/**
 * API Route: Run Niche Discovery Workflow
 * POST /api/workflows/niche-discovery
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

    const result = await orchestrator.runNicheDiscoveryWorkflow(platforms);

    res.status(200).json({
      success: true,
      workflow: result,
    });
  } catch (error) {
    console.error('Error running niche discovery workflow:', error);
    res.status(500).json({
      error: 'Failed to run niche discovery workflow',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
