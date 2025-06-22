import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

interface UploadedFile {
  file_type: string;
  file_name: string;
  r2_object_key: string;
  file_size_bytes?: number;
}

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

export async function POST(request: Request) {
  const applicationData = await request.json();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: { message: "User not authenticated" } },
      { status: 401 }
    );
  }

  const { data: application, error: applicationError } = await supabase
    .from("credit_applications")
    .insert({
      user_id: user.id,
      status: applicationData.status,
      company_name: applicationData.company_name,
      application_type: applicationData.application_type,
      contact_person: applicationData.contact_person,
      contact_email: applicationData.contact_email,
    })
    .select()
    .single();

  if (applicationError) {
    console.error("Error creating application:", applicationError);
    return NextResponse.json({ error: applicationError }, { status: 500 });
  }

  const filesToInsert = applicationData.files.map((file: UploadedFile) => ({
    ...file,
    application_id: application.id,
  }));

  const { error: filesError } = await supabase
    .from("application_files")
    .insert(filesToInsert);

  if (filesError) {
    console.error("Error inserting files:", filesError);
    return NextResponse.json({ error: filesError }, { status: 500 });
  }

  revalidatePath("/application");
  return NextResponse.json({ success: true, applicationId: application.id });
}
