import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './sidebarSlice'
import mobileSidebarReducer from './mobileSidebarSlice'

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    mobileSidebar: mobileSidebarReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch