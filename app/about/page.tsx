import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Headphones, Zap, ShieldCheck, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The story behind Lumina — premium wireless audio engineered for audiophiles.',
}

const VALUES = [
  {
    icon:  Headphones,
    title: 'Sound First',
    body:  'Every design decision starts with one question: does it make the music better? Acoustics, driver materials, and tuning are never compromised for cost.',
  },
  {
    icon:  Zap,
    title: 'Relentless Innovation',
    body:  'From beryllium drivers to LDAC lossless streaming, we adopt new technology only when it genuinely improves your listening experience.',
  },
  {
    icon:  ShieldCheck,
    title: 'Built to Last',
    body:  'Every Lumina product ships with a 2-year warranty and is designed to withstand years of daily use — not just the first few weeks.',
  },
  {
    icon:  Globe,
    title: 'Global Community',
    body:  'With over 12,000 customers across 60+ countries, Lumina is built by listeners, for listeners — feedback from our community shapes every product.',
  },
]

const TEAM = [
  { name: 'Sofia Andersson', role: 'Founder & CEO',         initials: 'SA' },
  { name: 'Marcus Chen',     role: 'Head of Acoustics',      initials: 'MC' },
  { name: 'Priya Nair',      role: 'Lead Product Designer',  initials: 'PN' },
  { name: 'James O\'Brien',  role: 'Software Engineering',   initials: 'JO' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border bg-card py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.52 0.22 268 / 20%) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
            Our Story
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Audio engineered for{' '}
            <span className="text-gradient">audiophiles</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Lumina was founded in 2021 with a single belief: premium sound shouldn&apos;t require
            a premium-priced compromise. We obsess over every Hz so you don&apos;t have to.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                Mission
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                We believe great audio is transformative
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                There&apos;s a moment when you put on a great pair of headphones and hear something
                in a track you&apos;ve listened to a hundred times — a detail, a breath, a note
                that was always there but never reached you. That moment is what we build for.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Every product in the Lumina lineup — from our flagship Max headphones down to
                the $14.99 ear tips — is engineered with the same obsessive attention to sonic
                quality and physical craftsmanship.
              </p>
              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg glow-brand"
              >
                Explore our products
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { stat: '12,000+', label: 'Happy customers'      },
                { stat: '60+',     label: 'Countries shipped to'  },
                { stat: '19',      label: 'Products in the range' },
                { stat: '4.8★',    label: 'Average review score'  },
              ].map(({ stat, label }) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-6 text-center">
                  <p className="text-3xl font-bold text-foreground">{stat}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">Values</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What drives us
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-background p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10">
                  <Icon className="size-5 text-brand" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">Team</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The people behind the sound
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(({ name, role, initials }) => (
              <div key={name} className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-brand/10 text-xl font-bold text-brand">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-card py-20 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-2xl font-bold text-foreground">Ready to hear the difference?</h2>
          <p className="mt-3 text-muted-foreground">
            Browse our full range and find the audio gear that fits your life.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground glow-brand transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              Shop Now <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
