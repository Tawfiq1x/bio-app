import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import {
  getTodayAnalytics,
  getMonthAnalytics,
  getYearAnalytics,
} from '@/lib/analytics';

export async function GET(
  req: NextRequest,
  { params }: { params: { period: string } }
) {
  const session = await getServerSession(authOptions);

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
