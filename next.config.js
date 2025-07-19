/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org',
        pathname: '/covers/**',
      },
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org',
        pathname: '/data/**', // Tambahkan ini untuk gambar komik
      },
    ],
  },
};

module.exports = nextConfig;
