/**
 * API Route: Run Product Creation Workflow
 * POST /api/workflows/product-creation
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
    const { niche, productType = 'course' } = req.body;

    if (!niche) {
      return res.status(400).json({
        error: 'Missing required field: niche',
      });
    }

    const result = await orchestrator.runProductCreationWorkflow(niche, productType);

    res.status(200).json({
      success: true,
      workflow: result,
    });
  } catch (error) {
    console.error('Error running product creation workflow:', error);
    res.status(500).json({
      error: 'Failed to run product creation workflow',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
