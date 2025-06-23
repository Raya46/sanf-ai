import { createOpenAI } from "@ai-sdk/openai";
import { streamText, CoreMessage, createDataStreamResponse } from "ai";
import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface CloudflareEnv {
  AI: Ai | null;
  OPENAI_API_KEY: string;
}

// Get environment variables for OpenNext on Cloudflare
function getCloudflareEnv(): CloudflareEnv {
  let apiKey = process.env.OPENAI_API_KEY; // Default for local dev
  let ai = null;

  // Check if we're in development or production
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  console.log("Environment detection:", {
    nodeEnv: process.env.NODE_ENV,
    isDevelopment,
    isProduction,
    hasCloudflareWorkers: process.env.CLOUDFLARE_WORKERS === "true",
  });

  if (!isDevelopment) {
    // Production: Use OpenNext.js getCloudflareContext
    try {
      const { env } = getCloudflareContext() as { env: any };
      ai = env.AI;
      // In production on Cloudflare, secrets are on the 'env' object, not process.env.
      // This requires you to set the secret via `npx wrangler secret put OPENAI_API_KEY`.
      apiKey = env.OPENAI_API_KEY;

      console.log("Production Cloudflare context accessed.");

      if (ai) {
        console.log(
          "AI binding successfully accessed via OpenNext context in production"
        );
      }
    } catch (contextError) {
      console.error("Failed to access Cloudflare context in production:", {
        error:
          contextError instanceof Error ? contextError.message : contextError,
        stack: contextError instanceof Error ? contextError.stack : undefined,
      });

      // Fallback methods for production
      if ((globalThis as any).AI) {
        ai = (globalThis as any).AI;
        console.log("AI binding accessed via globalThis fallback");
      }
    }
  } else {
    // Development: Read from process.env (from .env file)
    console.log("Development mode detected - OpenNext context not available");
    console.log("In development, AutoRAG functionality will be skipped");
    console.log("Deploy to Cloudflare Workers to test AutoRAG integration");

    // Don't try to access getCloudflareContext in development
    // as it will always fail without proper Cloudflare Workers environment
  }

  console.log(
    `API Key loaded: ${apiKey ? `sk-...${apiKey.slice(-4)}` : "Not found"}`
  );

  if (!apiKey || apiKey.length === 0) {
    throw new Error("OPENAI_API_KEY not found or is empty in environment");
  }

  if (!ai) {
    if (isDevelopment) {
      console.log("🔄 Development mode: AI binding not available (expected)");
      console.log("AutoRAG will work when deployed to Cloudflare Workers");
    } else {
      console.error("❌ Production: Cloudflare AI binding not available");
      console.error("This indicates an issue with:");
      console.error("1. Verify AI binding is configured in wrangler.jsonc");
      console.error(
        "2. Ensure deployed to Cloudflare Workers with proper bindings"
      );
      console.error(
        "3. Verify AutoRAG is in the same Cloudflare account as the Worker"
      );
    }
  } else {
    console.log("✅ AI binding successfully found and ready for AutoRAG");
  }

  return {
    AI: ai,
    OPENAI_API_KEY: apiKey,
  };
}

export async function POST(request: NextRequest) {
  return createDataStreamResponse({
    async execute(dataStream) {
      try {
        const requestBody: { messages?: CoreMessage[] } = await request.json();

        if (!requestBody || !Array.isArray(requestBody.messages)) {
          throw new Error("Invalid request: messages array is required");
        }

        const { messages } = requestBody;
        const lastMessage = messages[messages.length - 1];

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

        const env = getCloudflareEnv();
        const openai = createOpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: env.OPENAI_API_KEY, // Use the standard apiKey property
          headers: {
            // OpenRouter recommends these headers for identification.
            "HTTP-Referer": "https://sanf.ai", // TODO: Replace with your actual site URL
            "X-Title": "SANF AI Credit Analysis", // TODO: Replace with your app name
          },
        });

        let chunks = "";
        if (env.AI) {
          try {
            dataStream.writeData({ status: "Searching documents..." });
            const autoragName =
              process.env.AUTORAG_NAME || "sanf-credit-analysis-v2";
            const searchResult = await env.AI.autorag(autoragName).search({
              query: userQuery,
              max_num_results: 5,
            });

            if (searchResult.data && searchResult.data.length > 0) {
              chunks = searchResult.data
                .map((item) => {
                  const data = item.content
                    .map((content) => content.text)
                    .join("\n\n");
                  return `<file name="${item.filename}">${data}</file>`;
                })
                .join("\n\n");
              dataStream.writeData({
                status: `Found ${searchResult.data.length} documents.`,
              });
            } else {
              dataStream.writeData({ status: "No documents found." });
            }
          } catch (autoragError) {
            console.error("AutoRAG operation failed:", autoragError);
            dataStream.writeData({ status: "Document search failed." });
          }
        }

        const systemMessage = {
          role: "system" as const,
          content: env.AI
            ? "You are a helpful assistant analyzing credit applications. Answer questions based on the provided files in Indonesian language. Always include 'Sources: [filename1, filename2]' at the end of your response when using the provided documents."
            : "You are a helpful assistant analyzing credit applications. Answer questions in Indonesian language. Note: Document search is not available in this environment.",
        };

        const aiMessages: CoreMessage[] = [systemMessage];
        if (chunks) {
          aiMessages.push({ role: "user", content: chunks });
        }
        aiMessages.push(...messages.slice(0, -1), {
          role: "user",
          content: userQuery,
        });

        dataStream.writeData({ status: "Generating response..." });
        const result = streamText({
          model: openai("gpt-4o-mini"),
          messages: aiMessages,
          temperature: 0.7,
          maxTokens: 1000,
          onFinish() {
            dataStream.writeData({ status: "completed" });
          },
        });

        result.mergeIntoDataStream(dataStream);
      } catch (error) {
        console.error("Error in stream execution:", error);
        throw error; // Throw error to be caught by onError
      }
    },
    onError: (error) => {
      console.error("Stream error:", error);
      // Provide a more specific error message to the client
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("No auth credentials"))
      ) {
        return "Authentication error. Please verify the API key is set correctly as a Cloudflare secret.";
      }
      return error instanceof Error
        ? error.message
        : "An unknown error occurred";
    },
  });
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204, // No Content
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
