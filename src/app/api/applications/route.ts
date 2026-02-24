import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendApplicationConfirmEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  const { jobId, coverLetter } = await req.json()

  const job = await prisma.job.findUnique({ where: { id: jobId }, include: { company: true } })
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  try {
    const app = await prisma.application.create({
      data: { jobId, userId, coverLetter },
    })
    // Send confirmation email (fire-and-forget)
    sendApplicationConfirmEmail(session.user.email!, job.title, job.company.name).catch(console.error)
    return NextResponse.json({ id: app.id }, { status: 201 })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Already applied' }, { status: 409 })
    }
    throw err
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  const applications = await prisma.application.findMany({
    where: { userId },
    include: { job: { include: { company: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(applications)
}
