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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
              Service Details #{service.id}
            </h1>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Information</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="font-medium text-gray-600">Title</dt>
                    <dd className="mt-1 text-gray-900">{service.title}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Description</dt>
                    <dd className="mt-1 text-gray-900 whitespace-pre-wrap">{service.description}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Price</dt>
                    <dd className="mt-1 text-gray-900">₦{service.price}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Price Range</dt>
                    <dd className="mt-1 text-gray-900">₦{service.min_price} - ₦{service.max_price}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Images</h2>
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