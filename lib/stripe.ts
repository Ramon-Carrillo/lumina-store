import Stripe from 'stripe'

// ─── Singleton client ─────────────────────────────────────────────────────────
//
// Fail fast at module load if the key is missing — better than a cryptic error
// when the first API call is made.

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'Missing environment variable: STRIPE_SECRET_KEY\n' +
    'Add it to your .env file. See .env.example for the full list of required variables.'
  )
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
  // Typed as Stripe.LatestApiVersion — update this comment when bumping the SDK
  typescript: true,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a decimal price (e.g. 149.99) to Stripe's integer cent format (14999).
 * Stripe always works in the smallest currency unit.
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100)
}

/**
 * Convert Stripe's integer cent amount back to a display decimal (14999 → 149.99).
 */
export function fromCents(cents: number): number {
  return cents / 100
}

/**
 * Returns true only if the URL starts with https:// — Stripe rejects non-HTTPS
 * product image URLs (localhost & plain http will silently be ignored).
 */
export function isStripeImageUrl(url: string | undefined | null): url is string {
  if (!url) return false
  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}
