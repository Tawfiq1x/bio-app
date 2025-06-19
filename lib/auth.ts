import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export function generateEmailToken(email: string) {
  if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is not set in the environment.");
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Similar to generateEmailToken, but for password resets
export function generateResetToken(email: string) {
  if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is not set in the environment.");
  return jwt.sign({ email, purpose: 'reset' }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Send verification email
export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/(auth)/verify?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Please click the link below to verify your email:</p>
           <p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}

// Send password reset email
export async function sendResetEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/(auth)/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Please click the link below to reset your password:</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}

// NextAuth options for authentication setup
export const authOptions: NextAuthOptions = {
  // adapter, providers, callbacks, pages, secret, etc.
  // Fill in your auth config here
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // your user authentication logic here
        // return user object or null
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
