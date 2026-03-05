import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// Simple sliding-window rate limiter (per edge instance; no external store).
// For high-traffic deployments swap this out for Upstash Ratelimit + Redis.
// ---------------------------------------------------------------------------
interface RateLimitRecord { count: number; reset: number }
const rateLimitStore = new Map<string, RateLimitRecord>()

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)
  if (!record || now > record.reset) {
    rateLimitStore.set(key, { count: 1, reset: now + windowMs })
    return false
  }
  if (record.count >= limit) return true
  record.count++
  return false
}

function rateLimitResponse() {
  return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
    status: 429,
    headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
  })
}

function applyRateLimit(req: NextRequest): NextResponse | null {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { pathname } = req.nextUrl
  const method = req.method

  // Auth sign-in: 10 attempts per 15 minutes
  if (pathname === '/api/auth/callback/credentials' && method === 'POST') {
    if (isRateLimited(`auth:${ip}`, 10, 15 * 60 * 1000)) return rateLimitResponse()
  }
  // Job applications: 15 per hour
  if (pathname === '/api/applications' && method === 'POST') {
    if (isRateLimited(`apply:${ip}`, 15, 60 * 60 * 1000)) return rateLimitResponse()
  }
  // Job posts: 20 per hour
  if (pathname === '/api/jobs' && method === 'POST') {
    if (isRateLimited(`jobs:${ip}`, 20, 60 * 60 * 1000)) return rateLimitResponse()
  }
  // Newsletter subscriptions: 5 per hour
  if (pathname === '/api/newsletter' && method === 'POST') {
    if (isRateLimited(`newsletter:${ip}`, 5, 60 * 60 * 1000)) return rateLimitResponse()
  }

  return null
}

export default withAuth(
  function middleware(req) {
    const limited = applyRateLimit(req)
    if (limited) return limited

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
  matcher: [
    '/admin/:path*',
    '/employers/dashboard/:path*',
    '/employers/post-job/:path*',
    '/employers/jobs/:path*',
    '/account/:path*',
    '/api/auth/callback/credentials',
    '/api/applications',
    '/api/jobs',
    '/api/newsletter',
  ],
}
