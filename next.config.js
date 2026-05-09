/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // CI/Docker builds should not fail on lint noise; run `npm run lint` in PRs.
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
