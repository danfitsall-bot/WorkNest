import { prisma } from '@/lib/prisma'
import JobCard from '@/components/JobCard'
import JobFilters from '@/components/JobFilters'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flexible Jobs for Parents',
  description: 'Browse hundreds of remote, part-time, school-hours and 4-day week jobs. Filter by flexibility type, salary, sector and location.',
}

interface SearchParams {
  q?: string
  location?: string
  remote?: string
  tag?: string
  hours?: string
  sector?: string
  salaryMin?: string
  returnerFriendly?: string
  contractType?: string
  officeDaysMax?: string
  page?: string
}

const PAGE_SIZE = 20

async function getJobs(params: SearchParams) {
  const rawPage = parseInt(params.page ?? '1', 10)
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : Math.min(rawPage, 1000)
  const skip = (page - 1) * PAGE_SIZE

  const where: any = { status: 'ACTIVE' }

  if (params.q) {
    const q = params.q.slice(0, 200)
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { company: { name: { contains: q, mode: 'insensitive' } } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (params.location) {
    where.location = { contains: params.location, mode: 'insensitive' }
  }
  if (params.remote === 'true') {
    where.remote = true
  }
  if (params.hours === 'part') {
    where.partTime = true
  }
  if (params.hours === 'full') {
    where.partTime = false
  }
  if (params.sector) {
    where.sector = params.sector
  }
  if (params.salaryMin) {
    where.salaryMin = { gte: parseInt(params.salaryMin, 10) }
  }
  if (params.returnerFriendly === 'true') {
    where.returnerFriendly = true
  }
  if (params.contractType) {
    where.contractType = params.contractType
  }
  if (params.officeDaysMax !== undefined && params.officeDaysMax !== '') {
    const max = parseInt(params.officeDaysMax, 10)
    where.officeDaysPerWeek = { lte: max }
  }
  if (params.tag) {
    const selectedTags = params.tag.split(',').filter(Boolean)
    if (selectedTags.length === 1) {
      where.tags = { some: { tag: selectedTags[0] } }
    } else if (selectedTags.length > 1) {
      where.tags = { some: { tag: { in: selectedTags } } }
    }
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { company: true, tags: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where }),
  ])

  return { jobs, total, page, pages: Math.ceil(total / PAGE_SIZE) }
}

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const { jobs, total, page, pages } = await getJobs(searchParams)

  const activeTags = searchParams.tag ? searchParams.tag.split(',').filter(Boolean) : []
  const tagLabels: Record<string, string> = {
    FOUR_DAY_WEEK: '4-Day Week', SCHOOL_HOURS: 'School Hours', TERM_TIME: 'Term Time',
    JOB_SHARE: 'Job Share', ASYNC: 'Async', COMPRESSED_HOURS: 'Compressed Hours',
    FLEXIBLE_START_FINISH: 'Flexible Start/Finish',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {searchParams.q
            ? `Jobs matching "${searchParams.q}"`
            : activeTags.length === 1
            ? `${tagLabels[activeTags[0]] ?? activeTags[0]} Jobs`
            : activeTags.length > 1
            ? `${activeTags.map(t => tagLabels[t] ?? t).join(', ')} Jobs`
            : 'Flexible Jobs for Parents'}
        </h1>
        <p className="text-gray-500 mt-1">{total.toLocaleString()} {total === 1 ? 'job' : 'jobs'} found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <JobFilters current={searchParams} />
        </aside>

        {/* Job list */}
        <div className="flex-1">
          {jobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="font-semibold text-gray-700 mb-2">No jobs match your search</h3>
              <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map(job => <JobCard key={job.id} {...job} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <a href={`?${new URLSearchParams({ ...searchParams, page: String(page - 1) })}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                  ← Previous
                </a>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {pages}</span>
              {page < pages && (
                <a href={`?${new URLSearchParams({ ...searchParams, page: String(page + 1) })}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                  Next →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
