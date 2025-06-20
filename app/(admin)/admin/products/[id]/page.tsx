'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

type ProductType = {
  id: number
  name: string
  description: string
  price: string
  stock: number
  category_id: number
  image: string
}

const ProductId = () => {
  const { id: productId } = useParams()
  const [product, setProduct] = useState<ProductType | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = Cookies.get('adminToken')

        if (!token) {
          console.error('No token found')
          return
        }

        const response = await axios.get(
          `https://api.princem-fc.com/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const productData = response.data
        setProduct(productData)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    if (productId) fetchProduct()
  }, [productId])
  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {product ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Product #{product.id}
              </h1>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Name</td>
                    <td className="p-2">{product.name}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Description
                    </td>
                    <td className="p-2">{product.description}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Price</td>
                    <td className="p-2">{product.price}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Stock</td>
                    <td className="p-2">{product.stock}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Image </td>
                    <td className="p-2">
                      <img
                        src={product.image}
                        alt="Product Image"
                        className="w-[250px] h-32 object-cover rounded-md"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <h1 className="text-gray-600 text-lg text-center mt-8">
            Product not found.
          </h1>
        )}
      </div>
    </div>
  )
}

export default ProductId
