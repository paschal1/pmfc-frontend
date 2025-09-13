// app/admin/layout.tsx
import { ReactNode } from 'react'

export const metadata = {
  title: 'Admin | PMFC Furniture',
  description: 'Admin panel for managing PMFC Furniture backend',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  )
}
