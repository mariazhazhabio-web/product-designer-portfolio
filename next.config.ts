import type { NextConfig } from "next";

// Static export: the whole portfolio (including the SportSync demo) runs without a server,
// so it can be hosted free on Vercel, Netlify, Cloudflare Pages or GitHub Pages.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

export default nextConfig;
