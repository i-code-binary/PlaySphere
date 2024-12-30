import { NextRequest } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Keep your system prompt
const SYSTEM_PROMPT = `You are a helpful fitness and health assistant. Provide clear, specific, and relevant answers about exercise, nutrition, and wellness. Keep responses focused and coherent. If asked about medical advice, recommend consulting healthcare professionals.

Instructions: 
1. Give direct, clear answers
2. Stay on topic
3. Be specific and practical
4. Avoid unrelated tangents
5. Always provide coherent responses`;

export const runtime = 'edge';

function buildPrompt(message: string): string {
  return `${SYSTEM_PROMPT}\n\nUser: ${message}\nAssistant:`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return new Response(
        JSON.stringify({
          error: 'REPLICATE_API_TOKEN is not configured',
          details: 'API token is required but not set in environment variables',
        }),
        { status: 401 }
      );
    }

    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required and must be a string' }),
        { status: 400 }
      );
    }

    const prompt = buildPrompt(message);

    const output = await replicate.run(
      "meta/llama-2-7b-chat:13c3cdee13ee059ab779f0291d29054dab00a47dad8261375654de5540165fb0",
      {
        input: {
          prompt,
          max_new_tokens: 150,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.2,
          system_prompt: SYSTEM_PROMPT
        }
      }
    );

    // Return the response
    return new Response(
      JSON.stringify({ message: output }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}