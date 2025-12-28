// app/dashboard/components/DashboardAnalytics.tsx

import { BiTrendingUp, BiUser, BiTimer, BiDollar } from 'react-icons/bi'
import { RiUserFollowLine, RiUserAddLine, RiShoppingBag3Line } from 'react-icons/ri'
import { AiOutlinePercentage, AiOutlineRise, AiOutlineFall } from 'react-icons/ai'
import { HiOutlineChartBar, HiOutlineUserGroup } from 'react-icons/hi'
import { BsCalendar3 } from 'react-icons/bs'

interface SalesReports {
  total_sales: number
  today_sales: number
  this_month_sales: number
  last_month_sales: number
  monthly_growth: number
  monthly_breakdown: Array<{ month: string; sales: number }>
  top_categories: Array<{ name: string; sales: number }>
}

interface UserActivity {
  total_users: number
  active_users: number
  inactive_users: number
  active_users_today: number
  new_users_today: number
  new_users_this_week: number
  new_users_this_month: number
  users_with_orders: number
  average_orders_per_user: number
  returning_customers: number
  activity_by_day: Array<{ date: string; active_users: number }>
}

interface AnalyticsDataProps {
  data: {
    salesReports: SalesReports | null
    userActivity: UserActivity | null
    websitePerformance: {
      page_load_time: string
      bounce_rate: string
      conversion_rate: string
    }
  } | null
}

const DashboardAnalytics = ({ data }: AnalyticsDataProps) => {
  const { salesReports, userActivity, websitePerformance } = data || {
    salesReports: null,
    userActivity: null,
    websitePerformance: {
      page_load_time: '1.5s',
      bounce_rate: '47%',
      conversion_rate: '3.2%'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="mt-8 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#4A5568] mb-6">Analytics Overview</h2>
      
      {/* Website Performance Section */}
      <div className="bg-[#F2F2F2] rounded-xl p-6 mb-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out">
        <h3 className="text-lg font-semibold text-[#4A5568] mb-4 flex items-center gap-2">
          <BiTrendingUp className="text-xl" />
          Website Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Page Load Time */}
          <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BiTimer className="text-3xl text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[#9A9A9A] uppercase tracking-wide mb-1">Page Load Time</p>
              <p className="text-2xl font-bold text-[#4A5568]">
                {websitePerformance.page_load_time}
              </p>
            </div>
          </div>

          {/* Bounce Rate */}
          <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="bg-orange-100 p-3 rounded-lg">
              <RiUserFollowLine className="text-3xl text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-[#9A9A9A] uppercase tracking-wide mb-1">Bounce Rate</p>
              <p className="text-2xl font-bold text-[#4A5568]">
                {websitePerformance.bounce_rate}
              </p>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="bg-green-100 p-3 rounded-lg">
              <AiOutlinePercentage className="text-3xl text-green-600" />
            </div>
            <div>
              <p className="text-xs text-[#9A9A9A] uppercase tracking-wide mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-[#4A5568]">
                {websitePerformance.conversion_rate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Reports & User Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Reports */}
        <div className="bg-[#F2F2F2] rounded-xl p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out">
          <h3 className="text-lg font-semibold text-[#4A5568] mb-4 flex items-center gap-2">
            <HiOutlineChartBar className="text-xl" />
            Sales Reports
          </h3>
          {salesReports ? (
            <div className="bg-white rounded-lg p-6">
              <div className="space-y-4">
                {/* Total Sales */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div>
                    <p className="text-sm text-[#9A9A9A] font-medium">Total Sales</p>
                    <p className="text-3xl font-bold text-green-700">{formatCurrency(salesReports.total_sales)}</p>
                  </div>
                  <div className="bg-green-600 p-3 rounded-lg">
                    <BiDollar className="text-3xl text-white" />
                  </div>
                </div>

                {/* This Month */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-[#9A9A9A]">This Month</p>
                    <p className="text-2xl font-bold text-[#4A5568]">{formatCurrency(salesReports.this_month_sales)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {salesReports.monthly_growth >= 0 ? (
                      <>
                        <AiOutlineRise className="text-green-600 text-xl" />
                        <span className="text-green-600 text-sm font-semibold">+{salesReports.monthly_growth}%</span>
                      </>
                    ) : (
                      <>
                        <AiOutlineFall className="text-red-600 text-xl" />
                        <span className="text-red-600 text-sm font-semibold">{salesReports.monthly_growth}%</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Today */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-[#9A9A9A]">Today's Sales</p>
                    <p className="text-2xl font-bold text-[#4A5568]">{formatCurrency(salesReports.today_sales)}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BsCalendar3 className="text-2xl text-blue-600" />
                  </div>
                </div>

                {/* Last Month */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-[#9A9A9A]">Last Month</p>
                    <p className="text-xl font-bold text-[#4A5568]">{formatCurrency(salesReports.last_month_sales)}</p>
                  </div>
                </div>

                {/* Monthly Breakdown */}
                {salesReports.monthly_breakdown && salesReports.monthly_breakdown.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-[#4A5568] mb-3">Monthly Breakdown</p>
                    <div className="space-y-2">
                      {salesReports.monthly_breakdown.map((month, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-[#9A9A9A]">{month.month}</span>
                          <span className="font-semibold text-[#4A5568]">{formatCurrency(month.sales)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center text-gray-500">
              No sales data available
            </div>
          )}
        </div>

        {/* User Activity */}
        <div className="bg-[#F2F2F2] rounded-xl p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out">
          <h3 className="text-lg font-semibold text-[#4A5568] mb-4 flex items-center gap-2">
            <BiUser className="text-xl" />
            User Activity Statistics
          </h3>
          {userActivity ? (
            <div className="bg-white rounded-lg p-6">
              <div className="space-y-4">
                {/* Total Users */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div>
                    <p className="text-sm text-[#9A9A9A] font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-purple-700">{userActivity.total_users}</p>
                  </div>
                  <div className="bg-purple-600 p-3 rounded-lg">
                    <HiOutlineUserGroup className="text-3xl text-white" />
                  </div>
                </div>

                {/* Users with Orders */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-[#9A9A9A]">Customers (with orders)</p>
                    <p className="text-2xl font-bold text-[#4A5568]">{userActivity.users_with_orders}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <RiShoppingBag3Line className="text-2xl text-green-600" />
                  </div>
                </div>

                {/* New Users This Month */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-[#9A9A9A]">New Users This Month</p>
                    <p className="text-2xl font-bold text-[#4A5568]">{userActivity.new_users_this_month}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <RiUserAddLine className="text-2xl text-blue-600" />
                  </div>
                </div>

                {/* Average Orders Per User */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-[#9A9A9A]">Avg. Orders Per User</p>
                    <p className="text-2xl font-bold text-[#4A5568]">{userActivity.average_orders_per_user}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <HiOutlineChartBar className="text-2xl text-orange-600" />
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[#9A9A9A]">New Today</p>
                    <p className="text-lg font-bold text-[#4A5568]">{userActivity.new_users_today}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[#9A9A9A]">Active Today</p>
                    <p className="text-lg font-bold text-[#4A5568]">{userActivity.active_users_today}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[#9A9A9A]">New This Week</p>
                    <p className="text-lg font-bold text-[#4A5568]">{userActivity.new_users_this_week}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[#9A9A9A]">Returning</p>
                    <p className="text-lg font-bold text-[#4A5568]">{userActivity.returning_customers}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center text-gray-500">
              No user activity data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardAnalytics