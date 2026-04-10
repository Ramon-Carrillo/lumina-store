'use client'

import { useOptimistic, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { ShoppingCart, Check, Star, Headphones } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/components/providers/cart-provider'
import { cn } from '@/lib/utils'

// ─── Serialised shape (Decimal → number before passing from server) ───────────

export type ProductCardData = {
  id:               string
  name:             string
  slug:             string
  price:            number
  compareAt:        number | null
  stock:            number
  featured:         boolean
  noiseCancellation: boolean
  images:           Array<{ url: string; alt: string | null }>
  category:         { name: string; slug: string }
  _count:           { reviews: number }
}

// ─── Framer Motion variants ───────────────────────────────────────────────────

const card: Variants = {
  rest:  { boxShadow: '0 0 0 rgba(0,0,0,0)',       transition: { duration: 0.25, ease: 'easeOut' } },
  hover: { boxShadow: '0 8px 30px rgba(0,0,0,0.08)', transition: { duration: 0.25, ease: 'easeOut' } },
}

const image: Variants = {
  rest:  { scale: 1,    transition: { duration: 0.4, ease: 'easeOut' } },
  hover: { scale: 1.07, transition: { duration: 0.4, ease: 'easeOut' } },
}

const label: Variants = {
  enter:  { opacity: 0, y: 6,  transition: { duration: 0.14 } },
  center: { opacity: 1, y: 0,  transition: { duration: 0.14 } },
  exit:   { opacity: 0, y: -6, transition: { duration: 0.10 } },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticAdded, setOptimisticAdded] = useOptimistic(false)

  const thumb    = product.images[0]
  const inStock  = product.stock > 0
  const discount = product.compareAt && product.compareAt > product.price
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : null

  // True while the transition is running (i.e. the "Added ✓" window)
  const added = optimisticAdded || isPending

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!inStock || added) return

    startTransition(async () => {
      // Show "Added ✓" immediately via optimistic state
      setOptimisticAdded(true)

      addItem({
        id:    product.id,
        name:  product.name,
        slug:  product.slug,
        price: product.price,
        image: thumb?.url,
      })

      // Keep the confirmed state visible for 1.2 s, then let the transition
      // complete so useOptimistic reverts to `false`
      await new Promise<void>((resolve) => setTimeout(resolve, 1200))
    })

    toast.success('Added to cart', {
      description: product.name,
      action: {
        label:   'View Cart',
        onClick: () => router.push('/checkout'),
      },
    })
  }

  return (
    <motion.article
      className="group relative flex flex-col"
      variants={card}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* ── Image container ── */}
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl card-premium">

          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
            {discount !== null && (
              <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
                -{discount}%
              </span>
            )}
            {product.featured && discount === null && (
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-brand shadow-none">
                Featured
              </span>
            )}
            {product.noiseCancellation && (
              <span className="rounded-full bg-surface-raised border border-border px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                ANC
              </span>
            )}
          </div>

          {/* Out-of-stock veil */}
          {!inStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/75 backdrop-blur-sm">
              <span className="rounded-full bg-surface-raised border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                Out of Stock
              </span>
            </div>
          )}

          {/* Image */}
          <motion.div className="h-full w-full" variants={image}>
            {thumb?.url ? (
              <Image
                src={thumb.url}
                alt={thumb.alt ?? product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface">
                <Headphones className="size-16 text-muted-foreground/20" />
              </div>
            )}
          </motion.div>

          {/* Hover gradient overlay */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent',
              'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            )}
          />
        </div>

        {/* ── Text info ── */}
        <div className="mt-3 space-y-1 px-0.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.category.name}
          </p>
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAt && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.compareAt.toFixed(2)}
                </span>
              )}
            </div>
            {product._count.reviews > 0 && (
              <div className="flex items-center gap-1">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">
                  {product._count.reviews}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* ── Add to Cart ── */}
      <motion.button
        onClick={handleAddToCart}
        disabled={!inStock || added}
        whileTap={inStock && !added ? { scale: 0.97 } : undefined}
        whileHover={inStock && !added ? { boxShadow: '0 0 20px var(--brand-glow)' } : undefined}
        className={cn(
          'relative mt-3 flex w-full items-center justify-center gap-2 rounded-full',
          'overflow-hidden border border-border py-2.5 text-sm font-semibold',
          'transition-colors duration-200',
          !inStock
            ? 'cursor-not-allowed opacity-40 bg-surface text-muted-foreground'
            : added
            ? 'cursor-default border-green-500/40 bg-green-500/10 text-green-500'
            : 'bg-surface text-foreground hover:border-brand hover:bg-brand hover:text-primary-foreground cursor-pointer'
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span
              key="added"
              variants={label}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex items-center gap-2"
            >
              <Check className="size-3.5 shrink-0" />
              Added!
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              variants={label}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex items-center gap-2"
            >
              <ShoppingCart className="size-3.5 shrink-0" />
              {inStock ? 'Add to Cart' : 'Unavailable'}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.article>
  )
}
