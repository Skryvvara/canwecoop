/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ 'steamcdn-a.akamaihd.net', 'cdn.akamai.steamstatic.com', 'darkyne.com' ],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};

module.exports = nextConfig;
