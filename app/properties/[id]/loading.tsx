import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <Skeleton className="h-8 w-32 rounded-full" />
      <div className="grid gap-3 md:h-[480px] md:grid-cols-4 md:grid-rows-2">
        <Skeleton className="h-72 rounded-2xl sm:h-96 md:col-span-2 md:row-span-2 md:h-auto" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="hidden rounded-2xl md:block" />
        ))}
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <div className="grid grid-cols-3 gap-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  );
}
