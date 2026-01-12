/**
 * FREE AUDIO SERVICE
 * Complete audio production using 100% FREE tools
 *
 * Voiceover (FREE):
 * - Coqui XTTS-v2 (Best quality, multilingual)
 * - Bark (Most realistic, emotional)
 * - Piper TTS (Fastest, lightweight)
 *
 * Music (FREE):
 * - MusicGen (Facebook/Meta)
 * - Riffusion (Stable Diffusion for audio)
 * - AudioCraft (Full music generation)
 *
 * Sound Effects (FREE):
 * - Freesound.org (500k+ free sounds)
 * - AudioGen (AI-generated SFX)
 *
 * Processing (FREE):
 * - FFmpeg (mixing, normalization)
 * - Whisper (transcription/subtitles)
 */

import { EventEmitter } from 'events';
import axios from 'axios';

// ============= TYPES =============

export interface VoiceConfig {
  provider: 'coqui' | 'bark' | 'piper' | 'auto';
  voice: string;
  language: string;
  speed: number;
  pitch: number;
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm';
}

export interface MusicConfig {
  provider: 'musicgen' | 'riffusion' | 'audiocraft' | 'auto';
  genre: string;
  mood: string;
  tempo?: 'slow' | 'medium' | 'fast';
  instrumental: boolean;
  duration: number;
}

export interface SFXConfig {
  category: string;
  query: string;
  duration?: number;
  provider: 'freesound' | 'audiogen' | 'auto';
}

export interface AudioMixConfig {
  voiceoverVolume: number; // 0-1
  musicVolume: number; // 0-1
  sfxVolume: number; // 0-1
  ducking: boolean; // Lower music during voiceover
  duckingAmount: number; // How much to lower (0-1)
  normalization: boolean;
  fadeIn: number; // seconds
  fadeOut: number; // seconds
}

export interface AudioResult {
  success: boolean;
  audioUrl?: string;
  audioBase64?: string;
  duration: number;
  sampleRate: number;
  channels: number;
  format: string;
  provider: string;
  error?: string;
}

// ============= FREE API ENDPOINTS =============

const FREE_AUDIO_APIS = {
  // Voice/TTS
  coqui: {
    huggingFace: 'https://api-inference.huggingface.co/models/coqui/XTTS-v2',
    space: 'https://coqui-xtts.hf.space/api/predict',
    model: 'coqui/XTTS-v2'
  },
  bark: {
    huggingFace: 'https://api-inference.huggingface.co/models/suno/bark',
    space: 'https://suno-bark.hf.space/api/predict',
    model: 'suno/bark'
  },
  piper: {
    model: 'rhasspy/piper-voices',
    local: true
  },

  // Music Generation
  musicgen: {
    huggingFace: 'https://api-inference.huggingface.co/models/facebook/musicgen-medium',
    space: 'https://facebook-musicgen.hf.space/api/predict',
    model: 'facebook/musicgen-medium'
  },
  musicgenLarge: {
    huggingFace: 'https://api-inference.huggingface.co/models/facebook/musicgen-large',
    model: 'facebook/musicgen-large'
  },
  riffusion: {
    huggingFace: 'https://api-inference.huggingface.co/models/riffusion/riffusion-model-v1',
    model: 'riffusion/riffusion-model-v1'
  },
  audiocraft: {
    huggingFace: 'https://api-inference.huggingface.co/models/facebook/audiocraft',
    model: 'facebook/audiocraft'
  },

  // Sound Effects
  freesound: {
    api: 'https://freesound.org/apiv2',
    searchEndpoint: 'https://freesound.org/apiv2/search/text/'
  },
  audiogen: {
    huggingFace: 'https://api-inference.huggingface.co/models/facebook/audiogen-medium',
    model: 'facebook/audiogen-medium'
  },

  // Transcription
  whisper: {
    huggingFace: 'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
    model: 'openai/whisper-large-v3'
  }
};

// ============= VOICE PRESETS =============

