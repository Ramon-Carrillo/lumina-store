import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'

// ─── Config ───────────────────────────────────────────────────────────────────
//
// Using 'nodejs' runtime because Prisma requires Node.js (not edge).

export const runtime     = 'nodejs'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG     = '#0A0A0F'
const CARD   = '#111827'
const BRAND  = '#5060D7'
const PURPLE = '#7B5DE8'
const TEXT   = '#F0F0F8'
const MUTED  = '#6B7280'
const DIM    = '#374151'

// ─── Image ────────────────────────────────────────────────────────────────────

export default async function Image({
  params,
}: {
  // params is a Promise in Next.js 16
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any = await prisma.product.findUnique({
    where:  { slug, published: true },
    select: {
      name:              true,
      price:             true,
      compareAt:         true,
      noiseCancellation: true,
      batteryLife:       true,
      waterResistance:   true,
      images:            { take: 1, orderBy: { position: 'asc' }, select: { url: true } },
      category:          { select: { name: true } },
    },
  })

  const name        = raw?.name      ?? 'Lumina Product'
  const categoryName = raw?.category?.name ?? ''
  const price       = raw ? `$${Number(raw.price).toFixed(2)}` : ''
  const compareAt   = raw?.compareAt ? `$${Number(raw.compareAt).toFixed(2)}` : null
  const imageUrl    = raw?.images?.[0]?.url as string | undefined
  const hasImage    = !!imageUrl?.startsWith('https://')

  const badges: string[] = [
    raw?.noiseCancellation  ? 'ANC'             : '',
    raw?.waterResistance    ? raw.waterResistance : '',
    raw?.batteryLife        ? `${raw.batteryLife}h battery` : '',
  ].filter(Boolean)

  return new ImageResponse(
    (
      <div
        style={{
          display:    'flex',
          width:      '100%',
          height:     '100%',
          background: `linear-gradient(135deg, ${BG} 0%, ${CARD} 100%)`,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          overflow:   'hidden',
        }}
      >
        {/* ── Left: product info ─────────────────────────────────────────── */}
        <div
          style={{
            display:       'flex',
            flexDirection: 'column',
            flex:          1,
            padding:       '64px 60px',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 42, height: 42, borderRadius: 12, background: BRAND,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
                <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <span style={{ color: MUTED, fontSize: 20, fontWeight: 600 }}>Lumina Store</span>
          </div>

          {/* Category + Name */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 52, flex: 1 }}>
            {categoryName && (
              <span
                style={{
                  fontSize: 15, fontWeight: 700, color: BRAND,
                  textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 14,
                }}
              >
                {categoryName}
              </span>
            )}
            <h1
              style={{
                fontSize:      name.length > 28 ? 44 : 56,
                fontWeight:    900,
                lineHeight:    1.1,
                letterSpacing: '-1.5px',
                color:         TEXT,
                margin:        0,
              }}
            >
              {name}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 20 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: BRAND }}>{price}</span>
              {compareAt && (
                <span style={{ fontSize: 22, color: MUTED, textDecoration: 'line-through' }}>
                  {compareAt}
                </span>
              )}
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 32 }}>
              {badges.map((b) => (
                <div
                  key={b}
                  style={{
                    padding:      '6px 16px',
                    borderRadius: 9999,
                    border:       `1px solid ${DIM}`,
                    color:        MUTED,
                    fontSize:     14,
                    fontWeight:   600,
                  }}
                >
                  {b}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: product image ───────────────────────────────────────── */}
        {hasImage ? (
          <div
            style={{
              display:  'flex',
              width:    460,
              height:   '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Left fade-out gradient */}
            <div
              style={{
                position:   'absolute', inset: 0, zIndex: 1,
                background: `linear-gradient(to right, ${BG} 0%, transparent 35%)`,
              }}
            />
            <img
              src={imageUrl}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          /* Fallback glow orb */
          <div
            style={{
              display:        'flex',
              width:          460,
              alignItems:     'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width:        300,
                height:       300,
                borderRadius: '50%',
                background:   `radial-gradient(circle, ${BRAND}30 0%, ${PURPLE}18 50%, transparent 70%)`,
              }}
            />
          </div>
        )}

        {/* ── Brand accent bar at bottom ─────────────────────────────────── */}
        <div
          style={{
            position:   'absolute',
            bottom:     0,
            left:       0,
            right:      0,
            height:     4,
            background: `linear-gradient(90deg, ${BRAND} 0%, ${PURPLE} 100%)`,
          }}
        />
      </div>
    ),
    { ...size },
  )
}
