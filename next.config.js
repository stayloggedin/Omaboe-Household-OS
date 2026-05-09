/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for the production Dockerfile (standalone server bundle).
  output: 'standalone',
}

module.exports = nextConfig
