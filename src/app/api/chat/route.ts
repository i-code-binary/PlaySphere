import { NextRequest } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Keep your system prompt
const SYSTEM_PROMPT = `You are a helpful fitness and health assistant. Provide clear, specific, and relevant answers about exercise, nutrition, and wellness. Keep responses focused and coherent. If asked about medical advice, recommend consulting healthcare professionals.

Instructions: 
1. Give direct, clear answers
2. Stay on topic
3. Be specific and practical
4. Avoid unrelated tangents
5. Always provide coherent responses
6. Answer in less than 100 words.`;

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "GROQ_API_KEY is not configured",
          details: "API key is required but not set in environment variables",
        }),
        { status: 401 }
      );
    }

    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required and must be a string" }),
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-8b-8192", // Fast and reliable model
      max_tokens: 150,
      temperature: 0.7,
      top_p: 0.95,
    });

    const responseMessage =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    // Return the response
    return new Response(JSON.stringify({ message: responseMessage }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat message",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
