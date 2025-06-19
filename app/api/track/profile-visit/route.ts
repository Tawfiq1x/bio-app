import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId } = await req.json();

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  await prisma.visit.create({
    data: {
      userId,
      ipAddress: ip,
      userAgent: ua,
    },
  });

  return NextResponse.json({ success: true });
}
