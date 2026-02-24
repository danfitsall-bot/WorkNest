import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).slice(2, 7)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'EMPLOYER' && (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Employer account required' }, { status: 403 })
  }

  const body = await req.json()
  const {
    companyId, title, description, requirements, location, remote, partTime,
    salaryMin, salaryMax, sector, applyUrl, tags, featured, closingDate,
  } = body

  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
  }

  const job = await prisma.job.create({
    data: {
      companyId,
      title,
      slug: slugify(title),
      description,
      requirements,
      location,
      remote: remote ?? false,
      partTime: partTime ?? false,
      salaryMin,
      salaryMax,
      sector,
      applyUrl,
      featured: featured ?? false,
      status: 'ACTIVE',
      closingDate: closingDate ? new Date(closingDate) : null,
      tags: {
        create: (tags ?? []).map((tag: string) => ({ tag })),
      },
    },
    include: { tags: true },
  })

  return NextResponse.json({ id: job.id, slug: job.slug }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const tag = searchParams.get('tag')
  const remote = searchParams.get('remote')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const where: any = { status: 'ACTIVE' }
  if (q) where.OR = [{ title: { contains: q } }, { description: { contains: q } }]
  if (tag) where.tags = { some: { tag } }
  if (remote === 'true') where.remote = true

  const jobs = await prisma.job.findMany({
    where,
    include: { company: true, tags: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  })

  return NextResponse.json(jobs)
}
