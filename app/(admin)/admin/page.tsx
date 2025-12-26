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
    <div className="bg-white pb-[5rem]">
      {/* Stat Cards Grid - Responsive & Centered */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8 px-4 max-w-7xl mx-auto">
        {/* Card 1: Total Revenue */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-black rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Revenue</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">$6,654</h1>
            </div>
          </div>
          <div className="bg-gray-400 h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <GoDatabase className="h-[30px] w-[30px]" data-testid="icon-revenue" />
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-[#747DC6] rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Orders</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">8,573</h1>
            </div>
          </div>
          <div className="bg-[#747DC60D] h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <RiShoppingBag3Line className="h-[30px] w-[30px] text-[#747DC6]" data-testid="icon-orders" />
          </div>
        </div>

        {/* Card 3: Total Products */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-[#EF3F3E] rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Products</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">893</h1>
            </div>
          </div>
          <div className="bg-[#EF3F3E1A] h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <RiChat3Line className="h-[30px] w-[30px] text-[#EF3F3E]" data-testid="icon-products" />
          </div>
        </div>

        {/* Card 4: Total Customers */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-[#9E65C2] rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Customers</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">4.6K</h1>
            </div>
          </div>
          <div className="bg-[#9E65C21A] h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <RiUserAddLine className="h-[30px] w-[30px] text-[#9E65C2]" data-testid="icon-customers" />
          </div>
        </div>
      </div>

      {/* Lower Components - Now Responsive & No Cutoff */}
      <div className="mt-8">
        <DashboardCategory data-testid="dashboard-category" />
        <DashboardBestSellers data-testid="dashboard-best-sellers" />
        <DashboardRecentOrder data-testid="dashboard-recent-order" />
      </div>
    </div>
  )
}

export default Dashboard