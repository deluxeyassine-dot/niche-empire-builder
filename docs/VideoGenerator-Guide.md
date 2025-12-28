# VideoGenerator Usage Guide

The `VideoGenerator` utility class provides AI-powered video generation capabilities for creating product videos, promotional content, short-form videos, and more.

## Features

- **Multiple AI Providers**: Support for Runway, Pika Labs, Stability AI Video, Synthesia, and Replicate
- **Product Videos**: Generate professional product showcase videos
- **Promo Videos**: Create marketing and promotional content
- **Short-form Content**: Generate TikTok, Instagram Reels, and YouTube Shorts
- **Subtitle Generation**: Add subtitles with word-by-word highlighting
- **Platform Optimization**: Optimize videos for specific social platforms
- **Thumbnail Creation**: Generate eye-catching video thumbnails

## Setup

### 1. Install Dependencies

```bash
npm install dotenv
```

### 2. Configure API Keys

Add your API keys to the `.env` file:

```env
# Video Generation API Keys (at least one required)
RUNWAY_API_KEY=your-runway-api-key
PIKA_API_KEY=your-pika-api-key
STABILITY_API_KEY=your-stability-api-key
SYNTHESIA_API_KEY=your-synthesia-api-key
REPLICATE_API_KEY=r8_your-replicate-key
ELEVENLABS_API_KEY=your-elevenlabs-key  # Optional, for voiceovers
```

### 3. Get API Keys

- **Runway**: https://runwayml.com/ (Gen-2/Gen-3)
- **Pika Labs**: https://pika.art/
- **Stability AI**: https://stability.ai/ (Video Diffusion)
- **Synthesia**: https://www.synthesia.io/ (Avatar videos)
- **Replicate**: https://replicate.com/
- **ElevenLabs**: https://elevenlabs.io/ (Voiceovers)

### 4. Optional: Install FFmpeg

For video processing, optimization, and subtitle overlay:

```bash
# Windows (using Chocolatey)
choco install ffmpeg

# macOS
brew install ffmpeg

# Linux
sudo apt-get install ffmpeg
```

## Basic Usage

```typescript
import { getVideoGenerator } from './utils/VideoGenerator';

const videoGen = getVideoGenerator();
```

## Examples

### Generate Product Video

```typescript
const productVideo = await videoGen.generateProductVideo({
  productName: 'Premium Wireless Headphones',
  description: 'Sleek design with active noise cancellation',
  features: [
    'Active noise cancellation',
    'Premium sound quality',
    '30-hour battery life',
    'Comfortable fit'
  ],
  duration: 15, // seconds
  style: 'cinematic', // 'cinematic' | 'dynamic' | 'minimal' | 'energetic' | 'elegant'
  showText: true,
  transitions: 'smooth' // 'smooth' | 'quick' | 'dynamic'
});

console.log(`Video saved to: ${productVideo.path}`);
console.log(`Thumbnail: ${productVideo.thumbnail}`);
```

### Create Promo Video

```typescript
const promoVideo = await videoGen.createPromoVideo({
  headline: 'Summer Sale - Up to 50% Off',
  message: 'Limited time offer on all premium products',
  callToAction: 'Shop Now',
  duration: 20,
  style: 'bold', // 'corporate' | 'casual' | 'bold' | 'minimal' | 'creative'
  brandColors: ['orange', 'blue', 'white'],
  includeText: true
});

console.log(`Promo video: ${promoVideo.path}`);
```

### Generate Short-form Video (TikTok, Reels, Shorts)

```typescript
const shortVideo = await videoGen.generateShorts({
  platform: 'instagram-reel', // 'tiktok' | 'instagram-reel' | 'youtube-short'
  topic: '5 Productivity Hacks',
  hook: 'You won\'t believe #3!', // Opening hook
  duration: 30, // 15-60 seconds
  style: 'trending', // 'trending' | 'educational' | 'entertaining' | 'inspirational'
  includeSubtitles: true,
  includeEffects: true
});

console.log(`Short video: ${shortVideo.path}`);
console.log(`Vertical format: ${shortVideo.width}x${shortVideo.height}`);
```

### Add Subtitles to Video

```typescript
const subtitledVideo = await videoGen.addSubtitles(
  existingVideo,
  {
    language: 'en',
    fontSize: 48,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    position: 'center', // 'top' | 'center' | 'bottom'
    highlightStyle: 'word', // 'none' | 'word' | 'box'
    autoGenerate: true // Auto-generate from audio
  }
);

console.log(`Subtitled video: ${subtitledVideo.path}`);
```

