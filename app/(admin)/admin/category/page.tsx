'use client'

import { MdOutlineAddBox, MdOutlineRemoveRedEye, MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Image from 'next/image'

type CategoryType = {
  id: number
  name: string
  image: string
  thumbnailimage?: string
}

const ITEMS_PER_PAGE = 10

const Category = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) {
          console.error('No authentication token')
          setLoading(false)
          return
        }

        const response = await axios.get('https://api.princem-fc.com/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        })

        // API returns { data: [...] }
        const data = response.data.data || response.data || []
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      const token = Cookies.get('userToken')
      if (!token) return

      await axios.delete(`https://api.princem-fc.com/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setCategories((prev) => prev.filter((cat) => cat.id !== id))
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  // Safe search filter
  const filteredCategories = categories.filter((item) => {
    if (!searchTerm) return true
    return (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Pagination
  const totalItems = filteredCategories.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">All Categories</h1>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-3">
            <label htmlFor="search" className="text-gray-700 font-medium">
              Search:
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Category name..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] w-full sm:w-64"
            />
          </div>

          {/* Add New Button */}
          <button
            onClick={() => router.push('/admin/add-new-category')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#fab702] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
          >
            <MdOutlineAddBox className="h-5 w-5" />
            Add New
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Category Name</th>
                <th className="px-6 py-4 text-center font-semibold">Main Image</th>
                <th className="px-6 py-4 text-center font-semibold">Thumbnail</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    Loading categories...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No matching categories found' : 'No categories yet'}
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{item.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center">
                          <Image
                            width={80}
                            height={80}
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            className="object-cover"
                            unoptimized
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.jpg'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center">
                          {item.thumbnailimage ? (
                            <Image
                              width={80}
                              height={80}
                              src={item.thumbnailimage}
                              alt={`${item.name} thumbnail`}
                              className="object-cover"
                              unoptimized
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.jpg'
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">No Thumbnail</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          href={`/admin/category/${item.id}`}
                          className="text-purple-600 hover:text-purple-800"
                          title="View"
                        >
                          <MdOutlineRemoveRedEye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/category/edit/${item.id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <MdOutlineEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <RiDeleteBin5Line className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} categories
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    page === currentPage
                      ? 'bg-[#fab702] text-white'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Category