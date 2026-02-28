import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tips, insights and stories about flexible working, returning to work after a career break, and building parent-friendly workplaces.',
}

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog</h1>
      <p className="text-gray-500 mb-12">Tips, insights and stories about flexible working and parent-friendly workplaces.</p>

      <div className="text-center py-16">
        <p className="text-5xl mb-4">✍️</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Coming soon</h2>
        <p className="text-gray-500 text-sm mb-6">We&apos;re working on our first articles. Sign up to our newsletter to be the first to know.</p>
        <Link href="/#newsletter" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm">
          Subscribe to newsletter
        </Link>
      </div>
    </div>
  )
}
