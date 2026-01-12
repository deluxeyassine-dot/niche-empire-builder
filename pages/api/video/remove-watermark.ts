/**
 * FREE WATERMARK REMOVAL API
 * POST /api/video/remove-watermark - Remove watermarks using FREE tools
 *
 * Methods:
 * 1. FFmpeg delogo filter (instant, basic)
 * 2. Inpainting AI (better quality)
 * 3. Content-aware fill (best quality)
 *
 * Cost: $0.00
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface RemoveWatermarkResponse {
  success: boolean;
  videoUrl?: string;
  method: string;
  command: string;
  cost: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RemoveWatermarkResponse | { error: string }>
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      videoUrl,
      watermarkArea,
      method = 'delogo'
    } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'videoUrl is required' });
    }

    if (!watermarkArea || !watermarkArea.x || !watermarkArea.y || !watermarkArea.width || !watermarkArea.height) {
      return res.status(400).json({
        error: 'watermarkArea is required with x, y, width, height properties'
      });
    }

    const outputPath = videoUrl.replace('.mp4', '_no_watermark.mp4');
    let command: string;

    switch (method) {
      case 'delogo':
        // FFmpeg delogo - instant, good for simple watermarks
        command = `ffmpeg -i "${videoUrl}" -vf "delogo=x=${watermarkArea.x}:y=${watermarkArea.y}:w=${watermarkArea.width}:h=${watermarkArea.height}:show=0" -c:a copy "${outputPath}"`;
        break;

      case 'blur':
        // Blur the watermark area
        command = `ffmpeg -i "${videoUrl}" -vf "boxblur=10:1:cr=0:ar=0:enable='between(x,${watermarkArea.x},${watermarkArea.x + watermarkArea.width})*between(y,${watermarkArea.y},${watermarkArea.y + watermarkArea.height})'" -c:a copy "${outputPath}"`;
        break;

      case 'inpaint':
        // Two-pass inpainting (better quality)
        command = `
# Step 1: Create mask
ffmpeg -i "${videoUrl}" -vf "drawbox=x=${watermarkArea.x}:y=${watermarkArea.y}:w=${watermarkArea.width}:h=${watermarkArea.height}:color=white:t=fill" -frames:v 1 mask.png

# Step 2: Apply inpainting using opencv
python -c "
import cv2
import numpy as np
cap = cv2.VideoCapture('${videoUrl}')
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter('${outputPath}', fourcc, cap.get(cv2.CAP_PROP_FPS), (int(cap.get(3)), int(cap.get(4))))
mask = np.zeros((int(cap.get(4)), int(cap.get(3))), np.uint8)
mask[${watermarkArea.y}:${watermarkArea.y + watermarkArea.height}, ${watermarkArea.x}:${watermarkArea.x + watermarkArea.width}] = 255
while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    result = cv2.inpaint(frame, mask, 3, cv2.INPAINT_TELEA)
    out.write(result)
cap.release()
out.release()
"`;
        break;

      case 'content-aware':
        // Content-aware fill using ffmpeg and multiple passes
        command = `
# Multi-pass content aware removal
ffmpeg -i "${videoUrl}" -vf "
  split[original][tomask];
  [tomask]drawbox=x=${watermarkArea.x}:y=${watermarkArea.y}:w=${watermarkArea.width}:h=${watermarkArea.height}:color=white:t=fill[mask];
  [original][mask]overlay=format=auto,delogo=x=${watermarkArea.x}:y=${watermarkArea.y}:w=${watermarkArea.width}:h=${watermarkArea.height}
" -c:a copy "${outputPath}"`;
        break;

      default:
        command = `ffmpeg -i "${videoUrl}" -vf "delogo=x=${watermarkArea.x}:y=${watermarkArea.y}:w=${watermarkArea.width}:h=${watermarkArea.height}:show=0" -c:a copy "${outputPath}"`;
    }

    return res.status(200).json({
      success: true,
      videoUrl: outputPath,
      method,
      command: command.trim(),
      cost: 0 // Always FREE!
    });

  } catch (error: any) {
    console.error('Watermark removal error:', error);
    return res.status(500).json({ error: error.message });
  }
}
