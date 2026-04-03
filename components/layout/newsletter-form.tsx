'use client'

export function NewsletterForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex gap-2">
      <input
        type="email"
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90"
      >
        Join
      </button>
    </form>
  )
}
