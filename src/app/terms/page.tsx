import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'WorkNest terms of service — rules and guidelines for using our platform.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-600 leading-relaxed text-sm">
        <p>Last updated: February 2026</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">1. Acceptance of Terms</h2>
        <p>By accessing and using WorkNest, you agree to be bound by these terms. If you do not agree, please do not use our services.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">2. Accounts</h2>
        <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. One person or legal entity per account.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">3. Job Seekers</h2>
        <p>You may browse and apply for jobs free of charge. Applications are sent directly to employers. WorkNest does not guarantee employment outcomes. You must not submit false or misleading information in applications.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">4. Employers</h2>
        <p>Employers may post job listings subject to their subscription plan. All listings must be genuine, paid positions with the flexibility described. Discriminatory listings are prohibited. WorkNest reserves the right to remove any listing.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">5. Payments &amp; Subscriptions</h2>
        <p>Subscription plans are billed monthly or annually via Stripe. You may cancel at any time through your billing portal. Refunds are handled on a case-by-case basis. Prices are in GBP and inclusive of VAT where applicable.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">6. Prohibited Conduct</h2>
        <p>You must not: scrape or data-mine our platform, post spam or misleading content, impersonate others, attempt to gain unauthorized access, or use the platform for any unlawful purpose.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">7. Limitation of Liability</h2>
        <p>WorkNest is provided &quot;as is&quot;. We are not liable for employment decisions, lost data, or service interruptions beyond our reasonable control.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">8. Contact</h2>
        <p>Questions about these terms? Email <a href="mailto:hello@worknest.co.uk" className="text-teal-600 hover:underline">hello@worknest.co.uk</a>.</p>
      </div>
    </div>
  )
}
