import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SidebarState {
  // sections: Record<string, boolean>
  products: boolean
  category: boolean
  training: boolean
  order: boolean
  training_program: boolean
  enrollment: boolean
  testimonial: boolean
  quotation: boolean
  services: boolean
  projects: boolean
}

const initialState: SidebarState = {
  products: false,
  category: false,
  training: false,
  order: false,
  training_program: false,
  enrollment: false,
  testimonial: false,
  quotation: false,
  services: false,
  projects: false,
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleProducts: (state) => {
      state.products = !state.products
      if (state.products) {
        state.category = false
        state.training = false
        state.order = false
        state.training_program = false
        state.enrollment = false
        state.testimonial = false
        state.quotation = false
        state.services = false
        state.projects = false
      }
    },
    toggleCategory: (state) => {
      state.category = !state.category
      if (state.category) {
        state.products = false
        state.training = false
        state.order = false
        state.training_program = false
        state.enrollment = false
        state.testimonial = false
        state.quotation = false
        state.services = false
        state.projects = false
      }
    },
    toggleTraining: (state) => {
      state.training = !state.training
      if (state.training) {
        state.category = false
        state.products = false
        state.order = false
        state.training_program = false
        state.enrollment = false
        state.testimonial = false
        state.quotation = false
        state.services = false
        state.projects = false
      }
    },
    toggleOrder: (state) => {
      state.order = !state.order
      if (state.order) {
        state.category = false
        state.products = false
        state.training = false
        state.training_program = false
        state.enrollment = false
        state.testimonial = false
        state.quotation = false
        state.services = false
        state.projects = false
      }
    },
    toggleTrainingProgram: (state) => {
      state.training_program = !state.training_program
      if (state.training_program) {
        state.category = false
        state.products = false
        state.training = false
        state.order = false
        state.enrollment = false
        state.testimonial = false
        state.quotation = false
        state.services = false
        state.projects = false
      }
    },
    toggleEnrollment: (state) => {
      state.enrollment = !state.enrollment
      if (state.enrollment) {
        state.category = false
        state.products = false
        state.training = false
        state.order = false
        state.training_program = false
        state.testimonial = false
        state.quotation = false
        state.services = false
        state.projects = false
      }
    },
    toggleTestimonial: (state) => {
      state.testimonial = !state.testimonial
      if (state.testimonial) {
        state.category = false
        state.products = false
        state.training = false
        state.order = false
        state.training_program = false
        state.enrollment = false
        state.quotation = false
        state.services = false
        state.projects = false
      }
    },
    toggleQuotation: (state) => {
      state.quotation = !state.quotation
      if (state.quotation) {
        state.category = false
        state.products = false
        state.training = false
        state.order = false
        state.training_program = false
        state.enrollment = false
        state.testimonial = false
        state.services = false
        state.projects = false
      }
    },
    toggleServices: (state) => {
      state.services = !state.services
      if (state.services) {
        state.category = false
        state.products = false
        state.training = false
        state.order = false
        state.training_program = false
        state.enrollment = false
        state.testimonial = false
        state.quotation = false
        state.projects = false
      }
    },
    toggleProjects: (state) => {
      state.projects = !state.projects
      if (state.projects) {
        state.category = false
        state.products = false
        state.training = false
        state.order = false
        state.training_program = false
        state.enrollment = false
        state.testimonial = false
        state.quotation = false
        state.services = false
      }
    },
  },
})

export const closeAllSections = () => (dispatch: any) => {
  dispatch({ type: 'sidebar/setProducts', payload: false })
  dispatch({ type: 'sidebar/setCategory', payload: false })
  dispatch({ type: 'sidebar/setTraining', payload: false })
  dispatch({ type: 'sidebar/setOrder', payload: false })
  dispatch({ type: 'sidebar/setTrainingProgram', payload: false })
  dispatch({ type: 'sidebar/setEnrollment', payload: false })
  dispatch({ type: 'sidebar/setTestimonial', payload: false })
  dispatch({ type: 'sidebar/setQuotation', payload: false })
  dispatch({ type: 'sidebar/setServices', payload: false })
  dispatch({ type: 'sidebar/setProjects', payload: false })
}

export const {
  toggleProducts,
  toggleCategory,
  toggleTraining,
  toggleOrder,
  toggleTrainingProgram,
  toggleEnrollment,
  toggleTestimonial,
  toggleQuotation,
  toggleServices,
  toggleProjects,
} = sidebarSlice.actions
export default sidebarSlice.reducer
