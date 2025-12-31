// services/contactApi.service.ts

import apiClient from './api'
import axios from 'axios'

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export interface ContactResponse {
  message: string
  id?: number
}

/**
 * Submit a contact form message (Public - no auth required)
 */
export const submitContact = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const response = await apiClient.post<ContactResponse>('/contacts', data)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.data?.error
      throw new Error(message || 'Failed to submit contact form')
    }
    throw new Error('Failed to submit contact form')
  }
}

/**
 * Get all contact messages (Admin only - requires auth)
 */
export const getContacts = async (page: number = 1) => {
  try {
    const response = await apiClient.get(`/contacts?page=${page}`)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Not authenticated. Please login.')
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch contacts')
    }
    throw new Error('Failed to fetch contacts')
  }
}

/**
 * Get a single contact message (Admin only - requires auth)
 * Handles both response formats:
 * - { data: { id: 1, ... } }
 * - { id: 1, ... }
 */
export const getContact = async (id: number) => {
  try {
    console.log(`📧 Fetching contact with ID: ${id}`)
    
    const response = await apiClient.get(`/contacts/${id}`)
    
    console.log('✅ API Response:', response.data)
    
    // Handle both response formats
    let contactData = response.data.data || response.data
    
    if (!contactData || !contactData.id) {
      throw new Error(`Contact data is invalid for ID: ${id}`)
    }
    
    console.log('✅ Contact loaded:', contactData)
    
    return {
      data: contactData,
      status: response.status
    }
  } catch (error: any) {
    console.error('❌ Error fetching contact:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Not authenticated. Please login.')
      }
      if (error.response?.status === 404) {
        throw new Error(`Contact with ID ${id} not found`)
      }
      const errorMsg = error.response?.data?.message || 'Failed to fetch contact'
      throw new Error(errorMsg)
    }
    throw new Error('Failed to fetch contact')
  }
}

/**
 * Mark a contact as reviewed (Admin only - requires auth)
 */
export const markContactAsReviewed = async (id: number) => {
  try {
    const response = await apiClient.put(`/contacts/${id}`, { status: 'reviewed' })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Not authenticated. Please login.')
      }
      throw new Error(error.response?.data?.message || 'Failed to update contact')
    }
    throw new Error('Failed to update contact')
  }
}

/**
 * Update contact status (Admin only - requires auth)
 * Status can be: 'pending', 'reviewed', 'responded'
 */
export const updateContactStatus = async (id: number, status: string) => {
  try {
    console.log(`🔄 Updating contact ${id} status to: ${status}`)
    
    const response = await apiClient.put(`/contacts/${id}`, { status })
    
    console.log('✅ Status updated:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error updating status:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Not authenticated. Please login.')
      }
      const errorMsg = error.response?.data?.message || 'Failed to update contact status'
      throw new Error(errorMsg)
    }
    throw new Error('Failed to update contact status')
  }
}

/**
 * Send a reply to a contact message (Admin only - requires auth)
 * Sends email to user and copy to admin
 * Automatically marks contact as 'responded'
 */
export const sendContactReply = async (id: number, replyMessage: string) => {
  try {
    console.log(`📧 Sending reply to contact ${id}...`)
    
    const response = await apiClient.post(`/contacts/${id}/reply`, {
      reply_message: replyMessage
    })
    
    console.log('✅ Reply sent successfully:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error sending reply:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Not authenticated. Please login.')
      }
      if (error.response?.status === 404) {
        throw new Error(`Contact with ID ${id} not found`)
      }
      const errorMsg = error.response?.data?.message || 'Failed to send reply'
      throw new Error(errorMsg)
    }
    throw new Error('Failed to send reply')
  }
}

/**
 * Delete a contact (Admin only - requires auth)
 */
export const deleteContact = async (id: number) => {
  try {
    console.log(`🗑️ Deleting contact ${id}`)
    
    const response = await apiClient.delete(`/contacts/${id}`)
    
    console.log('✅ Contact deleted')
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error deleting contact:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Not authenticated. Please login.')
      }
      if (error.response?.status === 404) {
        throw new Error(`Contact with ID ${id} not found`)
      }
      const errorMsg = error.response?.data?.message || 'Failed to delete contact'
      throw new Error(errorMsg)
    }
    throw new Error('Failed to delete contact')
  }
}

/**
 * Get pending messages count (Admin only - requires auth)
 */
export const getPendingCount = async () => {
  try {
    console.log('🔄 Fetching pending count...')
    
    const response = await apiClient.get('/contacts/pending-count')
    
    console.log('✅ Pending count response:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching pending count:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Not authenticated. Please login.')
      }
      const errorMsg = error.response?.data?.message || 'Failed to fetch pending count'
      throw new Error(errorMsg)
    }
    throw new Error('Failed to fetch pending count')
  }
}

/**
 * Get contact statistics (Admin only - requires auth)
 */
export const getContactStats = async () => {
  try {
    console.log('📊 Fetching contact statistics...')
    
    const response = await apiClient.get('/contacts/stats')
    
    console.log('✅ Statistics loaded:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching statistics:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Not authenticated. Please login.')
      }
      const errorMsg = error.response?.data?.message || 'Failed to fetch statistics'
      throw new Error(errorMsg)
    }
    throw new Error('Failed to fetch statistics')
  }
}

export default {
  submitContact,
  getContacts,
  getContact,
  markContactAsReviewed,
  updateContactStatus,
  sendContactReply,
  deleteContact,
  getPendingCount,
  getContactStats,
}