import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { AwsClient } from "aws4fetch";
import { z } from "zod";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// --- R2 Configuration ---
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const accountId = process.env.R2_ACCOUNT_ID || "";
const bucketName = process.env.R2_BUCKET_NAME || "";
const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

if (!accessKeyId || !secretAccessKey || !accountId || !bucketName) {
  console.error("R2 configuration missing in environment variables");
}

const s3 = new AwsClient({
  accessKeyId,
  secretAccessKey,
  service: "s3",
  region: "auto",
});

// --- AI Analysis Schema and Helpers ---
const analysisSchema = z.object({
  ai_analysis_status: z
    .string()
    .describe(
      "The status of the AI analysis (e.g., 'Completed', 'Failed', 'Requires_Manual_Review')."
    ),
  probability_approval: z
    .number()
    .min(0)
    .max(100)
    .describe("The probability of loan approval as a percentage (0-100)."),
  overall_indicator: z
    .string()
    .describe(
      "An overall risk indicator (e.g., 'LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK')."
    ),
  document_validation_percentage: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A percentage score for document validity and completeness (0-100)."
    ),
  estimated_analysis_time_minutes: z
    .number()
    .describe(
      "Estimated time in minutes for a human to perform a similar analysis."
    ),
  revenue_analysis: z
    .array(
      z.object({
        year: z
          .number()
          .describe("The year for the revenue data point, e.g., 2023."),
        month: z
          .number()
          .min(1)
          .max(12)
          .describe("The month number (1-12) for the revenue data point."),
        revenue: z
          .number()
          .describe(
            "The calculated revenue for that month. Can be positive or negative."
          ),
      })
    )
    .max(36)
    .describe(
      "An array of calculated monthly revenue data for up to the last 36 months based on financial documents. Extract as much monthly data as is available."
    ),
});

export interface CloudflareEnv {
  AI: Ai | null;
  OPENAI_API_KEY: string;
}

function getCloudflareEnv(): CloudflareEnv {
  let apiKey = process.env.OPENAI_API_KEY;
  let ai: Ai | null = null;
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment) {
    try {
      const { env } = getCloudflareContext() as { env: any };
      ai = env.AI;
      apiKey = env.OPENAI_API_KEY;
    } catch (e) {
      console.log(e);
    }
  }

  if (!apiKey) throw new Error("OPENAI_API_KEY not found in environment");
  return { AI: ai, OPENAI_API_KEY: apiKey };
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  console.warn(
    `Truncating combined document text from ${text.length} to ${maxLength} characters.`
  );
  return text.slice(0, maxLength);
}

async function extractTextFromFile(file: File): Promise<string> {
  console.warn(
    "Using placeholder for text extraction. This only supports plain text."
  );
  return file.text();
}

// Existing GET function remains unchanged
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("credit_applications")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// --- NEW UNIFIED POST FUNCTION ---
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const company_name = formData.get("company_name") as string;
    const application_type = formData.get("application_type") as string;
    const contact_person = formData.get("contact_person") as string;
    const contact_email = formData.get("contact_email") as string;
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded." },
        { status: 400 }
      );
    }

    let allDocumentText = "";
    const uploadedFilesData = [];

    // Process all files: Upload to R2 and extract text
    for (const file of files) {
      const r2Key = `docs/${user.id}/${uuidv4()}-${file.name}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      await s3.fetch(`${endpoint}/${bucketName}/${r2Key}`, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "Content-Length": buffer.length.toString(),
        },
        body: buffer,
      });

      uploadedFilesData.push({
        file_name: file.name,
        r2_object_key: r2Key,
        file_size_bytes: file.size,
        file_type: "document",
      });

      const text = await extractTextFromFile(file);
      allDocumentText += text + "\n\n---\n\n";
    }

    // Run combined AI analysis
    const env = getCloudflareEnv();
    const openai = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.OPENAI_API_KEY,
    });

    const documentText = truncateText(allDocumentText, 100000);
    const { object: analysisResult } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: analysisSchema,
      prompt: `You are an expert credit analyst AI. Analyze the provided financial documents for a loan application.

      Your tasks are:
      1.  Provide a general creditworthiness analysis (approval probability, risk, document validity).
      2.  Extract detailed monthly revenue data from the documents. Go back as far as possible, up to 36 months. The result must be an array of objects, each containing 'year', 'month' (1-12), and 'revenue'. If a month's data is not available, do not include it in the array.

      Combined Documents Content:
      ${documentText}`,
    });

    // --- Database Operations ---
    // 1. Insert application with AI results
    const { data: application, error: applicationError } = await supabase
      .from("credit_applications")
      .insert({
        user_id: user.id,
        status: "completed",
        company_name,
        application_type,
        contact_person,
        contact_email,
        ai_analysis_status: analysisResult.ai_analysis_status,
        probability_approval: analysisResult.probability_approval,
        overall_indicator: analysisResult.overall_indicator,
        document_validation_percentage:
          analysisResult.document_validation_percentage,
        estimated_analysis_time_minutes:
          analysisResult.estimated_analysis_time_minutes,
        revenue: analysisResult.revenue_analysis,
      })
      .select()
      .single();

    if (applicationError) {
      console.error("Error creating application:", applicationError);
      return NextResponse.json(
        { error: applicationError.message },
        { status: 500 }
      );
    }

    // 2. Insert file records
    const filesToInsert = uploadedFilesData.map((file) => ({
      ...file,
      application_id: application.id,
    }));
    const { error: filesError } = await supabase
      .from("application_files")
      .insert(filesToInsert);

    if (filesError) {
      console.error("Error inserting files:", filesError);
      // TODO: Consider rolling back the application creation
      return NextResponse.json({ error: filesError.message }, { status: 500 });
    }

    // 3. Create a chat session
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .insert({
        application_id: application.id,
        user_id: user.id,
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Error creating chat session:", sessionError);
      return NextResponse.json(
        { error: sessionError.message },
        { status: 500 }
      );
    }

    // 4. Generate and insert initial summary message from AI
    const fileNames = files.map((f) => f.name).join(", ");
    const { text: summary } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `You are a credit analyst assistant. Based on the following documents, provide a concise opening summary (2-3 sentences) of the credit application. Mention the key entities or highlights. Documents Content: ${documentText}`,
      system: `At the end of your summary, list the documents you used. Format it exactly like this: "Sumber: [filename1, filename2, ...]" using the following file names: ${fileNames}`,
    });

    const { error: messageError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: session.id,
        sender_type: "ai",
        message_content: summary,
      });

    if (messageError) {
      console.error("Error inserting initial AI message:", messageError);
      return NextResponse.json(
        { error: messageError.message },
        { status: 500 }
      );
    }

    revalidatePath("/application");
    revalidatePath(`/dashboard/[projectId]/new-application/${application.id}`);
    return NextResponse.json({ success: true, applicationId: application.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Server: Error processing application:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
