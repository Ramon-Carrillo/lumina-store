'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Lock,
  ArrowLeft,
  AlertCircle,
  ChevronRight,
  Headphones,
  CreditCard,
} from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/components/providers/cart-provider'
import { createCheckoutSession } from '@/app/actions/checkout'
import { cn } from '@/lib/utils'
import { useState } from 'react'

// ─── Order summary line ───────────────────────────────────────────────────────

function OrderLine({
  image,
  name,
  variantName,
  price,
  quantity,
}: {
  image?:       string
  name:         string
  variantName?: string
  price:        number
  quantity:     number
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      {/* Thumbnail with quantity badge */}
      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface">
        {image ? (
          <Image src={image} alt={name} fill sizes="56px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Headphones className="size-6 text-muted-foreground/25" />
          </div>
        )}
        {/* Qty badge */}
        <span
          className={cn(
            'absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center',
            'rounded-full bg-brand text-[10px] font-bold text-white'
          )}
          aria-label={`Quantity: ${quantity}`}
        >
          {quantity}
        </span>
      </div>

      {/* Name + variant */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        {variantName && (
          <p className="text-xs text-muted-foreground">{variantName}</p>
        )}
      </div>

      {/* Line total */}
      <p className="shrink-0 text-sm font-semibold text-foreground">
        ${(price * quantity).toFixed(2)}
      </p>
    </div>
  )
}

// ─── Trust badge ─────────────────────────────────────────────────────────────

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {icon}
      {label}
    </div>
  )
}

// ─── Checkout page ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isEmpty = items.length === 0

  function handleCheckout() {
    setError(null)
    startTransition(async () => {
      const result = await createCheckoutSession(
        items.map((i) => ({
          id:          i.id,
          name:        i.name,
          slug:        i.slug,
          price:       i.price,
          image:       i.image,
          quantity:    i.quantity,
          variantId:   i.variantId,
          variantName: i.variantName,
        }))
      )

      if (!result.success) {
        setError(result.error)
        toast.error(result.error)
        return
      }

      // Hard navigate to Stripe's hosted Checkout page.
      // We use assign() instead of push() so the browser history entry is
      // correctly replaced when Stripe redirects back to success_url.
      window.location.assign(result.url)
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <Link
            href="/products"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Continue shopping
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Review your order
          </h1>
        </div>

        {isEmpty ? (
          /* ── Empty state ── */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card py-16 text-center"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-surface">
              <ShoppingBag className="size-8 text-muted-foreground/30" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add some products before checking out.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand/90"
            >
              Browse products
              <ChevronRight className="size-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">

            {/* ── Order summary card ── */}
            <div className="rounded-2xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Order summary
                  <span className="ml-2 text-muted-foreground font-normal">
                    ({items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                </h2>
              </div>

              <div className="divide-y divide-border px-5">
                {items.map((item) => (
                  <OrderLine
                    key={`${item.id}-${item.variantId ?? ''}`}
                    image={item.image}
                    name={item.name}
                    variantName={item.variantName}
                    price={item.price}
                    quantity={item.quantity}
                  />
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border px-5 py-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Calculated at next step</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-muted-foreground">Calculated at next step</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-base">
                  <span className="font-semibold text-foreground">Estimated total</span>
                  <span className="text-xl font-bold text-foreground">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* ── Error banner ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Pay button ── */}
            <motion.button
              onClick={handleCheckout}
              disabled={isPending}
              whileTap={!isPending ? { scale: 0.98 } : undefined}
              className={cn(
                'relative w-full overflow-hidden rounded-full py-4 text-base font-semibold',
                'transition-all duration-200 focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isPending
                  ? 'cursor-not-allowed bg-brand/60 text-primary-foreground'
                  : 'glow-brand bg-brand text-primary-foreground hover:bg-brand/90'
              )}
            >
              {/* Shimmer overlay while pending */}
              {isPending && (
                <motion.div
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  animate={{ translateX: ['−100%', '200%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
              )}

              <AnimatePresence mode="wait" initial={false}>
                {isPending ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center justify-center gap-2.5"
                  >
                    <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Redirecting to Stripe…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center justify-center gap-2.5"
                  >
                    <Lock className="size-4" />
                    Pay securely with Stripe
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* ── Trust indicators ── */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1">
              <TrustBadge
                icon={<Lock className="size-3.5" />}
                label="SSL encrypted"
              />
              <TrustBadge
                icon={<CreditCard className="size-3.5" />}
                label="Powered by Stripe"
              />
              <TrustBadge
                icon={<ShoppingBag className="size-3.5" />}
                label="Secure checkout"
              />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By completing your purchase you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              .
            </p>

          </div>
        )}
      </div>
    </div>
  )
}
