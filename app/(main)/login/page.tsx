'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Parallax } from 'react-parallax'
import SecondaryFooter from '../components/SecondaryFooter'
import { loginUser, storeAuthData } from '../../services/auth.service'
import { triggerAuthStateChange } from '../store/useAuth'
import { useAuth } from '../store/useAuth'

const Login = () => {
  const router = useRouter()
  const { isLoggedIn, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading) {
      setIsInitializing(false)
      if (isLoggedIn) {
        router.push('/shop')
      }
    }
  }, [isLoggedIn, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Logging in...')

    try {
      const response = await loginUser(email, password)
      const { bearer_token, user, cart } = response

      // Store token, user, and cart in localStorage & cookies
      storeAuthData(bearer_token, user, cart)

      toast.dismiss(loadingToast)
      toast.success(`Welcome back, ${user?.name || 'User'}!`)

      // Trigger auth state change
      triggerAuthStateChange()

      // Redirect to shop
      setTimeout(() => {
        router.push('/shop')
      }, 1000)
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Login failed. Please try again.')

      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast('Forgot password functionality coming soon!', {
      icon: '🔒',
    })
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#fab702] border-r-transparent"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Section with Parallax */}
      <Parallax
        strength={300}
        className="h-[230px] w-full bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/account-bg.jpg'}
      >
        <h1 className="font-bold text-3xl text-white lg:ml-20 ml-10">Login</h1>
      </Parallax>

      {/* Mobile Hero Section */}
      <div className="h-[230px] w-full lg:hidden block relative">
        <img
          src={'/account-bg.jpg'}
          alt="Login banner"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          Login
        </h1>
      </div>

      {/* Login Form Section */}
      <div className="flex lg:flex-row flex-col lg:px-20 mt-10 gap-6 ml-4 lg:ml-0 mb-10">
        {/* Login Form */}
        <div className="flex flex-col">
          <h1 className="text-white font-bold lg:text-2xl text-lg">Login</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 lg:w-[570px] w-[90%] mt-5"
          >
            {/* Email Input */}
            <div className="flex flex-col gap-2 text-white">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2 text-white">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="border border-white py-2 font-bold text-white hover:bg-[#fab702] hover:text-black hover:border-none transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Forgot Password Link */}
            <h1
              onClick={handleForgotPassword}
              className="font-bold text-sm text-white text-center hover:underline cursor-pointer hover:text-[#fab702] transition-colors"
            >
              Lost your password?
            </h1>
          </form>
        </div>

        {/* Sign Up Section */}
        <div className="flex flex-col lg:w-auto w-[90%]">
          <h1 className="text-white font-bold lg:text-2xl text-lg">Sign Up</h1>
          <h1 className="mt-4 md:text-lg text-sm text-white">
            By creating an account with our store, you will be able to move
            through the checkout process faster, store multiple shipping
            addresses, view and track your orders in your account and more.
          </h1>
          <Link
            href={'/create-account'}
            className="mt-8 text-lg text-[#fab702] hover:opacity-75 transition-all duration-500 ease-in-out inline-block"
          >
            No account? Create one here
          </Link>
        </div>
      </div>

      <SecondaryFooter />
    </div>
  )
}

export default Login
