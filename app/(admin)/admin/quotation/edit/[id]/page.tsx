'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const EditQuotation = () => {
  const { id } = useParams()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [areasize, setAreasize] = useState('')
  const [squarefeet, setSquarefeet] = useState('')
  const [budget, setBudget] = useState('')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState('pending')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchQuotation = async () => {
      if (!id) return

      try {
        const token = Cookies.get('adminToken')
        if (!token) {
          router.push('/admin/login')
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/quotes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data.data || response.data

        setName(data.name || '')
        setEmail(data.email || '')
        setPhone(data.phone?.toString() || '')
        setMessage(data.message || '')
        setAreasize(data.areasize?.toString() || '')
        setSquarefeet(data.squarefeet?.toString() || '')
        setBudget(data.budget?.toString() || '')
        setAddress(data.address || '')
        setStatus(data.status || 'pending')
      } catch (err: any) {
        console.error(err)
        setError('Failed to load quotation details')
      } finally {
        setLoading(false)
      }
    }

    fetchQuotation()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const formData = {
      name,
      email,
      phone: phone ? Number(phone) : null,
      message,
      areasize: areasize ? Number(areasize) : null,
      squarefeet: squarefeet ? Number(squarefeet) : null,
      budget: budget ? Number(budget) : null,
      address,
      status,
    }

    try {
      const token = Cookies.get('adminToken')
      if (!token) throw new Error('No authentication')

      await axios.put(`https://api.princem-fc.com/api/quotes/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSuccess('Quotation updated successfully!')
      setTimeout(() => router.push('/admin/quotation'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update quotation')
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
        <p className="text-lg text-gray-600">Loading quotation...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
          Edit Quotation Request #{id}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 08012345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition bg-white"
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Area Size</label>
              <input
                type="number"
                value={areasize}
                onChange={(e) => setAreasize(e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Square Feet</label>
              <input
                type="number"
                value={squarefeet}
                onChange={(e) => setSquarefeet(e.target.value)}
                placeholder="e.g. 2000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Budget (₦)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 5000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Customer address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Message / Requirements</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Customer's full message or project requirements..."
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
              {saving ? 'Saving Changes...' : 'Save Changes'}
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

export default EditQuotation