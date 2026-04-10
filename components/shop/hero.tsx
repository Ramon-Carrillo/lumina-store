'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Link from 'next/link'

/* ── Floating gradient orb ───────────────────────────────────────────────── */
function FloatingOrb({
  className,
  delay = 0,
  duration = 10,
}: {
  className: string
  delay?: number
  duration?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      animate={
        reduce
          ? undefined
          : { y: [0, -36, 0], x: [0, 18, 0], scale: [1, 1.06, 1] }
      }
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* ── Stagger container / item variants ──────────────────────────────────── */
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
}

const item: Variants = {
  hidden:   { opacity: 0, y: 28 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background">

      {/* ── Ambient gradient orbs ── */}
      <FloatingOrb
        className="pointer-events-none absolute -left-48 -top-48 h-[640px] w-[640px] rounded-full bg-brand/10 blur-[140px]"
        delay={0}
        duration={11}
      />
      <FloatingOrb
        className="pointer-events-none absolute -right-64 top-1/4 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[120px]"
        delay={2.5}
        duration={13}
      />
      <FloatingOrb
        className="pointer-events-none absolute -bottom-32 left-1/3 h-[420px] w-[420px] rounded-full bg-brand/[7%] blur-[100px]"
        delay={5}
        duration={9}
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
      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={item} className="mb-7 flex justify-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            New Collection · 2026
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="mb-6 text-5xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        >
          Premium Sound,{' '}
          <br className="hidden sm:block" />
          <span className="text-gradient">Elevated</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={item}
          className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          Wireless earbuds and audio gear crafted for those&nbsp;who demand&nbsp;the&nbsp;best
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
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
        </motion.div>

        {/* Social proof */}
        <motion.p
          variants={item}
          className="mt-10 text-sm text-muted-foreground"
        >
          Trusted by&nbsp;
          <span className="font-semibold text-foreground">12,000+</span>
          &nbsp;audiophiles worldwide
        </motion.p>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1.5">
          <motion.div
            className="h-2 w-[3px] rounded-full bg-brand"
            animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
