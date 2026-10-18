import { Skeleton } from "@/components/ui/skeleton";
import PropertyCardSkeleton from "@/components/property/property-card-skeleton";

export default function Loading() {
  return (
    <div>
      <div className="border-b">
        <div className="mx-auto max-w-7xl space-y-6 px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-80 max-w-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-[4.5rem] w-full rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