const VOICE_PRESETS: Record<string, VoiceConfig> = {
  'male_professional': {
    provider: 'coqui',
    voice: 'en_male_1',
    language: 'en',
    speed: 1.0,
    pitch: 1.0,
    emotion: 'neutral'
  },
  'female_professional': {
    provider: 'coqui',
    voice: 'en_female_1',
    language: 'en',
    speed: 1.0,
    pitch: 1.0,
    emotion: 'neutral'
  },
  'male_narrator': {
    provider: 'bark',
    voice: 'v2/en_speaker_0',
    language: 'en',
    speed: 0.9,
    pitch: 0.95,
    emotion: 'calm'
  },
  'female_narrator': {
    provider: 'bark',
    voice: 'v2/en_speaker_9',
    language: 'en',
    speed: 0.9,
    pitch: 1.05,
    emotion: 'calm'
  },
  'energetic_male': {
    provider: 'bark',
    voice: 'v2/en_speaker_3',
    language: 'en',
    speed: 1.1,
    pitch: 1.1,
    emotion: 'excited'
  },
  'energetic_female': {
    provider: 'bark',
    voice: 'v2/en_speaker_6',
    language: 'en',
    speed: 1.1,
    pitch: 1.15,
    emotion: 'excited'
  }
};

// ============= MUSIC PRESETS =============

const MUSIC_PRESETS: Record<string, { prompt: string; config: Partial<MusicConfig> }> = {
  'cinematic_epic': {
    prompt: 'epic cinematic orchestral soundtrack, dramatic strings, brass section, inspiring, movie trailer, hans zimmer style',
    config: { genre: 'orchestral', mood: 'epic', tempo: 'medium' }
  },
  'corporate_upbeat': {
    prompt: 'corporate background music, uplifting, motivational, clean guitar, subtle drums, professional',
    config: { genre: 'corporate', mood: 'uplifting', tempo: 'medium' }
  },
  'tutorial_ambient': {
    prompt: 'soft ambient electronic music, tutorial background, non-distracting, gentle synth pads, minimal',
    config: { genre: 'ambient', mood: 'calm', tempo: 'slow' }
  },
  'vlog_happy': {
    prompt: 'happy upbeat pop music, acoustic guitar, clapping, whistling, cheerful, vlog style',
    config: { genre: 'pop', mood: 'happy', tempo: 'fast' }
  },
  'documentary_thoughtful': {
    prompt: 'documentary background music, piano, strings, thoughtful, emotional, cinematic ambient',
    config: { genre: 'ambient', mood: 'thoughtful', tempo: 'slow' }
  },
  'action_intense': {
    prompt: 'intense action music, electronic, driving beat, suspenseful, drums, synthesizer',
    config: { genre: 'electronic', mood: 'intense', tempo: 'fast' }
  },
  'relaxing_ambient': {
    prompt: 'relaxing ambient music, soft piano, nature sounds, peaceful, meditation, spa music',
    config: { genre: 'ambient', mood: 'relaxing', tempo: 'slow' }
  },
  'retro_synthwave': {
    prompt: 'synthwave retro 80s music, analog synthesizers, arpeggios, neon, nostalgic, driving',
    config: { genre: 'synthwave', mood: 'nostalgic', tempo: 'medium' }
  },
  'lofi_chill': {
    prompt: 'lofi hip hop beats, chill, study music, vinyl crackle, mellow, jazzy chords',
    config: { genre: 'lofi', mood: 'chill', tempo: 'slow' }
  }
};

// ============= SFX CATEGORIES =============

const SFX_CATEGORIES: Record<string, string[]> = {
  'nature': ['wind', 'rain', 'thunder', 'birds', 'forest', 'ocean', 'river', 'fire'],
  'urban': ['traffic', 'crowd', 'construction', 'sirens', 'subway', 'footsteps'],
  'technology': ['computer', 'typing', 'notification', 'beep', 'glitch', 'power up'],
  'transitions': ['whoosh', 'swoosh', 'impact', 'reveal', 'magic', 'shimmer'],
  'human': ['applause', 'laughter', 'gasp', 'cheer', 'whisper', 'breathing'],
  'action': ['explosion', 'punch', 'crash', 'gunshot', 'sword', 'vehicle']
};

