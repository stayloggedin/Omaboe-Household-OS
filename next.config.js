/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // CI/Docker builds should not fail on lint noise; run `npm run lint` in PRs.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Production image build (Railway Docker); local/PR quality: run `npm run typecheck`.
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
