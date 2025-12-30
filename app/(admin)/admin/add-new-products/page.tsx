'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

type CategoryType = {
  id: number
  name: string
  image: string
  thumbnailimage?: string
}

const AddNewProducts = () => {
  const router = useRouter()

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const [categories, setCategories] = useState<CategoryType[]>([])

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const [imageName, setImageName] = useState('No file chosen')
  const [thumbnailName, setThumbnailName] = useState('No file chosen')

  const [loading, setLoading] = useState(false)
  const [fetchingCategories, setFetchingCategories] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) {
          setError('Authentication required')
          setFetchingCategories(false)
          return
        }

        const response = await axios.get('https://api.princem-fc.com/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data.data || response.data || []
        setCategories(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError('Failed to load categories')
      } finally {
        setFetchingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImageName(file.name)
    } else {
      setImageFile(null)
      setImageName('No file chosen')
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailName(file.name)
    } else {
      setThumbnailFile(null)
      setThumbnailName('No file chosen')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (!productName.trim()) {
      setError('Product name is required')
      setLoading(false)
      return
    }
    if (!categoryId) {
      setError('Please select a category')
      setLoading(false)
      return
    }
    if (!imageFile) {
      setError('Main image is required')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('name', productName.trim())
    formData.append('description', description.trim())
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('category_id', categoryId)
    formData.append('image', imageFile)
    if (thumbnailFile) formData.append('thumbnailImage', thumbnailFile)

    try {
      const token = Cookies.get('userToken')
      if (!token) {
        setError('Authentication required')
        setLoading(false)
        return
      }

      await axios.post('https://api.princem-fc.com/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setSuccess('Product added successfully!')

      // Reset form
      setProductName('')
      setDescription('')
      setPrice('')
      setStock('')
      setCategoryId('')
      setImageFile(null)
      setThumbnailFile(null)
      setImageName('No file chosen')
      setThumbnailName('No file chosen')

      // Redirect after delay
      setTimeout(() => router.push('/admin/products'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add product')
    } finally {
      setLoading(false)
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Product Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Product Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Modern Sofa"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition bg-white"
                required
                disabled={fetchingCategories}
              >
                <option value="">
                  {fetchingCategories ? 'Loading categories...' : 'Select a category'}
                </option>
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
              <label className="block text-gray-700 font-semibold mb-2">
                Price (₦) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Stock Quantity <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe the product in detail..."
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition resize-none"
              required
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Main Image <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:bg-[#fab702] file:text-white
                file:font-medium
                hover:file:bg-yellow-600 cursor-pointer"
            />
            <p className="mt-2 text-sm text-gray-500">Selected: {imageName}</p>
          </div>

          {/* Thumbnail Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Thumbnail Image (Optional)
            </label>
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
            <p className="mt-2 text-sm text-gray-500">Selected: {thumbnailName}</p>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-3.5 bg-[#fab702] text-white text-lg font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
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

export default AddNewProducts