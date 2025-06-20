'use client'
import { useParams, useRouter } from 'next/navigation'
import { trainingProgram } from '../../../utils/training_program'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const EditTrainingProgram = () => {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchTrainingProgram = async () => {
      try {
        const token = Cookies.get('adminToken')
        if (!token) return

        const response = await axios.get(
          `https://api.princem-fc.com/api/training-programs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const programData = response.data.trainingProgram
        setTitle(programData.title)
        setDescription(programData.description)
        setPrice(programData.price)
        setStartDate(programData.start_date)
        setEndDate(programData.end_date)
      } catch (error) {
        console.error('Error fetching Training program:', error)
      }
    }

    fetchTrainingProgram()
  }, [id])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('start_date', startDate)
    formData.append('end_date', endDate)
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('adminToken')
      if (!token) return

      const response = await axios.post(
        `https://api.princem-fc.com/api/training-programs/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        setSuccess('Training program updated successfully!')
        router.push('/admin/training-program')
      } else {
        setError('Failed to update training program')
      }
    } catch (error: any) {
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
              Edit Training Program #{id}
            </h1>
          </div>
          <div className="mt-8 flex flex-col">
            <h1 className="font-semibold">Training Program Information</h1>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Title</h1>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
              <h1 className="font-semibold text-[#4A5568]">Description</h1>
              <textarea
                title="text"
                placeholder="Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Price</h1>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Start Date</h1>
              <input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">End Date</h1>
              <input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
          <p className="text-green-600 text-center xl:text-left mt-[-2rem] xl:ml-[27rem] mx-auto">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}

export default EditTrainingProgram
