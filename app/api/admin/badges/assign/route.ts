import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  const { userId, badgeId } = await request.json();

  // Prevent assigning a global badge (global badges are automatically available).
  const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
  if (!badge) {
    return NextResponse.json({ error: "Badge not found" }, { status: 404 });
  }
  if (badge.isGlobal) {
    return NextResponse.json({ error: "Global badges do not require assignment" }, { status: 400 });
  }

  const userBadge = await prisma.userBadge.create({
    data: { userId, badgeId },
  });

  return NextResponse.json({ message: "Badge assigned", userBadge });
}
