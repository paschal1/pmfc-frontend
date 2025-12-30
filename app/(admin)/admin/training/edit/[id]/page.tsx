'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'

type StudentType = {
  id: number
  full_name: string
  age?: string | number | null
  gender?: string
  contact_number?: string
  email?: string
  address?: string
  date_of_birth?: string | null
  emergency_contact?: string | null
  previous_experience?: string | null
  joining_date?: string | null
  program_duration?: string
  current_skill_level?: string
  goals?: string | null
}

const EditStudentPage = () => {
  const { id } = useParams()
  const router = useRouter()

  const [formData, setFormData] = useState<StudentType>({
    id: 0,
    full_name: '',
    age: '',
    gender: '',
    contact_number: '',
    email: '',
    address: '',
    date_of_birth: '',
    emergency_contact: '',
    previous_experience: '',
    joining_date: '',
    program_duration: '',
    current_skill_level: '',
    goals: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return

      try {
        const token = Cookies.get('userToken')
        if (!token) {
          toast.error('Authentication token not found')
          router.push('/admin/login')
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        console.log('📡 Student Response:', response.data)

        // Handle different response structures
        let data: StudentType | null = null

        // ✅ Pattern 1: response.data.Enrollment (wrapped object)
        if (response.data.Enrollment && typeof response.data.Enrollment === 'object') {
          data = response.data.Enrollment
          console.log('✅ Found data in response.data.Enrollment')
        }
        // ✅ Pattern 2: response.data.data
        else if (response.data.data && typeof response.data.data === 'object') {
          data = response.data.data
          console.log('✅ Found data in response.data.data')
        }
        // ✅ Pattern 3: response.data.student
        else if (response.data.student && typeof response.data.student === 'object') {
          data = response.data.student
          console.log('✅ Found data in response.data.student')
        }
        // ✅ Pattern 4: direct response.data with id
        else if (typeof response.data === 'object' && response.data.id) {
          data = response.data
          console.log('✅ Found data in response.data (direct)')
        }

        if (!data) {
          console.error('No student data found. Available keys:', Object.keys(response.data))
          console.error('Full response:', response.data)
          toast.error('Student data not found')
          return
        }

        console.log('✅ Setting form data for:', data.full_name)

        setFormData(data)
      } catch (error) {
        console.error('Error fetching student:', error)
        toast.error('Failed to load student details')
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id, router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.full_name?.trim()) {
      toast.error('Full name is required')
      return
    }
    if (!formData.email?.trim()) {
      toast.error('Email is required')
      return
    }
    if (!formData.contact_number?.trim()) {
      toast.error('Contact number is required')
      return
    }

    setSaving(true)
    const saveToast = toast.loading('Saving student details...')

    try {
      const token = Cookies.get('userToken')
      if (!token) throw new Error('No authentication')

      // Prepare data for API
      const updateData = {
        full_name: formData.full_name,
        age: formData.age || null,
        gender: formData.gender || null,
        contact_number: formData.contact_number,
        email: formData.email,
        address: formData.address || null,
        date_of_birth: formData.date_of_birth || null,
        emergency_contact: formData.emergency_contact || null,
        previous_experience: formData.previous_experience || null,
        joining_date: formData.joining_date || null,
        program_duration: formData.program_duration || null,
        current_skill_level: formData.current_skill_level || null,
        goals: formData.goals || null,
      }

      await axios.put(`https://api.princem-fc.com/api/students/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success('Student updated successfully!', { id: saveToast })
      setTimeout(() => router.push(`/admin/training/${id}`), 1500)
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to update student'
      toast.error(errorMsg, { id: saveToast })
      console.error('Error updating student:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fab702] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading student details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          Edit Student Details
        </h1>
        <p className="text-gray-500 mb-8">ID: #{formData.id}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="border-b pb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Contact Number *</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                  placeholder="Age"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="Full address"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition resize-none"
              />
            </div>
          </div>

          {/* Program Information Section */}
          <div className="border-b pb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Program Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Current Skill Level</label>
                <select
                  name="current_skill_level"
                  value={formData.current_skill_level || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                >
                  <option value="">Select skill level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Program Duration</label>
                <input
                  type="text"
                  name="program_duration"
                  value={formData.program_duration || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 year"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Joining Date</label>
                <input
                  type="date"
                  name="joining_date"
                  value={formData.joining_date || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Emergency Contact</label>
                <input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact || ''}
                  onChange={handleInputChange}
                  placeholder="Emergency contact number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">Previous Experience</label>
              <textarea
                name="previous_experience"
                value={formData.previous_experience || ''}
                onChange={handleInputChange}
                placeholder="Describe any relevant experience..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition resize-none"
              />
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">Training Goals</label>
              <textarea
                name="goals"
                value={formData.goals || ''}
                onChange={handleInputChange}
                placeholder="What does the student hope to achieve?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={saving}
              className="px-12 py-3.5 bg-[#fab702] text-white text-lg font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg flex items-center gap-2"
            >
              {saving && <Loader className="w-5 h-5 animate-spin" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditStudentPage