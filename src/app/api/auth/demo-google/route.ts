import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Only active when GOOGLE_CLIENT_ID is not configured (dev / sandbox environments).
// Creates a stable demo user so the Google button works without real OAuth credentials.

const DEMO_EMAIL = 'demo.google@worknest.dev'
const DEMO_PASS = 'demo-google-worknest'

export async function POST() {
  if (process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: 'Not available' }, { status: 403 })
  }

  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } })
  if (!existing) {
    const hash = await bcrypt.hash(DEMO_PASS, 10)
    await prisma.user.create({
      data: { email: DEMO_EMAIL, name: 'Demo Google User', hashedPassword: hash, role: 'SEEKER' },
    })
  }

  return NextResponse.json({ email: DEMO_EMAIL, password: DEMO_PASS })
}
