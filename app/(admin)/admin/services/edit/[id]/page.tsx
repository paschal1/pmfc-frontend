'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { service } from '../../../utils/services'
import Cookies from 'js-cookie'
import axios from 'axios'

const EditServiceId = () => {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [fileName, setFileName] = useState('No file chosen')
  const [fileName1, setFileName1] = useState('No file chosen')
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = Cookies.get('adminToken')
        if (!token) return

        const response = await axios.get(
          `https://api.princem-fc.com/api/services/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const serviceData = response.data
        setTitle(serviceData.title)
        setDescription(serviceData.description)
        setPrice(serviceData.price)
        setFileName(serviceData.image1 || 'No file chosen')
        setFileName1(serviceData.image2 || 'No file chosen')
      } catch (error) {
        console.error('Error fetching Category:', error)
      }
    }

    fetchService()
  }, [id])

  const handleFileChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setImage1(file)
    } else {
      setFileName('No file chosen')
      setImage1(null)
    }
  } 
  
  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName1(file.name)
      setImage2(file)
    } else {
      setFileName1('No file chosen')
      setImage2(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    if (image1) formData.append('image1', image1)      
    if (image2) formData.append('image2', image2)      
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('adminToken')
      if (!token) return

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }
      const response = await axios.post(
        `https://api.princem-fc.com/api/services/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        setSuccess('Services updated successfully!')
        router.push('/admin/services')
      } else {
        setError('Failed to update Services.')
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
    <div className="bg-white min-h-screen flex flex-col pb-[4rem]">
      <form onSubmit={handleSubmit}>
        <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="font-semibold sm:text-xl text-lg">
            Edit Service #{id}
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
              <textarea
                placeholder="Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Price</h1>
              <input
                type="number"
                placeholder="Price..."
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>

            {/* Image 1 Upload */}
            <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Image 1</h1>
              <div className="custom-file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  id="service-image1"
                  name="serviceImage"
                  onChange={handleFileChange1}
                  className="hidden"
                  // required
                  title="image"
                />
                <label
                  htmlFor="service-image1"
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

            {/* Image 2 Upload */}
            <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Image 2</h1>
              <div className="custom-file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  id="service-image2"
                  // name="categoryImage"
                  onChange={handleFileChange2}
                  className="hidden"
                  // required
                />
                <label
                  htmlFor="service-image2"
                  className="custom-file-label border border-gray-200 bg-[#F9F9F6] lg:w-[539px] h-[40px] focus:outline-none rounded-[5px] text-[#4A5568] flex items-center cursor-pointer"
                >
                  <span className="file-label-text bg-gray-200 h-[40px] px-3 text-black flex items-center">
                    Choose File
                  </span>
                  <span className="file-name text-sm text-gray-500 ml-4">
                    {fileName1}
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
          <p className="text-green-600 mt-[-2rem] xl:ml-[27rem] text-center xl:text-left">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}

export default EditServiceId
