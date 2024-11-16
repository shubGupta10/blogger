/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['img.icons8.com', 'www.flaticon.com', 'firebasestorage.googleapis.com'] 
      },
};

export default nextConfig;
