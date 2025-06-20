'use client'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useEffect, useState } from 'react'

const AddNewTrainingProgram = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('start_date', startDate)
    formData.append('end_date', endDate)

    try {
      const token = Cookies.get('adminToken')

      if (!token) {
        console.error('No token found')
        return
      }

      const response = await axios.post(
        'https://api.princem-fc.com/api/training-programs',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200 || response.status === 201) {
        setSuccess('Training Program added successfully!')
        setLoading(false)
        setTitle('')
        setDescription('')
        setPrice('')
        setStartDate('')
        setEndDate('')
      } else {
        setError('Failed to add product')
      }
    } catch (error: any) {
      setLoading(false)
      setError(error.response.data.message)
    }
  }

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [error, success])

  return (
    <div className="bg-white min-h-screen w-full flex flex-col pb-[4rem]">
      <form onSubmit={handleSubmit}>
        <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
          <div className="mt-4">
            <h1 className="font-semibold sm:text-xl text-lg">
              Add New Training Program
            </h1>
          </div>
          <div className="mt-8 flex flex-col">
            <h1 className="font-semibold">Training Program Details</h1>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <div className="flex gap-1">
                <h1 className="text-gray-600 font-semibold">Title</h1>
                <h1 className="text-red-600 font-semibold">*</h1>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
              <div className="flex gap-1">
                <h1 className="text-gray-600 font-semibold">Description</h1>
                <h1 className="text-red-600 font-semibold">*</h1>
              </div>
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
              <div className="flex gap-1">
                <h1 className="text-gray-600 font-semibold">Price</h1>
                <h1 className="text-red-600 font-semibold">*</h1>
              </div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <div className="flex gap-1">
                <h1 className="text-gray-600 font-semibold">Start Date</h1>
                <h1 className="text-red-600 font-semibold">*</h1>
              </div>
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
              <div className="flex gap-1">
                <h1 className="text-gray-600 font-semibold">End Date</h1>
                <h1 className="text-red-600 font-semibold">*</h1>
              </div>
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
          <p className="text-red-600 mx-auto text-center lg:text-left xl:ml-[27rem] mt-[-2rem]">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-center lg:text-left mt-[-2rem] xl:ml-[27rem] mx-auto">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}

export default AddNewTrainingProgram
