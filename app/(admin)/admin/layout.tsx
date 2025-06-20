import { ReactNode } from 'react'
import type { Metadata } from 'next'
import '../../globals.css'
import ClientProvider from './components/ClientProvider'

export const metadata: Metadata = {
  title: 'PMFC Furniture | Admin',
  description: 'The admin panel for managing furniture backend',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClientProvider>
      <main>{children}</main>
    </ClientProvider>
  )
}
