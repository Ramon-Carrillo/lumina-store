import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

// ─── Config ───────────────────────────────────────────────────────────────────

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Lumina Store — Premium Sound, Elevated'

// ─── Image ────────────────────────────────────────────────────────────────────

export default function Image() {
  let src: string

  try {
    const buf = readFileSync(join(process.cwd(), 'public/og-image.png'))
    src = `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    // Fallback: render a branded OG image when the static file isn't accessible
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0A0A0F 0%, #111827 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 64, fontWeight: 900, color: '#F0F0F8', letterSpacing: '-2px' }}>
              Lumina Store
            </span>
            <span style={{ fontSize: 24, color: '#6B7280' }}>
              Premium Sound, Elevated
            </span>
          </div>
        </div>
      ),
      { ...size },
    )
  }

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        width={1200}
        height={630}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        alt=""
      />
    ),
    { ...size },
  )
}
