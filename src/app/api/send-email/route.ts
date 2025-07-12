import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";

interface EmailRequestBody {
  to: string;
  subject: string;
  text: string;
  pdfPath: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, text, pdfPath } = body as EmailRequestBody;

    // Validate required fields
    if (!to || !subject || !text || !pdfPath) {
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

    // Read the PDF file
    const publicDir = path.join(process.cwd(), "public");
    const filePath = path.join(publicDir, pdfPath);
    const pdfContent = await fs.readFile(filePath);

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      attachments: [
        {
          filename: "credit-analysis-report.pdf",
          content: pdfContent,
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
