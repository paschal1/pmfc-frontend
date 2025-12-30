// components/ProtectedRoute.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../(main)/store/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter()
  const { isLoggedIn, loading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only check auth after component is mounted (prevents hydration issues)
    if (isMounted && !loading) {
      if (!isLoggedIn) {
        router.push('/login')
      }
    }
  }, [isLoggedIn, loading, isMounted, router])

  // Show loading while checking authentication
  if (!isMounted || loading || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#fab702] border-r-transparent"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute