'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Image from 'next/image'

type ProjectData = {
  id: number
  title: string
  description: string
  status: string
  image: string
}

const ProjectId = () => {
  const { id: projectId } = useParams()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return

      try {
        const token = Cookies.get('userToken')
        if (!token) {
          console.error('No authentication token')
          setLoading(false)
          return
        }

        const response = await axios.get(
          `https://api.princem-fc.com/api/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        setProject(response.data)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
        <p className="text-xl text-gray-600">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
          Project Details #{project.id}
        </h1>

        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 lg:p-10">
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Title */}
              <div className="md:col-span-3">
                <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Title
                </dt>
                <dd className="mt-2 text-lg font-medium text-gray-900">
                  {project.title}
                </dd>
              </div>

              {/* Description */}
              <div className="md:col-span-3">
                <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Description
                </dt>
                <dd className="mt-2 text-gray-800 whitespace-pre-wrap">
                  {project.description}
                </dd>
              </div>

              {/* Status */}
              <div>
                <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Status
                </dt>
                <dd className="mt-2">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'ongoing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </dd>
              </div>

              {/* Image */}
              <div className="md:col-span-2">
                <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Project Image
                </dt>
                <dd className="mt-2">
                  <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectId