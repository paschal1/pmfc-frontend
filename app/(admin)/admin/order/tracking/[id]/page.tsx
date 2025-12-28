'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getOrderById, updateOrderStatus, cancelOrder } from '../../../../../services/api'
import { OrderData } from '../../../utils/order'
import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import { FaCheck } from 'react-icons/fa'
import { IoMdTime } from 'react-icons/io'
import toast from 'react-hot-toast' // Add this import

// Order statuses in sequence (matching backend enum)
const ORDER_STATUSES = [
  { key: 'order_processing', label: 'Order Processing' },
  { key: 'pre_production', label: 'Pre-Production' },
  { key: 'in_production', label: 'In Production' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'canceled', label: 'Canceled' },
]

const OrderTracking = () => {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const token = Cookies.get('adminToken')
      if (!token) {
        toast.error('No authentication token found')
        setError('No authentication token found')
        setLoading(false)
        return
      }

      const data = await getOrderById(Number(orderId))
      setOrder(data)
      setSelectedStatus(data.status)
    } catch (err) {
      console.error('Error fetching order:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentStatusIndex = () => {
    // Don't include canceled in the progress bar
    const progressStatuses = ORDER_STATUSES.filter(s => s.key !== 'canceled')
    return progressStatuses.findIndex((s) => s.key === order?.status)
  }

  const getSelectedStatusIndex = () => {
    // Don't include canceled in the progress bar
    const progressStatuses = ORDER_STATUSES.filter(s => s.key !== 'canceled')
    return progressStatuses.findIndex((s) => s.key === selectedStatus)
  }

  const handleUpdateStatus = async () => {
    if (!order || selectedStatus === order.status) {
      toast.error('No changes to update')
      return
    }

    // Show loading toast
    const toastId = toast.loading('Updating order status...')

    try {
      setUpdating(true)
      const token = Cookies.get('adminToken')
      
      if (!token) {
        toast.error('No authentication token found', { id: toastId })
        return
      }

      // Call the update API
      const response = await updateOrderStatus(order.id, selectedStatus)
      
      // Update local state
      setOrder({ ...order, status: selectedStatus })
      
      // Show success toast
      toast.success('Order status updated successfully!', { id: toastId })
    } catch (err) {
      console.error('Error updating order:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status'
      toast.error(errorMessage, { id: toastId })
      
      // Reset to current status on error
      setSelectedStatus(order.status)
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return

    // Check if order can be canceled
    if (!['order_processing', 'pre_production'].includes(order.status)) {
      toast.error('Order cannot be canceled at this stage.')
      return
    }

    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return
    }

    // Show loading toast
    const toastId = toast.loading('Canceling order...')

    try {
      setUpdating(true)
      await cancelOrder(order.id)
      
      // Update local state
      setOrder({ 
        ...order, 
        status: 'canceled',
        payment_status: order.payment_status === 'Paid' ? 'Refund Pending' : 'Unpaid'
      })
      setSelectedStatus('canceled')
      
      // Show success toast
      toast.success('Order has been canceled successfully!', { id: toastId })
    } catch (err) {
      console.error('Error canceling order:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order'
      toast.error(errorMessage, { id: toastId })
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = () => {
    setSelectedStatus(order?.status || '')
    toast('Changes discarded', { icon: 'ℹ️' })
  }

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fab702] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-white flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Order not found'}</p>
          <Link
            href="/admin/order"
            className="px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition inline-block"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const currentStatusIndex = getCurrentStatusIndex()
  const selectedStatusIndex = getSelectedStatusIndex()
  const isCanceled = order.status === 'canceled'

  // Filter out canceled from progress statuses
  const progressStatuses = ORDER_STATUSES.filter(s => s.key !== 'canceled')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/order"
          className="text-[#fab702] hover:underline mb-4 flex items-center gap-2 inline-flex"
        >
          ← Back to Orders
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Order Tracking</h1>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          {order.product && (
            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border flex-shrink-0">
              <Image
                src={order.product.image || '/placeholder.jpg'}
                alt={order.product.name || 'Product'}
                width={128}
                height={128}
                className="object-cover w-full h-full"
                unoptimized
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg'
                }}
              />
            </div>
          )}

          {/* Order Details */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {order.product?.name || 'Product'}
            </h2>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Order Number:</strong> {order.tracking_number}
              </p>
              {order.product && (
                <p>
                  <strong>Brand:</strong> {order.product.name}
                </p>
              )}
              <p>
                <strong>Order Placed:</strong>{' '}
                {new Date(order.order_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className={`mt-6 p-4 border-l-4 rounded ${
          isCanceled 
            ? 'bg-red-50 border-red-500' 
            : currentStatusIndex === progressStatuses.length - 1
            ? 'bg-green-50 border-green-500'
            : 'bg-blue-50 border-blue-500'
        }`}>
          <p className="text-sm text-gray-700">
            {isCanceled
              ? 'This order has been canceled.'
              : currentStatusIndex === progressStatuses.length - 1
              ? 'Your order has been delivered.'
              : currentStatusIndex >= 3
              ? 'Your item is on the way. Tracking information is available.'
              : 'Your order is being processed.'}
          </p>
        </div>
      </div>

      {/* Progress Tracker - Hide if canceled */}
      {!isCanceled && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-8">Order Status</h2>

          {/* Desktop Progress Bar */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-[#fab702] transition-all duration-500"
                  style={{
                    width: `${(selectedStatusIndex / (progressStatuses.length - 1)) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Status Points */}
              <div className="relative flex justify-between">
                {progressStatuses.map((status, index) => {
                  const isCompleted = index <= selectedStatusIndex
                  const isCurrent = index === selectedStatusIndex
                  const isActualCurrent = index === currentStatusIndex

                  return (
                    <div key={status.key} className="flex flex-col items-center">
                      {/* Circle */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-[#fab702] border-[#fab702] text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-[#fab702] ring-opacity-30' : ''}`}
                      >
                        {isCompleted ? (
                          <FaCheck className="w-5 h-5" />
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </div>

                      {/* Label */}
                      <div className="mt-3 text-center">
                        <p
                          className={`text-sm font-semibold ${
                            isCompleted ? 'text-gray-800' : 'text-gray-400'
                          }`}
                        >
                          {status.label}
                        </p>
                        {isActualCurrent && (
                          <p className="text-xs text-[#fab702] mt-1 flex items-center gap-1 justify-center">
                            <IoMdTime /> Current Status
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile Progress List */}
          <div className="md:hidden space-y-4">
            {progressStatuses.map((status, index) => {
              const isCompleted = index <= selectedStatusIndex
              const isCurrent = index === selectedStatusIndex
              const isActualCurrent = index === currentStatusIndex

              return (
                <div key={status.key} className="flex items-start gap-4">
                  {/* Line and Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                        isCompleted
                          ? 'bg-[#fab702] border-[#fab702] text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-[#fab702] ring-opacity-30' : ''}`}
                    >
                      {isCompleted ? (
                        <FaCheck className="w-4 h-4" />
                      ) : (
                        <span className="font-semibold text-sm">{index + 1}</span>
                      )}
                    </div>
                    {index < progressStatuses.length - 1 && (
                      <div
                        className={`w-1 h-12 ${
                          isCompleted ? 'bg-[#fab702]' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <p
                      className={`font-semibold ${
                        isCompleted ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {status.label}
                    </p>
                    {isActualCurrent && (
                      <p className="text-xs text-[#fab702] mt-1 flex items-center gap-1">
                        <IoMdTime /> Current Status
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Status Control (Admin Only) */}
      {!isCanceled && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Update Order Status</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
              disabled={updating}
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status.key} value={status.key}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleUpdateStatus}
              disabled={updating || selectedStatus === order.status}
              className="flex-1 px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
            <button
              onClick={handleCancel}
              disabled={updating}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              Reset
            </button>
            {['order_processing', 'pre_production'].includes(order.status) && (
              <button
                onClick={handleCancelOrder}
                disabled={updating}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}

      {/* Shipping History */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleTimeString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {isCanceled ? 'Order Canceled' : 'Order Created'}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {order.shipping_address}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking