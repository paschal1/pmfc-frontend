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
  const { isLoggedIn, user } = useAuth()

  const closeMenubar = () => {
    dispatch(closeMenu())
  }

  const handleLogout = async () => {
    try {
      // Clear cookies and localStorage
      Cookies.remove('userToken')
      Cookies.remove('isLoggedIn')
      localStorage.removeItem('userData')
      
      // Trigger auth state change
      triggerAuthStateChange()
      
      // Close menu
      closeMenubar()
      
      // Show success message
      toast.success('Logged out successfully')
      
      // Redirect to home
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error logging out')
    }
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      height: 0,
    },
    visible: {
      opacity: 1,
      height: 'auto',
    },
  }

  return (
    <>
      {/* Desktop Dropdown */}
      <div className="w-[230px] group-hover:flex hidden absolute top-20 ml-[-3rem] text-white bg-[#18191B] flex-col items-start z-10 gap-2 p-4">
        {isLoggedIn ? (
          <>
            {/* Logged In Menu */}
            <div className="w-full pb-2 border-b border-[#333333]">
              <p className="text-sm text-gray-400">Hello,</p>
              <p className="font-semibold text-[#fab702]">{user?.name || 'User'}</p>
            </div>
            <Link href={'/my-account'}>
              <h1 className="cursor-pointer hover:text-[#fab702]">My Account</h1>
            </Link>
            <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
            <button onClick={() => router.push('/my-account?page=history')} className="w-full text-left">
              <h1 className="cursor-pointer hover:text-[#fab702]">My Orders</h1>
            </button>
            <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
            <button onClick={handleLogout} className="w-full text-left">
              <h1 className="cursor-pointer hover:text-[#fab702]">Logout</h1>
            </button>
          </>
        ) : (
          <>
            {/* Not Logged In Menu */}
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
                {/* Logged In Mobile Menu */}
                <div className="w-full">
                  <p className="text-sm text-gray-400">Hello,</p>
                  <p className="font-semibold text-[#fab702]">{user?.name || 'User'}</p>
                </div>
                <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
                <Link href={'/my-account'} onClick={closeMenubar}>
                  <h1 className="cursor-pointer hover:text-[#fab702]">My Account</h1>
                </Link>
                <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
                <button onClick={() => { closeMenubar(); router.push('/my-account?page=history'); }} className="w-full text-left">
                  <h1 className="cursor-pointer hover:text-[#fab702]">My Orders</h1>
                </button>
                <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
                <button onClick={handleLogout} className="w-full text-left">
                  <h1 className="cursor-pointer hover:text-[#fab702]">Logout</h1>
                </button>
              </>
            ) : (
              <>
                {/* Not Logged In Mobile Menu */}
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