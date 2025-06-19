import prisma from './prisma';

// Returns an object with all global badges and custom badges assigned to the user.
export async function getVisibleBadges(userId: string) {
  const globalBadges = await prisma.badge.findMany({
    where: { isGlobal: true },
  });
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
  });
  const customBadges = userBadges.map((ub) => ub.badge);
  
  return {
    global: globalBadges,
    custom: customBadges,
  };
}
