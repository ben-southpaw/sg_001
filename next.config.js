/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: { unoptimized: true }
  // output: 'export' removed for Vercel compatibility
}

module.exports = nextConfig
