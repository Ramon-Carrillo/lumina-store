// Streaming skeleton — shown while the home page Server Component fetches data

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

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero skeleton */}
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto mb-7 flex justify-center">
            <SkeletonBox className="h-8 w-48 rounded-full" />
          </div>
          <SkeletonBox className="mx-auto h-16 w-3/4 rounded-xl sm:h-20" />
          <SkeletonBox className="mx-auto mt-4 h-12 w-1/2 rounded-xl" />
          <SkeletonBox className="mx-auto mt-6 h-5 w-2/3 rounded-lg" />
          <div className="mt-10 flex items-center justify-center gap-3">
            <SkeletonBox className="h-14 w-40 rounded-full" />
            <SkeletonBox className="h-14 w-48 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured products skeleton */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="mt-2 h-9 w-64" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories skeleton */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <SkeletonBox className="mx-auto h-3 w-16" />
            <SkeletonBox className="mx-auto mt-2 h-9 w-56" />
            <SkeletonBox className="mx-auto mt-3 h-4 w-72" />
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4 lg:grid-cols-9">
            {[...Array(9)].map((_, i) => (
              <SkeletonBox key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
