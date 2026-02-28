import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED']

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    const { status } = await req.json()

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Verify employer owns the job this application belongs to
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: { job: true },
    })
    if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    const company = await prisma.company.findUnique({ where: { userId } })
    if (!company || application.job.companyId !== company.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json({ id: updated.id, status: updated.status })
  } catch (error) {
    console.error('PATCH /api/applications/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
