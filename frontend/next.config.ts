import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker builds
  output: "standalone",

  // API proxy removed - now handled by API routes

  // Development configuration to handle Three.js + React DevTools conflicts
  webpack: (config, { dev }) => {
    if (dev) {
      // Suppress React DevTools version warnings in development with Three.js
      config.resolve.alias = {
        ...config.resolve.alias,
        // Prevent React DevTools from interfering with Three.js
        "react-devtools-core": false,
      };
    }
    return config;
  },
};
export default nextConfig;
