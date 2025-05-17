'use client'
import { useParams } from 'next/navigation'
import { quotation } from '../../utils/quotation'

const QuotationId = () => {
  const params = useParams()
  const quotationId = params.id

  const selectedQuotation = quotation.find(
    (item) => item.id === Number(quotationId)
  )

  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {selectedQuotation ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Quotation #{selectedQuotation.id}
              </h1>
            </div>
            <div className="mt-4 flex flex-col">
              <div className="flex gap-4">
                <h1 className="sm:text-xl font-semibold">Property Type:</h1>
                <h1 className="text-gray-600 text-lg whitespace-nowrap">
                  {selectedQuotation.propertyType}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl font-semibold">Area Size:</h1>
                <h1 className="text-gray-600 lg:w-[400px] w-[700px] text-">
                  {selectedQuotation.areaSize}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl font-semibold">Measurement:</h1>
                <h1 className="text-gray-600 lg:w-[400px] w-[700px] text-">
                  {selectedQuotation.measurement}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl font-semibold">Budget:</h1>
                <h1 className="text-gray-600 lg:w-[400px] w-[700px] text-">
                  {selectedQuotation.budget}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl font-semibold">Name:</h1>
                <h1 className="text-gray-600 lg:w-[400px] w-[700px] text-">
                  {selectedQuotation.name}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl font-semibold">Email:</h1>
                <h1 className="text-gray-600 lg:w-[400px] w-[700px] text-">
                  {selectedQuotation.email}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl font-semibold">Contact:</h1>
                <h1 className="text-gray-600 lg:w-[400px] w-[700px] text-">
                  {selectedQuotation.contact}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl font-semibold">Message:</h1>
                <h1 className="text-gray-600 lg:w-[400px] w-[700px] text-">
                  {selectedQuotation.message}
                </h1>
              </div>
            </div>
          </>
        ) : (
          <h1 className="text-gray-600 text-lg text-center mt-8">
            Quotation not found.
          </h1>
        )}
      </div>
    </div>
  )
}

export default QuotationId
