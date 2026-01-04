'use client'

import { useEffect, useState } from 'react'
import { GoDatabase } from 'react-icons/go'
import { RiShoppingBag3Line, RiChat3Line, RiUserAddLine } from 'react-icons/ri'
import { MdOutlineMailOutline, MdRequestPage, MdLocationOn, MdEdit, MdDelete, MdAdd, MdClose, MdAccountBalance } from 'react-icons/md'
import { SiPaypal } from 'react-icons/si'
import Link from 'next/link'
import DashboardCategory from './components/DashboardCategory'
import DashboardBestSellers from './components/DashboardBestSellers'
import DashboardRecentOrder from './components/DashboardRecentOrder'
import DashboardAnalytics from './components/DashboardAnalytics'
import * as contactApi from '../../services/contactApi.service'
import * as quoteApi from '../../services/quoteApi.service'
import * as AccountNo from '../../services/accountNoApi.service'
import { 
  getDashboardSummary, 
  getAllAnalytics,
  DashboardSummary,
  AnalyticsData 
} from '../../services/dashboardApi.service'

interface FormData {
  account_type: 'bank' | 'paypal' | 'other'
  account_name: string
  account_number: string
  bank_name: string
  email: string
  additional_info: string
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [pendingMessages, setPendingMessages] = useState(0)
  const [pendingQuotes, setPendingQuotes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Account Details States
  const [accountDetails, setAccountDetails] = useState<AccountNo.AccountDetail[]>([])
  const [showAccountForm, setShowAccountForm] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [formData, setFormData] = useState<FormData>({
    account_type: 'bank',
    account_name: '',
    account_number: '',
    bank_name: '',
    email: '',
    additional_info: '',
  })
  const [accountLoading, setAccountLoading] = useState(false)
  const [accountError, setAccountError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllData()
    fetchAccountDetails()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const summaryData = await getDashboardSummary()
      setDashboardData(summaryData)
      fetchPendingCount()
      fetchPendingQuotes()

      getAllAnalytics()
        .then((analytics) => {
          if (analytics) {
            setAnalyticsData(analytics)
          }
        })
        .catch((analyticsError) => {
          console.warn('Analytics endpoints not available:', analyticsError)
        })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingCount = async () => {
    try {
      console.log('🔄 Fetching pending messages count...')
      const response = await contactApi.getPendingCount()
      console.log('✅ Pending messages response:', response)
      
      if (response && typeof response.pending_count === 'number') {
        console.log('📧 Pending messages:', response.pending_count)
        setPendingMessages(response.pending_count)
      }
    } catch (err) {
      console.warn('⚠️ Failed to fetch pending messages count:', err)
    }
  }

  const fetchPendingQuotes = async () => {
    try {
      console.log('🔄 Fetching pending quotes count...')
      const response = await quoteApi.getQuotes()
      console.log('✅ Quotes response:', response)
      
      const quotes = response.data || response
      if (Array.isArray(quotes)) {
        const pendingCount = quotes.filter((q: any) => q.status === 'pending').length
        console.log('📋 Pending quotes:', pendingCount)
        setPendingQuotes(pendingCount)
      }
    } catch (err) {
      console.warn('⚠️ Failed to fetch pending quotes count:', err)
    }
  }

  // Fetch account details from API
  const fetchAccountDetails = async () => {
    try {
      setAccountLoading(true)
      setAccountError(null)
      
      const accounts = await AccountNo.getAccounts()
      setAccountDetails(accounts)
    } catch (err) {
      console.error('Error fetching account details:', err)
      setAccountError('Failed to load account details')
    } finally {
      setAccountLoading(false)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value as any
    }))
  }

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setAccountError(null)

    // Validation
    if (!formData.account_name.trim()) {
      setAccountError('Account name is required')
      return
    }

    if (formData.account_type === 'bank' && !formData.bank_name.trim()) {
      setAccountError('Bank name is required for bank accounts')
      return
    }

    if (formData.account_type === 'bank' && !formData.account_number.trim()) {
      setAccountError('Account number is required for bank accounts')
      return
    }

    if (formData.account_type === 'paypal' && !formData.email.trim()) {
      setAccountError('Email is required for PayPal accounts')
      return
    }

