'use client'

import { useScroll, useSpring, motion } from 'framer-motion'

/**
 * Renders a 2px brand-colored progress bar pinned to the very top of the
 * viewport that fills as the user scrolls down the page.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: '0%' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[2px] bg-brand"
    />
  )
}
