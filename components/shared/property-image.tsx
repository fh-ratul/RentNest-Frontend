// components/shared/property-image.tsx
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Keep this in sync with next.config.ts remotePatterns.
const ALLOWED_HOSTS = ["images.unsplash.com", "res.cloudinary.com"];

function isAllowedHost(url: string) {
  try {
    return ALLOWED_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function PropertyImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
}: Props) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-linear-to-br from-muted to-accent/60 text-muted-foreground">
        <ImageOff className="size-6 opacity-50" />
        <span className="text-xs font-medium">No photo yet</span>
      </div>
    );
  }

  if (isAllowedHost(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} />;
  }

  // Unknown host — a landlord can paste literally any URL into the property form,
  // and next/image will always throw for hosts you haven't pre-configured.
  // A plain <img> has no such restriction, so it becomes the safe fallback
  // instead of crashing the whole page for one bad URL.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className={cn("absolute inset-0 h-full w-full object-cover", className)} />;
}
