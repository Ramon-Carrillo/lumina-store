'use server'

// ─── Return type ──────────────────────────────────────────────────────────────

export type CartActionResult = { ok: true } | { ok: false; error: string }

// ─── Actions ─────────────────────────────────────────────────────────────────
//
// These Server Actions are the authoritative write-path for cart mutations.
// They validate inputs and persist to the DB when auth/session is wired up.
// Until then the client-side CartProvider is the runtime source of truth, and
// these actions return { ok: true } so callers can detect server-side failures.

export async function addToCartAction(
  productId: string,
  quantity: number,
  variantId?: string,
): Promise<CartActionResult> {
  if (!productId)      return { ok: false, error: 'Product ID is required.' }
  if (quantity < 1)    return { ok: false, error: 'Quantity must be at least 1.' }
  if (quantity > 100)  return { ok: false, error: 'Quantity cannot exceed 100.' }

  // TODO: persist once session/auth is set up
  // const sessionId = (await cookies()).get('session_id')?.value
  // await prisma.cartItem.upsert({ ... })

  return { ok: true }
}

export async function removeFromCartAction(
  productId: string,
  variantId?: string,
): Promise<CartActionResult> {
  if (!productId) return { ok: false, error: 'Product ID is required.' }
  // TODO: prisma.cartItem.deleteMany({ where: { ... } })
  return { ok: true }
}

export async function updateCartQtyAction(
  productId: string,
  quantity: number,
  variantId?: string,
): Promise<CartActionResult> {
  if (!productId)   return { ok: false, error: 'Product ID is required.' }
  if (quantity < 0) return { ok: false, error: 'Quantity cannot be negative.' }
  // TODO: prisma.cartItem.update({ ... })
  return { ok: true }
}

export async function clearCartAction(): Promise<CartActionResult> {
  // TODO: prisma.cart.update({ where: { ... }, data: { items: { deleteMany: {} } } })
  return { ok: true }
}
