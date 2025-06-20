import { prisma } from '@/lib/db';

export async function getTodayAnalytics() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const views = await prisma.profileView.count({
    where: { createdAt: { gte: todayStart } },
  });

  const clicks = await prisma.linkClick.count({
    where: { createdAt: { gte: todayStart } },
  });

  const users = await prisma.user.count({
    where: { createdAt: { gte: todayStart } },
  });

  return { views, clicks, users };
}

export async function getMonthAnalytics() {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const views = await prisma.profileView.count({
    where: { createdAt: { gte: monthStart } },
  });

  const clicks = await prisma.linkClick.count({
    where: { createdAt: { gte: monthStart } },
  });

  const users = await prisma.user.count({
    where: { createdAt: { gte: monthStart } },
  });

  return { views, clicks, users };
}

export async function getYearAnalytics() {
  const yearStart = new Date(new Date().getFullYear(), 0, 1);

  const views = await prisma.profileView.count({
    where: { createdAt: { gte: yearStart } },
  });

  const clicks = await prisma.linkClick.count({
    where: { createdAt: { gte: yearStart } },
  });

  const users = await prisma.user.count({
    where: { createdAt: { gte: yearStart } },
  });

  return { views, clicks, users };
}
