'use client'

import React, { useState } from 'react'
import { MdVerified } from 'react-icons/md'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { createStudentEnrollment, type StudentFormData } from '../../services/studentApi.service'

const StudentEnrollmentForm = () => {
  // Form state
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
  })

  // File state
  const [idProof, setIdProof] = useState<File | null>(null)
  const [resume, setResume] = useState<File | null>(null)
  const [idProofError, setIdProofError] = useState<string | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)

  // UI state
  const [loading, setLoading] = useState(false)

  // Generate options for date selectors
  const generateOptions = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const days = generateOptions(1, 31)
  const months = generateOptions(1, 12)
  const years = generateOptions(1900, new Date().getFullYear())

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle ID proof file upload
  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      const maxSize = 2 * 1024 * 1024 // 2MB

      if (!validTypes.includes(selectedFile.type)) {
        const error = 'Please upload JPG, PNG, or PDF file'
        setIdProofError(error)
        toast.error(error)
        setIdProof(null)
        return
      }

      if (selectedFile.size > maxSize) {
        const error = 'File size must be less than 2MB'
        setIdProofError(error)
        toast.error(error)
        setIdProof(null)
        return
      }

      setIdProof(selectedFile)
      setIdProofError(null)
      toast.success(`ID proof uploaded: ${selectedFile.name}`)
    }
  }

  // Handle resume file upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      const maxSize = 2 * 1024 * 1024 // 2MB

      if (!validTypes.includes(selectedFile.type)) {
        const error = 'Please upload PDF or DOC file'
        setResumeError(error)
        toast.error(error)
        setResume(null)
        return
      }

      if (selectedFile.size > maxSize) {
        const error = 'File size must be less than 2MB'
        setResumeError(error)
        toast.error(error)
        setResume(null)
        return
      }

      setResume(selectedFile)
      setResumeError(null)
      toast.success(`Resume uploaded: ${selectedFile.name}`)
    }
  }

  // Validate form
  const validateForm = (): string | null => {
    if (!formData.full_name?.trim()) {
      toast.error('Full name is required')
      return 'Full name is required'
    }
    if (!formData.age || parseInt(formData.age) < 18) {
      toast.error('Age must be 18 or above')
      return 'Age must be 18 or above'
    }
    if (!formData.gender) {
      toast.error('Please select gender')
      return 'Please select gender'
    }
    if (!formData.contact_number?.trim()) {
      toast.error('Contact number is required')
      return 'Contact number is required'
    }
    if (!formData.email?.trim()) {
      toast.error('Email is required')
      return 'Email is required'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Invalid email format')
      return 'Invalid email format'
    }
    if (!formData.address?.trim()) {
      toast.error('Address is required')
      return 'Address is required'
    }
    if (!formData.emergency_contact?.trim()) {
      toast.error('Emergency contact is required')
      return 'Emergency contact is required'
    }
    if (!formData.current_skill_level) {
      toast.error('Please select current skill level')
      return 'Please select current skill level'
    }
    return null
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    if (validateForm()) {
      return
    }

    setLoading(true)
    const submitToast = toast.loading('Submitting your enrollment...')

    try {
      // Format date of birth
      const date_of_birth = `${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`

      // Prepare submission data
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
      }

      // Call API
      const response = await createStudentEnrollment(submissionData)

      toast.success('Enrollment submitted successfully! We will contact you soon.', {
        id: submitToast,
        duration: 4000,
      })

      // Reset form after 2 seconds
      setTimeout(() => {
        resetForm()
      }, 2000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit enrollment'
      toast.error(errorMsg, { id: submitToast })
      console.error('Enrollment error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Reset form
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
    })
    setIdProof(null)
    setResume(null)
    setIdProofError(null)
    setResumeError(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="h-[230px] w-full relative bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex items-center h-full px-4 lg:px-20">
          <h1 className="font-bold text-2xl lg:text-3xl text-white">
            Furniture Trainee Registration
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Trainee Details */}
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
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none transition-colors"
                  required
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
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none transition-colors"
                  required
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
                        required
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
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none transition-colors"
                  required
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
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none transition-colors"
                  required
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
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none transition-colors"
                  required
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
                      <option key={day} value={day} className="bg-black text-white">
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
                      <option key={month} value={month} className="bg-black text-white">
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
                      <option key={year} value={year} className="bg-black text-white">
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
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none transition-colors"
                  required
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
                  rows={4}
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="joining_date" className="block text-sm font-medium">
                  Preferred Joining Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="joining_date"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none transition-colors text-white"
                  required
                />
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-white">Program Duration:</span> 1 Year (Fixed)
                </p>
              </div>
            </div>

            {/* Right Column - Skills Assessment */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold uppercase text-[#fab702] mb-6">
                Skills Assessment
              </h2>

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
                        required
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#fab702]/10 to-transparent border border-[#fab702]/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#fab702] mb-4">
                  What You'll Learn
                </h3>
                <div className="space-y-3">
                  {['Carpentry', 'Upholstery', 'Wood Working', 'Furniture Design'].map((skill) => (
                    <div key={skill} className="flex items-center gap-3">
                      <MdVerified className="text-[#fab702] w-5 h-5 flex-shrink-0" />
                      <span className="text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="goals" className="block text-sm font-medium">
                  Goals for the Training (Optional)
                </label>
                <textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  placeholder="What do you hope to achieve from this training?"
                  rows={4}
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-3 focus:border-[#fab702] focus:outline-none transition-colors resize-none"
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
                {idProofError && <p className="text-red-400 text-sm">{idProofError}</p>}
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
                {resumeError && <p className="text-red-400 text-sm">{resumeError}</p>}
                {resume && <p className="text-green-400 text-sm">✓ {resume.name}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-12 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-4 bg-[#fab702] text-black font-bold text-lg rounded-lg hover:opacity-75 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading && <Loader className="w-5 h-5 animate-spin" />}
              {loading ? 'Submitting...' : 'Submit Enrollment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentEnrollmentForm