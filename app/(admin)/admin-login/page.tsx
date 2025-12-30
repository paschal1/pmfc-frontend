'use client'

import * as React from 'react'
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const AdminLogin = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const key = searchParams.get('key')

  useEffect(() => {
    if (key !== 'password') {
      notFound()
    }
  }, [key])

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
        Cookies.set('isAdmin', 'true')
        Cookies.set('userToken', token, {expires: 1})
        router.push('/admin')
        // console.log(response.data)
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Full error:', err)
      setError(err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center mx-auto gap-6">
      <h1 className="text-7xl font-bold text-gray-700">PMFC</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center w-full"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border-2 border-gray-700 md:w-[300px] w-[95%] rounded-[8px] focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 border-2 border-gray-700 md:w-[300px] w-[95%] rounded-[8px] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-800 text-white px-6 py-3 rounded-[8px] hover:bg-gray-700 transition duration-300"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  )
}

export default AdminLogin
