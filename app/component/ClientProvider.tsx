'use client'
import { useEffect, useState } from "react"

 

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode,
}) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  if (!loading) {
    return (
      <div className="flex items-center justify-center mx-auto h-screen">
        Loading...
      </div>
    )
  }

  return (
      <>
        {children}
      </>
  )
}
