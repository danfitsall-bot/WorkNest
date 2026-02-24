import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'hello@worknest.co.uk'

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to WorkNest 🌿',
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>You've joined WorkNest — the UK's most parent-friendly job board.</p>
      <p>Browse flexible, part-time, and family-friendly roles at companies that genuinely get it.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs">Start exploring jobs →</a></p>
    `,
  })
}

export async function sendJobAlertEmail(to: string, jobs: { title: string; company: string; slug: string }[]) {
  const jobList = jobs
    .map(j => `<li><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${j.slug}">${j.title} at ${j.company}</a></li>`)
    .join('')

  await resend.emails.send({
    from: FROM,
    to,
    subject: `${jobs.length} new jobs matching your alert`,
    html: `
      <h1>New jobs for you</h1>
      <ul>${jobList}</ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs">See all jobs →</a></p>
    `,
  })
}

export async function sendApplicationConfirmEmail(to: string, jobTitle: string, company: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Application submitted — ${jobTitle} at ${company}`,
    html: `
      <h1>Application received!</h1>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been sent.</p>
      <p>We'll let you know when there's an update. Good luck! 🤞</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/account">View your applications →</a></p>
    `,
  })
}
