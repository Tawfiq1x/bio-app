import { prisma } from '@/lib/db';

// Get start of today
function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

// Get start of the current month
function startOfMonth() {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return now;
}

// Get start of the current year
function startOfYear() {
  return new Date(new Date().getFullYear(), 0, 1);
}

export async function getTodayAnalytics() {
  const start = startOfToday();

  const visits = await prisma.visit.count({
    where: { visitedAt: { gte: start } },
  });

  const clicks = await prisma.linkClick.count({
    where: { clickedAt: { gte: start } },
  });

  const users = await prisma.user.count({
    where: { createdAt: { gte: start } },
  });

  return { visits, clicks, users };
}

export async function getMonthAnalytics() {
  const start = startOfMonth();

  const visits = await prisma.visit.count({
    where: { visitedAt: { gte: start } },
  });

  const clicks = await prisma.linkClick.count({
    where: { clickedAt: { gte: start } },
  });

  const users = await prisma.user.count({
    where: { createdAt: { gte: start } },
  });

  return { visits, clicks, users };
}

export async function getYearAnalytics() {
  const start = startOfYear();

  const visits = await prisma.visit.count({
    where: { visitedAt: { gte: start } },
  });

  const clicks = await prisma.linkClick.count({
    where: { clickedAt: { gte: start } },
  });

  const users = await prisma.user.count({
    where: { createdAt: { gte: start } },
  });

  return { visits, clicks, users };
}
