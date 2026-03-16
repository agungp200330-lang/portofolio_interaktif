/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Penting untuk GitHub Pages
  basePath: '/portofolio_interaktif', // Nama repositori GitHub kamu
  assetPrefix: '/portofolio_interaktif/', // Tambahkan garis miring di akhir
  images: {
    unoptimized: true, // Karena GitHub Pages tidak punya server image optimization
  },

};

export default nextConfig;
