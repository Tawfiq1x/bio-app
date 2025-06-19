import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: payload.email },
      data: { password: hashed },
    });
    return NextResponse.json({ message: 'Password updated' });
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
}
