'use client'

import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

type QuoteType = {
  id: number
  email: string
  name: string
  phone: number | string
  message: string
  areasize: number | string
  squarefeet: number | string
  budget: number | string
  service_titles: string
  service_prices: string
  status: string
  address: string
  total_price: number | string
}

const Quotation = () => {
  const [quotations, setQuotations] = useState<QuoteType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const token = Cookies.get('adminToken')
        if (!token) {
          console.error('No authentication token found')
          setLoading(false)
          return
        }

        const response = await axios.get('https://api.princem-fc.com/api/quotes', {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Adjust based on your actual API response structure
        const data = response.data.data || response.data
        setQuotations(data)
      } catch (err: any) {
        console.error('Error fetching quotations:', err)
        setError('Failed to load quotations')
      } finally {
        setLoading(false)
      }
    }

    fetchQuotations()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quotation? This action cannot be undone.')) {
      return
    }

    try {
      const token = Cookies.get('adminToken')
      if (!token) return

      await axios.delete(`https://api.princem-fc.com/api/quotes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setQuotations((prev) => prev.filter((q) => q.id !== id))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete quotation')
      setTimeout(() => setError(''), 5000)
    }
  }

  // Search filter
  const filteredQuotations = quotations.filter((quote) =>
    Object.values(quote).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="min-h-screen bg-[#F2F2F2] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Quotation Requests
          </h1>

          <div className="flex items-center gap-3">
            <label htmlFor="search" className="text-gray-700 font-medium">
              Search:
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, email, phone..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] w-full sm:w-64"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">Address</th>
                  <th className="px-4 py-3 text-center font-semibold">Area (sqft)</th>
                  <th className="px-4 py-3 text-center font-semibold">Budget (₦)</th>
                  <th className="px-4 py-3 text-center font-semibold">Total Price (₦)</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
                      Loading quotations...
                    </td>
                  </tr>
                ) : filteredQuotations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
                      {searchTerm ? 'No matching quotations found' : 'No quotations yet'}
                    </td>
                  </tr>
                ) : (
                  filteredQuotations.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4">
                        <p className="font-medium truncate max-w-xs">{item.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-gray-600 truncate max-w-xs">{item.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-gray-600">{item.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-gray-600 truncate max-w-sm">{item.address || '-'}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {item.squarefeet || item.areasize || '-'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        ₦{Number(item.budget).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-center font-medium">
                        ₦{Number(item.total_price).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            item.status?.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.status?.toLowerCase() === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <Link
                            href={`/admin/quotation/${item.id}`}
                            className="text-purple-600 hover:text-purple-800"
                            title="View Details"
                          >
                            <MdOutlineRemoveRedEye className="h-5 w-5" />
                          </Link>

                          {/* Uncomment when you have edit page */}
                          {/* <Link
                            href={`/admin/quotation/edit/${item.id}`}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <MdOutlineEdit className="h-5 w-5" />
                          </Link> */}

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800"
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
    </div>
  )
}

export default Quotation