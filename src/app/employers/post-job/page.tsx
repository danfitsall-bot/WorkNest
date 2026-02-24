import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PLAN_LIMITS } from '@/lib/plans'
import PostJobForm from './PostJobForm'

export default async function PostJobPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  const userId = (session.user as any).id
  const company = await prisma.company.findUnique({
    where: { userId },
    include: { _count: { select: { jobs: { where: { status: 'ACTIVE' } } } } },
  })

  if (!company) redirect('/employers/plans')

  const plan = company.plan as keyof typeof PLAN_LIMITS
  const limits = PLAN_LIMITS[plan]
  const activeListings = company._count.jobs

  if (activeListings >= limits.maxListings) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Listing limit reached</h1>
        <p className="text-gray-500 mb-8">
          Your {plan} plan allows {limits.maxListings} active {limits.maxListings === 1 ? 'listing' : 'listings'}.
          Upgrade to post more jobs.
        </p>
        <a href="/employers/plans" className="bg-teal-600 text-white font-bold py-3 px-8 rounded-xl">
          Upgrade plan
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Post a new job</h1>
      <p className="text-gray-500 mb-8">
        {limits.maxListings - activeListings} of {limits.maxListings === Infinity ? '∞' : limits.maxListings} listing{limits.maxListings === 1 ? '' : 's'} remaining on your {plan} plan.
      </p>
      <PostJobForm companyId={company.id} canFeature={limits.featured} />
    </div>
  )
}
