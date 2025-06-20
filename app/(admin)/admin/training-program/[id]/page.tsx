'use client'
import { useParams } from 'next/navigation'
import { trainingProgram } from '../../utils/training_program'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

type ProgramType = {
  id: number
  title: string
  description: string
  price: number
  start_date: string
  end_date: string
}
const TrainingProgramId = () => {
  const { id: trainingProgramId } = useParams()
  const [trainingProgram, setTrainingProgram] = useState<ProgramType | null>(null)

  useEffect(() => {
    const fetchTrainingProgram = async () => {
      try {
        const token = Cookies.get('adminToken')

        if (!token) {
          console.error('No token found')
          return
        }

        const response = await axios.get(
          `https://api.princem-fc.com/api/training-programs/${trainingProgramId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const programData = response.data.trainingProgram
        setTrainingProgram(programData)
      } catch (error) {
        console.error('Error fetching program:', error)
      }
    }

    if (trainingProgramId) fetchTrainingProgram()
  }, [trainingProgramId])

  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {trainingProgram ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Training Program #{trainingProgram.id}
              </h1>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Title</td>
                    <td className="p-2">{trainingProgram.title}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Description
                    </td>
                    <td className="p-2">{trainingProgram.description}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Price</td>
                    <td className="p-2">{trainingProgram.price}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Start Date
                    </td>
                    <td className="p-2">{trainingProgram.start_date}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">End Date </td>
                    <td className="p-2">{trainingProgram.end_date}</td>
                  </tr>
                </tbody>
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

export default TrainingProgramId
