import Stripe from 'stripe'

// Lazy singleton — prevents build-time errors when env vars are not set
let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return _stripe
}

// Keep the named export for backwards-compatible imports
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop]
  },
})

export const STRIPE_PLANS = {
  STARTER: process.env.STRIPE_STARTER_PRICE_ID ?? '',
  GROWTH: process.env.STRIPE_GROWTH_PRICE_ID ?? '',
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? '',
}
