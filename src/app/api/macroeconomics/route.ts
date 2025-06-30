import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET() {
  try {
    // Construct the path to the JSON file
    const jsonPath = path.resolve(process.cwd(), "src/data/macro-data.json");

    // Read the file content
    const fileContent = await fs.readFile(jsonPath, "utf8");

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to read or parse macro-data.json:", error);
    return NextResponse.json(
      { message: "Failed to fetch macroeconomic data", error },
      { status: 500 }
    );
  }
}
