import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'
import JobCard from '@/components/JobCard'

interface Props {
  params: { slug: string }
}

async function getCompany(slug: string) {
  return prisma.company.findUnique({
    where: { slug },
    include: {
      jobs: {
        where: { status: 'ACTIVE' },
        include: { company: true, tags: true },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const company = await getCompany(params.slug)
  if (!company) return { title: 'Company Not Found' }
  return {
    title: `${company.name} — Jobs & Company Profile`,
    description: company.description?.slice(0, 160) ?? `View flexible jobs at ${company.name} on WorkNest.`,
  }
}

export default async function CompanyProfilePage({ params }: Props) {
  const company = await getCompany(params.slug)
  if (!company) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/jobs" className="hover:text-teal-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-600">{company.name}</span>
      </nav>

      {/* Company header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-400">{company.name[0]}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              {company.parentFriendlyBadge && (
                <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">✓ Parent Friendly</span>
              )}
            </div>
            {company.description && (
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">{company.description}</p>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm font-medium hover:underline mt-2 inline-block">
                {company.website.replace(/^https?:\/\//, '')} →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Active jobs */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Open positions ({company.jobs.length})
      </h2>
      {company.jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500">No open positions at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {company.jobs.map(job => <JobCard key={job.id} {...job} />)}
        </div>
      )}
    </div>
  )
}
