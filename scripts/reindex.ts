/**
 * Manual Re-indexing Script for Vectorize
 * Run with: npx wrangler dev scripts/reindex.ts --remote
 * Then access: http://localhost:8787/?applicationId=YOUR_APP_ID
 */

export interface Env {
  AI: any;
  VECTOR_INDEX: any;
  R2: R2Bucket;
}

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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const applicationId = url.searchParams.get("applicationId");

    if (!applicationId) {
      return new Response(
        JSON.stringify({ error: "Missing applicationId query parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    try {
      console.log(`Starting re-indexing for application: ${applicationId}`);

      // 1. List all objects in R2 for this application
      const prefix = `docs/`;
      const listResult = await env.R2.list({ prefix });

      // Find text files for this application
      const textFiles = listResult.objects.filter(
        (obj) => obj.key.includes(applicationId) && obj.key.endsWith(".txt"),
      );

      console.log(`Found ${textFiles.length} text files for application`);

      if (textFiles.length === 0) {
        return new Response(
          JSON.stringify({
            error: "No text files found for this application in R2",
            searchPrefix: prefix,
            applicationId,
          }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }

      // 2. Download and combine all text
      let allText = "";
      for (const file of textFiles) {
        const object = await env.R2.get(file.key);
        if (object) {
          const text = await object.text();
          allText += `\n\n--- ${file.key} ---\n\n${text}`;
          console.log(`Downloaded: ${file.key} (${text.length} chars)`);
        }
      }

      if (!allText.trim()) {
        return new Response(
          JSON.stringify({ error: "Downloaded files are empty" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      // 3. Chunk the text
      const chunks = chunkText(allText, 1500).slice(0, 100); // Limit to 100 chunks
      console.log(`Created ${chunks.length} chunks for indexing`);

      // 4. Generate embeddings and upsert to Vectorize
      const batchSize = 10;
      let totalVectors = 0;

      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);

        // Generate embeddings
        const { data: embeddings } = await env.AI.run(
          "@cf/baai/bge-small-en-v1.5",
          { text: batch },
        );

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
        await env.VECTOR_INDEX.upsert(vectors);
        totalVectors += vectors.length;
        console.log(
          `Upserted batch ${Math.floor(i / batchSize) + 1}: ${vectors.length} vectors`,
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          applicationId,
          filesProcessed: textFiles.length,
          chunksCreated: chunks.length,
          vectorsIndexed: totalVectors,
          message: `Successfully indexed ${totalVectors} vectors for application ${applicationId}`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      console.error("Re-indexing failed:", error);
      return new Response(
        JSON.stringify({
          error: "Re-indexing failed",
          details: error instanceof Error ? error.message : String(error),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
};
