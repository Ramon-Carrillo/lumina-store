// Re-export from the canonical cart context so any file that imports
// from "@/hooks/use-cart" continues to work without changes.
export { useCart } from "@/components/providers/cart-provider"
export type { CartLineItem, CartProduct } from "@/components/providers/cart-provider"
