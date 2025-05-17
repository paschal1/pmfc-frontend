'use client'
import { useParams } from 'next/navigation'
import { enrollment } from '../../utils/enrollment'

const EnrollmentId = () => {
  const params = useParams()
  const enrollmentId = params.id

  // Find the order based on the ID
  const selectedEnrollment = enrollment.find(
    (item) => item.id === Number(enrollmentId)
  )
  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {selectedEnrollment ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Enrollment #{selectedEnrollment.id}
              </h1>
            </div>
            <div className="mt-4 flex flex-col">
              <div className="flex gap-4">
                <h1 className="sm:text-xl font-semibold">Name:</h1>
                <h1 className="text-gray-600 text-lg whitespace-nowrap">
                  {selectedEnrollment.name}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl font-semibold">Email:</h1>
                <h1 className="text-gray-600 lg:w-[400px] w-[700px] text-">
                  {selectedEnrollment.email}
                </h1>
              </div>
              <div className="flex gap-4 mt-4">
                <h1 className="sm:text-xl whitespace-nowrap font-semibold">
                  Contact:
                </h1>
                <h1 className="text-gray-600 w-[400px] sm:text-lg">
                  {selectedEnrollment.contact}
                </h1>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <h1 className="sm:text-xl whitespace-nowrap font-semibold">
                  Student ID:
                </h1>
                <h1 className="text-gray-600 w-[400px] sm:text-lg">
                  {selectedEnrollment.studentId}
                </h1>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <h1 className="sm:text-xl whitespace-nowrap font-semibold">
                  Training ID:
                </h1>
                <h1 className="text-gray-600 w-[400px] sm:text-lg">
                  {selectedEnrollment.trainingProgramId}
                </h1>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <h1 className="sm:text-xl whitespace-nowrap font-semibold">
                  Date:
                </h1>
                <h1 className="text-gray-600 w-[400px] sm:text-lg">
                  {selectedEnrollment.enrollmentDate}
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

export default EnrollmentId
