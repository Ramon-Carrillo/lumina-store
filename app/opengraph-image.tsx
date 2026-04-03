import { ImageResponse } from 'next/og'

// ─── Config ───────────────────────────────────────────────────────────────────

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Lumina Store — Premium Sound, Elevated'

// ─── Colours (OKLch → approximated hex for Satori) ───────────────────────────

const BG      = '#0A0A0F'
const CARD    = '#111827'
const BRAND   = '#5060D7'
const PURPLE  = '#7B5DE8'
const TEXT    = '#F0F0F8'
const MUTED   = '#6B7280'

// ─── Image ────────────────────────────────────────────────────────────────────

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display:     'flex',
          flexDirection: 'column',
          width:       '100%',
          height:      '100%',
          background:  `linear-gradient(135deg, ${BG} 0%, ${CARD} 50%, #0D0D1A 100%)`,
          padding:     '72px 80px',
          fontFamily:  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          position:    'relative',
          overflow:    'hidden',
        }}
      >
        {/* ── Ambient orbs ── */}
        <div
          style={{
            position: 'absolute', top: -60, right: 80,
            width: 440, height: 440, borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND}28 0%, transparent 65%)`,
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: -80, left: 60,
            width: 320, height: 320, borderRadius: '50%',
            background: `radial-gradient(circle, ${PURPLE}20 0%, transparent 65%)`,
          }}
        />

        {/* ── Logo ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 56, height: 56, borderRadius: 16,
              background: BRAND,
            }}
          >
            {/* Headphones icon */}
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
              <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
          </div>
          <span style={{ color: TEXT, fontSize: 30, fontWeight: 700, letterSpacing: '-0.5px' }}>
            Lumina
          </span>
        </div>

        {/* ── Headline ── */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 64, flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{
                fontSize: 78, fontWeight: 900, lineHeight: 1.05,
                letterSpacing: '-2.5px', color: TEXT,
              }}
            >
              Premium Sound,
            </span>
            {/* Gradient "Elevated." — Satori supports background-clip: text */}
            <span
              style={{
                fontSize: 78, fontWeight: 900, lineHeight: 1.05,
                letterSpacing: '-2.5px',
                background: `linear-gradient(135deg, ${BRAND} 0%, ${PURPLE} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Elevated.
            </span>
          </div>

          <p style={{ fontSize: 26, color: MUTED, marginTop: 24, fontWeight: 400, lineHeight: 1.5 }}>
            Premium wireless earbuds and audio accessories,
            crafted for audiophiles.
          </p>
        </div>

        {/* ── Trust strip ── */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginTop: 48 }}>
          {['Free shipping over $99', '30-day returns', '2-year warranty'].map((label) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND }} />
              <span style={{ color: MUTED, fontSize: 18, fontWeight: 400 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Bottom brand line ── */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${BRAND} 0%, ${PURPLE} 100%)`,
          }}
        />
      </div>
    ),
    { ...size },
  )
}
