import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    AWS_PUBLIC_IP:"http://3.110.188.254"
  },
  async headers() {
    return [
      {
        source: "/api/(.*)",
        // Headers
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.ALLOWED_ORIGIN!,
          },
          // Allows for specific methods accepted
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          // Allows for specific headers accepted (These are a few standard ones)
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },  

};

export default nextConfig;
