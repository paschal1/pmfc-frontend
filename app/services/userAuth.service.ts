// services/userAuth.service.ts

import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'https://api.princem-fc.com/api'

// Create axios instance for user authentication
const userApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add request interceptor to include user token
userApiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('userToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for handling errors
userApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error('API Error:', error.response?.data)
    
    // Handle 401 Unauthorized - user session expired
    if (error.response?.status === 401) {
      Cookies.remove('userToken')
      Cookies.remove('isLoggedIn')
      localStorage.removeItem('userData')
      
      // Only redirect to login if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  bearer_token: string
  user: {
    id: number
    name: string
    email: string
    phone?: string
    address?: string
  }
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  address?: string
}

export interface RegisterResponse {
  bearer_token?: string
  user?: {
    id: number
    name: string
    email: string
    phone?: string
    address?: string
  }
  message?: string
}

// User Login
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials)
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

// User Registration
export const registerUser = async (userData: RegisterData): Promise<RegisterResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Laravel validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const firstError = Object.values(errors)[0]
        const errorMessage = Array.isArray(firstError) ? firstError[0] : 'Registration failed.'
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

// User Logout
export const logoutUser = async () => {
  try {
    await userApiClient.post('/logout')
    
    // Clear all user data
    Cookies.remove('userToken')
    Cookies.remove('isLoggedIn')
    localStorage.removeItem('userData')
    
    return true
  } catch (error) {
    // console.error('Logout error:', error)
    
    // Even if API call fails, clear local data
    Cookies.remove('userToken')
    Cookies.remove('isLoggedIn')
    localStorage.removeItem('userData')
    
    return true
  }
}

// Get Current User
export const getCurrentUser = async () => {
  try {
    const response = await userApiClient.get('/user')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch user data.'
      )
    }
    throw new Error('Failed to fetch user data.')
  }
}

// Update User Profile
export const updateUserProfile = async (userData: Partial<RegisterData>) => {
  try {
    const response = await userApiClient.put('/user/profile', userData)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to update profile.'
      )
    }
    throw new Error('Failed to update profile.')
  }
}

// Check if user is logged in
export const isUserLoggedIn = (): boolean => {
  return !!Cookies.get('userToken') && Cookies.get('isLoggedIn') === 'true'
}

// Get stored user data
export const getStoredUserData = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export default userApiClient