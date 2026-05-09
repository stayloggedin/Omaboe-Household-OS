/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for the production Dockerfile (standalone server bundle).
  output: 'standalone',
  // CI/Docker builds should not fail on lint noise; run `npm run lint` in PRs.
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
