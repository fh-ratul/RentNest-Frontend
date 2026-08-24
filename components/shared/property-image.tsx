// components/shared/property-image.tsx
import Image from "next/image";

// Keep this in sync with next.config.ts remotePatterns.
const ALLOWED_HOSTS = ["images.unsplash.com", "res.cloudinary.com"];

function isAllowedHost(url: string) {
  try {
    return ALLOWED_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

export default function PropertyImage({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted text-xs text-muted-foreground">
        No image
      </div>
    );
  }

  if (isAllowedHost(src)) {
    return <Image src={src} alt={alt} fill className="object-cover" />;
  }

  // Unknown host — a landlord can paste literally any URL into the property form,
  // and next/image will always throw for hosts you haven't pre-configured.
  // A plain <img> has no such restriction, so it becomes the safe fallback
  // instead of crashing the whole page for one bad URL.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />;
}