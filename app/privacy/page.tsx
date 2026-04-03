import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Lumina Store collects, uses, and protects your personal data.',
}

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body:  'We collect information you provide directly — such as your name, email address, shipping address, and payment details when you place an order. We also collect usage data automatically, including your IP address, browser type, pages visited, and referring URLs, to improve our services.',
  },
  {
    title: '2. How We Use Your Information',
    body:  'We use your information to process orders and payments, send order confirmations and shipping updates, respond to support enquiries, and improve our website and product range. With your consent, we may also send marketing communications about new products, promotions, and audio tips.',
  },
  {
    title: '3. Payment Processing',
    body:  'All payment information is processed securely by Stripe, our payment provider. Lumina Store does not store your full card number, CVV, or banking credentials on our servers. Stripe\'s processing is governed by their own privacy policy and PCI-DSS compliance.',
  },
  {
    title: '4. Data Sharing',
    body:  'We do not sell, rent, or trade your personal information to third parties. We share data only with service providers necessary to fulfil your order (shipping carriers, payment processors) and as required by law. All third-party providers are contractually bound to protect your data.',
  },
  {
    title: '5. Cookies',
    body:  'We use essential cookies to maintain your session and shopping cart. Analytics cookies (if enabled) help us understand how visitors use the site so we can improve it. You can control cookies through your browser settings; disabling essential cookies may affect site functionality.',
  },
  {
    title: '6. Data Retention',
    body:  'We retain your personal data for as long as necessary to fulfil the purposes described in this policy, comply with legal obligations, and resolve disputes. Order records are typically retained for 7 years for tax and accounting purposes.',
  },
  {
    title: '7. Your Rights',
    body:  'You have the right to access, correct, or delete your personal data at any time. You may also object to processing, request data portability, or withdraw consent for marketing communications. To exercise these rights, contact us at hello@lumina.store.',
  },
  {
    title: '8. Security',
    body:  'We use industry-standard security measures — including TLS encryption, access controls, and regular security reviews — to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: '9. Children\'s Privacy',
    body:  'Our services are not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.',
  },
  {
    title: '10. Changes to This Policy',
    body:  'We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and, where appropriate, by email. Your continued use of our services after any change constitutes acceptance of the updated policy.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 border-b border-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Legal</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: January 1, 2026 · Effective immediately
          </p>
        </div>

        {/* Intro */}
        <p className="mb-10 text-base leading-relaxed text-muted-foreground">
          Your privacy matters to us. This policy explains what personal data Lumina Store collects, how we use it, and the choices you have. We are committed to handling your information responsibly and transparently.
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
          <Link href="/terms"   className="transition-colors hover:text-foreground">Terms of Service →</Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">Contact Us →</Link>
        </div>
      </div>
    </div>
  )
}
