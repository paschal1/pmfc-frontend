'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Loader, 
  AlertCircle, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign,
  FileText,
  Clock,
  Package,
  Home,
  Info
} from 'lucide-react'
import * as quoteApi from '../../../../services/quoteApi.service'

type QuoteData = {
  id: number
  email: string
  name: string
  phone: string
  message: string
  areasize: number
  squarefeet: number
  state_id: number
  state?: {
    id: number
    name: string
  }
  address: string
  budget: string
  service_titles: string
  service_prices: string
  total_price: number
  status: 'pending' | 'sent' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

const AdminQuoteDetail = () => {
  const params = useParams()
  const quoteId = params.id as string

  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('📋 Fetching quote with ID:', quoteId)

        const response = await quoteApi.getQuote(parseInt(quoteId))
        const data = response.data || response
        
        console.log('✅ Quote loaded:', data)
        setQuote(data)
      } catch (err: any) {
        console.error('❌ Error fetching quote:', err)
        const message = err instanceof Error ? err.message : 'Failed to fetch quote'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    if (quoteId) {
      fetchQuote()
    }
  }, [quoteId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300'
      case 'sent':
        return 'bg-blue-100 text-blue-800 border border-blue-300'
      case 'accepted':
        return 'bg-green-100 text-green-800 border border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300'
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Quote request received, awaiting review'
      case 'sent':
        return 'Quote prepared and sent to customer'
      case 'accepted':
        return 'Customer has accepted the quote'
      case 'rejected':
        return 'Customer has declined the quote'
      default:
        return 'Status unknown'
    }
  }

  const parseServices = () => {
    if (!quote) return []
    
    const titles = quote.service_titles.split(',').map(s => s.trim())
    const prices = quote.service_prices.split(',').map(s => s.trim())
    
    return titles.map((title, index) => ({
      title,
      price: parseFloat(prices[index]) || 0
    }))
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-[#fab702] mx-auto mb-4" />
            <p className="text-gray-600">Loading quote details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/admin/quotes" className="flex items-center gap-2 text-[#fab702] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Quotes
        </Link>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-red-700">{error || 'Quote not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const services = parseServices()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link href="/admin/quotes" className="flex items-center gap-2 text-[#fab702] hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Quotes
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quote #{quote.id}</h1>
            <p className="text-gray-600">Complete quote request details</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span
              className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(
                quote.status
              )}`}
            >
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </span>
            <p className="text-xs text-gray-500">{getStatusDescription(quote.status)}</p>
          </div>
        </div>
      </div>

      {/* Customer Information Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Customer Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Full Name</p>
            <p className="text-lg font-semibold text-gray-800">{quote.name}</p>
          </div>

          {/* Email */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Email Address</p>
            <a
              href={`mailto:${quote.email}`}
              className="text-[#fab702] hover:underline flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {quote.email}
            </a>
          </div>

          {/* Phone */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Phone Number</p>
            <a
              href={`tel:${quote.phone}`}
              className="text-gray-800 hover:text-[#fab702] flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {quote.phone}
            </a>
          </div>

          {/* Submitted Date */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Submitted Date</p>
            <div className="flex items-center gap-2 text-gray-800">
              <Clock className="w-4 h-4" />
              {formatDate(quote.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Project Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address */}
          <div className="md:col-span-2">
            <p className="text-gray-600 text-sm mb-1">Property Address</p>
            <div className="flex items-start gap-2 text-gray-800">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <p>{quote.address}</p>
            </div>
          </div>

          {/* State */}
          <div>
            <p className="text-gray-600 text-sm mb-1">State</p>
            <p className="text-gray-800 font-medium">{quote.state?.name || 'N/A'}</p>
          </div>

          {/* Area Size */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Area Size</p>
            <p className="text-gray-800 font-medium">{quote.areasize} rooms</p>
          </div>

          {/* Square Feet */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Square Footage</p>
            <p className="text-gray-800 font-medium">{quote.squarefeet.toLocaleString()} sq ft</p>
          </div>

          {/* Budget */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Customer Budget</p>
            <p className="text-gray-800 font-medium">{quote.budget}</p>
          </div>
        </div>
      </div>

      {/* Services Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Requested Services
        </h2>

        <div className="space-y-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#fab702] rounded-full flex items-center justify-center text-black font-semibold text-sm">
                  {index + 1}
                </div>
                <span className="text-gray-800 font-medium">{service.title}</span>
              </div>
              <span className="text-gray-800 font-semibold">{formatPrice(service.price)}</span>
            </div>
          ))}

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-[#fab702] bg-opacity-10 rounded-lg border-2 border-[#fab702] mt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-800" />
              <span className="text-gray-800 font-bold text-lg">Total Price</span>
            </div>
            <span className="text-gray-800 font-bold text-xl">{formatPrice(quote.total_price)}</span>
          </div>
        </div>
      </div>

      {/* Message Card */}
      {quote.message && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Additional Message
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap">{quote.message}</p>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 mb-1">Quote Status Information</p>
            <p className="text-blue-700 text-sm">
              This quote is currently marked as <strong>{quote.status}</strong>. 
              {quote.updated_at !== quote.created_at && (
                <span> Last updated on {formatDate(quote.updated_at)}.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-gradient-to-r from-[#fab702] to-yellow-500 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/location-costs"
            className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition text-center"
          >
            Manage Location Costs
          </Link>
          <a
            href={`mailto:${quote.email}?subject=Quote Request #${quote.id} - ${quote.name}&body=Hi ${quote.name},%0D%0A%0D%0AThank you for your quote request for ${quote.service_titles}.%0D%0A%0D%0ATotal: ${formatPrice(quote.total_price)}%0D%0A%0D%0A`}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-center"
          >
            Send Email Response
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminQuoteDetail