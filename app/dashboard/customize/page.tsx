'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function CustomizePage() {
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    banner: '',
    avatar: '',
    animation: '',
    font: '',
    music: '',
    background: '',
  })
  const [status, setStatus] = useState<'idle' | 'saving'>('idle')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/dashboard/profile')
        const data = await res.json()
        setForm({
          displayName: data.displayName || '',
          bio: data.bio || '',
          banner: data.banner || '',
          avatar: data.avatar || '',
          animation: data.animation || '',
          font: data.font || '',
          music: data.music || '',
          background: data.background || '',
        })
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')

    await fetch('/api/dashboard/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setStatus('idle')
  }

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-white" />
      </main>
    )
  }

  return (
    <main className="p-4 max-w-3xl mx-auto text-white">
      <motion.h1
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Customize Your Profile
      </motion.h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Display Name</label>
          <input
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          />
        </div>

        <div>
          <label className="block">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          />
        </div>

        <div>
          <label className="block">Banner (.gif/.png/.jpg URL)</label>
          <input
            name="banner"
            value={form.banner}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          />
        </div>

        <div>
          <label className="block">Avatar (.gif/.png/.jpg URL)</label>
          <input
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          />
        </div>

        <div>
          <label className="block">Font (e.g., 'Pixel', 'Inter')</label>
          <input
            name="font"
            value={form.font}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          />
        </div>

        <div>
          <label className="block">Animation (e.g., 'typewriter')</label>
          <input
            name="animation"
            value={form.animation}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          />
        </div>

        <div>
          <label className="block">Background (Image URL)</label>
          <input
            name="background"
            value={form.background}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          />
        </div>

        <div>
          <label className="block">Background Music (MP3 URL)</label>
          <input
            name="music"
            value={form.music}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'saving'}
          className="w-full bg-purple-600 hover:bg-purple-700 transition-colors p-2 rounded font-semibold flex items-center justify-center"
        >
          {status === 'saving' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </main>
  )
}
