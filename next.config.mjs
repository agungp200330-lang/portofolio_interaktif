/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Penting untuk GitHub Pages
  images: {
    unoptimized: true, // Karena GitHub Pages tidak punya server image optimization
  },
};

export default nextConfig;
