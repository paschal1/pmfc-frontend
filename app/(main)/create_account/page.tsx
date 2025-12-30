// app/create-account/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { Parallax } from 'react-parallax'
import SecondaryFooter from '../components/SecondaryFooter'
import Link from 'next/link'
import { triggerAuthStateChange } from '../store/useAuth'

const CreateAccount = () => {
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: ''
  })
  
  // UI state
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle checkbox changes
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubscribed(event.target.checked)
  }

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerms(event.target.checked)
  }

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    if (!formData.password) {
      toast.error('Password is required')
      return false
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return false
    }
    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match')
      return false
    }
    if (!terms) {
      toast.error('You must agree to the terms and conditions')
      return false
    }
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Creating your account...')

    try {
      // Register the user
      const response = await axios.post(
        'https://api.princem-fc.com/api/register',
        formData
      )

      if (response.status === 200 || response.status === 201) {
        toast.dismiss(loadingToast)
        toast.success('Account created successfully!')
        
        // Store authentication data
        if (response.data.bearer_token) {
          const token = response.data.bearer_token
          const userData = response.data.user
          
          // Store in BOTH cookies and localStorage for consistency
          Cookies.set('userToken', token, { expires: 7 })
          Cookies.set('isLoggedIn', 'true', { expires: 7 })
          localStorage.setItem('userToken', token)
          localStorage.setItem('isLoggedIn', 'true')
          
          if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData))
          }
          
          // Trigger auth state change IMMEDIATELY
          triggerAuthStateChange()
          
          // Redirect to shop
          setTimeout(() => {
            router.push('/shop')
          }, 1500)
        } else {
          // Redirect to login if no token returned
          setTimeout(() => {
            router.push('/login')
          }, 1500)
        }
      }
    } catch (err: any) {
      toast.dismiss(loadingToast)
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Registration error:', err)
      }
      
      if (err.response?.data?.errors) {
        // Laravel validation errors
        const errors = err.response.data.errors
        const firstError = Object.values(errors)[0]
        const errorMessage = Array.isArray(firstError) ? (firstError[0] as string) : 'Registration failed'
        toast.error(errorMessage)
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section with Parallax */}
      <Parallax
        strength={300}
        className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/account-bg.jpg'}
      >
        <h1 className="font-bold text-3xl text-white lg:ml-20 ml-10">
          Create an account
        </h1>
      </Parallax>

      {/* Mobile Hero Section */}
      <div className="h-[230px] w-[100%] lg:hidden block relative">
        <img
          src={'/account-bg.jpg'}
          alt="Create account banner"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          Create an account
        </h1>
      </div>

      {/* Already have account link */}
      <h1 className="mt-10 lg:ml-20 ml-4 lg:text-xl text-lg text-gray-300">
        Already have an account?{' '}
        <Link href={'/login'}>
          <span className="text-[#fab702] hover:opacity-75 cursor-pointer transition-opacity">
            Login instead!
          </span>
        </Link>
      </h1>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="lg:ml-20 ml-4 mt-10 mb-10">
        <div className="lg:w-[85%] w-[90%] flex flex-col text-white gap-6">

          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Full Name: *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email: *</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
              required
              disabled={loading}
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone">Phone Number:</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={handleChange}
              className="placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
              disabled={loading}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white resize-none"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password: *</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              className="placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
              required
              disabled={loading}
              minLength={8}
            />
            <p className="text-sm text-gray-400">Password must be at least 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password_confirmation">Confirm Password: *</label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              placeholder="Re-enter your password"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
              required
              disabled={loading}
              minLength={8}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSubscribed}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-[#fab702] border-gray-300 rounded focus:ring-[#fab702]"
                disabled={loading}
              />
              <span className="text-sm">Sign up for our newsletter</span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={terms}
                onChange={handleTermsChange}
                className="w-4 h-4 mt-1 text-[#fab702] border-gray-300 rounded focus:ring-[#fab702]"
                required
                disabled={loading}
              />
              <span className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-[#fab702] hover:underline">
                  terms and conditions
                </Link>{' '}
                and the{' '}
                <Link href="/privacy" className="text-[#fab702] hover:underline">
                  privacy policy
                </Link>{' '}
                *
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="uppercase mt-4 border border-white py-3 lg:w-[200px] hover:border-none hover:bg-[#fab702] hover:text-black hover:font-semibold transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-sm text-gray-400 mt-2">* Required fields</p>
        </div>
      </form>

      <SecondaryFooter />
    </div>
  )
}

export default CreateAccount