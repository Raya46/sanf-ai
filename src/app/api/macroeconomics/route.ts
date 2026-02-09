import { NextResponse } from "next/server";
import { z } from "zod";

// --- Configuration ---
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_KEY;

// --- Caching ---
let cachedData: any = null;
let lastFetchTime: number = 0;
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// --- Zod Schema for LLM Extraction ---
const EnergyPricesSchema = z.object({
  energy_prices: z.array(
    z.object({
      Commodity: z
        .string()
        .describe("The name of the commodity, e.g., 'Crude Oil'"),
      Unit: z.string().describe("The unit of measurement, e.g., 'USD/Bbl'"),
      Price: z.string().describe("The current price of the commodity"),
      Day: z.string().describe("The change in value for the day"),
      "%": z.string().describe("The percentage change for the day"),
    }),
  ),
});

// --- Main GET Function ---
export async function GET() {
  const now = Date.now();
  if (cachedData && now - lastFetchTime < CACHE_DURATION_MS) {
    return NextResponse.json(cachedData);
  }

  try {
    const commoditiesData = await scrapeCommodities();
    cachedData = commoditiesData;
    lastFetchTime = now;
    return NextResponse.json(commoditiesData);
  } catch (error) {
    console.error("Error in macroeconomics API route:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Failed to fetch macroeconomic data: ${message}` },
      { status: 500 },
    );
  }
}

// --- Helper Functions ---
async function scrapeCommodities() {
  console.log("Scraping commodities using direct fetch...");

  if (!FIRECRAWL_API_KEY) {
    throw new Error("FIRECRAWL_KEY environment variable is not set.");
  }

  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url: "https://tradingeconomics.com/commodities",
      formats: ["json"],
      jsonOptions: {
        schema: EnergyPricesSchema,
        prompt:
          "Extract the data from the commodities table. The top-level key should be 'energy_prices'. The keys for each object in the array should be exactly 'Commodity', 'Unit', 'Price', 'Day', and '%'.",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firecrawl API error: ${response.status} ${errorText}`);
  }

  const result = (await response.json()) as {
    success: boolean;
    data?: { json?: { energy_prices: any[] } };
  };

  if (result.success && result.data?.json?.energy_prices) {
    return result.data.json;
  }

  throw new Error(
    "Failed to extract commodities data with the specified format.",
  );
}
