import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import StatusDropdown from './StatusDropdown'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  REVIEWED: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
}

export default async function ApplicantsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  const userId = (session.user as any).id
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/employers/dashboard" className="hover:text-teal-600">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-600">{job.title}</span>
        <span>›</span>
        <span className="text-gray-600">Applicants</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-500 mt-1">{job.applications.length} application{job.applications.length !== 1 ? 's' : ''} for {job.title}</p>
        </div>
        <Link href={`/employers/jobs/${job.id}/edit`} className="text-teal-600 text-sm hover:underline">Edit job</Link>
      </div>

      {job.applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
          <p className="text-4xl mb-4">📭</p>
          <h3 className="font-semibold text-gray-700 mb-2">No applications yet</h3>
          <p className="text-gray-400 text-sm">Candidates will appear here when they apply.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {job.applications.map(app => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-teal-700">
                      {(app.user.name ?? app.user.email)?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{app.user.name ?? 'Anonymous'}</p>
                    <p className="text-sm text-gray-400">{app.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {app.status}
                  </span>
                  <StatusDropdown applicationId={app.id} currentStatus={app.status} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Applied {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              {app.coverLetter && (
                <div className="mt-4 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cover letter</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{app.coverLetter}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
