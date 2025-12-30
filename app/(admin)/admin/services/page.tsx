'use client'

import Link from 'next/link'
import { MdOutlineRemoveRedEye, MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

type ServiceType = {
  id: number
  title: string
  description: string
  image1: string
  image2: string
  price: string
  min_price: string
  max_price: string
}

const Services = () => {
  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) {
          console.error('No token found')
          setLoading(false)
          return
        }

        const response = await axios.get('https://api.princem-fc.com/api/services', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setServices(response.data.data || response.data) // adjust based on API structure
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const token = Cookies.get('userToken')
      if (!token) return

      await axios.delete(`https://api.princem-fc.com/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setServices((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
  }

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F2F2F2] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Services
          </h1>

          <div className="flex items-center gap-3">
            <label htmlFor="search-service" className="text-gray-700 font-medium">
              Search:
            </label>
            <input
              id="search-service"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Title or description..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                  <th className="px-4 py-3 text-center font-semibold">Image 1</th>
                  <th className="px-4 py-3 text-center font-semibold">Image 2</th>
                  <th className="px-4 py-3 text-center font-semibold">Price</th>
                  <th className="px-4 py-3 text-center font-semibold">Min Price</th>
                  <th className="px-4 py-3 text-center font-semibold">Max Price</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500">
                      Loading services...
                    </td>
                  </tr>
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500">
                      {searchTerm ? 'No matching services found' : 'No services available'}
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 max-w-xs">
                        <p className="font-medium truncate">{item.title}</p>
                      </td>
                      <td className="px-4 py-4 max-w-md">
                        <p className="text-gray-600 truncate">{item.description}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <img
                            src={item.image1 || '/placeholder.jpg'}
                            alt="Service 1"
                            className="w-32 h-20 object-cover rounded-lg border"
                            onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <img
                            src={item.image2 || '/placeholder.jpg'}
                            alt="Service 2"
                            className="w-32 h-20 object-cover rounded-lg border"
                            onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">₦{item.price}</td>
                      <td className="px-4 py-4 text-center">₦{item.min_price}</td>
                      <td className="px-4 py-4 text-center">₦{item.max_price}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-4">
                          <Link href={`/admin/services/${item.id}`} className="text-purple-600 hover:text-purple-800">
                            <MdOutlineRemoveRedEye className="h-5 w-5" />
                          </Link>
                          <Link href={`/admin/services/edit/${item.id}`} className="text-blue-600 hover:text-blue-800">
                            <MdOutlineEdit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800"
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
        </div>
      </div>
    </div>
  )
}

export default Services