'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Image from 'next/image'

const AddService = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('Residential Design')
  const [price, setPrice] = useState('')
  const [min_price, setMin_price] = useState('')
  const [max_price, setMax_price] = useState('')
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [preview1, setPreview1] = useState<string>('')
  const [preview2, setPreview2] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const serviceTypes = [
    'Residential Design',
    'Hospitality Design',
    'Office Design',
    'Commercial Design'
  ]

  const handleImageChange = (
    file: File | null,
    setImage: (f: File | null) => void,
    setPreview: (url: string) => void
  ) => {
    setImage(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Basic validation
    if (!image1 || !image2) {
      setError('Please upload both images')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('type', type)
    formData.append('price', price)
    formData.append('min_price', min_price)
    formData.append('max_price', max_price)
    formData.append('image1', image1)
    formData.append('image2', image2)

    try {
      const token = Cookies.get('userToken')
      if (!token) {
        setError('Authentication required. Please log in again.')
        setLoading(false)
        return
      }

      await axios.post('https://api.princem-fc.com/api/services', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setSuccess('Service added successfully!')
      
      // Reset form
      setTitle('')
      setDescription('')
      setType('Residential Design')
      setPrice('')
      setMin_price('')
      setMax_price('')
      setImage1(null)
      setImage2(null)
      setPreview1('')
      setPreview2('')

      // Auto-clear success message
      setTimeout(() => setSuccess(''), 5000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add service. Please try again.')
      setTimeout(() => setError(''), 6000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
            Add New Service
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Type Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter service title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Service Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                  required
                >
                  {serviceTypes.map((serviceType) => (
                    <option key={serviceType} value={serviceType}>
                      {serviceType}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Min Price Row */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price (₦)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Minimum Price (₦)</label>
                <input
                  type="number"
                  value={min_price}
                  onChange={(e) => setMin_price(e.target.value)}
                  placeholder="e.g. 30000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Maximum Price (₦)</label>
                <input
                  type="number"
                  value={max_price}
                  onChange={(e) => setMax_price(e.target.value)}
                  placeholder="e.g. 100000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the service in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                required
              />
            </div>

            {/* Image Uploads */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-3">Image 1 <span className="text-red-500">*</span></label>
                {preview1 && (
                  <div className="mb-4">
                    <Image
                      src={preview1}
                      alt="Preview 1"
                      width={400}
                      height={300}
                      className="rounded-lg object-cover w-full border shadow-sm"
                      unoptimized
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    handleImageChange(file, setImage1, setPreview1)
                  }}
                  className="block w-full text-sm text-gray-600
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-lg file:border-0
                    file:bg-[#fab702] file:text-white
                    file:font-medium
                    hover:file:bg-yellow-600 cursor-pointer"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-3">Image 2 <span className="text-red-500">*</span></label>
                {preview2 && (
                  <div className="mb-4">
                    <Image
                      src={preview2}
                      alt="Preview 2"
                      width={400}
                      height={300}
                      className="rounded-lg object-cover w-full border shadow-sm"
                      unoptimized
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    handleImageChange(file, setImage2, setPreview2)
                  }}
                  className="block w-full text-sm text-gray-600
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-lg file:border-0
                    file:bg-[#fab702] file:text-white
                    file:font-medium
                    hover:file:bg-yellow-600 cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-md"
              >
                {loading ? 'Adding Service...' : 'Add Service'}
              </button>
            </div>

            {/* Feedback Messages */}
            {error && (
              <p className="text-red-600 text-center font-medium bg-red-50 py-3 rounded-lg">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-600 text-center font-medium bg-green-50 py-3 rounded-lg">
                {success}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddService