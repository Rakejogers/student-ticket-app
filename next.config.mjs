/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's7d2.scene7.com',
      },
      {
        protocol: 'https',
        hostname: 'npr.brightspotcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'salasobrien.com',
      },
      {
        protocol: 'https',
        hostname: 'ukathletics.com',
      },
    ],
  },

  // Minimal webpack optimizations - trust Next.js defaults
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Enable better tree shaking
    config.optimization.usedExports = true;
    
    // Bundle analyzer (only when ANALYZE=true)
    if (process.env.ANALYZE === 'true') {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer ? '../analyze/server.html' : './analyze/client.html',
        })
      );
    }

    // Let Next.js handle chunk splitting - remove custom vendor chunking
    return config;
  },

  // Experimental features for optimization
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },

  // Performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
