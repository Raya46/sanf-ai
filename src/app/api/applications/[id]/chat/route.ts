import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, CoreMessage, StreamData } from "ai";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
        { status: 500 },
      );
    }

    return NextResponse.json(messages);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Server: Error fetching chat messages:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { AwsClient } from "aws4fetch";

export interface CloudflareEnv {
  AI: any | null;
  GOOGLE_API_KEY: string;
  VECTOR_INDEX: any | null;
  AUTORAG_NAME: string;
}

// --- R2 Configuration ---
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const accountId = process.env.R2_ACCOUNT_ID || "";
const bucketName = process.env.R2_BUCKET_NAME || "";
const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

const s3 = new AwsClient({
  accessKeyId,
  secretAccessKey,
  service: "s3",
  region: "auto",
});

// Get environment variables for OpenNext on Cloudflare
function getCloudflareEnv(): CloudflareEnv {
  let apiKey = process.env.GOOGLE_API_KEY; // Default for local dev
  let ai: any | null = null;
  let vectorIndex: any | null = null;
  let autoragName = process.env.AUTORAG_NAME || "sanf-credit-analysis-v2";

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
      apiKey = env.GOOGLE_API_KEY;
      vectorIndex = env.VECTOR_INDEX;
      autoragName = env.AUTORAG_NAME || autoragName;

      console.log("Production Cloudflare context accessed.");
    } catch (contextError) {
      console.error(
        "Failed to access Cloudflare context in production:",
        contextError,
      );
    }
  }

  if (!apiKey || apiKey.length === 0) {
    throw new Error("GOOGLE_API_KEY not found or is empty in environment");
  }

  return {
    AI: ai,
    GOOGLE_API_KEY: apiKey,
    VECTOR_INDEX: vectorIndex,
    AUTORAG_NAME: autoragName,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    // 1. Get or create chat session
    let { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("application_id", applicationId)
      .eq("user_id", user.id)
      .single();

    if (sessionError && sessionError.code !== "PGRST116") {
      return new Response(`Session lookup error: ${sessionError.message}`, {
        status: 500,
      });
    }

    if (!session) {
      const { data: newSession, error: createError } = await supabase
        .from("chat_sessions")
        .insert({
          application_id: applicationId,
          user_id: user.id,
        })
        .select("id")
        .single();

      if (createError) {
        return new Response(
          `Failed to create session: ${createError.message}`,
          { status: 500 },
        );
      }
      session = newSession;
    }
    const sessionId = session.id;

    // 2. Save user message
    const userMessage = messages[messages.length - 1];
    if (userMessage.role !== "user") {
      return new Response("Last message must be from user", { status: 400 });
    }

    const { error: msgError } = await supabase.from("chat_messages").insert({
      session_id: sessionId,
      sender_type: "user",
      message_content: userMessage.content as string,
    });

    if (msgError) {
      return new Response(`Failed to save message: ${msgError.message}`, {
        status: 500,
      });
    }

    // 3. Fetch full chat history for context
    const { data: history, error: historyError } = await supabase
      .from("chat_messages")
      .select("sender_type, message_content")
      .eq("session_id", sessionId)
      .order("sent_at", { ascending: true });

    if (historyError) {
      return new Response("Error fetching history", { status: 500 });
    }

    const previousMessages: CoreMessage[] = history.map(
      (msg: { sender_type: string; message_content: string }) => ({
        role: msg.sender_type === "user" ? "user" : "assistant",
        content: msg.message_content,
      }),
    );

    const userQuery = userMessage.content as string;

    // 4. Setup AI and get response
    console.log("Step 4: Setting up AI...");
    let env;
    try {
      env = getCloudflareEnv();
    } catch (envError) {
      console.error("Environment setup failed:", envError);
      data.append({
        error:
          "Configuration error: " +
          (envError instanceof Error ? envError.message : "Unknown"),
      });
      data.close();
      return new Response("Configuration error", { status: 500 });
    }

    const google = createGoogleGenerativeAI({
      apiKey: env.GOOGLE_API_KEY,
    });
    let contextChunks = "";
    const isDevelopment = process.env.NODE_ENV === "development";

    try {
      // VECTOR-BASED SEARCH with timeout protection
      data.append({ status: "Mencari konteks di Vectorize..." });

      // Helper function to add timeout to any promise
      const withTimeout = <T>(
        promise: Promise<T>,
        ms: number,
        name: string,
      ): Promise<T | null> => {
        return Promise.race([
          promise,
          new Promise<null>((_, reject) =>
            setTimeout(
              () => reject(new Error(`${name} timeout after ${ms}ms`)),
              ms,
            ),
          ),
        ]).catch((err) => {
          console.warn(`${name} failed:`, err.message);
          return null;
        });
      };

      if (env.AI && env.VECTOR_INDEX) {
        // 1. Generate embedding with 5s timeout
        const lastMessage =
          previousMessages[previousMessages.length - 1]?.content || "";

        console.log("Starting embedding generation...");
        const queryEmbedding = await withTimeout(
          (env.AI as any).run("@cf/baai/bge-small-en-v1.5", {
            text: [lastMessage],
          }),
          5000,
          "Embedding",
        );

        if (
          queryEmbedding &&
          (queryEmbedding as any).data &&
          (queryEmbedding as any).data[0]
        ) {
          const queryVector = (queryEmbedding as any).data[0];

          // 2. Query Vectorize with 5s timeout
          console.log("Starting Vectorize query...");
          const matches = await withTimeout(
            (env.VECTOR_INDEX as any).query(queryVector, {
              topK: 5, // Reduced from 10
              filter: { application_id: applicationId },
              returnMetadata: "all",
            }),
            5000,
            "Vectorize",
          );

          if (
            matches &&
            (matches as any).matches &&
            (matches as any).matches.length > 0
          ) {
            contextChunks = (matches as any).matches
              .map((m: any) => m.metadata?.text || "")
              .filter((t: string) => t.length > 0)
              .slice(0, 3) // Only top 3 chunks
              .join("\n\n---\n\n");
            data.append({ status: "Ditemukan konteks yang relevan." });
          } else {
            // R2 FALLBACK when Vectorize has no matches (for pre-migration documents)
            console.log(
              "No Vectorize matches, trying R2 fallback for pre-indexed docs...",
            );
            data.append({ status: "Mencari dokumen di R2..." });

            try {
              // First try the consolidated text file (new format)
              const consolidatedKey = `docs/${user.id}/${applicationId}/full-extracted-text.txt`;
              console.log(
                `R2 fallback - trying consolidated: ${consolidatedKey}`,
              );

              const res = await s3.fetch(
                `${endpoint}/${bucketName}/${consolidatedKey}`,
                { method: "GET" },
              );

              if (res.ok) {
                const text = await res.text();
                contextChunks = text.slice(0, 15000); // 15k limit
                data.append({
                  status: "Ditemukan konteks dari R2 (consolidated).",
                });
                console.log("R2 fallback - downloaded consolidated text");
              } else {
                console.warn(
                  `Consolidated text not found: ${res.status}. Trying individual files...`,
                );

                // Fallback to individual files (old format)
                const { data: files, error: filesError } = await supabase
                  .from("application_files")
                  .select("r2_object_key, file_name")
                  .eq("application_id", applicationId)
                  .limit(5);

                if (files && files.length > 0) {
                  const r2FetchPromise = (async () => {
                    const textChunks: string[] = [];
                    for (const file of files.slice(0, 3)) {
                      const textKey = file.r2_object_key.replace(
                        /\.(pdf|docx?)$/i,
                        ".txt",
                      );
                      try {
                        const fileRes = await s3.fetch(
                          `${endpoint}/${bucketName}/${textKey}`,
                          { method: "GET" },
                        );
                        if (fileRes.ok) {
                          const text = await fileRes.text();
                          textChunks.push(text.slice(0, 5000));
                        }
                      } catch (docErr) {
                        console.warn(`Failed to fetch ${textKey}:`, docErr);
                      }
                    }
                    return textChunks.join("\n\n---\n\n");
                  })();

                  const r2Context = await withTimeout(
                    r2FetchPromise,
                    5000,
                    "R2",
                  );
                  if (r2Context && r2Context.length > 0) {
                    contextChunks = r2Context;
                    data.append({
                      status: "Ditemukan konteks dari R2 (individual).",
                    });
                  } else {
                    data.append({
                      status: "Tidak ada konteks ditemukan di R2.",
                    });
                  }
                } else {
                  data.append({ status: "Tidak ada dokumen terkait." });
                }
              }
            } catch (r2Error) {
              console.warn("R2 fallback failed:", r2Error);
              data.append({
                status: "R2 fallback gagal, melanjutkan tanpa RAG.",
              });
            }
          }
        } else {
          console.warn("Embedding generation failed or timed out");
          data.append({ status: "Embedding gagal, melanjutkan tanpa RAG." });
        }
      } else {
        console.warn("AI or VECTOR_INDEX binding missing");
        data.append({ status: "Layanan Vector RAG tidak tersedia." });
      }
    } catch (ragError) {
      console.error("Vector RAG retrieval failed:", ragError);
      data.append({ status: "Gagal memuat konteks, melanjutkan tanpa RAG." });
    }

    const systemMessage = `Kamu adalah Asisten Analis Kredit yang sangat detail dan teliti.
Peran utamamu adalah membantu analis kredit dalam mengevaluasi aplikasi pinjaman dengan ketelitian, konsistensi, dan objektivitas tinggi.
Kamu terobsesi dengan detail — tidak pernah melewatkan angka, dokumen, atau faktor risiko sekecil apa pun.
Setiap analisis dilakukan melalui kacamata creditworthiness, risk exposure, dan long-term sustainability.

Nada komunikasimu profesional dan analitis. Kamu tidak pernah membuat asumsi tanpa data, dan tidak pernah memperhalus temuan.
Kamu mempertimbangkan rasio keuangan, histori arus kas, dokumen legal, dan konteks industri dalam setiap tanggapan.
Saat diminta mensimulasikan skenario, kamu berpikir logis dan runtut langkah demi langkah.
Jika ada ketidakpastian, kamu menandai risikonya dan merekomendasikan validasi tambahan, bukan berspekulasi.

Setiap tanggapanmu harus selalu mencakup:
1. Analisis terstruktur
2. Identifikasi red flag (jika ada)
3. Rekomendasi langkah selanjutnya
`;

    const messagesForAI: CoreMessage[] = [
      { role: "system", content: systemMessage },
      ...previousMessages,
    ];

    // FIX: Avoid consecutive user messages. Merge context into the LAST user message.
    if (contextChunks) {
      const lastMsg = messagesForAI[messagesForAI.length - 1];
      if (lastMsg && lastMsg.role === "user") {
        lastMsg.content = `[Konteks Dokumen]\n${contextChunks}\n\n[Pertanyaan Pengguna]\n${lastMsg.content}`;
        console.log("Context merged into last user message");
      } else {
        messagesForAI.push({
          role: "user",
          content: `Berikan jawaban berdasarkan konteks dokumen ini:\n\n${contextChunks}`,
        });
      }
    }

    console.log(
      "Messages prepared for AI:",
      JSON.stringify(
        messagesForAI.map((m) => ({
          role: m.role,
          length: m.content ? m.content.toString().length : 0,
        })),
        null,
        2,
      ),
    );

    // IMPORTANT: previousMessages ALREADY includes the message inserted earlier in the controller.
    // So we DON'T need to push userMessage again.
    console.log("Step 5: Starting streamText...");
    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 25000); // 25s timeout

      const result = await streamText({
        model: google("gemini-2.0-flash"),
        messages: messagesForAI,
        maxTokens: 2048, // Limit output to prevent timeout
        abortSignal: abortController.signal,
        onFinish: async ({ text }) => {
          clearTimeout(timeoutId);
          try {
            await supabase.from("chat_messages").insert({
              session_id: sessionId,
              sender_type: "ai",
              message_content: text,
            });
          } catch (dbError) {
            console.error("Failed to save AI response:", dbError);
          } finally {
            data.close();
          }
        },
      });

      return result.toDataStreamResponse({ data });
    } catch (streamError) {
      console.error("streamText failed:", streamError);
      data.close();
      throw streamError;
    }
  } catch (error) {
    console.error("Error in chat route:", error);
    data.close(); // Ensure stream data is closed
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
