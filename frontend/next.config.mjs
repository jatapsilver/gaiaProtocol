/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizeCss: false, // 🚫 Desactiva LightningCSS (soluciona el error en Vercel)
  },
};

module.exports = nextConfig;
