'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Image from 'next/image'
import { MdOutlineEdit } from 'react-icons/md'

type CategoryType = {
  id: number
  name: string
  image: string
  thumbnailimage?: string
}

const CategoryId = () => {
  const { id } = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<CategoryType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return

      try {
        const token = Cookies.get('adminToken')
        if (!token) {
          console.error('No authentication token')
          setLoading(false)
          return
        }

        const response = await axios.get(`https://api.princem-fc.com/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // API returns { data: { ... } }
        const data = response.data.data || response.data

        if (!data) {
          console.error('No category data found:', response.data)
          setCategory(null)
        } else {
          setCategory(data)
        }
      } catch (error) {
        console.error('Error fetching category:', error)
        setCategory(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  const handleEdit = () => {
    router.push(`/admin/category/edit/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-lg text-gray-600">Loading category details...</p>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-xl text-red-600">Category not found</p>
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
              Category #{category.id} - {category.name}
            </h1>

            <button
              onClick={handleEdit}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
            >
              <MdOutlineEdit className="h-5 w-5" />
              Edit Category
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Name & Main Image */}
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Category Name</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{category.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4">Main Image</p>
                <div className="w-full max-w-md bg-gray-100 rounded-xl overflow-hidden border">
                  <Image
                    src={category.image || '/placeholder.jpg'}
                    alt={category.name}
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Thumbnail */}
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-4">Thumbnail Image</p>
                {category.thumbnailimage ? (
                  <div className="w-full max-w-md bg-gray-100 rounded-xl overflow-hidden border">
                    <Image
                      src={category.thumbnailimage}
                      alt={`${category.name} thumbnail`}
                      width={500}
                      height={300}
                      className="w-full h-auto object-cover"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-md h-80 bg-gray-100 rounded-xl border flex items-center justify-center">
                    <p className="text-gray-400 text-lg">No thumbnail image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryId