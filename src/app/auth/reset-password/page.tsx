import type { Metadata } from 'next'
import ResetPasswordForm from './ResetPasswordForm'

export const metadata: Metadata = { title: 'Reset Password' }

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string; email?: string } }) {
  if (!searchParams.token || !searchParams.email) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🔗</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid reset link</h1>
          <p className="text-gray-500 text-sm">This password reset link is invalid or has expired.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Set a new password</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Enter your new password below.</p>
        <ResetPasswordForm token={searchParams.token} email={searchParams.email} />
      </div>
    </div>
  )
}
