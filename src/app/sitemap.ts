import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  let jobs: { slug: string; updatedAt: Date }[] = []
  let companies: { slug: string; updatedAt: Date }[] = []

  try {
    ;[jobs, companies] = await Promise.all([
      prisma.job.findMany({ where: { status: 'ACTIVE' }, select: { slug: true, updatedAt: true } }),
      prisma.company.findMany({ select: { slug: true, updatedAt: true } }),
    ])
  } catch {
    // DB not available at build time; return static pages only
  }

  const staticPages = ['', '/jobs', '/employers', '/about'].map(path => ({
    url: `${appUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const jobPages = jobs.map(job => ({
    url: `${appUrl}/jobs/${job.slug}`,
    lastModified: job.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const companyPages = companies.map(co => ({
    url: `${appUrl}/companies/${co.slug}`,
    lastModified: co.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...jobPages, ...companyPages]
}
