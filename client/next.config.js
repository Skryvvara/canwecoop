/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  images: {
    domains: ["avatars.steamstatic.com", "cdn.akamai.steamstatic.com"]
  }
}

module.exports = nextConfig
