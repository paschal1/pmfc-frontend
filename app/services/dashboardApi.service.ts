// services/dashboardApi.service.ts

import apiClient from './api'
import axios from 'axios'

// Types
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
  salesReports: any
  userActivity: any
  websitePerformance: WebsitePerformance
}

// Dashboard Summary
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await apiClient.get('/analytics/dashboard-summary')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch dashboard summary'
      )
    }
    throw new Error('Failed to fetch dashboard summary')
  }
}

// Sales Reports
export const getSalesReports = async () => {
  try {
    const response = await apiClient.get('/analytics/sales-reports')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch sales reports'
      )
    }
    throw new Error('Failed to fetch sales reports')
  }
}

// User Activity
export const getUserActivity = async () => {
  try {
    const response = await apiClient.get('/analytics/user-activity')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch user activity'
      )
    }
    throw new Error('Failed to fetch user activity')
  }
}

// Website Performance
export const getWebsitePerformance = async () => {
  try {
    const response = await apiClient.get('/analytics/website-performance')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch website performance'
      )
    }
    throw new Error('Failed to fetch website performance')
  }
}

// Get All Analytics Data
export const getAllAnalytics = async (): Promise<AnalyticsData> => {
  try {
    const [salesRes, activityRes, performanceRes] = await Promise.all([
      getSalesReports(),
      getUserActivity(),
      getWebsitePerformance()
    ])

    return {
      salesReports: salesRes.data,
      userActivity: activityRes.data,
      websitePerformance: performanceRes.data
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch analytics data'
      )
    }
    throw new Error('Failed to fetch analytics data')
  }
}