import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import StatusDropdown from './StatusDropdown'

const STATUS_COUNTS_ORDER = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED']

const STATUS_PILL: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  REVIEWED: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
}

export default async function ApplicantsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  const userId = session.user.id
  const company = await prisma.company.findUnique({ where: { userId } })
  if (!company) redirect('/employers/plans')

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      applications: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!job || job.companyId !== company.id) notFound()

  // Count by status
  const statusCounts = STATUS_COUNTS_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = job.applications.filter(a => a.status === s).length
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/employers/dashboard" className="hover:text-teal-600 transition-colors">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-600 truncate max-w-xs">{job.title}</span>
        <span>›</span>
        <span className="text-gray-600">Applicants</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {job.applications.length} application{job.applications.length !== 1 ? 's' : ''} for <span className="font-medium text-gray-700">{job.title}</span>
          </p>
        </div>
        <Link
          href={`/employers/jobs/${job.id}/edit`}
          className="flex-shrink-0 border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Edit job
        </Link>
      </div>

      {/* Status summary */}
      {job.applications.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {STATUS_COUNTS_ORDER.map(s => (
            <div key={s} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{statusCounts[s]}</p>
              <p className={`text-xs font-medium mt-0.5 px-1.5 py-0.5 rounded-full inline-block ${STATUS_PILL[s]}`}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      )}

      {job.applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-20 px-4">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📭</span>
          </div>
          <h3 className="font-semibold text-gray-700 mb-2">No applications yet</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Candidates will appear here as soon as they apply. Share the listing to get more visibility.
          </p>
          <Link
            href={`/jobs/${job.slug}`}
            target="_blank"
            className="inline-block mt-5 text-teal-600 text-sm font-medium hover:underline"
          >
            Preview listing ↗
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {job.applications.map(app => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-teal-700">
                      {(app.user.name ?? app.user.email)?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{app.user.name ?? 'Anonymous'}</p>
                    <a
                      href={`mailto:${app.user.email}`}
                      className="text-sm text-gray-400 hover:text-teal-600 transition-colors"
                    >
                      {app.user.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusDropdown applicationId={app.id} currentStatus={app.status} />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span>Applied {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                {app.coverLetter && <span className="text-teal-500 font-medium">Cover letter included</span>}
              </div>

              {app.coverLetter && (
                <details className="mt-4">
                  <summary className="text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 transition-colors">
                    Cover letter ▾
                  </summary>
                  <div className="mt-3 bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{app.coverLetter}</p>
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
