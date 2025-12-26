'use client'

import { ReactNode, useState } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileSidebar from './MobileSidebar'
import Footer from './Footer'

type SidebarState = 'open' | 'collapsed' | 'hidden'

export default function ClientProvider({ children }: { children: ReactNode }) {
  const [sidebarState, setSidebarState] = useState<SidebarState>('open')

  const getMainMargin = (): string => {
    switch (sidebarState) {
      case 'hidden':
        return 'xl:ml-0'
      case 'collapsed':
        return 'xl:ml-24'          // 80px sidebar + 16px gap
      case 'open':
        return 'xl:ml-[320px]'     // matches sidebar width + spacing
      default:
        return 'xl:ml-[320px]'
    }
  }

  return (
    <Provider store={store}>
      <div className="bg-[#F2F2F2] min-h-screen">
        <Sidebar sidebarState={sidebarState} setSidebarState={setSidebarState} />
        <MobileSidebar />

        <div className={`transition-all duration-300 ease-in-out ${getMainMargin()} pt-20`}>
          <Header />
          <main className="px-4 pb-10">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </Provider>
  )
}