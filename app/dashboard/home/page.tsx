'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardHomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar para /dashboard
    router.push('/dashboard')
  }, [router])

  return null
}
