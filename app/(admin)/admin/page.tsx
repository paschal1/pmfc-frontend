'use client'
import { GoDatabase } from 'react-icons/go'
import { RiShoppingBag3Line } from 'react-icons/ri'
import { RiChat3Line } from 'react-icons/ri'
import { RiUserAddLine } from 'react-icons/ri'
import DashboardCategory from './components/DashboardCategory'
import DashboardBestSellers from './components/DashboardBestSellers'
import DashboardRecentOrder from './components/DashboardRecentOrder'


const Dashboard = () => {
  
  return (
    <div className="bg-white flex flex-col pb-[5rem]">
      <div
        className="grid grid-cols-1 lg:grid-cols-2 mt-8 xl:ml-[20rem] lg:gap-4 gap-4"
        data-testid="dashboard-container"
      >
        <div className="lg:w-[501px] w-[90%] h-[140px] bg-[#F2F2F2] rounded-xl mx-auto flex items-center justify-between px-7">
          <div className="flex flex-row items-center">
            <div className="w-[4px] h-[95px] bg-black"></div>
            <div className="flex flex-col ml-4 ">
              <h1 className="text-[#9A9A9A]">Total Revenue</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">$6654</h1>
            </div>
          </div>
          <div className="bg-gray-400 h-[40px] w-[40px] flex items-center justify-center rounded-[7px]">
            <GoDatabase
              className="h-[30px] w-[30px]"
              data-testid="icon-revenue"
            />
          </div>
        </div>
        <div className="lg:w-[501px] w-[90%] h-[140px] bg-[#F2F2F2] rounded-xl mx-auto flex items-center justify-between px-7">
          <div className="flex flex-row items-center">
            <div className="w-[4px] h-[95px] bg-[#747DC6]"></div>
            <div className="flex flex-col ml-4 ">
              <h1 className="text-[#9A9A9A]">Total Orders</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">8573</h1>
            </div>
          </div>
          <div className="bg-[#747DC60D] h-[40px] w-[40px] flex items-center justify-center rounded-[7px]">
            <RiShoppingBag3Line
              className="h-[30px] w-[30px] text-[#747DC6]"
              data-testid="icon-orders"
            />
          </div>
        </div>
        <div className="lg:w-[501px] w-[90%] h-[140px] bg-[#F2F2F2] rounded-xl mx-auto flex items-center justify-between px-7">
          <div className="flex flex-row items-center">
            <div className="w-[4px] h-[95px] bg-[#EF3F3E]"></div>
            <div className="flex flex-col ml-4 ">
              <h1 className="text-[#9A9A9A]">Total Products</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">893</h1>
            </div>
          </div>
          <div className="bg-[#EF3F3E1A] h-[40px] w-[40px] flex items-center justify-center rounded-[7px]">
            <RiChat3Line
              className="h-[30px] w-[30px] text-[#EF3F3E]"
              data-testid="icon-products"
            />
          </div>
        </div>
        <div className="lg:w-[501px] w-[90%] h-[140px] bg-[#F2F2F2] rounded-xl mx-auto flex items-center justify-between px-7">
          <div className="flex flex-row items-center">
            <div className="w-[4px] h-[95px] bg-[#9E65C2]"></div>
            <div className="flex flex-col ml-4 ">
              <h1 className="text-[#9A9A9A]">Total Customers</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">4.6K</h1>
            </div>
          </div>
          <div className="bg-[#9E65C21A] h-[40px] w-[40px] flex items-center justify-center rounded-[7px]">
            <RiUserAddLine
              className="h-[30px] w-[30px] text-[#9E65C2]"
              data-testid="icon-customers"
            />
          </div>
        </div>
      </div>
      <DashboardCategory data-testid="dashboard-category" />
      <DashboardBestSellers data-testid="dashboard-best-sellers" />
      <DashboardRecentOrder data-testid="dashboard-recent-order" />
    </div>
  )
}

export default Dashboard
