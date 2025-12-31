// services/projectsApi.service.ts

import apiClient from './api'
import axios from 'axios'

// Types
export interface Project {
  id: number
  title: string
  description: string
  image: string | null
  slug: string
  status: 'ongoing' | 'completed'
  type: 'residential' | 'hospitality' | 'office' | 'commercial'
  created_at: string
  updated_at: string
}

export interface PaginatedProjects {
  current_page: number
  data: Project[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export type ProjectType = 'all' | 'residential' | 'hospitality' | 'office' | 'commercial'

export interface GetProjectsParams {
  type?: ProjectType
  per_page?: number
  page?: number
}

// Get All Projects with Filtering and Pagination
export const getProjects = async (params?: GetProjectsParams): Promise<PaginatedProjects> => {
  try {
    const response = await apiClient.get('/projects', {
      params: {
        type: params?.type && params.type !== 'all' ? params.type : undefined,
        per_page: params?.per_page || 9,
        page: params?.page || 1,
      },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch projects'
      )
    }
    throw new Error('Failed to fetch projects')
  }
}

// Get Single Project
export const getProject = async (id: number): Promise<Project> => {
  try {
    const response = await apiClient.get(`/projects/${id}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch project'
      )
    }
    throw new Error('Failed to fetch project')
  }
}

// Create Project (Admin only - requires auth)
export const createProject = async (formData: FormData): Promise<Project> => {
  try {
    const response = await apiClient.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.project || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle validation errors
      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        const errorMessages = Object.values(errors).flat().join(', ')
        throw new Error(errorMessages)
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to create project'
      )
    }
    throw new Error('Failed to create project')
  }
}

// Update Project (Admin only - requires auth)
export const updateProject = async (id: number, formData: FormData): Promise<Project> => {
  try {
    const response = await apiClient.post(`/projects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        _method: 'PUT' // Laravel method spoofing
      }
    })
    return response.data.project || response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to update project'
      )
    }
    throw new Error('Failed to update project')
  }
}

// Delete Project (Admin only - requires auth)
export const deleteProject = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/projects/${id}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to delete project'
      )
    }
    throw new Error('Failed to delete project')
  }
}

// Helper function to convert Project to ProjectDataStructure
export const convertToProjectData = (project: Project) => ({
  id: project.id,
  section: project.type,
  image: project.image || '/placeholder.jpg',
  title: project.title,
  description: project.description,
  status: project.status,
  slug: project.slug,
})