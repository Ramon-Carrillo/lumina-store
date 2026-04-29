'use client'

import { useEffect, useRef } from 'react'
import { useCart } from '@/components/providers/cart-provider'

/**
 * Invisible client component rendered inside the success Server Component.
 * Clears the cart once on mount — the only way to trigger client-side state
 * mutation from within a Server Component subtree.
 *
 * Uses a ref guard so the effect can't re-fire even if `clearCart`'s
 * reference shifts (it shouldn't — the provider memoises it — but
 * belt-and-braces). Empty dep array + ref guard = exactly one dispatch
 * per page mount, no infinite loop.
 */
export function ClearCart() {
  const { clearCart } = useCart()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
