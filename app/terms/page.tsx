import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Lumina Store terms of service and conditions of use.',
}

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body:  'By accessing or using the Lumina Store website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
  },
  {
    title: '2. Products and Pricing',
    body:  'All prices are displayed in USD and are subject to change without notice. We reserve the right to discontinue any product at any time. Product images are for illustrative purposes and may differ slightly from the actual product.',
  },
  {
    title: '3. Orders and Payment',
    body:  'By placing an order you confirm that all information provided is accurate and complete. Payment is processed securely via Stripe. We reserve the right to cancel any order at our discretion, in which case a full refund will be issued.',
  },
  {
    title: '4. Shipping and Delivery',
    body:  'We ship to most countries worldwide. Delivery times vary by destination. Risk of loss and title for items purchased pass to you upon delivery. We are not responsible for delays caused by customs or carrier issues beyond our control.',
  },
  {
    title: '5. Returns and Refunds',
    body:  'We offer a 30-day return policy for unused items in original packaging. To initiate a return, contact us at hello@lumina.store. Refunds are processed within 5–10 business days of receiving the returned item. Shipping costs are non-refundable unless the return is due to a defect.',
  },
  {
    title: '6. Warranty',
    body:  'Lumina products are covered by a limited manufacturer warranty against defects in materials and workmanship for the period stated on each product page (12 or 24 months). This warranty does not cover damage caused by misuse, accidents, or unauthorized modifications.',
  },
  {
    title: '7. Intellectual Property',
    body:  'All content on this website — including text, images, logos, and software — is the property of Lumina Store or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce or distribute any content without express written permission.',
  },
  {
    title: '8. Limitation of Liability',
    body:  'To the fullest extent permitted by law, Lumina Store shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services, even if we have been advised of the possibility of such damages.',
  },
  {
    title: '9. Changes to Terms',
    body:  'We reserve the right to update these Terms of Service at any time. Continued use of our services following any changes constitutes acceptance of the new terms. We will notify registered users of significant changes via email.',
  },
  {
    title: '10. Contact',
    body:  'If you have questions about these Terms, please contact us at hello@lumina.store or visit our Contact page.',
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 border-b border-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Legal</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: January 1, 2026 · Effective immediately
          </p>
        </div>

        {/* Intro */}
        <p className="mb-10 text-base leading-relaxed text-muted-foreground">
          Please read these terms carefully before using the Lumina Store website or purchasing our products. These terms govern your use of our services and constitute a legally binding agreement between you and Lumina Store.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map(({ title, body }) => (
            <section key={title}>
              <h2 className="mb-2 text-base font-semibold text-foreground">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </section>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
          <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy Policy →</Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">Contact Us →</Link>
        </div>
      </div>
    </div>
  )
}
