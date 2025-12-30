'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const AddNewCategory = () => {
  const router = useRouter()

  const [categoryName, setCategoryName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const [imageName, setImageName] = useState('No file chosen')
  const [thumbnailName, setThumbnailName] = useState('No file chosen')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

    if (!categoryName.trim()) {
      setError('Category name is required')
      setLoading(false)
      return
    }

    if (!imageFile) {
      setError('Main image is required')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('name', categoryName.trim())
    formData.append('image', imageFile)
    if (thumbnailFile) formData.append('thumbnailimage', thumbnailFile)

    try {
      const token = Cookies.get('userToken')
      if (!token) {
        setError('Authentication required')
        setLoading(false)
        return
      }

      await axios.post('https://api.princem-fc.com/api/categories', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setSuccess('Category added successfully!')

      // Reset form
      setCategoryName('')
      setImageFile(null)
      setThumbnailFile(null)
      setImageName('No file chosen')
      setThumbnailName('No file chosen')

      // Redirect after short delay
      setTimeout(() => router.push('/admin/category'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add category')
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
          Add New Category
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Category Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Category Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Living Room Furniture"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
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

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-3.5 bg-[#fab702] text-white text-lg font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg"
            >
              {loading ? 'Adding Category...' : 'Add Category'}
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

export default AddNewCategory