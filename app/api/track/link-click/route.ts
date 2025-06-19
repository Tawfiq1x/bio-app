import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId, platform } = await req.json();

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';

  if (!userId || !platform) {
    return NextResponse.json({ error: 'Missing userId or platform' }, { status: 400 });
  }

  await prisma.linkClick.create({
    data: {
      userId,
      platform,
      ipAddress: ip,
      userAgent: ua,
    },
  });

  return NextResponse.json({ success: true });
}
