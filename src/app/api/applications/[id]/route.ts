import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("credit_applications")
    .select(
      `
      *,
      application_files (
        id, file_name
      )
    `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ai_analysis } = (await request.json()) as { ai_analysis: string };

  if (!ai_analysis) {
    return NextResponse.json(
      { error: "Missing ai_analysis content" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("credit_applications")
    .update({ ai_analysis })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating AI analysis:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // First, delete associated chat sessions
  const { error: chatError } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("application_id", id);

  if (chatError) {
    console.error("Error deleting chat sessions:", chatError);
    return NextResponse.json({ error: chatError.message }, { status: 500 });
  }

  // Then, delete associated files from application_files table
  const { error: filesError } = await supabase
    .from("application_files")
    .delete()
    .eq("application_id", id);

  if (filesError) {
    console.error("Error deleting application files:", filesError);
    return NextResponse.json({ error: filesError.message }, { status: 500 });
  }

  // Finally, delete the application itself
  const { error: appError } = await supabase
    .from("credit_applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (appError) {
    console.error("Error deleting application:", appError);
    return NextResponse.json({ error: appError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
