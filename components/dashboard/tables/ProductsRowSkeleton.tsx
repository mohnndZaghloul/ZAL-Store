import { Skeleton } from "@/components/ui/skeleton";

export function ProductRowSkeleton() {
  return (
    <span className="flex justify-between items-center gap-4 p-2">
      <Skeleton className="w-20 h-20 rounded-xl" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-8 w-8 rounded-xl" />
    </span>
  );
}
