'use client'

import { useState, useEffect } from 'react'
import { Parallax } from 'react-parallax'
import { Loader, ArrowLeft, Check, Copy, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import PaystackPop from '@paystack/inline-js'
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

interface CheckoutFormData {
  fullname: string
  email: string
  phone: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip_code: string
  payment_method: 'Bank Transfer' | 'Credit Card' | 'PayPal' | 'Paystack'
  payment_type: 'Full Payment' | 'Deposit'
  deposit_amount?: number
}

// Bank details
const BANK_DETAILS = {
  accountName: 'Nwokeocha Paschal C',
  bank: 'Access Bank',
  accountNumber: '0078508706',
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [cartTotal, setCartTotal] = useState(0)
  const [shippingCost] = useState(0)
  const [taxRate] = useState(0.075)
  const [copied, setCopied] = useState(false)
  const [processingPaystack, setProcessingPaystack] = useState(false)

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullname: '',
    email: '',
    phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip_code: '',
    payment_method: 'Bank Transfer',
    payment_type: 'Full Payment',
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateTax = () => {
    return cartTotal * taxRate
  }

  const calculateTotal = () => {
    return cartTotal + shippingCost + calculateTax()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle Paystack Payment
  const handlePaystackPayment = async () => {
    if (!validateForm()) return

    try {
      setProcessingPaystack(true)
      const paystack = new PaystackPop()

      paystack.newTransaction({
        key: 'pk_live_7fa94265109b3b80e76e7ab6b402e5160f5a35aa',
        amount: calculateTotal() * 100,
        email: formData.email,
        metadata: {
          custom_fields: [
            { display_name: 'Full Name', variable_name: 'fullname', value: formData.fullname },
            { display_name: 'Phone', variable_name: 'phone', value: formData.phone },
            { display_name: 'Shipping Address', variable_name: 'shipping_address', value: formData.shipping_address },
            { display_name: 'City', variable_name: 'shipping_city', value: formData.shipping_city },
            { display_name: 'State', variable_name: 'shipping_state', value: formData.shipping_state },
          ],
        },
        onSuccess: async (response: any) => {
          await createOrder('Paystack', response.reference)
        },
        onCancel: () => {
          setError('Payment canceled')
          setProcessingPaystack(false)
        },
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Paystack payment failed'
      setError(errorMsg)
      setProcessingPaystack(false)
    }
  }

  const validateForm = (): boolean => {
    if (!formData.fullname.trim()) {
      setError('Full name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return false
    }
    if (!formData.shipping_address.trim()) {
      setError('Shipping address is required')
      return false
    }
    if (!formData.shipping_city.trim()) {
      setError('City is required')
      return false
    }
    if (!formData.shipping_state.trim()) {
      setError('State is required')
      return false
    }
    return true
  }

  const createOrder = async (paymentMethod: string, paystackRef?: string) => {
    try {
      setSubmitting(true)
      setError(null)

      const orderData: cartApi.CheckoutData = {
        fullname: formData.fullname,
        email: formData.email,
        shipping_address: formData.shipping_address,
        shipping_city: formData.shipping_city,
        shipping_state: formData.shipping_state,
        shipping_zip_code: formData.shipping_zip_code,
        payment_method: paymentMethod as any,
        payment_type: formData.payment_type as 'Full Payment' | 'Deposit',
        deposit_amount: formData.payment_type === 'Deposit' ? formData.deposit_amount : undefined,
      }

      const response = await cartApi.placeOrder(orderData)

      setSuccess(true)

      setTimeout(() => {
        window.location.href = `/order-confirmation/${response.order.id}`
      }, 2000)

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to place order'
      setError(errorMsg)
    } finally {
      setSubmitting(false)
      setProcessingPaystack(false)
    }
  }

  const handleManualTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    await createOrder('Bank Transfer')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#fab702] animate-spin mx-auto mb-4" />
          <p className="text-white">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
        <p className="text-gray-400 mb-8">Add items before proceeding to checkout</p>
        <Link href="/cart">
          <button className="flex items-center gap-2 bg-[#fab702] text-black px-8 py-3 rounded-lg font-bold hover:opacity-75 transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="bg-green-900/20 border border-green-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Order Placed!</h2>
          <p className="text-gray-400 mb-8">
            Thank you for your order. You will be redirected to the order confirmation page shortly.
          </p>
          <Link href="/orders">
            <button className="bg-[#fab702] text-black px-8 py-3 rounded-lg font-bold hover:opacity-75 transition-all duration-300">
              View Orders
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-black min-h-screen">
      <Parallax
        strength={300}
        className="h-[230px] w-full bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/checkout-bg.jpg'}
      >
        <div className="lg:ml-20 ml-10">
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <button className="flex items-center gap-2 text-white/80 hover:text-[#fab702] transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Cart</span>
              </button>
            </Link>
          </div>
          <h1 className="font-bold text-3xl text-white mt-4">Checkout</h1>
        </div>
      </Parallax>

      <div className="h-[230px] w-full lg:hidden block relative">
        <img
          src={'/checkout-bg.jpg'}
          alt="Checkout banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute top-10 left-3 z-10">
          <Link href="/cart">
            <button className="flex items-center gap-2 text-white/80 hover:text-[#fab702] transition-colors mb-4">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </Link>
          <h1 className="font-bold text-3xl text-white">Checkout</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 text-red-400 border border-red-700 p-4 m-6 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="flex lg:flex-row flex-col mx-auto mt-8 gap-8 px-4 lg:px-20 pb-20 max-w-7xl w-full">
        <form onSubmit={handleManualTransfer} className="flex-1 space-y-8">
          <div className="bg-[#212529] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full bg-black border border-[#fab702]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fab702] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full bg-black border border-[#fab702]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fab702] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 800 000 0000"
                  className="w-full bg-black border border-[#fab702]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fab702] transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-[#212529] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Street Address *</label>
                <input
                  type="text"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className="w-full bg-black border border-[#fab702]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fab702] transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">City *</label>
                  <input
                    type="text"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleInputChange}
                    placeholder="Lagos"
                    className="w-full bg-black border border-[#fab702]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fab702] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">State *</label>
                  <input
                    type="text"
                    name="shipping_state"
                    value={formData.shipping_state}
                    onChange={handleInputChange}
                    placeholder="Lagos"
                    className="w-full bg-black border border-[#fab702]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fab702] transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Postal Code</label>
                <input
                  type="text"
                  name="shipping_zip_code"
                  value={formData.shipping_zip_code}
                  onChange={handleInputChange}
                  placeholder="100001"
                  className="w-full bg-black border border-[#fab702]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fab702] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#212529] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-3">Select Payment Method</label>
                <div className="space-y-3">
                  {['Bank Transfer', 'Paystack'].map((method) => (
                    <label key={method} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="payment_method"
                        value={method}
                        checked={formData.payment_method === method}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#fab702]"
                      />
                      <span className="text-white group-hover:text-[#fab702] transition-colors">
                        {method === 'Paystack' ? 'Paystack (Card, Transfer, USSD)' : 'Bank Transfer'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {formData.payment_method === 'Bank Transfer' && (
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Bank Transfer Details</h3>
              <div className="space-y-4 bg-black rounded p-4">
                <div>
                  <p className="text-gray-400 text-sm">Account Name</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-white font-semibold">{BANK_DETAILS.accountName}</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(BANK_DETAILS.accountName)}
                      className="text-[#fab702] hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Bank</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-white font-semibold">{BANK_DETAILS.bank}</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(BANK_DETAILS.bank)}
                      className="text-[#fab702] hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Account Number</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-white font-semibold font-mono">{BANK_DETAILS.accountNumber}</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(BANK_DETAILS.accountNumber)}
                      className="text-[#fab702] hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-amount mt-4 pt-4 border-t border-[#FFFFFF33]">
                  <p className="text-gray-400 text-sm">Amount to Transfer</p>
                  <p className="text-[#fab702] font-bold text-xl">
                    ₦{calculateTotal().toLocaleString('en-NG', { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {copied && (
                <p className="text-green-400 text-sm mt-3">Copied to clipboard!</p>
              )}

              <p className="text-gray-400 text-xs mt-4">
                After making the transfer, submit your order. We&rsquo;ll verify the payment and process your order.
              </p>
            </div>
          )}

          {formData.payment_method === 'Bank Transfer' ? (
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#fab702] text-black py-4 rounded-lg font-bold text-lg hover:opacity-75 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader className="w-5 h-5 animate-spin" /> : null}
              {submitting ? 'Processing...' : 'Place Order (After Transfer)'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePaystackPayment}
              disabled={processingPaystack}
              className="w-full bg-[#fab702] text-black py-4 rounded-lg font-bold text-lg hover:opacity-75 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processingPaystack ? <Loader className="w-5 h-5 animate-spin" /> : null}
              {processingPaystack ? 'Processing Payment...' : 'Pay with Paystack'}
            </button>
          )}
        </form>

        <div className="lg:w-96 bg-[#1E2024] rounded-lg p-6 h-fit sticky top-20">
          <h2 className="font-bold text-2xl text-white mb-6">Order Summary</h2>
          <div className="mb-6 max-h-96 overflow-y-auto">
            <div className="space-y-4 border-b border-[#FFFFFF33] pb-6">
              {cartItems.map((item) => {
                const price = typeof item.product?.price === 'number'
                  ? item.product.price
                  : parseFloat(item.product?.price || '0')
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="text-white font-semibold">{item.product?.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#fab702] font-bold">
                      ₦{(price * item.quantity).toLocaleString('en-NG')}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4 border-b border-[#FFFFFF33] pb-6 mb-6">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white">₦{cartTotal.toLocaleString('en-NG')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span className="text-white">
                {shippingCost === 0 ? 'Free' : `₦${shippingCost.toLocaleString('en-NG')}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax (7.5%)</span>
              <span className="text-white">
                ₦{calculateTax().toLocaleString('en-NG', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-lg">Total Amount</span>
              <span className="text-[#fab702] font-bold text-3xl">
                ₦{calculateTotal().toLocaleString('en-NG', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="bg-[#fab702]/10 border border-[#fab702]/30 rounded-lg p-4 text-sm text-gray-400">
            <p className="mb-2 text-white font-semibold">Important</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>All fields marked with * are required</li>
              <li>You will receive a confirmation email</li>
              <li>Track your order in your account</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}