import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('staff_session')?.value;
  const session = await verifySession(token);
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/leads') ||
    pathname.startsWith('/pipeline') ||
    pathname.startsWith('/reminders') ||
    pathname.startsWith('/templates');

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((pathname === '/login' || pathname === '/register') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/leads/:path*',
    '/pipeline/:path*',
    '/reminders/:path*',
    '/templates/:path*',
    '/login',
    '/register',
  ],
};
