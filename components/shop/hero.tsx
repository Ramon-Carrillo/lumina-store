import Link from 'next/link'

/**
 * Hero — React Server Component.
 *
 * Previously a Client Component with three infinite framer-motion orb
 * animations on the LCP critical path. Lighthouse flagged that two
 * ways:
 *   - "Forced reflow" — the infinite y/x/scale animations transformed
 *     elements every frame, forcing the layout engine to re-flow.
 *   - "Reduce JavaScript execution time" — framer-motion's animation
 *     engine had to boot before the hero rendered.
 *
 * The visual effect (gentle drifting orbs + staggered text fade-in +
 * scroll cue) is now CSS-only:
 *   - `animate-orb-drift` for the orbs (transform-only, GPU-friendly)
 *   - `animate-hero-fade` for the staggered text (per-child
 *     `animation-delay` set inline). Uses `animation-fill-mode: both`,
 *     so the element sits at the FROM keyframe (opacity 0) during the
 *     delay and stays at TO (opacity 1) after.
 *   - `animate-hero-scroll-cue` for the dot inside the scroll indicator
 * `prefers-reduced-motion: reduce` is honoured in globals.css — those
 * animations are disabled and the elements snap to their visible state.
 *
 * Note: we intentionally don't use Tailwind's `motion-safe:` variant
 * here. In Tailwind v4 that variant does not compose cleanly onto
 * custom CSS animation classes defined outside the `@theme` block —
 * the resulting class compiles to nothing, leaving the bare
 * `opacity-0` and an invisible hero. Handling reduced motion in plain
 * CSS sidesteps the issue and keeps the markup simpler.
 */

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background">

      {/* ── Ambient gradient orbs — pure CSS infinite drift ──────
          `transform`-only animations (translate + scale) hit the
          compositor without triggering layout/paint, so they don't
          cost main-thread work or fire forced-reflow warnings.
          Negative `animation-delay` starts each orb mid-cycle so
          they're out of phase, matching the framer version. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 -top-48 h-[640px] w-[640px] rounded-full bg-brand/10 blur-[140px] animate-orb-drift"
        style={{ animationDuration: '11s', animationDelay: '0s' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-64 top-1/4 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[120px] animate-orb-drift"
        style={{ animationDuration: '13s', animationDelay: '-2.5s' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/3 h-[420px] w-[420px] rounded-full bg-brand/[7%] blur-[100px] animate-orb-drift"
        style={{ animationDuration: '9s', animationDelay: '-5s' }}
      />

      {/* ── Subtle grid overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(oklch(0 0 0 / 5%) 1px, transparent 1px),' +
            'linear-gradient(90deg, oklch(0 0 0 / 5%) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">

        {/* Badge */}
        <div className="mb-7 flex justify-center animate-hero-fade" style={{ animationDelay: '0ms' }}>
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            New Collection · 2026
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-6 text-5xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem] animate-hero-fade"
          style={{ animationDelay: '130ms' }}
        >
          Premium Sound,{' '}
          <br className="hidden sm:block" />
          <span className="text-gradient">Elevated</span>
        </h1>

        {/* Sub-headline */}
        <p
          className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl animate-hero-fade"
          style={{ animationDelay: '260ms' }}
        >
          Wireless earbuds and audio gear crafted for those&nbsp;who demand&nbsp;the&nbsp;best
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col items-center justify-center gap-3 sm:flex-row animate-hero-fade"
          style={{ animationDelay: '390ms' }}
        >
          <Link
            href="/products"
            className="glow-brand inline-flex items-center justify-center rounded-full bg-brand px-9 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:bg-brand/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Shop Now
          </Link>
          <Link
            href="/products"
            className="glass inline-flex items-center justify-center rounded-full px-9 py-4 text-base font-medium text-foreground transition-all duration-200 hover:bg-black/[5%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Explore Collection
          </Link>
        </div>

        {/* Social proof */}
        <p
          className="mt-10 text-sm text-muted-foreground animate-hero-fade"
          style={{ animationDelay: '520ms' }}
        >
          Trusted by&nbsp;
          <span className="font-semibold text-foreground">12,000+</span>
          &nbsp;audiophiles worldwide
        </p>
      </div>

      {/* ── Scroll indicator — fades in late, dot bobs forever ── */}
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-hero-fade"
        style={{ animationDelay: '1400ms' }}
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1.5">
          <div className="h-2 w-[3px] rounded-full bg-brand animate-hero-scroll-cue" />
        </div>
      </div>
    </section>
  )
}
