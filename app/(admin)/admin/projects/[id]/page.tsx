'use client'
import { useParams } from 'next/navigation'
import { projectData } from '../../../../(main)/data/projects'
const ProjectId = () => {
  const params = useParams()
  const projectId = params.id

  // Find the service based on the ID
  const selectedProject = projectData.find((item) => item.id === Number(projectId))

  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {selectedProject ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Project #{selectedProject.id}
              </h1>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Title</td>
                    <td className="p-2">{selectedProject.title}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Section
                    </td>
                    <td className="p-2">{selectedProject.section}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Image </td>
                    <td className="p-2">
                      <img
                        src={selectedProject.image}
                        alt="Service Image 1"
                        className="w-[250px] h-32 object-cover rounded-md"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <h1 className="text-gray-600 text-lg text-center mt-8">
            Project not found.
          </h1>
        )}
      </div>
    </div>
  )
}

export default ProjectId
