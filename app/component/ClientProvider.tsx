// 'use client'
// import { useEffect, useState } from "react"

 

// export default function ClientProvider({
//   children,
// }: {
//   children: React.ReactNode,
// }) {
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     setLoading(true)
//   }, [])

//   if (!loading) {
//     return (
//       <div className="flex items-center justify-center mx-auto h-screen">
//         Loading...
//       </div>
//     )
//   }

//   return (
//       <>
//         {children}
//       </>
//   )
// }
'use client'

import { useEffect, useState, ReactNode } from 'react'

export default function ClientProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center mx-auto h-screen">
        Loading...
      </div>
    )
  }

  return <>{children}</>
}
