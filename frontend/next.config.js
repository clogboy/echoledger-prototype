
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['js', 'jsx'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://0.0.0.0:8080/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
