import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma"; // তোমার prisma ক্লায়েন্টের পাথ ঠিক করতে হবে

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, user }) {
      // session এ user id যোগ করতে পারো পরবর্তীতে ইউজার ডাটাবেসে এক্সেসের জন্য
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // যদি কোনো এরর হয় লগইনের সময়
  },
};
