'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchProducts } from '@/app/(shop)/products/actions'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterParams = {
  q?:        string
  category?: string
  sort?:     string
  minPrice?: string
  maxPrice?: string
}

type Category = {
  id:   string
  name: string
  slug: string
}

interface Props {
  categories: Category[]
  current:    FilterParams
}

// ─── Static config ────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'           },
  { value: 'newest',     label: 'Newest'             },
  { value: 'price-asc',  label: 'Price: Low → High'  },
  { value: 'price-desc', label: 'Price: High → Low'  },
] as const

const PRICE_RANGES = [
  { label: 'Any price',   min: undefined,  max: undefined  },
  { label: 'Under $50',   min: undefined,  max: '50'       },
  { label: '$50 – $150',  min: '50',       max: '150'      },
  { label: '$150 – $300', min: '150',      max: '300'      },
  { label: '$300+',       min: '300',      max: undefined  },
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildUrl(pathname: string, base: FilterParams, overrides: Partial<FilterParams>): string {
  const merged = { ...base, ...overrides }
  const params = new URLSearchParams()
  if (merged.q)        params.set('q',        merged.q)
  if (merged.category) params.set('category', merged.category)
  if (merged.sort)     params.set('sort',     merged.sort)
  if (merged.minPrice) params.set('minPrice', merged.minPrice)
  if (merged.maxPrice) params.set('maxPrice', merged.maxPrice)
  return `${pathname}${params.size ? `?${params}` : ''}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Filters({ categories, current }: Props) {
  const router   = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [mobileOpen, setMobileOpen] = useState(false)

  function navigate(overrides: Partial<FilterParams>) {
    startTransition(() => {
      router.push(buildUrl(pathname, current, overrides))
    })
  }

  const activeCount = [
    current.q,
    current.category,
    current.minPrice || current.maxPrice,
    current.sort && current.sort !== 'featured' ? current.sort : null,
  ].filter(Boolean).length

  const filterContent = (
    <div className={cn('space-y-6', isPending && 'opacity-60 pointer-events-none transition-opacity')}>

      {/* ── Search (Server Action form) ── */}
      <div>
        <label htmlFor="product-search" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Search
        </label>
        <form action={searchProducts} className="relative">
          {/* Pass active filters as hidden inputs so the action preserves them */}
          {current.category && <input type="hidden" name="category" value={current.category} />}
          {current.sort     && <input type="hidden" name="sort"     value={current.sort}     />}
          {current.minPrice && <input type="hidden" name="minPrice" value={current.minPrice} />}
          {current.maxPrice && <input type="hidden" name="maxPrice" value={current.maxPrice} />}

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="product-search"
              type="search"
              name="q"
              defaultValue={current.q}
              placeholder="Search products…"
              className={cn(
                'w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3',
                'text-sm text-foreground placeholder:text-muted-foreground',
                'focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/50',
                'transition-colors'
              )}
            />
          </div>
        </form>
      </div>

      {/* ── Sort ── */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Sort by
        </p>
        <div className="space-y-1">
          {SORT_OPTIONS.map(({ value, label }) => {
            const active = (current.sort ?? 'featured') === value
            return (
              <button
                key={value}
                onClick={() => navigate({ sort: value })}
                className={cn(
                  'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand/10 text-brand'
                    : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Category ── */}
      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Category
          </p>
          <div className="space-y-1">
            <button
              onClick={() => navigate({ category: undefined })}
              className={cn(
                'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                !current.category
                  ? 'bg-brand/10 text-brand'
                  : 'text-muted-foreground hover:bg-surface hover:text-foreground'
              )}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const active = current.category === cat.slug
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate({ category: active ? undefined : cat.slug })}
                  className={cn(
                    'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                    active
                      ? 'bg-brand/10 text-brand'
                      : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                  )}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Price range ── */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Price
        </p>
        <div className="space-y-1">
          {PRICE_RANGES.map(({ label, min, max }) => {
            const active =
              (current.minPrice ?? undefined) === min &&
              (current.maxPrice ?? undefined) === max
            return (
              <button
                key={label}
                onClick={() => navigate({ minPrice: min, maxPrice: max })}
                className={cn(
                  'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand/10 text-brand'
                    : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Clear all ── */}
      {activeCount > 0 && (
        <button
          onClick={() => navigate({ q: undefined, category: undefined, sort: undefined, minPrice: undefined, maxPrice: undefined })}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
        >
          <X className="size-3" />
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* ── Mobile toggle ── */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="glass flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            Filters
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </span>
          <motion.span
            animate={{ rotate: mobileOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="glass mt-2 rounded-xl p-4">
                {filterContent}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Filters</h2>
            {activeCount > 0 && (
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
                {activeCount} active
              </span>
            )}
          </div>
          {filterContent}
        </div>
      </div>
    </>
  )
}
