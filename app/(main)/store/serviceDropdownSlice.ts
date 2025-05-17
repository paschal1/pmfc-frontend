import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DropDownState {
  dropdown: boolean
}

const initialState: DropDownState = {
  dropdown: false,
}

const serviceDropdownSlice = createSlice({
  name: 'serviceDropdown',
  initialState,
  reducers: {
    serviceToggleDropdown: (state) => {
      state.dropdown = !state.dropdown
    },
  },
})

export const { serviceToggleDropdown } = serviceDropdownSlice.actions

export default serviceDropdownSlice.reducer
