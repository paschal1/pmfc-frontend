'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { MdOutlineEdit } from 'react-icons/md'

type EnrollmentData = {
  id: number
  full_name: string
  gender: string
  contact_number: string
  email: string
  address: string
  date_of_birth: string | null
  program_duration: string
  current_skill_level: string
}

const EnrollmentId = () => {
  const { id } = useParams()
  const router = useRouter()
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!id) return

      try {
        const token = Cookies.get('userToken')
        if (!token) {
          console.error('No authentication token')
          setLoading(false)
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Your API returns { "Enrollment": { ... } } — note the capital "E"
        const data = response.data.Enrollment

        if (!data) {
          console.error('No enrollment data found in response:', response.data)
          setEnrollment(null)
        } else {
          setEnrollment(data)
        }
      } catch (error) {
        console.error('Error fetching enrollment:', error)
        setEnrollment(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollment()
  }, [id])

  const handleEdit = () => {
    router.push(`/admin/enrollment/edit/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-lg text-gray-600">Loading enrollment details...</p>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-xl text-red-600">Enrollment not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header with Title and Edit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Enrollment Details #{enrollment.id}
            </h1>

            <button
              onClick={handleEdit}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
            >
              <MdOutlineEdit className="h-5 w-5" />
              Edit Enrollment
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Full Name</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">{enrollment.full_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Gender</p>
                <p className="mt-2 text-xl font-semibold text-gray-900 capitalize">{enrollment.gender || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Contact Number</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">{enrollment.contact_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Email</p>
                <p className="mt-2 text-xl font-semibold text-gray-900 break-all">{enrollment.email}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Address</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">{enrollment.address || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Date of Birth</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">{enrollment.date_of_birth || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Program Duration</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">{enrollment.program_duration || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Current Skill Level</p>
                <p className="mt-2 text-xl font-semibold text-gray-900 capitalize">{enrollment.current_skill_level || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentId