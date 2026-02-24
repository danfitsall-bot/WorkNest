import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'
import ApplySection from './ApplySection'
import ChildcareCalc from '@/components/ChildcareCalc'

interface Props {
  params: { slug: string }
}

const TAG_STYLES: Record<string, string> = {
  FOUR_DAY_WEEK: 'bg-purple-100 text-purple-700',
  SCHOOL_HOURS: 'bg-green-100 text-green-700',
  TERM_TIME: 'bg-amber-100 text-amber-700',
  JOB_SHARE: 'bg-rose-100 text-rose-700',
  ASYNC: 'bg-blue-100 text-blue-700',
  COMPRESSED_HOURS: 'bg-indigo-100 text-indigo-700',
}

const TAG_LABELS: Record<string, string> = {
  FOUR_DAY_WEEK: '4-Day Week', SCHOOL_HOURS: 'School Hours', TERM_TIME: 'Term Time',
  JOB_SHARE: 'Job Share', ASYNC: 'Async', COMPRESSED_HOURS: 'Compressed Hours',
}

async function getJob(slug: string) {
  return prisma.job.findUnique({
    where: { slug },
    include: { company: true, tags: true },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob(params.slug)
  if (!job) return { title: 'Job Not Found' }
  return {
    title: `${job.title} at ${job.company.name}`,
    description: job.description.slice(0, 160),
  }
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJob(params.slug)
  if (!job || job.status !== 'ACTIVE') notFound()

  const salary = job.salaryMin && job.salaryMax
    ? `£${job.salaryMin.toLocaleString()} – £${job.salaryMax.toLocaleString()}`
    : job.salaryMax
    ? `Up to £${job.salaryMax.toLocaleString()}`
    : null

  // JSON-LD for Google Jobs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt.toISOString().split('T')[0],
    validThrough: job.closingDate?.toISOString().split('T')[0],
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company.name,
      sameAs: job.company.website ?? undefined,
      logo: job.company.logo ?? undefined,
    },
    jobLocation: job.remote
      ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'GB' } }
      : { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location ?? 'United Kingdom', addressCountry: 'GB' } },
    jobLocationType: job.remote ? 'TELECOMMUTE' : undefined,
    baseSalary: job.salaryMin
      ? {
          '@type': 'MonetaryAmount',
          currency: 'GBP',
          value: { '@type': 'QuantitativeValue', minValue: job.salaryMin, maxValue: job.salaryMax ?? undefined, unitText: 'YEAR' },
        }
      : undefined,
    employmentType: job.partTime ? 'PART_TIME' : 'FULL_TIME',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/jobs" className="hover:text-teal-600">Jobs</Link>
          <span>›</span>
          <span className="text-gray-600">{job.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {job.company.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-gray-400">{job.company.name[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-600">{job.company.name}</span>
                    {job.company.parentFriendlyBadge && (
                      <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">✓ Parent Friendly</span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">{job.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {job.location && <span>📍 {job.location}</span>}
                    {job.remote && <span className="text-blue-600 font-medium">🏠 Remote</span>}
                    {job.partTime && <span>⏰ Part-time</span>}
                    {salary && <span className="text-gray-700 font-semibold">💷 {salary}</span>}
                    {job.sector && <span>🏢 {job.sector}</span>}
                    {job.closingDate && <span>📅 Closes {new Date(job.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                  </div>
                  {job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.tags.map(({ tag }) => (
                        <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-full ${TAG_STYLES[tag] ?? 'bg-gray-100 text-gray-600'}`}>
                          {TAG_LABELS[tag] ?? tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">About the role</h2>
              <div className="prose prose-gray max-w-none text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Requirements</h2>
                <div className="prose prose-gray max-w-none text-sm leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* About company */}
            {job.company.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">About {job.company.name}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{job.company.description}</p>
                {job.company.website && (
                  <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm font-medium hover:underline mt-3 inline-block">
                    Visit website →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply card */}
            <ApplySection jobId={job.id} jobTitle={job.title} company={job.company.name} applyUrl={job.applyUrl} />

            {/* Childcare calculator */}
            {job.salaryMin && (
              <ChildcareCalc defaultSalary={job.salaryMax ?? job.salaryMin} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
