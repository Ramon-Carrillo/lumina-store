'use client'

import { useState, useOptimistic, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  ShoppingCart, Check, Minus, Plus, Star,
  Zap, Wifi, Droplets, Battery, Package,
  Ear, Headphones,
} from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/components/providers/cart-provider'
import { addToCartAction } from '@/app/actions/cart'
import { cn } from '@/lib/utils'

// ─── Serialised product shape ─────────────────────────────────────────────────
// All Decimal fields must be converted to number before passing from Server Component.

export type SerializedProduct = {
  id:                string
  name:              string
  slug:              string
  description:       string
  price:             number
  compareAt:         number | null
  stock:             number
  featured:          boolean
  noiseCancellation: boolean
  transparencyMode:  boolean
  batteryLife:       number | null
  chargingCaseLife:  number | null
  quickCharge:       boolean
  waterResistance:   string | null
  driverSize:        number | null
  frequencyResponse: string | null
  weight:            number | null
  colors:            string[]
  connectivity:      string[]
  inBox:             string[]
  warranty:          number
  images:            Array<{ url: string; alt: string | null; position: number }>
  variants:          Array<{ id: string; name: string; price: number | null; stock: number; image: string | null }>
  category:          { name: string; slug: string }
  averageRating:     number | null
  _count:            { reviews: number }
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

const mainImageVariants: Variants = {
  enter: { opacity: 0, scale: 1.04 },
  center:{ opacity: 1, scale: 1,    transition: { duration: 0.35, ease: 'easeOut' } },
  exit:  { opacity: 0, scale: 0.96, transition: { duration: 0.2,  ease: 'easeIn'  } },
}

function ImageGallery({
  images,
  name,
}: {
  images: SerializedProduct['images']
  name: string
}) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="select-none">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl card-premium">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected}
            variants={mainImageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {images[selected]?.url ? (
              <Image
                src={images[selected].url}
                alt={images[selected].alt ?? name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface">
                <Headphones className="size-28 text-muted-foreground/15" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                'relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors duration-150',
                i === selected
                  ? 'border-brand'
                  : 'border-border hover:border-muted-foreground'
              )}
              aria-label={`View image ${i + 1}`}
            >
              {img.url ? (
                <Image
                  src={img.url}
                  alt={img.alt ?? `${name} — view ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface">
                  <Headphones className="size-5 text-muted-foreground/30" />
                </div>
              )}
              {/* Selection ring animated between thumbnails */}
              {i === selected && (
                <motion.div
                  layoutId="thumb-ring"
                  className="pointer-events-none absolute inset-0 rounded-[5px] ring-2 ring-brand ring-inset"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Quantity selector ────────────────────────────────────────────────────────

function QuantitySelector({
  value,
  max,
  onChange,
}: {
  value:    number
  max:      number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center rounded-full border border-border">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="flex size-10 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-10 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex size-10 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}

// ─── Add-to-cart button ───────────────────────────────────────────────────────
// Uses useOptimistic to show "Added ✓" instantly while the Server Action runs.

const btnLabel: Variants = {
  hidden:  { opacity: 0, y: 8  },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.14, ease: 'easeIn' } },
}

function AddToCartButton({
  inStock,
  qty,
  onAdd,
}: {
  inStock: boolean
  qty:     number
  onAdd:   () => void
}) {
  const [isPending, startTrans] = useTransition()
  // useOptimistic: real value is false (not-added), optimistic value flips to
  // true during the transition so the user sees feedback instantly.
  const [optimisticAdded, setOptimisticAdded] = useOptimistic(false)

  function handleClick() {
    if (!inStock || isPending) return
    startTrans(async () => {
      setOptimisticAdded(true)
      onAdd()
    })
  }

  const label = !inStock
    ? 'Out of Stock'
    : optimisticAdded
    ? 'Added to Cart'
    : qty > 1
    ? `Add ${qty} to Cart`
    : 'Add to Cart'

  return (
    <motion.button
      onClick={handleClick}
      disabled={!inStock || isPending}
      whileTap={inStock ? { scale: 0.97 } : undefined}
      className={cn(
        'flex flex-1 items-center justify-center gap-2.5 rounded-full px-6 py-3.5',
        'text-base font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        inStock
          ? 'glow-brand bg-brand text-primary-foreground hover:bg-brand/90'
          : 'cursor-not-allowed bg-muted text-muted-foreground'
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={optimisticAdded ? 'added' : 'add'}
          className="flex items-center gap-2.5"
          variants={btnLabel}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {optimisticAdded ? (
            <Check className="size-5" />
          ) : (
            <ShoppingCart className="size-5" />
          )}
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

// ─── ProductDetail ─────────────────────────────────────────────────────────────

export function ProductDetail({ product }: { product: SerializedProduct }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants[0]?.id ?? null
  )

  const selectedVariant   = product.variants.find((v) => v.id === selectedVariantId) ?? null
  const effectivePrice    = selectedVariant?.price ?? product.price
  const effectiveStock    = selectedVariant?.stock ?? product.stock
  const inStock           = effectiveStock > 0

  const discount =
    product.compareAt && product.compareAt > effectivePrice
      ? Math.round((1 - effectivePrice / product.compareAt) * 100)
      : null

  function handleAddToCart() {
    addItem({
      id:          product.id,
      name:        product.name,
      slug:        product.slug,
      price:       effectivePrice,
      image:       product.images[0]?.url,
      variantId:   selectedVariantId ?? undefined,
      variantName: selectedVariant?.name,
    })

    // Fire-and-forget Server Action for DB persistence
    addToCartAction(product.id, qty, selectedVariantId ?? undefined).then((result) => {
      if (!result.ok) toast.error(result.error)
    })

    toast.success('Added to cart', {
      description: product.name,
      action: { label: 'View Cart', onClick: () => {} },
    })
  }

  const specs = [
    product.batteryLife      && { label: 'Battery Life',    value: `${product.batteryLife}h` },
    product.chargingCaseLife && { label: 'Case Battery',    value: `+${product.chargingCaseLife}h` },
    product.waterResistance  && { label: 'Water Resist.',   value: product.waterResistance },
    product.driverSize       && { label: 'Driver Size',     value: `${product.driverSize} mm` },
    product.frequencyResponse && { label: 'Frequency',     value: product.frequencyResponse },
    product.weight           && { label: 'Weight',          value: `${product.weight} g` },
                                  { label: 'Warranty',      value: `${product.warranty} months` },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/products" className="transition-colors hover:text-foreground">Products</Link>
        <span aria-hidden>/</span>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="transition-colors hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      {/* ── Two-column layout ── */}
      <div className="lg:grid lg:grid-cols-[1fr_460px] lg:gap-x-12 xl:gap-x-16">

        {/* ── Gallery (left / top) ── */}
        <ImageGallery images={product.images} name={product.name} />

        {/* ── Product info (right / bottom) ── */}
        <div className="mt-8 lg:mt-0">

          {/* Category */}
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            {product.category.name}
          </p>

          {/* Name */}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          {/* Reviews + stock */}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {product._count.reviews > 0 && (
              <div className="flex items-center gap-1.5">
                {product.averageRating != null && (
                  <div className="flex" aria-hidden>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`size-4 ${s <= Math.round(product.averageRating!) ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`}
                      />
                    ))}
                  </div>
                )}
                <span className="text-sm text-muted-foreground">
                  {product.averageRating != null && (
                    <span className="font-semibold text-foreground">{product.averageRating.toFixed(1)} </span>
                  )}
                  ({product._count.reviews} review{product._count.reviews !== 1 ? 's' : ''})
                </span>
              </div>
            )}
            <span
              className={cn(
                'text-xs font-semibold',
                inStock ? 'text-green-500' : 'text-destructive'
              )}
            >
              {inStock ? `In Stock (${effectiveStock} left)` : 'Out of Stock'}
            </span>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-foreground">
              ${effectivePrice.toFixed(2)}
            </span>
            {product.compareAt !== null && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.compareAt.toFixed(2)}
              </span>
            )}
            {discount !== null && (
              <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Feature badges */}
          {(product.noiseCancellation || product.transparencyMode || product.quickCharge || product.waterResistance || product.batteryLife) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.noiseCancellation && (
                <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  <Zap className="size-3 text-brand" /> Active Noise Cancellation
                </span>
              )}
              {product.transparencyMode && (
                <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  <Ear className="size-3 text-brand" /> Transparency Mode
                </span>
              )}
              {product.quickCharge && (
                <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  <Zap className="size-3 text-yellow-400" /> Quick Charge
                </span>
              )}
              {product.waterResistance && (
                <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  <Droplets className="size-3 text-blue-400" /> {product.waterResistance}
                </span>
              )}
              {product.batteryLife && (
                <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  <Battery className="size-3 text-green-400" />
                  {product.batteryLife}h
                  {product.chargingCaseLife ? ` +${product.chargingCaseLife}h` : ''} battery
                </span>
              )}
            </div>
          )}

          {/* Connectivity */}
          {product.connectivity.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Wifi className="size-4 shrink-0" />
              <span>{product.connectivity.join(' · ')}</span>
            </div>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-foreground">
                Variant:{' '}
                <span className="text-brand">{selectedVariant?.name ?? 'Select one'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const priceOffset = v.price !== null ? v.price - product.price : 0
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      disabled={v.stock === 0}
                      className={cn(
                        'cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                        v.id === selectedVariantId
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground',
                        v.stock === 0 && 'cursor-not-allowed opacity-40'
                      )}
                    >
                      {v.name}
                      {priceOffset !== 0 && (
                        <span className="ml-1 text-xs opacity-70">
                          ({priceOffset > 0 ? '+' : ''}${priceOffset.toFixed(2)})
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Available in: {product.colors.join(', ')}
            </div>
          )}

          {/* Qty + Add to Cart */}
          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            {inStock && (
              <QuantitySelector
                value={qty}
                max={Math.min(effectiveStock, 99)}
                onChange={setQty}
              />
            )}
            <AddToCartButton
              inStock={inStock}
              qty={qty}
              onAdd={handleAddToCart}
            />
          </div>

          {/* ── Divider sections ── */}

          {/* Description */}
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Description
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <div className="mt-6 border-t border-border pt-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Specifications
              </h2>
              <dl className="space-y-2.5">
                {specs.map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4 text-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* In the box */}
          {product.inBox.length > 0 && (
            <div className="mt-6 border-t border-border pt-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                In the Box
              </h2>
              <ul className="space-y-1.5">
                {product.inBox.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="size-3.5 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
