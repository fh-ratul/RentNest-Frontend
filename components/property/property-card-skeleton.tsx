import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="space-y-2.5 pt-4">
        <Skeleton className="h-3 w-20 rounded-sm" />
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <div className="flex justify-between border-t pt-3">
          <Skeleton className="h-4 w-28 rounded-sm" />
          <Skeleton className="h-4 w-24 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
