import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import JobCard from '@/components/JobCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import EmployerLogoCard from '@/components/EmployerLogoCard'

export const revalidate = 60 // ISR: re-generate every 60 seconds

async function getFeaturedJobs() {
  return prisma.job.findMany({
    where: { status: 'ACTIVE', featured: true },
    include: { company: true, tags: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })
}

async function getRecentJobs() {
  return prisma.job.findMany({
    where: { status: 'ACTIVE' },
    include: { company: true, tags: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
}

async function getStats() {
  const [jobs, companies] = await Promise.all([
    prisma.job.count({ where: { status: 'ACTIVE' } }),
    prisma.company.count(),
  ])
  return { jobs, companies }
}

const QUICK_FILTERS = [
  { label: '4-Day Week', href: '/jobs?tag=FOUR_DAY_WEEK', icon: '📅', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'School Hours', href: '/jobs?tag=SCHOOL_HOURS', icon: '🏫', color: 'bg-green-50 text-green-700 border-green-200' },
  { label: 'Remote', href: '/jobs?remote=true', icon: '🏠', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: 'Part-Time', href: '/jobs?hours=part', icon: '⏰', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { label: 'Term-Time', href: '/jobs?tag=TERM_TIME', icon: '📚', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { label: 'Job Share', href: '/jobs?tag=JOB_SHARE', icon: '🤝', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
]

const EMPLOYERS = [
  'Monzo',
  'Octopus Energy',
  'Deliveroo',
  'Bumble',
  'ASOS',
  'Spotify',
]

export default async function HomePage() {
  const [featured, recent, stats] = await Promise.all([
    getFeaturedJobs(),
    getRecentJobs(),
    getStats(),
  ])

  const displayJobs = featured.length > 0 ? featured : recent

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span>🌿</span>
              <span>{stats.jobs.toLocaleString()}+ flexible jobs from {stats.companies}+ parent-friendly employers</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Work that works for<br />
              <span className="text-coral-400">your family</span>
            </h1>
            <p className="text-lg sm:text-xl text-teal-100 mb-10 max-w-2xl leading-relaxed">
              Find flexible, part-time, remote and school-friendly roles at companies who genuinely put families first.
              No compromises. Real flexibility.
            </p>

            {/* Search */}
            <form action="/jobs" method="get" className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <input
                name="q"
                type="text"
                placeholder="Job title, skill or keyword…"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur"
              />
              <input
                name="location"
                type="text"
                placeholder="Location (or Remote)"
                className="w-full sm:w-48 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur"
              />
              <button
                type="submit"
                className="bg-coral-500 hover:bg-coral-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors whitespace-nowrap"
              >
                Search Jobs
              </button>
            </form>

            {/* Quick filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {QUICK_FILTERS.map(f => (
                <Link
                  key={f.label}
                  href={f.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border bg-white/5 border-white/20 text-white hover:bg-white/10 transition-colors`}
                >
                  <span>{f.icon}</span>
                  {f.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Recent Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {featured.length > 0 ? 'Featured roles' : 'Latest jobs'}
            </h2>
            <p className="text-gray-500 mt-1">From employers who get it</p>
          </div>
          <Link href="/jobs" className="text-teal-600 font-medium hover:underline text-sm">
            View all jobs →
          </Link>
        </div>
        <div className="grid gap-4">
          {displayJobs.map(job => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
        {displayJobs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-4">🌿</p>
            <p className="font-medium">Jobs are being added — check back soon!</p>
          </div>
        )}
      </section>

      {/* Value props */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why WorkNest?</h2>
            <p className="text-gray-500 mt-2">Built for parents, by parents</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: '✅', title: 'Verified flexibility', desc: 'Every listing is screened. No fake "flexible" roles — just genuine part-time, remote, and family-friendly positions.' },
              { icon: '🏆', title: 'Parent Friendly Badge', desc: 'Our certified employers go beyond policy. They have culture, management buy-in, and real flexible working.' },
              { icon: '🧮', title: 'Childcare cost calculator', desc: 'See your real take-home after childcare on every job. Know the true value before you apply.' },
            ].map(v => (
              <div key={v.title} className="text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted employers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">Trusted by great employers</p>
        <div className="flex flex-wrap justify-center items-center gap-10">
          {EMPLOYERS.map(name => (
            <EmployerLogoCard key={name} name={name} />
          ))}
        </div>
      </section>

      {/* Quick filter cards */}
      <section className="bg-warm-100 border-y border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by flexibility</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_FILTERS.map(f => (
              <Link
                key={f.label}
                href={f.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${f.color} hover:shadow-md transition-all text-center`}
              >
                <span className="text-2xl">{f.icon}</span>
                <span className="text-sm font-semibold">{f.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Parents found their perfect role</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { quote: "Found a 4-day week marketing role I'd never have seen on LinkedIn. The childcare calculator showed I'd actually be better off than in my old full-time job.", name: 'Emma R.', role: 'Marketing Manager, mum of 2' },
            { quote: "After 2 years out for mat leave, I was nervous about returning. WorkNest had loads of school-hours roles that actually meant it. Got my first interview in a week.", name: 'Priya K.', role: 'UX Designer, mum of 1' },
            { quote: "The Parent Friendly Badge told me everything I needed to know. I didn't want to waste time applying to companies that didn't walk the talk.", name: 'Clare M.', role: 'Finance Analyst, mum of 3' },
          ].map(t => (
            <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <p className="text-gray-600 italic leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-3">Get the best jobs in your inbox</h2>
            <p className="text-teal-200 mb-8">Join 12,000+ parents getting weekly flexible job alerts. No spam, unsubscribe anytime.</p>
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-coral-500 to-coral-600 rounded-3xl p-10 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">Hiring flexible talent?</h2>
          <p className="text-white/90 text-lg mb-8">
            Reach 50,000+ experienced parents actively looking for flexible roles.
            Post your first job from £149/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/employers/signup?role=EMPLOYER" className="bg-white text-coral-600 font-bold py-3 px-8 rounded-xl hover:bg-coral-50 transition-colors">
              Post a Job
            </Link>
            <Link href="/employers" className="border border-white/40 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-colors">
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
