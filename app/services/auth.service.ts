import axios from 'axios'
import Cookies from 'js-cookie'
import { triggerAuthStateChange } from '../(main)/store/useAuth'

const API_BASE_URL = 'https://api.princem-fc.com/api'
const TOKEN_KEY = 'userToken'
const LOGIN_KEY = 'isLoggedIn'
const USER_DATA_KEY = 'userData'
const USER_CART_KEY = 'userCart'

// Axios instance for authenticated requests
export const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Add token to all requests
authApiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle 401 errors globally
authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth()
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
  }
  return null
}

// Get stored user data
export const getStoredUserData = (): any | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_DATA_KEY)
    return userData ? JSON.parse(userData) : null
  }
  return null
}

// Get stored user cart
export const getStoredUserCart = (): any | null => {
  if (typeof window !== 'undefined') {
    const cartData = localStorage.getItem(USER_CART_KEY)
    return cartData ? JSON.parse(cartData) : null
  }
  return null
}

// Store token, user, and optional cart
export const storeAuthData = (token: string, user: any, cart?: any) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' })
  Cookies.set(LOGIN_KEY, 'true', { expires: 7, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' })

  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(LOGIN_KEY, 'true')
    if (user) localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
    if (cart) localStorage.setItem(USER_CART_KEY, JSON.stringify(cart))
  }
}

// Clear all auth data
export const clearAuth = () => {
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(LOGIN_KEY)
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(LOGIN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
    localStorage.removeItem(USER_CART_KEY)
  }
}

// Check authentication
export const isAuthenticated = (): boolean => !!getAuthToken()

// User login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password })
    const { bearer_token, user, cart } = response.data

    if (bearer_token) {
      storeAuthData(bearer_token, user, cart)
    }

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Login failed. Please check your credentials.')
    }
    throw new Error('Login failed. Please try again.')
  }
}

// User registration
export const registerUser = async (userData: {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  address?: string
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData)
    const { bearer_token, user, cart } = response.data

    if (bearer_token) storeAuthData(bearer_token, user, cart)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const firstError = Object.values(errors)[0]
        throw new Error(Array.isArray(firstError) ? firstError[0] : 'Registration failed.')
      }
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Registration failed.')
    }
    throw new Error('Registration failed. Please try again.')
  }
}

// User logout
export const logoutUser = async () => {
  try {
    await authApiClient.post('/logout') // invalidates backend session
  } catch (error) {
    console.error('Logout API error:', error)
  } finally {
    clearAuth()
    triggerAuthStateChange() // update global state
  }
}


// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await authApiClient.get('/user')
    return response.data.data || response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user data.')
    }
    throw new Error('Failed to fetch user data.')
  }
}

// Update user profile
export const updateUserProfile = async (userData: any) => {
  try {
    const response = await authApiClient.put('/user/profile', userData)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update profile.')
    }
    throw new Error('Failed to update profile.')
  }
}

export default authApiClient
