// hooks/useAuth.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  isAuthenticated,
  getStoredUserData,
  getAuthToken,
} from '../../services/auth.service'

interface UserData {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
}

/**
 * Custom hook for authentication state management
 * Syncs with unified auth.service.ts
 */
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(() => {
    try {
      // Check if token exists
      const authenticated = isAuthenticated()
      
      if (authenticated) {
        setIsLoggedIn(true)
        
        // Get user data from localStorage
        const userData = getStoredUserData()
        if (userData) {
          setUser(userData)
        }
      } else {
        setIsLoggedIn(false)
        setUser(null)
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
      checkAuth()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('authStateChanged', handleAuthChange)

      // Cleanup
      return () => {
        window.removeEventListener('authStateChanged', handleAuthChange)
      }
    }
  }, [checkAuth])

  return {
    isLoggedIn,
    user,
    loading,
    token: getAuthToken(),
    checkAuth, // Expose checkAuth to manually refresh auth state
  }
}

/**
 * Helper function to trigger auth state change across the app
 * Call this after login/register/logout to update all components
 */
export const triggerAuthStateChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('authStateChanged'))
  }
}