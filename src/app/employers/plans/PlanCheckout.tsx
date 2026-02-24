'use client'

import { useState } from 'react'

const PLANS = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: 149,
    listings: 3,
    features: ['3 active listings', 'Basic analytics', 'Email support'],
  },
  {
    id: 'GROWTH',
    name: 'Growth',
    price: 349,
    listings: 10,
    features: ['10 active listings', '1 featured listing', 'Full analytics', 'ATS integrations'],
    popular: true,
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 899,
    listings: Infinity,
    features: ['Unlimited listings', 'Parent Friendly Badge', 'CV search', 'Dedicated account manager'],
  },
]

export default function PlanCheckout({ currentPlan }: { currentPlan: string }) {
  const [loading, setLoading] = useState<string | null>(null)

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
    <div className="grid sm:grid-cols-3 gap-6">
      {PLANS.map(plan => (
        <div
          key={plan.id}
          className={`bg-white rounded-2xl border p-6 relative ${
            plan.popular ? 'border-teal-500 ring-2 ring-teal-500' : 'border-gray-200'
          }`}
        >
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
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-teal-600 font-bold">✓</span> {f}
              </li>
            ))}
          </ul>
          {currentPlan === plan.id ? (
            <div className="w-full text-center py-2.5 bg-gray-50 rounded-xl text-gray-500 text-sm font-medium">
              Current plan
            </div>
          ) : (
            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={loading === plan.id}
              className={`w-full py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-60 ${
                plan.popular
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {loading === plan.id ? 'Redirecting…' : 'Start free trial'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
