'use client'

import { useOptimistic, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  ShoppingCart, ShoppingBag, X, Minus, Plus,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { useCart, type CartLineItem } from '@/components/providers/cart-provider'
import {
  removeFromCartAction,
  updateCartQtyAction,
  clearCartAction,
} from '@/app/actions/cart'
import { cn } from '@/lib/utils'

// ─── Optimistic reducer ───────────────────────────────────────────────────────

type OptAction =
  | { type: 'remove';    id: string; variantId?: string }
  | { type: 'updateQty'; id: string; variantId?: string; quantity: number }
  | { type: 'clear' }

function applyOptimistic(state: CartLineItem[], action: OptAction): CartLineItem[] {
  switch (action.type) {
    case 'remove': {
      const { id, variantId } = action
      return state.filter(
        (i) => !(i.id === id && (i.variantId ?? undefined) === variantId)
      )
    }
    case 'updateQty': {
      const { id, variantId, quantity } = action
      return state
        .map((i) =>
          i.id === id && (i.variantId ?? undefined) === variantId
            ? { ...i, quantity }
            : i
        )
        .filter((i) => i.quantity > 0)
    }
    case 'clear':
      return []
    default:
      return state
  }
}

// ─── Badge count animation ────────────────────────────────────────────────────

const badgeVariants: Variants = {
  initial: { scale: 0,   opacity: 0 },
  animate: { scale: 1,   opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 25 } },
  exit:    { scale: 0,   opacity: 0, transition: { duration: 0.15 } },
}

// ─── CartDrawer ───────────────────────────────────────────────────────────────

export function CartDrawer({ triggerClassName }: { triggerClassName?: string }) {
  const { items, total, removeItem, updateQty, clearCart } = useCart()

  // useOptimistic: items is the real (settled) state. During a startTransition,
  // applyOptimistic is called to produce an instant visual update before the
  // server action completes and the real state catches up.
  const [optimisticItems, dispatchOptimistic] = useOptimistic(items, applyOptimistic)
  const [, startTrans] = useTransition()

  const optimisticCount = optimisticItems.reduce((s, i) => s + i.quantity, 0)
  const optimisticTotal = optimisticItems.reduce((s, i) => s + i.price * i.quantity, 0)

  function handleRemove(id: string, variantId?: string) {
    startTrans(async () => {
      dispatchOptimistic({ type: 'remove', id, variantId })
      removeItem(id, variantId)                         // sync CartContext
      await removeFromCartAction(id, variantId)         // DB persistence
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
    <Sheet>
      {/* ── Trigger: cart icon with animated badge ── */}
      <SheetTrigger
        className={cn(
          'relative flex size-9 shrink-0 items-center justify-center rounded-lg',
          'text-muted-foreground transition-colors',
          'hover:bg-muted hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          triggerClassName
        )}
        aria-label={`Open cart — ${optimisticCount} item${optimisticCount !== 1 ? 's' : ''}`}
      >
        <ShoppingCart className="size-4" />

        <AnimatePresence>
          {optimisticCount > 0 && (
            <motion.span
              key="badge"
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                'absolute -right-1 -top-1',
                'flex size-4 items-center justify-center rounded-full',
                'bg-brand text-[10px] font-bold leading-none text-white'
              )}
              aria-hidden
            >
              {optimisticCount > 99 ? '99+' : optimisticCount}
            </motion.span>
          )}
        </AnimatePresence>
      </SheetTrigger>

      {/* ── Sheet panel ── */}
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-border bg-card p-0 sm:max-w-[420px]"
        showCloseButton={false}
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-4 gap-4">
          <SheetTitle className="flex items-center gap-2 text-base font-semibold">
            <ShoppingBag className="size-4 text-brand" />
            Your Cart
            {optimisticCount > 0 && (
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
                {optimisticCount}
              </span>
            )}
          </SheetTitle>

          <div className="ml-auto flex items-center gap-3">
            {optimisticItems.length > 0 && (
              <button
                onClick={handleClear}
                className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                Clear all
              </button>
            )}
            {/* Manual close — base-ui Dialog.Close */}
            <Sheet>
              {/* We use a plain button here; the parent Sheet provides context */}
            </Sheet>
          </div>
        </SheetHeader>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {optimisticItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="space-y-0">
              <AnimatePresence initial={false}>
                {optimisticItems.map((item) => (
                  <motion.li
                    key={`${item.id}-${item.variantId ?? ''}`}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <CartItem
                      item={item}
                      onRemove={() => handleRemove(item.id, item.variantId ?? undefined)}
                      onUpdateQty={(q) => handleUpdateQty(item.id, q, item.variantId ?? undefined)}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Footer */}
        <AnimatePresence>
          {optimisticItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
            >
              <SheetFooter className="flex flex-col gap-3 border-t border-border px-5 py-5">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-bold text-foreground">
                    ${optimisticTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>

                {/* Checkout */}
                <Link
                  href="/checkout"
                  className={cn(
                    'mt-1 flex w-full items-center justify-center gap-2',
                    'rounded-full py-3.5 text-base font-semibold',
                    'bg-brand text-primary-foreground glow-brand',
                    'transition-all hover:scale-[1.02] hover:bg-brand/90'
                  )}
                >
                  Proceed to Checkout
                </Link>

                {/* Continue */}
                <Link
                  href="/products"
                  className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Continue Shopping →
                </Link>
              </SheetFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}

// ─── CartItem ─────────────────────────────────────────────────────────────────

function CartItem({
  item,
  onRemove,
  onUpdateQty,
}: {
  item:        CartLineItem
  onRemove:    () => void
  onUpdateQty: (qty: number) => void
}) {
  return (
    <div className="flex gap-3.5 border-b border-border py-4 last:border-0">
      {/* Thumbnail */}
      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl bg-surface">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="72px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="size-7 text-muted-foreground/25" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
            {item.variantName && (
              <p className="truncate text-xs text-muted-foreground">{item.variantName}</p>
            )}
          </div>

          <button
            onClick={onRemove}
            className="-mr-2 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Remove ${item.name} from cart`}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Inline qty controls — min 44px touch targets */}
          <div className="flex items-center rounded-xl border border-border">
            <button
              onClick={() => onUpdateQty(item.quantity - 1)}
              className="flex size-9 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground sm:size-8"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-semibold tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.quantity + 1)}
              className="flex size-9 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground sm:size-8"
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          {/* Line total */}
          <span className="text-sm font-bold text-foreground">
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <div className="flex size-18 items-center justify-center rounded-full bg-surface">
        <ShoppingBag className="size-9 text-muted-foreground/30" />
      </div>
      <div>
        <p className="font-semibold text-foreground">Your cart is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add some premium audio gear to get started.
        </p>
      </div>
      <Link
        href="/products"
        className="text-sm font-medium text-brand transition-colors hover:text-brand/80"
      >
        Browse products →
      </Link>
    </motion.div>
  )
}
