// types/next-auth.d.ts

import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      username: string
      image?: string
      isAdmin: boolean // ✅ এই লাইনেই error fix হবে
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    username: string
    image?: string
    isAdmin: boolean
  }
}
