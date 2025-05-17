'use client'

import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { order } from '../utils/order'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Link from 'next/link'

const Order = () => {
  return (
    <div className="bg-white flex flex-col pb-[3rem]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
          <h1 className="font-semibold sm:text-xl text-lg">Order List</h1>
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
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Image</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Code</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Date</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Payment Method
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Status</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Amount</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Shipping Address
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Shipping State
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Shipping City
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Shipping Zip Code
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Option</th>
              </tr>
            </thead>
            <tbody>
              {order.map((item) => (
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
                    <h1 className="text-md text-[#4A5568]">{item.code}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-sm text-[#4A5568] whitespace-nowrap">
                      {item.date}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.payment_method}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1
                      className={`text-md font-semibold rounded-[6px] h-[30px] w-[85px] flex items-center justify-center ${
                        item.status === 'Delivered'
                          ? 'text-green-600 bg-green-100'
                          : item.status === 'Pending'
                          ? 'text-yellow-500 bg-yellow-100'
                          : 'text-red-600 bg-red-100'
                      }`}
                    >
                      {item.status}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.amount}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.shipping_address}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.shipping_state}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.shipping_city}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.shipping_zip_code}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3 flex mt-9 gap-3">
                    <Link href={`/admin/order/${item.id}`}>
                      <MdOutlineRemoveRedEye
                        className="h-[20px] w-[20px] text-purple-400"
                        data-testid="view-icon"
                      />
                    </Link>
                    <RiDeleteBin5Line
                      className="h-[20px] w-[20px] text-red-400"
                      data-testid="delete-icon"
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

export default Order
