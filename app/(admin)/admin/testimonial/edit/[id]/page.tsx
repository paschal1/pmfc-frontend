'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const EditTestimonial = () => {
  const { id } = useParams()
  const router = useRouter()

  const [name, setName] = useState('')
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(true) // for fetching
  const [saving, setSaving] = useState(false) // for submit
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchTestimonial = async () => {
      if (!id) return

      try {
        const token = Cookies.get('userToken')
        if (!token) {
          router.push('/admin/login')
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data.data || response.data
        setName(data.name || '')
        setReview(data.review || '')
      } catch (err) {
        console.error(err)
        setError('Failed to load testimonial')
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonial()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('review', review)
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('userToken')
      if (!token) throw new Error('No authentication')

      await axios.post(`https://api.princem-fc.com/api/testimonials/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSuccess('Testimonial updated successfully!')
      setTimeout(() => router.push('/admin/testimonial'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update testimonial')
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
        <p className="text-lg text-gray-600">Loading testimonial...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
          Edit Testimonial #{id}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
              required
            />
          </div>

          {/* Review Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={8}
              placeholder="Customer review..."
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-12 py-3.5 bg-[#fab702] text-white text-lg font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Feedback Messages */}
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

export default EditTestimonial