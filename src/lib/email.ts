import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
export const FROM = process.env.RESEND_FROM_EMAIL ?? 'hello@worknest.co.uk'

function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to WorkNest 🌿',
    html: `
      <h1>Welcome, ${escapeHtml(name)}!</h1>
      <p>You've joined WorkNest — the UK's most parent-friendly job board.</p>
      <p>Browse flexible, part-time, and family-friendly roles at companies that genuinely get it.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs">Start exploring jobs →</a></p>
    `,
  })
}

export async function sendJobAlertEmail(to: string, jobs: { title: string; company: string; slug: string }[]) {
  const jobList = jobs
    .map(j => `<li><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${encodeURIComponent(j.slug)}">${escapeHtml(j.title)} at ${escapeHtml(j.company)}</a></li>`)
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

export async function sendNewApplicantEmail(to: string, applicantName: string, jobTitle: string, jobId: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `New application — ${escapeHtml(jobTitle)}`,
    html: `
      <h1>New application received</h1>
      <p><strong>${escapeHtml(applicantName)}</strong> has applied for <strong>${escapeHtml(jobTitle)}</strong>.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/employers/jobs/${encodeURIComponent(jobId)}/applicants">View applicants →</a></p>
    `,
  })
}

export async function sendApplicationConfirmEmail(to: string, jobTitle: string, company: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Application submitted — ${escapeHtml(jobTitle)} at ${escapeHtml(company)}`,
    html: `
      <h1>Application received!</h1>
      <p>Your application for <strong>${escapeHtml(jobTitle)}</strong> at <strong>${escapeHtml(company)}</strong> has been sent.</p>
      <p>We'll let you know when there's an update. Good luck! 🤞</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/account">View your applications →</a></p>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Reset your WorkNest password',
    html: `
      <h1>Password reset</h1>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">Reset password →</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  })
}
