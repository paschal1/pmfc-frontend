'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { projectData } from '../../../../../(main)/data/projects'

const EditProjectId = () => {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [fileName, setFileName] = useState('No file chosen')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = Cookies.get('adminToken')
        if (!token) return

        const response = await axios.get(
          `https://api.princem-fc.com/api/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const projectData = response.data
        setTitle(projectData.title)
        setDescription(projectData.description)
        setStatus(projectData.status)
        setFileName(projectData.fileName || 'No File chosen')
      } catch (error) {
        console.error('Error fetching Category:', error)
      }
    }

    fetchProject()
  }, [id])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setImage(file)
    } else {
      setFileName('No file chosen')
      setImage(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('status', status)
    if (image) formData.append('image', image)
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('adminToken')
      if (!token) return

      const response = await axios.post(
        `https://api.princem-fc.com/api/projects/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        setSuccess('Project updated successfully!')
        router.push('/admin/projects')
      } else {
        setError('Failed to update Project.')
      }
    } catch (error: any) {
      console.error(error)
      setError(error.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])
  return (
    <div className="bg-white min-h-screen w-full flex flex-col pb-[4rem]">
      <form onSubmit={handleSubmit}>
        <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="font-semibold sm:text-xl text-lg">
            Edit Project #{id}
          </h1>
          <div className="mt-8 flex flex-col">
            <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Title</h1>
              <input
                type="text"
                placeholder="Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Description</h1>
              <input
                type="text"
                placeholder="Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Status</h1>
              <input
                type="text"
                placeholder="status..."
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
              <h1 className="font-semibold text-[#4A5568]">Image</h1>
              <div className="custom-file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="hidden"
                  // required
                />
                <label
                  htmlFor="image"
                  className="custom-file-label border border-gray-200 bg-[#F9F9F6] lg:w-[539px] h-[40px] focus:outline-none rounded-[5px] text-[#4A5568] flex items-center cursor-pointer"
                >
                  <span className="file-label-text bg-gray-200 h-[40px] px-3 text-black flex items-center">
                    Choose File
                  </span>
                  <span className="file-name text-sm text-gray-500 ml-4">
                    {fileName}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#fab702] flex items-center justify-center h-[40px] w-[140px] text-white rounded-[5px] mb-10 text-[14px] font-semibold xl:ml-[20rem] mx-auto hover:text-black hover:opacity-75 active:opacity-55 transition-all duration-500 ease-in-out"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {error && (
          <p className="text-red-600 text-center xl:text-left xl:ml-[27rem] mt-[-2rem]">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-center xl:text-left xl:ml-[27rem] mx-auto">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}

export default EditProjectId
