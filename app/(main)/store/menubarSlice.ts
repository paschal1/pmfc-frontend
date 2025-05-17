import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MenubarState {
  menubarOpen: boolean
}

const initialState: MenubarState = {
  menubarOpen: false,
}

const menubarSlice = createSlice({
  name: 'menubar',
  initialState,
  reducers: {
    toggleSwitch: (state) => {
      state.menubarOpen = !state.menubarOpen
    },
    closeMenu: (state) => {
      state.menubarOpen = false
    }
  },
})

export const {toggleSwitch, closeMenu} = menubarSlice.actions

export default menubarSlice.reducer