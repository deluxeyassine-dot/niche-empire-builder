import * as dotenv from 'dotenv';
dotenv.config();

console.log('Environment check:');
console.log('='.repeat(60));
console.log('API Key exists:', !!process.env.GOOGLE_GEMINI_API_KEY);
console.log('API Key length:', process.env.GOOGLE_GEMINI_API_KEY?.length || 0);
console.log('API Key prefix:', process.env.GOOGLE_GEMINI_API_KEY?.substring(0, 10) + '...');
console.log('API Key format looks correct:', process.env.GOOGLE_GEMINI_API_KEY?.startsWith('AIza') || false);
