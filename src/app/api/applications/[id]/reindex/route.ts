import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { AwsClient } from "aws4fetch";

export interface CloudflareEnv {
  AI: any;
  VECTOR_INDEX: any;
}

// --- R2 Configuration ---
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const accountId = process.env.R2_ACCOUNT_ID || "";
const bucketName = process.env.R2_BUCKET_NAME || "sanf";
const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

const s3 = new AwsClient({
  accessKeyId,
  secretAccessKey,
  service: "s3",
  region: "auto",
});

function chunkText(text: string, chunkSize: number = 1500): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id: applicationId } = await params;

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`Starting re-indexing for application: ${applicationId}`);

    // 1. Get files from database
    const { data: files, error: filesError } = await supabase
      .from("application_files")
      .select("r2_object_key, file_name")
      .eq("application_id", applicationId);

    if (filesError) {
      return NextResponse.json(
        { error: "Failed to fetch files", details: filesError.message },
        { status: 500 },
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files found for this application" },
        { status: 404 },
      );
    }

    console.log(`Found ${files.length} files in database`);

    // 2. Download text from R2
    // Text is saved at: docs/{userId}/{applicationId}/full-extracted-text.txt
    let allText = "";
    const processedFiles: string[] = [];

    // First try the consolidated text file
    const consolidatedKey = `docs/${user.id}/${applicationId}/full-extracted-text.txt`;
    const consolidatedUrl = `${endpoint}/${bucketName}/${consolidatedKey}`;
    console.log(`Trying consolidated text at: ${consolidatedKey}`);

    try {
      const res = await s3.fetch(consolidatedUrl, { method: "GET" });
      if (res.ok) {
        allText = await res.text();
        processedFiles.push("full-extracted-text.txt");
        console.log(`Downloaded consolidated text: ${allText.length} chars`);
      } else {
        console.warn(`Consolidated text not found: ${res.status}`);

        // Fallback: try individual .txt files based on r2_object_key
        for (const file of files) {
          const textKey = file.r2_object_key.replace(/\.(pdf|docx?)$/i, ".txt");
          const url = `${endpoint}/${bucketName}/${textKey}`;

          try {
            const fileRes = await s3.fetch(url, { method: "GET" });
            if (fileRes.ok) {
              const text = await fileRes.text();
              allText += `\n\n--- ${file.file_name} ---\n\n${text}`;
              processedFiles.push(file.file_name);
              console.log(`Downloaded: ${textKey} (${text.length} chars)`);
            } else {
              console.warn(`Failed to fetch ${textKey}: ${fileRes.status}`);
            }
          } catch (fetchError) {
            console.error(`Error fetching ${textKey}:`, fetchError);
          }
        }
      }
    } catch (fetchError) {
      console.error(`Error fetching consolidated text:`, fetchError);
    }

    if (!allText.trim()) {
      return NextResponse.json(
        {
          error: "No text content found in R2",
          filesChecked: files.length,
          triedPath: consolidatedKey,
          userId: user.id,
          applicationId,
        },
        { status: 404 },
      );
    }

    console.log(`Total text length: ${allText.length} chars`);

    // 3. Get Cloudflare context for AI and Vectorize
    let ai: any;
    let vectorize: any;

    try {
      const ctx = await getCloudflareContext();
      const env = ctx.env as unknown as CloudflareEnv;
      ai = env.AI;
      vectorize = env.VECTOR_INDEX;
    } catch (ctxError) {
      return NextResponse.json(
        {
          error: "Cloudflare context not available (only works in production)",
          details:
            ctxError instanceof Error ? ctxError.message : String(ctxError),
        },
        { status: 500 },
      );
    }

    if (!ai || !vectorize) {
      return NextResponse.json(
        { error: "AI or VECTOR_INDEX binding not available" },
        { status: 500 },
      );
    }

    // 4. Chunk the text
    const chunks = chunkText(allText, 1500).slice(0, 100); // Limit to 100 chunks
    console.log(`Created ${chunks.length} chunks for indexing`);

    // 5. Generate embeddings and upsert to Vectorize
    const batchSize = 10;
    let totalVectors = 0;

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);

      // Generate embeddings
      const { data: embeddings } = await ai.run("@cf/baai/bge-small-en-v1.5", {
        text: batch,
      });

      // Create vectors with metadata
      const vectors = embeddings.map((values: number[], idx: number) => ({
        id: crypto.randomUUID(),
        values,
        metadata: {
          application_id: applicationId,
          text: batch[idx],
        },
      }));

      // Upsert to Vectorize
      await vectorize.upsert(vectors);
      totalVectors += vectors.length;
      console.log(
        `Upserted batch ${Math.floor(i / batchSize) + 1}: ${vectors.length} vectors`,
      );
    }

    console.log(`Re-indexing completed: ${totalVectors} vectors indexed`);

    return NextResponse.json({
      success: true,
      applicationId,
      filesProcessed: processedFiles,
      chunksCreated: chunks.length,
      vectorsIndexed: totalVectors,
      message: `Successfully indexed ${totalVectors} vectors for application ${applicationId}`,
    });
  } catch (error) {
    console.error("Re-indexing failed:", error);
    return NextResponse.json(
      {
        error: "Re-indexing failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