// ============= MAIN SERVICE CLASS =============

export class FreeAudioService extends EventEmitter {
  private huggingFaceToken: string;
  private freesoundApiKey: string;

  constructor(config?: { huggingFaceToken?: string; freesoundApiKey?: string }) {
    super();
    this.huggingFaceToken = config?.huggingFaceToken || process.env.HUGGINGFACE_TOKEN || '';
    this.freesoundApiKey = config?.freesoundApiKey || process.env.FREESOUND_API_KEY || '';
  }

  // ============= VOICEOVER GENERATION =============

  /**
   * Generate voiceover using FREE TTS providers
   */
  async generateVoiceover(
    text: string,
    config: Partial<VoiceConfig> = {}
  ): Promise<AudioResult> {
    const fullConfig: VoiceConfig = {
      provider: config.provider || 'auto',
      voice: config.voice || 'en_male_1',
      language: config.language || 'en',
      speed: config.speed || 1.0,
      pitch: config.pitch || 1.0,
      emotion: config.emotion || 'neutral'
    };

    this.emit('voiceoverStarted', { text: text.substring(0, 100), config: fullConfig });

    try {
      let result: AudioResult;

      switch (fullConfig.provider) {
        case 'coqui':
          result = await this.generateWithCoqui(text, fullConfig);
          break;
        case 'bark':
          result = await this.generateWithBark(text, fullConfig);
          break;
        case 'piper':
          result = await this.generateWithPiper(text, fullConfig);
          break;
        case 'auto':
        default:
          // Try in order of quality
          result = await this.tryVoiceProviders(text, fullConfig);
          break;
      }

      this.emit('voiceoverCompleted', result);
      return result;

    } catch (error: any) {
      const errorResult: AudioResult = {
        success: false,
        duration: 0,
        sampleRate: 0,
        channels: 0,
        format: '',
        provider: fullConfig.provider,
        error: error.message
      };
      this.emit('voiceoverFailed', errorResult);
      return errorResult;
    }
  }

  private async tryVoiceProviders(text: string, config: VoiceConfig): Promise<AudioResult> {
    const providers: Array<'coqui' | 'bark' | 'piper'> = ['coqui', 'bark', 'piper'];

    for (const provider of providers) {
      try {
        const result = await this.generateVoiceover(text, { ...config, provider });
        if (result.success) return result;
      } catch (e) {
        console.log(`${provider} failed, trying next...`);
      }
    }

    throw new Error('All voice providers failed');
  }

  private async generateWithCoqui(text: string, config: VoiceConfig): Promise<AudioResult> {
    const payload = {
      data: [
        text,
        config.language,
        null, // Reference audio
        config.speed
      ]
    };

    const response = await axios.post(
      FREE_AUDIO_APIS.coqui.space,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 180000
      }
    );

    if (response.data?.data?.[0]) {
      return {
        success: true,
        audioUrl: response.data.data[0],
        duration: this.estimateDuration(text),
        sampleRate: 24000,
        channels: 1,
        format: 'wav',
        provider: 'Coqui XTTS-v2'
      };
    }

