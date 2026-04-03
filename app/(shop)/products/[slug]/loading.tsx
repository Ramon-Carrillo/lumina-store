import { Skeleton } from '@/components/ui/skeleton'

function GallerySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="flex gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="aspect-square w-[72px] shrink-0 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

function InfoSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-3.5 w-2" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-2" />
        <Skeleton className="h-3.5 w-36" />
      </div>

      {/* Name + reviews */}
      <div className="space-y-3">
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-9 w-3/5" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Price */}
      <Skeleton className="h-10 w-28" />

      {/* Feature badges */}
      <div className="flex flex-wrap gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>

      {/* Variant selector */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Qty + Add to Cart */}
      <div className="flex gap-3">
        <Skeleton className="h-12 w-32 rounded-full" />
        <Skeleton className="h-12 flex-1 rounded-full" />
      </div>

      {/* Description lines */}
      <div className="space-y-2 border-t border-border pt-5">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i === 3 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  )
}

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <GallerySkeleton />
          <InfoSkeleton />
        </div>
      </div>
    </div>
  )
}
