import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProfileEditor from './ProfileEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account',
}

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  PENDING: { bg: 'bg-gray-100 text-gray-600', label: 'Pending' },
  REVIEWED: { bg: 'bg-blue-100 text-blue-700', label: 'Reviewed' },
  SHORTLISTED: { bg: 'bg-green-100 text-green-700', label: 'Shortlisted' },
  REJECTED: { bg: 'bg-red-100 text-red-600', label: 'Rejected' },
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin?callbackUrl=/account')

  const userId = session.user.id

  const [applications, savedJobs] = await Promise.all([
    prisma.application.findMany({
      where: { userId, job: { status: { not: 'DELETED' } } },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.savedJob.findMany({
      where: { userId },
      include: { job: { include: { company: true, tags: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  // Filter out saved jobs where the job has been deleted
  const activeSavedJobs = savedJobs.filter(s => s.job.status !== 'DELETED')

  const initials = (session.user?.name ?? session.user?.email ?? 'U')[0].toUpperCase()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xl flex-shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{session.user?.name ?? session.user?.email}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{session.user?.email}</p>
        </div>
      </div>

      {/* Profile editor */}
      <section className="mb-10">
        <ProfileEditor initialName={session.user?.name ?? ''} email={session.user?.email ?? ''} />
      </section>

      {/* Applications */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">My Applications</h2>
          <span className="text-sm text-gray-400">{applications.length} total</span>
        </div>
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-gray-600 font-medium mb-1">No applications yet</p>
            <p className="text-gray-400 text-sm mb-4">Find a role you love and apply in minutes</p>
            <Link href="/jobs" className="inline-block text-teal-600 text-sm font-medium hover:underline">Browse jobs →</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {applications.map(app => {
                const badge = STATUS_STYLES[app.status] ?? { bg: 'bg-gray-100 text-gray-600', label: app.status }
                return (
                  <div key={app.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{app.job.title}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{app.job.company.name}</p>
                      <p className="text-gray-300 text-xs mt-0.5">
                        Applied {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.bg}`}>
                        {badge.label}
                      </span>
                      {app.job.status === 'ACTIVE' && (
                        <Link href={`/jobs/${app.job.slug}`} className="text-teal-600 text-sm font-medium hover:underline">
                          View →
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Saved Jobs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Saved Jobs</h2>
          <span className="text-sm text-gray-400">{activeSavedJobs.length} saved</span>
        </div>
        {activeSavedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">♡</span>
            </div>
            <p className="text-gray-600 font-medium mb-1">No saved jobs yet</p>
            <p className="text-gray-400 text-sm mb-4">Heart a listing to save it for later</p>
            <Link href="/jobs" className="inline-block text-teal-600 text-sm font-medium hover:underline">Find your next role →</Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {activeSavedJobs.map(({ job }) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-4 hover:shadow-sm hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 font-bold text-gray-400">
                    {job.company.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{job.title}</p>
                    <p className="text-gray-400 text-sm">{job.company.name} · {job.location ?? 'Remote'}</p>
                  </div>
                </div>
                <span className="text-teal-600 text-sm font-medium flex-shrink-0">View →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
