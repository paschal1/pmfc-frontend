'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Parallax } from 'react-parallax'
import SecondaryFooter from '../components/SecondaryFooter'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        'https://api.princem-fc.com/api/login',
        {
          email,
          password,
        }
      )
      
      if (response.status === 200) {
        const token = response.data.bearer_token
        const userData = response.data.user // Assuming the API returns user data
        
        // Store user authentication
        Cookies.set('userToken', token, { expires: 7 }) // 7 days expiry for regular users
        Cookies.set('isLoggedIn', 'true', { expires: 7 })
        
        // Optionally store user data
        if (userData) {
          localStorage.setItem('userData', JSON.stringify(userData))
        }
        
        // Redirect to home or account page
        router.push('/') // or '/account' if you have a user account page
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    alert('Forgot password functionality coming soon!')
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section with Parallax */}
      <Parallax
        strength={300}
        className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/account-bg.jpg'}
      >
        <h1 className="font-bold text-3xl text-white lg:ml-20 ml-10">Login</h1>
      </Parallax>
      
      {/* Mobile Hero Section */}
      <div className="h-[230px] w-[100%] lg:hidden block relative">
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 lg:w-[570px] w-[90%] mt-5">
            {/* Email Input */}
            <div className="flex flex-col gap-2 text-white">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                title="email"
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
                title="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

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
            href={'/create_account'}
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