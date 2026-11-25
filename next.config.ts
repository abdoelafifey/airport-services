import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the site is front-end only (mock backend), so it ships as plain files.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
