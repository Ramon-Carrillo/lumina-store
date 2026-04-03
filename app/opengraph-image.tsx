import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

// ─── Config ───────────────────────────────────────────────────────────────────

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'Lumina Store — Premium Sound, Elevated'

// ─── Image ────────────────────────────────────────────────────────────────────

export default function Image() {
  const buf = readFileSync(join(process.cwd(), 'public/og-image.png'))
  const src = `data:image/png;base64,${buf.toString('base64')}`

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
