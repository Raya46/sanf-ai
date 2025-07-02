import { NextResponse } from "next/server";
import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

// --- Configuration ---
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_KEY;

if (!FIRECRAWL_API_KEY) {
  throw new Error("FIRECRAWL_KEY environment variable is not set.");
}

const firecrawl = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

// --- Caching ---
let cachedData: any = null;
let lastFetchTime: number = 0;
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// --- Zod Schema for LLM Extraction (as requested by user) ---
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
    })
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

    // The schema already creates the { energy_prices: [...] } structure
    const responseData = commoditiesData;

    cachedData = responseData;
    lastFetchTime = now;

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in macroeconomics API route:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Failed to fetch macroeconomic data: ${message}` },
      { status: 500 }
    );
  }
}

// --- Helper Functions ---
async function scrapeCommodities() {
  console.log("Scraping commodities...");
  const scrapeResult = await firecrawl.scrapeUrl(
    "https://tradingeconomics.com/commodities",
    {
      formats: ["json"],
      jsonOptions: {
        schema: EnergyPricesSchema,
        prompt:
          "Extract the data from the commodities table. The top-level key should be 'energy_prices'. The keys for each object in the array should be exactly 'Commodity', 'Unit', 'Price', 'Day', and '%'.",
      },
    }
  );

  if (scrapeResult.success && scrapeResult.json?.energy_prices) {
    return scrapeResult.json;
  }
  throw new Error(
    "Failed to extract commodities data with the specified format."
  );
}
