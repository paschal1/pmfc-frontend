'use client'

import { MdOutlineRemoveRedEye, MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

type TestimonialData = {
  id: number
  user_id: number
  name: string
  review: string
}

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const token = Cookies.get('adminToken')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await axios.get('https://api.princem-fc.com/api/testimonials', {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Adjust based on your API response structure
        const data = response.data.data || response.data
        setTestimonials(data)
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const token = Cookies.get('adminToken')
      if (!token) return

      await axios.delete(`https://api.princem-fc.com/api/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      alert('Failed to delete testimonial')
    }
  }

  // Search filter
  const filteredTestimonials = testimonials.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.review.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Testimonials</h1>

        <div className="flex items-center gap-3">
          <label htmlFor="search" className="text-gray-700 font-medium">
            Search:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Name or review..."
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
                <th className="px-6 py-4 text-left font-semibold">User ID</th>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Review</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    Loading testimonials...
                  </td>
                </tr>
              ) : filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No matching testimonials found' : 'No testimonials yet'}
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{item.user_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800 truncate max-w-xs block">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 max-w-lg truncate">{item.review}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          href={`/admin/testimonial/${item.id}`}
                          className="text-purple-600 hover:text-purple-800"
                          title="View"
                        >
                          <MdOutlineRemoveRedEye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/testimonial/edit/${item.id}`}
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
      </div>
    </div>
  )
}

export default Testimonial