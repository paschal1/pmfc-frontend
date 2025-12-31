'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Image from 'next/image'

const EditProjectId = () => {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('') // project type
  const [fileName, setFileName] = useState('No file chosen')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) return

        const response = await axios.get(
          `https://api.princem-fc.com/api/projects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const projectData = response.data
        setTitle(projectData.title)
        setDescription(projectData.description)
        setStatus(projectData.status)
        setType(projectData.type)
        setImagePreview(projectData.image || '')
        setFileName(projectData.image ? 'Current Image' : 'No file chosen')
      } catch (err) {
        console.error(err)
        setError('Failed to fetch project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setFileName(file.name)
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImage(null)
      setFileName('No file chosen')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('status', status)
    formData.append('type', type)
    if (image) formData.append('image', image)
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('userToken')
      if (!token) throw new Error('Authentication token not found.')

      await axios.post(
        `https://api.princem-fc.com/api/projects/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setSuccess('Project updated successfully!')
      setTimeout(() => router.push('/admin/projects'), 1500)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-lg text-gray-600">Loading project...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
          Edit Project #{id}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                required
              />
            </div>
          </div>

          {/* Type & Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Project Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                required
              >
                <option value="" disabled>Select project type</option>
                <option value="residential">Residential</option>
                <option value="hospitality">Hospitality</option>
                <option value="office">Office</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                required
              >
                <option value="" disabled>Select status</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Project Image</label>
            {imagePreview && (
              <div className="mb-4">
                <Image
                  src={imagePreview}
                  alt="Project image"
                  width={600}
                  height={400}
                  className="rounded-xl object-cover border shadow-sm"
                  unoptimized
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:bg-[#fab702] file:text-white
                file:font-medium
                hover:file:bg-yellow-600 cursor-pointer"
            />
            <p className="mt-2 text-sm text-gray-500">Leave empty to keep current image</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-12 py-3.5 bg-[#fab702] text-white text-lg font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Feedback */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center font-medium">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default EditProjectId
