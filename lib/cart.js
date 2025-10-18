// Funciones para manejar el carrito de compras
export const getCart = () => {
  if (typeof window === "undefined") return []
  const cart = localStorage.getItem("office-chairs-cart")
  return cart ? JSON.parse(cart) : []
}

export const saveCart = (cart) => {
  if (typeof window === "undefined") return
  localStorage.setItem("office-chairs-cart", JSON.stringify(cart))
}

export const addToCart = (product, quantity = 1) => {
  const cart = getCart()
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ ...product, quantity })
  }

  saveCart(cart)
  return cart
}

export const removeFromCart = (productId) => {
  const cart = getCart()
  const updatedCart = cart.filter((item) => item.id !== productId)
  saveCart(updatedCart)
  return updatedCart
}

export const updateQuantity = (productId, quantity) => {
  const cart = getCart()
  const item = cart.find((item) => item.id === productId)

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    item.quantity = quantity
    saveCart(cart)
  }

  return cart
}

export const clearCart = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("office-chairs-cart")
  return []
}

export const getCartTotal = (cart) => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

export const getCartItemCount = (cart) => {
  return cart.reduce((total, item) => total + item.quantity, 0)
}
