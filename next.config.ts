import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next/image は外部URLの画像をセキュリティのためデフォルトでブロックしているため、追記が必要。
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
      },
      { protocol: "https", hostname: "images.microcms-assets.io" },
    ],
  },
};

export default nextConfig;
