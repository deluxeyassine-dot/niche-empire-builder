/**
 * ORCHESTRATOR API ENDPOINT
 * Dynamic API route for all orchestrator operations
 * /api/orchestrator/[action]
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { orchestratorApiHandler } from '../../../src/api/orchestrator-routes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return orchestratorApiHandler(req, res);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
};
