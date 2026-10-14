import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static export for Firebase Hosting
  images: {
    unoptimized: true, // Required for static export
  },
  // Response headers live in firebase.json (hosting.headers);
  // Next's headers() is ignored with output: "export".
};

export default nextConfig;
