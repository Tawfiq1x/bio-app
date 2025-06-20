import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next'; // important to import from next-auth/next in app dir
import { NextRequest, NextResponse } from 'next/server';
import {
  getTodayAnalytics,
  getMonthAnalytics,
  getYearAnalytics,
} from '@/lib/analytics';

export async function GET(
  req: NextRequest,
  { params }: { params: { period: string } }
) {
  // Extract headers and cookies from NextRequest
  const session = await getServerSession({
    req: {
      headers: req.headers,
      // @ts-ignore
      cookies: req.cookies,
    },
    // res is not needed here in middleware/api route GET
    ...authOptions,
  });

  // Admin check
  if (!session || !session.user?.isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { period } = params;

  try {
    let data;

    switch (period) {
      case 'today':
        data = await getTodayAnalytics();
        break;
      case 'month':
        data = await getMonthAnalytics();
        break;
      case 'year':
        data = await getYearAnalytics();
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid period' }), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[Analytics API]', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
