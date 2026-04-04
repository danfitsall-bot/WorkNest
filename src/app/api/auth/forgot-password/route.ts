import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

// TODO: Add rate limiting to prevent abuse of password reset endpoint

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success to prevent email enumeration
    if (!user || !user.hashedPassword) {
      return NextResponse.json({ ok: true })
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour

    // Delete any existing reset tokens for this email, then create a new one.
    // Using identifier as the unique lookup to avoid composite key collision
    // with the @@unique([identifier, token]) constraint.
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })
    await prisma.verificationToken.create({
      data: { identifier: email, token: hashedToken, expires },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`

    await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/auth/forgot-password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
