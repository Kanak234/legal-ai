/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // All API endpoints are served by Next.js App Router at /api/v1/*
  // No external backend process needed — everything is embedded.
  // To switch back to Python backend: set BACKEND_URL=http://localhost:8000
  // and uncomment the rewrites block below.
  //
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: (process.env.BACKEND_URL || 'http://localhost:8000') + '/api/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
