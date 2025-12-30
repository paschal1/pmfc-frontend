// services/auth.service.ts

import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'https://api.princem-fc.com/api'
const TOKEN_KEY = 'userToken'
const LOGIN_KEY = 'isLoggedIn'
const USER_DATA_KEY = 'userData'

/**
 * Unified authentication service - handles all auth operations
 * Uses consistent token naming across the app
 */

// Create axios instance for authenticated requests
export const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

/**
 * Request interceptor - add token to all requests
 */
authApiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - handle 401 errors
 */
authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      clearAuth()
      
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

/**
 * Get stored auth token
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Try cookies first
    const cookieToken = Cookies.get(TOKEN_KEY)
    if (cookieToken) {
      return cookieToken
    }
    
    // Fallback to localStorage
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

/**
 * Get stored user data
 */
export const getStoredUserData = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_DATA_KEY)
    return userData ? JSON.parse(userData) : null
  }
  return null
}

/**
 * Store authentication data
 */
export const storeAuthData = (token: string, user: any) => {
  // Store token in cookies (more secure)
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  })
  
  // Store login flag
  Cookies.set(LOGIN_KEY, 'true', {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  })

  // Also store in localStorage for client-side access
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(LOGIN_KEY, 'true')
    
    if (user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
    }
  }
}

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  // Remove from cookies
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(LOGIN_KEY)
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(LOGIN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  return !!token && token.length > 0
}

/**
 * User Login
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    })

    if (response.data.bearer_token) {
      storeAuthData(response.data.bearer_token, response.data.user)
    }

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Login failed. Please check your credentials.'
      )
    }
    throw new Error('Login failed. Please try again.')
  }
}

/**
 * User Registration
 */
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

    if (response.data.bearer_token) {
      storeAuthData(response.data.bearer_token, response.data.user)
    }

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Laravel validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const firstError = Object.values(errors)[0]
        const errorMessage = Array.isArray(firstError)
          ? (firstError[0] as string)
          : 'Registration failed.'
        throw new Error(errorMessage)
      }
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Registration failed.'
      )
    }
    throw new Error('Registration failed. Please try again.')
  }
}

/**
 * User Logout
 */
export const logoutUser = async () => {
  try {
    // Try to notify backend
    await authApiClient.post('/logout')
  } catch (error) {
    // Even if it fails, clear local data
    console.error('Logout error:', error)
  } finally {
    clearAuth()
  }
}

/**
 * Get Current User
 */
export const getCurrentUser = async () => {
  try {
    const response = await authApiClient.get('/user')
    return response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch user data.'
      )
    }
    throw new Error('Failed to fetch user data.')
  }
}

/**
 * Update User Profile
 */
export const updateUserProfile = async (userData: any) => {
  try {
    const response = await authApiClient.put('/user/profile', userData)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to update profile.'
      )
    }
    throw new Error('Failed to update profile.')
  }
}

export default authApiClient