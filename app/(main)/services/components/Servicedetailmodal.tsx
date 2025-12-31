'use client'
import { useState } from 'react'
import * as serviceApi from '../../../services/serviceApi.service'
import { X } from 'lucide-react'
import React from 'react'
import QuoteFormModal from './Quoteformmodal'

interface ServiceDetailModalProps {
  serviceId: number
  isOpen: boolean
  onClose: () => void
}

const ServiceDetailModal = ({ serviceId, isOpen, onClose }: ServiceDetailModalProps) => {
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showQuoteForm, setShowQuoteForm] = useState(false)

  React.useEffect(() => {
    if (!isOpen) return

    const fetchService = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await serviceApi.getService(serviceId)
        setService(response.data || response)
      } catch (err) {
        console.error('Error fetching service:', err)
        setError('Failed to load service details')
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [isOpen, serviceId])

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-6">
            <h2 className="text-2xl font-bold text-gray-800">Service Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#fab702] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-gray-600">Loading service details...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            ) : service ? (
              <div className="space-y-6">
                {/* Type Badge */}
                {service.type && (
                  <div>
                    <span className="inline-block px-4 py-2 bg-[#fab702] text-black font-semibold rounded-full text-sm">
                      {service.type}
                    </span>
                  </div>
                )}

                {/* Title */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h3>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {service.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Pricing</h4>
                  <div className="space-y-2">
                    {service.price && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Base Price:</span>
                        <span className="font-semibold text-[#fab702]">
                          ₦{new Intl.NumberFormat('en-NG').format(service.price)}
                        </span>
                      </div>
                    )}
                    {service.min_price && service.max_price && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price Range:</span>
                        <span className="font-semibold text-[#fab702]">
                          ₦{new Intl.NumberFormat('en-NG').format(service.min_price)} - ₦
                          {new Intl.NumberFormat('en-NG').format(service.max_price)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Images</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.image1 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Image 1</p>
                        <img
                          src={service.image1}
                          alt={service.title}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    {service.image2 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Image 2</p>
                        <img
                          src={service.image2}
                          alt={service.title}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowQuoteForm(true)}
                    className="flex-1 px-6 py-3 bg-[#fab702] text-black font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Quote Form Modal */}
      <QuoteFormModal
        serviceId={serviceId}
        isOpen={showQuoteForm}
        onClose={() => setShowQuoteForm(false)}
      />
    </>
  )
}

export default ServiceDetailModal