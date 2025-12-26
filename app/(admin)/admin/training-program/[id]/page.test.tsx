'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { MdOutlineEdit } from 'react-icons/md'

type ProgramType = {
  id: number
  title: string
  description: string
  price: number
  start_date: string
  end_date: string
}

const TrainingProgramId = () => {
  const { id } = useParams()
  const router = useRouter()
  const [program, setProgram] = useState<ProgramType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return

      try {
        const token = Cookies.get('adminToken')
        if (!token) {
          console.error('No authentication token')
          setLoading(false)
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/training-programs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Handles common API response patterns
        const data = response.data.trainingProgram || response.data.data || response.data

        if (!data) {
          console.error('No program data found in response:', response.data)
          setProgram(null)
        } else {
          setProgram(data)
        }
      } catch (error) {
        console.error('Error fetching training program:', error)
        setProgram(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProgram()
  }, [id])

  const handleEdit = () => {
    router.push(`/admin/training-program/edit/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-lg text-gray-600">Loading program details...</p>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-xl text-red-600">Training program not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Training Program #{program.id}
            </h1>

            <button
              onClick={handleEdit}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
            >
              <MdOutlineEdit className="h-5 w-5" />
              Edit Program
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Title</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{program.title}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Description</p>
                <p className="mt-2 text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {program.description}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Price</p>
                <p className="mt-2 text-3xl font-bold text-[#fab702]">
                  ₦{Number(program.price).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Start Date</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {program.start_date || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">End Date</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {program.end_date || '-'}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Program Duration</p>
                <p className="text-lg font-semibold text-gray-900">
                  {program.start_date && program.end_date
                    ? `${program.start_date} → ${program.end_date}`
                    : 'Dates not set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainingProgramId