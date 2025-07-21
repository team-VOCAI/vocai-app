import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // eslint 무시하는 옵션
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
