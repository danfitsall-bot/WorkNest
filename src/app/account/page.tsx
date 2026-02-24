import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  REVIEWED: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin?callbackUrl=/account')

  const userId = (session.user as any).id

  const [applications, savedJobs] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.savedJob.findMany({
      where: { userId },
      include: { job: { include: { company: true, tags: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-lg">
          {(session.user?.name ?? session.user?.email ?? 'U')[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{session.user?.name ?? session.user?.email}</h1>
          <p className="text-gray-500 text-sm">{session.user?.email}</p>
        </div>
      </div>

      {/* Applications */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">My Applications ({applications.length})</h2>
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-gray-500 font-medium">No applications yet</p>
            <Link href="/jobs" className="text-teal-600 text-sm mt-2 inline-block hover:underline">Browse jobs →</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {applications.map(app => (
              <div key={app.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{app.job.title}</p>
                  <p className="text-gray-400 text-sm">{app.job.company.name}</p>
                  <p className="text-gray-300 text-xs mt-0.5">Applied {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {app.status}
                  </span>
                  <Link href={`/jobs/${app.job.slug}`} className="text-teal-600 text-sm hover:underline">View →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved Jobs */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Saved Jobs ({savedJobs.length})</h2>
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-3xl mb-3">♡</p>
            <p className="text-gray-500 font-medium">No saved jobs</p>
            <Link href="/jobs" className="text-teal-600 text-sm mt-2 inline-block hover:underline">Find your next role →</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedJobs.map(({ job }) => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-400">
                    {job.company.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{job.title}</p>
                    <p className="text-gray-400 text-sm">{job.company.name} · {job.location ?? 'Remote'}</p>
                  </div>
                </div>
                <Link href={`/jobs/${job.slug}`} className="text-teal-600 text-sm font-medium hover:underline flex-shrink-0">
                  View →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
