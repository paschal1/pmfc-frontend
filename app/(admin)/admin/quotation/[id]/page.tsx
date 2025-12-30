'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { MdOutlineEdit } from 'react-icons/md'

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

const QuotationId = () => {
  const { id } = useParams()
  const router = useRouter()
  const [quotation, setQuotation] = useState<QuoteType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuotation = async () => {
      if (!id) return

      try {
        const token = Cookies.get('userToken')
        if (!token) {
          console.error('No authentication token')
          setLoading(false)
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/quotes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data.data || response.data
        setQuotation(data)
      } catch (error) {
        console.error('Error fetching quotation:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotation()
  }, [id])

  const handleEdit = () => {
    router.push(`/admin/quotation/edit/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-gray-600">Loading quotation details...</p>
      </div>
    )
  }

  if (!quotation) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-xl text-red-600">Quotation not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header with Title and Edit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Quotation Request #{quotation.id}
            </h1>

            <button
              onClick={handleEdit}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
            >
              <MdOutlineEdit className="h-5 w-5" />
              Edit Quotation
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Customer & Message */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Customer Information</h2>
                <dl className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-medium text-gray-600">Name</dt>
                    <dd className="text-gray-900 mt-1 sm:mt-0">{quotation.name}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-medium text-gray-600">Email</dt>
                    <dd className="text-gray-900 mt-1 sm:mt-0 break-all">{quotation.email}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-medium text-gray-600">Phone</dt>
                    <dd className="text-gray-900 mt-1 sm:mt-0">{quotation.phone}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-medium text-gray-600">Address</dt>
                    <dd className="text-gray-900 mt-1 sm:mt-0">{quotation.address || '-'}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start">
                    <dt className="font-medium text-gray-600">Status</dt>
                    <dd className="mt-1 sm:mt-0">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          quotation.status?.toLowerCase() === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : quotation.status?.toLowerCase() === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : quotation.status?.toLowerCase() === 'in-progress'
                            ? 'bg-purple-100 text-purple-800'
                            : quotation.status?.toLowerCase() === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {quotation.status || 'Pending'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Message / Requirements</h2>
                <p className="text-gray-700 bg-gray-50 p-5 rounded-lg whitespace-pre-wrap text-sm leading-relaxed">
                  {quotation.message || 'No message provided'}
                </p>
              </div>
            </div>

            {/* Right Column: Project & Pricing */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Project Details</h2>
                <dl className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-medium text-gray-600">Area Size</dt>
                    <dd className="text-gray-900 mt-1 sm:mt-0">{quotation.areasize || '-'} </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-medium text-gray-600">Square Feet</dt>
                    <dd className="text-gray-900 mt-1 sm:mt-0">{quotation.squarefeet || '-'} sqft</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-medium text-gray-600">Customer Budget</dt>
                    <dd className="text-gray-900 mt-1 sm:mt-0">₦{Number(quotation.budget).toLocaleString()}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Selected Services</h2>
                <div className="bg-gray-50 p-5 rounded-lg space-y-4">
                  <div>
                    <p className="font-medium text-gray-600 mb-2">Services:</p>
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {quotation.service_titles || 'None selected'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-2">Prices:</p>
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {quotation.service_prices || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#fab702] text-white p-8 rounded-2xl text-center shadow-md">
                <p className="text-sm uppercase tracking-wider opacity-90">Estimated Total</p>
                <p className="text-4xl font-bold mt-3">
                  ₦{Number(quotation.total_price).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuotationId