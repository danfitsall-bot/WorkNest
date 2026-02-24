import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hire Flexible Talent | Employers',
  description: 'Post flexible jobs and reach 50,000+ experienced parents. Subscription plans from £149/month.',
}

const PLANS = [
  {
    name: 'Starter',
    price: 149,
    priceAnnual: 119,
    listings: 3,
    color: 'border-gray-200',
    features: ['3 active job listings', 'Basic analytics', 'Standard listing', 'Email support'],
    cta: 'Start free trial',
    popular: false,
  },
  {
    name: 'Growth',
    price: 349,
    priceAnnual: 279,
    listings: 10,
    color: 'border-teal-500 ring-2 ring-teal-500',
    features: ['10 active job listings', '1 featured listing', 'Full analytics dashboard', 'ATS integrations', 'Priority support'],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 899,
    priceAnnual: 719,
    listings: Infinity,
    color: 'border-gray-200',
    features: ['Unlimited listings', 'Parent Friendly Badge', 'Newsletter slot', 'Dedicated account manager', 'Custom analytics', 'CV search access'],
    cta: 'Book a demo',
    popular: false,
  },
]

const FAQS = [
  { q: 'How do I post a job?', a: 'Sign up for an account, choose a plan, and you can post your first job in under 5 minutes. Our guided form ensures your listing is optimised for Google Jobs.' },
  { q: 'What is the Parent Friendly Badge?', a: 'It\'s our certification for employers who go beyond policy — companies with genuine flexible culture, management buy-in, and real work-life support for parents. Available on Enterprise plan.' },
  { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, at any time. Upgrades take effect immediately. Downgrades take effect at the end of your billing period.' },
  { q: 'Do you offer a free trial?', a: 'Yes — Starter and Growth plans include a 14-day free trial. No credit card required to start.' },
  { q: 'How is this different from LinkedIn or Indeed?', a: 'WorkNest only lists flexible, family-friendly roles — so every applicant is actively looking for exactly what you\'re offering. You get higher quality, more motivated candidates.' },
]

export default function EmployersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <span>🏆</span>
              <span>Trusted by 500+ UK employers</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Hire flexible talent.<br />
              <span className="text-coral-400">Retain great people.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Reach 50,000+ experienced professionals actively looking for flexible, part-time and family-friendly roles.
              Candidates who know what they want — and will stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup?role=EMPLOYER" className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-3.5 px-8 rounded-xl transition-colors text-center">
                Post your first job →
              </Link>
              <a href="#pricing" className="border border-white/30 text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-white/10 transition-colors text-center">
                See pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '50,000+', label: 'Active job seekers' },
              { value: '500+', label: 'Employer partners' },
              { value: '78%', label: 'Application rate vs LinkedIn' },
              { value: '4.8★', label: 'Employer satisfaction' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why employers love WorkNest</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { icon: '🎯', title: 'Pre-qualified candidates', desc: 'Every candidate is actively seeking flexible work. No time-wasters, no mismatched expectations. Higher conversion from application to interview.' },
            { icon: '🔍', title: 'Google Jobs integration', desc: 'Every listing automatically gets JSON-LD schema markup, so your jobs appear directly in Google Search results — for free, on top of our audience.' },
            { icon: '📊', title: 'Employer analytics', desc: 'Track views, applications, and conversion rate for every listing. Know what\'s working and optimise in real time.' },
          ].map(v => (
            <div key={v.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-3xl mb-4">{v.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-warm-100 border-y border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="text-gray-500 mt-2">14-day free trial on all plans. Cancel anytime.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map(plan => (
              <div key={plan.name} className={`bg-white rounded-2xl border p-6 relative ${plan.color}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>
                  </div>
                )}
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-900">£{plan.price}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === 'Enterprise' ? '#demo' : `/auth/signup?role=EMPLOYER&plan=${plan.name.toLowerCase()}`}
                  className={`block w-full text-center font-semibold py-2.5 rounded-xl transition-colors ${
                    plan.popular
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* One-off option */}
          <div className="mt-8 max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900">Single job post</h3>
              <p className="text-gray-500 text-sm mt-0.5">No subscription needed. Post one job for 30 days.</p>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-2xl font-bold text-gray-900">£99</span>
                <span className="text-gray-400 text-sm"> one-off</span>
              </div>
              <Link href="/auth/signup?role=EMPLOYER&plan=single" className="bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors">
                Post now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Friendly Badge */}
      <section id="certification" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-teal-800 to-teal-700 rounded-3xl p-10 text-white">
          <div className="max-w-2xl">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold mb-4">Get the Parent Friendly Badge</h2>
            <p className="text-teal-100 text-lg leading-relaxed mb-8">
              Our independent certification verifies you walk the talk. Certified companies get a badge on all listings,
              a directory profile, and newsletter inclusion — £995/year.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {['Genuine flexible culture', 'Management training', 'Enhanced parental leave'].map(b => (
                <div key={b} className="bg-white/10 rounded-xl p-3 text-sm font-medium">✓ {b}</div>
              ))}
            </div>
            <Link href="/auth/signup?role=EMPLOYER&certification=true" className="bg-white text-teal-700 font-bold py-3 px-8 rounded-xl hover:bg-teal-50 transition-colors inline-block">
              Apply for certification →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQS.map(faq => (
            <details key={faq.q} className="bg-white rounded-2xl border border-gray-100 group">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 list-none">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
