import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PlanCheckout from './PlanCheckout'

export default async function PlansPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin?callbackUrl=/employers/plans')

  const userId = session.user.id
  const company = await prisma.company.findUnique({ where: { userId } })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Choose your plan</h1>
        <p className="text-gray-500 mt-2">14-day free trial on all plans. Cancel anytime.</p>
        {company && (
          <p className="text-sm text-gray-400 mt-2">
            Current plan: <span className="font-semibold text-teal-600">{company.plan}</span>
          </p>
        )}
      </div>
      <PlanCheckout currentPlan={company?.plan ?? 'FREE'} />
    </div>
  )
}
