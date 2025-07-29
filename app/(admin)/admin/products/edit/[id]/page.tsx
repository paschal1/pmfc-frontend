'use client'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type CategoryType = {
  id: number
  name: string
  image: string
  thumbnailimage: string
}

const EditProduct = () => {
  const { id } = useParams() // get product id from route
  const router = useRouter()

  const [fileName, setFileName] = useState('No file chosen')
  const [thumbnailFilename, setThumbnailFilename] = useState('No file chosen')
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [isCategory, setIsCategory] = useState<CategoryType[]>([])
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProductAndCategory = async () => {
      try {
        const token = Cookies.get('adminToken')
        if (!token) return

        const [productRes, categoryRes] = await Promise.all([
          axios.get(`https://api.princem-fc.com/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://api.princem-fc.com/api/categories', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const product = productRes.data
        setProductName(product.name)
        setCategory(product.category_id.toString())
        setPrice(product.price)
        setStock(product.stock)
        setDescription(product.description)
        setFileName(product.image || 'No file chosen')
        setThumbnailFilename(product.thumbnail || 'No file chosen')
        setIsCategory(categoryRes.data.data)
      } catch (error) {
        return
      }
    }

    fetchProductAndCategory()
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
    formData.append('name', productName)
    formData.append('category_id', category)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('description', description)
    if (imageFile) formData.append('image', imageFile)
    if (thumbnailFile) formData.append('thumbnailImage', thumbnailFile)
    formData.append('_method', 'PUT')

    try {
      const token = Cookies.get('adminToken')
      if (!token) return

      const response = await axios.post(
        `https://api.princem-fc.com/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        setSuccess('Product updated successfully!')
        router.push('/admin/products') // Optional: redirect after success
      } else {
        setError('Failed to update product.')
      }
    } catch (error: any) {
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
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [error, success])
  return (
    <div className="bg-white min-h-screen w-full flex flex-col pb-[3rem]">
      <form onSubmit={handleSubmit}>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Product Information</h1>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Product Name</h1>
            <input
              type="text"
              value={productName}
              name="name"
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Category</h1>
            <select
              className="focus:outline-none border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] rounded-[5px] text-[#4A5568] pl-3"
              name="category_id"
              id="category_id"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              title="category"
            >
              <option value="" disabled>
                Select a category
              </option>
              {isCategory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Price</h1>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Stock</h1>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
        </div>

        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Product Images</h1>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Images</h1>
            <div className="custom-file-input-wrapper overflow-hidden">
              <input
                type="file"
                accept="image/*"
                id="product-image"
                name="productImage"
                onChange={handleFileChange}
                className="hidden"
                // required
              />
              <label
                htmlFor="product-image"
                className="custom-file-label border border-gray-200 bg-[#F9F9F6] lg:w-[539px] h-[40px] focus:outline-none rounded-[5px] text-[#4A5568] flex items-center cursor-pointer"
              >
                <span className="file-label-text bg-gray-200 h-[40px] px-3 text-black flex items-center whitespace-nowrap">
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

        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Description</h1>

          <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">
              Product Description
            </h1>
            <textarea
              placeholder="Description..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
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
          <p className="text-green-600 text-center xl:text-left mt-[-2rem] xl:ml-[27rem] mx-auto">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}

export default EditProduct
