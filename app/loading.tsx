import { Skeleton } from "@/components/ui/skeleton";
import PropertyCardSkeleton from "@/components/property/property-card-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-16 sm:px-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-56 rounded-full" />
        <Skeleton className="h-14 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-md" />
        <Skeleton className="h-14 w-full max-w-xl rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
