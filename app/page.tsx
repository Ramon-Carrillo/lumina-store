import Link from 'next/link'
import { Star, ArrowRight, Music, Headphones, Zap, Volume2, Gamepad2, AudioLines, MonitorSpeaker, Sliders, Package, ShieldCheck, Truck, RefreshCw, Headset } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Hero } from '@/components/shop/hero'
import { ProductCard, type ProductCardData } from '@/components/shop/product-card'

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { slug: 'true-wireless', name: 'True Wireless', icon: Music         },
  { slug: 'headphones',    name: 'Headphones',    icon: Headphones    },
  { slug: 'gaming',        name: 'Gaming',        icon: Gamepad2      },
  { slug: 'speakers',      name: 'Speakers',      icon: Volume2       },
  { slug: 'sport',         name: 'Sport',         icon: Zap           },
  { slug: 'earphones',     name: 'Earphones',     icon: AudioLines    },
  { slug: 'soundbars',     name: 'Soundbars',     icon: MonitorSpeaker},
  { slug: 'dacs-amps',     name: 'DACs & Amps',   icon: Sliders       },
  { slug: 'accessories',   name: 'Accessories',   icon: Package       },
]

// ─── Perks ────────────────────────────────────────────────────────────────────

const PERKS = [
  { icon: Truck,        title: 'Free Shipping',    body: 'On all orders over $75. Express options available at checkout.' },
  { icon: RefreshCw,    title: '30-Day Returns',   body: 'Not in love? Return any item within 30 days, no questions asked.' },
  { icon: ShieldCheck,  title: '2-Year Warranty',  body: 'Every Lumina product is backed by our full manufacturer warranty.' },
  { icon: Headset,      title: '24/7 Support',     body: 'Real humans ready to help. Chat, email, or call — your choice.' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  // Fetch featured products + reviews in parallel
  const [rawFeatured, rawReviews] = await Promise.all([
    prisma.product.findMany({
      where:   { featured: true, published: true },
      orderBy: { createdAt: 'asc' },
      take:    4,
      include: {
        images:   { orderBy: { position: 'asc' }, take: 1 },
        category: { select: { name: true, slug: true } },
        _count:   { select: { reviews: true } },
      },
    }),
    prisma.review.findMany({
      take:    3,
      orderBy: { helpful: 'desc' },
      include: {
        user:    { select: { name: true } },
        product: { select: { name: true } },
      },
    }),
  ])

  // Serialise Decimal fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featured: ProductCardData[] = (rawFeatured as any[]).map((p) => ({
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

  const reviews = rawReviews as typeof rawReviews

  return (
    <>
      <Hero />
      <FeaturedProducts products={featured} />
      <CategoryShowcase />
      <Testimonials reviews={reviews} />
      <Perks />
    </>
  )
}

// ─── Featured Products ────────────────────────────────────────────────────────

function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              Handpicked
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            className="group hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            View all
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile "view all" */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
          >
            View all products
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Category Showcase ────────────────────────────────────────────────────────

function CategoryShowcase() {
  return (
    <section className="border-y border-border bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Explore
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Shop by Category
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            From flagship TWS to desktop DACs — find exactly what your ears have been waiting for.
          </p>
        </div>

        {/* 3×3 grid */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-9">
          {CATEGORIES.map(({ slug, name, icon: Icon }) => (
            <Link
              key={slug}
              href={`/products?category=${slug}`}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-background p-4 text-center transition-colors hover:border-brand/50 hover:bg-brand/5"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 transition-colors group-hover:bg-brand/20">
                <Icon className="size-5 text-brand" />
              </span>
              <span className="text-xs font-medium leading-tight text-foreground">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials({
  reviews,
}: {
  reviews: Array<{
    id:      string
    rating:  number
    title:   string | null
    body:    string
    helpful: number
    user:    { name: string | null }
    product: { name: string }
  }>
}) {
  if (reviews.length === 0) return null

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Reviews
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Our Customers Say
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`}
                  />
                ))}
              </div>

              {/* Title + body */}
              {review.title && (
                <p className="text-sm font-semibold text-foreground">{review.title}</p>
              )}
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{review.body}&rdquo;
              </p>

              {/* Footer */}
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground">
                  {review.user.name ?? 'Anonymous'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Verified purchase · {review.product.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Perks ────────────────────────────────────────────────────────────────────

function Perks() {
  return (
    <section className="border-t border-border bg-card py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                <Icon className="size-5 text-brand" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
