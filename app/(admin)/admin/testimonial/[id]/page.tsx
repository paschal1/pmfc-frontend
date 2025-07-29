'use client'
import { useParams } from 'next/navigation'
import { testimonial } from '../../utils/testimonials'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

type TestimonialData = {
  id: number
  user_id: number
  name: string
  review: string
}

const TestimonialId = () => {
  const {id: testimonialId} = useParams()
  const [testimonial, setTestimonial] = useState<TestimonialData | null>(null)

  useEffect(() => {
    const fetchTestimonialId = async () => {
      const token = Cookies.get('adminToken')
      if (!token) return

      try {
        const response = await axios.get(
          `https://api.princem-fc.com/api/testimonials/${testimonialId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const {data} = response
        setTestimonial(data)
      } catch (error) {
        console.error(error)
      }
    }

    if (testimonialId) fetchTestimonialId()
  }, [testimonialId])

  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {testimonial ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Testimonial #{testimonialId}
              </h1>
            </div>
            <div className="mt-4 flex flex-col">
              <div className="flex gap-4">
                <h1 className="sm:text-xl font-semibold">Name:</h1>
                <h1 className="text-gray-600 text-lg whitespace-nowrap">
                  {testimonial.name}
                </h1>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <h1 className="sm:text-xl font-semibold">Review:</h1>
                <h1 className="text-gray-600 lg:w-[400px] w-[700px] text-">
                  {testimonial.review}
                </h1>
              </div>
            </div>
          </>
        ) : (
          <h1 className="text-gray-600 text-lg text-center mt-8">
            Testimonial not found.
          </h1>
        )}
      </div>
    </div>
  )
}

export default TestimonialId
