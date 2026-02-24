'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = session?.user as any

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Work<span className="text-teal-600">Nest</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              Find Jobs
            </Link>
            <Link href="/employers" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              Employers
            </Link>
            {session ? (
              <>
                {user?.role === 'EMPLOYER' && (
                  <Link href="/employers/dashboard" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                    Dashboard
                  </Link>
                )}
                {user?.role === 'SEEKER' && (
                  <Link href="/account" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                    My Jobs
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Sign out
                </button>
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-semibold text-sm">
                  {(session.user?.name ?? session.user?.email ?? 'U')[0].toUpperCase()}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/employers/signup"
                  className="bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors text-sm"
                >
                  Post a Job
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
            <Link href="/jobs" className="block px-2 py-2 text-gray-700 hover:text-teal-600 font-medium" onClick={() => setMobileOpen(false)}>
              Find Jobs
            </Link>
            <Link href="/employers" className="block px-2 py-2 text-gray-700 hover:text-teal-600 font-medium" onClick={() => setMobileOpen(false)}>
              Employers
            </Link>
            {session ? (
              <>
                {user?.role === 'EMPLOYER' && (
                  <Link href="/employers/dashboard" className="block px-2 py-2 text-gray-700 hover:text-teal-600 font-medium" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                )}
                {user?.role === 'SEEKER' && (
                  <Link href="/account" className="block px-2 py-2 text-gray-700 hover:text-teal-600 font-medium" onClick={() => setMobileOpen(false)}>
                    My Jobs
                  </Link>
                )}
                <button
                  onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }}
                  className="block w-full text-left px-2 py-2 text-gray-500 hover:text-gray-700 font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="block px-2 py-2 text-gray-700 hover:text-teal-600 font-medium" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
                <Link href="/employers/signup" className="block mx-2 mt-2 bg-coral-500 text-white font-semibold py-2.5 px-4 rounded-xl text-center" onClick={() => setMobileOpen(false)}>
                  Post a Job
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
