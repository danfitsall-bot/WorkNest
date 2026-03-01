import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { name, email, password, role, companyName } = await req.json()

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
  }

  const userRole = role === 'EMPLOYER' ? 'EMPLOYER' : 'SEEKER'

  if (userRole === 'EMPLOYER' && !companyName?.trim()) {
    return NextResponse.json({ error: 'Company name is required.' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { name, email, hashedPassword, role: userRole },
  })

  if (userRole === 'EMPLOYER' && companyName?.trim()) {
    const baseSlug = companyName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    let slug = baseSlug
    let i = 1
    while (await prisma.company.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`
    }
    await prisma.company.create({
      data: { userId: user.id, name: companyName.trim(), slug },
    })
  }

  // Fire-and-forget welcome email
  sendWelcomeEmail(email, name ?? email).catch(console.error)

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}