**Note**: Subtitle generation requires:
- FFmpeg for video processing
- Whisper API or similar for speech-to-text
- Install with: `npm install openai` (for Whisper API access)

### Optimize for Platform

```typescript
const optimizedVideo = await videoGen.optimizeForPlatform(
  video,
  {
    platform: 'youtube', // 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'linkedin' | 'twitter'
    format: 'feed', // 'feed' | 'story' | 'short' | 'long'
    quality: 'high', // 'low' | 'medium' | 'high' | 'ultra'
    targetBitrate: 5000, // kbps
    targetSize: 100 // MB
  }
);

console.log(`Optimized for YouTube: ${optimizedVideo.path}`);
```

**Note**: Optimization requires FFmpeg:
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset medium \
       -vf scale=1920:1080 -r 30 -b:v 5000k output.mp4
```

### Create Thumbnail

```typescript
// Extract from video at specific time
const thumbnail1 = await videoGen.createThumbnail({
  videoPath: './video.mp4',
  timestamp: 5, // Extract frame at 5 seconds
  style: 'dramatic',
  width: 1920,
  height: 1080
});

// Or generate AI thumbnail
const thumbnail2 = await videoGen.createThumbnail({
  customPrompt: 'Dramatic product reveal with studio lighting',
  text: 'AMAZING DEAL',
  style: 'text-overlay',
  width: 1920,
  height: 1080
});

console.log(`Thumbnail: ${thumbnail1.path}`);
```

## Advanced Configuration

### Custom Configuration

```typescript
import { VideoGenerator } from './utils/VideoGenerator';

const videoGen = new VideoGenerator(
  {
    runway: {
      apiKey: 'your-key',
      model: 'gen3'
    },
    pika: {
      apiKey: 'your-key'
    },
    replicate: {
      apiKey: 'your-key'
    }
  },
  './custom-video-output'
);
```

### Provider-Specific Options

```typescript
const video = await videoGen.generateProductVideo({
  productName: 'Product Name',
  description: 'Description',
  duration: 10,
  // Provider-specific options
  provider: 'runway',
  motion: 'high', // 'low' | 'medium' | 'high'
  seed: 42, // For reproducibility
  fps: 30
});
```

### Image-to-Video

```typescript
// Convert a static image to video
const videoOptions = {
  provider: 'stability-video',
  prompt: 'Camera slowly zooms in on the product',
  imageToVideo: true,
  baseImage: './product-image.jpg',
  duration: 4,
  motion: 'medium'
};

const video = await videoGen.generate(videoOptions);
```

## Platform Specifications

The VideoGenerator automatically optimizes for each platform:

| Platform  | Format | Dimensions      | FPS | Bitrate |
|-----------|--------|-----------------|-----|---------|
| YouTube   | Feed   | 1920 x 1080     | 30  | 8000k   |
| YouTube   | Short  | 1080 x 1920     | 30  | 5000k   |
| Instagram | Feed   | 1080 x 1080     | 30  | 5000k   |
| Instagram | Story  | 1080 x 1920     | 30  | 5000k   |
| Instagram | Reel   | 1080 x 1920     | 30  | 5000k   |
| TikTok    | Feed   | 1080 x 1920     | 30  | 4000k   |
| Facebook  | Feed   | 1280 x 720      | 30  | 4000k   |
| LinkedIn  | Feed   | 1280 x 720      | 30  | 5000k   |
| Twitter   | Feed   | 1280 x 720      | 30  | 5000k   |

## Cost Estimation

The VideoGenerator includes cost estimation for each generation:

```typescript
const video = await videoGen.generateProductVideo(...);

if (video.metadata?.cost) {
  console.log(`Estimated cost: $${video.metadata.cost.toFixed(4)}`);
}
```

### Pricing Reference (Approximate)

- **Runway Gen-3**: ~$0.10 per second
- **Runway Gen-2**: ~$0.05 per second
- **Pika Labs**: ~$0.05 per second
- **Stability AI Video**: ~$0.05 per generation (4s)
- **Synthesia**: ~$0.30 per video (avatar-based)
- **Replicate**: ~$0.01-0.05 per generation (varies by model)

## Error Handling

The VideoGenerator includes robust error handling with retry logic:

```typescript
try {
  const video = await videoGen.generateProductVideo(...);
  console.log('Success:', video.path);
} catch (error) {
  console.error('Failed to generate video:', error.message);
  // Fallback logic here
}
```

## Best Practices

1. **API Keys**: Keep API keys secure in `.env` file
2. **Duration**: Keep videos short (5-30s) for faster generation and lower cost
3. **Prompts**: Be specific and descriptive for better results
4. **Quality**: Most providers generate HD quality by default
5. **Platform**: Optimize for target platform before uploading
6. **Thumbnails**: Always generate thumbnails for better engagement
7. **Cost**: Monitor costs, especially with longer durations
8. **Polling**: Video generation is async, be patient with polling

## FFmpeg Integration

For production use, integrate FFmpeg for:

### Video Optimization
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset medium \
       -vf scale=1920:1080 -r 30 -b:v 5000k output.mp4
```

