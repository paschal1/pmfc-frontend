'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { testimonial } from '../../../utils/testimonials'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from 'axios'

const EditTestimonial = () => {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [name, setName] = useState('')
  const [review, setReview] = useState('')

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const token = Cookies.get('adminToken')
        if (!token) return

        const response = await axios.get(
          `https://api.princem-fc.com/api/testimonials/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const { data } = response
        setName(data.name)
        setReview(data.review)
      } catch (error) {
        console.error(error)
      }
    }

    fetchTestimonial()
  }, [id])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('review', review)
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('adminToken')
      if (!token) return

      const response = await axios.post(
        `https://api.princem-fc.com/api/testimonials/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.status === 200) {
        setSuccess('Review Updated Successfully')
        router.push('/admin/testimonial')
      } else {
        setError('Failed to update Testimonial')
      }
    } catch (error: any) {
      console.error(error)
      setError(error.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
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
  return (
    <div className="bg-white flex flex-col pb-[4rem]">
      <form onSubmit={handleSubmit}>
        <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
          <div className="mt-4">
            <h1 className="font-semibold sm:text-xl text-lg">
              Edit Testimonial #{id}
            </h1>
          </div>
          <div className="mt-8 flex flex-col">
            <h1 className="font-semibold">Testimonial Information</h1>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Name</h1>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
              <h1 className="font-semibold text-[#4A5568]">Review</h1>
              <textarea
                title="text"
                placeholder="Review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#fab702] flex items-center justify-center h-[40px] w-[140px] text-white rounded-[5px] mb-10 text-[14px] font-semibold xl:ml-[20rem] mx-auto hover:text-black hover:opacity-75 active:opacity-55 transition-all duration-500 ease-in-out"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {error && (
          <p className="text-red-600 text-center xl:text-left xl:ml-[27rem] mt-[-2rem]">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-center xl:text-left xl:ml-[27rem] mx-auto">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}

export default EditTestimonial
