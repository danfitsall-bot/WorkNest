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

import { VALID_CONTRACT_TYPES, VALID_TAGS } from '@/lib/constants'
const VALID_STATUSES = ['ACTIVE', 'PAUSED', 'DRAFT']

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const job = await getOwnedJob(session.user.id, params.id)
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    const body = await req.json()
    const {
      title, description, requirements, location, remote, partTime,
      salaryMin, salaryMax, sector, applyUrl, tags, featured, closingDate, status,
      returnerFriendly, contractType, officeDaysPerWeek,
    } = body

    // Basic validation
    if (title && (typeof title !== 'string' || title.length > 200)) {
      return NextResponse.json({ error: 'Title must be 200 characters or fewer' }, { status: 400 })
    }
    if (description && typeof description !== 'string') {
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 })
    }
    if (contractType && !VALID_CONTRACT_TYPES.includes(contractType)) {
      return NextResponse.json({ error: 'Invalid contract type' }, { status: 400 })
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        if (!VALID_TAGS.includes(tag)) {
          return NextResponse.json({ error: `Invalid tag: ${tag}` }, { status: 400 })
        }
      }
    }
    if (applyUrl && typeof applyUrl === 'string' && applyUrl.length > 0) {
      if (!applyUrl.startsWith('https://') && !applyUrl.startsWith('http://')) {
        return NextResponse.json({ error: 'Apply URL must start with https:// or http://' }, { status: 400 })
      }
    }

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: {
        title: title?.trim(),
        description: description?.trim(),
        requirements: requirements?.trim() || null,
        location: location?.trim() || null,
        remote: remote ?? false,
        partTime: partTime ?? false,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        sector,
        applyUrl: applyUrl || null,
        featured: featured ?? false,
        status: status ?? job.status,
        closingDate: closingDate ? new Date(closingDate) : null,
        returnerFriendly: returnerFriendly ?? false,
        contractType: contractType || null,
        officeDaysPerWeek: officeDaysPerWeek != null && officeDaysPerWeek !== '' ? parseInt(String(officeDaysPerWeek)) : null,
        tags: {
          deleteMany: {},
          create: (tags ?? []).map((tag: string) => ({ tag })),
        },
      },
    })

    return NextResponse.json({ id: updated.id, slug: updated.slug })
  } catch (error) {
    console.error('PATCH /api/jobs/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const job = await getOwnedJob(session.user.id, params.id)
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    // Soft-delete: preserve applications/resumes for the employer's records.
    // Only remove SavedJob bookmarks (jobseeker bookmarks, safe to drop).
    await prisma.$transaction([
      prisma.savedJob.deleteMany({ where: { jobId: params.id } }),
      prisma.job.update({ where: { id: params.id }, data: { status: 'DELETED' } }),
    ])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/jobs/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
