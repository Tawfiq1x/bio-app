import prisma from '@/lib/prisma';
import { sendResetEmail, generateResetToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const token = generateResetToken(email);
  await sendResetEmail(email, token);

  return NextResponse.json({ message: 'Reset link sent' });
}
