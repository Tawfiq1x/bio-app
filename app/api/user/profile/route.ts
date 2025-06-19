import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { avatar, banner, bio, music, socialLinks } = body;

  try {
    const updated = await prisma.profile.upsert({
      where: { userId },
      update: { avatar, banner, bio, music, socialLinks },
      create: {
        userId,
        avatar,
        banner,
        bio,
        music,
        socialLinks,
      },
    });

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
