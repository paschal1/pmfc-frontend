// app/dashboard/components/DashboardCategory.tsx

import { useState } from 'react'
import { IoBedOutline } from 'react-icons/io5'
import { BiCabinet } from 'react-icons/bi'
import { RiArmchairLine } from 'react-icons/ri'
import { PiDeskBold } from 'react-icons/pi'
import { RiSofaFill } from 'react-icons/ri'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'

interface Category {
  id: number
  name: string
  image: string
}

interface DashboardCategoryProps {
  categories: Category[]
  totalCategories: number
}

type IconMap = {
  [key: string]: React.ElementType
}

const DashboardCategory = ({ categories, totalCategories }: DashboardCategoryProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleClick = (index: number) => {
    setActiveIndex(index)
  }

  // Map category names to icons (fallback to default icons if not matched)
  const iconMap: IconMap = {
    bed: IoBedOutline,
    cabinet: BiCabinet,
    chair: RiArmchairLine,
    desk: PiDeskBold,
    sofa: RiSofaFill,
    misc: MdOutlineMiscellaneousServices,
    miscellaneous: MdOutlineMiscellaneousServices,
  }

  const getIconForCategory = (categoryName: string): React.ElementType => {
    const normalizedName = categoryName.toLowerCase()
    return iconMap[normalizedName] || MdOutlineMiscellaneousServices
  }

  return (
    <div
      data-testid="dashboard-category"
      className="bg-[#F2F2F2] w-full max-w-6xl mt-8 mx-auto rounded-xl pb-4 px-4 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out"
    >
      <div className="flex items-center justify-between mt-6 lg:ml-[5%] sm:ml-[10%] ml-[3%] mr-[3%]">
        <h1 className="text-lg text-[#4A5568] font-semibold">Category</h1>
        <span className="text-sm text-[#9A9A9A]">Total: {totalCategories}</span>
      </div>
      
      <div className="grid lg:grid-cols-6 grid-cols-3 gap-4 mt-4 lg:ml-6 mx-auto">
        {categories.map((category, index) => {
          const Icon = getIconForCategory(category.name)
          
          return (
            <div key={category.id} className="flex flex-col items-center">
              <div
                onClick={() => handleClick(index)}
                className="bg-gray-200 h-[105px] rounded-xl lg:w-[105px] w-[93px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#fab702] group overflow-hidden"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-[70px] w-[70px] object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement?.appendChild(
                        Object.assign(document.createElement('div'), {
                          innerHTML: `<svg class="h-[50px] w-[50px] opacity-50"></svg>`
                        })
                      )
                    }}
                  />
                ) : (
                  <Icon className="h-[50px] w-[50px] opacity-50 group-hover:text-black group-hover:opacity-100" />
                )}
              </div>
              <h1
                className={`mt-1 text-sm ${
                  activeIndex === index ? 'text-[#333333] font-semibold' : 'text-[#333333]'
                }`}
              >
                {category.name}
              </h1>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DashboardCategory