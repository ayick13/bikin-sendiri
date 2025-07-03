// next.config.ts

// import { NextConfig } from "next"; // Not needed in JS config

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
        port: '',
        pathname: '/prompt/**',
      },
      // Menambahkan hostname untuk avatar pengguna dari Google
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      // Menambahkan hostname untuk avatar pengguna dari GitHub
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;