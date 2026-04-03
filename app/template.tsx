'use client'

import { motion, type Variants } from 'framer-motion'

const page: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
}

/**
 * template.tsx re-mounts on every navigation (unlike layout.tsx which persists).
 * This makes it the correct place to trigger per-page enter animations.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={page} initial="hidden" animate="visible">
      {children}
    </motion.div>
  )
}
