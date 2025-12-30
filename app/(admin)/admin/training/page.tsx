'use client'

import { MdOutlineRemoveRedEye, MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import toast from 'react-hot-toast'

type StudentsType = {
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
}

const ITEMS_PER_PAGE = 10

const Training = () => {
  const [students, setStudents] = useState<StudentsType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) {
          console.error('❌ No authentication token found')
          toast.error('Authentication token not found')
          setError('No authentication token')
          setLoading(false)
          return
        }

        console.log('🔍 Fetching students with token:', token.substring(0, 20) + '...')
        setError(null)

        const response = await axios.get('https://api.princem-fc.com/api/students', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })

        console.log('📡 API Response Status:', response.status)
        console.log('📡 Full API Response:', response.data)

        // Robust extraction: always ensure we have an array
        let data: StudentsType[] = []
        let foundDataIn: string = 'unknown'

        if (response.data) {
          // ✅ Pattern 1: Direct array
          if (Array.isArray(response.data)) {
            data = response.data
            foundDataIn = 'direct array'
            console.log('✅ Found data as direct array')
          }
          // ✅ Pattern 2: response.data.enrollment (LOWERCASE - actual API)
          else if (response.data.enrollment && Array.isArray(response.data.enrollment)) {
            data = response.data.enrollment
            foundDataIn = 'response.data.enrollment'
            console.log('✅ Found data in response.data.enrollment')
          }
          // ✅ Pattern 3: response.data.Enrollment (UPPERCASE - from form submissions)
          else if (response.data.Enrollment && Array.isArray(response.data.Enrollment)) {
            data = response.data.Enrollment
            foundDataIn = 'response.data.Enrollment'
            console.log('✅ Found data in response.data.Enrollment')
          }
          // ✅ Pattern 4: response.data.data (wrapped response)
          else if (response.data.data && Array.isArray(response.data.data)) {
            data = response.data.data
            foundDataIn = 'response.data.data'
            console.log('✅ Found data in response.data.data')
          }
          // ✅ Pattern 5: response.data.students
          else if (response.data.students && Array.isArray(response.data.students)) {
            data = response.data.students
            foundDataIn = 'response.data.students'
            console.log('✅ Found data in response.data.students')
          }
          // ✅ Pattern 6: response.data.enrollments
          else if (response.data.enrollments && Array.isArray(response.data.enrollments)) {
            data = response.data.enrollments
            foundDataIn = 'response.data.enrollments'
            console.log('✅ Found data in response.data.enrollments')
          }
          // ❌ Unknown structure
          else {
            console.warn('⚠️ Unexpected API structure:', response.data)
            console.warn('📋 Available keys:', Object.keys(response.data))
            toast('⚠️ Unexpected API response structure', {
              duration: 4000,
              style: {
                background: '#fbbf24',
                color: '#000',
              },
            })
            data = []
          }
        }

        console.log(`✅ Loaded ${data.length} students from ${foundDataIn}`)

        if (data.length === 0) {
          toast('No students found in database', {
            duration: 3000,
            icon: 'ℹ️',
          })
        } else {
          toast.success(`Loaded ${data.length} students`)
        }

        setStudents(data)
      } catch (error) {
        const errorMsg = error instanceof axios.AxiosError 
          ? `${error.response?.status}: ${error.response?.data?.message || error.message}`
          : error instanceof Error 
          ? error.message 
          : 'Unknown error'
        
        console.error('❌ Error fetching students:', errorMsg)
        toast.error(`Failed to load students: ${errorMsg}`)
        setError(errorMsg)
        setStudents([])
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student record?')) return

    try {
      const token = Cookies.get('userToken')
      if (!token) {
        toast.error('Authentication token not found')
        return
      }

      const deleteToast = toast.loading('Deleting student...')

      await axios.delete(`https://api.princem-fc.com/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setStudents((prev) => prev.filter((item) => item.id !== id))
      toast.success('Student deleted successfully', { id: deleteToast })
    } catch (error) {
      const errorMsg = error instanceof axios.AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to delete student'
      
      console.error('Error deleting student:', error)
      toast.error(errorMsg, { id: toast.loading('') })
    }
  }

  // Safe search filter — always works even if data is incomplete
  const filteredStudents = Array.isArray(students)
    ? students.filter((item) => {
        if (!searchTerm) return true

        const lowerSearch = searchTerm.toLowerCase()

        const name = (item.full_name || '').toLowerCase()
        const email = (item.email || '').toLowerCase()
        const contact = (item.contact_number || '').toLowerCase()
        const address = (item.address || '').toLowerCase()

        return (
          name.includes(lowerSearch) ||
          email.includes(lowerSearch) ||
          contact.includes(lowerSearch) ||
          address.includes(lowerSearch)
        )
      })
    : []

  // Pagination
  const totalItems = filteredStudents.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Error state
  if (error && students.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-bold text-red-700 mb-2">Failed to Load Students</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-red-500 mb-4">
            Check browser console (F12) for detailed error information
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          All Training Students ({students.length})
        </h1>

        <div className="flex items-center gap-3">
          <label htmlFor="search" className="text-gray-700 font-medium">
            Search:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Name, email, contact..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] w-full sm:w-64"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Full Name</th>
                <th className="px-6 py-4 text-left font-semibold">Gender</th>
                <th className="px-6 py-4 text-left font-semibold">Contact</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Address</th>
                <th className="px-6 py-4 text-left font-semibold">Skill Level</th>
                <th className="px-6 py-4 text-left font-semibold">Program</th>
                <th className="px-6 py-4 text-left font-semibold">Joining Date</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#fab702]"></div>
                      Loading students...
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No matching students found' : 'No students enrolled yet'}
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 truncate max-w-xs">{item.full_name || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 capitalize">{item.gender || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{item.contact_number || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 truncate max-w-xs">{item.email || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 truncate max-w-md">{item.address || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 capitalize">{item.current_skill_level || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{item.program_duration || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{item.joining_date || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          href={`/admin/training/${item.id}`}
                          className="text-purple-600 hover:text-purple-800 transition"
                          title="View"
                        >
                          <MdOutlineRemoveRedEye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/training/edit/${item.id}`}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                        >
                          <MdOutlineEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <RiDeleteBin5Line className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} students
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show first 5 pages or smart pagination
                const page = i + 1
                if (totalPages <= 5 || page <= 5) {
                  return page
                }
                return null
              }).map((page) =>
                page ? (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      page === currentPage
                        ? 'bg-[#fab702] text-white'
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ) : null
              )}

              {totalPages > 5 && (
                <span className="text-gray-500 px-2">...</span>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Training