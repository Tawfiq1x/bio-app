'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) {
      router.replace('/login')
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match")
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setErrorMsg(data?.message || 'Something went wrong')
        setStatus('error')
        return
      }

      setStatus('success')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      setErrorMsg('Failed to reset password.')
      setStatus('error')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-black px-4 text-white">
      <motion.div
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center">Reset Password</h1>

        {status === 'success' ? (
          <p className="text-green-500 text-center">Password reset successfully! Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                'Reset Password'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  )
}
