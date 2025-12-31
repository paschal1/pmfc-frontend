import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'https://api.princem-fc.com/api'
const TOKEN_KEY = 'userToken'
const LOGIN_KEY = 'isLoggedIn'
const USER_DATA_KEY = 'userData'
const USER_CART_KEY = 'userCart'

// Axios instance for authenticated requests
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
    const token = Cookies.get(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for handling 401 Unauthorized
userApiClient.interceptors.response.use(
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

// Types
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
  cart?: any
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
  cart?: any
  message?: string
}

// Store auth + optional cart
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

// Clear auth data
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

// Check if logged in
export const isUserLoggedIn = (): boolean => !!Cookies.get(TOKEN_KEY) && Cookies.get(LOGIN_KEY) === 'true'

// Get stored user
export const getStoredUserData = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_DATA_KEY)
    return userData ? JSON.parse(userData) : null
  }
  return null
}

// Get stored cart
export const getStoredUserCart = () => {
  if (typeof window !== 'undefined') {
    const cartData = localStorage.getItem(USER_CART_KEY)
    return cartData ? JSON.parse(cartData) : null
  }
  return null
}

// User login
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials)
    const { bearer_token, user, cart } = response.data

    if (bearer_token) storeAuthData(bearer_token, user, cart)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Login failed. Please check your credentials.')
    }
    throw new Error('Login failed. Please try again.')
  }
}

// User registration
export const registerUser = async (userData: RegisterData): Promise<RegisterResponse> => {
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
    await userApiClient.post('/logout')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    clearAuth()
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await userApiClient.get('/user')
    return response.data.data || response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user data.')
    }
    throw new Error('Failed to fetch user data.')
  }
}

// Update user profile
export const updateUserProfile = async (userData: Partial<RegisterData>) => {
  try {
    const response = await userApiClient.put('/user/profile', userData)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update profile.')
    }
    throw new Error('Failed to update profile.')
  }
}

export default userApiClient
