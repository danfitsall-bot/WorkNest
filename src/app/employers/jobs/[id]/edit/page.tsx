import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PLAN_LIMITS } from '@/lib/plans'
import Link from 'next/link'
import EditJobForm from './EditJobForm'

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  const userId = (session.user as any).id
  const company = await prisma.company.findUnique({ where: { userId } })
  if (!company) redirect('/employers/plans')

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { tags: true },
  })

  if (!job || job.companyId !== company.id) notFound()

  const plan = company.plan as keyof typeof PLAN_LIMITS
  const canFeature = PLAN_LIMITS[plan]?.featured ?? false

  const initial = {
    title: job.title,
    description: job.description,
    requirements: job.requirements ?? '',
    location: job.location ?? '',
    remote: job.remote,
    partTime: job.partTime,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    sector: job.sector ?? '',
    applyUrl: job.applyUrl ?? '',
    tags: job.tags.map(t => t.tag),
    featured: job.featured,
    closingDate: job.closingDate ? job.closingDate.toISOString().split('T')[0] : '',
    status: job.status,
    returnerFriendly: (job as any).returnerFriendly ?? false,
    contractType: (job as any).contractType ?? '',
    officeDaysPerWeek: (job as any).officeDaysPerWeek ?? null,
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/employers/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Dashboard
        </Link>
        <span className="text-gray-200">/</span>
        <span className="text-sm text-gray-600 truncate">{job.title}</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit job</h1>
      <EditJobForm jobId={job.id} canFeature={canFeature} initial={initial} />
    </div>
  )
}
