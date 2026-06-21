import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container">
      <Skeleton className="bg-card rounded-none w-[12%] h-10" />
      <Skeleton className="bg-card rounded-none w-full h-px my-4" />
      <div className="mx-auto space-y-4">
        <div className="flex justify-center items-center gap-4">
          <Skeleton className="bg-card rounded-none aspect-video w-24" />
          <Skeleton className="bg-card rounded-none aspect-video w-24" />
          <Skeleton className="bg-card rounded-none aspect-video w-24" />
          <Skeleton className="bg-card rounded-none aspect-video w-24" />
          <Skeleton className="bg-card rounded-none aspect-video w-24" />
          <Skeleton className="bg-card rounded-none aspect-video w-24" />
        </div>
        <div className="flex justify-center items-center gap-4">
          <Skeleton className="bg-card rounded-none h-12 w-full max-w-sm" />
          <Skeleton className="bg-card rounded-none h-12 w-32" />
        </div>
      </div>
      <Skeleton className="bg-card rounded-none w-full h-px my-4" />
    </div>
  );
}
