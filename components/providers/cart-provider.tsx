"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartProduct {
  id: string
  name: string
  slug: string
  price: number
  image?: string
  variantId?: string
  variantName?: string
}

export interface CartLineItem extends CartProduct {
  quantity: number
}

interface CartState {
  items: CartLineItem[]
}

type CartAction =
  | { type: "ADD"; product: CartProduct }
  | { type: "REMOVE"; id: string; variantId?: string }
  | { type: "UPDATE_QTY"; id: string; variantId?: string; quantity: number }
  | { type: "CLEAR" }

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  const key = (id: string, variantId?: string) => `${id}::${variantId ?? ""}`

  switch (action.type) {
    case "ADD": {
      const k = key(action.product.id, action.product.variantId)
      const exists = state.items.find(
        (i) => key(i.id, i.variantId) === k
      )
      if (exists) {
        return {
          items: state.items.map((i) =>
            key(i.id, i.variantId) === k
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { items: [...state.items, { ...action.product, quantity: 1 }] }
    }
    case "REMOVE":
      return {
        items: state.items.filter(
          (i) => key(i.id, i.variantId) !== key(action.id, action.variantId)
        ),
      }
    case "UPDATE_QTY":
      return {
        items: state.items
          .map((i) =>
            key(i.id, i.variantId) === key(action.id, action.variantId)
              ? { ...i, quantity: action.quantity }
              : i
          )
          .filter((i) => i.quantity > 0),
      }
    case "CLEAR":
      return { items: [] }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartLineItem[]
  itemCount: number
  total: number
  addItem: (product: CartProduct) => void
  removeItem: (id: string, variantId?: string) => void
  updateQty: (id: string, quantity: number, variantId?: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        total,
        addItem: (product) => dispatch({ type: "ADD", product }),
        removeItem: (id, variantId) => dispatch({ type: "REMOVE", id, variantId }),
        updateQty: (id, quantity, variantId) =>
          dispatch({ type: "UPDATE_QTY", id, variantId, quantity }),
        clearCart: () => dispatch({ type: "CLEAR" }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}
