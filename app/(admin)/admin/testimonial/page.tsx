'use client'
import { testimonial } from '../utils/testimonials'
import { MdOutlineEdit, MdOutlineRemoveRedEye } from 'react-icons/md'
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
  const [testimonial, setTestimonial] = useState<TestimonialData[]>([])

  useEffect(() => {
    const fetchTestimonial = async () => {
      const token = Cookies.get('adminToken')
      if (!token) return

      try {
        const response = await axios.get(
          'https://api.princem-fc.com/api/testimonials',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const { data } = response
        console.log(data)
        setTestimonial(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchTestimonial()
  }, [])
  return (
    <div className="bg-white min-h-screen w-full flex flex-col pb-[3rem]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
          <h1 className="font-semibold sm:text-xl text-lg">Testimonials</h1>
          <div className="mt-4">
            <label className="mr-3">Search</label>
            <input
              type="text"
              placeholder=""
              title="search"
              className="border bg-inherit border-black focus:outline-none pl-2 h-[35px] w-[150px] rounded-[4px]"
            />
          </div>
        </div>
        <div className="mt-8 overflow-x-auto relative">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-200 rounded-[6px] text-[#4A5568]">
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  User Id
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Name</th>
                <th className="lg:px-24 px-8 py-2 whitespace-nowrap">Review</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Option</th>
              </tr>
            </thead>
            <tbody>
              {testimonial.map((item) => (
                <tr key={item.id} className="even:bg-white odd:bg-[#F2F2F2]">
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] whitespace-nowrap">
                      {item.user_id}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] whitespace-nowrap">
                      {item.name}
                    </h1>
                  </td>
                  <td className="lg:px-24 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] w-[400px]">
                      {item.review}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3 flex gap-3">
                    <Link href={`/admin/testimonial/${item.id}`}>
                      <MdOutlineRemoveRedEye
                        className="h-[20px] w-[20px] text-purple-400"
                        data-testid="view-icon"
                      />
                    </Link>
                    <Link href={`/admin/testimonial/edit/${item.id}`}>
                      <MdOutlineEdit
                        className="h-[20px] w-[20px] text-blue-400"
                        data-testid="edit-icon"
                      />
                    </Link>
                    <RiDeleteBin5Line
                      className="h-[20px] w-[20px] text-red-400 cursor-pointer"
                      data-testid="delete-icon"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Testimonial