### Add Subtitles
```bash
ffmpeg -i video.mp4 -vf subtitles=subtitles.srt output.mp4
```

### Extract Thumbnail
```bash
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 thumbnail.jpg
```

### Compress Video
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset faster output.mp4
```

## Whisper Integration for Subtitles

Example using OpenAI's Whisper API:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSubtitles(videoPath: string) {
  // Extract audio from video
  // ffmpeg -i video.mp4 -vn -acodec pcm_s16le audio.wav

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream('audio.wav'),
    model: 'whisper-1',
    response_format: 'srt', // or 'vtt'
    timestamp_granularities: ['word']
  });

  // Save SRT file
  fs.writeFileSync('subtitles.srt', transcription);

  // Overlay subtitles with ffmpeg
  // ffmpeg -i video.mp4 -vf subtitles=subtitles.srt output.mp4
}
```

## Complete Workflow Example

```typescript
import { getVideoGenerator } from './utils/VideoGenerator';
import { getGeminiService } from './services/GeminiService';

// 1. Generate product description
const gemini = getGeminiService();
const productDesc = await gemini.generateProductDescription({
  productName: 'Smart Watch Pro',
  features: ['Heart rate monitor', 'GPS tracking', 'Water resistant'],
  benefits: ['Track your fitness', 'Never miss a notification'],
  category: 'Wearables'
});

// 2. Generate product video
const videoGen = getVideoGenerator();
const video = await videoGen.generateProductVideo({
  productName: 'Smart Watch Pro',
  description: productDesc.longDescription,
  features: ['Heart rate monitor', 'GPS tracking', 'Water resistant'],
  duration: 15,
  style: 'cinematic'
});

// 3. Optimize for Instagram
const instagramVideo = await videoGen.optimizeForPlatform(video, {
  platform: 'instagram',
  format: 'feed',
  quality: 'high'
});

// 4. Create short for TikTok
const tiktokShort = await videoGen.generateShorts({
  platform: 'tiktok',
  topic: 'Smart Watch Pro Features',
  hook: 'The future of fitness tracking!',
  duration: 30,
  includeSubtitles: true
});

console.log('Product video package complete!');
console.log(`Main video: ${video.path}`);
console.log(`Instagram: ${instagramVideo.path}`);
console.log(`TikTok: ${tiktokShort.path}`);
console.log(`Thumbnail: ${video.thumbnail}`);
```

## Troubleshooting

### "No API keys configured"
- Ensure at least one video API key is set in `.env`
- Check that `dotenv.config()` is called before using VideoGenerator
- Verify API key validity

### "Video generation failed"
- Check API key validity
- Verify account has credits/quota
- Check network connectivity
- Review error message for provider-specific issues

### "Video generation timed out"
- Video generation can take 1-5 minutes
- Longer durations take more time
- Check provider status page
- Increase polling timeout if needed

### FFmpeg not found
- Install FFmpeg: https://ffmpeg.org/download.html
- Add to system PATH
- Restart terminal/IDE after installation

## Testing

Run the test file to verify setup:

```bash
npx ts-node src/test-video-generator.ts
```

## Limitations

1. **Generation Time**: Videos can take 1-5 minutes to generate
2. **Duration**: Most providers limit to 3-10 seconds per generation
3. **Cost**: Video generation is more expensive than images
4. **Quality**: Quality varies by provider and prompt
5. **Consistency**: Results may vary between generations

## Future Enhancements

- Batch video generation
- Video editing and trimming
- Audio/music overlay
- Advanced transitions
- Text-to-speech integration
- Multi-scene video composition
- Video templates
- Style transfer

## Resources

- [Runway Documentation](https://docs.runwayml.com/)
- [Pika Labs Guide](https://pika.art/docs)
- [Stability AI Video](https://stability.ai/stable-video)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
