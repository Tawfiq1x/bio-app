// /lib/auth.ts
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { NextAuthOptions } from 'next-auth';

export const prisma = new PrismaClient();

// NextAuth config example (আপনার অনুযায়ী কাস্টমাইজ করো)
export const authOptions: NextAuthOptions = {
  providers: [
    // এখানে তোমার providers যোগ করো, যেমন Discord, Email, Credentials ইত্যাদি
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  // অন্য NextAuth অপশনগুলো এখানে থাকবে
};

// ইমেইল ভেরিফিকেশন টোকেন তৈরি
export function generateEmailToken() {
  return Math.random().toString(36).substring(2, 15);
}

// রিসেট টোকেন তৈরি
export function generateResetToken() {
  return Math.random().toString(36).substring(2, 15);
}

// Nodemailer সেটআপ (যদি ব্যবহার করো)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// ভেরিফিকেশন ইমেইল পাঠানোর ফাংশন
export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Verify your email',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
}

// পাসওয়ার্ড রিসেট ইমেইল পাঠানোর ফাংশন
export async function sendResetEmail(to: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your password',
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
  });
}
