// services/accountApi.service.ts - UPDATED WITH PASSWORD CHANGE

import apiClient from './api'
import axios from 'axios'

// Types
export interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
  created_at: string
}

export interface Order {
  id: string
  order_id: number
  trackingNumber: string
  date: string
  status: 'order_processing' | 'pre_production' | 'in_production' | 'shipped' | 'delivered' | 'canceled'
  total: string
  items: number
  productName: string
  productImage: string
}

export interface WishlistItem {
  id: number
  product_id: number
  product_name: string
  product_price: string
  product_description: string
  product_image?: string
  added_at: string
}

// Get Current User
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/user')
    return response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch user data'
      )
    }
    throw new Error('Failed to fetch user data')
  }
}

// Update User Profile
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.patch('/update-profile', userData)
    return response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to update profile'
      )
    }
    throw new Error('Failed to update profile')
  }
}

// ✅ NEW: Change Password
export const changePassword = async (passwordData: {
  currentPassword: string
  newPassword: string
}): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/change-password', passwordData)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to change password'
      )
    }
    throw new Error('Failed to change password')
  }
}

// Get User Orders
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get('/orders/user')
    const orders = response.data.data || response.data
    
    return orders.map((order: any) => ({
      id: order.id || `#ORD-${order.order_id}`,
      order_id: order.order_id || order.id,
      trackingNumber: order.tracking_number || 'N/A',
      date: order.created_at || order.date,
      status: order.status || 'order_processing',
      total: order.total_price || order.total || '₦0',
      items: order.orderItems?.length || 1,
      productName: order.orderItems?.[0]?.product_name || 'Product',
      productImage: order.orderItems?.[0]?.product?.image || '📦'
    }))
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch orders'
      )
    }
    throw new Error('Failed to fetch orders')
  }
}

// Get User Wishlist
export const getUserWishlist = async (): Promise<WishlistItem[]> => {
  try {
    const response = await apiClient.get('/wishlist')
    return response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch wishlist'
      )
    }
    throw new Error('Failed to fetch wishlist')
  }
}

// Add to Wishlist
export const addToWishlist = async (productId: number): Promise<WishlistItem> => {
  try {
    const response = await apiClient.post('/wishlist', { product_id: productId })
    return response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to add to wishlist'
      )
    }
    throw new Error('Failed to add to wishlist')
  }
}

// Remove from Wishlist
export const removeFromWishlist = async (wishlistId: number): Promise<void> => {
  try {
    await apiClient.delete(`/wishlist/${wishlistId}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to remove from wishlist'
      )
    }
    throw new Error('Failed to remove from wishlist')
  }
}