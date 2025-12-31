// services/quoteApi.service.ts

import apiClient from './api'
import axios from 'axios'

export interface QuoteFormData {
  email: string
  name: string
  phone: string
  message: string
  areasize: number
  squarefeet: number
  state_id: number
  location: string
  budget: string
  services: number[]
}

export interface QuoteResponse {
  id: number
  email: string
  name: string
  phone: string
  message: string
  areasize: number
  squarefeet: number
  state_id: number
  address: string
  budget: string
  service_titles: string
  service_prices: string
  total_price: number
  status: string
  created_at: string
  updated_at: string
}

/**
 * Submit a quote request
 */
export const submitQuote = async (data: QuoteFormData) => {
  try {
    console.log('📝 Submitting quote request...', data)

    const response = await apiClient.post('/quotes', data)

    console.log('✅ Quote submitted successfully:', response.data)

    return response.data
  } catch (error: any) {
    console.error('❌ Error submitting quote:', error)

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to submit quote'
      const errors = error.response?.data?.errors || {}

      throw {
        message: errorMessage,
        errors: errors,
        statusCode: error.response?.status,
      }
    }

    throw new Error('Failed to submit quote request')
  }
}

/**
 * Get all quotes (admin only)
 */
export const getQuotes = async () => {
  try {
    console.log('📋 Fetching all quotes...')

    const response = await apiClient.get('/quotes')

    console.log('✅ Quotes loaded:', response.data)

    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching quotes:', error)

    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quotes')
    }
    throw new Error('Failed to fetch quotes')
  }
}

/**
 * Get a single quote by ID
 */
export const getQuote = async (id: number) => {
  try {
    console.log('📦 Fetching quote with ID:', id)

    const response = await apiClient.get(`/quotes/${id}`)

    console.log('✅ Quote loaded:', response.data)

    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching quote:', error)

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Quote with ID ${id} not found`)
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch quote')
    }
    throw new Error('Failed to fetch quote')
  }
}

/**
 * Delete a quote (admin only)
 */
export const deleteQuote = async (id: number) => {
  try {
    console.log('🗑️ Deleting quote with ID:', id)

    const response = await apiClient.delete(`/quotes/${id}`)

    console.log('✅ Quote deleted')

    return response.data
  } catch (error: any) {
    console.error('❌ Error deleting quote:', error)

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Quote with ID ${id} not found`)
      }
      throw new Error(error.response?.data?.message || 'Failed to delete quote')
    }
    throw new Error('Failed to delete quote')
  }
}

export default {
  submitQuote,
  getQuotes,
  getQuote,
  deleteQuote,
}