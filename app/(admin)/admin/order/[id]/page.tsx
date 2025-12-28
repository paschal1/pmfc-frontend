'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getOrderById } from '../../../../services/api'
import { OrderData } from '../../utils/order'
import Cookies from 'js-cookie'
import Image from 'next/image'

const OrderId = () => {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = Cookies.get('adminToken')
        if (!token) {
          setError('No authentication token found')
          setLoading(false)
          return
        }

        const data = await getOrderById(Number(orderId))
        console.log('Order data:', data) // Debug log
        setOrder(data)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch order')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  // Format status
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'order_processing':
      case 'pre_production':
        return 'bg-yellow-100 text-yellow-700'
      case 'canceled':
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-blue-100 text-blue-700'
    }
  }

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fab702] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-white flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            {error || 'Order not found'}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Calculate totals (you may need to adjust this based on your backend data)
  const subtotal = parseFloat(order.total_price || '0')
  const shipping = 0 // Add shipping cost if available in your API
  const tax = 0 // Add tax if available in your API
  const total = subtotal + shipping + tax

  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="text-[#fab702] hover:underline mb-2 flex items-center gap-2"
            >
              ← Back to Orders
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Order Details
            </h1>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status || '')}`}
          >
            {formatStatus(order.status || 'Unknown')}
          </span>
        </div>

        {/* Order Info Bar */}
        <div className="bg-gray-100 rounded-lg px-6 py-4 mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>
              <strong>Order Date:</strong>{' '}
              {order.order_date
                ? new Date(order.order_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              <strong>Tracking #:</strong> {order.tracking_number || 'N/A'}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              <strong>Payment Status:</strong>{' '}
              <span
                className={
                  order.payment_status === 'Paid'
                    ? 'text-green-600 font-semibold'
                    : 'text-orange-600 font-semibold'
                }
              >
                {order.payment_status || 'Unknown'}
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Product Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Product Details</h2>

              {order.product ? (
                <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border flex-shrink-0">
                    <Image
                      src={order.product.image || '/placeholder.jpg'}
                      alt={order.product.name || 'Product'}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {order.product.name || 'N/A'}
                    </h3>
                    {order.product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {order.product.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {order.quantity && (
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-2 font-semibold">
                            {order.quantity}
                          </span>
                        </div>
                      )}
                      {order.product.price && (
                        <div>
                          <span className="text-gray-500">Unit Price:</span>
                          <span className="ml-2 font-semibold">
                            ₦{parseFloat(order.product.price).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 py-4">
                  No product information available
                </p>
              )}

              {/* Price Breakdown */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                {shipping > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span>₦{shipping.toLocaleString()}</span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span>₦{tax.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-[#fab702]">
                  <span>Total:</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Customer Information</h2>
              <div className="space-y-3 text-sm">
                {(order.fullname || order.user?.name) && (
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {order.fullname || order.user?.name || 'N/A'}
                    </span>
                  </div>
                )}
                {(order.email || order.user?.email) && (
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {order.email || order.user?.email || 'N/A'}
                    </span>
                  </div>
                )}
                {order.user?.phone && (
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {order.user.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                <div>
                  <span className="text-gray-500">Order ID:</span>
                  <span className="ml-2 font-medium text-gray-800">
                    #{order.id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Tracking Number:</span>
                  <span className="ml-2 font-medium text-gray-800">
                    {order.tracking_number || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Order Total:</span>
                  <span className="ml-2 font-semibold text-[#fab702]">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="border-t pt-4 mb-6">
                  <h3 className="font-bold mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-700">{order.shipping_address}</p>
                  {(order.shipping_city || order.shipping_state) && (
                    <p className="text-sm text-gray-700 mt-1">
                      {order.shipping_city}
                      {order.shipping_city && order.shipping_state && ', '}
                      {order.shipping_state} {order.shipping_zip_code}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Method */}
              {order.payment_method && (
                <div className="border-t pt-4 mb-6">
                  <h3 className="font-bold mb-2">Payment Method</h3>
                  <p className="text-sm text-gray-700">{order.payment_method}</p>
                  {order.payment_type && (
                    <p className="text-sm text-gray-700 mt-1">
                      {order.payment_type}
                    </p>
                  )}
                  {order.deposit_amount && (
                    <div className="mt-2 text-sm">
                      <p className="text-gray-600">
                        Deposit: ₦
                        {parseFloat(order.deposit_amount).toLocaleString()}
                      </p>
                      {order.remaining_amount &&
                        parseFloat(order.remaining_amount) > 0 && (
                          <p className="text-red-600">
                            Remaining: ₦
                            {parseFloat(order.remaining_amount).toLocaleString()}
                          </p>
                        )}
                    </div>
                  )}
                </div>
              )}

              {/* Track Order Button */}
              <button className="w-full py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md">
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderId