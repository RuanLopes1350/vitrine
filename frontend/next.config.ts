import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next",
  images: {
    remotePatterns: [
      // === IMAGENS GRATUITAS ===
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '*.freepik.com',
      },
      
      // === BANCOS DE IMAGENS PREMIUM ===
      {
        protocol: 'https',
        hostname: '*.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: '*.istockphoto.com',
      },
      {
        protocol: 'https',
        hostname: 'previews.123rf.com',
      },
      {
        protocol: 'https',
        hostname: '*.123rf.com',
      },
      {
        protocol: 'https',
        hostname: '*.gettyimages.com',
      },
      {
        protocol: 'https',
        hostname: '*.depositphotos.com',
      },
      
      // === CDNs E PLACEHOLDERS ===
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
      {
        protocol: 'https',
        hostname: 'fakeimg.pl',
      },
      
      // === REDES SOCIAIS E GRANDES PLATAFORMAS ===
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '*.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
      },
      
      // === WIKIMEDIA E WIKIPEDIA ===
      {
        protocol: 'https',
        hostname: '*.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      
      // === CDNs POPULARES ===
      {
        protocol: 'https',
        hostname: '*.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: '*.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      
      // === GITHUB E REPOSITÓRIOS ===
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      
      // === E-COMMERCE E PRODUTOS ===
      {
        protocol: 'https',
        hostname: '*.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '*.woocommerce.com',
      },
      {
        protocol: 'https',
        hostname: '*.etsy.com',
      },
      
      // === VERCEL E NETLIFY (DEPLOY) ===
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.netlify.app',
      },
      
      // === LOCALHOST (DESENVOLVIMENTO) ===
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1350',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '1350', 
        pathname: '/uploads/**',
      },

      // === SITES ALEATÓRIOS E DIVERSOS ===
      {
        protocol: 'https',
        hostname: 'www.gabriellfreitass.com.br',
      }
    ],
  },
};

export default nextConfig;