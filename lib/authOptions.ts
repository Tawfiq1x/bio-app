import { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // Add other NextAuth config here if needed
}

export default authOptions
