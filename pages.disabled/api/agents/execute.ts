/**
 * API Route: Execute Agent
 * POST /api/agents/execute
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
    const { agentName, method, params = [] } = req.body;

    if (!agentName || !method) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['agentName', 'method'],
      });
    }

    const result = await orchestrator.executeAgent(agentName, method, params);

    if (result.success) {
      res.status(200).json({
        success: true,
        result,
      });
    } else {
      res.status(500).json({
        success: false,
        result,
      });
    }
  } catch (error) {
    console.error('Error executing agent:', error);
    res.status(500).json({
      error: 'Failed to execute agent',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
