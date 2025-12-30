'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Image from 'next/image'

const EditCategory = () => {
  const { id } = useParams()
  const router = useRouter()

  const [categoryName, setCategoryName] = useState('')
  const [slugName, setSlugName] = useState('')
  const [currentImage, setCurrentImage] = useState<string>('')
  const [currentThumbnail, setCurrentThumbnail] = useState<string>('')

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const [imagePreview, setImagePreview] = useState<string>('')
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return

      try {
        const token = Cookies.get('userToken')
        if (!token) {
          router.push('/admin/login')
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data.data

        setCategoryName(data.name || '')
        setSlugName(data.slug || '')
        setCurrentImage(data.image || '')
        setCurrentThumbnail(data.thumbnailimage || '')

        // Set previews to current images
        setImagePreview(data.image || '')
        setThumbnailPreview(data.thumbnailimage || '')
      } catch (err) {
        console.error(err)
        setError('Failed to load category')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
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
    formData.append('name', categoryName)
    formData.append('slug', slugName)
    if (imageFile) formData.append('image', imageFile)
    if (thumbnailFile) formData.append('thumbnailimage', thumbnailFile)
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('userToken')
      if (!token) throw new Error('No authentication')

      await axios.post(`https://api.princem-fc.com/api/categories/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setSuccess('Category updated successfully!')
      setTimeout(() => router.push('/admin/category'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update category')
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
        <p className="text-lg text-gray-600">Loading category...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
          Edit Category #{id}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Name & Slug */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Furniture"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Slug</label>
              <input
                type="text"
                value={slugName}
                onChange={(e) => setSlugName(e.target.value)}
                placeholder="e.g. furniture"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-4">Main Image</label>
            {imagePreview && (
              <div className="mb-4">
                <Image
                  src={imagePreview}
                  alt="Current main image"
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
              <div className="mb-4">
                <Image
                  src={thumbnailPreview}
                  alt="Current thumbnail"
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

export default EditCategory