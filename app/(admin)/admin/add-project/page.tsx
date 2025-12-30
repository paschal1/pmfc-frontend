'use client'

import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const AddProject = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [imageFile, setImageFile] = useState('No File Chosen')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file.name)
      setImage(file)
    } else {
      setImageFile('No File Chosen')
      setImage(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('status', status)
    if (image) formData.append('image', image)

    try {
      const token = Cookies.get('userToken')
      if (!token) {
        setError('Authentication token not found.')
        setLoading(false)
        return
      }

      const response = await axios.post(
        'https://api.princem-fc.com/api/projects',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.status === 200 || response.status === 201) {
        setSuccess('Project added successfully!')
        setTitle('')
        setDescription('')
        setStatus('')
        setImageFile('No File Chosen')
        setImage(null)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to add project. Please try again.')
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
    <div className="min-h-screen bg-[#F2F2F2] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center lg:text-left">
          Add New Project
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 lg:p-10">
          <div className="space-y-8">
            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="font-semibold text-[#4A5568] text-right">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                className="col-span-2 w-full px-4 py-3 border border-[#EFEFEF] bg-[#F9F9F9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <label className="font-semibold text-[#4A5568] text-right">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                rows={5}
                className="col-span-2 w-full px-4 py-3 border border-[#EFEFEF] bg-[#F9F9F9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition resize-none"
                required
              />
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="font-semibold text-[#4A5568] text-right">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="col-span-2 w-full px-4 py-3 border border-[#EFEFEF] bg-[#F9F9F9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] transition"
                required
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label className="font-semibold text-[#4A5568] text-right">
                Project Image
              </label>
              <div className="col-span-2">
                <input
                  type="file"
                  accept="image/*"
                  id="project-image"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="project-image"
                  className="flex items-center w-full border-2 border-dashed border-gray-300 bg-[#F9F9F9] rounded-lg cursor-pointer hover:border-[#fab702] hover:bg-gray-50 transition"
                >
                  <span className="px-5 py-3 bg-[#fab702] text-white font-medium">
                    Choose File
                  </span>
                  <span className="px-4 py-3 text-gray-600 truncate flex-1 text-left">
                    {imageFile}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#fab702] text-white font-bold px-10 py-4 rounded-lg hover:bg-[#e0a600] active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Add Project'}
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <p className="mt-6 text-center text-red-600 font-medium bg-red-50 py-3 rounded-lg">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-6 text-center text-green-600 font-medium bg-green-50 py-3 rounded-lg">
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default AddProject