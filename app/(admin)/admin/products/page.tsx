'use client'
import Link from 'next/link'
import { Product, ProductData } from '../../../(main)/data/product'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

type ProductType = {
  id: number
  name: string
  description: string
  price: string
  stock: number
  category_id: number
  image: string
}

const Products = () => {
  const router = useRouter()
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get('adminToken') 

        if (!token) {
          console.error('No token found')
          return
        }

        const response = await axios.get(
          'https://api.princem-fc.com/api/products',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const productData = response.data.data
        setProducts(productData)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get('adminToken')
      if (!token) {
        console.error('No token found')
        return
      }

      await axios.delete(`https://api.princem-fc.com/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProducts((prev) => prev.filter((cat) => cat.id !== id))
    } catch (error: any) {
      console.error('Error deleting product:', error)
    }
  }

  return (
    <div className="bg-white min-h-screen w-full flex flex-col pb-[3rem]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8">
        <div className="flex items-center justify-between mt-4">
          <h1 className="font-semibold sm:text-xl text-lg">Product List</h1>
          <button
            onClick={() => router.push('/admin/add-new-products')}
            className="px-7 py-2 bg-[#fab702] rounded-[5px] text-white text-[13px] font-semibold hover:text-black hover:opacity-75 active:opacity-60 transition-all duration-500 ease-in-out"
          >
            Add Product
          </button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div></div>
          <div>
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
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Product Image
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Product Name
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Description
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Current Qty
                </th>
                <th className="lg:px-16 px-8 py-2">Price</th>
                <th className="lg:px-16 px-8 py-2">Option</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="even:bg-white odd:bg-[#F2F2F2]">
                  <td className="lg:px-16 px-8 py-3">
                    <div className="w-[80px] h-[80px] flex items-center justify-center rounded-xl">
                      <img
                        src={item.image}
                        alt="img"
                        className="h-[60px] w-[60px] object-contain"
                      />
                    </div>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.name}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3 text-[#4A5568]">
                    {item.description}
                  </td>
                  <td className="lg:px-16 px-8 py-3 text-[#4A5568]">
                    {item.stock}
                  </td>
                  <td className="lg:px-16 px-8 py-3 text-[#4A5568]">
                    ₦{item.price}
                  </td>
                  <td className="lg:px-16 px-8 py-3 flex mt-9 gap-3">
                    <Link href={`/admin/products/${item.id}`}>
                      <MdOutlineRemoveRedEye className="h-[20px] w-[20px] text-purple-400" />
                    </Link>
                    <Link href={`/admin/products/edit/${item.id}`}>
                      <MdOutlineEdit className="h-[20px] w-[20px] text-blue-400" />
                    </Link>
                    <RiDeleteBin5Line
                      onClick={() => handleDelete(item.id)}
                      className="h-[20px] w-[20px] text-red-400 cursor-pointer hover:text-red-300"
                    />
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

export default Products
