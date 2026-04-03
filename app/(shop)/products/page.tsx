import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductGrid } from '@/components/shop/product-grid'
import { Filters, type FilterParams } from '@/components/shop/filters'
import { cn } from '@/lib/utils'

// ─── Config ───────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12

// ─── Data helpers ─────────────────────────────────────────────────────────────

function buildWhere(p: FilterParams) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { published: true }

  if (p.q) {
    where.OR = [
      { name:        { contains: p.q, mode: 'insensitive' } },
      { description: { contains: p.q, mode: 'insensitive' } },
    ]
  }

  if (p.category) {
    where.category = { slug: p.category }
  }

  const min = p.minPrice ? parseFloat(p.minPrice) : null
  const max = p.maxPrice ? parseFloat(p.maxPrice) : null

  if (min !== null || max !== null) {
    where.price = {
      ...(min !== null && { gte: min }),
      ...(max !== null && { lte: max }),
    }
  }

  return where
}

function buildOrderBy(sort?: string) {
  switch (sort) {
    case 'price-asc':  return { price:     'asc'  as const }
    case 'price-desc': return { price:     'desc' as const }
    case 'newest':     return { createdAt: 'desc' as const }
    default:           return { featured:  'desc' as const }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // searchParams is a Promise in Next.js 16 — must await
  const sp = await searchParams

  // Normalise: take first value if param is an array
  const params: FilterParams = {
    q:        typeof sp.q        === 'string' ? sp.q        : undefined,
    category: typeof sp.category === 'string' ? sp.category : undefined,
    sort:     typeof sp.sort     === 'string' ? sp.sort     : undefined,
    minPrice: typeof sp.minPrice === 'string' ? sp.minPrice : undefined,
    maxPrice: typeof sp.maxPrice === 'string' ? sp.maxPrice : undefined,
  }

  const page    = Math.max(1, parseInt(typeof sp.page === 'string' ? sp.page : '1', 10))
  const where   = buildWhere(params)
  const orderBy = buildOrderBy(params.sort)

  // Run all three queries in parallel
  const [rawProducts, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        images:   { orderBy: { position: 'asc' }, take: 1 },
        category: { select: { name: true, slug: true } },
        _count:   { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      select:  { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    }),
  ])

  // Serialise Decimal fields to plain numbers before sending to Client Components.
  // Prisma's Decimal type is not serialisable across the server→client boundary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = (rawProducts as any[]).map((p) => ({
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

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // ── Build pagination URL helper ──────────────────────────────────────────────
  function pageUrl(n: number) {
    const p = new URLSearchParams()
    if (params.q)        p.set('q',        params.q)
    if (params.category) p.set('category', params.category)
    if (params.sort)     p.set('sort',     params.sort)
    if (params.minPrice) p.set('minPrice', params.minPrice)
    if (params.maxPrice) p.set('maxPrice', params.maxPrice)
    if (n > 1)           p.set('page',     String(n))
    return `/products${p.size ? `?${p}` : ''}`
  }

  type Cat = { id: string; name: string; slug: string }
  const headline = params.q
    ? `Results for "${params.q}"`
    : params.category
    ? ((categories as Cat[]).find((c) => c.slug === params.category)?.name ?? 'Products')
    : 'All Products'

  return (
    <div className="min-h-screen bg-background">

      {/* ── Page header ── */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {headline}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total === 0
              ? 'No products found'
              : `${total} ${total === 1 ? 'product' : 'products'}`}
            {page > 1 && ` — page ${page} of ${totalPages}`}
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[256px_1fr] lg:gap-x-8">

          {/* Filters — Client Component, sticky sidebar on desktop */}
          <aside>
            <Filters categories={categories} current={params} />
          </aside>

          {/* Product grid ─────────────────────────────────────────────────── */}
          <div className="mt-0">
            {products.length === 0 ? (
              <EmptyState hasFilters={!!(params.q || params.category || params.minPrice || params.maxPrice)} />
            ) : (
              <>
                <ProductGrid products={products} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    current={page}
                    total={totalPages}
                    pageUrl={pageUrl}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex min-h-[440px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card text-center">
      <span className="text-5xl" aria-hidden>🎧</span>
      <div>
        <h2 className="text-xl font-semibold text-foreground">No products found</h2>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          {hasFilters
            ? 'Try adjusting your filters or clearing the search term.'
            : 'Check back soon — new audio gear is on its way.'}
        </p>
      </div>
      {hasFilters && (
        <Link
          href="/products"
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand/90"
        >
          Clear all filters
        </Link>
      )}
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  current,
  total,
  pageUrl,
}: {
  current: number
  total:   number
  pageUrl: (n: number) => string
}) {
  // Show up to 7 page slots (first, last, current ± 1, ellipses)
  function pages(): (number | '…')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const set = new Set<number>([1, total, current, current - 1, current + 1])
    const filtered = [...set]
      .filter((n) => n >= 1 && n <= total)
      .sort((a, b) => a - b)

    const result: (number | '…')[] = []
    for (let i = 0; i < filtered.length; i++) {
      if (i > 0 && (filtered[i] as number) - (filtered[i - 1] as number) > 1) {
        result.push('…')
      }
      result.push(filtered[i])
    }
    return result
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-1"
    >
      {/* Previous */}
      <PaginationBtn
        href={current > 1 ? pageUrl(current - 1) : undefined}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </PaginationBtn>

      {/* Page numbers */}
      {pages().map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="flex size-9 items-center justify-center text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <PaginationBtn
            key={p}
            href={pageUrl(p as number)}
            active={p === current}
            aria-label={`Page ${p}`}
            aria-current={p === current ? 'page' : undefined}
          >
            {p}
          </PaginationBtn>
        )
      )}

      {/* Next */}
      <PaginationBtn
        href={current < total ? pageUrl(current + 1) : undefined}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </PaginationBtn>
    </nav>
  )
}

function PaginationBtn({
  href,
  active,
  children,
  ...rest
}: {
  href?:       string
  active?:     boolean
  children:    React.ReactNode
  'aria-label'?:   string
  'aria-current'?: 'page' | undefined
}) {
  const base = cn(
    'flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
    active
      ? 'bg-brand text-primary-foreground'
      : 'border border-border text-muted-foreground hover:border-brand hover:text-foreground',
    !href && 'pointer-events-none opacity-30'
  )

  if (href) {
    return <Link href={href} className={base} {...rest}>{children}</Link>
  }
  return <span className={base} {...rest}>{children}</span>
}
