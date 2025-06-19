import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const settings = await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: body,
    create: { userId: session.user.id, ...body },
  });

  return NextResponse.json({ settings });
}
