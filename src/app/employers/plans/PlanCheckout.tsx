'use client'

import { useState } from 'react'

const PLANS = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: 149,
    priceAnnual: 119,
    listings: 3,
    color: 'border-gray-200',
    features: [
      { text: '3 active job listings', highlight: false },
      { text: 'Basic analytics dashboard', highlight: false },
      { text: 'Google Jobs integration', highlight: false },
      { text: 'Email support', highlight: false },
    ],
    cta: 'Start free trial',
    popular: false,
  },
  {
    id: 'GROWTH',
    name: 'Growth',
    price: 349,
    priceAnnual: 279,
    listings: 10,
    color: 'border-teal-500',
    features: [
      { text: '10 active job listings', highlight: false },
      { text: '1 featured listing (top of results)', highlight: true },
      { text: 'Full analytics dashboard', highlight: false },
      { text: 'ATS integrations', highlight: false },
      { text: 'Priority support', highlight: false },
    ],
    cta: 'Start free trial',
    popular: true,
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 899,
    priceAnnual: 719,
    listings: Infinity,
    color: 'border-gray-200',
    features: [
      { text: 'Unlimited listings', highlight: false },
      { text: 'Parent Friendly Badge certification', highlight: true },
      { text: 'Newsletter feature slot', highlight: true },
      { text: 'CV search access', highlight: false },
      { text: 'Custom analytics', highlight: false },
      { text: 'Dedicated account manager', highlight: false },
    ],
    cta: 'Start free trial',
    popular: false,
  },
]

export default function PlanCheckout({ currentPlan }: { currentPlan: string }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  async function handleCheckout(planId: string) {
    setLoading(planId)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId }),
    })
    const { url, error } = await res.json()
    if (url) {
      window.location.href = url
    } else {
      alert(error ?? 'Something went wrong. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('annual')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${billingCycle === 'annual' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Annual
          <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">Save 20%</span>
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {PLANS.map(plan => {
          const displayPrice = billingCycle === 'annual' ? plan.priceAnnual : plan.price
          const isCurrentPlan = currentPlan === plan.id

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border-2 p-6 relative flex flex-col ${
                plan.popular ? 'border-teal-500 shadow-lg shadow-teal-50' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-teal-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Up to {plan.listings === Infinity ? 'unlimited' : plan.listings} active listing{plan.listings !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">£{displayPrice}</span>
                  <span className="text-gray-400 text-sm mb-1">/month</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-xs text-green-600 font-medium mt-0.5">
                    Billed annually — saves £{(plan.price - plan.priceAnnual) * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f.text} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 font-bold flex-shrink-0 ${f.highlight ? 'text-coral-500' : 'text-teal-600'}`}>✓</span>
                    <span className={f.highlight ? 'text-gray-800 font-medium' : 'text-gray-600'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <div className="w-full text-center py-2.5 bg-gray-50 rounded-xl text-gray-500 text-sm font-medium border border-gray-200">
                  Current plan
                </div>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors text-sm disabled:opacity-60 ${
                    plan.popular
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                      : 'border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 text-gray-700 hover:text-teal-700'
                  }`}
                >
                  {loading === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Redirecting…
                    </span>
                  ) : (
                    <>
                      {plan.cta}
                      <span className="ml-1 text-xs opacity-70">— 14 days free</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        All prices ex-VAT. By subscribing you agree to our{' '}
        <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>.
        Need a custom plan? <a href="mailto:hello@worknest.co.uk" className="underline hover:text-gray-600">Get in touch</a>.
      </p>
    </div>
  )
}
