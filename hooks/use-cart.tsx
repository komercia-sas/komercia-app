"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  getCart,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateQuantity as updateQuantityUtil,
  clearCart as clearCartUtil,
} from "@/lib/cart"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  images: string[]
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: any, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    setCart(getCart())
  }, [])

  const addToCart = (product: any, quantity = 1) => {
    const updatedCart = addToCartUtil(product, quantity)
    setCart(updatedCart)
  }

  const removeFromCart = (productId: number) => {
    const updatedCart = removeFromCartUtil(productId)
    setCart(updatedCart)
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const updatedCart = updateQuantityUtil(productId, quantity)
    setCart(updatedCart)
  }

  const clearCart = () => {
    clearCartUtil()
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
