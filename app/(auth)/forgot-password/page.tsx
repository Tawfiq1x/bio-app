'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        setErrorMsg(data?.message || 'Something went wrong')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch (err) {
      setErrorMsg('Failed to send reset email.')
      setStatus('error')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-black px-4 text-white">
      <motion.div
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center">Forgot Password</h1>

        {status === 'success' ? (
          <div className="text-green-500 text-center">
            Password reset link has been sent to your email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors p-2 rounded font-semibold flex items-center justify-center"
            >
              {status === 'loading' ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  )
}
