// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       // Prevents "Module not found: Can't resolve 'canvas'"
//       config.resolve.alias.canvas = false;
//       // Prevents errors with other optional Node-only deps
//       config.resolve.alias.encoding = false;
//     }
//     return config;
//   },
//   /* config options here */
// };

// export default nextConfig;


// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // config.externals = [...(config.externals || []), { 'pdfjs-dist': 'pdfjsLib' }];
    config.resolve.alias.canvas = false;
    return config;
  },
};
export default nextConfig;
