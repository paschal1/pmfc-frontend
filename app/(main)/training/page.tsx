'use client'

import React, { useState, useEffect } from 'react'
import { MdVerified } from 'react-icons/md'
import { Loader, Copy, Check, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import PaystackPop from '@paystack/inline-js'
import { createStudentEnrollment, getAllTrainingPrograms, type StudentFormData, type TrainingProgram } from '../../services/studentApi.service'
import * as AccountNo from '../../services/accountNoApi.service'

const StudentEnrollmentForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    contact_number: '',
    email: '',
    address: '',
    day: '1',
    month: '1',
    year: '2000',
    emergency_contact: '',
    previous_experience: '',
    joining_date: new Date().toISOString().split('T')[0],
    current_skill_level: '',
    goals: '',
    training_program_id: '',
  })

  const [idProof, setIdProof] = useState<File | null>(null)
  const [resume, setResume] = useState<File | null>(null)
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([])
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'Paystack'>('Bank Transfer')
  const [processingPaystack, setProcessingPaystack] = useState(false)
  const [copied, setCopied] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Account management states
  const [paymentAccounts, setPaymentAccounts] = useState<AccountNo.AccountDetail[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<AccountNo.AccountDetail | null>(null)

  useEffect(() => {
    fetchTrainingPrograms()
    fetchPaymentAccounts()
  }, [])

  const fetchTrainingPrograms = async () => {
    try {
      const programs = await getAllTrainingPrograms()
      setTrainingPrograms(programs)
    } catch (error) {
      toast.error('Failed to load training programs')
      console.error(error)
    } finally {
      setLoadingPrograms(false)
    }
  }

  const fetchPaymentAccounts = async () => {
    try {
      setLoadingAccounts(true)
      const accounts = await AccountNo.getActiveAccounts()
      setPaymentAccounts(accounts)
      
      // Auto-select first account if available
      if (accounts.length > 0) {
        setSelectedAccount(accounts[0])
      }
    } catch (error) {
      console.error('Failed to load payment accounts:', error)
      toast.error('Could not load payment methods')
    } finally {
      setLoadingAccounts(false)
    }
  }

  const generateOptions = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const days = generateOptions(1, 31)
  const months = generateOptions(1, 12)
  const years = generateOptions(1900, new Date().getFullYear())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProgramSelect = (programId: string) => {
    setFormData((prev) => ({ ...prev, training_program_id: programId }))
    const program = trainingPrograms.find(p => p.id === parseInt(programId))
    setSelectedProgram(program || null)
  }

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      const maxSize = 2 * 1024 * 1024
      
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload JPG, PNG, or PDF file')
        return
      }
      
      if (file.size > maxSize) {
        toast.error('File size must be less than 2MB')
        return
      }
      
      setIdProof(file)
      toast.success(`ID proof uploaded: ${file.name}`)
    }
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const maxSize = 2 * 1024 * 1024
      
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload PDF or DOC file')
        return
      }
      
      if (file.size > maxSize) {
        toast.error('File size must be less than 2MB')
        return
      }
      
      setResume(file)
      toast.success(`Resume uploaded: ${file.name}`)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const validateForm = () => {
    if (!formData.full_name?.trim()) {
      toast.error('Full name is required')
      return false
    }
    if (!formData.age || parseInt(formData.age) < 18) {
      toast.error('Age must be 18 or above')
      return false
    }
    if (!formData.gender) {
      toast.error('Please select gender')
      return false
    }
    if (!formData.contact_number?.trim()) {
      toast.error('Contact number is required')
      return false
    }
    if (!formData.email?.trim()) {
      toast.error('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Invalid email format')
      return false
    }
    if (!formData.address?.trim()) {
      toast.error('Address is required')
      return false
    }
    if (!formData.emergency_contact?.trim()) {
      toast.error('Emergency contact is required')
      return false
    }
    if (!formData.current_skill_level) {
      toast.error('Please select current skill level')
      return false
    }
    if (!formData.training_program_id) {
      toast.error('Please select a training program')
      return false
    }
    return true
  }

  const submitEnrollment = async (paymentRef?: string, paymentStatus: 'Pending' | 'Paid' = 'Pending') => {
    try {
      const date_of_birth = `${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`

      const submissionData: StudentFormData = {
        full_name: formData.full_name,
        age: parseInt(formData.age),
        gender: formData.gender as 'Male' | 'Female' | 'Other',
        contact_number: formData.contact_number,
        email: formData.email,
        address: formData.address,
        date_of_birth,
        emergency_contact: formData.emergency_contact,
        previous_experience: formData.previous_experience || undefined,
        joining_date: formData.joining_date,
        current_skill_level: formData.current_skill_level as 'Beginner' | 'Intermediate' | 'Advanced',
        goals: formData.goals || undefined,
        id_proof: idProof || undefined,
        resume: resume || undefined,
        training_program_id: parseInt(formData.training_program_id),
        payment_method: paymentMethod,
        payment_reference: paymentRef,
        payment_status: paymentStatus,
      }

      const response = await createStudentEnrollment(submissionData)

      setSuccess(true)
      toast.success('Enrollment submitted successfully!', { duration: 4000 })

      setTimeout(() => {
        resetForm()
      }, 3000)

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit enrollment'
      toast.error(errorMsg)
      console.error('Enrollment error:', err)
      throw err
    }
  }

  const handlePaystackPayment = async () => {
    if (!validateForm() || !selectedProgram) return

    try {
      setProcessingPaystack(true)
      const paystack = new PaystackPop()

      const price = parseFloat(selectedProgram.price.toString())

      paystack.newTransaction({
        key: 'pk_live_7fa94265109b3b80e76e7ab6b402e5160f5a35aa',
        amount: price * 100,
        email: formData.email,
        metadata: {
          custom_fields: [
            { display_name: 'Full Name', variable_name: 'fullname', value: formData.full_name },
            { display_name: 'Phone', variable_name: 'phone', value: formData.contact_number },
            { display_name: 'Training Program', variable_name: 'program', value: selectedProgram.title },
          ],
        },
        onSuccess: async (response: any) => {
          await submitEnrollment(response.reference, 'Paid')
        },
        onCancel: () => {
          toast.error('Payment canceled')
          setProcessingPaystack(false)
        },
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Paystack payment failed'
      toast.error(errorMsg)
      setProcessingPaystack(false)
    }
  }

  const handleBankTransferSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    const submitToast = toast.loading('Submitting your enrollment...')

    try {
      await submitEnrollment(undefined, 'Pending')
      toast.success('Enrollment submitted! Please complete bank transfer.', { id: submitToast })
    } catch (err) {
      toast.error('Failed to submit enrollment', { id: submitToast })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      full_name: '',
      age: '',
      gender: '',
      contact_number: '',
      email: '',
      address: '',
      day: '1',
      month: '1',
      year: '2000',
      emergency_contact: '',
      previous_experience: '',
      joining_date: new Date().toISOString().split('T')[0],
      current_skill_level: '',
      goals: '',
      training_program_id: '',
    })
    setIdProof(null)
    setResume(null)
    setSelectedProgram(null)
  }

  // Render bank account details
  const renderBankDetails = () => {
    if (!selectedAccount) return null

    if (selectedAccount.account_type === 'bank') {
      return (
        <div className="space-y-4 bg-black rounded p-4">
          <div>
            <p className="text-gray-400 text-sm">Account Name</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-white font-semibold">{selectedAccount.account_name}</p>
              <button
                type="button"
                onClick={() => copyToClipboard(selectedAccount.account_name)}
                className="text-[#fab702] hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Bank Name</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-white font-semibold">{selectedAccount.bank_name}</p>
              <button
                type="button"
                onClick={() => copyToClipboard(selectedAccount.bank_name || '')}
                className="text-[#fab702] hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Account Number</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-white font-semibold font-mono">{selectedAccount.account_number}</p>
              <button
                type="button"
                onClick={() => copyToClipboard(selectedAccount.account_number || '')}
                className="text-[#fab702] hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          {selectedAccount.additional_info && (
            <div>
              <p className="text-gray-400 text-sm">Additional Info</p>
              <p className="text-white font-semibold text-sm mt-1">{selectedAccount.additional_info}</p>
            </div>
          )}
          <div className="text-amount mt-4 pt-4 border-t border-[#FFFFFF33]">
            <p className="text-gray-400 text-sm">Amount to Transfer</p>
            <p className="text-[#fab702] font-bold text-xl">
              ₦{selectedProgram ? parseFloat(selectedProgram.price.toString()).toLocaleString() : '0'}
            </p>
          </div>
        </div>
      )
    }

    return null
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="bg-green-900/20 border border-green-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Enrollment Successful!</h2>
          <p className="text-gray-400 mb-8">
            {paymentMethod === 'Paystack' 
              ? 'Your payment has been received and enrollment is confirmed.'
              : 'Please complete the bank transfer to confirm your enrollment. We will verify and process your application.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="h-[230px] w-full relative bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex items-center h-full px-4 lg:px-20">
          <h1 className="font-bold text-2xl lg:text-3xl text-white">
            Furniture Trainee Registration
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold uppercase text-[#fab702] mb-6">
              Trainee Details
            </h2>

            <div className="space-y-2">
              <label htmlFor="full_name" className="block text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Minimum 18 years"
                min="18"
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-6">
                {['Male', 'Female', 'Other'].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#fab702] focus:ring-[#fab702]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact_number" className="block text-sm font-medium">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleInputChange}
                placeholder="+234 XXX XXX XXXX"
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Your full address"
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  className="bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none text-white"
                >
                  {days.map((day) => (
                    <option key={day} value={day} className="bg-black">
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none text-white"
                >
                  {months.map((month) => (
                    <option key={month} value={month} className="bg-black">
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none text-white"
                >
                  {years.map((year) => (
                    <option key={year} value={year} className="bg-black">
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="emergency_contact" className="block text-sm font-medium">
                Emergency Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                placeholder="+234 XXX XXX XXXX"
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="previous_experience" className="block text-sm font-medium">
                Previous Experience (Optional)
              </label>
              <textarea
                id="previous_experience"
                name="previous_experience"
                value={formData.previous_experience}
                onChange={handleInputChange}
                placeholder="Describe any relevant experience..."
                rows={3}
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="id_proof" className="block text-sm font-medium">
                Upload ID Proof (JPG, PNG, PDF - Max 2MB)
              </label>
              <input
                type="file"
                id="id_proof"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleIdProofChange}
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#fab702] file:text-black file:font-semibold hover:file:opacity-75 cursor-pointer"
              />
              {idProof && <p className="text-green-400 text-sm">✓ {idProof.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="resume" className="block text-sm font-medium">
                Upload Resume (PDF, DOC - Max 2MB)
              </label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#fab702] file:text-black file:font-semibold hover:file:opacity-75 cursor-pointer"
              />
              {resume && <p className="text-green-400 text-sm">✓ {resume.name}</p>}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold uppercase text-[#fab702] mb-6">
              Training Program Selection
            </h2>

            {loadingPrograms ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-[#fab702]" />
              </div>
            ) : (
              <div className="space-y-4">
                {trainingPrograms.map((program) => (
                  <div
                    key={program.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.training_program_id === String(program.id)
                        ? 'border-[#fab702] bg-[#fab702]/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => handleProgramSelect(String(program.id))}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-white mb-2">
                          {program.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {program.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">
                            Start: {new Date(program.start_date).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400">
                            End: {new Date(program.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-[#fab702]">
                          ₦{parseFloat(program.price.toString()).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedProgram && (
              <div className="bg-gradient-to-br from-[#fab702]/10 to-transparent border border-[#fab702]/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#fab702] mb-4">
                  Selected Program: {selectedProgram.title}
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">Program Fee:</span>{' '}
                    <span className="text-2xl font-bold text-[#fab702]">
                      ₦{parseFloat(selectedProgram.price.toString()).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Current Skill Level <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="current_skill_level"
                      value={level}
                      checked={formData.current_skill_level === level}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#fab702] focus:ring-[#fab702]"
                    />
                    <span>{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-[#212529] rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>
              <div className="space-y-4">
                <div className="space-y-3">
                  {['Bank Transfer', 'Paystack'].map((method) => (
                    <label key={method} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="payment_method"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value as 'Bank Transfer' | 'Paystack')}
                        className="w-4 h-4 text-[#fab702]"
                      />
                      <span className="text-white group-hover:text-[#fab702] transition-colors">
                        {method === 'Paystack' ? 'Paystack (Card, Transfer, USSD)' : 'Bank Transfer'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {paymentMethod === 'Bank Transfer' && selectedProgram && (
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Bank Transfer Details</h3>
                
                {loadingAccounts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-[#fab702]" />
                  </div>
                ) : paymentAccounts.length === 0 ? (
                  <div className="bg-black rounded p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-gray-400">No payment methods available</p>
                  </div>
                ) : (
                  <>
                    {paymentAccounts.length > 1 && (
                      <div className="mb-6 pb-6 border-b border-blue-700">
                        <p className="text-gray-400 text-sm mb-3">Select Payment Method:</p>
                        <div className="space-y-2">
                          {paymentAccounts.map((account) => (
                            <label
                              key={account.id}
                              className="flex items-center gap-3 cursor-pointer p-3 bg-black rounded hover:bg-gray-900 transition"
                            >
                              <input
                                type="radio"
                                name="selected_account"
                                checked={selectedAccount?.id === account.id}
                                onChange={() => setSelectedAccount(account)}
                                className="w-4 h-4 text-[#fab702]"
                              />
                              <div>
                                <p className="text-white font-semibold text-sm">{account.account_name}</p>
                                <p className="text-gray-400 text-xs">
                                  {account.account_type === 'bank' ? `${account.bank_name}` : account.email}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {renderBankDetails()}
                  </>
                )}

                {copied && (
                  <p className="text-green-400 text-sm mt-3">Copied to clipboard!</p>
                )}

                <p className="text-gray-400 text-xs mt-4">
                  After making the transfer, submit your enrollment. We'll verify the payment and process your registration.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          {paymentMethod === 'Bank Transfer' ? (
            <button
              onClick={handleBankTransferSubmit}
              disabled={loading || !formData.training_program_id}
              className="px-12 py-4 bg-[#fab702] text-black font-bold text-lg rounded-lg hover:opacity-75 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading && <Loader className="w-5 h-5 animate-spin" />}
              {loading ? 'Submitting...' : 'Submit Enrollment (After Transfer)'}
            </button>
          ) : (
            <button
              onClick={handlePaystackPayment}
              disabled={processingPaystack || !formData.training_program_id}
              className="px-12 py-4 bg-[#fab702] text-black font-bold text-lg rounded-lg hover:opacity-75 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {processingPaystack && <Loader className="w-5 h-5 animate-spin" />}
              {processingPaystack ? 'Processing Payment...' : 'Pay with Paystack'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentEnrollmentForm