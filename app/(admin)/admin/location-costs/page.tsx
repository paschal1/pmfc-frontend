'use client'

import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import { Loader, AlertCircle, X } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'

type LocationCostData = {
  id: number
  state_id: number
  state?: {
    id: number
    name: string
  }
  cost: number
  created_at: string
  updated_at: string
}

type StateData = {
  id: number
  name: string
}

// Create authenticated axios instance
const API_BASE_URL = 'https://api.princem-fc.com/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
})

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Check for token in cookies or localStorage
    const token = Cookies.get('userToken') || localStorage.getItem('userToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Set Content-Type for JSON requests
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('=== API ERROR START ===')
    console.error('Error Object:', error)
    console.error('Response Status:', error.response?.status)
    console.error('Response Data:', error.response?.data)
    console.error('Request URL:', error.config?.url)
    console.error('Request Method:', error.config?.method)
    console.error('=== API ERROR END ===')
    
    if (error.response?.status === 401) {
      console.warn('Unauthorized - clearing auth data')
      // Clear auth data
      Cookies.remove('userToken')
      Cookies.remove('isLoggedIn')
      localStorage.removeItem('userToken')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userData')
      
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

const AdminLocationCosts = () => {
  const [costs, setCosts] = useState<LocationCostData[]>([])
  const [states, setStates] = useState<StateData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    state_id: '',
    cost: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('📍 Fetching location costs and states...')

      // Fetch location costs with states - returns array directly
      const costsResponse = await apiClient.get('/location-costs')
      console.log('✅ Location costs response:', costsResponse.data)
      const costsData = Array.isArray(costsResponse.data) ? costsResponse.data : []
      setCosts(costsData)

      // Extract all unique states from location costs and fetch all states
      // We need all states (not just those with costs) for the dropdown
      try {
        const statesResponse = await apiClient.get('/states')
        console.log('✅ States response:', statesResponse.data)
        setStates(Array.isArray(statesResponse.data) ? statesResponse.data : [])
      } catch (stateErr: any) {
        // If /states endpoint doesn't exist, extract states from costs
        console.log('⚠️ /states endpoint not available, extracting from costs')
        const statesFromCosts = costsData
          .filter((cost: LocationCostData) => cost.state)
          .map((cost: LocationCostData) => cost.state!)
        
        // Remove duplicates
        const uniqueStates = Array.from(
          new Map(statesFromCosts.map((s) => [s.id, s])).values()
        )
        setStates(uniqueStates)
      }

    } catch (err: any) {
      console.error('❌ Error fetching data:', err)
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to fetch data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.state_id || !formData.cost) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = {
        state_id: parseInt(formData.state_id),
        cost: parseFloat(formData.cost),
      }

      console.log('💾 Submitting location cost:', data)

      if (editingId) {
        // Update existing
        await apiClient.put(`/location-costs/${editingId}`, data)
        console.log('✅ Location cost updated')
      } else {
        // Create new
        await apiClient.post('/location-costs', data)
        console.log('✅ Location cost created')
      }

      // Reset form and fetch fresh data
      setFormData({ state_id: '', cost: '' })
      setShowForm(false)
      setEditingId(null)
      await fetchData()
    } catch (err: any) {
      console.error('❌ Error submitting form:', err)
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to save location cost'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (cost: LocationCostData) => {
    setEditingId(cost.id)
    setFormData({
      state_id: cost.state_id.toString(),
      cost: cost.cost.toString(),
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this location cost?')) return

    try {
      console.log('🗑️ Deleting location cost:', id)
      await apiClient.delete(`/location-costs/${id}`)
      console.log('✅ Location cost deleted')
      setCosts((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      console.error('❌ Error deleting cost:', err)
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to delete location cost'
      setError(message)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ state_id: '', cost: '' })
    setError(null)
  }

  // Filter costs
  const filteredCosts = costs.filter((item) => {
    const stateName = item.state?.name || ''
    return (
      stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cost.toString().includes(searchTerm)
    )
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Get unused states
  const usedStateIds = costs.map((c) => c.state_id)
  const availableStates = states.filter((s) => !usedStateIds.includes(s.id))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Location Costs</h1>
          <p className="text-gray-600">Manage pricing for different states</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#fab702] text-black px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            + Add Location
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Location Cost' : 'Add New Location Cost'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="state_id" className="block text-gray-700 font-medium mb-2">
                  State *
                </label>
                <select
                  id="state_id"
                  name="state_id"
                  value={formData.state_id}
                  onChange={handleInputChange}
                  disabled={!!editingId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] disabled:bg-gray-100"
                >
                  <option value="">Select a state</option>
                  {editingId
                    ? states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))
                    : availableStates.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label htmlFor="cost" className="block text-gray-700 font-medium mb-2">
                  Cost (₦) *
                </label>
                <input
                  id="cost"
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="Enter cost in naira"
                  step="1"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#fab702] text-black px-6 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-70 transition flex items-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update' : 'Add'} Location
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-gray-700 font-medium mb-2">
          Search
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by state name or cost..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total States</p>
          <p className="text-2xl font-bold text-gray-800">{costs.length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Average Cost</p>
          <p className="text-2xl font-bold text-blue-600">
            {costs.length > 0
              ? formatPrice(
                  costs.reduce((sum, c) => sum + (Number(c.cost) || 0), 0) / costs.length
                )
              : '₦0'}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Cost</p>
          <p className="text-2xl font-bold text-green-600">
            {costs.length > 0
              ? formatPrice(costs.reduce((sum, c) => sum + (Number(c.cost) || 0), 0))
              : '₦0'}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">State</th>
                <th className="px-6 py-4 text-left font-semibold">Cost</th>
                <th className="px-6 py-4 text-left font-semibold">Last Updated</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin text-[#fab702]" />
                      <span className="text-gray-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No matching location costs found' : 'No location costs yet'}
                  </td>
                </tr>
              ) : (
                filteredCosts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">
                        {item.state?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-800 font-semibold">
                        {formatPrice(item.cost)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(item.updated_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                        >
                          <MdOutlineEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <RiDeleteBin5Line className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminLocationCosts