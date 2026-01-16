import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value

  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/login')
  const isProtectedPage = pathname.startsWith('/dashboard')

  // If trying to access login page while authenticated, redirect to dashboard
  if (isAuthPage && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If trying to access a protected page without authentication, redirect to login
  if (isProtectedPage && !authToken) {
    let from = pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', from);
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}

    