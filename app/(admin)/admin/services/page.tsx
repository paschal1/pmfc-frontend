'use client'
import Link from 'next/link'
import { service } from '../utils/services'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { MdOutlineEdit } from 'react-icons/md'
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
}

const Services = () => {
  const [service, setService] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get('adminToken')
      if (!token) {
        console.error('No token found')
        return
      }

      await axios.delete(`https://api.princem-fc.com/api/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Remove deleted category from UI
      setService((prev) => prev.filter((cat) => cat.id !== id))
    } catch (error) {}
  }

  useEffect(() => {
      const fetchService = async () => {
        try {
          const token = Cookies.get('adminToken')
  
          if (!token) {
            console.error('No token found')
            return
          }
  
          const response = await axios.get(
            'https://api.princem-fc.com/api/services',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          const serviceData = response.data
          setService(serviceData)
          console.log('Fetched service:', serviceData)
          // console.log(products)
        } catch (error) {
          console.error('Error fetching category:', error)
        }
      }
  
      fetchService()
    }, [])

  return (
    <div className="bg-white min-h-screen w-full flex flex-col pb-[3rem]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
          <h1 className="font-semibold sm:text-xl text-lg">Services </h1>
          <div className="mt-4">
            <label className="mr-3">Search</label>
            <input
              type="text"
              placeholder=""
              title="search"
              className="border bg-inherit border-black focus:outline-none pl-2 h-[35px] w-[150px] rounded-[4px]"
            />
          </div>
        </div>
        <div className="mt-8 overflow-x-auto relative">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-200 rounded-[6px] text-[#4A5568]">
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Title</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Description
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Image</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Image</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Price</th>
                <th className="lg:px-16 px-8 py-2">Option</th>
              </tr>
            </thead>
            <tbody>
              {service.map((item) => (
                <tr key={item.id} className="even:bg-white odd:bg-[#F2F2F2]">
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] whitespace-nowrap">
                      {item.title}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] min-w-[300px]">
                      {item.description}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <div className="w-[150px] h-[100px] flex items-center justify-center rounded-xl">
                      <img
                        src={item.image1}
                        alt="img"
                        className="h-[80px] w-[180px] object-cover"
                      />
                    </div>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <div className="w-[150px] h-[100px] flex items-center justify-center rounded-xl">
                      <img
                        src={item.image2}
                        alt="img"
                        className="h-[80px] w-[180px] object-cover"
                      />
                    </div>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] whitespace-nowrap">
                      ₦{item.price}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3 flex mt-9 gap-3">
                    <Link href={`/admin/services/${item.id}`}>
                      <MdOutlineRemoveRedEye className="h-[20px] w-[20px] text-purple-400" />
                    </Link>
                    <Link href={`/admin/services/edit/${item.id}`}>
                      <MdOutlineEdit className="h-[20px] w-[20px] text-blue-400" />
                    </Link>
                    <RiDeleteBin5Line onClick={() => handleDelete(item.id)} className="h-[20px] w-[20px] text-red-400 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Services
