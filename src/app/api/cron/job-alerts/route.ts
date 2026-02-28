import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendJobAlertEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  // Protect with a secret so only cron / Cloud Tasks can invoke
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Fetch jobs posted in the last 7 days
  const since = new Date()
  since.setDate(since.getDate() - 7)

  const recentJobs = await prisma.job.findMany({
    where: { status: 'ACTIVE', createdAt: { gte: since } },
    include: { company: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  if (recentJobs.length === 0) {
    return NextResponse.json({ sent: 0, reason: 'No new jobs this week' })
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
  })

  const jobPayload = recentJobs.map(j => ({
    title: j.title,
    company: j.company.name,
    slug: j.slug,
  }))

  let sent = 0
  for (const sub of subscribers) {
    try {
      await sendJobAlertEmail(sub.email, jobPayload)
      sent++
    } catch (err) {
      console.error(`Failed to send alert to ${sub.email}:`, err)
    }
  }

  return NextResponse.json({ sent, total: subscribers.length })
}
