// services/studentApi.service.ts

import apiClient from './api'
import axios from 'axios'

// Types
export interface StudentFormData {
  full_name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  contact_number: string
  email: string
  address: string
  date_of_birth: string
  emergency_contact: string
  previous_experience?: string
  joining_date: string
  current_skill_level: 'Beginner' | 'Intermediate' | 'Advanced'
  goals?: string
  id_proof?: File
  resume?: File
  training_program_id: number
  payment_method: 'Bank Transfer' | 'Paystack'
  payment_reference?: string
  payment_status: 'Pending' | 'Paid'
}

export interface Student {
  id: number
  full_name: string
  age: number
  gender: string
  contact_number: string
  email: string
  address: string
  date_of_birth: string
  emergency_contact: string
  previous_experience?: string
  joining_date: string
  program_duration: string
  current_skill_level: string
  goals?: string
  id_proof?: string
  resume?: string
  created_at: string
  updated_at: string
}

export interface TrainingProgram {
  id: number
  title: string
  description: string
  price: string | number
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: number
  student_id: number
  training_program_id: number
  enrollment_date: string
  payment_method: string
  payment_reference?: string
  payment_status: string
  trainingProgram?: TrainingProgram
  student?: Student
}

export interface EnrollmentResponse {
  message: string
  student: Student
  enrollment: Enrollment
}

// Get All Training Programs (Public)
export const getAllTrainingPrograms = async (): Promise<TrainingProgram[]> => {
  try {
    const response = await apiClient.get('/training-programs')
    return response.data.trainingPrograms || response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch training programs'
      )
    }
    throw new Error('Failed to fetch training programs')
  }
}

// Get Single Training Program (Public)
export const getTrainingProgram = async (id: number): Promise<TrainingProgram> => {
  try {
    const response = await apiClient.get(`/training-programs/${id}`)
    return response.data.trainingProgram || response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch training program'
      )
    }
    throw new Error('Failed to fetch training program')
  }
}

// Get All Students (Public)
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await apiClient.get('/students')
    return response.data.students || response.data.enrollment || response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch students'
      )
    }
    throw new Error('Failed to fetch students')
  }
}

// Get Single Student (Public)
export const getStudent = async (id: number): Promise<Student> => {
  try {
    const response = await apiClient.get(`/students/${id}`)
    return response.data.student || response.data.Enrollment || response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch student'
      )
    }
    throw new Error('Failed to fetch student')
  }
}

// Create Student Enrollment with Training Program and Payment (Public)
export const createStudentEnrollment = async (
  formData: StudentFormData
): Promise<EnrollmentResponse> => {
  try {
    const data = new FormData()
    
    // Append all required fields
    data.append('full_name', formData.full_name)
    data.append('age', formData.age.toString())
    data.append('gender', formData.gender)
    data.append('contact_number', formData.contact_number)
    data.append('email', formData.email)
    data.append('address', formData.address)
    data.append('date_of_birth', formData.date_of_birth)
    data.append('emergency_contact', formData.emergency_contact)
    data.append('joining_date', formData.joining_date)
    data.append('current_skill_level', formData.current_skill_level)
    data.append('training_program_id', formData.training_program_id.toString())
    data.append('payment_method', formData.payment_method)
    data.append('payment_status', formData.payment_status)
    
    // Payment reference (for Paystack)
    if (formData.payment_reference) {
      data.append('payment_reference', formData.payment_reference)
    }
    
    // Optional fields
    if (formData.previous_experience?.trim()) {
      data.append('previous_experience', formData.previous_experience)
    }
    if (formData.goals?.trim()) {
      data.append('goals', formData.goals)
    }
    
    // File uploads
    if (formData.id_proof) {
      data.append('id_proof', formData.id_proof)
      console.log('📎 ID Proof attached:', formData.id_proof.name)
    }
    if (formData.resume) {
      data.append('resume', formData.resume)
      console.log('📎 Resume attached:', formData.resume.name)
    }

    console.log('📤 Submitting enrollment with payment...')
    
    const response = await apiClient.post('/students', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('✅ Enrollment successful:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Enrollment error:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        const errorMessages = Object.values(errors)
          .flat()
          .join(', ')
        console.error('Validation errors:', errorMessages)
        throw new Error(`Validation error: ${errorMessages}`)
      }
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.response?.statusText ||
        'Failed to submit enrollment'
      
      console.error('API error message:', errorMessage)
      throw new Error(errorMessage)
    }
    
    throw new Error('Failed to submit enrollment')
  }
}

// Get All Enrollments (Admin)
export const getAllEnrollments = async (): Promise<Enrollment[]> => {
  try {
    const response = await apiClient.get('/enrollments')
    return response.data.enrollments || response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch enrollments'
      )
    }
    throw new Error('Failed to fetch enrollments')
  }
}

// Get Single Enrollment (Admin)
export const getEnrollment = async (id: number): Promise<Enrollment> => {
  try {
    const response = await apiClient.get(`/enrollments/${id}`)
    return response.data.enrollment || response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch enrollment'
      )
    }
    throw new Error('Failed to fetch enrollment')
  }
}

// Update Student (Admin only - requires auth)
export const updateStudent = async (
  id: number,
  formData: Partial<StudentFormData>
): Promise<Student> => {
  try {
    const data = new FormData()
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          data.append(key, value)
        } else if (typeof value === 'string' && value.trim()) {
          data.append(key, value)
        } else if (typeof value === 'number') {
          data.append(key, value.toString())
        }
      }
    })

    const response = await apiClient.post(`/students/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        _method: 'PUT'
      }
    })

    return response.data.student || response.data.data || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to update student'
      )
    }
    throw new Error('Failed to update student')
  }
}

// Delete Student (Admin only - requires auth)
export const deleteStudent = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/students/${id}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to delete student'
      )
    }
    throw new Error('Failed to delete student')
  }
}

// Delete Enrollment (Admin only - requires auth)
export const deleteEnrollment = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/enrollments/${id}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to delete enrollment'
      )
    }
    throw new Error('Failed to delete enrollment')
  }
}