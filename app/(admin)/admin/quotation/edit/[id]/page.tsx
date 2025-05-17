'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { quotation } from '../../../utils/quotation'

const EditQuotation = () => {
  const params = useParams()
  const quotationId = params.id

  const selectedQuotation = quotation.find(
    (item) => item.id === Number(quotationId)
  )

  const [propertyType, setPropertyType] = useState('')
  const [areaSize, setAreaSize] = useState('')
  const [measurement, setMeasurement] = useState('')
  const [budget, setBudget] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (selectedQuotation) {
      setPropertyType(selectedQuotation.propertyType)
      setAreaSize(selectedQuotation.areaSize)
      setMeasurement(selectedQuotation.measurement)
      setBudget(selectedQuotation.budget)
      setName(selectedQuotation.name)
      setEmail(selectedQuotation.email)
      setContact(selectedQuotation.contact)
      setMessage(selectedQuotation.message)
    }
  }, [selectedQuotation])
  return (
    <div className="bg-white flex flex-col pb-[4rem]">
      <form>
        <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
          <div className="mt-4">
            <h1 className="font-semibold sm:text-xl text-lg">
              Edit Quotation #{selectedQuotation?.id}
            </h1>
          </div>
          <div className="mt-8 flex flex-col">
            <h1 className="font-semibold">Quotation Information</h1>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Property Type</h1>
              <input
                type="text"
                placeholder="Property Type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
              <h1 className="font-semibold text-[#4A5568]">Area Size</h1>
              <input
                type="text"
                placeholder="Area Size"
                value={areaSize}
                onChange={(e) => setAreaSize(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
              <h1 className="font-semibold text-[#4A5568]">Measurement</h1>
              <input
                type="text"
                placeholder="Measurement"
                value={measurement}
                onChange={(e) => setMeasurement(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
              <h1 className="font-semibold text-[#4A5568]">Budget</h1>
              <input
                type="text"
                placeholder="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
              <h1 className="font-semibold text-[#4A5568]">Name</h1>
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
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
              <h1 className="font-semibold text-[#4A5568]">Contact</h1>
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
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
              <h1 className="font-semibold text-[#4A5568]">Message</h1>
              <textarea
                title="text"
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
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

export default EditQuotation
