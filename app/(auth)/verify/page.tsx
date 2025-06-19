'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error')
        return
      }

      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        if (!res.ok) {
          setStatus('error')
        } else {
          setStatus('success')
        }
      } catch {
        setStatus('error')
      }
    }

    verify()
  }, [token])

  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {status === 'verifying' && (
          <>
            <p className="text-xl animate-pulse">Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto" />
            <p className="text-xl font-bold">Email verified successfully!</p>
            <a href="/login" className="text-purple-400 hover:underline">
              Click here to login
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="text-red-500 w-16 h-16 mx-auto" />
            <p className="text-xl font-bold">Verification failed.</p>
            <p>Please check your email link or contact support.</p>
          </>
        )}
      </motion.div>
    </main>
  )
}
