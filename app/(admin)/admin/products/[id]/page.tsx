'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Image from 'next/image'
import { MdOutlineEdit } from 'react-icons/md'

type ProductType = {
  id: number
  name: string
  description: string
  price: string | number
  stock: number
  category_id: number
  image: string
}

const ProductId = () => {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      try {
        const token = Cookies.get('userToken')
        if (!token) {
          console.error('No authentication token')
          setLoading(false)
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // API returns the product directly or wrapped in .data
        const data = response.data.data || response.data

        if (!data) {
          console.error('No product data found:', response.data)
          setProduct(null)
        } else {
          setProduct(data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleEdit = () => {
    router.push(`/admin/products/edit/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-lg text-gray-600">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-xl text-red-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header with Title and Edit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Product #{product.id} - {product.name}
            </h1>

            <button
              onClick={handleEdit}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
            >
              <MdOutlineEdit className="h-5 w-5" />
              Edit Product
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Details */}
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Product Name</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{product.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Description</p>
                <p className="mt-2 text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {product.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Price</p>
                  <p className="mt-2 text-3xl font-bold text-[#fab702]">
                    ₦{Number(product.price).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Stock</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{product.stock}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4">Product Image</p>
                <div className="w-full max-w-2xl bg-gray-100 rounded-xl overflow-hidden border shadow-md">
                  <Image
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductId