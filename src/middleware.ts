import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin-only routes
    if (path.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
      if (token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Employer-only routes
    if (path.startsWith('/employers/dashboard') || path.startsWith('/employers/post-job') || path.startsWith('/employers/jobs')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
      if (token.role !== 'EMPLOYER' && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/employers/signup', req.url))
      }
    }

    // Seeker account routes
    if (path.startsWith('/account')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // let middleware fn decide
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/employers/dashboard/:path*', '/employers/post-job/:path*', '/employers/jobs/:path*', '/account/:path*'],
}
