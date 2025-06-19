'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <motion.h1
        className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to BioApp
      </motion.h1>

      <motion.p
        className="text-lg text-gray-300 max-w-xl text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Create a beautiful and customizable bio link page. Add badges, music, social links, analytics and more — all in one place.
      </motion.p>

      <motion.div
        className="flex space-x-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
        >
          <Link href="/register">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold">
              Get Started
            </button>
          </Link>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
        >
          <Link href="/login">
            <button className="px-6 py-3 border border-white hover:bg-white hover:text-black rounded-full font-semibold">
              Login
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
