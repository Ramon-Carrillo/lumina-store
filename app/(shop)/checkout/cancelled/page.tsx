import Link from 'next/link'
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react'

export default function CancelledPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
          <XCircle className="size-10 text-muted-foreground" />
        </div>

        {/* Copy */}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Payment cancelled
        </h1>
        <p className="mt-3 text-muted-foreground">
          No worries — your cart is still saved and nothing was charged.
          You can complete your purchase whenever you&apos;re ready.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/checkout"
            className="flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand/90 hover:scale-[1.02] glow-brand"
          >
            <ShoppingCart className="size-4" />
            Return to checkout
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Continue shopping
          </Link>
        </div>

      </div>
    </div>
  )
}
