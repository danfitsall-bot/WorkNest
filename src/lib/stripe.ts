import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export const STRIPE_PLANS = {
  STARTER: process.env.STRIPE_STARTER_PRICE_ID!,
  GROWTH: process.env.STRIPE_GROWTH_PRICE_ID!,
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
}
