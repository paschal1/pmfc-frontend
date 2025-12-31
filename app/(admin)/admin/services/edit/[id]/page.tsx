'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Image from 'next/image'

const EditServiceId = () => {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('Residential Design')
  const [price, setPrice] = useState('')
  const [min_price, setMin_price] = useState('')
  const [max_price, setMax_price] = useState('')
  const [existingImage1, setExistingImage1] = useState<string>('')
  const [existingImage2, setExistingImage2] = useState<string>('')
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [preview1, setPreview1] = useState<string>('')
  const [preview2, setPreview2] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const serviceTypes = [
    'Residential Design',
    'Hospitality Design',
    'Office Design',
    'Commercial Design'
  ]

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) {
          router.push('/admin/login')
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data.data
        setTitle(data.title)
        setDescription(data.description)
        setType(data.type || 'Residential Design')
        setPrice(data.price)
        setMin_price(data.min_price)
        setMax_price(data.max_price)
        setExistingImage1(data.image1)
        setExistingImage2(data.image2)
        setPreview1(data.image1)
        setPreview2(data.image2)
      } catch (err) {
        console.error(err)
        setError('Failed to load service data')
      } finally {
        setFetchLoading(false)
      }
    }

    if (id) fetchService()
  }, [id, router])

  const handleImageChange = (file: File | null, setter: (f: File | null) => void, previewSetter: (url: string) => void, existing: string) => {
    setter(file)
    if (file) {
      previewSetter(URL.createObjectURL(file))
    } else {
      previewSetter(existing)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('type', type)
    formData.append('price', price)
    formData.append('min_price', min_price)
    formData.append('max_price', max_price)
    if (image1) formData.append('image1', image1)
    if (image2) formData.append('image2', image2)
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('userToken')
      await axios.post(`https://api.princem-fc.com/api/services/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setSuccess('Service updated successfully!')
      setTimeout(() => router.push('/admin/services'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update service')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(t)
    }
  }, [error, success])

  if (fetchLoading) {
    return <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">Loading service...</div>
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">Edit Service #{id}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Type Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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

            {/* Price Fields */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price (₦)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Min Price (₦)</label>
                <input
                  type="number"
                  value={min_price}
                  onChange={(e) => setMin_price(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Max Price (₦)</label>
                <input
                  type="number"
                  value={max_price}
                  onChange={(e) => setMax_price(e.target.value)}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                required
              />
            </div>

            {/* Image Uploads */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-3">Image 1</label>
                {preview1 && (
                  <div className="mb-4">
                    <Image
                      src={preview1}
                      alt="Preview 1"
                      width={400}
                      height={300}
                      className="rounded-lg object-cover border"
                      unoptimized
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    handleImageChange(file, setImage1, setPreview1, existingImage1)
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#fab702] file:text-white hover:file:bg-yellow-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-3">Image 2</label>
                {preview2 && (
                  <div className="mb-4">
                    <Image
                      src={preview2}
                      alt="Preview 2"
                      width={400}
                      height={300}
                      className="rounded-lg object-cover border"
                      unoptimized
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    handleImageChange(file, setImage2, setPreview2, existingImage2)
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#fab702] file:text-white hover:file:bg-yellow-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 transition"
              >
                {loading ? 'Updating...' : 'Update Service'}
              </button>
            </div>

            {error && <p className="text-red-600 text-center font-medium">{error}</p>}
            {success && <p className="text-green-600 text-center font-medium">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditServiceId