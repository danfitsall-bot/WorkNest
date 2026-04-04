import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendApplicationConfirmEmail, sendNewApplicantEmail } from '@/lib/email'

// TODO: Add CSRF protection for state-changing endpoints
// TODO: Add rate limiting to prevent abuse
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = session.user.id
    const { jobId, coverLetter } = await req.json()

    if (!jobId || typeof jobId !== 'string') {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }
    if (coverLetter && coverLetter.length > 10000) {
      return NextResponse.json({ error: 'Cover letter is too long' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: { include: { user: { select: { email: true } } } } },
    })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    if (job.status !== 'ACTIVE') return NextResponse.json({ error: 'This job is no longer accepting applications' }, { status: 400 })

    const app = await prisma.application.create({
      data: { jobId, userId, coverLetter: coverLetter?.trim() || null },
    })

    // Send confirmation email to candidate (fire-and-forget)
    sendApplicationConfirmEmail(session.user.email!, job.title, job.company.name).catch(console.error)

    // Send notification email to employer (fire-and-forget)
    sendNewApplicantEmail(
      job.company.user.email,
      session.user.name ?? session.user.email!,
      job.title,
      job.id,
    ).catch(console.error)

    return NextResponse.json({ id: app.id }, { status: 201 })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Already applied' }, { status: 409 })
    }
    console.error('POST /api/applications error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = session.user.id
    const applications = await prisma.application.findMany({
      where: { userId, job: { status: { not: 'DELETED' } } },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(applications)
  } catch (error) {
    console.error('GET /api/applications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
