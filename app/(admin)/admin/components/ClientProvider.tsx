'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import { Provider } from 'react-redux'
import { store } from '../store'
import Header from './Header'
import MobileSidebar from './MobileSidebar'
import Footer from './Footer'

export default function ClientProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <Provider store={store}>
      <div className="bg-[#F2F2F2] w-full">
        <Sidebar />
        <MobileSidebar />
        <Header />
        {children}
        <Footer />
      </div>
    </Provider>
  )
}
