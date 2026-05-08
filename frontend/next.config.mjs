/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'store.storeimages.cdn-apple.com' },
      // Admin-uploaded images via backend (local dev + Render deploy)
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: '*.onrender.com' },
      // Other common CDN/upload sources
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      // Fallback: allow any https host (catches any new upload domains)
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
