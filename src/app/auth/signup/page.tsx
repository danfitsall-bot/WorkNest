import { Suspense } from 'react'
import SignUpForm from './signup-form'

export const dynamic = 'force-dynamic'

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
