'use client'
import { useParams } from 'next/navigation'
import { projectData } from '../../../../(main)/data/projects'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

type ProjectData = {
  id: number
  title: string
  description: string
  status: string
  image: string
}

const ProjectId = () => {
  const {id: projectId} = useParams()
  const [project, setProject] = useState<ProjectData | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = Cookies.get('adminToken')

        if (!token) {
          return
        }

        const response = await axios.get(
          `https://api.princem-fc.com/api/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const projectData = response.data
        setProject(projectData)
        console.log('Fetched project:', projectData)
      } catch (error) {
        console.error('Error fetching Category', error)
      }
    }

    if (projectId) fetchProduct()
  }, [projectId])

  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {project ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Project #{project.id}
              </h1>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Title</td>
                    <td className="p-2">{project.title}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Description
                    </td>
                    <td className="p-2">{project.description}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Status
                    </td>
                    <td className="p-2">{project.status}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Image </td>
                    <td className="p-2">
                      <img
                        src={project.image}
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
