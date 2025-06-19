import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Protect user and admin routes.
  const protectedPaths = ['/dashboard', '/admin'];
  const { pathname } = req.nextUrl;
  
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL('/(auth)/login', req.url));
    }
    
    // Additional admin check:
    if (pathname.startsWith('/admin') && !token.isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
