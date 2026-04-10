'use client'

import { useOptimistic, useTransition } from 'react'
import { ProductImage } from '@/components/ui/product-image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X, Minus, Plus, ArrowLeft, ShieldCheck, Truck } from 'lucide-react'
import { useCart, type CartLineItem } from '@/components/providers/cart-provider'
import {
  removeFromCartAction,
  updateCartQtyAction,
  clearCartAction,
} from '@/app/actions/cart'
import { cn } from '@/lib/utils'

// ─── Optimistic reducer (mirrors cart-drawer) ─────────────────────────────────

type OptAction =
  | { type: 'remove';    id: string; variantId?: string }
  | { type: 'updateQty'; id: string; variantId?: string; quantity: number }
  | { type: 'clear' }

function applyOptimistic(state: CartLineItem[], action: OptAction): CartLineItem[] {
  switch (action.type) {
    case 'remove':
      return state.filter(
        (i) => !(i.id === action.id && (i.variantId ?? undefined) === action.variantId)
      )
    case 'updateQty':
      return state
        .map((i) =>
          i.id === action.id && (i.variantId ?? undefined) === action.variantId
            ? { ...i, quantity: action.quantity }
            : i
        )
        .filter((i) => i.quantity > 0)
    case 'clear':
      return []
    default:
      return state
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCart()
  const router = useRouter()

  const [optimisticItems, dispatchOptimistic] = useOptimistic(items, applyOptimistic)
  const [, startTrans] = useTransition()

  const subtotal = optimisticItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const itemCount = optimisticItems.reduce((s, i) => s + i.quantity, 0)

  function handleRemove(id: string, variantId?: string) {
    startTrans(async () => {
      dispatchOptimistic({ type: 'remove', id, variantId })
      removeItem(id, variantId)
      await removeFromCartAction(id, variantId)
    })
  }

  function handleUpdateQty(id: string, quantity: number, variantId?: string) {
    if (quantity <= 0) { handleRemove(id, variantId); return }
    startTrans(async () => {
      dispatchOptimistic({ type: 'updateQty', id, variantId, quantity })
      updateQty(id, quantity, variantId)
      await updateCartQtyAction(id, quantity, variantId)
    })
  }

  function handleClear() {
    startTrans(async () => {
      dispatchOptimistic({ type: 'clear' })
      clearCart()
      await clearCartAction()
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Your Cart
            </h1>
            {itemCount > 0 && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
        </div>

        {optimisticItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* ── Item list ── */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Items
                </p>
                <button
                  onClick={handleClear}
                  className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  Clear all
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card">
                <AnimatePresence initial={false}>
                  {optimisticItems.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.variantId ?? ''}`}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <CartRow
                        item={item}
                        isLast={index === optimisticItems.length - 1}
                        onRemove={() => handleRemove(item.id, item.variantId ?? undefined)}
                        onUpdateQty={(q) => handleUpdateQty(item.id, q, item.variantId ?? undefined)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue shopping */}
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Continue Shopping
              </Link>
            </div>

            {/* ── Order summary ── */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-base font-semibold text-foreground">Order Summary</h2>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-medium text-green-500">
                      {subtotal >= 75 ? 'Free' : 'Calculated at checkout'}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Estimated Total</span>
                    <span className="text-xl font-bold text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 75 && (
                  <p className="mt-3 rounded-lg bg-brand/10 px-3 py-2 text-xs text-brand">
                    Add ${(75 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                <Link
                  href="/checkout"
                  className={cn(
                    'mt-5 flex w-full items-center justify-center gap-2',
                    'rounded-full py-3.5 text-base font-semibold',
                    'bg-brand text-primary-foreground glow-brand',
                    'transition-all hover:bg-brand/90 hover:shadow-lg'
                  )}
                >
                  Proceed to Checkout
                </Link>

                {/* Trust signals */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="size-3.5 shrink-0 text-green-500" />
                    Secure SSL checkout powered by Stripe
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="size-3.5 shrink-0 text-brand" />
                    Free shipping on orders over $75
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Cart row ─────────────────────────────────────────────────────────────────

function CartRow({
  item,
  isLast,
  onRemove,
  onUpdateQty,
}: {
  item:        CartLineItem
  isLast:      boolean
  onRemove:    () => void
  onUpdateQty: (qty: number) => void
}) {
  return (
    <div className={cn('flex gap-4 p-5', !isLast && 'border-b border-border')}>
      {/* Thumbnail */}
      <Link href={`/products/${item.slug}`} className="shrink-0">
        <div className="relative size-20 overflow-hidden rounded-xl bg-surface sm:size-24">
          {item.image ? (
            <ProductImage
              src={item.image}
              alt={item.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="size-8 text-muted-foreground/25" />
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              className="block truncate font-semibold text-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
            {item.variantName && (
              <p className="text-sm text-muted-foreground">{item.variantName}</p>
            )}
            <p className="mt-1 text-sm font-medium text-foreground">
              ${item.price.toFixed(2)}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Remove ${item.name}`}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Qty stepper */}
          <div className="flex items-center rounded-lg border border-border">
            <button
              onClick={() => onUpdateQty(item.quantity - 1)}
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.quantity + 1)}
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          {/* Line total */}
          <span className="font-bold text-foreground">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center gap-5 py-28 text-center"
    >
      <div className="flex size-24 items-center justify-center rounded-full bg-surface">
        <ShoppingBag className="size-12 text-muted-foreground/25" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet. Browse our collection to find your perfect sound.
        </p>
      </div>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand/90 hover:shadow-lg"
      >
        Shop Now
      </Link>
    </motion.div>
  )
}
