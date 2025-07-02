import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: applicationId } = await params;

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("application_id", applicationId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json([]);
    }

    const { data: messages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("id, sender_type, message_content")
      .eq("session_id", session.id)
      .order("sent_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching chat messages:", messagesError);
      return NextResponse.json(
        { error: messagesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(messages);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Server: Error fetching chat messages:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
