'use client'

import { motion, type Variants } from 'framer-motion'
import { ProductCard, type ProductCardData } from './product-card'

// ─── Stagger variants ─────────────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

const item: Variants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  products: ProductCardData[]
}

export function ProductGrid({ products }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
