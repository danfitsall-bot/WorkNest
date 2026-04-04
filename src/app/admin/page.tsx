import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  const [
    userCount,
    employerCount,
    jobCount,
    activeJobCount,
    applicationCount,
    companyCount,
    newsletterCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'EMPLOYER' } }),
    prisma.job.count(),
    prisma.job.count({ where: { status: 'ACTIVE' } }),
    prisma.application.count(),
    prisma.company.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
  ])

  const recentJobs = await prisma.job.findMany({
    include: { company: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total users', value: userCount },
          { label: 'Employers', value: employerCount },
          { label: 'Companies', value: companyCount },
          { label: 'Active jobs', value: activeJobCount },
          { label: 'Total jobs', value: jobCount },
          { label: 'Applications', value: applicationCount },
          { label: 'Newsletter subs', value: newsletterCount },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent jobs */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent jobs</h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
            {recentJobs.map(job => (
              <div key={job.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">{job.title}</p>
                  <p className="text-gray-400 text-xs">{job.company.name} · {new Date(job.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                  job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  job.status === 'PAUSED' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{job.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent signups</h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
            {recentUsers.map(user => (
              <div key={user.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">{user.name ?? user.email}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'EMPLOYER' ? 'bg-teal-100 text-teal-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{user.role}</span>
                  <span className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
