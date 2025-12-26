'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const AddNewStudent = () => {
  const router = useRouter()

  const [full_name, setFullName] = useState('')
  const [gender, setGender] = useState('')
  const [contact_number, setContactNumber] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [date_of_birth, setDateOfBirth] = useState('')
  const [program_duration, setProgramDuration] = useState('')
  const [current_skill_level, setCurrentSkillLevel] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = {
      full_name,
      gender,
      contact_number,
      email,
      address,
      date_of_birth: date_of_birth || null,
      program_duration,
      current_skill_level,
    }

    try {
      const token = Cookies.get('adminToken')
      if (!token) {
        setError('Authentication required. Please log in again.')
        setLoading(false)
        return
      }

      await axios.post('https://api.princem-fc.com/api/students', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setSuccess('New student enrolled successfully!')
      
      // Reset form
      setFullName('')
      setGender('')
      setContactNumber('')
      setEmail('')
      setAddress('')
      setDateOfBirth('')
      setProgramDuration('')
      setCurrentSkillLevel('')

      // Redirect after short delay
      setTimeout(() => router.push('/admin/enrollment'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add student. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-clear messages
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
          Add New Student Enrollment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Gender <span className="text-red-600">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition bg-white"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Contact Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={contact_number}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. 08012345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Enter full address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition resize-none"
            />
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
              <input
                type="date"
                value={date_of_birth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Program Duration <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={program_duration}
                onChange={(e) => setProgramDuration(e.target.value)}
                placeholder="e.g. 1 year"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Current Skill Level <span className="text-red-600">*</span>
            </label>
            <select
              value={current_skill_level}
              onChange={(e) => setCurrentSkillLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition bg-white"
              required
            >
              <option value="">Select skill level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-3.5 bg-[#fab702] text-white text-lg font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg"
            >
              {loading ? 'Adding Student...' : 'Add Student'}
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

export default AddNewStudent