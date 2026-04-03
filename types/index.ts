// Re-export generated Prisma types as the single source of truth
export type {
  User,
  Category,
  Product,
  ProductImage,
  ProductVariant,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Address,
  Review,
  WishlistItem,
} from "@/lib/generated/prisma/client"

export { Role, OrderStatus, PaymentStatus } from "@/lib/generated/prisma/client"

// ─── Composed / view types ───────────────────────────────────────────────────

import type {
  Product,
  ProductImage,
  ProductVariant,
  Category,
  Review,
  CartItem,
  OrderItem,
} from "@/lib/generated/prisma/client"

export type ProductWithRelations = Product & {
  images: ProductImage[]
  variants: ProductVariant[]
  category: Category
  reviews: Review[]
}

export type CartItemWithProduct = CartItem & {
  product: Product & { images: ProductImage[] }
  variant: ProductVariant | null
}

export type OrderItemWithProduct = OrderItem & {
  product: Product
  variant: ProductVariant | null
}
