import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DropDownState {
  dropdown: boolean
}

const initialState: DropDownState = {
  dropdown: false,
}

const accountDropdownSlice = createSlice({
  name: 'accountDropdown',
  initialState,
  reducers: {
    toggleAccountDropdown: (state) => {
      state.dropdown = !state.dropdown
    },
  },
})

export const {toggleAccountDropdown} = accountDropdownSlice.actions

export default accountDropdownSlice.reducer