// utils/formUtils.ts

/**
 * Convert form data strings to proper types
 */
export const convertQuoteFormData = (formData: {
  email: string
  name: string
  phone: string
  message: string
  areasize: string
  squarefeet: string
  state_id: string
  location: string
  budget: string
  services: number[]
}) => {
  return {
    email: formData.email.trim(),
    name: formData.name.trim(),
    phone: formData.phone.trim(),
    message: formData.message.trim(),
    areasize: parseFloat(formData.areasize),
    squarefeet: parseFloat(formData.squarefeet),
    state_id: parseInt(formData.state_id),
    location: formData.location.trim(),
    budget: formData.budget,
    services: formData.services,
  }
}

/**
 * Validate converted form data
 */
export const validateQuoteFormData = (data: {
  email: string
  name: string
  phone: string
  message: string
  areasize: number
  squarefeet: number
  state_id: number
  location: string
  budget: string
  services: number[]
}) => {
  const errors: Record<string, string> = {}

  if (!data.email || !data.email.includes('@')) {
    errors.email = 'Valid email is required'
  }

  if (!data.name || data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (!data.phone || data.phone.length < 10) {
    errors.phone = 'Valid phone number is required'
  }

  if (!data.areasize || isNaN(data.areasize) || data.areasize <= 0) {
    errors.areasize = 'Area size must be a positive number'
  }

  if (!data.squarefeet || isNaN(data.squarefeet) || data.squarefeet <= 0) {
    errors.squarefeet = 'Square feet must be a positive number'
  }

  if (!data.state_id || isNaN(data.state_id) || data.state_id <= 0) {
    errors.state_id = 'Please select a valid state'
  }

  if (!data.location || data.location.length < 3) {
    errors.location = 'Location must be at least 3 characters'
  }

  if (!data.budget) {
    errors.budget = 'Please select a budget range'
  }

  if (!data.services || data.services.length === 0) {
    errors.services = 'Please select at least one service'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export default {
  convertQuoteFormData,
  validateQuoteFormData,
}