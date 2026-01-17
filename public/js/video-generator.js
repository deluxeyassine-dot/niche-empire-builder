/**
 * Ultimate Video Generator - Advanced JavaScript Module
 * Provides parallel processing, caching, and intelligent model selection
 */

class VideoGenerator {
    constructor() {
        this.models = {
            ltx: {
                name: 'LTX Video (Distilled)',
                url: 'https://lightricks-ltx-video-distilled.hf.space',
                type: 'text-to-video',
                avgTime: 120,
                maxDuration: 10,
                quality: 'fast',
                priority: 1
            },
            wan: {
                name: 'Wan 2.2 (5B)',
                url: 'https://wan-ai-wan-2-2-5b.hf.space',
                type: 'text-to-video',
                avgTime: 180,
                maxDuration: 10,
                quality: 'high',
                priority: 2
            },
            svd: {
                name: 'Stable Video Diffusion',
                url: 'https://multimodalart-stable-video-diffusion.hf.space',
                type: 'image-to-video',
                avgTime: 150,
                maxDuration: 6,
                quality: 'balanced',
                priority: 3
            },
            composer: {
                name: 'AI Video Composer',
                url: 'https://huggingface-projects-ai-video-composer.hf.space',
                type: 'text-to-video',
                avgTime: 200,
                maxDuration: 30,
                quality: 'balanced',
                priority: 4
            }
        };

        this.cache = new Map();
        this.activeGenerations = new Map();
        this.listeners = new Map();
    }

    /**
     * Select the best model based on requirements
     */
    selectBestModel(requirements) {
        const { duration, quality, type = 'text-to-video' } = requirements;

        // Filter compatible models
        const compatible = Object.entries(this.models)
            .filter(([_, model]) => {
                if (type && model.type !== type) return false;
                if (duration && model.maxDuration < duration) return false;
                return true;
            })
            .sort((a, b) => {
                // Sort by quality preference then priority
                if (quality === 'fast') {
                    return a[1].avgTime - b[1].avgTime;
                } else if (quality === 'high') {
                    return (a[1].quality === 'high' ? 0 : 1) - (b[1].quality === 'high' ? 0 : 1);
                }
                return a[1].priority - b[1].priority;
            });

        return compatible.length > 0 ? compatible[0][0] : 'ltx';
    }

    /**
     * Enhance prompt with style modifiers
     */
    enhancePrompt(prompt, options = {}) {
        const { style = 'realistic', quality = 'balanced', duration } = options;

        const styleModifiers = {
            realistic: 'photorealistic, highly detailed, natural lighting, sharp focus',
            cinematic: 'cinematic, 35mm film, dramatic lighting, anamorphic, film grain, movie quality',
            anime: 'anime style, cel shading, vibrant colors, Japanese animation style',
            artistic: 'artistic, painterly, creative composition, unique visual style',
            documentary: 'documentary style, handheld camera, naturalistic, authentic',
            music_video: 'music video style, dynamic cuts, stylized, high energy'
        };

        const qualityModifiers = {
            fast: '',
            balanced: 'high quality, detailed',
            high: '4K, ultra HD, maximum detail, professional quality'
        };

        let enhanced = prompt;
        if (styleModifiers[style]) {
            enhanced += `, ${styleModifiers[style]}`;
        }
        if (qualityModifiers[quality]) {
            enhanced += `, ${qualityModifiers[quality]}`;
        }

        return enhanced;
    }

    /**
     * Generate cache key for a request
     */
    getCacheKey(prompt, options) {
        return `${prompt}_${JSON.stringify(options)}`;
    }

    /**
     * Check if result is cached
     */
    getCachedResult(prompt, options) {
        const key = this.getCacheKey(prompt, options);
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
            return cached.result;
        }
        return null;
    }

    /**
     * Cache a result
     */
    cacheResult(prompt, options, result) {
        const key = this.getCacheKey(prompt, options);
        this.cache.set(key, {
            result,
            timestamp: Date.now()
        });

        // Limit cache size
        if (this.cache.size > 100) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
    }

    /**
     * Split long prompts into scenes for parallel generation
     */
    splitIntoScenes(prompt, targetDuration) {
        // If duration is short, don't split
        if (targetDuration <= 10) {
            return [{ prompt, duration: targetDuration }];
        }

        // Try to detect natural scene breaks
        const sceneMarkers = ['. Then', '. Next', '. After', '. Finally', '. Meanwhile'];
        let scenes = [];
        let remaining = prompt;

        for (const marker of sceneMarkers) {
            const idx = remaining.indexOf(marker);
            if (idx > 0) {
                scenes.push(remaining.substring(0, idx + 1).trim());
                remaining = remaining.substring(idx + marker.length).trim();
            }
        }

        if (remaining) {
            scenes.push(remaining);
        }

        // If no natural breaks found, keep as single scene
        if (scenes.length <= 1) {
            return [{ prompt, duration: Math.min(targetDuration, 10) }];
        }

        // Distribute duration across scenes
        const durationPerScene = Math.min(10, Math.floor(targetDuration / scenes.length));
        return scenes.map(s => ({ prompt: s, duration: durationPerScene }));
    }

    /**
     * Generate multiple scenes in parallel
     */
    async parallelGenerate(scenes, options = {}) {
        const { model = 'ltx', onProgress } = options;

        const results = [];
        const total = scenes.length;

        // Generate all scenes in parallel
        const promises = scenes.map(async (scene, index) => {
            if (onProgress) {
                onProgress({
                    stage: 'generating',
                    detail: `Scene ${index + 1}/${total}`,
                    percent: (index / total) * 100
                });
            }

            // In a real implementation, this would call the actual generation API
            // For now, we prepare the request for the iframe-based approach
            return {
                sceneIndex: index,
                prompt: scene.prompt,
                duration: scene.duration,
                model: this.models[model]
            };
        });

        const generated = await Promise.all(promises);

        if (onProgress) {
            onProgress({
                stage: 'complete',
                detail: 'All scenes ready',
                percent: 100
            });
        }

        return generated;
    }

    /**
     * Check if a Hugging Face Space is available
     */
    async checkSpaceAvailability(modelKey) {
        const model = this.models[modelKey];
        if (!model) return false;

        try {
            const response = await fetch(model.url, {
                method: 'HEAD',
                mode: 'no-cors'
            });
            return true;
        } catch (error) {
            console.warn(`Space ${modelKey} might be unavailable:`, error);
            return false;
        }
    }

    /**
     * Get available models (check which spaces are up)
     */
    async getAvailableModels() {
        const checks = Object.keys(this.models).map(async key => {
            const available = await this.checkSpaceAvailability(key);
            return { key, available };
        });

        const results = await Promise.all(checks);
        return results.filter(r => r.available).map(r => r.key);
    }

    /**
     * Register event listener
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * Emit event
     */
    emit(event, data) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(data));
    }

    /**
     * Cancel ongoing generation
     */
    cancel(generationId) {
        const generation = this.activeGenerations.get(generationId);
        if (generation && generation.controller) {
            generation.controller.abort();
            this.activeGenerations.delete(generationId);
            this.emit('cancelled', { id: generationId });
            return true;
        }
        return false;
    }

    /**
     * Get generation status
     */
    getStatus(generationId) {
        return this.activeGenerations.get(generationId) || null;
    }

    /**
     * Main generation method with retry logic
     */
    async generate(prompt, options = {}) {
        const {
            duration = 6,
            quality = 'balanced',
            style = 'realistic',
            model = this.selectBestModel({ duration, quality }),
            maxRetries = 2,
            onProgress
        } = options;

        // Check cache first
        const cached = this.getCachedResult(prompt, options);
        if (cached) {
            if (onProgress) {
                onProgress({ stage: 'cached', detail: 'Using cached result', percent: 100 });
            }
            return cached;
        }

        const generationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const controller = new AbortController();

        this.activeGenerations.set(generationId, {
            id: generationId,
            prompt,
            options,
            status: 'starting',
            controller,
            startTime: Date.now()
        });

        let lastError = null;
        let retries = 0;

        while (retries <= maxRetries) {
            try {
                if (onProgress) {
                    onProgress({
                        stage: retries > 0 ? 'retrying' : 'starting',
                        detail: retries > 0 ? `Attempt ${retries + 1}` : 'Initializing',
                        percent: 5
                    });
                }

                const enhancedPrompt = this.enhancePrompt(prompt, { style, quality, duration });
                const scenes = this.splitIntoScenes(enhancedPrompt, duration);

                // Prepare result with model info
                const result = {
                    id: generationId,
                    model: this.models[model],
                    modelKey: model,
                    prompt: enhancedPrompt,
                    originalPrompt: prompt,
                    scenes,
                    options: { duration, quality, style },
                    timestamp: Date.now()
                };

                // Cache successful result
                this.cacheResult(prompt, options, result);

                // Update status
                this.activeGenerations.set(generationId, {
                    ...this.activeGenerations.get(generationId),
                    status: 'complete',
                    result
                });

                this.emit('complete', result);
                return result;

            } catch (error) {
                lastError = error;
                retries++;

                if (retries <= maxRetries) {
                    if (onProgress) {
                        onProgress({
                            stage: 'error',
                            detail: `Error: ${error.message}. Retrying...`,
                            percent: 0
                        });
                    }
                    // Wait before retry
                    await new Promise(r => setTimeout(r, 2000));
                }
            }
        }

        // All retries failed
        this.activeGenerations.set(generationId, {
            ...this.activeGenerations.get(generationId),
            status: 'failed',
            error: lastError
        });

        this.emit('error', { id: generationId, error: lastError });
        throw lastError;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoGenerator;
}

// Also expose globally
if (typeof window !== 'undefined') {
    window.VideoGenerator = VideoGenerator;
}
