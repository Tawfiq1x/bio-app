import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period'); // expected values: 'day', 'month', 'year'

  let query = "";
  if (period === 'day') {
    query = `
      SELECT DATE("visitedAt") as "date", count(*) as "visits"
      FROM "Visit"
      GROUP BY DATE("visitedAt")
      ORDER BY DATE("visitedAt") DESC;
    `;
  } else if (period === 'month') {
    query = `
      SELECT to_char("visitedAt", 'YYYY-MM') as "date", count(*) as "visits"
      FROM "Visit"
      GROUP BY to_char("visitedAt", 'YYYY-MM')
      ORDER BY to_char("visitedAt", 'YYYY-MM') DESC;
    `;
  } else if (period === 'year') {
    query = `
      SELECT EXTRACT(YEAR FROM "visitedAt") as "date", count(*) as "visits"
      FROM "Visit"
      GROUP BY EXTRACT(YEAR FROM "visitedAt")
      ORDER BY EXTRACT(YEAR FROM "visitedAt") DESC;
    `;
  } else {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  const stats = await prisma.$queryRawUnsafe(query);
  return NextResponse.json({ stats });
}
