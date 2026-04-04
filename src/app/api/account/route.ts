import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()
    const { name } = body

    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return NextResponse.json({ error: 'Name must be 1-100 characters' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('PATCH /api/account error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
