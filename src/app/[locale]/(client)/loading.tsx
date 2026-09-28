import { Skeleton } from '@/components/ui/skeleton';

/** Home page skeleton shown while portfolio data streams in. */
export default function HomeLoading() {
  return (
    <main className="flex min-h-[100dvh] flex-col gap-12 sm:gap-16" aria-busy="true" aria-label="Loading">
      {/* Hero */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="size-24 rounded-full sm:size-32" />
      </div>

      {/* About */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Timeline entries */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>

      {/* Project cards */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
