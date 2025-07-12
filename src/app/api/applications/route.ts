import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { AwsClient } from "aws4fetch";
import { z } from "zod";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import nodemailer from "nodemailer";
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

const CandlestickDataSchema = z.object({
  period: z
    .string()
    .describe("The time period for the data point, e.g., 'Jan 2025'."),
  startValue: z.number().describe("The starting value for the period."),
  maxValue: z.number().describe("The highest value reached during the period."),
  minValue: z.number().describe("The lowest value reached during the period."),
  endValue: z.number().describe("The ending value for the period."),
});

const analysisSchema = z.object({
  ai_analysis_status: z
    .string()
    .describe("The status of the AI analysis (e.g., 'Completed', 'Failed')."),
  ai_analysis: z
    .string()
    .describe("Laporan analisis AI lengkap dari Dokumen yang diunggah"),
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
  revenue: z
    .array(
      z.object({
        year: z.number().describe("The year for the revenue data point."),
        month: z.number().min(1).max(12).describe("The month number (1-12)."),
        revenue: z.number().describe("The calculated revenue for that month."),
      })
    )
    .max(36)
    .describe("An array of monthly revenue data for up to the last 36 months."),

  operating_expenses: z
    .number()
    .describe("The total operating expenses from the financial statements."),
  gross_profit: z
    .number()
    .describe("The gross profit from the financial statements."),
  ebitda: z.number().describe("The EBITDA from the financial statements."),
  analysis_value: z
    .array(CandlestickDataSchema)
    .describe(
      "An array of data points formatted for a candlestick chart, based on monthly revenue fluctuations."
    ),
});

