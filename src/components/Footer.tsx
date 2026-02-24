import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">W</span>
              </div>
              <span className="text-white font-bold text-lg">WorkNest</span>
            </div>
            <p className="text-sm leading-relaxed">
              The UK&apos;s most parent-friendly job board. Flexible, part-time, and family-first roles.
            </p>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/jobs?remote=true" className="hover:text-white transition-colors">Remote Jobs</Link></li>
              <li><Link href="/jobs?tag=school_hours" className="hover:text-white transition-colors">School Hours</Link></li>
              <li><Link href="/jobs?tag=four_day" className="hover:text-white transition-colors">4-Day Week</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Employers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/employers" className="hover:text-white transition-colors">Post Jobs</Link></li>
              <li><Link href="/employers/plans" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/employers/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/employers#certification" className="hover:text-white transition-colors">Parent Friendly Badge</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} WorkNest. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-teal-900 text-teal-300 px-2 py-1 rounded-full">🌿 Carbon neutral hosting</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
