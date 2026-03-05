import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canFeature } from '@/lib/plans'
import type { Plan } from '@/lib/plans'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).slice(2, 7)
}

const VALID_CONTRACT_TYPES = ['PERMANENT', 'FTC', 'CONTRACT']
const VALID_TAGS = ['SCHOOL_HOURS', 'TERM_TIME', 'FOUR_DAY_WEEK', 'JOB_SHARE', 'ASYNC', 'COMPRESSED_HOURS', 'FLEXIBLE_START_FINISH']

function validateJobInput(body: any): string | null {
  if (!body.title || typeof body.title !== 'string') return 'Title is required'
  if (body.title.length > 200) return 'Title must be 200 characters or fewer'
  if (!body.description || typeof body.description !== 'string') return 'Description is required'
  if (body.description.length > 50000) return 'Description is too long'
  if (body.requirements && body.requirements.length > 50000) return 'Requirements is too long'
  if (body.location && body.location.length > 200) return 'Location must be 200 characters or fewer'
  if (body.sector && body.sector.length > 100) return 'Sector must be 100 characters or fewer'
  if (body.applyUrl && typeof body.applyUrl === 'string') {
    if (body.applyUrl.length > 2000) return 'Apply URL is too long'
    if (body.applyUrl && !body.applyUrl.startsWith('https://') && !body.applyUrl.startsWith('http://')) {
      return 'Apply URL must start with https:// or http://'
    }
  }
  if (body.salaryMin != null && (typeof body.salaryMin !== 'number' || body.salaryMin < 0 || body.salaryMin > 10000000)) {
    return 'Invalid minimum salary'
  }
  if (body.salaryMax != null && (typeof body.salaryMax !== 'number' || body.salaryMax < 0 || body.salaryMax > 10000000)) {
    return 'Invalid maximum salary'
  }
  if (body.salaryMin != null && body.salaryMax != null && body.salaryMin > body.salaryMax) {
    return 'Minimum salary cannot exceed maximum salary'
  }
  if (body.contractType && !VALID_CONTRACT_TYPES.includes(body.contractType)) {
    return 'Invalid contract type'
  }
  if (body.officeDaysPerWeek != null && body.officeDaysPerWeek !== '') {
    const days = typeof body.officeDaysPerWeek === 'string' ? parseInt(body.officeDaysPerWeek) : body.officeDaysPerWeek
    if (isNaN(days) || days < 0 || days > 5) return 'Office days must be 0-5'
  }
  if (body.tags && Array.isArray(body.tags)) {
    if (body.tags.length > 10) return 'Too many tags'
    for (const tag of body.tags) {
      if (!VALID_TAGS.includes(tag)) return `Invalid tag: ${tag}`
    }
  }
  if (body.closingDate) {
    const d = new Date(body.closingDate)
    if (isNaN(d.getTime())) return 'Invalid closing date'
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if ((session.user as any).role !== 'EMPLOYER' && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Employer account required' }, { status: 403 })
    }

    const body = await req.json()
    const validationError = validateJobInput(body)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const {
      companyId, title, description, requirements, location, remote, partTime,
      salaryMin, salaryMax, sector, applyUrl, tags, featured, closingDate,
      returnerFriendly, contractType, officeDaysPerWeek,
    } = body

    // Verify the user owns the company
    const company = await prisma.company.findUnique({ where: { userId: (session.user as any).id } })
    if (!company || company.id !== companyId) {
      return NextResponse.json({ error: 'You can only post jobs for your own company' }, { status: 403 })
    }

    // Only plans that include featured listings may set featured: true
    const allowFeatured = canFeature(company.plan as Plan) && (featured ?? false)

    const job = await prisma.job.create({
      data: {
        companyId,
        title: title.trim(),
        slug: slugify(title),
        description: description.trim(),
        requirements: requirements?.trim() || null,
        location: location?.trim() || null,
        remote: remote ?? false,
        partTime: partTime ?? false,
        salaryMin: salaryMin ?? null,
        salaryMax: salaryMax ?? null,
        sector: sector || null,
        applyUrl: applyUrl || null,
        featured: allowFeatured,
        status: 'ACTIVE',
        closingDate: closingDate ? new Date(closingDate) : null,
        returnerFriendly: returnerFriendly ?? false,
        contractType: contractType || null,
        officeDaysPerWeek: officeDaysPerWeek != null && officeDaysPerWeek !== '' ? parseInt(String(officeDaysPerWeek)) : null,
        tags: {
          create: (tags ?? []).map((tag: string) => ({ tag })),
        },
      },
      include: { tags: true },
    })

    return NextResponse.json({ id: job.id, slug: job.slug }, { status: 201 })
  } catch (error) {
    console.error('POST /api/jobs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const tag = searchParams.get('tag')
    const remote = searchParams.get('remote')
    const rawLimit = parseInt(searchParams.get('limit') ?? '20')
    const limit = Math.min(Math.max(isNaN(rawLimit) ? 20 : rawLimit, 1), 100)

    const where: any = { status: 'ACTIVE' }
    if (q) {
      const safeQ = q.slice(0, 200)
      where.OR = [{ title: { contains: safeQ } }, { description: { contains: safeQ } }]
    }
    if (tag && VALID_TAGS.includes(tag)) where.tags = { some: { tag } }
    if (remote === 'true') where.remote = true

    const jobs = await prisma.job.findMany({
      where,
      include: { company: true, tags: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('GET /api/jobs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
