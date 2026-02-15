'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {children}
    </>
  )
}
