import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

function statusBadge(status: string) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    DRAFT: 'bg-gray-100 text-gray-600',
    PAUSED: 'bg-amber-100 text-amber-700',
    EXPIRED: 'bg-red-100 text-red-600',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  const userId = (session.user as any).id
  let company = await prisma.company.findUnique({
    where: { userId },
    include: {
      jobs: {
        include: { tags: true, _count: { select: { applications: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  // If no company, create a stub one so they can post jobs
  if (!company) {
    redirect('/employers/plans')
  }

  const totalApps = company.jobs.reduce((sum, j) => sum + j._count.applications, 0)
  const activeJobs = company.jobs.filter(j => j.status === 'ACTIVE').length

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{company.name || 'Employer Dashboard'}</h1>
          <p className="text-gray-500 mt-1">
            Plan: <span className="font-semibold text-teal-600">{company.plan}</span>
            {company.subscriptionStatus && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${company.subscriptionStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {company.subscriptionStatus}
              </span>
            )}
          </p>
        </div>
        <Link href="/employers/post-job" className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-2.5 px-5 rounded-xl transition-colors">
          + Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active listings', value: activeJobs },
          { label: 'Total applications', value: totalApps },
          { label: 'Total jobs posted', value: company.jobs.length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Job listings table */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Your job listings</h2>
        </div>
        {company.jobs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📋</p>
            <h3 className="font-semibold text-gray-700 mb-2">No jobs posted yet</h3>
            <p className="text-gray-400 text-sm mb-6">Post your first flexible job to start attracting candidates</p>
            <Link href="/employers/post-job" className="bg-coral-500 text-white font-semibold py-2.5 px-6 rounded-xl">
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {company.jobs.map(job => (
              <div key={job.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{job.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {job.location ?? 'Remote'} · Posted {new Date(job.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(job.status)}`}>
                    {job.status}
                  </span>
                  <span className="text-sm text-gray-500">{job._count.applications} applications</span>
                  <Link href={`/employers/jobs/${job.id}/edit`} className="text-teal-600 text-sm hover:underline">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan upgrade nudge */}
      {company.plan === 'FREE' && (
        <div className="mt-6 bg-teal-50 border border-teal-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-teal-900">Upgrade to post more jobs</p>
            <p className="text-teal-700 text-sm mt-0.5">You&apos;re on the free plan. Upgrade to Starter to post up to 3 jobs.</p>
          </div>
          <Link href="/employers/plans" className="bg-teal-600 text-white font-semibold py-2 px-5 rounded-xl text-sm">
            Upgrade
          </Link>
        </div>
      )}
    </div>
  )
}
