'use client'

import { useState } from 'react'
import { Parallax } from 'react-parallax'
import { Loader, CheckCircle, AlertCircle, X } from 'lucide-react'
import trainingImg from '../../../public/training-img.jpg'
import apiClient from '../../services/api'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

interface ApiResponse {
  message: string
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }
    if (!formData.phone.trim()) {
      setError('Phone is required')
      return
    }
    if (!formData.message.trim()) {
      setError('Message is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.post<ApiResponse>('/contacts', formData)

      if (response.status === 201) {
        setSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        })

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitted(false)
        }, 5000)
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to submit form. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col bg-black min-h-screen">
      {/* Desktop Hero Section */}
      <Parallax
        strength={300}
        className="h-[230px] w-full bg-cover bg-center lg:flex hidden items-center"
        bgImage={trainingImg.src}
      >
        <h1 className="uppercase font-thin text-4xl text-white ml-20">
          Contact
        </h1>
      </Parallax>

      {/* Mobile Hero */}
      <div className="h-[230px] w-full lg:hidden block relative">
        <img
          src={trainingImg.src}
          alt="Contact banner"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          Contact
        </h1>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="bg-green-900/20 border border-green-700 text-green-400 p-4 m-6 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Success!</p>
            <p className="text-sm">Your message has been sent successfully. We&rsquo;ll get back to you soon!</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 text-red-400 border border-red-700 p-4 m-6 rounded-lg flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row mx-auto mt-20 gap-16 px-4 lg:px-20 pb-20 max-w-7xl w-full">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="flex lg:flex-row flex-col gap-8">
            {/* Left Column - Input Fields */}
            <div className="flex flex-col gap-4 flex-1">
              <h1 className="text-white uppercase text-2xl font-semibold">
                Send Us Message
              </h1>

              <input
                type="text"
                name="name"
                title="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-inherit border border-[#FFFFFF33] px-4 py-3 w-full focus:border-[#fab702] focus:outline-none text-white placeholder:text-gray-500 placeholder:text-base h-[55px] transition-colors duration-300"
              />

              <input
                type="email"
                name="email"
                title="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-inherit border border-[#FFFFFF33] px-4 py-3 w-full focus:border-[#fab702] focus:outline-none text-white placeholder:text-gray-500 placeholder:text-base h-[55px] transition-colors duration-300"
              />

              <input
                type="tel"
                name="phone"
                title="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-inherit border border-[#FFFFFF33] px-4 py-3 w-full focus:border-[#fab702] focus:outline-none text-white placeholder:text-gray-500 placeholder:text-base h-[55px] transition-colors duration-300"
              />

              {/* Submit Button - Desktop */}
              <button
                type="submit"
                disabled={loading}
                className="lg:block hidden border border-[#FFFFFF33] bg-inherit hover:bg-[#fab702] hover:text-black hover:border-[#fab702] w-full text-white p-3 text-sm font-semibold transition-all duration-300 ease-in-out mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Form'
                )}
              </button>
            </div>

            {/* Message Textarea */}
            <textarea
              name="message"
              title="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleInputChange}
              className="bg-inherit border border-[#FFFFFF33] px-4 py-3 w-full lg:w-[300px] focus:border-[#fab702] focus:outline-none align-top placeholder:text-gray-500 placeholder:text-base lg:h-[210px] h-[150px] text-white lg:mt-[3rem] transition-colors duration-300 resize-none"
            />

            {/* Submit Button - Mobile */}
            <button
              type="submit"
              disabled={loading}
              className="lg:hidden block border border-[#FFFFFF33] bg-inherit hover:bg-[#fab702] hover:text-black hover:border-[#fab702] w-full text-white p-3 text-sm font-semibold transition-all duration-300 ease-in-out mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Form'
              )}
            </button>
          </div>
        </form>

        {/* Contact Info Section */}
        <div className="flex flex-col gap-6 w-full sm:w-[503px] md:w-[720px] lg:w-[300px] lg:mt-0">
          <h1 className="uppercase text-white text-2xl font-semibold">
            Contact Us
          </h1>

          <div className="text-base flex flex-col gap-6">
            {/* Address */}
            <div className="flex items-start gap-3">
              <p className="text-[#fab702] font-semibold whitespace-nowrap mt-1">
                Address:
              </p>
              <p className="text-white border-b border-b-[#FFFFFF33] pb-2 flex-1">
                5 Decking Ifite, Anambra State, Nigeria
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <p className="text-[#fab702] font-semibold whitespace-nowrap">
                Phone:
              </p>
              <a
                href="tel:08073161010"
                className="text-white border-b border-b-[#FFFFFF33] pb-2 hover:text-[#fab702] transition-colors duration-300 cursor-pointer"
              >
                08073161010
              </a>
            </div>

            {/* Fax */}
            <div className="flex items-center gap-3">
              <p className="text-[#fab702] font-semibold whitespace-nowrap">
                Fax:
              </p>
              <p className="text-white border-b border-b-[#FFFFFF33] pb-2">
                08073161010
              </p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <p className="text-[#fab702] font-semibold whitespace-nowrap">
                Email:
              </p>
              <a
                href="mailto:princemfurnishingconcept@gmail.com"
                className="text-white border-b border-b-[#FFFFFF33] pb-2 hover:text-[#fab702] transition-colors duration-300 cursor-pointer text-sm break-all"
              >
                princemfurnishingconcept@gmail.com
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-[#fab702]/10 border border-[#fab702]/30 rounded-lg p-4 mt-6">
            <p className="text-gray-400 text-sm">
              We typically respond to inquiries within 24 hours. Thank you for contacting us!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage