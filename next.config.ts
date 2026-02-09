import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Only initialize in development and ensure it's called early
if (process.env.NODE_ENV === "development") {
  try {
    initOpenNextCloudflareForDev();
    console.log("OpenNext Cloudflare dev initialized successfully");
  } catch (error) {
    console.warn("Failed to initialize OpenNext Cloudflare for dev:", error);
  }
}

const nextConfig: NextConfig = {
  // Optimize for Cloudflare
  output: "standalone",
  compress: true,
  // Ensure static exports work with Cloudflare Pages
  trailingSlash: true,
  // Optimize for edge runtime
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
