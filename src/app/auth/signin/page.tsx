import { Suspense } from 'react'
import SignInForm from './signin-form'

export const dynamic = 'force-dynamic'

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}
