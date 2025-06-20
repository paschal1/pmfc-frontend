'use client'

import { MdOutlineEdit, MdOutlineRemoveRedEye } from 'react-icons/md'
import { enrollment } from '../utils/enrollment'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

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

const Enrollment = () => {
  const [enrollment, setEnrollment] = useState<EnrollmentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get('adminToken')

        if (!token) {
          console.error('No token found')
          return
        }

        const response = await axios.get(
          'https://api.princem-fc.com/api/students',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const enrollmentData = response.data.enrollment
        setEnrollment(enrollmentData)
        console.log('Fetched Enrollment:', enrollmentData)
        // console.log(products)
      } catch (error) {
        console.error('Error fetching category:', error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="bg-white flex flex-col pb-[3rem]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
          <h1 className="font-semibold sm:text-xl text-lg">Enrollment List</h1>
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
                  Full Name
                </th>
                <th className="lg:px-24 px-8 py-2 whitespace-nowrap">Gender</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Contact
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Email</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Address
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Program Duration
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Current Skill
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Option</th>
              </tr>
            </thead>
            <tbody>
              {enrollment.map((item) => (
                <tr key={item.id} className="even:bg-white odd:bg-[#F2F2F2]">
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] whitespace-nowrap">
                      {item.full_name}
                    </h1>
                  </td>
                  <td className="lg:px-24 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] w-[300px]">
                      {item.gender}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.contact_number}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.email}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.address}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.program_duration}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.current_skill_level}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3 flex mt-9 gap-3">
                    <Link href={`/admin/enrollment/${item.id}`}>
                      <MdOutlineRemoveRedEye
                        className="h-[20px] w-[20px] text-purple-400"
                        data-testid="view-icon"
                      />
                    </Link>
                    <Link href={`/admin/enrollment/edit/${item.id}`}>
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

export default Enrollment
