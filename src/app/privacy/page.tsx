import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'WorkNest privacy policy — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-600 leading-relaxed text-sm">
        <p>Last updated: February 2026</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">1. Information We Collect</h2>
        <p>We collect information you provide when creating an account (name, email, password), applying for jobs (cover letters), and posting job listings. We also collect usage data through cookies and analytics.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">2. How We Use Your Information</h2>
        <p>We use your data to provide our job board services, match candidates with employers, send relevant job alerts, process payments, and improve our platform. We never sell your personal data to third parties.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">3. Data Sharing</h2>
        <p>When you apply for a job, your name, email, and cover letter are shared with the employer. Employers can see applicant information only for their own job listings. We use Stripe for payment processing and Resend for email delivery.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">4. Data Retention</h2>
        <p>We retain your account data for as long as your account is active. You may request deletion of your data at any time by contacting us at hello@worknest.co.uk.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">5. Your Rights (UK GDPR)</h2>
        <p>You have the right to access, rectify, or erase your personal data. You may also object to processing or request data portability. Contact us to exercise these rights.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">6. Cookies</h2>
        <p>We use essential cookies for authentication and session management. We may use analytics cookies to understand usage patterns. You can manage cookie preferences in your browser settings.</p>
        <h2 className="text-lg font-bold text-gray-900 mt-6">7. Contact</h2>
        <p>For privacy-related enquiries, email <a href="mailto:hello@worknest.co.uk" className="text-teal-600 hover:underline">hello@worknest.co.uk</a>.</p>
      </div>
    </div>
  )
}
