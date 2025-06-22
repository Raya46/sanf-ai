import { AwsClient } from "aws4fetch";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const key = formData.get("key") as string | null;
    const original_filename = formData.get("original_filename") as
      | string
      | null;
    const user_id = formData.get("user_id") as string | null;
    const user_email = formData.get("user_email") as string | null;

    if (!file || !key) {
      return NextResponse.json(
        { error: "File or key not provided." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const url = `${endpoint}/${bucketName}/${key}`;

    const headers: Record<string, string> = {
      "Content-Type": file.type,
      "Content-Length": buffer.length.toString(),
    };

    if (original_filename)
      headers["x-amz-meta-original-filename"] = original_filename;
    if (user_id) headers["x-amz-meta-user-id"] = user_id;
    if (user_email) headers["x-amz-meta-user-email"] = user_email;

    const res = await s3.fetch(url, {
      method: "PUT",
      headers: headers,
      body: buffer,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`S3 upload failed: ${res.status} ${res.statusText}`, {
        errorText,
      });
      throw new Error(`S3 upload failed: ${res.status} ${res.statusText}`);
    }

    const publicUrl = `${endpoint}/${bucketName}/${key}`;

    return NextResponse.json({ success: true, url: publicUrl, key: key });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Server: Error uploading file:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
