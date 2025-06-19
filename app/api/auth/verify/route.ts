import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    await prisma.user.update({
      where: { email: payload.email },
      data: { emailVerified: new Date() },
    });
    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification failed:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
