'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Verified! Redirecting...')
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        setMessage(data.message || 'Verification failed')
      }
    } catch (err) {
      setMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg space-y-6"
      >
        <h1 className="text-3xl font-bold text-white text-center">Verify Email</h1>

        {message && <p className="text-sm text-center text-white">{message}</p>}

        <input
          type="text"
          placeholder="Verification Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full px-4 py-3 rounded bg-gray-800 text-white outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded font-semibold hover:bg-gray-200 transition"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </main>
  )
}
