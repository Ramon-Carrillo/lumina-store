import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react'
import { stripe, fromCents } from '@/lib/stripe'
import { ClearCart } from './clear-cart'

// ─── Data fetch ───────────────────────────────────────────────────────────────

async function getSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    })
    return session
  } catch {
    return null
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SuccessPage({
  searchParams,
}: {
  // searchParams is a Promise in Next.js 16 — must be awaited
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const sessionId = typeof sp.session_id === 'string' ? sp.session_id : null

  // No session ID → someone landed here directly
  if (!sessionId) redirect('/')

  const session = await getSession(sessionId)

  // Invalid / expired session
  if (!session || session.payment_status !== 'paid') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-lg font-semibold text-foreground">
            We couldn&apos;t verify your payment.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            If you were charged, please contact support with your session&nbsp;ID:
          </p>
          <code className="mt-2 block rounded-lg bg-surface px-3 py-2 text-xs text-muted-foreground">
            {sessionId}
          </code>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-brand/90 transition-colors"
          >
            Back to store
          </Link>
        </div>
      </div>
    )
  }

  const email   = session.customer_details?.email
  const total   = session.amount_total  != null ? fromCents(session.amount_total)  : null
  const orderId = session.id.slice(-8).toUpperCase() // last 8 chars as friendly ID
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineItems: any[] = (session.line_items?.data ?? [])

  return (
    <>
      {/*
        ClearCart is a Client Component rendered inside this Server Component.
        It calls clearCart() from CartProvider in a useEffect — the only way to
        mutate client-side state from a Server Component subtree.
      */}
      <ClearCart />

      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">

          {/* ── Confirmation header ── */}
          <div className="mb-10 flex flex-col items-center gap-4 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="size-10 text-green-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Payment confirmed!
              </h1>
              <p className="mt-2 text-muted-foreground">
                {email
                  ? `A confirmation has been sent to ${email}.`
                  : 'Thank you for your order.'}
              </p>
            </div>
          </div>

          {/* ── Order details card ── */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {/* Order meta */}
            <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
              <div className="px-5 py-4">
                <p className="text-xs text-muted-foreground">Order reference</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                  #{orderId}
                </p>
              </div>
              {total !== null && (
                <div className="px-5 py-4">
                  <p className="text-xs text-muted-foreground">Total charged</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    ${total.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Line items */}
            {lineItems.length > 0 && (
              <div className="divide-y divide-border px-5">
                {lineItems.map((item: any, i: number) => {
                  const desc   = item.description ?? 'Product'
                  const qty    = item.quantity    ?? 1
                  const amount = item.amount_total != null
                    ? fromCents(item.amount_total)
                    : null
                  return (
                    <div key={i} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <p className="font-medium text-foreground">{desc}</p>
                        <p className="text-xs text-muted-foreground">Qty: {qty}</p>
                      </div>
                      {amount !== null && (
                        <p className="font-semibold text-foreground">${amount.toFixed(2)}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* What happens next */}
            <div className="border-t border-border bg-surface/40 px-5 py-4">
              <div className="flex items-start gap-3">
                <Package className="mt-0.5 size-4 shrink-0 text-brand" />
                <div>
                  <p className="text-sm font-medium text-foreground">What&apos;s next?</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    We&apos;ll prepare your order and send a shipping confirmation once it&apos;s
                    on its way. Most orders ship within 1–2 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand/90 hover:shadow-lg glow-brand"
            >
              Continue shopping
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Home className="size-4" />
              Return home
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
