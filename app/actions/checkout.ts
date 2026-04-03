'use server'

import { headers } from 'next/headers'
import { stripe, toCents, isStripeImageUrl } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckoutItem = {
  id:          string   // productId
  name:        string
  slug:        string
  price:       number   // client-side price — will be verified against DB
  image?:      string
  quantity:    number
  variantId?:  string
  variantName?: string
}

export type CheckoutResult =
  | { success: true;  url: string }
  | { success: false; error: string }

// ─── Server Action ────────────────────────────────────────────────────────────

/**
 * Creates a Stripe Checkout Session for the supplied cart items.
 *
 * SECURITY: prices are re-fetched from the database and the client-supplied
 * `price` value is intentionally ignored. This prevents cart-poisoning attacks
 * where a malicious client submits a manipulated price.
 *
 * Returns the hosted Stripe Checkout URL on success, or an error string that
 * is safe to display directly in the UI.
 */
export async function createCheckoutSession(
  items: CheckoutItem[]
): Promise<CheckoutResult> {
  // ── 1. Input validation ────────────────────────────────────────────────────

  if (!items || items.length === 0) {
    return { success: false, error: 'Your cart is empty.' }
  }

  for (const item of items) {
    if (!item.id)          return { success: false, error: 'Invalid cart item: missing product ID.' }
    if (item.quantity < 1) return { success: false, error: `Invalid quantity for "${item.name}".` }
    if (item.quantity > 99) return { success: false, error: `Quantity for "${item.name}" exceeds the maximum of 99.` }
  }

  // ── 2. Verify prices and stock from the database ───────────────────────────

  const productIds = [...new Set(items.map((i) => i.id))]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbProducts: any[] = await prisma.product.findMany({
    where: { id: { in: productIds }, published: true },
    include: {
      variants: { select: { id: true, name: true, price: true, stock: true } },
      images:   { select: { url: true }, orderBy: { position: 'asc' }, take: 1 },
    },
  })

  const productMap = new Map(dbProducts.map((p: any) => [p.id as string, p]))

  // Build verified line items
  const lineItems: {
    price_data: {
      currency: string
      unit_amount: number
      product_data: {
        name: string
        images?: string[]
        metadata: { product_id: string; variant_id: string }
      }
    }
    quantity: number
  }[] = []

  for (const item of items) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const product: any = productMap.get(item.id)

    if (!product) {
      return {
        success: false,
        error: `"${item.name}" is no longer available. Please remove it from your cart.`,
      }
    }

    // Resolve the authoritative unit price
    let unitPrice: number = Number(product.price)

    if (item.variantId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const variant = product.variants.find((v: any) => v.id === item.variantId)
      if (!variant) {
        return {
          success: false,
          error: `The selected variant of "${item.name}" is no longer available.`,
        }
      }
      if (variant.price !== null) {
        unitPrice = Number(variant.price)
      }
      // Stock check for variant
      if (variant.stock < item.quantity) {
        return {
          success: false,
          error: `Only ${variant.stock} unit(s) of "${item.name}" (${variant.name}) are in stock.`,
        }
      }
    } else {
      // Stock check for base product
      if (product.stock < item.quantity) {
        return {
          success: false,
          error: `Only ${product.stock} unit(s) of "${item.name}" are in stock.`,
        }
      }
    }

    const displayName = item.variantName
      ? `${product.name} — ${item.variantName}`
      : product.name

    const imageUrl: string | undefined = product.images?.[0]?.url

    lineItems.push({
      price_data: {
        currency: 'usd',
        unit_amount: toCents(unitPrice),
        product_data: {
          name: displayName,
          // Stripe rejects non-https image URLs
          ...(isStripeImageUrl(imageUrl) && { images: [imageUrl] }),
          metadata: {
            product_id: product.id,
            variant_id: item.variantId ?? '',
          },
        },
      },
      quantity: item.quantity,
    })
  }

  // ── 3. Resolve the base URL for redirect targets ───────────────────────────

  // In production, set NEXT_PUBLIC_BASE_URL (e.g. https://lumina.store).
  // In development, derive it from the incoming request headers.
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '')

  if (!baseUrl) {
    const hdrs = await headers()
    const host = hdrs.get('host') ?? 'localhost:3000'
    const proto = hdrs.get('x-forwarded-proto') ?? 'http'
    baseUrl = `${proto}://${host}`
  }

  // ── 4. Build compact cart metadata for the webhook ─────────────────────────
  //
  // The webhook uses this to reconstruct the order without re-querying the
  // Stripe line items list.  Stripe metadata values are limited to 500 chars;
  // for very large carts a production app would create a pending Order row in
  // the DB and pass its ID via `client_reference_id` instead.

  const cartMeta = JSON.stringify(
    items.map((i) => ({
      id:  i.id,
      qty: i.quantity,
      vid: i.variantId ?? null,
    }))
  )

  // ── 5. Create the Stripe Checkout Session ─────────────────────────────────

  let session
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,

      // Redirect URLs — {CHECKOUT_SESSION_ID} is replaced by Stripe
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/checkout/cancelled`,

      // Collect a shipping address at checkout
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'JP', 'SG'],
      },

      // Automatically compute billing address
      billing_address_collection: 'auto',

      // Let customers apply promo / coupon codes
      allow_promotion_codes: true,

      // Collect the customer's phone number for order fulfilment
      phone_number_collection: { enabled: true },

      // Metadata for the webhook handler
      metadata: {
        cart: cartMeta.slice(0, 500), // hard cap at Stripe's 500-char limit
      },

      // --- Production pattern (uncomment when auth is wired up) ---
      // client_reference_id: pendingOrderId,
      // customer_email: session?.user?.email ?? undefined,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[createCheckoutSession] Stripe error:', message)
    return { success: false, error: 'Could not start checkout. Please try again.' }
  }

  if (!session.url) {
    return { success: false, error: 'Stripe did not return a checkout URL.' }
  }

  return { success: true, url: session.url }
}
