/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: false,
  images: {
    domains: ['raw.githubusercontent.com'],
    loader: 'akamai',
    path: '',
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: '/poke-app',
};

module.exports = nextConfig;
