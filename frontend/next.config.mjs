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
    optimizeCss: false, // 🚫 desactiva el minificador
    // 🧩 fuerza a Next a usar PostCSS normal
    legacyBrowsers: true,
  },
};

module.exports = nextConfig;