// --- Fungsi Helper & GET (Tidak berubah) ---
export interface CloudflareEnv {
  AI: any;
  OPENAI_API_KEY: string;
}
function getCloudflareEnv(): CloudflareEnv {
  try {
    const { env } = getCloudflareContext() as { env: any };
    console.log(
      "✅ Successfully accessed Cloudflare context. Assuming production environment."
    );
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error(
        "❌ CRITICAL: Cloudflare context found, but OPENAI_API_KEY secret is MISSING."
      );
      throw new Error(
        "OPENAI_API_KEY secret not found in Cloudflare environment."
      );
    }
    return { AI: env.AI, OPENAI_API_KEY: apiKey };
  } catch (e) {
    console.log(
      "Could not get Cloudflare context. Assuming local development environment."
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
    return { AI: null, OPENAI_API_KEY: apiKey };
  }
}
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase
    .from("credit_applications")
    .select("*")
    .eq("user_id", user.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// --- Fungsi POST Utama (Logika Baru) ---
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();

    // LANGKAH 1: Ambil semua data dari form
    const analysis_template = formData.get("analysis_template") as string;
    const company_type = formData.get("company_type") as string;
    const company_address = formData.get("company_address") as string;
    const year_established = formData.get("year_established") as string;
    const company_name = formData.get("company_name") as string;
    const contact_person = formData.get("company_phone") as string;
    const contact_email = formData.get("contact_email") as string;
    const risk_parameters = formData.get("risk_parameters") as string;
    const ai_context = formData.get("ai_context") as string;
    const amountSubmission = formData.get("amount") as string;
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded." },
        { status: 400 }
      );
    }

    // LANGKAH 2: Buat catatan aplikasi awal di database dengan status 'pending'
    console.log("Step 1: Creating initial application record...");
    const { data: application, error: initialInsertError } = await supabase
      .from("credit_applications")
      .insert({
        user_id: user.id,
        status: "pending_analysis",
        analysis_template,
        company_type,
        amount: parseInt(amountSubmission),
        company_name,
        contact_person,
        contact_email,
        risk_parameter: JSON.parse(risk_parameters), // Use user-provided risk_parameters
      })
      .select("id")
      .single();

    await supabase.from("chat_sessions").insert({
      application_id: application?.id,
      user_id: user.id,
    });

    if (initialInsertError) {
      console.error("Error creating initial application:", initialInsertError);
      return NextResponse.json(
        { error: initialInsertError.message },
        { status: 500 }
      );
    }
    console.log(`Initial record created with ID: ${application.id}`);

    // LANGKAH 3: Upload file ke R2 dan siapkan prompt AI
    console.log("Step 2: Uploading files and preparing AI context...");
    const uploadedFilesData = [];
    let allExtractedText = "";

    const analysisPrompt = `You are a world-class credit analyst AI.
    
    **IMPORTANT RULE 1: LANGUAGE:** Your entire response, including the HTML report and all text, MUST be in Indonesian (Bahasa Indonesia).
    
    **IMPORTANT RULE 2: NUMBER PARSING:** The financial documents use Indonesian currency format (IDR/Rp). When you encounter numbers formatted like 'Rp 45.280.500.000', you MUST interpret this as the number 45280500000. The period (.) is a thousands separator and must be removed for calculation. The 'Rp' prefix must be ignored. All financial values in your final JSON output must be in this full numerical format.

    Analyze the following text, which has been extracted from various financial documents, to generate a credit report.
    - Company Data: ( company name: ${company_name}, company type: ${company_type}, company address: ${company_address}, company year established: ${year_established})
    - Template: ${analysis_template}
    - Amount: ${amountSubmission}
    - Additional User Context: ${ai_context || "None"}

    **Your Tasks:**
    1.  Generate a comprehensive analysis report in **pure HTML format** and in **Indonesian**.
    2.  Based on the monthly revenue data, generate a series of candlestick data points for the 'analysis_value' field.
    
    **Full Text Content from All Documents:**
    ${allExtractedText}`;

    for (const file of files) {
      console.log(` - Processing ${file.name}...`);

      // Upload file asli ke R2 (tetap dilakukan)
      const buffer = Buffer.from(await file.arrayBuffer());
      const r2Key = `docs/${user.id}/${application.id}/${uuidv4()}-${file.name}`;
      await s3.fetch(`${endpoint}/${bucketName}/${r2Key}`, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "Content-Length": buffer.length.toString(),
        },
        body: buffer,
      });
      uploadedFilesData.push({
        application_id: application.id,
        file_name: file.name,
        r2_object_key: r2Key,
        file_size_bytes: file.size,
        file_type: "document",
      });

      // PERUBAHAN UTAMA: Panggil server Express untuk ekstraksi teks
      if (file.type === "application/pdf") {
        try {
          const extractionFormData = new FormData();
          extractionFormData.append("pdfFile", file);

          const extractionResponse = await fetch(
            "https://pdf-processing-dusky.vercel.app/",
            {
              method: "POST",
              body: extractionFormData,
            }
          );

          if (!extractionResponse.ok) {
            throw new Error(
              `Extraction server failed with status ${extractionResponse.status}`
            );
          }

          const extractionResult = await extractionResponse.json();
          if (
            extractionResult &&
            typeof extractionResult === "object" &&
            "text" in extractionResult &&
            typeof extractionResult.text === "string"
          ) {
            allExtractedText += `\n\n--- Start of Document: ${file.name} ---\n\n${extractionResult.text}\n\n--- End of Document: ${file.name} ---\n\n`;
          } else {
            allExtractedText += `\n\n--- FAILED TO EXTRACT TEXT FROM: ${file.name} ---\n\n`;
          }
        } catch (extractionError) {
          console.error(
            `Failed to extract text from ${file.name}:`,
            extractionError
          );
          // Lanjutkan proses meskipun satu file gagal diekstrak
          allExtractedText += `\n\n--- FAILED TO EXTRACT TEXT FROM: ${file.name} ---\n\n`;
        }
      }
    }

    await supabase.from("application_files").insert(uploadedFilesData);

    console.log("Step 3: Starting AI analysis...");
    const env = getCloudflareEnv();
    const openai = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.OPENAI_API_KEY,
    });

    const { object: analysisResult } = await generateObject({
      model: openai("gpt-4o"),
      schema: analysisSchema,
      prompt: analysisPrompt,
    });

    // Tentukan overall_indicator berdasarkan probability_approval
    let overall_indicator: "LOW_RISK" | "HIGH_RISK" = "HIGH_RISK";
    if (
      typeof analysisResult.probability_approval === "number" &&
      analysisResult.probability_approval >= 50
    ) {
      overall_indicator = "LOW_RISK";
    }

    console.log("Step 4: AI analysis completed. Updating database record...");
    const { error: updateError } = await supabase
      .from("credit_applications")
      .update({
        status: "completed", // Ubah status menjadi 'completed'
        ai_analysis_status: analysisResult.ai_analysis_status,
        probability_approval: analysisResult.probability_approval,
        overall_indicator,
        document_validation_percentage:
          analysisResult.document_validation_percentage,
        estimated_analysis_time_minutes:
          analysisResult.estimated_analysis_time_minutes,
        revenue: analysisResult.revenue,
        ai_analysis: analysisResult.ai_analysis,
        operating_expenses: analysisResult.operating_expenses,
        gross_profit: analysisResult.gross_profit,
        ebitda: analysisResult.ebitda,
        analysis_value: analysisResult.analysis_value,
      })
      .eq("id", application.id);

    if (contact_email) {
      console.log("Step 5: Sending analysis result email...");
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.NODEMAILER_HOST || "smtp.gmail.com",
          port: parseInt(process.env.NODEMAILER_PORT || "587"),
          auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
          },
        });

        console.log(contact_email);

        await transporter.sendMail({
          from: `\"Sanf AI Credit\" <${process.env.GMAIL_USERNAME}>`,
          to: contact_email,
          subject: `Hasil Analisis Kredit untuk ${company_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Hasil Analisis Kredit Anda Telah Selesai</h2>
                <p>Halo <b>${contact_person || "Bapak/Ibu"}</b>,</p>
                <p>Analisis kredit untuk perusahaan <b>${company_name}</b> telah berhasil diselesaikan oleh sistem AI kami. Berikut adalah ringkasannya:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background-color: #f2f2f2;">
                        <td style="padding: 8px; border: 1px solid #ddd;"><b>Probabilitas Persetujuan</b></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${analysisResult.probability_approval}%</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><b>Indikator Risiko</b></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${analysisResult.overall_indicator}</td>
                    </tr>
                </table>
                <h3>Ringkasan Laporan Analisis:</h3>
                <div style="border: 1px solid #eee; padding: 15px; background-color: #fafafa; border-radius: 5px;">
                  ${analysisResult.ai_analysis}
                </div>
                <p>Anda dapat melihat laporan lengkap dan berinteraksi dengan data melalui dashboard aplikasi kami.</p>
                <p>Salam hangat,<br/>Tim Sanf AI</p>
            </div>
          `,
        });
        console.log("Analysis email sent successfully.");
      } catch (err) {
        console.error("Gagal mengirim email hasil analisis:", err);
      }
    }

    if (updateError) {
      console.error("Error updating application with AI results:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    revalidatePath(`/dashboard`);
    return NextResponse.json({ success: true, applicationId: application.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Server: Unhandled error in POST function:", message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
