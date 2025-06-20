// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const key = url.searchParams.get('key')
  const isAdmin = request.cookies.get('isAdmin')?.value

  //Protect /admin and subroutes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If not logged in, show 404
    if (!isAdmin || isAdmin !== 'true') {
      return NextResponse.rewrite(new URL('/not-found', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [ '/admin/:path*'],
}
