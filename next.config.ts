import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xb2hfdigjsaryaxv.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
