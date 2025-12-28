# AIHelper Utility Guide

## Overview

The `AIHelper` class is a comprehensive utility for managing AI API interactions with the Google Gemini API. It provides robust error handling, retry logic, rate limiting, prompt formatting, and response parsing.

## Features

### 1. **Retry with Exponential Backoff**
Automatically retries failed requests with exponential backoff.

```typescript
const result = await AIHelper.retryWithBackoff(
  async () => await apiCall(),
  {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryableErrors: ['RATE_LIMIT', 'TIMEOUT', 'NETWORK_ERROR']
  }
);
```

### 2. **Rate Limiting**
Manages API rate limits by queuing requests.

```typescript
const result = await AIHelper.handleRateLimit(
  apiKey,
  async () => await apiCall(),
  60 // requests per minute
);
```

### 3. **Prompt Formatting**
Formats prompts with system instructions, context, and parameters.

```typescript
const prompt = AIHelper.formatPrompt(
  'Generate a brand name for eco-friendly products',
  {
    systemPrompt: 'You are a creative branding expert',
    context: 'Target audience: millennials',
    temperature: 0.8
  }
);
```

### 4. **Response Parsing**
Parses and validates API responses with automatic JSON extraction.

```typescript
const parsed = AIHelper.parseResponse<{ name: string }>(
  responseText,
  'json' // or 'text', 'markdown', 'auto'
);

if (parsed.success && parsed.data) {
  console.log(parsed.data.name);
}
```

### 5. **Streaming Responses**
Handle streaming responses with real-time updates.

```typescript
const fullText = await AIHelper.streamResponse(
  () => streamFunction(),
  (chunk) => {
    console.log('Received chunk:', chunk.text);
  },
  (fullText) => {
    console.log('Stream complete:', fullText);
  },
  (error) => {
    console.error('Stream error:', error);
  }
);
```

### 6. **Input Sanitization**
Sanitize user input before sending to API.

```typescript
const clean = AIHelper.sanitizeInput(userInput, 10000);
```

### 7. **Batch Execution**
Process multiple prompts efficiently with rate limiting.

```typescript
const results = await AIHelper.batchExecute(
  ['prompt1', 'prompt2', 'prompt3'],
  async (prompt) => await processPrompt(prompt),
  5, // batch size
  1000 // delay between batches (ms)
);
```

### 8. **Cost Estimation**
Estimate API costs based on token usage.

```typescript
const cost = AIHelper.estimateCost(
  1000, // input tokens
  500,  // output tokens
  'gemini-pro'
);
console.log(`Estimated cost: $${cost.toFixed(6)}`);
```

### 9. **Usage Statistics Logging**
Log detailed API usage statistics.

```typescript
AIHelper.logUsageStats({
  operation: 'generateBrandName',
  inputTokens: 150,
  outputTokens: 200,
  duration: 2500,
  model: 'gemini-pro'
});
```

## Integration with GeminiService

The `GeminiService` now uses `AIHelper` for all API interactions:

```typescript
import { getGeminiService } from './services/GeminiService';

const gemini = getGeminiService();

// Automatically includes:
// - Retry logic with backoff
// - Rate limiting
// - Input sanitization
// - Response parsing
// - Usage statistics

const brandName = await gemini.generateBrandName({
  niche: 'eco-friendly products',
  style: 'modern'
});
```

## Error Handling

All methods include comprehensive error handling:

```typescript
try {
  const result = await gemini.generateBrandName({ niche: 'test' });
} catch (error) {
  // Error is formatted with helpful context
  console.error(error.message);
  // Falls back to safe default values
}
```

## Best Practices

1. **Always sanitize user input**
   ```typescript
   const clean = AIHelper.sanitizeInput(userInput);
   ```

2. **Use retry logic for transient errors**
   ```typescript
   await AIHelper.retryWithBackoff(apiCall, { maxRetries: 3 });
   ```

3. **Implement rate limiting for high-volume requests**
   ```typescript
   await AIHelper.handleRateLimit(apiKey, apiCall, 60);
   ```

4. **Parse responses safely**
   ```typescript
   const parsed = AIHelper.parseResponse(text, 'json');
   if (parsed.success) { /* use data */ }
   ```

5. **Use batch processing for multiple requests**
   ```typescript
   await AIHelper.batchExecute(prompts, processFunc, 5);
   ```

6. **Monitor costs with estimation**
   ```typescript
   const cost = AIHelper.estimateCost(inputTokens, outputTokens);
   ```

## Configuration Options

### RetryOptions
- `maxRetries`: Maximum retry attempts (default: 3)
- `initialDelay`: Initial delay in ms (default: 1000)
- `maxDelay`: Maximum delay in ms (default: 10000)
- `backoffFactor`: Exponential backoff multiplier (default: 2)
- `retryableErrors`: List of retryable error types

### PromptOptions
- `systemPrompt`: System-level instructions
- `temperature`: Creativity level (0-1)
- `maxTokens`: Maximum response length
- `stopSequences`: Stop generation sequences
- `context`: Additional context information

## Performance Metrics

The AIHelper automatically logs:
- Operation name
- Model used
- Input/output tokens
- Processing duration
- Estimated cost

Example output:
```
╔════════════════════════════════════════════════════════╗
║ AI API Usage Statistics                                ║
╠════════════════════════════════════════════════════════╣
║ Operation:     generateBrandName                       ║
║ Model:         gemini-pro                              ║
║ Duration:      2500ms                                  ║
║ Input Tokens:  150                                     ║
║ Output Tokens: 200                                     ║
║ Est. Cost:     $0.000088                               ║
╚════════════════════════════════════════════════════════╝
```

## Testing

Run the test file to verify functionality:

```bash
npm run build
node dist/test-gemini.js
```

## Troubleshooting

### Rate Limit Errors
If you encounter rate limit errors:
1. Check your API quota
2. Reduce `REQUESTS_PER_MINUTE` in GeminiService
3. Implement longer delays between batches

### Parsing Errors
If response parsing fails:
1. Check the expected format matches actual response
2. Use 'auto' format for automatic detection
3. Implement custom parsing logic if needed

### Network Errors
For network issues:
1. Increase `maxRetries` in retry options
2. Increase `initialDelay` for slower networks
3. Check API key validity

## Future Enhancements

Potential improvements:
- [ ] Advanced caching mechanisms
- [ ] Request queuing with priority
- [ ] Multi-model support
- [ ] Advanced token counting
- [ ] Cost budgeting and alerts
- [ ] Performance analytics dashboard

## License

Part of the Niche Empire Builder project.
