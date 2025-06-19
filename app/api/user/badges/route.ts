import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [global, custom] = await Promise.all([
    prisma.badge.findMany({ where: { isGlobal: true } }),
    prisma.userBadge.findMany({
      where: { userId: session.user.id },
      include: { badge: true },
    }),
  ]);

  const customBadges = custom.map((ub) => ub.badge);
  return NextResponse.json({ badges: [...global, ...customBadges] });
}
