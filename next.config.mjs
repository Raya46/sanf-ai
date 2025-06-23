import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Only initialize in development
if (process.env.NODE_ENV === 'development') {
  try {
    initOpenNextCloudflareForDev();
    console.log("OpenNext Cloudflare dev initialized");
  } catch (error) {
    console.warn("Failed to initialize OpenNext Cloudflare for dev:", error);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental edge runtime for better compatibility
};

export default nextConfig;
