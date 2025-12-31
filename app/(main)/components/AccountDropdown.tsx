'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { closeMenu } from '../store/menubarSlice'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { useAuth, triggerAuthStateChange } from '../store/useAuth'

const AccountDropdown = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const dropdown = useAppSelector((state) => state.accountDropdown.dropdown)
  const { isLoggedIn, user, loading } = useAuth()

  const closeMenubar = () => {
    dispatch(closeMenu())
  }

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...')
      
      // Get token before clearing
      const token = Cookies.get('userToken')
      
      if (token) {
        // Call backend logout endpoint
        try {
          await fetch('https://api.princem-fc.com/api/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          })
          console.log('Backend logout successful')
        } catch (apiError) {
          console.error('Backend logout error (continuing anyway):', apiError)
        }
      }

      // Clear ALL auth data - be thorough
      console.log('Clearing cookies...')
      Cookies.remove('userToken', { path: '/' })
      Cookies.remove('isLoggedIn', { path: '/' })
      
      // Also try without path option
      Cookies.remove('userToken')
      Cookies.remove('isLoggedIn')

      // Clear localStorage
      console.log('Clearing localStorage...')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken')
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userData')
        localStorage.removeItem('userCart')
        
        // Clear everything with our keys
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.includes('user') || key.includes('User') || key.includes('auth') || key.includes('token'))) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
      }

      console.log('Triggering auth state change...')
      // Trigger auth state change MULTIPLE times to ensure it works
      triggerAuthStateChange()
      
      // Wait a bit and trigger again
      setTimeout(() => {
        triggerAuthStateChange()
      }, 100)

      // Close menu
      closeMenubar()

      // Show success message
      toast.success('Logged out successfully')

      console.log('Redirecting to home...')
      // Force reload to clear any cached state
      window.location.href = '/'
      
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error logging out')
      
      // Even if there's an error, still clear local data
      Cookies.remove('userToken', { path: '/' })
      Cookies.remove('isLoggedIn', { path: '/' })
      Cookies.remove('userToken')
      Cookies.remove('isLoggedIn')
      
      if (typeof window !== 'undefined') {
        localStorage.clear()
        window.location.href = '/'
      }
    }
  }

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  }

  // Show loading state
  if (loading) {
    return null // or a loading spinner
  }

  return (
    <>
      {/* Desktop Dropdown */}
      <div className="w-[230px] group-hover:flex hidden absolute top-20 ml-[-3rem] text-white bg-[#18191B] flex-col items-start z-10 gap-2 p-4">
        {isLoggedIn ? (
          <>
            <div className="w-full pb-2 border-b border-[#333333]">
              <p className="text-sm text-gray-400">Hello,</p>
              <p className="font-semibold text-[#fab702]">{user?.name || 'User'}</p>
            </div>
            <Link href={'/my-account'}>
              <h1 className="cursor-pointer hover:text-[#fab702]">My Account</h1>
            </Link>
            <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
            <button
              onClick={() => router.push('/my-account?page=history')}
              className="w-full text-left"
            >
              <h1 className="cursor-pointer hover:text-[#fab702]">My Orders</h1>
            </button>
            <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
            <button onClick={handleLogout} className="w-full text-left">
              <h1 className="cursor-pointer hover:text-[#fab702]">Logout</h1>
            </button>
          </>
        ) : (
          <>
            <Link href={'/create_account'}>
              <h1 className="cursor-pointer hover:text-[#fab702]">Sign Up</h1>
            </Link>
            <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
            <Link href={'/login'}>
              <h1 className="cursor-pointer hover:text-[#fab702]">Login</h1>
            </Link>
            <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
          </>
        )}
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {dropdown && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="lg:hidden flex text-white bg-[#18191B] flex-col items-start pl-6 z-10 gap-5 mt-4 w-[100%] pb-4"
          >
            {isLoggedIn ? (
              <>
                <div className="w-full">
                  <p className="text-sm text-gray-400">Hello,</p>
                  <p className="font-semibold text-[#fab702]">{user?.name || 'User'}</p>
                </div>
                <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
                <Link href={'/my-account'} onClick={closeMenubar}>
                  <h1 className="cursor-pointer hover:text-[#fab702]">My Account</h1>
                </Link>
                <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
                <button
                  onClick={() => {
                    closeMenubar()
                    router.push('/my-account?page=history')
                  }}
                  className="w-full text-left"
                >
                  <h1 className="cursor-pointer hover:text-[#fab702]">My Orders</h1>
                </button>
                <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
                <button onClick={handleLogout} className="w-full text-left">
                  <h1 className="cursor-pointer hover:text-[#fab702]">Logout</h1>
                </button>
              </>
            ) : (
              <>
                <Link href={'/create_account'} onClick={closeMenubar}>
                  <h1 className="cursor-pointer hover:text-[#fab702]">Sign Up</h1>
                </Link>
                <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
                <Link href={'/login'} onClick={closeMenubar}>
                  <h1 className="cursor-pointer hover:text-[#fab702]">Login</h1>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AccountDropdown