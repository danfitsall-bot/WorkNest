import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'WorkNest — Flexible Jobs for Parents',
    template: '%s | WorkNest',
  },
  description:
    'Find flexible, part-time, remote and family-friendly jobs. WorkNest is the UK\'s leading job board for parents returning to work.',
  keywords: ['flexible jobs', 'part-time jobs', 'remote jobs', 'jobs for parents', 'school hours jobs', 'term-time jobs'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'WorkNest',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-warm-50">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
