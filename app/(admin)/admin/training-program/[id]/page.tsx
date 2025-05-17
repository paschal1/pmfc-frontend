'use client'
import { useParams } from 'next/navigation'
import { trainingProgram } from '../../utils/training_program'
const TrainingProgramId = () => {
  const params = useParams()
  const trainingProgramId = params.id

  // Find the order based on the ID
  const selectedProgram = trainingProgram.find(
    (item) => item.id === Number(trainingProgramId)
  )
  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {selectedProgram ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Training Program #{selectedProgram.id}
              </h1>
            </div>
            <div className="mt-4 flex flex-col">
              <div className="flex gap-4">
                <h1 className="sm:text-xl font-semibold">Title:</h1>
                <h1 className="text-gray-600 text-lg whitespace-nowrap">
                  {selectedProgram.title}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl font-semibold">Description:</h1>
                <h1 className="text-gray-600 lg:w-[400px] w-[700px] text-">
                  {selectedProgram.description}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl whitespace-nowrap font-semibold">
                  Start Date:
                </h1>
                <h1 className="text-gray-600 w-[400px] sm:text-lg">
                  {selectedProgram.start_date}
                </h1>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <h1 className="sm:text-xl whitespace-nowrap font-semibold">
                  End Date:
                </h1>
                <h1 className="text-gray-600 w-[400px] sm:text-lg">
                  {selectedProgram.end_date}
                </h1>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <h1 className="sm:text-xl whitespace-nowrap font-semibold">
                  Price:
                </h1>
                <h1 className="text-gray-600 w-[400px] sm:text-lg">
                  ₦
                  {selectedProgram?.price
                    ? selectedProgram.price.toLocaleString()
                    : '0'}
                </h1>
              </div>
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
