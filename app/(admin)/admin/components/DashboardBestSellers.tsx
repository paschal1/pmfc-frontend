// app/dashboard/components/DashboardBestSellers.tsx

import { BiSolidDownArrow } from 'react-icons/bi'

interface BestSellingProduct {
  id: number
  image: string
  name: string
  price: number
  orders: number
  stock: number
  amount: number
  date: string
  category: string | null
}

interface DashboardBestSellersProps {
  products: BestSellingProduct[]
}

const DashboardBestSellers = ({ products }: DashboardBestSellersProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div
      data-testid="dashboard-best-sellers"
      className="bg-[#F2F2F2] w-full max-w-6xl mt-8 mx-auto rounded-xl flex flex-col px-4 sm:px-7 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out"
    >
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-lg font-semibold text-[#4A5568]">
          Best Selling Product
        </h1>
        <div className="lg:flex hidden items-center gap-2">
          <h1 className="font-semibold">Sort By:</h1>
          <h1 className="text-[#4A5568]">Top Selling</h1>
          <BiSolidDownArrow className="h-[9px] w-[9px] text-[#4A5568] cursor-pointer" />
        </div>
      </div>
      <div className="w-full h-[1px] mt-3 bg-gray-300 mb-8"></div>
      
      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No best selling products available
        </div>
      ) : (
        <div className="overflow-x-auto relative pb-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="px-4 py-2 text-sm font-semibold">Image</th>
                <th className="px-4 py-2 text-sm font-semibold">Name</th>
                <th className="px-4 py-2 text-sm font-semibold">Category</th>
                <th className="px-4 py-2 text-sm font-semibold">Price</th>
                <th className="px-4 py-2 text-sm font-semibold">Orders</th>
                <th className="px-4 py-2 text-sm font-semibold">Stock</th>
                <th className="px-4 py-2 text-sm font-semibold">Amount</th>
                <th className="px-4 py-2 text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-[80px] h-[80px] bg-gray-200 flex items-center justify-center rounded-xl overflow-hidden">
                      <img
                        src={item.image || '/placeholder-product.png'}
                        alt={item.name}
                        className="h-[60px] w-[60px] object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.png'
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <h1 className="text-base font-medium text-[#333333]">{item.name}</h1>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#4A5568] bg-gray-100 px-2 py-1 rounded">
                      {item.category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#4A5568]">
                    N{item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-[#4A5568] font-medium">
                    {item.orders}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`${item.stock < 10 ? 'text-red-600 font-semibold' : 'text-[#4A5568]'}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#4A5568] font-semibold">
                    N{item.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-[#4A5568] whitespace-nowrap text-sm">
                    {formatDate(item.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DashboardBestSellers