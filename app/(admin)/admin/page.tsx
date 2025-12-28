'use client'

import { useEffect, useState } from 'react'
import { GoDatabase } from 'react-icons/go'
import { RiShoppingBag3Line, RiChat3Line, RiUserAddLine } from 'react-icons/ri'
import DashboardCategory from './components/DashboardCategory'
import DashboardBestSellers from './components/DashboardBestSellers'
import DashboardRecentOrder from './components/DashboardRecentOrder'
import DashboardAnalytics from './components/DashboardAnalytics'
import { 
  getDashboardSummary, 
  getAllAnalytics,
  DashboardSummary,
  AnalyticsData 
} from '../../services/dashboardApi.service'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch dashboard summary (required)
      const summaryData = await getDashboardSummary()
      setDashboardData(summaryData)

      // Fetch analytics data (optional - won't break dashboard if it fails)
      getAllAnalytics()
        .then((analytics) => {
          if (analytics) {
            setAnalyticsData(analytics)
          }
        })
        .catch((analyticsError) => {
          console.warn('Analytics endpoints not available:', analyticsError)
          // Dashboard still works without analytics
        })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="bg-white pb-[5rem] flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#4A5568] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <div className="mt-4 text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-white pb-[5rem] flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Error: {error || 'No data available'}</div>
          <button 
            onClick={fetchAllData}
            className="bg-[#4A5568] text-white px-6 py-2 rounded-lg hover:bg-[#2D3748] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white pb-[5rem]">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8 px-4 max-w-7xl mx-auto">
        {/* Total Revenue */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-black rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Revenue</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">
                {formatCurrency(dashboardData.total_revenue)}
              </h1>
            </div>
          </div>
          <div className="bg-gray-400 h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <GoDatabase className="h-[30px] w-[30px]" data-testid="icon-revenue" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-[#747DC6] rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Orders</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">
                {formatNumber(dashboardData.total_orders)}
              </h1>
            </div>
          </div>
          <div className="bg-[#747DC60D] h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <RiShoppingBag3Line className="h-[30px] w-[30px] text-[#747DC6]" data-testid="icon-orders" />
          </div>
        </div>

        {/* Total Products */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-[#EF3F3E] rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Products</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">
                {formatNumber(dashboardData.total_products)}
              </h1>
            </div>
          </div>
          <div className="bg-[#EF3F3E1A] h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <RiChat3Line className="h-[30px] w-[30px] text-[#EF3F3E]" data-testid="icon-products" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-[#9E65C2] rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Customers</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">
                {formatNumber(dashboardData.total_customers)}
              </h1>
            </div>
          </div>
          <div className="bg-[#9E65C21A] h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <RiUserAddLine className="h-[30px] w-[30px] text-[#9E65C2]" data-testid="icon-customers" />
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      {analyticsData && <DashboardAnalytics data={analyticsData} />}

      {/* Existing Components with Real Data */}
      <div className="mt-8">
        <DashboardCategory 
          categories={dashboardData.categories}
          totalCategories={dashboardData.total_categories}
        />
        <DashboardBestSellers products={dashboardData.best_selling_products} />
        <DashboardRecentOrder orders={dashboardData.recent_orders} />
      </div>
    </div>
  )
}

export default Dashboard