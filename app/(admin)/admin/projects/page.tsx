'use client'

import Link from 'next/link'
import { MdOutlineRemoveRedEye, MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

type ProjectData = {
  id: number
  title: string
  description: string
  status: string
  image: string
}

const Projects = () => {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) {
          console.error('No authentication token found')
          setLoading(false)
          return
        }

        const response = await axios.get('https://api.princem-fc.com/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Ensure projects is an array
        const projectsArray = Array.isArray(response.data) 
          ? response.data 
          : response.data.data || [] // adjust if API returns { data: [...] }

        setProjects(projectsArray)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const token = Cookies.get('userToken')
      if (!token) return

      await axios.delete(`https://api.princem-fc.com/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setProjects((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  // Only filter if projects is an array
  const filteredProjects = Array.isArray(projects)
    ? projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  return (
    <div className="min-h-screen bg-[#F2F2F2] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Projects
          </h1>
          <div className="flex items-center gap-3">
            <label htmlFor="search" className="text-gray-700 font-medium">
              Search:
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Title or description..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Title</th>
                  <th className="px-6 py-4 text-left font-semibold">Description</th>
                  <th className="px-6 py-4 text-left font-semibold text-center">Image</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      Loading projects...
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800 truncate max-w-xs">
                          {item.title}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 truncate max-w-md">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden border">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === 'ongoing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <Link
                            href={`/admin/projects/${item.id}`}
                            className="text-purple-600 hover:text-purple-800 transition"
                            title="View"
                          >
                            <MdOutlineRemoveRedEye className="h-5 w-5" />
                          </Link>
                          <Link
                            href={`/admin/projects/edit/${item.id}`}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Edit"
                          >
                            <MdOutlineEdit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Delete"
                          >
                            <RiDeleteBin5Line className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Projects
