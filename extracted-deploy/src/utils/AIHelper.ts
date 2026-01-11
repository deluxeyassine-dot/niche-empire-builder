/**
 * AIHelper - Utility class for AI API interactions
 *
 * Provides helper methods for handling API calls with retry logic,
 * rate limiting, prompt formatting, and response parsing.
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryableErrors?: string[];
}

export interface RateLimitInfo {
  requestsPerMinute: number;
  requestsRemaining: number;
  resetTime: Date;
}

export interface PromptOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  context?: string;
}

export interface ParsedResponse<T = any> {
  success: boolean;
  data?: T;
  raw: string;
  error?: string;
  metadata?: {
    tokensUsed?: number;
    processingTime?: number;
    model?: string;
  };
}

export interface StreamChunk {
  text: string;
  isComplete: boolean;
  error?: string;
}

export class AIHelper {
  private static rateLimitInfo: Map<string, RateLimitInfo> = new Map();
  private static requestQueue: Map<string, Promise<any>[]> = new Map();

  /**
   * Retry a function with exponential backoff
   * @param fn - The async function to retry
   * @param options - Retry configuration options
   * @returns The result of the function or throws error after max retries
   */
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      backoffFactor = 2,
      retryableErrors = [
        'RATE_LIMIT',
        'TIMEOUT',
        'NETWORK_ERROR',
        'SERVICE_UNAVAILABLE',
        'INTERNAL_ERROR'
      ]
    } = options;

    let lastError: Error | null = null;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();
        return result;
      } catch (error: any) {
        lastError = error;

        // Check if error is retryable
        const isRetryable = retryableErrors.some(
          errType => error.message?.includes(errType) || error.code?.includes(errType)
        );

        // Don't retry if not retryable or on last attempt
        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }

        // Log retry attempt
        console.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} after error: ${error.message}`
        );

        // Wait before retrying
        await this.sleep(delay);

        // Increase delay with exponential backoff
        delay = Math.min(delay * backoffFactor, maxDelay);
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Handle rate limiting by queuing requests
   * @param apiKey - API key identifier for rate limit tracking
   * @param fn - Function to execute with rate limiting
   * @param requestsPerMinute - Maximum requests allowed per minute
   * @returns Result of the function
   */
  static async handleRateLimit<T>(
    apiKey: string,
    fn: () => Promise<T>,
    requestsPerMinute: number = 60
  ): Promise<T> {
    const now = new Date();
    const rateLimitKey = `ratelimit_${apiKey}`;

    // Get or initialize rate limit info
    let rateLimitInfo = this.rateLimitInfo.get(rateLimitKey);

    if (!rateLimitInfo || now >= rateLimitInfo.resetTime) {
      // Reset rate limit window
      rateLimitInfo = {
        requestsPerMinute,
        requestsRemaining: requestsPerMinute,
        resetTime: new Date(now.getTime() + 60000) // Reset in 1 minute
      };
      this.rateLimitInfo.set(rateLimitKey, rateLimitInfo);
    }

    // Check if we have requests remaining
    if (rateLimitInfo.requestsRemaining <= 0) {
      const waitTime = rateLimitInfo.resetTime.getTime() - now.getTime();
      console.warn(`Rate limit exceeded. Waiting ${waitTime}ms until reset...`);
      await this.sleep(waitTime);

      // Reset after waiting
      rateLimitInfo.requestsRemaining = requestsPerMinute;
      rateLimitInfo.resetTime = new Date(Date.now() + 60000);
    }

    // Decrement remaining requests
    rateLimitInfo.requestsRemaining--;

    // Execute the function
    try {
      const result = await fn();
      return result;
    } catch (error: any) {
      // If rate limit error from API, update our tracking
      if (error.message?.includes('RATE_LIMIT') || error.code === 429) {
        rateLimitInfo.requestsRemaining = 0;
        throw new Error('RATE_LIMIT: API rate limit exceeded. Please try again later.');
      }
      throw error;
    }
  }

  /**
   * Format a prompt with optional system instructions and context
   * @param userPrompt - The main user prompt
   * @param options - Additional prompt formatting options
   * @returns Formatted prompt string
   */
  static formatPrompt(userPrompt: string, options: PromptOptions = {}): string {
    const {
      systemPrompt,
      context,
      temperature,
      maxTokens,
      stopSequences
    } = options;

    let formattedPrompt = '';

    // Add system prompt if provided
    if (systemPrompt) {
      formattedPrompt += `System Instructions: ${systemPrompt}\n\n`;
    }

    // Add context if provided
    if (context) {
      formattedPrompt += `Context: ${context}\n\n`;
    }

    // Add main user prompt
    formattedPrompt += `User Request: ${userPrompt}\n`;

    // Add parameters as instructions if specified
    const parameters: string[] = [];
    if (temperature !== undefined) {
      parameters.push(`Temperature: ${temperature} (${this.getTemperatureDescription(temperature)})`);
    }
    if (maxTokens !== undefined) {
      parameters.push(`Max Length: ${maxTokens} tokens`);
    }
    if (stopSequences && stopSequences.length > 0) {
      parameters.push(`Stop at: ${stopSequences.join(', ')}`);
    }

    if (parameters.length > 0) {
      formattedPrompt += `\nParameters: ${parameters.join(', ')}`;
    }

    return formattedPrompt.trim();
  }

  /**
   * Parse and validate API response
   * @param rawResponse - Raw response from the API
   * @param expectedFormat - Expected format ('json', 'text', 'markdown', etc.)
   * @returns Parsed response object
   */
  static parseResponse<T = any>(
    rawResponse: string,
    expectedFormat: 'json' | 'text' | 'markdown' | 'auto' = 'auto'
  ): ParsedResponse<T> {
    const startTime = Date.now();

    try {
      // Clean the response
      const cleanedResponse = this.cleanResponse(rawResponse);

      let parsedData: T | undefined;
      let success = true;
      let error: string | undefined;

      // Parse based on expected format
      if (expectedFormat === 'json' || (expectedFormat === 'auto' && this.looksLikeJSON(cleanedResponse))) {
        try {
          // Try to extract JSON from markdown code blocks
          const jsonMatch = cleanedResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          const jsonString = jsonMatch ? jsonMatch[1] : cleanedResponse;

          parsedData = JSON.parse(jsonString) as T;
        } catch (jsonError: any) {
          success = false;
          error = `JSON parsing failed: ${jsonError.message}`;
          console.warn(`Failed to parse JSON response: ${jsonError.message}`);
        }
      } else if (expectedFormat === 'markdown') {
        parsedData = this.parseMarkdown(cleanedResponse) as T;
      } else {
        // Plain text
        parsedData = cleanedResponse as T;
      }

      return {
        success,
        data: parsedData,
        raw: rawResponse,
        error,
        metadata: {
          processingTime: Date.now() - startTime,
          tokensUsed: this.estimateTokens(rawResponse)
        }
      };
    } catch (error: any) {
      return {
        success: false,
        raw: rawResponse,
        error: error.message,
        metadata: {
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Stream response from AI API with real-time processing
   * @param streamFunction - Function that returns an async iterable stream
   * @param onChunk - Callback for each chunk received
   * @param onComplete - Callback when stream completes
   * @param onError - Callback for errors
   * @returns Complete accumulated response
   */
  static async streamResponse(
    streamFunction: () => AsyncIterable<any>,
    onChunk?: (chunk: StreamChunk) => void,
    onComplete?: (fullText: string) => void,
    onError?: (error: Error) => void
  ): Promise<string> {
    let fullText = '';
    let chunkCount = 0;

    try {
      const stream = await streamFunction();

      for await (const chunk of stream) {
        chunkCount++;

        // Extract text from chunk (adjust based on API response structure)
        const chunkText = this.extractTextFromChunk(chunk);

        if (chunkText) {
          fullText += chunkText;

          // Call chunk callback if provided
          if (onChunk) {
            onChunk({
              text: chunkText,
              isComplete: false
            });
          }
        }
      }

      // Call completion callback
      if (onComplete) {
        onComplete(fullText);
      }

      if (onChunk) {
        onChunk({
          text: '',
          isComplete: true
        });
      }

      console.log(`Stream completed: ${chunkCount} chunks, ${fullText.length} characters`);

      return fullText;
    } catch (error: any) {
      console.error('Streaming error:', error);

      if (onError) {
        onError(error);
      }

      if (onChunk) {
        onChunk({
          text: '',
          isComplete: true,
          error: error.message
        });
      }

      throw new Error(`Stream failed: ${error.message}`);
    }
  }

  /**
   * Validate and sanitize user input before sending to API
   * @param input - User input string
   * @param maxLength - Maximum allowed length
   * @returns Sanitized input
   */
  static sanitizeInput(input: string, maxLength: number = 10000): string {
    // Trim whitespace
    let sanitized = input.trim();

    // Remove potentially harmful characters/patterns
    sanitized = sanitized
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\r\n/g, '\n') // Normalize line breaks
      .replace(/\n{3,}/g, '\n\n'); // Limit consecutive line breaks

    // Truncate if too long
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength) + '...';
      console.warn(`Input truncated from ${input.length} to ${maxLength} characters`);
    }

    return sanitized;
  }

  /**
   * Batch multiple prompts and execute with rate limiting
   * @param prompts - Array of prompts to execute
   * @param executeFn - Function to execute for each prompt
   * @param batchSize - Number of concurrent requests
   * @param delayBetweenBatches - Delay in ms between batches
   * @returns Array of results
   */
  static async batchExecute<T>(
    prompts: string[],
    executeFn: (prompt: string) => Promise<T>,
    batchSize: number = 5,
    delayBetweenBatches: number = 1000
  ): Promise<T[]> {
    const results: T[] = [];
    const batches = this.chunkArray(prompts, batchSize);

    console.log(`Executing ${prompts.length} prompts in ${batches.length} batches of ${batchSize}`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length}...`);

      // Execute batch in parallel
      const batchResults = await Promise.allSettled(
        batch.map(prompt => executeFn(prompt))
      );

      // Collect results and handle errors
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error('Batch execution error:', result.reason);
          // You could push a default/error value here if needed
        }
      }

      // Delay between batches (except for last batch)
      if (i < batches.length - 1) {
        await this.sleep(delayBetweenBatches);
      }
    }

    return results;
  }

  /**
   * Calculate cost estimate for API call
   * @param inputTokens - Number of input tokens
   * @param outputTokens - Number of output tokens
   * @param model - Model being used
   * @returns Estimated cost in USD
   */
  static estimateCost(
    inputTokens: number,
    outputTokens: number,
    model: 'gemini-pro' | 'gemini-pro-vision' = 'gemini-pro'
  ): number {
    // Pricing as of 2024 (adjust based on current pricing)
    const pricing = {
      'gemini-pro': {
        input: 0.00025 / 1000,  // $0.00025 per 1K tokens
        output: 0.0005 / 1000   // $0.0005 per 1K tokens
      },
      'gemini-pro-vision': {
        input: 0.00025 / 1000,
        output: 0.0005 / 1000
      }
    };

    const modelPricing = pricing[model];
    const inputCost = inputTokens * modelPricing.input;
    const outputCost = outputTokens * modelPricing.output;

    return inputCost + outputCost;
  }

  // ==================== Private Helper Methods ====================

  /**
   * Sleep for specified milliseconds
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get description for temperature value
   */
  private static getTemperatureDescription(temperature: number): string {
    if (temperature < 0.3) return 'Very focused and deterministic';
    if (temperature < 0.7) return 'Balanced creativity';
    if (temperature < 1.0) return 'Creative and varied';
    return 'Highly creative and random';
  }

  /**
   * Clean response text
   */
  private static cleanResponse(response: string): string {
    return response
      .trim()
      .replace(/^```(?:json|markdown|text)?\s*/i, '') // Remove opening code fence
      .replace(/\s*```\s*$/i, '') // Remove closing code fence
      .replace(/\r\n/g, '\n') // Normalize line endings
      .trim();
  }

  /**
   * Check if string looks like JSON
   */
  private static looksLikeJSON(str: string): boolean {
    const trimmed = str.trim();
    return (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    );
  }

  /**
   * Parse markdown to structured format
   */
  private static parseMarkdown(markdown: string): any {
    const lines = markdown.split('\n');
    const result: any = {
      headings: [],
      paragraphs: [],
      lists: [],
      codeBlocks: []
    };

    let currentSection: string | null = null;
    let currentList: string[] = [];
    let currentCodeBlock: string[] = [];
    let inCodeBlock = false;

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          result.codeBlocks.push(currentCodeBlock.join('\n'));
          currentCodeBlock = [];
        }
        inCodeBlock = !inCodeBlock;
      } else if (inCodeBlock) {
        currentCodeBlock.push(line);
      } else if (line.startsWith('#')) {
        result.headings.push({
          level: line.match(/^#+/)?.[0].length || 1,
          text: line.replace(/^#+\s*/, '')
        });
      } else if (line.match(/^[-*+]\s/)) {
        currentList.push(line.replace(/^[-*+]\s*/, ''));
      } else if (line.trim() && currentList.length > 0) {
        result.lists.push([...currentList]);
        currentList = [];
        result.paragraphs.push(line);
      } else if (line.trim()) {
        result.paragraphs.push(line);
      }
    }

    if (currentList.length > 0) {
      result.lists.push(currentList);
    }

    return result;
  }

  /**
   * Extract text from stream chunk
   */
  private static extractTextFromChunk(chunk: any): string {
    // Handle different chunk formats from various APIs
    if (typeof chunk === 'string') {
      return chunk;
    }

    if (chunk.text) {
      return typeof chunk.text === 'function' ? chunk.text() : chunk.text;
    }

    if (chunk.candidates && chunk.candidates[0]?.content?.parts?.[0]?.text) {
      return chunk.candidates[0].content.parts[0].text;
    }

    if (chunk.content) {
      return chunk.content;
    }

    return '';
  }

  /**
   * Estimate token count (rough approximation)
   * @param text - Text to estimate tokens for
   * @returns Estimated token count
   */
  static estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token for English
    return Math.ceil(text.length / 4);
  }

  /**
   * Split array into chunks
   */
  private static chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Format error message with helpful context
   */
  static formatError(error: any, context?: string): string {
    let message = 'An error occurred';

    if (context) {
      message += ` during ${context}`;
    }

    if (error.message) {
      message += `: ${error.message}`;
    }

    if (error.code) {
      message += ` (Error code: ${error.code})`;
    }

    return message;
  }

  /**
   * Log API usage statistics
   */
  static logUsageStats(stats: {
    operation: string;
    inputTokens: number;
    outputTokens: number;
    duration: number;
    model: string;
  }): void {
    const cost = this.estimateCost(stats.inputTokens, stats.outputTokens, stats.model as any);

    console.log(`
╔════════════════════════════════════════════════════════╗
║ AI API Usage Statistics                                ║
╠════════════════════════════════════════════════════════╣
║ Operation:     ${stats.operation.padEnd(39)} ║
║ Model:         ${stats.model.padEnd(39)} ║
║ Duration:      ${(stats.duration + 'ms').padEnd(39)} ║
║ Input Tokens:  ${stats.inputTokens.toString().padEnd(39)} ║
║ Output Tokens: ${stats.outputTokens.toString().padEnd(39)} ║
║ Est. Cost:     ${('$' + cost.toFixed(6)).padEnd(39)} ║
╚════════════════════════════════════════════════════════╝
    `.trim());
  }
}
