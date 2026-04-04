import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

// TODO: Add idempotency handling — store processed event IDs to prevent duplicate processing
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const planFromMetadata = (metadata: Record<string, string> | null): string | undefined => {
    return metadata?.plan
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const companyId = session.metadata?.companyId
      const plan = planFromMetadata(session.metadata as Record<string, string>)
      if (companyId && plan) {
        await prisma.company.update({
          where: { id: companyId },
          data: {
            plan,
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus: 'active',
          },
        })
        // Update user role to EMPLOYER
        const company = await prisma.company.findUnique({ where: { id: companyId } })
        if (company) {
          await prisma.user.update({ where: { id: company.userId }, data: { role: 'EMPLOYER' } })
        }
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const plan = planFromMetadata(sub.metadata as Record<string, string>)
      const company = await prisma.company.findFirst({ where: { stripeSubscriptionId: sub.id } })
      if (company && plan) {
        await prisma.company.update({
          where: { id: company.id },
          data: { plan, subscriptionStatus: sub.status },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const company = await prisma.company.findFirst({ where: { stripeSubscriptionId: sub.id } })
      if (company) {
        await prisma.company.update({
          where: { id: company.id },
          data: { plan: 'FREE', subscriptionStatus: 'canceled', stripeSubscriptionId: null },
        })
        // Pause excess active jobs
        const jobs = await prisma.job.findMany({ where: { companyId: company.id, status: 'ACTIVE' }, orderBy: { createdAt: 'asc' } })
        if (jobs.length > 1) {
          const toExpire = jobs.slice(0, jobs.length - 1).map(j => j.id)
          await prisma.job.updateMany({ where: { id: { in: toExpire } }, data: { status: 'PAUSED' } })
        }
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = invoice.subscription as string
      if (subId) {
        const company = await prisma.company.findFirst({ where: { stripeSubscriptionId: subId } })
        if (company) {
          await prisma.company.update({ where: { id: company.id }, data: { subscriptionStatus: 'past_due' } })
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
