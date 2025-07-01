import { NextResponse } from "next/server";
import data from "@/data/macro-data.json";

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in macroeconomics API route:", error);
    return NextResponse.json(
      { message: "Failed to fetch macroeconomic data" },
      { status: 500 }
    );
  }
}