    try {
      setAccountLoading(true)

      const payload: AccountNo.CreateAccountPayload | AccountNo.UpdateAccountPayload = {
        account_type: formData.account_type,
        account_name: formData.account_name,
        account_number: formData.account_number || undefined,
        bank_name: formData.bank_name || undefined,
        email: formData.email || undefined,
        additional_info: formData.additional_info,
      }

      if (editingId) {
        // Update existing account
        await AccountNo.updateAccount(editingId.toString(), payload)
      } else {
        // Create new account
        await AccountNo.createAccount(payload as AccountNo.CreateAccountPayload)
      }

      // Refresh the list
      await fetchAccountDetails()
      resetForm()
      setShowAccountForm(false)
    } catch (err) {
      setAccountError(err instanceof Error ? err.message : 'Failed to save account')
    } finally {
      setAccountLoading(false)
    }
  }

  const handleEditAccount = (account: AccountNo.AccountDetail) => {
    setFormData({
      account_type: account.account_type,
      account_name: account.account_name,
      account_number: account.account_number || '',
      bank_name: account.bank_name || '',
      email: account.email || '',
      additional_info: account.additional_info || '',
    })
    setEditingId(account.id)
    setShowAccountForm(true)
  }

  const handleDeleteAccount = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        setAccountLoading(true)
        await AccountNo.deleteAccount(id.toString())
        await fetchAccountDetails()
      } catch (err) {
        setAccountError('Failed to delete account')
      } finally {
        setAccountLoading(false)
      }
    }
  }

  const handleToggleActive = async (id: string | number, isActive: boolean) => {
    try {
      setAccountLoading(true)
      await AccountNo.toggleAccountStatus(id.toString(), { is_active: !isActive })
      await fetchAccountDetails()
    } catch (err) {
      setAccountError('Failed to update account status')
    } finally {
      setAccountLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      account_type: 'bank',
      account_name: '',
      account_number: '',
      bank_name: '',
      email: '',
      additional_info: '',
    })
    setEditingId(null)
    setAccountError(null)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <MdAccountBalance className="h-6 w-6 text-blue-600" />
      case 'paypal':
        return <SiPaypal className="h-6 w-6 text-blue-500" />
      default:
        return <MdAccountBalance className="h-6 w-6 text-green-600" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white pb-[5rem] flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#4A5568] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <div className="mt-4 text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-white pb-[5rem] flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Error: {error || 'No data available'}</div>
          <button 
            onClick={fetchAllData}
            className="bg-[#4A5568] text-white px-6 py-2 rounded-lg hover:bg-[#2D3748] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white pb-[5rem]">
      {/* Header with Admin Action Buttons */}
      <div className="mt-8 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4A5568] mb-6">Dashboard</h1>
        
        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Quote Requests Button */}
          <Link
            href="/admin/quotes"
            className="relative inline-flex items-center gap-2 bg-[#fab702] hover:bg-[#e8a500] text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group justify-center"
          >
            <MdRequestPage className="h-5 w-5" />
            <span>Quote Requests</span>

            {pendingQuotes > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                {pendingQuotes > 99 ? '99+' : pendingQuotes}
              </span>
            )}
          </Link>

          {/* Contact Messages Button */}
          <Link
            href="/admin/contacts"
            className="relative inline-flex items-center gap-2 bg-[#fab702] hover:bg-[#e8a500] text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group justify-center"
          >
            <MdOutlineMailOutline className="h-5 w-5" />
            <span>Contact Messages</span>

            {pendingMessages > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                {pendingMessages > 99 ? '99+' : pendingMessages}
              </span>
            )}
          </Link>

          {/* Location Costs Button */}
          <Link
            href="/admin/location-costs"
            className="relative inline-flex items-center gap-2 bg-[#4A5568] hover:bg-[#2D3748] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group justify-center"
          >
            <MdLocationOn className="h-5 w-5" />
            <span>Location Costs</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
        {/* Total Revenue */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-black rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Revenue</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">
                {formatCurrency(dashboardData.total_revenue)}
              </h1>
            </div>
          </div>
          <div className="bg-gray-400 h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <GoDatabase className="h-[30px] w-[30px]" data-testid="icon-revenue" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-[#747DC6] rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Orders</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">
                {formatNumber(dashboardData.total_orders)}
              </h1>
            </div>
          </div>
          <div className="bg-[#747DC60D] h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <RiShoppingBag3Line className="h-[30px] w-[30px] text-[#747DC6]" data-testid="icon-orders" />
          </div>
        </div>

        {/* Total Products */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-[#EF3F3E] rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Products</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">
                {formatNumber(dashboardData.total_products)}
              </h1>
            </div>
          </div>
          <div className="bg-[#EF3F3E1A] h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <RiChat3Line className="h-[30px] w-[30px] text-[#EF3F3E]" data-testid="icon-products" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="h-[140px] bg-[#F2F2F2] rounded-xl flex items-center justify-between px-7 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="w-[4px] h-[95px] bg-[#9E65C2] rounded-r"></div>
            <div className="ml-4">
              <h1 className="text-[#9A9A9A] text-sm">Total Customers</h1>
              <h1 className="text-[#4A5568] font-semibold text-2xl">
                {formatNumber(dashboardData.total_customers)}
              </h1>
            </div>
          </div>
          <div className="bg-[#9E65C21A] h-[40px] w-[40px] flex items-center justify-center rounded-lg">
            <RiUserAddLine className="h-[30px] w-[30px] text-[#9E65C2]" data-testid="icon-customers" />
          </div>
        </div>
      </div>

      {/* Account Details Section */}
      <div className="mt-12 px-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg border border-slate-200">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#4A5568] flex items-center gap-3">
                <MdAccountBalance className="text-[#fab702]" />
                Payment Account Details
              </h2>
              <p className="text-gray-600 text-sm mt-2">Manage payment methods for users during checkout</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowAccountForm(!showAccountForm)
              }}
              className="flex items-center gap-2 bg-[#fab702] hover:bg-[#e8a500] text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <MdAdd className="h-5 w-5" />
              Add Account
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAccountForm && (
            <div className="bg-white rounded-xl p-6 mb-8 border-2 border-[#fab702] shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[#4A5568]">
                  {editingId ? 'Edit Account Details' : 'Add New Account'}
                </h3>
                <button
                  onClick={() => {
                    setShowAccountForm(false)
                    resetForm()
                  }}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <MdClose className="h-6 w-6" />
                </button>
              </div>

              {accountError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {accountError}
                </div>
              )}

              <form onSubmit={handleSubmitAccount} className="space-y-6">
                {/* Account Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <select
                      name="account_type"
                      value={formData.account_type}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fab702] focus:border-transparent outline-none transition"
                    >
                      <option value="bank">Bank Account</option>
                      <option value="paypal">PayPal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name *
                    </label>
                    <input
                      type="text"
                      name="account_name"
                      value={formData.account_name}
                      onChange={handleFormChange}
                      placeholder="e.g., Primary Bank Account"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fab702] focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Bank Account Fields */}
                {formData.account_type === 'bank' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="bank_name"
                        value={formData.bank_name}
                        onChange={handleFormChange}
                        placeholder="e.g., First Bank Nigeria"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fab702] focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="account_number"
                        value={formData.account_number}
                        onChange={handleFormChange}
                        placeholder="e.g., 0123456789"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fab702] focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>
                )}

                {/* PayPal Email */}
                {formData.account_type === 'paypal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PayPal Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fab702] focus:border-transparent outline-none transition"
                    />
                  </div>
                )}

                {/* Additional Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    name="additional_info"
                    value={formData.additional_info}
                    onChange={handleFormChange}
                    placeholder="Add any additional details (account holder name, SWIFT code, etc.)"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fab702] focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={accountLoading}
                    className="flex-1 bg-[#fab702] hover:bg-[#e8a500] text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {accountLoading ? 'Saving...' : editingId ? 'Update Account' : 'Add Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountForm(false)
                      resetForm()
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Accounts List */}
          {accountLoading && !showAccountForm ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#fab702] border-r-transparent"></div>
            </div>
          ) : accountDetails.length > 0 ? (
            <div className="space-y-4">
              {accountDetails.map((account) => (
                <div
                  key={account.id}
                  className={`border rounded-xl p-6 transition-all ${
                    account.is_active
                      ? 'bg-white border-gray-200 shadow-md'
                      : 'bg-gray-50 border-gray-300 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getAccountIcon(account.account_type)}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-[#4A5568] text-lg">
                          {account.account_name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {account.account_type === 'bank' && (
                            <>
                              <span className="font-medium">Bank:</span> {account.bank_name} | 
                              <span className="font-medium ml-2">Account:</span> ••••{account.account_number?.slice(-4)}
                            </>
                          )}
                          {account.account_type === 'paypal' && (
                            <>
                              <span className="font-medium">PayPal:</span> {account.email}
                            </>
                          )}
                        </p>

                        {account.additional_info && (
                          <p className="text-gray-600 text-sm mt-2">
                            <span className="font-medium">Details:</span> {account.additional_info}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={account.is_active}
                              onChange={() => handleToggleActive(account.id, account.is_active)}
                              className="w-4 h-4 rounded border-gray-300 text-[#fab702]"
                            />
                            <span className="text-sm text-gray-600">
                              {account.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </label>
                          <span className="text-xs text-gray-500">
                            Added {new Date(account.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                        title="Edit"
                      >
                        <MdEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                        title="Delete"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MdAccountBalance className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No payment accounts added yet</p>
              <p className="text-gray-500 text-sm mt-1">Add your first account to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Section */}
      {analyticsData && <DashboardAnalytics data={analyticsData} />}

      {/* Existing Components with Real Data */}
      <div className="mt-8">
        <DashboardCategory 
          categories={dashboardData.categories}
          totalCategories={dashboardData.total_categories}
        />
        <DashboardBestSellers products={dashboardData.best_selling_products} />
        <DashboardRecentOrder orders={dashboardData.recent_orders} />
      </div>
    </div>
  )
}

export default Dashboard