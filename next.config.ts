// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other Next.js configurations ...

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;