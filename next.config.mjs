/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  eslint: {
    // Prototype: don't let lint warnings block production builds/deploys.
    // TypeScript type-checking still runs and WILL fail the build on real
    // type errors. Re-enable lint gating for production hardening.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
