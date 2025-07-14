import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// PERBAIKAN: Interface diubah untuk menerima pdfDataUrl
interface EmailRequestBody {
  to: string;
  subject: string;
  text: string;
  pdfDataUrl: string; // Menerima base64 data URL
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, text, pdfDataUrl } = body as EmailRequestBody;

    // Validasi
    if (!to || !subject || !text || !pdfDataUrl) {
      console.log(pdfDataUrl);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST || "smtp.gmail.com",
      port: parseInt(process.env.NODEMAILER_PORT || "587"),
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // PERBAIKAN: Menggunakan pdfDataUrl langsung sebagai lampiran
    await transporter.sendMail({
      from: `Credit Analyst AI Agent <${process.env.GMAIL_USERNAME}>`,
      to,
      subject,
      text,
      attachments: [
        {
          filename: "credit-approval-recommendation.pdf",
          path: pdfDataUrl, // Nodemailer bisa menangani data URL secara langsung
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
