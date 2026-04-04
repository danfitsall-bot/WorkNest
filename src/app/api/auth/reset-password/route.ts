import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { token, email, password } = await req.json()

    if (!token || !email || !password || password.length < 8) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // The stored token is a SHA-256 hash of the raw token sent via email
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Find and validate the token
    const verification = await prisma.verificationToken.findFirst({
      where: { identifier: email, token: hashedToken },
    })

    if (!verification || verification.expires < new Date()) {
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })
    }

    // Update the password
    const hashedPassword = await bcrypt.hash(password, 12)
    await prisma.user.update({
      where: { email },
      data: { hashedPassword },
    })

    // Delete the used token (stored as hashed value)
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token: hashedToken } },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/auth/reset-password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