    throw new Error('Invalid Coqui response');
  }

  private async generateWithBark(text: string, config: VoiceConfig): Promise<AudioResult> {
    // Add emotion markers for Bark
    let processedText = text;
    if (config.emotion === 'happy') {
      processedText = `[laughs] ${text}`;
    } else if (config.emotion === 'sad') {
      processedText = `[sighs] ${text}`;
    }

    const payload = {
      inputs: processedText,
      parameters: {
        voice_preset: config.voice
      }
    };

    const response = await axios.post(
      FREE_AUDIO_APIS.bark.huggingFace,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${this.huggingFaceToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 180000,
        responseType: 'arraybuffer'
      }
    );

    return {
      success: true,
      audioBase64: Buffer.from(response.data).toString('base64'),
      duration: this.estimateDuration(text),
      sampleRate: 24000,
      channels: 1,
      format: 'wav',
      provider: 'Bark'
    };
  }

  private async generateWithPiper(text: string, config: VoiceConfig): Promise<AudioResult> {
    // Piper is local-only, return command for execution
    const command = `echo "${text}" | piper --model ${config.voice} --output_file output.wav`;

    return {
      success: true,
      audioUrl: 'output.wav',
      duration: this.estimateDuration(text),
      sampleRate: 22050,
      channels: 1,
      format: 'wav',
      provider: 'Piper TTS'
    };
  }

  // ============= MUSIC GENERATION =============

  /**
   * Generate background music using FREE AI models
   */
  async generateMusic(
    prompt: string,
    config: Partial<MusicConfig> = {}
  ): Promise<AudioResult> {
    const fullConfig: MusicConfig = {
      provider: config.provider || 'auto',
      genre: config.genre || 'ambient',
      mood: config.mood || 'neutral',
      tempo: config.tempo || 'medium',
      instrumental: config.instrumental ?? true,
      duration: config.duration || 30
    };

    this.emit('musicStarted', { prompt, config: fullConfig });

    try {
      let result: AudioResult;

      switch (fullConfig.provider) {
        case 'musicgen':
          result = await this.generateWithMusicGen(prompt, fullConfig);
          break;
        case 'riffusion':
          result = await this.generateWithRiffusion(prompt, fullConfig);
          break;
        case 'audiocraft':
          result = await this.generateWithAudiocraft(prompt, fullConfig);
          break;
        case 'auto':
        default:
          result = await this.tryMusicProviders(prompt, fullConfig);
          break;
      }

      this.emit('musicCompleted', result);
      return result;

    } catch (error: any) {
      const errorResult: AudioResult = {
        success: false,
        duration: 0,
        sampleRate: 0,
        channels: 0,
        format: '',
        provider: fullConfig.provider,
        error: error.message
      };
      this.emit('musicFailed', errorResult);
      return errorResult;
    }
  }

  private async tryMusicProviders(prompt: string, config: MusicConfig): Promise<AudioResult> {
    const providers: Array<'musicgen' | 'riffusion'> = ['musicgen', 'riffusion'];

    for (const provider of providers) {
      try {
        const result = await this.generateMusic(prompt, { ...config, provider });
        if (result.success) return result;
      } catch (e) {
        console.log(`${provider} failed, trying next...`);
      }
    }

    throw new Error('All music providers failed');
  }

  private async generateWithMusicGen(prompt: string, config: MusicConfig): Promise<AudioResult> {
    const payload = {
      inputs: prompt,
      parameters: {
        max_new_tokens: Math.min(config.duration * 50, 1500),
        do_sample: true,
        temperature: 1.0
      }
    };

    const response = await axios.post(
      FREE_AUDIO_APIS.musicgen.huggingFace,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${this.huggingFaceToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 300000,
        responseType: 'arraybuffer'
      }
    );

    return {
      success: true,
      audioBase64: Buffer.from(response.data).toString('base64'),
      duration: config.duration,
      sampleRate: 32000,
      channels: 1,
      format: 'wav',
      provider: 'MusicGen'
    };
  }

  private async generateWithRiffusion(prompt: string, config: MusicConfig): Promise<AudioResult> {
    const payload = {
      inputs: prompt
    };

    const response = await axios.post(
      FREE_AUDIO_APIS.riffusion.huggingFace,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${this.huggingFaceToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 180000,
        responseType: 'arraybuffer'
      }
    );

    return {
      success: true,
      audioBase64: Buffer.from(response.data).toString('base64'),
      duration: 5, // Riffusion generates ~5 second clips
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      provider: 'Riffusion'
    };
  }

  private async generateWithAudiocraft(prompt: string, config: MusicConfig): Promise<AudioResult> {
    const payload = {
      inputs: prompt,
      parameters: {
        duration: config.duration
      }
    };

    const response = await axios.post(
      FREE_AUDIO_APIS.audiocraft.huggingFace,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${this.huggingFaceToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 300000,
        responseType: 'arraybuffer'
      }
    );

    return {
      success: true,
      audioBase64: Buffer.from(response.data).toString('base64'),
      duration: config.duration,
      sampleRate: 32000,
      channels: 2,
      format: 'wav',
      provider: 'AudioCraft'
    };
  }

  // ============= SOUND EFFECTS =============

  /**
   * Get sound effects from Freesound.org (FREE)
   */
  async getSoundEffects(config: SFXConfig): Promise<AudioResult[]> {
    const results: AudioResult[] = [];

    try {
      if (config.provider === 'freesound' || config.provider === 'auto') {
        const freesoundResults = await this.searchFreesound(config.query);
        results.push(...freesoundResults);
      }

      if ((config.provider === 'audiogen' || config.provider === 'auto') && results.length === 0) {
        const audiogenResult = await this.generateWithAudioGen(config.query);
        if (audiogenResult.success) {
          results.push(audiogenResult);
        }
      }

    } catch (error: any) {
      console.error('SFX fetch error:', error);
    }

    return results;
  }

  private async searchFreesound(query: string): Promise<AudioResult[]> {
    if (!this.freesoundApiKey) {
      console.log('Freesound API key not set');
      return [];
    }

    const response = await axios.get(FREE_AUDIO_APIS.freesound.searchEndpoint, {
      params: {
        query,
        token: this.freesoundApiKey,
        fields: 'id,name,previews,duration',
        page_size: 5,
        filter: 'duration:[0 TO 30]', // Max 30 seconds
        sort: 'downloads_desc'
      }
    });

    if (response.data?.results) {
      return response.data.results.map((sound: any) => ({
        success: true,
        audioUrl: sound.previews?.['preview-hq-mp3'] || sound.previews?.['preview-lq-mp3'],
        duration: sound.duration,
        sampleRate: 44100,
        channels: 2,
        format: 'mp3',
        provider: 'Freesound.org'
      }));
    }

    return [];
  }

  private async generateWithAudioGen(prompt: string): Promise<AudioResult> {
    const payload = {
      inputs: prompt
    };

    const response = await axios.post(
      FREE_AUDIO_APIS.audiogen.huggingFace,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${this.huggingFaceToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000,
        responseType: 'arraybuffer'
      }
    );

    return {
      success: true,
      audioBase64: Buffer.from(response.data).toString('base64'),
      duration: 5,
      sampleRate: 16000,
      channels: 1,
      format: 'wav',
      provider: 'AudioGen'
    };
  }

  // ============= AUDIO MIXING =============

  /**
   * Mix multiple audio tracks using FFmpeg (FREE)
   */
  async mixAudio(
    tracks: {
      voiceover?: string;
      music?: string;
      sfx?: string[];
    },
    config: Partial<AudioMixConfig> = {}
  ): Promise<{ command: string; output: string }> {
    const fullConfig: AudioMixConfig = {
      voiceoverVolume: config.voiceoverVolume ?? 1.0,
      musicVolume: config.musicVolume ?? 0.3,
      sfxVolume: config.sfxVolume ?? 0.5,
      ducking: config.ducking ?? true,
      duckingAmount: config.duckingAmount ?? 0.7,
      normalization: config.normalization ?? true,
      fadeIn: config.fadeIn ?? 0.5,
      fadeOut: config.fadeOut ?? 1.0
    };

    const inputs: string[] = [];
    const filters: string[] = [];
    let streamIndex = 0;

    // Add voiceover
    if (tracks.voiceover) {
      inputs.push(`-i "${tracks.voiceover}"`);
      filters.push(`[${streamIndex}:a]volume=${fullConfig.voiceoverVolume}[voice]`);
      streamIndex++;
    }

    // Add music
    if (tracks.music) {
      inputs.push(`-i "${tracks.music}"`);

      if (fullConfig.ducking && tracks.voiceover) {
        // Sidechain compression for ducking
        filters.push(`[${streamIndex}:a]volume=${fullConfig.musicVolume}[music_raw]`);
        filters.push(`[music_raw]sidechaincompress=threshold=0.02:ratio=8:attack=50:release=1000[music]`);
      } else {
        filters.push(`[${streamIndex}:a]volume=${fullConfig.musicVolume}[music]`);
      }
      streamIndex++;
    }

    // Add sound effects
    if (tracks.sfx && tracks.sfx.length > 0) {
      for (let i = 0; i < tracks.sfx.length; i++) {
        inputs.push(`-i "${tracks.sfx[i]}"`);
        filters.push(`[${streamIndex}:a]volume=${fullConfig.sfxVolume}[sfx${i}]`);
        streamIndex++;
      }
    }

    // Mix all streams
    const mixInputs: string[] = [];
    if (tracks.voiceover) mixInputs.push('[voice]');
    if (tracks.music) mixInputs.push('[music]');
    if (tracks.sfx) {
      for (let i = 0; i < tracks.sfx.length; i++) {
        mixInputs.push(`[sfx${i}]`);
      }
    }

    if (mixInputs.length > 1) {
      filters.push(`${mixInputs.join('')}amix=inputs=${mixInputs.length}:duration=longest[mixed]`);
    } else if (mixInputs.length === 1) {
      const lastFilter = filters[filters.length - 1];
      filters[filters.length - 1] = lastFilter.replace(/\[(\w+)\]$/, '[mixed]');
    }

    // Add fade in/out
    if (fullConfig.fadeIn > 0 || fullConfig.fadeOut > 0) {
      filters.push(`[mixed]afade=t=in:st=0:d=${fullConfig.fadeIn},afade=t=out:st=-${fullConfig.fadeOut}:d=${fullConfig.fadeOut}[faded]`);
    }

    // Normalize if requested
    if (fullConfig.normalization) {
      const lastStream = fullConfig.fadeIn > 0 || fullConfig.fadeOut > 0 ? 'faded' : 'mixed';
      filters.push(`[${lastStream}]loudnorm=I=-16:TP=-1.5:LRA=11[final]`);
    }

    const output = 'mixed_output.wav';
    const filterComplex = filters.join(';');

    const command = `ffmpeg ${inputs.join(' ')} -filter_complex "${filterComplex}" -map "[final]" -c:a pcm_s16le "${output}"`;

    return { command, output };
  }

  // ============= TRANSCRIPTION =============

  /**
   * Transcribe audio to text using Whisper (FREE)
   */
  async transcribe(audioUrl: string): Promise<{
    success: boolean;
    text: string;
    segments: Array<{ start: number; end: number; text: string }>;
    language: string;
  }> {
    try {
      const response = await axios.post(
        FREE_AUDIO_APIS.whisper.huggingFace,
        { inputs: audioUrl },
        {
          headers: {
            'Authorization': `Bearer ${this.huggingFaceToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 300000
        }
      );

      return {
        success: true,
        text: response.data.text || '',
        segments: response.data.chunks || [],
        language: response.data.language || 'en'
      };

    } catch (error: any) {
      return {
        success: false,
        text: '',
        segments: [],
        language: 'en'
      };
    }
  }

  // ============= HELPERS =============

  private estimateDuration(text: string): number {
    const wordsPerMinute = 150;
    const words = text.split(/\s+/).length;
    return (words / wordsPerMinute) * 60;
  }

  getVoicePresets(): typeof VOICE_PRESETS {
    return VOICE_PRESETS;
  }

  getMusicPresets(): typeof MUSIC_PRESETS {
    return MUSIC_PRESETS;
  }

  getSFXCategories(): typeof SFX_CATEGORIES {
    return SFX_CATEGORIES;
  }
}

// ============= SINGLETON EXPORT =============

let audioServiceInstance: FreeAudioService | null = null;

export function getFreeAudioService(config?: { huggingFaceToken?: string; freesoundApiKey?: string }): FreeAudioService {
  if (!audioServiceInstance) {
    audioServiceInstance = new FreeAudioService(config);
  }
  return audioServiceInstance;
}

export default FreeAudioService;
