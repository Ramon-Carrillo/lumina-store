import { Skeleton } from '@/components/ui/skeleton'

export default function CheckoutLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-7 w-48" />
        </div>

        {/* Order summary card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <Skeleton className="h-5 w-36" />
          </div>

          <div className="divide-y divide-border px-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="size-14 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-14" />
              </div>
            ))}
          </div>

          <div className="border-t border-border px-5 py-4 space-y-2.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        </div>

        {/* Pay button */}
        <Skeleton className="mt-4 h-14 w-full rounded-full" />

        {/* Trust badges */}
        <div className="mt-4 flex justify-center gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-24" />
          ))}
        </div>

      </div>
    </div>
  )
}
