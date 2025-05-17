'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { enrollment } from '../../../utils/enrollment'
const EditEnrollmentId = () => {
  const params = useParams()
  const enrollmentId = params.id

  const selectedEnrollment = enrollment.find(
    (item) => item.id === Number(enrollmentId)
  )

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState<number | null>(null)
  const [studentId, setStudentId] = useState<number | null>(null)
  const [trainingProgramId, setTrainingProgramId] = useState<number | null>(
    null
  )
  const [enrollmentDate, setEnrollmentDate] = useState('')

  useEffect(() => {
    if (selectedEnrollment) {
      setName(selectedEnrollment.name)
      setEmail(selectedEnrollment.email)
      setContact(selectedEnrollment.contact)
      setStudentId(selectedEnrollment.studentId)
      setTrainingProgramId(selectedEnrollment.trainingProgramId)
      setEnrollmentDate(selectedEnrollment.enrollmentDate)
    }
  }, [selectedEnrollment])
  return (
    <div className="bg-white flex flex-col pb-[4rem]">
      <form>
        <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
          <div className="mt-4">
            <h1 className="font-semibold sm:text-xl text-lg">
              Edit Student Enrollment #{selectedEnrollment?.id}
            </h1>
          </div>
          <div className="mt-8 flex flex-col">
            <h1 className="font-semibold">Student Information</h1>
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
              <h1 className="font-semibold text-[#4A5568]">Email</h1>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Contact</h1>
              <input
                type="number"
                placeholder="Contact"
                value={contact ?? ''}
                onChange={(e) =>
                  setContact(e.target.value ? Number(e.target.value) : null)
                }
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Student ID</h1>
              <input
                type="number"
                placeholder="Student ID"
                value={studentId ?? ''}
                onChange={(e) =>
                  setStudentId(e.target.value ? Number(e.target.value) : null)
                }
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Training ID</h1>
              <input
                type="number"
                placeholder="Training ID"
                value={trainingProgramId ?? ''}
                onChange={(e) =>
                  setTrainingProgramId(e.target.value ? Number(e.target.value) : null)
                }
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Enrollment Date</h1>
              <input
                type="text"
                placeholder="Enrollment Date"
                value={enrollmentDate}
                onChange={(e) =>
                  setEnrollmentDate(e.target.value)
                }
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
          Submit
        </button>
      </form>
    </div>
  )
}

export default EditEnrollmentId
