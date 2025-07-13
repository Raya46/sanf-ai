import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, CoreMessage, StreamData } from "ai";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: applicationId } = await params;

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("application_id", applicationId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json([]);
    }

    const { data: messages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("id, sender_type, message_content")
      .eq("session_id", session.id)
      .order("sent_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching chat messages:", messagesError);
      return NextResponse.json(
        { error: messagesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(messages);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Server: Error fetching chat messages:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export interface CloudflareEnv {
  AI: Ai | null;
  OPENAI_API_KEY: string;
}

// Get environment variables for OpenNext on Cloudflare
function getCloudflareEnv(): CloudflareEnv {
  let apiKey = process.env.OPENAI_API_KEY; // Default for local dev
  let ai: Ai | null = null;

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
      console.log("Development mode: AI binding not available (expected)");
      console.log("AutoRAG will work when deployed to Cloudflare Workers");
    } else {
      console.error("Production: Cloudflare AI binding not available");
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
    console.log("AI binding successfully found and ready for AutoRAG");
  }

  return {
    AI: ai,
    OPENAI_API_KEY: apiKey,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const data = new StreamData();

  try {
    const { messages }: { messages: CoreMessage[] } = await request.json();

    const { id: applicationId } = await params;

    if (!applicationId) {
      return new Response("Missing applicationId", { status: 400 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 1. Get chat session
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("application_id", applicationId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      console.error("Chat session not found:", sessionError);
      return new Response("Chat session not found", { status: 404 });
    }
    const sessionId = session.id;

    // 2. Save user message
    const userMessage = messages[messages.length - 1];
    if (userMessage.role !== "user") {
      return new Response("Last message must be from user", { status: 400 });
    }

    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      sender_type: "user",
      message_content: userMessage.content as string,
    });

    // 3. Fetch full chat history for context
    const { data: history, error: historyError } = await supabase
      .from("chat_messages")
      .select("sender_type, message_content")
      .eq("session_id", sessionId)
      .order("sent_at", { ascending: true });

    if (historyError) {
      console.error("Error fetching chat history:", historyError);
      return new Response("Error fetching history", { status: 500 });
    }

    const previousMessages: CoreMessage[] = history.map(
      (msg: { sender_type: string; message_content: string }) => ({
        role: msg.sender_type === "user" ? "user" : "assistant",
        content: msg.message_content,
      })
    );

    const userQuery = userMessage.content as string;

    // 4. Setup AI and get response
    const env = getCloudflareEnv();
    const openai = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.OPENAI_API_KEY,
    });

    let contextChunks = "";
    if (env.AI) {
      try {
        data.append({ status: "Searching documents..." });
        const autoragName =
          process.env.AUTORAG_NAME || "sanf-credit-analysis-v2";
        const searchResult = await env.AI.autorag(autoragName).search({
          query: userQuery,
          max_num_results: 5,
        });

        if (searchResult.data && searchResult.data.length > 0) {
          contextChunks = searchResult.data
            .map((item) => {
              const content = item.content.map((c) => c.text).join("\n\n");
              return `<file name="${item.filename}">${content}</file>`;
            })
            .join("\n\n");
          data.append({
            status: `Found ${searchResult.data.length} documents.`,
          });
        } else {
          data.append({ status: "No relevant documents found." });
        }
      } catch (autoragError) {
        console.error("AutoRAG operation failed:", autoragError);
        data.append({ status: "Document search failed." });
      }
    }

    const systemMessage = `Kamu adalah Asisten Analis Kredit yang sangat detail dan teliti.
Peran utamamu adalah membantu analis kredit dalam mengevaluasi aplikasi pinjaman dengan ketelitian, konsistensi, dan objektivitas tinggi.
Kamu terobsesi dengan detail — tidak pernah melewatkan angka, dokumen, atau faktor risiko sekecil apa pun.
Setiap analisis dilakukan melalui kacamata creditworthiness, risk exposure, dan long-term sustainability.

Nada komunikasimu profesional dan analitis. Kamu tidak pernah membuat asumsi tanpa data, dan tidak pernah memperhalus temuan.
Kamu mempertimbangkan rasio keuangan, histori arus kas, dokumen legal, dan konteks industri dalam setiap tanggapan.
Saat diminta mensimulasikan skenario, kamu berpikir logis dan runtut langkah demi langkah.
Jika ada ketidakpastian, kamu menandai risikonya dan merekomendasikan validasi tambahan, bukan berspekulasi.

Memori selama sesi meliputi:

Semua dokumen yang diunggah atau dirujuk

Rasio keuangan, detail invoice, ketentuan pelunasan, dan anomali

Konteks bisnis dari pemohon

Setiap tanggapanmu harus selalu mencakup:

Analisis terstruktur (ringkasan poin-poin atau bullet jika diperlukan)

Identifikasi jelas terhadap red flag, jika ada

Dampak jangka panjang jika pengajuan disetujui

Rekomendasi validasi tambahan jika data lemah atau belum jelas

Contoh Perilaku Penggunaan:
Pengguna: “Bagaimana pendapatmu mengenai DSCR dan kemampuan pembayaran jangka panjang pemohon ini?”
Asisten AI:
“DSCR saat ini berada di angka 1,08 — hanya sedikit di atas ambang minimum 1,0. Secara teknis memenuhi syarat, tetapi buffer kas sangat tipis.

Kewajiban bulanan hampir setara dengan volatilitas pendapatan selama 6 bulan terakhir.

Terdapat invoice tertunda dari klien terbesar mereka pada bulan April.
Rekomendasi: Minta konfirmasi jadwal pembayaran sebelum menyetujui. Terdapat risiko guncangan pembayaran dalam 6 bulan jika arus kas menurun.”

`;

    const messagesForAI: CoreMessage[] = [
      { role: "system", content: systemMessage },
      ...previousMessages,
    ];

    if (contextChunks) {
      messagesForAI.push({
        role: "user",
        content: `Here is some context from relevant documents:\n${contextChunks}`,
      });
    }
    messagesForAI.push(userMessage);

    data.append({ status: "Generating response..." });

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: messagesForAI,
      async onFinish(completion) {
        await supabase.from("chat_messages").insert({
          session_id: sessionId,
          sender_type: "ai",
          message_content: completion.text,
        });

        data.append({ status: "completed" });
        data.close();
      },
    });

    const stream = result.toDataStream();

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(errorMessage, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204, // No Content
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
