import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next/image は外部URLの画像をセキュリティのためデフォルトでブロックしているため、追記が必要。
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "images.microcms-assets.io" },
      { protocol: "https", hostname: "picsum.photos" },
      {
        protocol: "https",
        hostname: "ogpbzgwgoqhmtcctkwtb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
