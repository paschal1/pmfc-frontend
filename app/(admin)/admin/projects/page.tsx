'use client'
import Link from 'next/link'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { projectData } from '../../../(main)/data/projects'
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
  const [project, setProject] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get('adminToken')

        if (!token) {
          console.error('No token found')
          return
        }

        const response = await axios.get(
          'https://api.princem-fc.com/api/projects',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const projectData = response.data
        setProject(projectData)
        console.log('Fetched project:', projectData)
        // console.log(products)
      } catch (error) {
        console.error('Error fetching category:', error)
      }
    }

    fetchProducts()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get('adminToken')
      if (!token) {
        console.error('No token found')
        return
      }

      await axios.delete(`https://api.princem-fc.com/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProject((prev) => prev.filter((item) => item.id !== id))
    } catch (error: any) {
      console.error('Error deleting project:', error)
    }
  }

  return (
    <div className="bg-white min-h-screen w-full flex flex-col pb-[3rem]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
          <h1 className="font-semibold sm:text-xl text-lg">Projects </h1>
          <div className="mt-4">
            <label className="mr-3">Search</label>
            <input
              type="text"
              placeholder=""
              title="search"
              className="border bg-inherit border-black focus:outline-none pl-2 h-[35px] w-[150px] rounded-[4px]"
            />
          </div>
        </div>
        <div className="mt-8 overflow-x-auto relative">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-200 rounded-[6px] text-[#4A5568]">
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Title</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Section
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Image</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Status</th>
                <th className="lg:px-16 px-8 py-2">Option</th>
              </tr>
            </thead>
            <tbody>
              {project.map((item) => (
                <tr key={item.id} className="even:bg-white odd:bg-[#F2F2F2]">
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] whitespace-nowrap">
                      {item.title}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.description}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <div className="w-[150px] h-[100px] flex items-center justify-center rounded-xl">
                      <img
                        src={item.image}
                        alt="img"
                        className="h-[80px] w-[180px] object-cover"
                      />
                    </div>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.status}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3 flex mt-9 gap-3">
                    <Link href={`/admin/projects/${item.id}`}>
                      <MdOutlineRemoveRedEye className="h-[20px] w-[20px] text-purple-400" />
                    </Link>
                    <Link href={`/admin/projects/edit/${item.id}`}>
                      <MdOutlineEdit className="h-[20px] w-[20px] text-blue-400" />
                    </Link>
                    <RiDeleteBin5Line onClick={() => handleDelete(item.id)} className="h-[20px] w-[20px] text-red-400 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Projects
