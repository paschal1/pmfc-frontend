'use client'

import { MdOutlineRemoveRedEye, MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

type EnrollmentData = {
  id: number
  full_name: string
  gender: string
  contact_number: string
  email: string
  address: string
  date_of_birth: string
  program_duration: string
  current_skill_level: string
}

const ITEMS_PER_PAGE = 10

const Enrollment = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) {
          console.error('No authentication token')
          setLoading(false)
          return
        }

        const response = await axios.get('https://api.princem-fc.com/api/students', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data.enrollment || response.data.data || response.data
        setEnrollments(data)
      } catch (error) {
        console.error('Error fetching enrollments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enrollment? This action cannot be undone.')) {
      return
    }

    try {
      const token = Cookies.get('userToken')
      if (!token) return

      await axios.delete(`https://api.princem-fc.com/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setEnrollments((prev) => prev.filter((item) => item.id !== id))
      // Reset to page 1 if current page becomes empty
      if (filteredEnrollments.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error)
      alert('Failed to delete enrollment')
    }
  }

  // Filtered data
  const filteredEnrollments = enrollments.filter(
    (item) =>
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact_number.includes(searchTerm)
  )

  // Pagination logic
  const totalItems = filteredEnrollments.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filteredEnrollments.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Enrollment List</h1>

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
              setCurrentPage(1) // Reset to first page on search
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
                <th className="px-6 py-4 text-left font-semibold">Program</th>
                <th className="px-6 py-4 text-left font-semibold">Skill Level</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    Loading enrollments...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No matching enrollments found' : 'No enrollments yet'}
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 truncate max-w-xs">{item.full_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 capitalize">{item.gender || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{item.contact_number}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 truncate max-w-xs">{item.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 truncate max-w-sm">{item.address || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{item.program_duration || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 capitalize">{item.current_skill_level || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          href={`/admin/enrollment/${item.id}`}
                          className="text-purple-600 hover:text-purple-800"
                          title="View"
                        >
                          <MdOutlineRemoveRedEye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/enrollment/edit/${item.id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <MdOutlineEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
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
              {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} enrollments
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}

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

export default Enrollment