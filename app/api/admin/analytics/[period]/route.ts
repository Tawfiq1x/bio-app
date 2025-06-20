import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  req: Request,
  { params }: { params: { period: string } }
) {
  const session = await getServerSession(authOptions);

  // Optional: Add a check to make sure session.user exists
  if (!session?.user || !session.user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const period = params.period;
  let groupByQuery = '';

  if (period === 'today') {
    groupByQuery = `
      SELECT DATE("visitedAt") AS "date", COUNT(*) AS "visits"
      FROM "Visit"
      WHERE DATE("visitedAt") = CURRENT_DATE
      GROUP BY DATE("visitedAt");
    `;
  } else if (period === 'month') {
    groupByQuery = `
      SELECT TO_CHAR("visitedAt", 'YYYY-MM') AS "date", COUNT(*) AS "visits"
      FROM "Visit"
      GROUP BY TO_CHAR("visitedAt", 'YYYY-MM')
      ORDER BY "date" DESC;
    `;
  } else if (period === 'year') {
    groupByQuery = `
      SELECT EXTRACT(YEAR FROM "visitedAt") AS "year", COUNT(*) AS "visits"
      FROM "Visit"
      GROUP BY "year"
      ORDER BY "year" DESC;
    `;
  } else {
    return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
  }

  const stats = await prisma.$queryRawUnsafe(groupByQuery);
  return NextResponse.json({ stats });
}
