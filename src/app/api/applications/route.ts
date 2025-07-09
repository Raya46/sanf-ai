import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
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

// --- AI Analysis Schema ---
const analysisSchema = z.object({
  ai_analysis_status: z
    .string()
    .describe(
      "The status of the AI analysis (e.g., 'Completed', 'Failed', 'Requires_Manual_Review')."
    ),
  ai_analysis: z
    .string()
    .describe(
      "The full AI analysis report generated based on the documents and user context."
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
  company_type: z
    .string()
    .describe(
      "A string to make type for company example:(Heavy Equipment, Trucking, Productive, New Business "
    ),
  amount: z.number().describe("An amount from company to analyze credit"),
  analysis_template: z.string(),
});

export interface CloudflareEnv {
  AI: any;
  OPENAI_API_KEY: string;
}

function getCloudflareEnv(): CloudflareEnv {
  try {
    const { env } = getCloudflareContext() as { env: any };

    console.log(
      "Successfully accessed Cloudflare context. Assuming production environment."
    );

    const apiKey = env.OPENAI_API_KEY;
    const ai = env.AI;

    if (!apiKey) {
      console.error(
        "CRITICAL: Cloudflare context found, but OPENAI_API_KEY secret is MISSING."
      );
      throw new Error(
        "OPENAI_API_KEY secret not found in Cloudflare environment."
      );
    }

    console.log(
      `Found OPENAI_API_KEY in Cloudflare secrets. Preview: ${apiKey.substring(0, 5)}...${apiKey.slice(-4)}`
    );
    return { AI: ai, OPENAI_API_KEY: apiKey };
  } catch (e) {
    console.log(
      `Could not get Cloudflare context. Assuming local development environment.${e}`
    );

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error(
        "❌ CRITICAL: Running locally, but OPENAI_API_KEY is MISSING from .env file."
      );
      throw new Error(
        "OPENAI_API_KEY not found in process.env for local development."
      );
    }

    console.log(
      `✅ Found OPENAI_API_KEY in local .env file. Preview: ${apiKey.substring(0, 5)}...${apiKey.slice(-4)}`
    );
    return { AI: null, OPENAI_API_KEY: apiKey };
  }
}

// --- GET Function ---
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

// --- POST Function (Multimodal AI Analysis) ---
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
    const analysis_template = formData.get("analysis_template") as string;
    const risk_appetite = parseInt(formData.get("risk_appetite") as string);
    const company_type = formData.get("company_type") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded." },
        { status: 400 }
      );
    }

    const uploadedFilesData = [];
    const aiContent: (
      | { type: "text"; text: string }
      | { type: "image"; image: Buffer }
    )[] = [
      {
        type: "text",
        text: `You are an expert credit analyst AI. Analyze the provided financial documents (sent as image/file objects) for a loan application.
         The user has selected the "${analysis_template}" template, has a risk appetite of ${risk_appetite}%, the company type is "${company_type}", and the requested amount is ${amount}.
         Your tasks are:
         1. Generate a comprehensive creditworthiness analysis report in **pure HTML format**. This report must start with a concise summary (2-3 sentences) of the credit application, highlighting key findings like approval probability and risk indicator. Use appropriate HTML tags for headings (<h1>, <h2>), paragraphs (<p>), bold text (<b> or <strong>), italic text (<i> or <em>), and lists (<ul>, <ol>, <li>). Ensure proper line breaks and spacing using HTML tags like <br> or by structuring content within block-level elements. **Do NOT use Markdown syntax (e.g., **bold**, *italic*, - list item**) in the output.** The entire report should be a single, well-formed HTML string, suitable for direct display or export.
         2. Provide a general creditworthiness analysis (approval probability, risk, document validity).
         3. Extract detailed monthly revenue data from the documents. Go back as far as possible, up to 36 months. The result must be an array of objects, each containing 'year', 'month' (1-12), and 'revenue'. If a month's data is not available, do not include it in the array.
         Analyze the following document(s):`,
      },
    ];

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

      aiContent.push({ type: "image", image: buffer });
    }

    const env = getCloudflareEnv();
    const openai = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.OPENAI_API_KEY,
    });

    const { object: analysisResult } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: analysisSchema,
      prompt: `${aiContent}`,
    });

    const { data: application, error: applicationError } = await supabase
      .from("credit_applications")
      .insert({
        user_id: user.id,
        status: "completed",
        analysis_template,
        risk_appetite,
        company_type,
        amount,
        ai_analysis_status: analysisResult.ai_analysis_status,
        probability_approval: analysisResult.probability_approval,
        overall_indicator: analysisResult.overall_indicator,
        document_validation_percentage:
          analysisResult.document_validation_percentage,
        estimated_analysis_time_minutes:
          analysisResult.estimated_analysis_time_minutes,
        revenue: analysisResult.revenue_analysis,
        ai_analysis: analysisResult.ai_analysis,
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

    const filesToInsert = uploadedFilesData.map((file) => ({
      ...file,
      application_id: application.id,
    }));
    await supabase.from("application_files").insert(filesToInsert);

    const { data: session } = await supabase
      .from("chat_sessions")
      .insert({ application_id: application.id, user_id: user.id })
      .select()
      .single();

    if (session) {
      // Insert the full AI analysis as the first message in the chat session
      await supabase.from("chat_messages").insert({
        session_id: session.id,
        sender_type: "ai",
        message_content: analysisResult.ai_analysis,
      });
    }

    revalidatePath(`/dashboard/${user.id}/application`);
    revalidatePath(`/dashboard/${user.id}/new-application/${application.id}`);
    return NextResponse.json({ success: true, applicationId: application.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Server: Error processing application:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
