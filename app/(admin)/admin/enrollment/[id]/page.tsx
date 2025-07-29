'use client'
import { useParams } from 'next/navigation'
import { enrollment } from '../../utils/enrollment'
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

const EnrollmentId = () => {
  const { id: enrollmentId } = useParams()
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null)

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const token = Cookies.get('adminToken')

        if (!token) {
          console.error('No token found')
          return
        }

        const response = await axios.get(
          `https://api.princem-fc.com/api/students/${enrollmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = response.data.enrollment
        setEnrollment(data)
      } catch (error) {
        console.error('Error fetching student:', error)
      }
    }

    if (enrollmentId) fetchEnrollment()
  }, [enrollmentId])
  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {enrollment ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Enrollment #{enrollment.id}
              </h1>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tr className="border border-gray-300">
                  <td className="p-2 font-semibold bg-gray-200">Full Name</td>
                  <td className="p-2">{enrollment.full_name}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-2 font-semibold bg-gray-200">Gender</td>
                  <td className="p-2">{enrollment.gender}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-2 font-semibold bg-gray-200">Contact</td>
                  <td className="p-2">{enrollment.contact_number}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-2 font-semibold bg-gray-200">Email</td>
                  <td className="p-2">{enrollment.email}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-2 font-semibold bg-gray-200">Address</td>
                  <td className="p-2">{enrollment.address}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-2 font-semibold bg-gray-200">Date Of Birth</td>
                  <td className="p-2">{enrollment.date_of_birth}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-2 font-semibold bg-gray-200">Program Duration</td>
                  <td className="p-2">{enrollment.program_duration}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-2 font-semibold bg-gray-200">Skill Level</td>
                  <td className="p-2">{enrollment.current_skill_level}</td>
                </tr>
              </table>
            </div>
          </>
        ) : (
          <h1 className="text-gray-600 text-lg text-center mt-8">
            Training program not found.
          </h1>
        )}
      </div>
    </div>
  )
}

export default EnrollmentId
