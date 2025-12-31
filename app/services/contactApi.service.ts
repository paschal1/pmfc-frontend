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
 * Submit a contact form message
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
 * Get all contact messages (Admin only)
 */
export const getContacts = async (page: number = 1) => {
  try {
    const response = await apiClient.get(`/contacts?page=${page}`)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch contacts')
    }
    throw new Error('Failed to fetch contacts')
  }
}

/**
 * Get a single contact message (Admin only)
 */
export const getContact = async (id: number) => {
  try {
    const response = await apiClient.get(`/contacts/${id}`)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Contact not found')
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch contact')
    }
    throw new Error('Failed to fetch contact')
  }
}

/**
 * Mark a contact as reviewed (Admin only)
 */
export const markContactAsReviewed = async (id: number) => {
  try {
    const response = await apiClient.put(`/contacts/${id}`, { status: 'reviewed' })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update contact')
    }
    throw new Error('Failed to update contact')
  }
}

export default {
  submitContact,
  getContacts,
  getContact,
  markContactAsReviewed,
}