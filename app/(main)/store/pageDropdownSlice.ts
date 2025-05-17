import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DropDownState {
  dropdown: boolean
}

const initialState: DropDownState = {
  dropdown: false,
}

const pageDropdownSlice = createSlice({
  name: 'pageDropdown',
  initialState,
  reducers: {
    toggleDropdown: (state) => {
      state.dropdown = !state.dropdown
    }
  },
})

export const { toggleDropdown } = pageDropdownSlice.actions

export default pageDropdownSlice.reducer
