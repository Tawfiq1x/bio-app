import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
        Showcase Yourself in Style
      </h1>
      <p className="text-lg text-gray-300 max-w-xl mb-6">
        Create a beautiful bio link page with customizable profile, badges, analytics, and more. It’s like a personal landing page for everything you want to share.
      </p>
      <div className="flex gap-4">
        <Link href="/register">
          <span className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition">
            Get Started
          </span>
        </Link>
        <Link href="/login">
          <span className="px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition">
            Login
          </span>
        </Link>
      </div>
    </main>
  )
}
