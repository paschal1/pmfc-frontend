import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'https://api.princem-fc.com/api'

// Create axios instance WITHOUT default Content-Type
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
})

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Check for token in cookies or localStorage
    const token = Cookies.get('userToken') || localStorage.getItem('userToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Only set Content-Type if not multipart/form-data
    // (letting FormData set its own boundary)
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
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
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.data)
    }
    
    if (error.response?.status === 401) {
      // Clear ALL auth data from both cookies and localStorage
      Cookies.remove('userToken')
      Cookies.remove('isLoggedIn')
      localStorage.removeItem('userToken')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userData')
      
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
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

export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/status`, { status })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to update order status')
    }
    throw new Error('Failed to update order status')
  }
}

export const cancelOrder = async (orderId: number) => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/cancel`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to cancel order')
    }
    throw new Error('Failed to cancel order')
  }
}

export default apiClient