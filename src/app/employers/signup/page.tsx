import Link from 'next/link'

// Redirect to auth signup with employer role
export default function EmployerSignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Create your employer account</h1>
        <p className="text-gray-500 mb-6">Join 500+ employers finding flexible talent on WorkNest.</p>
        <Link
          href="/auth/signup?role=EMPLOYER"
          className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          Get started →
        </Link>
      </div>
    </div>
  )
}
