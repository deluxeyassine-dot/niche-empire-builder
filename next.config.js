/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'Niche Empire Builder',
    NEXT_PUBLIC_APP_VERSION: '2.0.0',
  },

  // Rewrites for HTML dashboard files
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard.html',
      },
      {
        source: '/channels',
        destination: '/channels.html',
      },
      {
        source: '/analytics',
        destination: '/analytics.html',
      },
      {
        source: '/calendar',
        destination: '/calendar.html',
      },
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Image optimization
  images: {
    domains: ['supabase.co', 'via.placeholder.com'],
    unoptimized: true,
  },

  // TypeScript configuration
  // Temporarily ignore build errors since Supabase types aren't generated yet
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Transpile source files in src directory
  transpilePackages: [],
};

module.exports = nextConfig;
