'use client'

import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Loader, AlertCircle } from 'lucide-react'
import * as quoteApi from '../../../services/quoteApi.service'

type QuoteData = {
  id: number
  email: string
  name: string
  phone: string
  message: string
  areasize: number
  squarefeet: number
  state_id: number
  address: string
  budget: string
  service_titles: string
  service_prices: string
  total_price: number
  status: 'pending' | 'sent' | 'accepted' | 'rejected'
  created_at: string
}

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<QuoteData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await quoteApi.getQuotes()

        // Handle both paginated and direct responses
        const data = response.data || response
        setQuotes(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error('Error fetching quotes:', err)
        const message = err instanceof Error ? err.message : 'Failed to fetch quotes'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quote?')) return

    try {
      await quoteApi.deleteQuote(id)
      setQuotes((prev) => prev.filter((q) => q.id !== id))
    } catch (err: any) {
      console.error('Error deleting quote:', err)
      setError('Failed to delete quote')
    }
  }

  // Filter quotes
  const filteredQuotes = quotes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.service_titles.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || item.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quote Requests</h1>
        <p className="text-gray-600">Manage all quote submissions and track their status</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-gray-700 font-medium mb-2">
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, address, or services..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
          />
        </div>

        <div className="sm:w-48">
          <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Quotes</p>
          <p className="text-2xl font-bold text-gray-800">{quotes.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {quotes.filter((q) => q.status === 'pending').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Sent</p>
          <p className="text-2xl font-bold text-blue-600">
            {quotes.filter((q) => q.status === 'sent').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Accepted</p>
          <p className="text-2xl font-bold text-green-600">
            {quotes.filter((q) => q.status === 'accepted').length}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {quotes.filter((q) => q.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Phone</th>
                <th className="px-6 py-4 text-left font-semibold">Services</th>
                <th className="px-6 py-4 text-left font-semibold">Total Price</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin text-[#fab702]" />
                      <span className="text-gray-500">Loading quotes...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    {searchTerm || filterStatus !== 'all'
                      ? 'No matching quotes found'
                      : 'No quotes yet'}
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${item.email}`}
                        className="text-[#fab702] hover:underline text-sm"
                      >
                        {item.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${item.phone}`}
                        className="text-gray-600 hover:text-[#fab702] text-sm"
                      >
                        {item.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 max-w-xs truncate text-sm">
                        {item.service_titles}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800 font-semibold text-sm">
                        {formatPrice(item.total_price)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          href={`/admin/quotes/${item.id}`}
                          className="text-purple-600 hover:text-purple-800 transition"
                          title="View Details"
                        >
                          <MdOutlineRemoveRedEye className="h-5 w-5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <RiDeleteBin5Line className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminQuotes