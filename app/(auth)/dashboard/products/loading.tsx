import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main className="p-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-1/4  bg-muted" />
        <Skeleton className="h-8 w-1/6  bg-muted" />
      </div>
      <Skeleton className="h-8 w-1/2 bg-muted my-4" />
      <Skeleton className="h-32 w-full bg-muted my-4" />
      <Skeleton className="h-4 w-32 bg-muted" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-16 bg-muted" />
        <div className="flex justify-center items-center gap-4">
          <Skeleton className="h-8 w-16 bg-muted" />
          <Skeleton className="h-8 w-16 bg-muted" />
        </div>
      </div>
    </main>
  );
};

export default Loading;
