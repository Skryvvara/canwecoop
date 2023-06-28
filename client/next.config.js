/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  images: {
    domains: ['steamcdn-a.akamaihd.net', 'cdn.akamai.steamstatic.com', 'avatars.akamai.steamstatic.com', 'avatars.steamstatic.com', 'darkyne.com'],
  },
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true 
    return config;
  },
}

module.exports = nextConfig
