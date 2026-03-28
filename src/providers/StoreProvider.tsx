'use client'

import { useEffect, useState, type ReactNode } from 'react'

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => setHydrated(true), [])

  if (!hydrated) return <>{children}</>

  return <>{children}</>
}
