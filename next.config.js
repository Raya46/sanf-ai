/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'edge',
  },
  // Ensure static exports work with Cloudflare Pages
  trailingSlash: true,
  // Optimize for edge runtime
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
