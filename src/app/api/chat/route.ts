import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const SYSTEM_PROMPT = `You are a helpful fitness and health assistant. Provide clear, specific, and relevant answers about exercise, nutrition, and wellness. Keep responses focused and coherent. If asked about medical advice, recommend consulting healthcare professionals.

Instructions: 
1. Give direct, clear answers
2. Stay on topic
3. Be specific and practical
4. Avoid unrelated tangents
5. Always provide coherent responses

User: {input}
Assistant:`;

type OperationFunction = () => Promise<any>;

async function retryOperation(operation: OperationFunction, maxRetries = 3, delay = 1000): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      console.log(`Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!req.body) {
      return NextResponse.json(
        { error: 'Request body is missing' },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('Processing message:', body.message);
    console.log('HF API Key present:', !!process.env.HUGGINGFACE_API_KEY);

    const prompt = SYSTEM_PROMPT.replace('{input}', body.message);

    try {
      const response = await retryOperation(async () => {
        return await hf.textGeneration({
          model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.2,
            timeout: 20000,
            return_full_text: false
          }
        });
      });

      if (!response || !response.generated_text) {
        throw new Error('Invalid response from Hugging Face API');
      }

      let cleanedText = response.generated_text.trim();
      
      if (cleanedText.includes('Assistant:')) {
        cleanedText = cleanedText.split('Assistant:').pop()?.trim() || cleanedText;
      }

      if (cleanedText.length < 10 || !cleanedText.includes(' ')) {
        throw new Error('Generated response is not coherent');
      }

      return NextResponse.json({ 
        message: cleanedText
      });

    } catch (hfError: any) {
      console.error('Hugging Face API error:', {
        error: hfError,
        message: hfError.message,
        details: hfError.response?.data
      });

      if (hfError.message.includes('Service Unavailable') || 
          hfError.message.includes('Generated response is not coherent')) {
        try {
          const fallbackResponse = await hf.textGeneration({
            model: 'facebook/opt-125m',
            inputs: prompt,
            parameters: {
              max_new_tokens: 100,
              temperature: 0.7,
              timeout: 10000,
              return_full_text: false
            }
          });

          if (fallbackResponse?.generated_text) {
            return NextResponse.json({ 
              message: fallbackResponse.generated_text.trim(),
              note: 'Using fallback model due to service issues'
            });
          }
        } catch (fallbackError: any) {
          console.error('Fallback model also failed:', fallbackError);
        }
      }

      let errorMessage = 'Hugging Face API error';
      if (hfError.message.includes('time out')) {
        errorMessage = 'The request timed out. Please try again.';
      } else if (hfError.message.includes('Service Unavailable')) {
        errorMessage = 'The service is temporarily unavailable. Please try again in a few moments.';
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          details: hfError.message
        },
        { status: 503 }
      );
    }

  } catch (error: any) {
    console.error('General error in chat endpoint:', {
      error,
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error.message
      },
      { status: 500 }
    );
  }
}