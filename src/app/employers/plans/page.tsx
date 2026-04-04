import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PlanCheckout from './PlanCheckout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Plans | WorkNest Employers',
  description: 'Flexible, transparent pricing for employers. Post jobs and reach 50,000+ parent-friendly candidates.',
}

export default async function PlansPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin?callbackUrl=/employers/plans')

  const userId = session.user.id
  const company = await prisma.company.findUnique({ where: { userId } })

  return (
    <div className="bg-warm-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-teal-200">
            <span>✓</span> 14-day free trial on all plans
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose your plan</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Reach 50,000+ experienced parents actively seeking flexible roles. Cancel anytime.
          </p>
          {company && company.plan !== 'FREE' && (
            <p className="text-sm text-gray-400 mt-3">
              Current plan: <span className="font-semibold text-teal-600">{company.plan}</span>
              {company.subscriptionStatus && (
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  company.subscriptionStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>{company.subscriptionStatus}</span>
              )}
            </p>
          )}
        </div>

        <PlanCheckout currentPlan={company?.plan ?? 'FREE'} />

        {/* Trust signals */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: '🔒', title: 'Secure payments', desc: 'Powered by Stripe. Your card details are never stored on our servers.' },
            { icon: '↩️', title: 'Cancel anytime', desc: 'No lock-in contracts. Downgrade or cancel at the end of your billing cycle.' },
            { icon: '💬', title: 'Dedicated support', desc: 'Questions? Email us at hello@worknest.co.uk and we\'ll reply within 24 hours.' },
          ].map(t => (
            <div key={t.title} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="text-2xl mb-2">{t.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{t.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
