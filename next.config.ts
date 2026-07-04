import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "xn--ok0bx09c.kr" }],
        destination: "https://chungi.kr/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "천기.kr" }],
        destination: "https://chungi.kr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
