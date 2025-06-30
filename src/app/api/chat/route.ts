import { createOpenAI } from "@ai-sdk/openai";
import { streamText, CoreMessage } from "ai";
import { NextRequest } from "next/server";

export interface CloudflareEnv {
  AI: Ai;
  OPENAI_API_KEY: string;
}

// Get environment variables for OpenNext on Cloudflare
function getCloudflareEnv(request: NextRequest): CloudflareEnv {
  const apiKey = process.env.OPENAI_API_KEY;

  // Try multiple ways to access the AI binding in Cloudflare Workers
  let ai = null;

  // Method 1: Check if AI is available on globalThis
  if ((globalThis as any).AI) {
    ai = (globalThis as any).AI;
  }

  // Method 2: Check if AI is available on the request context
  if (!ai && (request as any).cf?.env?.AI) {
    ai = (request as any).cf.env.AI;
  }

  // Method 3: Check if AI is available on process.env (OpenNext specific)
  if (!ai && (process.env as any).AI) {
    ai = (process.env as any).AI;
  }

  // Method 4: Check if running in Cloudflare Workers environment
  if (!ai && typeof (globalThis as any).caches !== "undefined") {
    // We're in a Cloudflare Workers environment, AI should be injected
    ai = (globalThis as any).AI;
  }

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not found in environment");
  }

  if (!ai) {
    console.warn(
      "Cloudflare AI binding not available - this may be expected in development"
    );
    // For development or when AI binding is not available, we'll continue without AutoRAG
  }

  return {
    AI: ai,
    OPENAI_API_KEY: apiKey,
  };
}

export async function POST(request: NextRequest) {
  try {
    const requestBody: {
      messages?: CoreMessage[];
      data?: { macroData?: any };
    } = await request.json();

    // Type guard for messages
    if (!requestBody || !Array.isArray(requestBody.messages)) {
      throw new Error("Invalid request: messages array is required");
    }

    const { messages, data } = requestBody;
    const { macroData } = data || {};
    const lastMessage = messages[messages.length - 1];

    // Ensure the last message is a user message
    if (lastMessage.role !== "user") {
      throw new Error("Last message must be from user");
    }

    const userQuery =
      typeof lastMessage.content === "string"
        ? lastMessage.content
        : lastMessage.content
            .map((part) =>
              part.type === "text" ? part.text : "[non-text content]"
            )
            .join(" ");

    // Get environment
    const env = getCloudflareEnv(request);

    // Create OpenAI provider with OpenRouter base URL
    const openai = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.OPENAI_API_KEY,
    });

    let chunks = "";

    // Only try AutoRAG if AI binding is available
    if (env.AI) {
      try {
        // Search for documents in AutoRAG
        const searchResult = await env.AI.autorag("credit-documents").search({
          query: userQuery,
        });

        // Check if documents found
        if (searchResult.data && searchResult.data.length > 0) {
          // Join all document chunks into a single string
          chunks = searchResult.data
            .map((item) => {
              const data = item.content
                .map((content) => {
                  return content.text;
                })
                .join("\n\n");

              return `<file name="${item.filename}">${data}`;
            })
            .join("\n\n");

          // Extract source filenames for display
          // sources = searchResult.data.map((item) => item.filename);
        }
      } catch (autoragError) {
        console.error("AutoRAG search failed:", autoragError);
        // Continue without AutoRAG if it fails
      }
    }

    // Create a context string from the macro data if it exists
    let macroContext = "";
    if (macroData) {
      macroContext = `Here is the current macroeconomic data context: ${JSON.stringify(
        macroData
      )}. Use this data to answer any questions related to it.`;
    }

    // Create the message array for the AI
    const aiMessages: CoreMessage[] = [
      {
        role: "system",
        content: env.AI
          ? `You are a helpful assistant analyzing credit applications. Answer questions based on the provided files in Indonesian language. If the user asks about macroeconomic data, use the provided context. Always include 'Sources: [filename1, filename2]' at the end of your response when using the provided documents.`
          : `You are a helpful assistant analyzing credit applications. Answer questions in Indonesian language. If the user asks about macroeconomic data, use the provided context. Note: Document search is not available in this environment.`,
      },
    ];

    // Add document context if available
    if (chunks) {
      aiMessages.push({
        role: "user",
        content: chunks,
      });
    }

    // Add macro data context if available
    if (macroContext) {
      aiMessages.push({
        role: "user",
        content: macroContext,
      });
    }

    // Add conversation history and current query
    aiMessages.push(
      ...messages.slice(0, -1), // Previous conversation history
      {
        role: "user",
        content: userQuery,
      }
    );

    // Generate streaming response with OpenRouter
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: aiMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
