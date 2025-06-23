import { createOpenAI } from "@ai-sdk/openai";
import { streamText, CoreMessage } from "ai";
import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface CloudflareEnv {
  AI: Ai;
  OPENAI_API_KEY: string;
}

// Get environment variables for OpenNext on Cloudflare
function getCloudflareEnv(request: NextRequest): CloudflareEnv {
  const apiKey = process.env.OPENAI_API_KEY;
  let ai = null;

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment) {
    // Production: Use OpenNext.js getCloudflareContext
    try {
      const { env } = getCloudflareContext();
      ai = env.AI;

      if (ai) {
        console.log("AI binding successfully accessed via OpenNext context");
      }
    } catch (contextError) {
      console.warn(
        "OpenNext context not available in production:",
        contextError instanceof Error ? contextError.message : contextError
      );

      // Fallback methods for production
      try {
        // Method 1: Direct access from globalThis
        if ((globalThis as any).AI) {
          ai = (globalThis as any).AI;
          console.log("AI binding accessed via globalThis");
        }

        // Method 2: Check process.env (OpenNext injection)
        if (!ai && (process.env as any).AI) {
          ai = (process.env as any).AI;
          console.log("AI binding accessed via process.env");
        }

        // Method 3: Check request context
        if (!ai && (request as any).cf?.env?.AI) {
          ai = (request as any).cf.env.AI;
          console.log("AI binding accessed via request context");
        }
      } catch (fallbackError) {
        console.error("All AI binding access methods failed:", fallbackError);
      }
    }
  } else {
    // Development: Try OpenNext context with fallbacks
    try {
      const { env } = getCloudflareContext();
      ai = env.AI;
      if (ai) {
        console.log("AI binding accessed via OpenNext context in development");
      }
    } catch {
      console.log(
        "OpenNext context not available in development mode - this is expected"
      );

      // In development, we don't expect AutoRAG to work
      // but try fallback methods just in case
      if ((globalThis as any).AI) {
        ai = (globalThis as any).AI;
        console.log("AI binding accessed via globalThis in development");
      }
    }
  }

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not found in environment");
  }

  if (!ai) {
    if (isDevelopment) {
      console.log(
        "AI binding not available in development mode - this is expected"
      );
    } else {
      console.warn(
        "Cloudflare AI binding not available in production. Environment info:",
        {
          nodeEnv: process.env.NODE_ENV,
          hasCloudflareWorkers: process.env.CLOUDFLARE_WORKERS,
          isCloudflareRuntime:
            typeof (globalThis as any).caches !== "undefined",
        }
      );
    }
  }

  return {
    AI: ai,
    OPENAI_API_KEY: apiKey,
  };
}

export async function POST(request: NextRequest) {
  try {
    const requestBody: { messages?: CoreMessage[] } = await request.json();

    // Type guard for messages
    if (!requestBody || !Array.isArray(requestBody.messages)) {
      throw new Error("Invalid request: messages array is required");
    }

    const { messages } = requestBody;
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
        const autoragName =
          process.env.AUTORAG_NAME || "sanf-credit-analysis-v2";
        console.log(`Attempting AutoRAG search with instance: ${autoragName}`);
        console.log(`Query: ${userQuery.substring(0, 100)}...`);

        // Use the search method with proper parameters
        const searchResult = await env.AI.autorag(autoragName).search({
          query: userQuery,
          max_num_results: 5,
          ranking_options: {
            score_threshold: 0.3,
          },
          rewrite_query: true,
        });

        console.log("AutoRAG search completed:", {
          hasData: !!searchResult.data,
          resultsCount: searchResult.data?.length || 0,
          searchQuery: searchResult.search_query,
        });

        // Check if documents found
        if (searchResult.data && searchResult.data.length > 0) {
          // Join all document chunks into a single string
          chunks = searchResult.data
            .map((item) => {
              const data = item.content
                .map((content) => content.text)
                .join("\n\n");

              return `<file name="${item.filename}" score="${item.score}">${data}</file>`;
            })
            .join("\n\n");

          console.log(
            "Found relevant documents:",
            searchResult.data.map((item) => ({
              filename: item.filename,
              score: item.score,
            }))
          );
        } else {
          console.log("No relevant documents found for query");
        }
      } catch (autoragError) {
        const errorMessage =
          autoragError instanceof Error
            ? autoragError.message
            : "Unknown error";

        console.error("AutoRAG search failed:", {
          error: errorMessage,
          stack: autoragError instanceof Error ? autoragError.stack : undefined,
        });

        // Check for specific error types
        if (
          errorMessage.includes("not found") ||
          errorMessage.includes("does not exist") ||
          errorMessage.includes("autorag")
        ) {
          console.error(
            `AutoRAG instance '${
              process.env.AUTORAG_NAME || "sanf-credit-analysis-v2"
            }' not found in this Cloudflare account. Please ensure the AutoRAG is deployed in the same account as this Worker.`
          );
        }

        // Continue without AutoRAG if it fails
      }
    } else {
      const isDev = process.env.NODE_ENV === "development";
      console.log(
        isDev
          ? "AI binding not available in development mode - AutoRAG will be available in production"
          : "AI binding not available in production, skipping AutoRAG search"
      );
    }

    // Create the message array for the AI
    const aiMessages: CoreMessage[] = [
      {
        role: "system",
        content: env.AI
          ? "You are a helpful assistant analyzing credit applications. Answer questions based on the provided files in Indonesian language. Always include 'Sources: [filename1, filename2]' at the end of your response when using the provided documents."
          : "You are a helpful assistant analyzing credit applications. Answer questions in Indonesian language. Note: Document search is not available in this environment.",
      },
    ];

    // Add document context if available
    if (chunks) {
      aiMessages.push({
        role: "user",
        content: chunks,
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
