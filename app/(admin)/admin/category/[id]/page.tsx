'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

type CategoryType = {
  id: number
  name: string
  image: string
  thumbnailimage: string
}

const CategoryId = () => {
  const { id: categoryId } = useParams()
  const [category, setCategory] = useState<CategoryType | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = Cookies.get('adminToken')

        if (!token) {
          console.error('No token found')
          return
        }

        const response = await axios.get(
          `https://api.princem-fc.com/api/categories/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const categoryData = response.data
        setCategory(categoryData)
        console.log('Fetched category:', categoryData)
      } catch (error) {
        console.error('Error fetching Category', error)
      }
    }

    if (categoryId) fetchCategory()
  }, [categoryId])
  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {category ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Category #{category.id}
              </h1>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Name</td>
                    <td className="p-2">{category.name}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Image </td>
                    <td className="p-2">
                      <img
                        src={category.image}
                        alt="Product Image"
                        className="w-[250px] h-32 object-cover rounded-md"
                      />
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Image </td>
                    <td className="p-2">
                      <img
                        src={category.thumbnailimage}
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
            Category not found.
          </h1>
        )}
      </div>
    </div>
  )
}

export default CategoryId
