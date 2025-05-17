import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MobileSidebarState {
  mobileSidebar: boolean
}

const initialState: MobileSidebarState = {
  mobileSidebar: false
}

const mobileSidebarSlice = createSlice({
  name: 'mobileSidebar',
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.mobileSidebar = true
    },
    closeSidebar: (state) => {
      state.mobileSidebar = false
    }
  }
})

export const { openSidebar, closeSidebar } = mobileSidebarSlice.actions
export default mobileSidebarSlice.reducer