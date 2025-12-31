'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Image from 'next/image'

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

const ServiceId = () => {
  const { id } = useParams()
  const [service, setService] = useState<ServiceType | null>(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) return

        const res = await axios.get(`https://api.princem-fc.com/api/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setService(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchService()
  }, [id])

  if (loading) {
    return <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center text-lg">Loading...</div>
  }

  if (!service) {
    return <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center text-red-600">Service not found</div>
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Service Details #{service.id}
            </h1>
            
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getTypeBadgeColor(service.type)}`}>
                {service.type}
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-6">Information</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="font-medium text-gray-600">Title</dt>
                    <dd className="mt-1 text-gray-900 text-lg">{service.title}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Type</dt>
                    <dd className="mt-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTypeBadgeColor(service.type)}`}>
                        {service.type}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Description</dt>
                    <dd className="mt-1 text-gray-900 whitespace-pre-wrap">{service.description}</dd>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <dt className="font-medium text-gray-600 mb-3">Pricing</dt>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Base Price:</span>
                        <span className="font-semibold text-gray-900">₦{service.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Price Range:</span>
                        <span className="font-semibold text-gray-900">₦{service.min_price} - ₦{service.max_price}</span>
                      </div>
                    </div>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-6">Images</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Image 1</p>
                    <Image
                      src={service.image1}
                      alt="Service Image 1"
                      width={600}
                      height={400}
                      className="rounded-lg object-cover w-full border shadow"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Image 2</p>
                    <Image
                      src={service.image2}
                      alt="Service Image 2"
                      width={600}
                      height={400}
                      className="rounded-lg object-cover w-full border shadow"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceId