// Streaming skeleton — shown while the Server Component fetches data

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface ${className ?? ''}`}
    />
  )
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <SkeletonBox className="aspect-square w-full rounded-xl" />
      <SkeletonBox className="h-3 w-1/3" />
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-4 w-1/2" />
      <SkeletonBox className="mt-1 h-10 w-full rounded-full" />
    </div>
  )
}

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <SkeletonBox className="h-8 w-48" />
          <SkeletonBox className="mt-2 h-4 w-24" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[256px_1fr] lg:gap-x-8">
          {/* Filter sidebar skeleton */}
          <aside className="hidden space-y-4 lg:block">
            <div className="rounded-xl border border-border bg-card p-5 space-y-5">
              <SkeletonBox className="h-4 w-16" />
              <SkeletonBox className="h-9 w-full rounded-lg" />
              <div className="space-y-2 pt-2">
                <SkeletonBox className="h-3 w-12" />
                {[...Array(4)].map((_, i) => (
                  <SkeletonBox key={i} className="h-8 w-full rounded-lg" />
                ))}
              </div>
              <div className="space-y-2 pt-2">
                <SkeletonBox className="h-3 w-16" />
                {[...Array(4)].map((_, i) => (
                  <SkeletonBox key={i} className="h-8 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </aside>

          {/* Grid skeleton */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 lg:mt-0">
            {[...Array(9)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
