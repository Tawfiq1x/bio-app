import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [visitCount, clickCount] = await Promise.all([
    prisma.visit.count({ where: { userId: session.user.id } }),
    prisma.linkClick.count({ where: { userId: session.user.id } })
  ]);

  return NextResponse.json({ visits: visitCount, clicks: clickCount });
}
