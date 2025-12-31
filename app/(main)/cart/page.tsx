'use client'
import { useState, useEffect } from 'react'
import { Parallax } from 'react-parallax'
import { Loader, X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import * as cartApi from '../../services/cartApi.service'

interface CartItem extends cartApi.CartItem {
  product?: {
    id: number
    name: string
    price: number | string
    image: string | null
    stock: number
    description: string
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartTotal, setCartTotal] = useState(0)
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null)
  const [removingItemId, setRemovingItemId] = useState<number | null>(null)

  // Fetch cart on mount
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      setError(null)
      const cart = await cartApi.getCart()
      setCartItems(cart.cart_items || [])
      const total = cart.total || cartApi.calculateCartTotal(cart.cart_items || [])
      setCartTotal(total)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load cart'
      setError(errorMsg)
      setCartItems([])
      setCartTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      setUpdatingItemId(cartItemId)
      await cartApi.updateCartItem(cartItemId, newQuantity)
      
      const updatedItems = cartItems.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
      setCartItems(updatedItems)
      
      const newTotal = updatedItems.reduce((total, item) => {
        const price = typeof item.product?.price === 'number'
          ? item.product.price
          : parseFloat(item.product?.price || '0')
        return total + (price * item.quantity)
      }, 0)
      setCartTotal(newTotal)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update quantity'
      setError(errorMsg)
      setTimeout(() => setError(null), 3000)
    } finally {
      setUpdatingItemId(null)
    }
  }

  const handleRemoveFromCart = async (cartItemId: number) => {
    try {
      setRemovingItemId(cartItemId)
      await cartApi.removeFromCart(cartItemId)
      
      const updatedItems = cartItems.filter(item => item.id !== cartItemId)
      setCartItems(updatedItems)
      
      const newTotal = updatedItems.reduce((total, item) => {
        const price = typeof item.product?.price === 'number'
          ? item.product.price
          : parseFloat(item.product?.price || '0')
        return total + (price * item.quantity)
      }, 0)
      setCartTotal(newTotal)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to remove item'
      setError(errorMsg)
      setTimeout(() => setError(null), 3000)
    } finally {
      setRemovingItemId(null)
    }
  }

  const getPrice = (item: CartItem) => {
    if (typeof item.product?.price === 'number') {
      return item.product.price
    }
    return parseFloat(item.product?.price || '0')
  }

  const getItemTotal = (item: CartItem) => {
    return getPrice(item) * item.quantity
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#fab702] animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-black min-h-screen">
      {/* Hero Section */}
      <Parallax
        strength={300}
        className="h-[230px] w-full bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/cart-bg.jpg'}
      >
        <div className="lg:ml-20 ml-10">
          <h1 className="font-bold text-3xl text-white">Shopping Cart</h1>
        </div>
      </Parallax>

      {/* Mobile Hero */}
      <div className="h-[230px] w-full lg:hidden block relative">
        <img
          src={'/cart-bg.jpg'}
          alt="Cart banner"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          Shopping Cart
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 text-red-400 border border-red-700 p-4 m-6 rounded-lg flex items-center justify-between">
          <p>{error}</p>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty Cart */}
      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-6">Add some items to get started!</p>
          <Link href="/shop">
            <button className="bg-[#fab702] text-black px-8 py-3 rounded-lg font-bold hover:opacity-75 transition-all duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex lg:flex-row flex-col mx-auto mt-8 gap-8 px-4 lg:px-20 pb-20 max-w-7xl w-full">
          {/* Cart Items */}
          <div className="flex flex-col lg:flex-1 bg-[#212529] rounded-lg overflow-hidden">
            <div className="flex items-center text-white font-semibold justify-between border-b border-b-[#FFFFFF33] py-4 px-4 lg:px-6">
              <h1>Product</h1>
              <div className="flex gap-4 lg:gap-8 items-center">
                <h1 className="w-20 text-center">Quantity</h1>
                <h1 className="w-24 text-right">Price</h1>
                <h1 className="w-20 text-center">Total</h1>
                <h1 className="w-10 text-center">Remove</h1>
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-b-[#FFFFFF33] py-6 px-4 lg:px-6 hover:bg-[#2a2f35] transition-colors gap-4"
              >
                {/* Product Info */}
                <div className="flex gap-4 flex-1 min-w-0">
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded object-cover border border-[#fab702]/20"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {item.product?.name || 'Product'}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {item.product?.description || ''}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex gap-4 lg:gap-8 items-center">
                  <div className="w-20 flex items-center justify-center">
                    <div className="flex items-center gap-2 border border-[#fab702] rounded bg-black">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingItemId === item.id || item.quantity <= 1}
                        className="p-1 hover:bg-[#fab702]/20 disabled:opacity-50 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="w-8 text-center text-white font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingItemId === item.id}
                        className="p-1 hover:bg-[#fab702]/20 disabled:opacity-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="w-24 text-right">
                    <p className="text-[#fab702] font-bold">
                      ₦{getPrice(item).toLocaleString('en-NG')}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="w-20 text-right">
                    <p className="text-white font-bold">
                      ₦{getItemTotal(item).toLocaleString('en-NG')}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    disabled={removingItemId === item.id}
                    className="w-10 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {removingItemId === item.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 bg-[#1E2024] rounded-lg p-6 h-fit sticky top-20">
            <h2 className="font-bold text-2xl text-white mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">
                  ₦{cartTotal.toLocaleString('en-NG')}
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-white font-semibold">Calculated at checkout</span>
              </div>

              <div className="flex items-center justify-between text-gray-400">
                <span>Tax</span>
                <span className="text-white font-semibold">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-[#FFFFFF33] pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-[#fab702] font-bold text-2xl">
                  ₦{cartTotal.toLocaleString('en-NG')}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-[#fab702] text-black py-3 rounded-lg font-bold hover:opacity-75 transition-all duration-300 mb-3">
                Proceed to Checkout
              </button>
            </Link>

            <Link href="/shop">
              <button className="w-full border border-[#fab702] text-[#fab702] py-3 rounded-lg font-bold hover:bg-[#fab702]/10 transition-all duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}