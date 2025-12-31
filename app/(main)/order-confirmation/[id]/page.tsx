'use client'
import { useState, useEffect } from 'react'
import { Loader, Check, Copy, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface OrderItem {
  id: number
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: number
  tracking_number: string
  status: string
  total_price: number | string
  payment_status: string
  fullname: string
  email: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  created_at: string
  order_items?: OrderItem[]
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }

      const data = await response.json()
      setOrder(data as Order)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load order'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (order?.tracking_number) {
      navigator.clipboard.writeText(order.tracking_number)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatPrice = (price: number | string): number => {
    if (typeof price === 'string') {
      return parseFloat(price.replace('₦', '').replace(/,/g, ''))
    }
    return price
  }

  const formatStatus = (status: string): string => {
    if (!status || typeof status !== 'string') {
      return 'Processing'
    }
    return status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#fab702] animate-spin mx-auto mb-4" />
          <p className="text-white">Loading order confirmation...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Order Not Found</h2>
          <p className="text-gray-400 mb-8">{error || 'Could not load order details'}</p>
          <Link href="/orders">
            <button className="bg-[#fab702] text-black px-8 py-3 rounded-lg font-bold hover:opacity-75 transition-all duration-300">
              View All Orders
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = formatPrice(order.total_price)

  return (
    <div className="flex flex-col bg-black min-h-screen py-12 px-4 lg:px-20">
      <div className="max-w-4xl mx-auto w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="bg-green-900/20 border border-green-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
          <p className="text-gray-400 text-lg">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Order Summary */}
          <div className="bg-[#212529] rounded-lg p-6 border border-[#FFFFFF33]">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-[#FFFFFF33]">
                <div>
                  <p className="text-gray-400 text-sm">Order Number</p>
                  <p className="text-white font-bold text-lg">#{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Order Date</p>
                  <p className="text-white font-semibold">
                    {new Date(order.created_at).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Tracking Number</p>
                <div className="flex items-center gap-2 bg-black border border-[#fab702]/30 rounded-lg p-3">
                  <code className="text-[#fab702] font-mono font-bold flex-1 break-all">
                    {order.tracking_number}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-[#fab702]/20 rounded transition-colors"
                    title="Copy tracking number"
                  >
                    <Copy className="w-4 h-4 text-gray-400 hover:text-[#fab702]" />
                  </button>
                </div>
                {copied && <p className="text-green-400 text-xs mt-1">Copied!</p>}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#FFFFFF33]">
                <span className="text-gray-400">Order Status</span>
                <span className="px-4 py-2 bg-[#fab702]/20 text-[#fab702] rounded-full text-sm font-semibold capitalize">
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payment Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                  order.payment_status === 'Paid'
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-[#212529] rounded-lg p-6 border border-[#FFFFFF33]">
            <h2 className="text-xl font-bold text-white mb-6">Shipping Information</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Full Name</p>
                <p className="text-white font-semibold">{order.fullname}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white font-semibold">{order.email}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Delivery Address</p>
                <p className="text-white font-semibold">
                  {order.shipping_address}, {order.shipping_city}, {order.shipping_state}
                </p>
              </div>

              <div className="pt-4 border-t border-[#FFFFFF33]">
                <p className="text-gray-400 text-sm mb-2">Order Total</p>
                <p className="text-[#fab702] font-bold text-3xl">
                  ₦{totalPrice.toLocaleString('en-NG', { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        {order.order_items && order.order_items.length > 0 && (
          <div className="bg-[#212529] rounded-lg p-6 border border-[#FFFFFF33] mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Order Items</h2>

            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between pb-4 border-b border-[#FFFFFF33] last:border-0">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{item.product_name}</p>
                    <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#fab702] font-bold">
                      ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      ₦{item.price.toLocaleString('en-NG')} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-[#fab702]/10 border border-[#fab702]/30 rounded-lg p-6 mb-8">
          <h3 className="text-white font-bold text-lg mb-4">What's Next?</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-[#fab702] font-bold mt-1">1.</span>
              <span>You will receive a confirmation email shortly with your order details</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#fab702] font-bold mt-1">2.</span>
              <span>Your order is being prepared. You can track it using your tracking number above</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#fab702] font-bold mt-1">3.</span>
              <span>We'll notify you once your order is shipped</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#fab702] font-bold mt-1">4.</span>
              <span>Check your account dashboard to view all orders and their status</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-center">
          <Link href="/orders">
            <button className="flex items-center justify-center gap-2 bg-[#fab702] text-black px-8 py-4 rounded-lg font-bold hover:opacity-75 transition-all duration-300 w-full lg:w-auto">
              View All Orders
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/shop">
            <button className="flex items-center justify-center gap-2 border border-[#fab702] text-[#fab702] px-8 py-4 rounded-lg font-bold hover:bg-[#fab702]/10 transition-all duration-300 w-full lg:w-auto">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}