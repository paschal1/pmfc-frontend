// types/dashboard.types.ts

export interface Category {
  id: number
  name: string
  image: string
}

export interface BestSellingProduct {
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

export interface RecentOrder {
  order_id: number
  product_id: number
  image: string
  name: string
  price: number
  orders: number
  stock: number
  amount: number
  date: string
}

export interface DashboardSummary {
  total_revenue: number
  total_orders: number
  total_products: number
  total_customers: number
  total_categories: number
  categories: Category[]
  best_selling_products: BestSellingProduct[]
  recent_orders: RecentOrder[]
}

export interface WebsitePerformance {
  page_load_time: string
  bounce_rate: string
  conversion_rate: string
}

export interface AnalyticsData {
  salesReports: any // Replace with specific type based on your actual data structure
  userActivity: any // Replace with specific type based on your actual data structure
  websitePerformance: WebsitePerformance
}

export interface ApiResponse<T> {
  data: T
  error?: string
}