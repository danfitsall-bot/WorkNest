'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  name: string
  domain: string
  badge: boolean
}

export default function EmployerLogoCard({ name, domain, badge }: Props) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 min-w-[96px]">
      {!imgError ? (
        <Image
          src={`https://logo.clearbit.com/${domain}`}
          alt={`${name} logo`}
          width={48}
          height={48}
          className="rounded-xl object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
          <span className="text-lg font-bold text-teal-700">{name[0]}</span>
        </div>
      )}
      <span className="text-xs font-semibold text-gray-600 text-center leading-tight">{name}</span>
      {badge && (
        <span className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full font-medium">✓ Certified</span>
      )}
    </div>
  )
}
