'use client'

import { useEffect } from 'next/navigation'

export default function HomePage() {
  useEffect(() => {
    window.location.href = '/login'
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-600">Redirecting to login...</p>
    </div>
  )
}
