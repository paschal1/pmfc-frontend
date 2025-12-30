'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const EditTrainingProgram = () => {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [loading, setLoading] = useState(true) // for fetching data
  const [saving, setSaving] = useState(false) // for submit
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return

      try {
        const token = Cookies.get('userToken')
        if (!token) {
          router.push('/admin/login')
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/training-programs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // API returns { "trainingProgram": { ... } }
        const data = response.data.trainingProgram

        if (!data) {
          setError('No program data found')
          return
        }

        setTitle(data.title || '')
        setDescription(data.description || '')
        setPrice(data.price?.toString() || '')
        setStartDate(data.start_date || '')
        setEndDate(data.end_date || '')
      } catch (err) {
        console.error(err)
        setError('Failed to load training program')
      } finally {
        setLoading(false)
      }
    }

    fetchProgram()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('start_date', startDate)
    formData.append('end_date', endDate)
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('userToken')
      if (!token) throw new Error('No authentication')

      await axios.post(`https://api.princem-fc.com/api/training-programs/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSuccess('Training program updated successfully!')
      setTimeout(() => router.push('/admin/training-program'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update program')
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
        <p className="text-lg text-gray-600">Loading program...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
          Edit Training Program #{id}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Program title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe the training program..."
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition resize-none"
              required
            />
          </div>

          {/* Price, Start & End Date */}
          <div className="grid md:grid-cols-3 gap-6">
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
              <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
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

export default EditTrainingProgram