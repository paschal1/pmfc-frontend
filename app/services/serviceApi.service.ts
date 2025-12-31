// services/serviceApi.service.ts

import apiClient from './api'
import axios from 'axios'

export interface ServiceData {
  id: number
  title: string
  description: string
  type: 'Residential Design' | 'Hospitality Design' | 'Office Design' | 'Commercial Design'
  price: number | null
  min_price: number | null
  max_price: number | null
  image1: string | null
  image2: string | null
  created_at: string
  updated_at: string
}

export interface CreateServiceData {
  title: string
  description: string
  type: string
  price?: number
  min_price?: number
  max_price?: number
  image1: File
  image2?: File
}

export interface UpdateServiceData {
  title?: string
  description?: string
  type?: string
  price?: number
  min_price?: number
  max_price?: number
  image1?: File
  image2?: File
}

/**
 * Get all services
 * Optional filters:
 * - type: 'Residential Design' (filter by type)
 * - minPrice: 5000, maxPrice: 50000 (filter by price range)
 */
export const getServices = async (type?: string, minPrice?: number, maxPrice?: number) => {
  try {
    console.log('📦 Fetching services...', { type, minPrice, maxPrice })
    
    let url = '/services?'
    const params = new URLSearchParams()

    if (type) {
      params.append('type', type)
    }

    if (minPrice !== undefined) {
      params.append('min_price', minPrice.toString())
    }

    if (maxPrice !== undefined) {
      params.append('max_price', maxPrice.toString())
    }

    url += params.toString()

    const response = await apiClient.get(url)
    
    console.log('✅ Services loaded:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching services:', error)
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch services')
    }
    throw new Error('Failed to fetch services')
  }
}

/**
 * Get all available service types
 */
export const getServiceTypes = async () => {
  try {
    console.log('📋 Fetching service types...')
    
    const response = await apiClient.get('/services/types')
    
    console.log('✅ Service types loaded:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching service types:', error)
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service types')
    }
    throw new Error('Failed to fetch service types')
  }
}

/**
 * Get services grouped by type
 */
export const getServicesByType = async () => {
  try {
    console.log('📊 Fetching services grouped by type...')
    
    const response = await apiClient.get('/services/by-type')
    
    console.log('✅ Services grouped by type loaded:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching services by type:', error)
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch services by type')
    }
    throw new Error('Failed to fetch services by type')
  }
}

/**
 * Get a single service by ID
 */
export const getService = async (id: number) => {
  try {
    console.log('📦 Fetching service with ID:', id)
    
    const response = await apiClient.get(`/services/${id}`)
    
    console.log('✅ Service loaded:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching service:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Service with ID ${id} not found`)
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch service')
    }
    throw new Error('Failed to fetch service')
  }
}

/**
 * Format price display
 * Shows min-max range or single price
 */
export const formatPrice = (service: ServiceData): string => {
  if (service.min_price && service.max_price) {
    return `₦${new Intl.NumberFormat('en-NG').format(service.min_price)} - ₦${new Intl.NumberFormat('en-NG').format(service.max_price)}`
  }

  if (service.price) {
    return `₦${new Intl.NumberFormat('en-NG').format(service.price)}`
  }

  return 'Price on request'
}

/**
 * Get price range object
 */
export const getPriceRange = (service: ServiceData) => {
  return {
    min: service.min_price ?? service.price,
    max: service.max_price ?? service.price,
    single: service.price,
    hasRange: !!(service.min_price && service.max_price),
    display: formatPrice(service),
  }
}

/**
 * Create a new service (Admin only)
 */
export const createService = async (data: CreateServiceData) => {
  try {
    console.log('➕ Creating new service...', data.title)
    
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('type', data.type)
    
    if (data.price) {
      formData.append('price', data.price.toString())
    }

    if (data.min_price) {
      formData.append('min_price', data.min_price.toString())
    }

    if (data.max_price) {
      formData.append('max_price', data.max_price.toString())
    }
    
    if (data.image1) {
      formData.append('image1', data.image1)
    }
    
    if (data.image2) {
      formData.append('image2', data.image2)
    }

    const response = await apiClient.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    console.log('✅ Service created:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error creating service:', error)
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create service')
    }
    throw new Error('Failed to create service')
  }
}

/**
 * Update a service (Admin only)
 */
export const updateService = async (id: number, data: UpdateServiceData) => {
  try {
    console.log('✏️ Updating service with ID:', id)
    
    const formData = new FormData()
    
    if (data.title) {
      formData.append('title', data.title)
    }
    
    if (data.description) {
      formData.append('description', data.description)
    }
    
    if (data.type) {
      formData.append('type', data.type)
    }
    
    if (data.price !== undefined) {
      formData.append('price', data.price.toString())
    }

    if (data.min_price !== undefined) {
      formData.append('min_price', data.min_price.toString())
    }

    if (data.max_price !== undefined) {
      formData.append('max_price', data.max_price.toString())
    }
    
    if (data.image1) {
      formData.append('image1', data.image1)
    }
    
    if (data.image2) {
      formData.append('image2', data.image2)
    }

    const response = await apiClient.post(`/services/${id}?_method=PUT`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    console.log('✅ Service updated:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error updating service:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Service with ID ${id} not found`)
      }
      throw new Error(error.response?.data?.message || 'Failed to update service')
    }
    throw new Error('Failed to update service')
  }
}

/**
 * Delete a service (Admin only)
 */
export const deleteService = async (id: number) => {
  try {
    console.log('🗑️ Deleting service with ID:', id)
    
    const response = await apiClient.delete(`/services/${id}`)
    
    console.log('✅ Service deleted')
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error deleting service:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Service with ID ${id} not found`)
      }
      throw new Error(error.response?.data?.message || 'Failed to delete service')
    }
    throw new Error('Failed to delete service')
  }
}

export default {
  getServices,
  getServiceTypes,
  getServicesByType,
  getService,
  formatPrice,
  getPriceRange,
  createService,
  updateService,
  deleteService,
}