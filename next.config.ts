import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {},
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/.playwright-mcp/**"],
      };
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: "/ponuda",
        destination: "/aranzmani",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
