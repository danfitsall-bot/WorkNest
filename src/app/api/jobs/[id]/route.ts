import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getOwnedJob(userId: string, jobId: string) {
  const company = await prisma.company.findUnique({ where: { userId } })
  if (!company) return null
  const job = await prisma.job.findUnique({ where: { id: jobId } })
  if (!job || job.companyId !== company.id) return null
  return job
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const job = await getOwnedJob((session.user as any).id, params.id)
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  const {
    title, description, requirements, location, remote, partTime,
    salaryMin, salaryMax, sector, applyUrl, tags, featured, closingDate, status,
  } = await req.json()

  const updated = await prisma.job.update({
    where: { id: params.id },
    data: {
      title,
      description,
      requirements,
      location,
      remote: remote ?? false,
      partTime: partTime ?? false,
      salaryMin: salaryMin || null,
      salaryMax: salaryMax || null,
      sector,
      applyUrl,
      featured: featured ?? false,
      status: status ?? job.status,
      closingDate: closingDate ? new Date(closingDate) : null,
      tags: {
        deleteMany: {},
        create: (tags ?? []).map((tag: string) => ({ tag })),
      },
    },
  })

  return NextResponse.json({ id: updated.id, slug: updated.slug })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const job = await getOwnedJob((session.user as any).id, params.id)
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  await prisma.job.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
