import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Authentication Error' }

export default function AuthErrorPage({ searchParams }: { searchParams: { error?: string } }) {
  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification link has expired or has already been used.',
    OAuthSignin: 'Could not start the sign in process. Please try again.',
    OAuthCallback: 'Could not complete the sign in process. Please try again.',
    OAuthAccountNotLinked: 'This email is already associated with another account. Please sign in with your original method.',
    CredentialsSignin: 'Invalid email or password. Please try again.',
    Default: 'An unexpected error occurred. Please try again.',
  }

  const errorType = searchParams.error ?? 'Default'
  const message = errorMessages[errorType] ?? errorMessages.Default

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">🔒</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in error</h1>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/auth/signin" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm">
            Try again
          </Link>
          <Link href="/" className="border border-gray-200 text-gray-600 font-medium py-2.5 px-6 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
