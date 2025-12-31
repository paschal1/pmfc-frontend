'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Loader, AlertCircle, ArrowLeft, Mail, Phone, MessageCircle, Clock, CheckCircle } from 'lucide-react'
import * as contactApi from '../../../../services/contactApi.service'

type ContactData = {
  id: number
  name: string
  email: string
  phone: string
  message: string
  status: 'pending' | 'reviewed' | 'responded'
  created_at: string
  updated_at: string
}

const AdminContactDetail = () => {
  const params = useParams()
  const contactId = params.id as string

  const [contact, setContact] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('📧 Fetching contact with ID:', contactId)

        const response = await contactApi.getContact(parseInt(contactId))
        const data = response.data || response
        
        console.log('✅ Contact loaded:', data)
        setContact(data)
      } catch (err: any) {
        console.error('❌ Error fetching contact:', err)
        const message = err instanceof Error ? err.message : 'Failed to fetch contact'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    if (contactId) {
      fetchContact()
    }
  }, [contactId])

  const handleStatusChange = async (newStatus: string) => {
    if (!contact) return

    try {
      setUpdatingStatus(true)
      console.log('🔄 Updating status to:', newStatus)

      await contactApi.updateContactStatus(contact.id, newStatus)
      setContact({ ...contact, status: newStatus as any })
      
      console.log('✅ Status updated')
      setSuccessMessage(`Status updated to ${newStatus}`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error('❌ Error updating status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contact || !replyMessage.trim()) {
      setError('Please enter a reply message')
      return
    }

    try {
      setSendingReply(true)
      setError(null)
      console.log('📧 Sending reply...')
      
      // Send reply via API
      const response = await contactApi.sendContactReply(contact.id, replyMessage)
      
      // Update contact status
      setContact({ ...contact, status: 'responded' })
      setReplyMessage('')
      
      console.log('✅ Reply sent successfully')
      setSuccessMessage(`Reply sent successfully to ${contact.email}! Contact marked as responded.`)
      
      // Auto-hide success message
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: any) {
      console.error('❌ Error sending reply:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to send reply'
      setError(errorMsg)
    } finally {
      setSendingReply(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border border-blue-300'
      case 'responded':
        return 'bg-green-100 text-green-800 border border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-[#fab702] mx-auto mb-4" />
            <p className="text-gray-600">Loading contact details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !contact) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin/contacts" className="flex items-center gap-2 text-[#fab702] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Contacts
        </Link>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-red-700">{error || 'Contact not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link href="/admin/contacts" className="flex items-center gap-2 text-[#fab702] hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Contacts
      </Link>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800">Success</p>
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Contact Details</h1>
          <span
            className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(
              contact.status
            )}`}
          >
            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Name</p>
            <p className="text-xl font-semibold text-gray-800">{contact.name}</p>
          </div>

          {/* Email */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Email</p>
            <a
              href={`mailto:${contact.email}`}
              className="text-[#fab702] hover:underline flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {contact.email}
            </a>
          </div>

          {/* Phone */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Phone</p>
            <a
              href={`tel:${contact.phone}`}
              className="text-gray-800 hover:text-[#fab702] flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {contact.phone}
            </a>
          </div>

          {/* Submitted Date */}
          <div>
            <p className="text-gray-600 text-sm mb-1">Submitted</p>
            <div className="flex items-center gap-2 text-gray-800">
              <Clock className="w-4 h-4" />
              {formatDate(contact.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Message Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Message
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
        </div>
      </div>

      {/* Status Management Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Update Status</h2>
        <div className="flex flex-wrap gap-3">
          {['pending', 'reviewed', 'responded'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={updatingStatus || contact.status === status}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                contact.status === status
                  ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 hover:bg-[#fab702] hover:text-black'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reply Form - Only show if not responded */}
      {contact.status !== 'responded' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Reply
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Your reply will be sent to <strong>{contact.email}</strong> and a copy will be saved for admin records.
          </p>
          
          <form onSubmit={handleSendReply}>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply message here... (This will be sent to the contact's email)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] mb-4 resize-none h-32"
            />
            <button
              type="submit"
              disabled={sendingReply || !replyMessage.trim()}
              className="bg-[#fab702] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sendingReply && <Loader className="w-4 h-4 animate-spin" />}
              {sendingReply ? 'Sending Reply...' : 'Send Reply & Mark as Responded'}
            </button>
          </form>
        </div>
      )}

      {/* Already Responded Message */}
      {contact.status === 'responded' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800">Already Responded</p>
            <p className="text-green-700 text-sm">A reply has already been sent to this contact.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContactDetail