import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getVisibleBadges } from '@/lib/utils';

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  // Find user and their profile by username
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
      userBadges: {
        include: { badge: true },
      },
    },
  });

  if (!user || !user.profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Get all global badges
  const globalBadges = await prisma.badge.findMany({
    where: { isGlobal: true },
  });

  const customBadges = user.userBadges.map((ub) => ub.badge);

  return NextResponse.json({
    username,
    name: user.name,
    avatar: user.profile.avatar,
    banner: user.profile.banner,
    bio: user.profile.bio,
    socialLinks: user.profile.socialLinks || [],
    music: user.profile.music || null,
    badges: [...globalBadges, ...customBadges],
  });
    }
