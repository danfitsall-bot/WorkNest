export type Plan = 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE'

export const PLAN_LIMITS: Record<Plan, {
  maxListings: number
  featured: boolean
  ats: boolean
  analytics: boolean
  cvSearch: boolean
  label: string
  price: number | null
  priceAnnual: number | null
}> = {
  FREE: {
    maxListings: 1,
    featured: false,
    ats: false,
    analytics: false,
    cvSearch: false,
    label: 'Free',
    price: 0,
    priceAnnual: 0,
  },
  STARTER: {
    maxListings: 3,
    featured: false,
    ats: false,
    analytics: true,
    cvSearch: false,
    label: 'Starter',
    price: 149,
    priceAnnual: 119,
  },
  GROWTH: {
    maxListings: 10,
    featured: true,
    ats: true,
    analytics: true,
    cvSearch: false,
    label: 'Growth',
    price: 349,
    priceAnnual: 279,
  },
  ENTERPRISE: {
    maxListings: Infinity,
    featured: true,
    ats: true,
    analytics: true,
    cvSearch: true,
    label: 'Enterprise',
    price: 899,
    priceAnnual: 719,
  },
}

export function canFeature(plan: Plan): boolean {
  return PLAN_LIMITS[plan].featured
}
