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
  type: string
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
  const [filterType, setFilterType] = useState('')

  const serviceTypes = [
    'Residential Design',
    'Hospitality Design',
    'Office Design',
    'Commercial Design'
  ]

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
        setServices(response.data.data || response.data)
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
    (service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = filterType ? service.type === filterType : true
      
      return matchesSearch && matchesType
    }
  )

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case 'Residential Design':
        return 'bg-blue-100 text-blue-800'
      case 'Hospitality Design':
        return 'bg-purple-100 text-purple-800'
      case 'Office Design':
        return 'bg-green-100 text-green-800'
      case 'Commercial Design':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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

        {/* Filter by Type */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterType === ''
                ? 'bg-[#fab702] text-black'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Types
          </button>
          {serviceTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === type
                  ? 'bg-[#fab702] text-black'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                  <th className="px-4 py-3 text-center font-semibold">Image 1</th>
                  <th className="px-4 py-3 text-center font-semibold">Image 2</th>
                  <th className="px-4 py-3 text-center font-semibold">Price Range</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      Loading services...
                    </td>
                  </tr>
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      {searchTerm || filterType ? 'No matching services found' : 'No services available'}
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 max-w-xs">
                        <p className="font-medium truncate">{item.title}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeColor(item.type)}`}>
                          {item.type}
                        </span>
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
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm">
                          <div className="font-medium">₦{item.min_price} - ₦{item.max_price}</div>
                        </div>
                      </td>
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