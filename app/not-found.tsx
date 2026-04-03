'use client'

import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { Home, ArrowRight, Headphones } from 'lucide-react'

// ─── Variants ─────────────────────────────────────────────────────────────────

const container: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4">

      {/* ── Ambient background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-[15%] top-[20%] h-[460px] w-[460px] rounded-full bg-brand/6 blur-[100px]" />
        <div className="absolute right-[10%] bottom-[15%] h-[360px] w-[360px] rounded-full bg-gold/7 blur-[90px]" />
        <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/5 blur-[60px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* ── Icon ── */}
        <motion.div variants={item} className="relative mb-8">
          <div className="flex size-24 items-center justify-center rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-[0_0_60px_oklch(0.52_0.22_268/12%)]">
            <Headphones className="size-10 text-brand" />
          </div>
          {/* Ping ring */}
          <motion.div
            className="absolute inset-0 rounded-3xl border border-brand/20"
            animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.div>

        {/* ── 404 ── */}
        <motion.div variants={item} className="relative mb-2">
          <span
            className="text-gradient select-none text-[clamp(96px,18vw,160px)] font-black leading-none tracking-tighter"
            aria-hidden
          >
            404
          </span>
          {/* Glow */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-8 w-40 rounded-full bg-brand/25 blur-xl" />
        </motion.div>

        {/* ── Copy ── */}
        <motion.h1 variants={item} className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Nothing here but silence
        </motion.h1>
        <motion.p
          variants={item}
          className="mx-auto mt-3 max-w-sm text-base text-muted-foreground"
        >
          The page you&apos;re looking for has been moved, deleted, or never existed.
          Let&apos;s get you back to the good stuff.
        </motion.p>

        {/* ── Actions ── */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand/90 hover:scale-[1.02] glow-brand"
          >
            Browse products
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-surface"
          >
            <Home className="size-4" />
            Return home
          </Link>
        </motion.div>

        {/* ── Subtle nav hint ── */}
        <motion.p variants={item} className="mt-8 text-xs text-muted-foreground/60">
          If you typed a URL, double-check for typos.
        </motion.p>
      </motion.div>
    </div>
  )
}
