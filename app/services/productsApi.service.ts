// services/productsApi.service.ts

import apiClient from './api'
import axios from 'axios'

// Types
export interface Product {
  id: number
  name: string
  description: string
  stock: number
  price: string | number
  image: string | null
  thumbnailImage?: string | null
  category_id: number
  category?: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

export interface PaginatedProducts {
  current_page: number
  data: Product[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface GetProductsParams {
  category_id?: number
  per_page?: number
  page?: number
  available_only?: boolean
}

// Get All Products with Filtering and Pagination
export const getProducts = async (params?: GetProductsParams): Promise<PaginatedProducts> => {
  try {
    const response = await apiClient.get('/products', {
      params: {
        category_id: params?.category_id,
        per_page: params?.per_page || 12,
        page: params?.page || 1,
        available_only: params?.available_only,
      },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch products'
      )
    }
    throw new Error('Failed to fetch products')
  }
}

// Get Single Product
export const getProduct = async (id: number): Promise<Product> => {
  try {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch product'
      )
    }
    throw new Error('Failed to fetch product')
  }
}

// Add to Wishlist
export const addToWishlist = async (productId: number): Promise<any> => {
  try {
    const response = await apiClient.post('/wishlist', { product_id: productId })
    return response.data
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
    // No return needed for void, but explicit return is good practice
    return
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

// Admin: Create Product
export const createProduct = async (formData: FormData): Promise<Product> => {
  try {
    const response = await apiClient.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.product || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        if (errors) {
          const errorMessages = Object.values(errors).flat().join(', ')
          throw new Error(errorMessages)
        }
      }
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create product'
      )
    }
    throw new Error('Failed to create product')
  }
}

// Admin: Update Product
export const updateProduct = async (id: number, formData: FormData): Promise<Product> => {
  try {
    const response = await apiClient.post(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        _method: 'PUT',
      },
    })
    return response.data.product || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update product'
      )
    }
    throw new Error('Failed to update product')
  }
}

// Admin: Delete Product
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/products/${id}`)
    return
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to delete product'
      )
    }
    throw new Error('Failed to delete product')
  }
}