'use client'
import { useState, useEffect } from 'react'
import { Parallax } from 'react-parallax'
import { Loader, Eye, Package, Calendar, X, MapPin, CreditCard, Truck, Phone, Mail, User } from 'lucide-react'
import Link from 'next/link'
import * as cartApi from '../../services/cartApi.service'

interface Order {
  id: number
  order_id?: number
  trackingNumber: string
  date: string
  status: string
  total: string
  items: number
  productName: string
  productImage: string
}

interface OrderDetails extends Order {
  shipping_address?: string
  shipping_city?: string
  shipping_state?: string
  shipping_zip_code?: string
  email?: string
  fullname?: string
  payment_method?: string
  payment_type?: string
  orderItems?: Array<{
    id: number
    product_name: string
    quantity: number
    price: string
    sub_total: string
    product?: {
      image: string
      name: string
    }
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await cartApi.getUserOrders()
      setOrders(data.data || data || [])
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load orders'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetails = async (orderId: number) => {
    try {
      setLoadingDetails(true)
      const data = await cartApi.getOrder(orderId)
      setSelectedOrder(data.data || data)
      setShowModal(true)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load order details'
      alert(errorMsg)
    } finally {
      setLoadingDetails(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setTimeout(() => setSelectedOrder(null), 300)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-900/30 text-green-400 border border-green-700'
      case 'shipped':
        return 'bg-blue-900/30 text-blue-400 border border-blue-700'
      case 'in_production':
      case 'order_processing':
        return 'bg-[#fab702]/20 text-[#fab702] border border-[#fab702]'
      case 'canceled':
      case 'cancelled':
        return 'bg-red-900/30 text-red-400 border border-red-700'
      default:
        return 'bg-gray-700/30 text-gray-400 border border-gray-600'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
  }

  const isImageUrl = (str: string) => {
    return str?.startsWith('http://') || str?.startsWith('https://') || str?.startsWith('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#fab702] animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your orders...</p>
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
        bgImage={'/orders-bg.jpg'}
      >
        <div className="lg:ml-20 ml-10">
          <h1 className="font-bold text-3xl text-white">My Orders</h1>
        </div>
      </Parallax>

      {/* Mobile Hero */}
      <div className="h-[230px] w-full lg:hidden block relative">
        <img
          src={'/orders-bg.jpg'}
          alt="Orders banner"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          My Orders
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 text-red-400 border border-red-700 p-4 m-6 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex-1 mx-auto mt-8 px-4 lg:px-20 pb-20 max-w-7xl w-full">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-8">Start shopping to create your first order</p>
            <Link href="/shop">
              <button className="bg-[#fab702] text-black px-8 py-3 rounded-lg font-bold hover:opacity-75 transition-all duration-300">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#212529] border border-[#FFFFFF33] rounded-lg p-6 hover:border-[#fab702] transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mb-4">
                  {/* Product Image & Name */}
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#fab702]/20 overflow-hidden">
                      {isImageUrl(order.productImage) ? (
                        <img 
                          src={order.productImage} 
                          alt={order.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.parentElement!.innerHTML = '<div class="text-3xl">📦</div>'
                          }}
                        />
                      ) : (
                        <div className="text-3xl">{order.productImage || '📦'}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">
                        {order.productName}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {order.items} {order.items === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-[#fab702] font-bold text-sm mt-1">
                        {order.total}
                      </p>
                    </div>
                  </div>

                  {/* Order Date */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-xs">Order Date</p>
                      <p className="text-white font-semibold">{order.date}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Status</p>
                    <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  {/* Tracking & Action */}
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Tracking #</p>
                      <p className="text-white font-mono text-xs break-all">
                        {order.trackingNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => fetchOrderDetails(order.id)}
                      disabled={loadingDetails}
                      className="flex items-center justify-center gap-2 w-full bg-[#fab702] text-black py-2 rounded font-semibold text-xs hover:opacity-75 transition-all duration-300 disabled:opacity-50"
                    >
                      {loadingDetails ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      View Details
                    </button>
                  </div>
                </div>

                {/* Desktop Expanded View */}
                <div className="hidden lg:block border-t border-[#FFFFFF33] pt-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Tracking Number</p>
                      <p className="text-white font-mono font-semibold">{order.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Order Number</p>
                      <p className="text-white font-semibold">#{order.order_id || order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">Total Amount</p>
                      <p className="text-[#fab702] font-bold">{order.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#212529] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#fab702]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#212529] border-b border-[#FFFFFF33] p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <p className="text-gray-400 text-sm mt-1">Order #{selectedOrder.order_id || selectedOrder.id}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-[#fab702]" />
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <span className={`inline-block px-3 py-1 rounded text-sm font-semibold mt-1 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Order Date</p>
                  <p className="text-white font-semibold">{selectedOrder.date}</p>
                </div>
              </div>

              {/* Tracking Number */}
              <div className="bg-[#1a1d21] p-4 rounded-lg border border-[#FFFFFF33]">
                <p className="text-gray-400 text-sm mb-1">Tracking Number</p>
                <p className="text-white font-mono text-lg">{selectedOrder.trackingNumber}</p>
              </div>

              {/* Customer Info */}
              {(selectedOrder.fullname || selectedOrder.email) && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-[#fab702]" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrder.fullname && (
                      <div className="bg-[#1a1d21] p-4 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Full Name</p>
                        <p className="text-white">{selectedOrder.fullname}</p>
                      </div>
                    )}
                    {selectedOrder.email && (
                      <div className="bg-[#1a1d21] p-4 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email
                        </p>
                        <p className="text-white">{selectedOrder.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#fab702]" />
                    Shipping Address
                  </h3>
                  <div className="bg-[#1a1d21] p-4 rounded-lg">
                    <p className="text-white">{selectedOrder.shipping_address}</p>
                    {(selectedOrder.shipping_city || selectedOrder.shipping_state || selectedOrder.shipping_zip_code) && (
                      <p className="text-gray-400 text-sm mt-2">
                        {[selectedOrder.shipping_city, selectedOrder.shipping_state, selectedOrder.shipping_zip_code]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              {(selectedOrder.payment_method || selectedOrder.payment_type) && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#fab702]" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrder.payment_method && (
                      <div className="bg-[#1a1d21] p-4 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Payment Method</p>
                        <p className="text-white">{selectedOrder.payment_method}</p>
                      </div>
                    )}
                    {selectedOrder.payment_type && (
                      <div className="bg-[#1a1d21] p-4 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Payment Type</p>
                        <p className="text-white">{selectedOrder.payment_type}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#fab702]" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={item.id || index} className="bg-[#1a1d21] p-4 rounded-lg flex gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.product?.image && isImageUrl(item.product.image) ? (
                            <img 
                              src={item.product.image} 
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{item.product_name}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                            <div className="text-right">
                              <p className="text-gray-400 text-xs">Unit Price: {item.price}</p>
                              <p className="text-[#fab702] font-bold">{item.sub_total}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Total */}
              <div className="border-t border-[#FFFFFF33] pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-white font-semibold text-lg">Total Amount</p>
                  <p className="text-[#fab702] font-bold text-2xl">{selectedOrder.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}