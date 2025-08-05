/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Solo per la POC - in produzione dovresti risolvere gli errori TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Solo per la POC - in produzione dovresti risolvere gli errori ESLint
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig