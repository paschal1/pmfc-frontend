'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Image from 'next/image'

type CategoryType = {
  id: number
  name: string
  image: string
  thumbnailimage?: string
}

type ProductType = {
  id: number
  name: string
  description: string
  price: string | number
  stock: number | string
  category_id: number
  image: string
  thumbnailImage?: string
}

const EditProduct = () => {
  const { id } = useParams()
  const router = useRouter()

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const [categories, setCategories] = useState<CategoryType[]>([])

  const [currentImage, setCurrentImage] = useState('')
  const [currentThumbnail, setCurrentThumbnail] = useState('')

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const [imagePreview, setImagePreview] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        const token = Cookies.get('adminToken')
        if (!token) {
          router.push('/admin/login')
          return
        }

        const [productRes, categoryRes] = await Promise.all([
          axios.get(`https://api.princem-fc.com/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://api.princem-fc.com/api/categories', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const product = productRes.data.data || productRes.data
        const categoryData = categoryRes.data.data || categoryRes.data

        setProductName(product.name || '')
        setDescription(product.description || '')
        setPrice(product.price?.toString() || '')
        setStock(product.stock?.toString() || '')
        setCategoryId(product.category_id?.toString() || '')

        setCurrentImage(product.image || '')
        setCurrentThumbnail(product.thumbnailImage || '')

        setImagePreview(product.image || '')
        setThumbnailPreview(product.thumbnailImage || '')

        setCategories(Array.isArray(categoryData) ? categoryData : [])
      } catch (err) {
        console.error(err)
        setError('Failed to load product or categories')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('name', productName)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('category_id', categoryId)
    if (imageFile) formData.append('image', imageFile)
    if (thumbnailFile) formData.append('thumbnailImage', thumbnailFile)
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('adminToken')
      if (!token) throw new Error('No authentication')

      await axios.post(`https://api.princem-fc.com/api/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setSuccess('Product updated successfully!')
      setTimeout(() => router.push('/admin/products'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-lg text-gray-600">Loading product...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
          Edit Product #{id}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Product Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition bg-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price (₦)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
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
              rows={6}
              placeholder="Describe the product..."
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition resize-none"
              required
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-4">Main Image</label>
            {imagePreview && (
              <div className="mb-6">
                <Image
                  src={imagePreview}
                  alt="Product main image"
                  width={600}
                  height={400}
                  className="rounded-xl object-cover border shadow-sm"
                  unoptimized
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:bg-[#fab702] file:text-white
                file:font-medium
                hover:file:bg-yellow-600 cursor-pointer"
            />
            <p className="mt-2 text-sm text-gray-500">Leave empty to keep current image</p>
          </div>

          {/* Thumbnail Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-4">Thumbnail Image</label>
            {thumbnailPreview && (
              <div className="mb-6">
                <Image
                  src={thumbnailPreview}
                  alt="Product thumbnail"
                  width={400}
                  height={300}
                  className="rounded-xl object-cover border shadow-sm"
                  unoptimized
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:bg-[#fab702] file:text-white
                file:font-medium
                hover:file:bg-yellow-600 cursor-pointer"
            />
            <p className="mt-2 text-sm text-gray-500">Leave empty to keep current thumbnail</p>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={saving}
              className="px-12 py-3.5 bg-[#fab702] text-white text-lg font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Feedback */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center font-medium">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default EditProduct