import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { count: totalProcessed, error: submittedError } = await supabase
    .from("credit_applications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "submitted");

  const { count: totalApproved, error: approvedError } = await supabase
    .from("credit_applications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "approved");

  const { data: approvalData, error: avgError } = await supabase
    .from("credit_applications")
    .select("probability_approval")
    .eq("user_id", user.id)
    .not("probability_approval", "is", null);

  if (submittedError || approvedError || avgError) {
    const error = submittedError || approvedError || avgError;
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }

  const averageRiskScore =
    approvalData && approvalData.length > 0
      ? (
          approvalData.reduce(
            (acc, curr) => acc + curr.probability_approval,
            0
          ) / approvalData.length
        ).toFixed(1)
      : 0;

  return NextResponse.json({
    totalProcessed: totalProcessed ?? 0,
    totalApproved: totalApproved ?? 0,
    averageRiskScore: Number(averageRiskScore),
  });
}
