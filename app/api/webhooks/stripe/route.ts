import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
// import { prisma } from '@/lib/prisma'  // ← uncomment when DB is set up

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse the compact cart metadata stored on the Stripe session.
 * Shape: [{ id: string, qty: number, vid: string | null }]
 */
function parseCartMeta(
  raw: string | undefined
): { id: string; qty: number; vid: string | null }[] {
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

// ─── Webhook handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[webhook] Signature verification failed:', message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // ── Route by event type ────────────────────────────────────────────────────

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Only process sessions that are fully paid (not awaiting payment)
      if (session.payment_status !== 'paid') break

      await handleCheckoutCompleted(session)
      break
    }

    case 'checkout.session.async_payment_succeeded': {
      // Fires for "pay later" methods (e.g. ACH bank transfer) once funds clear
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutCompleted(session)
      break
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.warn('[webhook] Async payment failed for session:', session.id)
      // TODO: notify the customer their payment method failed
      break
    }

    default:
      // Unhandled event types — safe to ignore
      break
  }

  return NextResponse.json({ received: true })
}

// ─── checkout.session.completed handler ───────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('[webhook] Processing completed session:', session.id)

  // ── Extract order data from the session ───────────────────────────────────

  const cartItems  = parseCartMeta(session.metadata?.cart)
  const email      = session.customer_details?.email ?? null
  const amountTotal = session.amount_total ?? 0

  // shipping_details moved to collected_information in newer Stripe API versions;
  // cast to any to stay compatible across SDK releases.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shipping = (session as any).collected_information?.shipping_details
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?? (session as any).shipping_details

  const shippingAddress = shipping?.address
    ? {
        line1:      shipping.address.line1        ?? '',
        line2:      shipping.address.line2        ?? null,
        city:       shipping.address.city         ?? '',
        state:      shipping.address.state        ?? null,
        postalCode: shipping.address.postal_code  ?? '',
        country:    shipping.address.country      ?? '',
      }
    : null

  // ── Idempotency guard ─────────────────────────────────────────────────────
  //
  // Stripe may deliver the same webhook more than once. The session.id is
  // stable and unique — use it as the idempotency key when writing to the DB.
  //
  // TODO: uncomment and adapt when Prisma is set up
  //
  // const existing = await prisma.order.findUnique({
  //   where: { stripeSessionId: session.id },
  // })
  // if (existing) {
  //   console.log('[webhook] Session already processed, skipping:', session.id)
  //   return
  // }

  // ── Create Order in the database ──────────────────────────────────────────
  //
  // TODO: uncomment and adapt when Prisma is set up
  //
  // await prisma.$transaction(async (tx) => {
  //   // 1. Create the order header
  //   const order = await tx.order.create({
  //     data: {
  //       stripeSessionId:   session.id,
  //       stripePaymentIntent: typeof session.payment_intent === 'string'
  //         ? session.payment_intent
  //         : null,
  //       email,
  //       amountTotal,           // stored in cents
  //       currency:              session.currency ?? 'usd',
  //       status:                'PAID',
  //       shippingName:          shipping?.name ?? null,
  //       shippingAddressJson:   shippingAddress
  //         ? JSON.stringify(shippingAddress)
  //         : null,
  //     },
  //   })
  //
  //   // 2. Create order line items
  //   await tx.orderItem.createMany({
  //     data: cartItems.map((item) => ({
  //       orderId:   order.id,
  //       productId: item.id,
  //       variantId: item.vid ?? null,
  //       quantity:  item.qty,
  //     })),
  //   })
  //
  //   // 3. Decrement stock for each item
  //   for (const item of cartItems) {
  //     if (item.vid) {
  //       await tx.productVariant.update({
  //         where: { id: item.vid },
  //         data:  { stock: { decrement: item.qty } },
  //       })
  //     } else {
  //       await tx.product.update({
  //         where: { id: item.id },
  //         data:  { stock: { decrement: item.qty } },
  //       })
  //     }
  //   }
  // })

  // ── Log summary (remove in production) ───────────────────────────────────

  console.log('[webhook] Order created:', {
    sessionId: session.id,
    email,
    amountTotal,
    itemCount: cartItems.length,
    shippingAddress,
  })
}
