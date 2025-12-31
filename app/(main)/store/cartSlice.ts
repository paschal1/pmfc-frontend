import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  id: number
  product_id: number
  quantity: number
  price?: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set cart items from API
    setCartItems: (state, action: PayloadAction<{ items: CartItem[]; total: number }>) => {
      state.items = action.payload.items
      state.total = action.payload.total
      state.itemCount = action.payload.items.length
    },

    // Add item to cart
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      state.itemCount = state.items.length
    },

    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.itemCount = state.items.length
    },

    // Update item quantity
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
    },

    // Update cart total
    updateCartTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload
    },
  },
})

export const {
  setCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  updateCartTotal,
} = cartSlice.actions

export default cartSlice.reducer