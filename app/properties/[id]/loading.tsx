import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-72 md:col-span-2 md:h-96" />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
          <Skeleton className="h-32 md:h-[11.5rem]" />
          <Skeleton className="h-32 md:h-[11.5rem]" />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-56 w-full" />
      </div>
    </div>
  );
}