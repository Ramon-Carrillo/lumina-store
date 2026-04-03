'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Headphones, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [password, setPassword]         = useState('')

  const rules = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'One uppercase letter',  pass: /[A-Z]/.test(password) },
    { label: 'One number',            pass: /\d/.test(password)    },
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Auth not yet implemented — UI demo only
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary">
            <Headphones className="size-6 text-primary-foreground" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Join 12,000+ audiophiles on Lumina
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Alex Reyes"
                className={cn(
                  'w-full rounded-lg border border-border bg-background px-3.5 py-2.5',
                  'text-sm text-foreground placeholder:text-muted-foreground',
                  'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50',
                  'transition-colors'
                )}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className={cn(
                  'w-full rounded-lg border border-border bg-background px-3.5 py-2.5',
                  'text-sm text-foreground placeholder:text-muted-foreground',
                  'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50',
                  'transition-colors'
                )}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    'w-full rounded-lg border border-border bg-background px-3.5 py-2.5 pr-10',
                    'text-sm text-foreground placeholder:text-muted-foreground',
                    'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50',
                    'transition-colors'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {/* Password rules */}
              {password.length > 0 && (
                <ul className="mt-2.5 space-y-1">
                  {rules.map(({ label, pass }) => (
                    <li key={label} className={cn('flex items-center gap-2 text-xs', pass ? 'text-green-500' : 'text-muted-foreground')}>
                      <Check className={cn('size-3 shrink-0', pass ? 'opacity-100' : 'opacity-30')} />
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-full py-3',
                'bg-primary text-sm font-semibold text-primary-foreground',
                'transition-all hover:bg-primary/90 hover:scale-[1.02]',
                'disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100',
                'glow-brand'
              )}
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>Create Account <ArrowRight className="size-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or sign up with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'GitHub'].map((provider) => (
              <button
                key={provider}
                type="button"
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg border border-border',
                  'py-2.5 text-sm font-medium text-foreground',
                  'transition-colors hover:bg-muted'
                )}
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary transition-colors hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
