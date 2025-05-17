'use client'
import { useParams } from 'next/navigation'
import { trainingProgram } from '../../../utils/training_program'
import { useEffect, useState } from 'react'

const EditTrainingProgram = () => {
  const params = useParams()
  const trainingProgramId = params.id

  // Find the order based on the ID
  const selectedProgram = trainingProgram.find(
    (item) => item.id === Number(trainingProgramId)
  )

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (selectedProgram) {
      setTitle(selectedProgram.title)
      setDescription(selectedProgram.description)
      setStartDate(selectedProgram.start_date)
      setEndDate(selectedProgram.end_date)
    }
  }, [selectedProgram])

  return (
    <div className="bg-white flex flex-col pb-[4rem]">
      <form>
        <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
          <div className="mt-4">
            <h1 className="font-semibold sm:text-xl text-lg">
              Edit Training Program #{selectedProgram?.id}
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
              <h1 className="text-gray-600 font-semibold">Start Date</h1>
              <input
                type="text"
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
                type="text"
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
          Submit
        </button>
      </form>
    </div>
  )
}

export default EditTrainingProgram
