'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const AddService = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [min_price, setMin_price] = useState('')
  const [max_price, setMax_price] = useState('')
  const [fileName1, setFileName1] = useState('No file chosen')
  const [fileName2, setFileName2] = useState('No file chosen')
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName1(file.name)
      setImage1(file)
    } else {
      setFileName1('No file chosen')
      setImage1(null)
    }
  }

  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName2(file.name)
      setImage2(file)
    } else {
      setFileName2('No file chosen')
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
    formData.append('min_price', min_price)
    formData.append('max_price', max_price)
    if (image1) formData.append('image1', image1)
    if (image2) formData.append('image2', image2)

    try {
      const token = Cookies.get('adminToken')

      if (!token) return

      const response = await axios.post(
        'https://api.princem-fc.com/api/services',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200 || response.status === 201) {
        setSuccess('Service added successfully')
        setLoading(false)
        setTitle('')
        setDescription('')
        setPrice('')
        setMin_price('')
        setMax_price('')
        setFileName1('No File Chosen')
        setFileName2('No File Chosen')
        setImage1(null)
        setImage2(null)
      }
    } catch (error: any) {
      setLoading(false)
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
    <div className="bg-white min-h-screen w-full flex flex-col pb-[3rem]">
      <form onSubmit={handleSubmit}>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Service Information</h1>

          {/* Service Title Input */}
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
              title="text"
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Price</h1>
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Minimum price</h1>
            <input
              type="number"
              placeholder="Minimum price"
              value={min_price}
              onChange={(e) => setMin_price(e.target.value)}
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Maximum Price</h1>
            <input
              type="number"
              placeholder="Maximum price"
              value={max_price}
              onChange={(e) => setMax_price(e.target.value)}
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
                id="image1"
                onChange={handleFileChange1}
                className="hidden"
                title="image"
                required
              />
              <label
                htmlFor="image1"
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

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-8 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Image2</h1>
            <div className="custom-file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                id="image2"
                onChange={handleFileChange2}
                className="hidden"
                title="image"
                required
              />
              <label
                htmlFor="image2"
                className="custom-file-label border border-gray-200 bg-[#F9F9F6] lg:w-[539px] h-[40px] focus:outline-none rounded-[5px] text-[#4A5568] flex items-center cursor-pointer"
              >
                <span className="file-label-text bg-gray-200 h-[40px] px-3 text-black flex items-center">
                  Choose File
                </span>
                <span className="file-name text-sm text-gray-500 ml-4">
                  {fileName2}
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
          <p className="text-red-600 text-center xl:text-left xl:ml-[27rem] mt-[-2.5rem]">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 mt-[-2.5rem] xl:ml-[27rem] text-center lg:text-left">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}

export default AddService
