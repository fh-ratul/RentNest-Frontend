// next.config.ts
const nextConfig = {
  images: {
    // Keep this in sync with ALLOWED_HOSTS in components/shared/property-image.tsx.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    serverActions: {
      // Property photos are uploaded through a server action, one at a time
      // and resized in the browser first. Stays under Vercel's 4.5 MB cap.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
