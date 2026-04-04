import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import BillingPortalButton from './BillingPortalButton'

function statusBadge(status: string) {
  const map: Record<string, { bg: string; label: string }> = {
    ACTIVE: { bg: 'bg-green-100 text-green-700', label: 'Active' },
    DRAFT: { bg: 'bg-gray-100 text-gray-600', label: 'Draft' },
    PAUSED: { bg: 'bg-amber-100 text-amber-700', label: 'Paused' },
    EXPIRED: { bg: 'bg-red-100 text-red-600', label: 'Expired' },
  }
  return map[status] ?? { bg: 'bg-gray-100 text-gray-600', label: status }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  const userId = session.user.id
  let company = await prisma.company.findUnique({
    where: { userId },
    include: {
      jobs: {
        where: { status: { not: 'DELETED' } },
        include: { tags: true, _count: { select: { applications: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!company) {
    redirect('/employers/plans')
  }

  const totalApps = company.jobs.reduce((sum, j) => sum + j._count.applications, 0)
  const activeJobs = company.jobs.filter(j => j.status === 'ACTIVE').length
  const isPastDue = company.subscriptionStatus === 'past_due'
  const isCanceled = company.subscriptionStatus === 'canceled'
  const hasBilling = !!company.stripeCustomerId

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{company.name || 'Employer Dashboard'}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-500 text-sm">Plan:</span>
            <span className="font-semibold text-teal-600 text-sm">{company.plan}</span>
            {company.subscriptionStatus && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                company.subscriptionStatus === 'active'
                  ? 'bg-green-100 text-green-700'
                  : company.subscriptionStatus === 'past_due'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {company.subscriptionStatus === 'active' ? 'Active' : company.subscriptionStatus === 'past_due' ? 'Payment overdue' : company.subscriptionStatus}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasBilling && <BillingPortalButton />}
          <Link href="/employers/post-job" className="inline-flex items-center gap-1.5 bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors text-sm">
            <span className="text-lg leading-none">+</span> Post a Job
          </Link>
        </div>
      </div>

      {/* Subscription warnings */}
      {isPastDue && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-900">Payment overdue</p>
            <p className="text-amber-700 text-sm mt-0.5">Your last payment failed. Update your payment method to keep your listings active.</p>
          </div>
          {hasBilling && <BillingPortalButton label="Update payment" />}
        </div>
      )}
      {isCanceled && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-red-900">Subscription cancelled</p>
            <p className="text-red-700 text-sm mt-0.5">Your plan has been downgraded to Free. Resubscribe to post more jobs.</p>
          </div>
          <Link href="/employers/plans" className="bg-red-600 text-white font-semibold py-2 px-5 rounded-xl text-sm flex-shrink-0">
            Resubscribe
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active listings', value: activeJobs, color: 'text-teal-600' },
          { label: 'Total applications', value: totalApps, color: 'text-coral-500' },
          { label: 'Jobs posted', value: company.jobs.length, color: 'text-gray-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Job listings table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Your job listings</h2>
          {company.jobs.length > 0 && (
            <span className="text-xs text-gray-400">{company.jobs.length} listing{company.jobs.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        {company.jobs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">No jobs posted yet</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">Post your first flexible job listing to start attracting parent-friendly candidates</p>
            <Link href="/employers/post-job" className="inline-block bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm">
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {company.jobs.map(job => {
              const badge = statusBadge(job.status)
              return (
                <div key={job.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 truncate">{job.title}</p>
                      {job.featured && (
                        <span className="text-xs bg-coral-50 text-coral-600 px-1.5 py-0.5 rounded-full font-medium">Featured</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {job.location ?? 'Remote'} · Posted {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <Link
                      href={`/employers/jobs/${job.id}/applicants`}
                      className="hidden sm:flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 transition-colors font-medium"
                    >
                      <span className="text-base">👤</span>
                      <span>{job._count.applications}</span>
                    </Link>
                    <Link
                      href={`/employers/jobs/${job.id}/edit`}
                      className="text-teal-600 text-sm font-medium hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/jobs/${job.slug}`}
                      target="_blank"
                      className="text-gray-400 text-sm hover:text-gray-600 hidden sm:inline"
                      title="Preview listing"
                    >
                      ↗
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Plan upgrade nudge */}
      {company.plan === 'FREE' && !isCanceled && (
        <div className="mt-6 bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-teal-900">Unlock more listings</p>
            <p className="text-teal-700 text-sm mt-0.5">You&apos;re on the free plan (1 listing). Upgrade to Starter for up to 3 listings, analytics, and more.</p>
          </div>
          <Link href="/employers/plans" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-5 rounded-xl text-sm flex-shrink-0 transition-colors">
            Upgrade plan
          </Link>
        </div>
      )}
    </div>
  )
}
