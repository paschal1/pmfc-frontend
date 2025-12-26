import { IoBedOutline } from 'react-icons/io5'
import { BiCabinet } from 'react-icons/bi'
import { RiArmchairLine } from 'react-icons/ri'
import { PiDeskBold } from 'react-icons/pi'
import { RiSofaFill } from 'react-icons/ri'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'
import { useState } from 'react'

type Item = {
  Icon: React.ElementType // Correct TypeScript type for a component
  label: string
}
const DashboardCategory = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleClick = (index: number) => {
    setActiveIndex(index)
  }

  const items: Item[] = [
    { Icon: IoBedOutline, label: 'Bed' },
    { Icon: BiCabinet, label: 'Cabinet' },
    { Icon: RiArmchairLine, label: 'Chair' },
    { Icon: PiDeskBold, label: 'Desk' },
    { Icon: RiSofaFill, label: 'Sofa' },
    { Icon: MdOutlineMiscellaneousServices, label: 'Misc' },
  ]

  return (
    <div
      data-testid="dashboard-category"
     className="bg-[#F2F2F2] w-full max-w-6xl mt-8 mx-auto rounded-xl pb-4 px-4 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out"
    >
      <h1 className="mt-6 text-lg text-[#4A5568] font-semibold lg:ml-[5%] sm:ml-[10%] ml-[3%]">
        Category
      </h1>
      <div className="grid lg:grid-cols-6 grid-cols-3 gap-4 mt-4 lg:ml-6 mx-auto">
        {items.map(({ Icon, label }, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              onClick={() => handleClick(index)}
              className="bg-gray-200 h-[105px] rounded-xl lg:w-[105px] w-[93px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#fab702] group"
            >
              <Icon className="h-[50px] w-[50px] opacity-50 group-hover:text-black group-hover:opacity-100" />
            </div>
            <h1
              className={`mt-1 ${
                activeIndex === index ? 'text-[#333333]' : 'text-[#333333]'
              }`}
            >
              {label}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardCategory
