import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About WorkNest',
  description: 'WorkNest is the UK\'s leading job board for parents seeking flexible, part-time, and family-friendly work.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About WorkNest</h1>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-600 leading-relaxed">
        <p>
          WorkNest is the UK&apos;s most parent-friendly job board. We connect talented professionals with employers
          who genuinely support flexible, part-time, remote, and family-first working arrangements.
        </p>
        <p>
          We believe that returning to work after a career break, or finding a role that fits around school hours,
          shouldn&apos;t mean compromising on career ambitions. Every job listed on WorkNest offers real flexibility —
          whether that&apos;s a 4-day week, term-time hours, job sharing, or fully remote positions.
        </p>
        <h2 className="text-xl font-bold text-gray-900 mt-8">Our Mission</h2>
        <p>
          To make flexible working the norm, not the exception. We&apos;re building a world where parents can thrive
          in their careers without sacrificing time with their families.
        </p>
        <h2 className="text-xl font-bold text-gray-900 mt-8">For Employers</h2>
        <p>
          Our Parent Friendly Badge programme recognises employers who go above and beyond for working parents.
          Companies with the badge attract higher-quality candidates and benefit from improved retention.
        </p>
        <h2 className="text-xl font-bold text-gray-900 mt-8">Contact</h2>
        <p>
          Questions, feedback, or partnership enquiries? Reach us at{' '}
          <a href="mailto:hello@worknest.co.uk" className="text-teal-600 hover:underline">hello@worknest.co.uk</a>.
        </p>
      </div>
    </div>
  )
}
