import type { Metadata } from 'next'
import ForgotPasswordForm from './ForgotPasswordForm'

export const metadata: Metadata = { title: 'Forgot Password' }

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Forgot your password?</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Enter your email and we&apos;ll send you a reset link.</p>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
