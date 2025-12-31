import { configureStore } from "@reduxjs/toolkit";
import menuBarReducer from './menubarSlice'
import pageDropdownReducer from './pageDropdownSlice'
import accountDropdownReducer from './accountDropdownSlice'
import serviceDropdownReducer from './serviceDropdownSlice'
import cartReducer from './cartSlice'

export const store = configureStore({
  reducer: {
    menubar: menuBarReducer,
    pageDropdown: pageDropdownReducer,
    accountDropdown: accountDropdownReducer,
    serviceDropdown: serviceDropdownReducer,
    cart: cartReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch