'use client'

import { MdOutlineRemoveRedEye } from 'react-icons/md'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getOrders } from '../../../services/api'
import { OrderData } from '../utils/order'
import Cookies from 'js-cookie'

const ITEMS_PER_PAGE = 10

const Order = () => {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = Cookies.get('adminToken')
      if (!token) {
        setError('No authentication token found')
        setLoading(false)
        return
      }

      setLoading(true)
      const data = await getOrders()
      setOrders(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      order.tracking_number.toLowerCase().includes(query) ||
      order.user.name.toLowerCase().includes(query) ||
      order.product?.name.toLowerCase().includes(query) ||
      order.user.email.toLowerCase().includes(query)
    )
  })

  // Pagination
  const totalItems = filteredOrders.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'order_processing':
      case 'pre_production':
        return 'text-yellow-500 bg-yellow-100'
      case 'canceled':
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-blue-600 bg-blue-100'
    }
  }

  // Format status text
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fab702] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          Order List ({orders.length})
        </h1>
        <div className="flex items-center gap-3">
          <label htmlFor="search" className="text-gray-700 font-medium">
            Search:
          </label>
          <input
            id="search"
            type="text"
            placeholder="Name, tracking, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] w-full sm:w-64"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                  Image
                </th>
                <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                  Tracking #
                </th>
                <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                  Customer
                </th>
                <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                  Payment Method
                </th>
                <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                  Amount
                </th>
                <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                  Shipping Address
                </th>
                <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    {searchQuery
                      ? 'No orders found matching your search'
                      : 'No orders yet'}
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center">
                        <img
                          src={item.product?.image || '/placeholder.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg'
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {item.tracking_number}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 whitespace-nowrap">
                        {new Date(item.order_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.user.name}
                        </p>
                        <p className="text-sm text-gray-500">{item.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{item.payment_method}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full whitespace-nowrap ${getStatusColor(item.status)}`}
                      >
                        {formatStatus(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        ₦{parseFloat(item.total_price).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-gray-800 truncate">
                          {item.shipping_address}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.shipping_city && item.shipping_state
                            ? `${item.shipping_city}, ${item.shipping_state}`
                            : 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <Link
                          href={`/admin/order/${item.id}`}
                          className="text-purple-600 hover:text-purple-800 transition-colors"
                          title="View order details"
                        >
                          <MdOutlineRemoveRedEye className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to{' '}
              {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}{' '}
              orders
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                            page === currentPage
                              ? 'bg-[#fab702] text-white'
                              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      )
                    }
                    return null
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Order