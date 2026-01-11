import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function listModels() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || '';

  if (!apiKey) {
    console.error('API key not found');
    return;
  }

  console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
  console.log('\nFetching available models...\n');

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // List available models
    const models = await genAI.listModels();

    console.log('Available models:');
    console.log('='.repeat(60));

    for await (const model of models) {
      console.log(`Model: ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
      console.log('---');
    }
  } catch (error: any) {
    console.error('Error listing models:', error.message);
    console.error('Full error:', error);
  }
}

listModels();
