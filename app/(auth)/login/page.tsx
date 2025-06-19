'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Login failed')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-black px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white text-center">Login</h2>
        {error && (
          <motion.p
            className="text-red-500 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <motion.input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded bg-gray-800 text-white outline-none"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded bg-gray-800 text-white outline-none"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-semibold"
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </motion.button>

        <p className="text-center text-gray-400">
          Don’t have an account?{' '}
          <a
            href="/register"
            className="text-purple-400 hover:underline"
          >
            Register
          </a>
        </p>
      </motion.form>
    </main>
)
}
