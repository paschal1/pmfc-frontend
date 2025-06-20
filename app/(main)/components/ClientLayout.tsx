'use client' 

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import { Provider } from 'react-redux'
import { store } from '../store'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const pathname = usePathname()

  const isAdminPage = pathname.startsWith('/admin')

  return (
    <>
      <Provider store={store}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </Provider>
    </>
  )
}
