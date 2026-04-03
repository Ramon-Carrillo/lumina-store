'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'

// ─── Context ──────────────────────────────────────────────────────────────────

const LenisContext = createContext<Lenis | null>(null)

/** Access the Lenis instance for programmatic smooth-scroll (e.g. anchor links). */
export function useLenis() {
  return useContext(LenisContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const pathname = usePathname()

  // Initialise once on mount
  useEffect(() => {
    const instance = new Lenis({
      autoRaf: true,
      lerp: 0.08,          // smoothing (lower = snappier, 0.1 is default)
      wheelMultiplier: 1.2, // extra distance per wheel tick — fixes under-scroll on mice
      touchMultiplier: 2,   // snappier on trackpad / touch
      infinite: false,
    })
    setLenis(instance)
    return () => instance.destroy()
  }, [])

  // Jump to top on every client-side navigation
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [pathname, lenis])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
