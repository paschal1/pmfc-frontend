// services/cartApi.service.ts

import apiClient from './api'
import axios from 'axios'

// Types
export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  cart_id?: number
  price?: number
  sub_total?: number
  product?: {
    id: number
    name: string
    price: number | string
    image: string | null
    stock: number
    description: string
  }
  created_at: string
  updated_at: string
}

export interface Cart {
  cart_id: number
  cart_items: CartItem[]
  total?: number
  status?: string
}

// ============================================
// CART ENDPOINTS
// ============================================

// Get Cart Items (optional - simple list)
export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const response = await apiClient.get('/cartItems')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Please login to view cart')
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch cart items')
    }
    throw new Error('Failed to fetch cart items')
  }
}

// Get Full Cart - Recommended (includes cart_id, total, etc.)
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await apiClient.get('/cart')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Please login to view cart')
      }
      if (error.response?.status === 404) {
        // No cart yet
        return { cart_id: 0, cart_items: [] }
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch cart')
    }
    throw new Error('Failed to fetch cart')
  }
}

// Add to Cart
export const addToCart = async (productId: number, quantity: number = 1): Promise<CartItem> => {
  try {
    // Get current cart to retrieve cart_id
    const cart = await getCart()

    if (!cart || cart.cart_id === 0) {
      throw new Error('No active cart found. Please refresh the page or try again.')
    }

    // Use the correct endpoint with cart_id in the URL
    const response = await apiClient.post(`/cart/${cart.cart_id}/items`, {
      product_id: productId,
      quantity,
    })

    return response.data.cart_item || response.data
  } catch (error: any) {
    console.error('Add to cart error:', error)

    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.response?.data?.error
      const availableStock = error.response?.data?.available_stock

      if (status === 401) {
        throw new Error('Please login to add items to cart')
      }

      if (status === 400) {
        if (availableStock !== undefined) {
          throw new Error(`${message || 'Insufficient stock'}. Available: ${availableStock}`)
        }
        throw new Error(message || 'Cannot add item to cart')
      }

      if (status === 422) {
        const errors = error.response?.data?.errors
        if (errors) {
          const errorMessages = Object.values(errors).flat().join(', ')
          throw new Error(errorMessages)
        }
        throw new Error('Validation error')
      }

      throw new Error(message || 'Failed to add item to cart')
    }

    throw new Error('Failed to add item to cart')
  }
}

// Update Cart Item Quantity
export const updateCartItem = async (cartItemId: number, quantity: number): Promise<CartItem> => {
  try {
    const response = await apiClient.put(`/cartItems/${cartItemId}`, { quantity })
    return response.data.cart_item || response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item')
    }
    throw new Error('Failed to update cart item')
  }
}

// Remove Item from Cart
export const removeFromCart = async (cartItemId: number): Promise<void> => {
  try {
    await apiClient.delete(`/cartItems/${cartItemId}`)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to remove item')
    }
    throw new Error('Failed to remove item')
  }
}

// Clear entire cart
export const clearCart = async (): Promise<void> => {
  try {
    const cartItems = await getCartItems()
    await Promise.all(cartItems.map(item => removeFromCart(item.id)))
  } catch (error) {
    throw new Error('Failed to clear cart')
  }
}

// Calculate cart total client-side
export const calculateCartTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => {
    const price = typeof item.product?.price === 'number'
      ? item.product.price
      : parseFloat(item.product?.price || '0')
    return total + (price * item.quantity)
  }, 0)
}

// ============================================
// ORDER ENDPOINTS
// ============================================

export interface CheckoutData {
  shipping_address: string
  shipping_state?: string
  shipping_city?: string
  shipping_zip_code?: string
  email?: string
  fullname?: string
  payment_method?: 'Bank Transfer' | 'Credit Card' | 'PayPal'
  payment_type?: 'Full Payment' | 'Deposit'
  deposit_amount?: number
}

// Place Order (Checkout)
export const placeOrder = async (checkoutData: CheckoutData) => {
  try {
    const response = await apiClient.post('/orders', checkoutData)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to place order')
    }
    throw new Error('Failed to place order')
  }
}

// Get User Orders - Uses /orders/user endpoint
export const getUserOrders = async () => {
  try {
    const response = await apiClient.get('/orders/user')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Please login to view orders')
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch orders')
    }
    throw new Error('Failed to fetch orders')
  }
}

// Get All Orders (Admin) - Uses /orders endpoint
export const getAllOrders = async () => {
  try {
    const response = await apiClient.get('/orders')
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Please login to view orders')
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch orders')
    }
    throw new Error('Failed to fetch orders')
  }
}

// Get Single Order
export const getOrder = async (orderId: number) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Please login to view order')
      }
      if (error.response?.status === 404) {
        throw new Error('Order not found')
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch order')
    }
    throw new Error('Failed to fetch order')
  }
}

// Cancel Order
export const cancelOrder = async (orderId: number) => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/cancel`)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to cancel order')
    }
    throw new Error('Failed to cancel order')
  }
}

// Track Order (Public - no auth required)
export const trackOrder = async (trackingNumber: string) => {
  try {
    const response = await apiClient.get(`/orders/track/${trackingNumber}`)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Order not found')
    }
    throw new Error('Order not found')
  }
}

export default {
  // Cart
  getCartItems,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  calculateCartTotal,
  
  // Orders
  placeOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  trackOrder,
}