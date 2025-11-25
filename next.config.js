/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['raw.githubusercontent.com'],
    loader: 'akamai',
    path: '',
    unoptimized: true,
    distDir: 'build',
  },
  trailingSlash: true,
  basePath: '/poke-app',
};

module.exports = nextConfig;
