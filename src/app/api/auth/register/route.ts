import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json()

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const userRole = role === 'EMPLOYER' ? 'EMPLOYER' : 'SEEKER'

  const user = await prisma.user.create({
    data: { name, email, hashedPassword, role: userRole },
  })

  // Fire-and-forget welcome email
  sendWelcomeEmail(email, name ?? email).catch(console.error)

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}
