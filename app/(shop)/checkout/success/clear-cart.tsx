'use client'

import { useEffect } from 'react'
import { useCart } from '@/components/providers/cart-provider'

/**
 * Invisible client component rendered inside the success Server Component.
 * Clears the cart once on mount — the only way to trigger client-side state
 * mutation from within a Server Component subtree.
 */
export function ClearCart() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return null
}
