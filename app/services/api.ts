import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'https://api.princem-fc.com/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('adminToken') // Use adminToken from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data)
    
    if (error.response?.status === 401) {
      Cookies.remove('adminToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getOrders = async () => {
  try {
    const response = await apiClient.get('/orders')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to fetch orders')
    }
    throw new Error('Failed to fetch orders')
  }
}

export const getOrderById = async (id: number) => {
  try {
    const response = await apiClient.get(`/orders/${id}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to fetch order')
    }
    throw new Error('Failed to fetch order')
  }
}

export const deleteOrder = async (id: number) => {
  try {
    const response = await apiClient.delete(`/orders/${id}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to delete order')
    }
    throw new Error('Failed to delete order')
  }
}

export default apiClient