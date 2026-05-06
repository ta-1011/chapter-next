import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next/image は外部URLの画像をセキュリティのためデフォルトでブロックしている。
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp", // ← 許可するドメインを追加
      },
    ],
  },
};

export default nextConfig;
