'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { MdOutlineEdit } from 'react-icons/md'

type TestimonialData = {
  id: number
  user_id: number
  name: string
  review: string
}

const TestimonialId = () => {
  const { id } = useParams()
  const router = useRouter()
  const [testimonial, setTestimonial] = useState<TestimonialData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonial = async () => {
      if (!id) return

      try {
        const token = Cookies.get('adminToken')
        if (!token) {
          console.error('No authentication token')
          setLoading(false)
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Adjust based on your API structure
        const data = response.data.data || response.data
        setTestimonial(data)
      } catch (error) {
        console.error('Error fetching testimonial:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonial()
  }, [id])

  const handleEdit = () => {
    router.push(`/admin/testimonial/edit/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-lg text-gray-600">Loading testimonial...</p>
      </div>
    )
  }

  if (!testimonial) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-xl text-red-600">Testimonial not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header with Title and Edit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Testimonial #{testimonial.id}
            </h1>

            <button
              onClick={handleEdit}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
            >
              <MdOutlineEdit className="h-5 w-5" />
              Edit Testimonial
            </button>
          </div>

          <div className="space-y-8">
            {/* User ID & Name */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">User ID</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">{testimonial.user_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Name</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">{testimonial.name}</p>
              </div>
            </div>

            {/* Review */}
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-3">Review</p>
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                  "{testimonial.review}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialId