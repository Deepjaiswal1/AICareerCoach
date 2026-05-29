/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  /* config options here */
  serverExternalPackages: ['pdf-parse'],
  // reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me"
      }
    ]
  }
};

export default nextConfig;
