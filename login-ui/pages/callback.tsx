'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { authAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')

      if (!code) {
        setStatus('error')
        setMessage('No authorization code received')
        return
      }

      try {
        const response = await authAPI.callback(code, state || undefined)

        if (response.accessToken) {
          localStorage.setItem('aais_token', response.accessToken)
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')

          // Redirect to dashboard or the intended destination
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 1500)
        } else {
          setStatus('error')
          setMessage('Failed to retrieve access token')
        }
      } catch (error: any) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Authentication failed')
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-900" />
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Authenticating
              </h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Success!
              </h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Authentication Failed
              </h2>
              <p className="text-gray-600">{message}</p>
              <button
                onClick={() => router.push('/login')}
                className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>

        <motion.p
          className="mt-8 text-center text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Secured by Aryanstack Authentication and Identification System
        </motion.p>
      </motion.div>
    </div>
  )
}
