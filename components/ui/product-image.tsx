'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { Headphones } from 'lucide-react'

/**
 * Wraps next/image with an onError fallback so broken upstream URLs
 * (e.g. deleted Unsplash photos) degrade gracefully to a placeholder
 * instead of showing a broken image.
 */
export function ProductImage({
  fallbackClassName,
  ...props
}: ImageProps & { fallbackClassName?: string }) {
  const [broken, setBroken] = useState(false)

  if (broken) {
    return (
      <div className={fallbackClassName ?? 'flex h-full w-full items-center justify-center bg-surface'}>
        <Headphones className="size-16 text-muted-foreground/20" />
      </div>
    )
  }

  return (
    <Image
      {...props}
      onError={() => setBroken(true)}
    />
  )
}
