'use client'

import React, { useState, useCallback, useEffect } from 'react'
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
      setImageFile('No file chosen')
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

    try {
      const token = Cookies.get('adminToken')

      if (!token) return

      const response = await axios.post(
        'https://api.princem-fc.com/api/projects',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200 || response.status === 201) {
        setSuccess('Project added successfully')
        setLoading(false)
        setTitle('')
        setDescription('')
        setStatus('')
        setImageFile('No File Chosen')
        setImage(null)
      }
    } catch (error: any) {
      setLoading(false)
      console.error(error)
      setError(error.response.data.message || 'Invalid credentials.')
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
    <div className="bg-white flex flex-col pb-[3rem]">
      <form onSubmit={handleSubmit}>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Project Information</h1>

          {/* Project Title Input */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Title</h1>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Description</h1>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Status</h1>
            <input
              type="text"
              placeholder="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          {/* First Drag-and-Drop Input - Service Image 1 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-8 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Image1</h1>
            <div className="custom-file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                id="image"
                onChange={handleFileChange}
                className="hidden"
                title="image"
                required
              />
              <label
                htmlFor="image"
                className="custom-file-label border border-gray-200 bg-[#F9F9F6] lg:w-[539px] h-[40px] focus:outline-none rounded-[5px] text-[#4A5568] flex items-center cursor-pointer"
              >
                <span className="file-label-text bg-gray-200 h-[40px] px-3 text-black flex items-center">
                  Choose File
                </span>
                <span className="file-name text-sm text-gray-500 ml-4">
                  {imageFile}
                </span>
              </label>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#fab702] flex items-center justify-center h-[40px] w-[140px] text-white rounded-[5px] mb-10 text-[14px] font-semibold xl:ml-[27rem] mx-auto hover:text-black hover:opacity-75 active:opacity-55 transition-all duration-500 ease-in-out"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {error && (
          <p className="text-red-600 text-center xl:text-left xl:ml-[27rem] mt-[-2rem]">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 mt-[-2rem] xl:ml-[27rem] text-center lg:text-left">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}

export default AddProject
