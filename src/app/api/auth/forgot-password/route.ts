import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'hello@worknest.co.uk'

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
    const expires = new Date(Date.now() + 3600000) // 1 hour

    // Store the token using the VerificationToken model
    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: email, token: 'password-reset' } },
      update: { token, expires },
      create: { identifier: email, token, expires },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Reset your WorkNest password',
      html: `
        <h1>Password reset</h1>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}">Reset password →</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/auth/forgot-password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
