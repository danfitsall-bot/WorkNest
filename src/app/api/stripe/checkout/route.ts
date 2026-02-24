import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, STRIPE_PLANS } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const { plan } = await req.json()

  if (!['STARTER', 'GROWTH', 'ENTERPRISE'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const priceId = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]

  // Ensure company exists
  let company = await prisma.company.findUnique({ where: { userId } })
  if (!company) {
    company = await prisma.company.create({
      data: {
        userId,
        name: session.user.name ?? session.user.email ?? 'My Company',
        slug: userId + '-company',
      },
    })
  }

  // Create or retrieve Stripe customer
  let customerId = company.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      name: session.user.name ?? undefined,
      metadata: { userId, companyId: company.id },
    })
    customerId = customer.id
    await prisma.company.update({ where: { id: company.id }, data: { stripeCustomerId: customerId } })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/employers/dashboard?success=1`,
    cancel_url: `${appUrl}/employers/plans`,
    subscription_data: {
      trial_period_days: 14,
      metadata: { companyId: company.id, plan },
    },
    metadata: { companyId: company.id, plan },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
