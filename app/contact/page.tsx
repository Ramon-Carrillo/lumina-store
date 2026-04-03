'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Clock, MapPin, ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const CONTACT_INFO = [
  {
    icon:  Mail,
    title: 'Email us',
    body:  'hello@lumina.store',
    sub:   'We reply within 24 hours',
  },
  {
    icon:  MessageSquare,
    title: 'Live chat',
    body:  'Available in the app',
    sub:   'Mon–Fri, 9 am–6 pm EST',
  },
  {
    icon:  Clock,
    title: 'Support hours',
    body:  'Mon–Fri 9 am–6 pm',
    sub:   'Eastern Standard Time',
  },
  {
    icon:  MapPin,
    title: 'Headquarters',
    body:  'New York, NY',
    sub:   'United States',
  },
]

const SUBJECTS = [
  'Order enquiry',
  'Product question',
  'Returns & warranty',
  'Partnership',
  'Press',
  'Other',
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Form submission not yet implemented — UI demo only
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="border-b border-border bg-card py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Contact</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            Questions about an order, a product, or just want to say hi? Fill in the form and we&apos;ll get back to you within one business day.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">

          {/* ── Form ── */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border bg-card py-20 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="size-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Message sent!</h2>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    Thanks for reaching out. We&apos;ll reply to your inbox within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-brand transition-colors hover:text-brand/80"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Alex Reyes"
                      className={cn(
                        'w-full rounded-lg border border-border bg-card px-3.5 py-2.5',
                        'text-sm text-foreground placeholder:text-muted-foreground',
                        'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors'
                      )}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className={cn(
                        'w-full rounded-lg border border-border bg-card px-3.5 py-2.5',
                        'text-sm text-foreground placeholder:text-muted-foreground',
                        'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors'
                      )}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground">
                    Subject
                  </label>
                  <select
                    id="subject"
                    required
                    defaultValue=""
                    className={cn(
                      'w-full rounded-lg border border-border bg-card px-3.5 py-2.5',
                      'text-sm text-foreground',
                      'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors'
                    )}
                  >
                    <option value="" disabled>Select a subject…</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Order number (optional) */}
                <div>
                  <label htmlFor="order" className="mb-1.5 block text-sm font-medium text-foreground">
                    Order number{' '}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    id="order"
                    type="text"
                    placeholder="LMN-XXXX"
                    className={cn(
                      'w-full rounded-lg border border-border bg-card px-3.5 py-2.5',
                      'text-sm text-foreground placeholder:text-muted-foreground',
                      'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors'
                    )}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className={cn(
                      'w-full resize-none rounded-lg border border-border bg-card px-3.5 py-2.5',
                      'text-sm text-foreground placeholder:text-muted-foreground',
                      'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors'
                    )}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-8 py-3',
                    'bg-primary text-sm font-semibold text-primary-foreground glow-brand',
                    'transition-all hover:bg-primary/90 hover:scale-[1.02]',
                    'disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100'
                  )}
                >
                  {loading ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>Send Message <ArrowRight className="size-4" /></>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Contact info ── */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {CONTACT_INFO.map(({ icon: Icon, title, body, sub }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                  <Icon className="size-4 text-brand" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">{body}</p>
                  <p className="text-xs text-muted-foreground/70">{sub}</p>
                </div>
              </div>
            ))}

            {/* FAQ nudge */}
            <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
              <p className="text-sm font-semibold text-foreground">Looking for quick answers?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check our product pages for specs, warranty info, and compatibility details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
