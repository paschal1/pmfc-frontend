import { BiSolidDownArrow } from 'react-icons/bi'
import { bestSellingData, BestSellingItem } from '../utils/bestSelling'

const DashboardBestSellers = () => {
  return (
    <div
      data-testid="dashboard-best-sellers"
      className="bg-[#F2F2F2] w-[90%] lg:w-[1014px] mt-8 xl:ml-[20.5rem] mx-auto rounded-xl flex flex-col px-7 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out"
    >
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-lg font-semibold text-[#4A5568]">
          Best Selling Product
        </h1>
        <div className="lg:flex hidden items-center gap-2">
          <h1 className="font-semibold">Sort By:</h1>
          <h1 className="text-[#4A5568]">Today</h1>
          <BiSolidDownArrow className="h-[9px] w-[9px] text-[#4A5568] cursor-pointer" />
        </div>
      </div>
      <div className="w-full h-[1px] mt-3 bg-gray-300 mb-8"></div>
      <div className="overflow-x-auto relative">
        <table className="min-w-full border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Orders</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {bestSellingData.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0">
                {/* Image */}
                <td className="px-4 py-3">
                  <div className="w-[80px] h-[80px] bg-gray-200 flex items-center justify-center rounded-xl">
                    <img
                      src={item.image}
                      alt="img"
                      className="h-[60px] w-[60px] object-contain"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <h1 className="text-lg font-medium">{item.name}</h1>
                </td>
                <td className="px-4 py-3 text-[#4A5568]">${item.price}</td>
                <td className="px-4 py-3 text-[#4A5568]">{item.orders}</td>
                <td className="px-4 py-3 text-[#4A5568]">{item.stock}</td>
                <td className="px-4 py-3 text-[#4A5568]">${item.amount}</td>
                <td className="px-4 py-3 text-[#4A5568] whitespace-nowrap">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardBestSellers
