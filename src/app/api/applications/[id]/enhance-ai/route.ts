import { createOpenAI } from "@ai-sdk/openai";
import { streamText, CoreMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createClient } from "@/utils/supabase/server";

export interface CloudflareEnv {
  AI: any;
  OPENAI_API_KEY: string;
}

// Reusing getCloudflareEnv from chat route for consistency
function getCloudflareEnv(): CloudflareEnv {
  let apiKey = process.env.OPENAI_API_KEY;
  let ai: any = null;

  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment) {
    try {
      const { env } = getCloudflareContext() as { env: any };
      ai = env.AI;
      apiKey = env.OPENAI_API_KEY;
    } catch (contextError) {
      console.error(
        "Failed to access Cloudflare context in production:",
        contextError
      );
      if ((globalThis as any).AI) {
        ai = (globalThis as any).AI;
      }
    }
  }

  if (!apiKey || apiKey.length === 0) {
    throw new Error("OPENAI_API_KEY not found or is empty in environment");
  }

  return { AI: ai, OPENAI_API_KEY: apiKey };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: applicationId } = await params;
  const supabase = await createClient();

  try {
    const {
      currentContent,
      userPrompt,
    }: { currentContent: string; userPrompt: string } = await request.json();

    if (!applicationId) {
      return new Response("Missing applicationId", { status: 400 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const env = getCloudflareEnv();
    const openai = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.OPENAI_API_KEY,
    });

    // Fetch application data to get company_type and amount
    const { data: application, error: appError } = await supabase
      .from("credit_applications")
      .select("company_type, amount")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      console.error(
        "Error fetching application data for enhancement:",
        appError
      );
      return new Response("Application data not found", { status: 404 });
    }

    const { company_type, amount } = application;

    const messagesForAI: CoreMessage[] = [
      {
        role: "system",
        content: `You are an AI assistant tasked with summarizing a credit analysis report. The current report content is provided. The company type is "${company_type}" and the requested amount is ${amount}. Enhance the report based on the user's prompt. Only output the enhanced report content in **pure HTML format**. Ensure proper line breaks and spacing using HTML tags like <br> or by structuring content within block-level elements. Do NOT use Markdown syntax (e.g., **bold**, *italic*, - list item) in the output.`,
      },
      {
        role: "assistant",
        content: currentContent, // Current content from the editor as context
      },
      {
        role: "user",
        content: userPrompt, // User's enhancement prompt
      },
    ];

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: messagesForAI,
    });

    const stream = result.toDataStream();

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error in AI enhancement route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(errorMessage, { status: 500 });
  }
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
