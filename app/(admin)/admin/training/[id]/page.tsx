'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { MdOutlineEdit } from 'react-icons/md'
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
  id_proof?: string | null
  resume?: string | null
  created_at?: string
  updated_at?: string
}

const StudentDetailsPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<StudentType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return

      try {
        const token = Cookies.get('userToken')
        if (!token) {
          toast.error('Authentication token not found')
          setLoading(false)
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
          setStudent(null)
        } else {
          console.log('✅ Loaded student:', data.full_name)
          setStudent(data)
        }
      } catch (error) {
        console.error('Error fetching student:', error)
        toast.error('Failed to load student details')
        setStudent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id])

  const handleEdit = () => {
    router.push(`/admin/training/edit/${id}`)
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

  if (!student) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Student not found</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header with Title and Edit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                Student Details
              </h1>
              <p className="text-gray-500 mt-1">ID: #{student.id}</p>
            </div>

            <button
              onClick={handleEdit}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
            >
              <MdOutlineEdit className="h-5 w-5" />
              Edit Student
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Personal Information */}
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Full Name</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{student.full_name || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Email</p>
                    <p className="mt-1 text-lg text-gray-900">{student.email || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Contact Number</p>
                    <p className="mt-1 text-lg text-gray-900">{student.contact_number || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Gender</p>
                    <p className="mt-1 text-lg text-gray-900 capitalize">{student.gender || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Age</p>
                    <p className="mt-1 text-lg text-gray-900">{student.age || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Date of Birth</p>
                    <p className="mt-1 text-lg text-gray-900">{student.date_of_birth || '-'}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Address</p>
                <p className="mt-2 text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {student.address || '-'}
                </p>
              </div>
            </div>

            {/* Right Column - Program Information */}
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Program Information</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Current Skill Level</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">
                      {student.current_skill_level || '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Program Duration</p>
                    <p className="mt-1 text-lg text-gray-900">{student.program_duration || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Joining Date</p>
                    <p className="mt-1 text-lg text-gray-900">{student.joining_date || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Emergency Contact</p>
                <p className="mt-2 text-lg text-gray-900">{student.emergency_contact || '-'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Previous Experience</p>
                <p className="mt-2 text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {student.previous_experience || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Goals Section */}
          {student.goals && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm font-medium text-blue-900 uppercase tracking-wider">Training Goals</p>
              <p className="mt-2 text-lg text-blue-800 leading-relaxed whitespace-pre-wrap">
                {student.goals}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-600">Enrolled on:</p>
                <p className="text-gray-900 font-semibold">
                  {student.created_at
                    ? new Date(student.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last updated:</p>
                <p className="text-gray-900 font-semibold">
                  {student.updated_at
                    ? new Date(student.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetailsPage