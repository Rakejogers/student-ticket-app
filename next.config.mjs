/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
};

export default nextConfig;
