import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Star, ThumbsUp, ShieldCheck, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductDetail, type SerializedProduct } from '@/components/shop/product-detail'
import { ProductCard, type ProductCardData } from '@/components/shop/product-card'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toNum(d: any): number       { return Number(d) }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toNumN(d: any): number|null { return d == null ? null : Number(d) }

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product: any = await prisma.product.findUnique({
    where:  { slug, published: true },
    select: { name: true, metaTitle: true, metaDescription: true, description: true },
  })

  if (!product) return {}

  return {
    title:       product.metaTitle       ?? product.name,
    description: product.metaDescription ?? product.description?.slice(0, 160),
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any = await prisma.product.findUnique({
    where: { slug, published: true },
    include: {
      images:   { orderBy: { position: 'asc' } },
      variants: { orderBy: { name: 'asc' } },
      category: { select: { name: true, slug: true } },
      _count:   { select: { reviews: true } },
      reviews:  {
        orderBy: { helpful: 'desc' },
        include: { user: { select: { name: true } } },
      },
    },
  })

  if (!raw) notFound()

  // Related products — same category, exclude self
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawRelated: any[] = await prisma.product.findMany({
    where:   { categoryId: raw.categoryId, published: true, NOT: { id: raw.id } },
    orderBy: { featured: 'desc' },
    take:    4,
    include: {
      images:   { orderBy: { position: 'asc' }, take: 1 },
      category: { select: { name: true, slug: true } },
      _count:   { select: { reviews: true } },
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const related: ProductCardData[] = rawRelated.map((p: any) => ({
    id:                p.id,
    name:              p.name,
    slug:              p.slug,
    price:             Number(p.price),
    compareAt:         p.compareAt ? Number(p.compareAt) : null,
    stock:             p.stock,
    featured:          p.featured,
    noiseCancellation: p.noiseCancellation,
    images:            p.images,
    category:          p.category,
    _count:            p._count,
  }))

  // Compute average rating from reviews
  const reviewsList = raw.reviews as Array<{ rating: number }>
  const averageRating = reviewsList.length > 0
    ? reviewsList.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviewsList.length
    : null

  // Serialise every Decimal → number so the Client Component can receive it
  const product: SerializedProduct = {
    id:                raw.id,
    name:              raw.name,
    slug:              raw.slug,
    description:       raw.description,
    price:             toNum(raw.price),
    compareAt:         toNumN(raw.compareAt),
    stock:             raw.stock,
    featured:          raw.featured,
    noiseCancellation: raw.noiseCancellation,
    transparencyMode:  raw.transparencyMode,
    batteryLife:       raw.batteryLife   ?? null,
    chargingCaseLife:  raw.chargingCaseLife ?? null,
    quickCharge:       raw.quickCharge,
    waterResistance:   raw.waterResistance  ?? null,
    driverSize:        raw.driverSize       ?? null,
    frequencyResponse: raw.frequencyResponse ?? null,
    weight:            raw.weight           ?? null,
    colors:            raw.colors,
    connectivity:      raw.connectivity,
    inBox:             raw.inBox,
    warranty:          raw.warranty,
    images:            raw.images.map((img: any) => ({
      url:      img.url,
      alt:      img.alt,
      position: img.position,
    })),
    variants: raw.variants.map((v: any) => ({
      id:    v.id,
      name:  v.name,
      price: toNumN(v.price),
      stock: v.stock,
      image: v.image ?? null,
    })),
    category: raw.category,
    averageRating,
    _count:   raw._count,
  }

  const reviews = raw.reviews as Array<{
    id:      string
    rating:  number
    title:   string | null
    body:    string
    verified: boolean
    helpful: number
    createdAt: Date
    user:    { name: string | null }
  }>

  return (
    <>
      <ProductDetail product={product} />
      {reviews.length > 0 && <ReviewsSection reviews={reviews} />}
      {related.length > 0 && <RelatedProducts products={related} categoryName={raw.category.name} categorySlug={raw.category.slug} />}
    </>
  )
}

// ─── Related products ─────────────────────────────────────────────────────────

function RelatedProducts({
  products,
  categoryName,
  categorySlug,
}: {
  products:     ProductCardData[]
  categoryName: string
  categorySlug: string
}) {
  return (
    <section className="border-t border-border bg-card py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              More from {categoryName}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              You might also like
            </h2>
          </div>
          <Link
            href={`/products?category=${categorySlug}`}
            className="group hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            View all
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Reviews section ──────────────────────────────────────────────────────────

function ReviewsSection({
  reviews,
}: {
  reviews: Array<{
    id:       string
    rating:   number
    title:    string | null
    body:     string
    verified: boolean
    helpful:  number
    createdAt: Date
    user:     { name: string | null }
  }>
}) {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <section className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Customer Reviews
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-5 ${i < Math.round(avg) ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{avg.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-border bg-card p-6"
            >
              {/* Stars + verified */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`}
                    />
                  ))}
                </div>
                {review.verified && (
                  <span className="flex items-center gap-1 text-xs text-green-500">
                    <ShieldCheck className="size-3.5" />
                    Verified purchase
                  </span>
                )}
              </div>

              {/* Title */}
              {review.title && (
                <p className="mt-3 font-semibold text-foreground">{review.title}</p>
              )}

              {/* Body */}
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {review.body}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {review.user.name ?? 'Anonymous'}
                  </span>
                  {' · '}
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
                {review.helpful > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ThumbsUp className="size-3.5" />
                    {review.helpful} found helpful
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
