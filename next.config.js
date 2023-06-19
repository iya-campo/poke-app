/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['raw.githubusercontent.com'],
    loader: 'akamai',
    path: '',
  },
};

module.exports = nextConfig;
