import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
