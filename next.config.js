/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['antd']
  },
  transpilePackages: ['antd', '@ant-design/icons']
};

module.exports = nextConfig;