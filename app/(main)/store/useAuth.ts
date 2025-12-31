// hooks/useAuth.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'

interface UserData {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
}

const TOKEN_KEY = 'userToken'
const LOGIN_KEY = 'isLoggedIn'
const USER_DATA_KEY = 'userData'

/**
 * Custom hook for authentication state management
 */
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(() => {
    try {
      // Check if token exists in cookies
      const token = Cookies.get(TOKEN_KEY)
      const loginStatus = Cookies.get(LOGIN_KEY)
      
      if (token && loginStatus === 'true') {
        setIsLoggedIn(true)
        
        // Get user data from localStorage
        if (typeof window !== 'undefined') {
          const userDataStr = localStorage.getItem(USER_DATA_KEY)
          if (userDataStr) {
            const userData = JSON.parse(userDataStr)
            setUser(userData)
          } else {
            // Token exists but no user data - clear auth
            setIsLoggedIn(false)
            setUser(null)
            Cookies.remove(TOKEN_KEY)
            Cookies.remove(LOGIN_KEY)
          }
        }
      } else {
        // No valid auth found
        setIsLoggedIn(false)
        setUser(null)
        
        // Clean up any stale data
        if (typeof window !== 'undefined') {
          localStorage.removeItem(USER_DATA_KEY)
          localStorage.removeItem('userCart')
        }
        Cookies.remove(TOKEN_KEY)
        Cookies.remove(LOGIN_KEY)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Check auth on mount
    checkAuth()

    // Listen for auth changes
    const handleAuthChange = () => {
      console.log('Auth state changed - rechecking...')
      checkAuth()
    }

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_DATA_KEY || e.key === null) {
        console.log('Storage changed - rechecking auth...')
        checkAuth()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('authStateChanged', handleAuthChange)
      window.addEventListener('storage', handleStorageChange)

      // Also check periodically (every 5 seconds) to catch cookie changes
      const interval = setInterval(() => {
        const token = Cookies.get(TOKEN_KEY)
        const currentLoggedIn = !!token && Cookies.get(LOGIN_KEY) === 'true'
        
        if (currentLoggedIn !== isLoggedIn) {
          console.log('Cookie state mismatch detected - rechecking...')
          checkAuth()
        }
      }, 5000)

      // Cleanup
      return () => {
        window.removeEventListener('authStateChanged', handleAuthChange)
        window.removeEventListener('storage', handleStorageChange)
        clearInterval(interval)
      }
    }
  }, [checkAuth, isLoggedIn])

  return {
    isLoggedIn,
    user,
    loading,
    token: typeof window !== 'undefined' ? Cookies.get(TOKEN_KEY) || null : null,
    checkAuth, // Expose checkAuth to manually refresh auth state
  }
}

/**
 * Helper function to trigger auth state change across the app
 * Call this after login/register/logout to update all components
 */
export const triggerAuthStateChange = () => {
  if (typeof window !== 'undefined') {
    console.log('Triggering auth state change event...')
    
    // Dispatch custom event
    window.dispatchEvent(new Event('authStateChanged'))
    
    // Also dispatch storage event to trigger in other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: USER_DATA_KEY,
      newValue: null,
      oldValue: null,
      storageArea: localStorage,
    }))
  }
}