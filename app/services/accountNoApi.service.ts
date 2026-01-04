import axios from 'axios'
import Cookies from 'js-cookie'

export interface AccountDetail {
  id: string | number
  account_type: 'bank' | 'paypal' | 'other'
  account_name: string
  account_number?: string
  bank_name?: string
  email?: string
  additional_info?: string
  created_at: string
  is_active: boolean
}

export interface CreateAccountPayload {
  account_type: 'bank' | 'paypal' | 'other'
  account_name: string
  account_number?: string
  bank_name?: string
  email?: string
  additional_info?: string
}

export interface UpdateAccountPayload {
  account_type?: 'bank' | 'paypal' | 'other'
  account_name?: string
  account_number?: string
  bank_name?: string
  email?: string
  additional_info?: string
  is_active?: boolean
}

export interface ToggleStatusPayload {
  is_active: boolean
}

// Create axios instance with proper base URL
const API_BASE_URL = 'https://api.princem-fc.com/api'

const accountApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
})

// Add request interceptor to include auth token
accountApiClient.interceptors.request.use(
  (config) => {
    // Check for token in cookies or localStorage
    const token = Cookies.get('userToken') || localStorage.getItem('userToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Only set Content-Type if not multipart/form-data
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => {
    console.error('Account Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor with error handling
accountApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('=== Account API ERROR START ===')
    console.error('Error Object:', error)
    console.error('Response Status:', error.response?.status)
    console.error('Response Data:', error.response?.data)
    console.error('Request URL:', error.config?.url)
    console.error('Request Method:', error.config?.method)
    console.error('=== Account API ERROR END ===')

    if (error.response?.status === 401) {
      console.warn('Unauthorized - clearing auth data')
      Cookies.remove('userToken')
      Cookies.remove('isLoggedIn')
      localStorage.removeItem('userToken')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userData')

      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// Get all accounts
export const getAccounts = async (): Promise<AccountDetail[]> => {
  console.log('🔄 Fetching all accounts...')
  try {
    const response = await accountApiClient.get('/accounts')
    console.log('✅ Accounts fetched successfully:', response.data)
    return response.data?.data || response.data || []
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch accounts'
      console.error('❌ Error fetching accounts:', errorMsg)
      throw new Error(errorMsg)
    }
    console.error('❌ Error fetching accounts:', error)
    throw new Error('Failed to fetch accounts')
  }
}

// Create new account
export const createAccount = async (payload: CreateAccountPayload): Promise<AccountDetail> => {
  console.log('➕ Creating new account...', payload)

  // Validate payload
  if (!payload.account_type) {
    throw new Error('account_type is required')
  }
  if (!payload.account_name) {
    throw new Error('account_name is required')
  }
  if (payload.account_type === 'bank' && !payload.bank_name) {
    throw new Error('bank_name is required for bank accounts')
  }
  if (payload.account_type === 'bank' && !payload.account_number) {
    throw new Error('account_number is required for bank accounts')
  }
  if (payload.account_type === 'paypal' && !payload.email) {
    throw new Error('email is required for PayPal accounts')
  }

  try {
    const response = await accountApiClient.post('/accounts', payload)
    console.log('✅ Account created successfully:', response.data)
    return response.data?.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to create account'
      console.error('❌ Error creating account:', errorMsg)
      throw new Error(errorMsg)
    }
    console.error('❌ Error creating account:', error)
    throw new Error('Failed to create account')
  }
}

// Update account
export const updateAccount = async (
  id: string,
  payload: UpdateAccountPayload
): Promise<AccountDetail> => {
  console.log(`✏️ Updating account ${id}...`, payload)

  if (!id) {
    throw new Error('Account ID is required')
  }

  try {
    const response = await accountApiClient.put(`/accounts/${id}`, payload)
    console.log('✅ Account updated successfully:', response.data)
    return response.data?.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to update account'
      console.error('❌ Error updating account:', errorMsg)
      throw new Error(errorMsg)
    }
    console.error('❌ Error updating account:', error)
    throw new Error('Failed to update account')
  }
}

// Delete account
export const deleteAccount = async (id: string): Promise<void> => {
  console.log(`🗑️ Deleting account ${id}...`)

  if (!id) {
    throw new Error('Account ID is required')
  }

  try {
    await accountApiClient.delete(`/accounts/${id}`)
    console.log('✅ Account deleted successfully')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to delete account'
      console.error('❌ Error deleting account:', errorMsg)
      throw new Error(errorMsg)
    }
    console.error('❌ Error deleting account:', error)
    throw new Error('Failed to delete account')
  }
}

// Toggle account active status
export const toggleAccountStatus = async (
  id: string,
  payload: ToggleStatusPayload
): Promise<AccountDetail> => {
  console.log(`🔀 Toggling account ${id} status...`, payload)

  if (!id) {
    throw new Error('Account ID is required')
  }
  if (typeof payload.is_active !== 'boolean') {
    throw new Error('is_active must be a boolean')
  }

  try {
    const response = await accountApiClient.patch(`/accounts/${id}/status`, payload)
    console.log('✅ Account status toggled successfully:', response.data)
    return response.data?.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to update account status'
      console.error('❌ Error toggling account status:', errorMsg)
      throw new Error(errorMsg)
    }
    console.error('❌ Error toggling account status:', error)
    throw new Error('Failed to update account status')
  }
}

// Get only active accounts (for public display on checkout)
export const getActiveAccounts = async (): Promise<AccountDetail[]> => {
  console.log('🔄 Fetching active accounts...')
  try {
    const response = await accountApiClient.get('/accounts/active')
    console.log('✅ Active accounts fetched successfully:', response.data)
    return response.data?.data || response.data || []
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch active accounts'
      console.error('❌ Error fetching active accounts:', errorMsg)
      throw new Error(errorMsg)
    }
    console.error('❌ Error fetching active accounts:', error)
    throw new Error('Failed to fetch active accounts')
  }
}

// Get accounts by type
export const getAccountsByType = async (
  type: 'bank' | 'paypal' | 'other'
): Promise<AccountDetail[]> => {
  console.log(`🔄 Fetching ${type} accounts...`)

  if (!['bank', 'paypal', 'other'].includes(type)) {
    throw new Error('Invalid account type. Must be: bank, paypal, or other')
  }

  try {
    const response = await accountApiClient.get(`/accounts/type/${type}`)
    console.log(`✅ ${type} accounts fetched successfully:`, response.data)
    return response.data?.data || response.data || []
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || `Failed to fetch ${type} accounts`
      console.error(`❌ Error fetching ${type} accounts:`, errorMsg)
      throw new Error(errorMsg)
    }
    console.error(`❌ Error fetching ${type} accounts:`, error)
    throw new Error(`Failed to fetch ${type} accounts`)
  }
}

export default accountApiClient