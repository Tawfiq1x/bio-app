// app/api/auth/forgot-password/route.ts
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  // TODO: Send the reset email with token link here

  return NextResponse.json({ message: 'Password reset link sent to your email' });
}
