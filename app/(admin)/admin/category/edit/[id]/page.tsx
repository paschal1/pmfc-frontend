'use client'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { METHODS } from 'http'

const EditCategory = () => {
  const { id } = useParams()
  const router = useRouter()

  const [fileName, setFileName] = useState('No file chosen')
  const [thumbnailFilename, setThumbnailFilename] = useState('No file chosen')
  const [categoryName, setCategoryName] = useState('')
  const [slugName, setSlugName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = Cookies.get('adminToken')
        if (!token) return

        const response = await axios.get(
          `https://api.princem-fc.com/api/categories/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const categoryData = response.data
        setCategoryName(categoryData.name)
        setSlugName(categoryData.slug)
        setFileName(categoryData.image || 'No file chosen')
        setThumbnailFilename(categoryData.thumbnail || 'No file chosen')
      } catch (error) {
        console.error('Error fetching Category:', error)
      }
    }

    fetchCategory()
  }, [id])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setImageFile(file)
    } else {
      setFileName('No file chosen')
      setImageFile(null)
    }
  }

  const handleThumbnailFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setThumbnailFilename(file.name)
      setThumbnailFile(file)
    } else {
      setThumbnailFilename('No file chosen')
      setThumbnailFile(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('name', categoryName)
    formData.append('slug', slugName)
    if (imageFile) formData.append('image', imageFile)
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
    formData.append('_method', 'PUT')


    try {
      const token = Cookies.get('adminToken')
      if (!token) return

      const response = await axios.post(
        `https://api.princem-fc.com/api/categories/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        setSuccess('Category updated successfully!')
        router.push('/admin/category')
      } else {
        setError('Failed to update category.')
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
    <div className="bg-white min-h-screen w-full flex flex-col pb-[3rem]">
      <form onSubmit={handleSubmit}>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Category Information</h1>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Category Name</h1>
            <input
              type="text"
              value={categoryName}
              name="name"
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category Name"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Category Slug</h1>
            <input
              type="text"
              value={slugName}
              name="slug"
              onChange={(e) => setSlugName(e.target.value)}
              placeholder="Slug"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
        </div>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Category Images</h1>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Images</h1>
            <div className="custom-file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                id="category-image"
                name="categoryImage"
                onChange={handleFileChange}
                className="hidden"
                // required
              />
              <label
                htmlFor="category-image"
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

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Thumbnail Image</h1>
            <div className="custom-file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                id="thumbnail-image"
                name="thumbnailImage"
                onChange={handleThumbnailFileChange}
                className="hidden"
                // required
              />
              <label
                htmlFor="thumbnail-image"
                className="custom-file-label border border-gray-200 bg-[#F9F9F6] lg:w-[539px] h-[40px] focus:outline-none rounded-[5px] text-[#4A5568] flex items-center cursor-pointer"
              >
                <span className="file-label-text bg-gray-200 h-[40px] px-3 text-black flex items-center">
                  Choose File
                </span>
                <span className="file-name text-sm text-gray-500 ml-4">
                  {thumbnailFilename}
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
          <p className="text-green-600 text-center xl:text-left xl:ml-[27rem] mx-auto">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}

export default EditCategory
