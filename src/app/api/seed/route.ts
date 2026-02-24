import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// One-time seed endpoint. Protected by SEED_SECRET env var.
// Call once after deployment: GET /api/seed?secret=YOUR_SEED_SECRET
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await prisma.job.count()
  if (existing > 0) {
    return NextResponse.json({ message: 'Already seeded', jobs: existing })
  }

  const hashedPw = await bcrypt.hash('demo1234', 12)

  async function getOrCreateUser(email: string, name: string) {
    return prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, hashedPassword: hashedPw, role: 'EMPLOYER' },
    })
  }

  const [u1, u2, u3, u4, u5, u6, u7] = await Promise.all([
    getOrCreateUser('monzo@demo.worknest.co.uk', 'Monzo Talent'),
    getOrCreateUser('octopus@demo.worknest.co.uk', 'Octopus Talent'),
    getOrCreateUser('bumble@demo.worknest.co.uk', 'Bumble Talent'),
    getOrCreateUser('deliveroo@demo.worknest.co.uk', 'Deliveroo Talent'),
    getOrCreateUser('shopify@demo.worknest.co.uk', 'Shopify Talent'),
    getOrCreateUser('canva@demo.worknest.co.uk', 'Canva Talent'),
    getOrCreateUser('vsmedia@demo.worknest.co.uk', 'VS Media Talent'),
  ])

  const companiesData = [
    { userId: u1.id, name: 'Monzo', slug: 'monzo', website: 'https://monzo.com', parentFriendlyBadge: true, plan: 'GROWTH', description: 'Monzo is a digital bank built for mobile.' },
    { userId: u2.id, name: 'Octopus Energy', slug: 'octopus-energy', website: 'https://octopusenergy.com', parentFriendlyBadge: true, plan: 'GROWTH', description: 'Octopus Energy is a UK energy supplier focused on renewable energy.' },
    { userId: u3.id, name: 'Bumble', slug: 'bumble', website: 'https://bumble.com', parentFriendlyBadge: true, plan: 'ENTERPRISE', description: 'Bumble is a social networking platform.' },
    { userId: u4.id, name: 'Deliveroo', slug: 'deliveroo', website: 'https://deliveroo.co.uk', parentFriendlyBadge: false, plan: 'STARTER', description: 'Deliveroo is an online food delivery company.' },
    { userId: u5.id, name: 'Shopify', slug: 'shopify', website: 'https://shopify.com', parentFriendlyBadge: true, plan: 'ENTERPRISE', description: 'Shopify is a leading e-commerce platform.' },
    { userId: u6.id, name: 'Canva', slug: 'canva', website: 'https://canva.com', parentFriendlyBadge: false, plan: 'GROWTH', description: 'Canva is a graphic design platform.' },
    { userId: u7.id, name: 'VS Media', slug: 'vs-media', website: null, parentFriendlyBadge: false, plan: 'FREE', description: 'VS Media is a UK-based digital marketing agency.' },
  ]

  const companies: Record<string, string> = {}
  for (const c of companiesData) {
    const co = await prisma.company.upsert({ where: { slug: c.slug }, update: {}, create: c })
    companies[c.slug] = co.id
  }

  const closing = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const jobs = [
    { companyId: companies['monzo'], title: 'Senior UX Designer', slug: 'senior-ux-designer-monzo', salaryMin: 70000, salaryMax: 95000, location: 'London', remote: false, partTime: false, featured: true, sector: 'Technology', tags: ['FOUR_DAY_WEEK', 'SCHOOL_HOURS'],
      description: "We're looking for a Senior UX Designer to join Monzo's product design team on a 4-day week.\n\nWhat you'll do:\n• Lead design on family banking features\n• Run user research with our parent customer segment\n• Collaborate with product and engineering\n• Mentor junior designers",
      requirements: "• 5+ years UX experience\n• Strong Figma portfolio\n• Experience with design systems" },
    { companyId: companies['octopus-energy'], title: 'Product Marketing Manager', slug: 'product-marketing-manager-octopus', salaryMin: 45000, salaryMax: 58000, location: 'London', remote: true, partTime: false, featured: false, sector: 'Marketing', tags: ['SCHOOL_HOURS', 'ASYNC'],
      description: "Join Octopus Energy on a part-time school hours (9am–3pm) basis across all 5 days.\n\nResponsibilities:\n• Own go-to-market strategy for new tariff launches\n• Write compelling copy for app, website, and email\n• Work with data teams to understand customer behaviour",
      requirements: "• 4+ years in product or content marketing\n• Strong writing skills\n• Comfortable with data and A/B testing" },
    { companyId: companies['bumble'], title: 'Engineering Manager', slug: 'engineering-manager-bumble', salaryMin: 120000, salaryMax: 150000, location: 'London', remote: true, partTime: false, featured: true, sector: 'Technology', tags: ['FOUR_DAY_WEEK', 'ASYNC'],
      description: "Bumble is hiring an Engineering Manager to lead two squads on a compressed 4-day week.\n\nYou'll:\n• Lead two squads of 6–8 engineers\n• Drive technical roadmap decisions\n• Build an inclusive team culture",
      requirements: "• 3+ years engineering management\n• Strong mobile background (iOS or Android)\n• Excellent communication skills" },
    { companyId: companies['deliveroo'], title: 'Data Analyst', slug: 'data-analyst-deliveroo', salaryMin: 42000, salaryMax: 55000, location: 'London', remote: false, partTime: false, featured: false, sector: 'Technology', tags: ['TERM_TIME'],
      description: "Deliveroo is looking for a Data Analyst on a term-time contract.\n\nKey responsibilities:\n• Build and maintain dashboards tracking key metrics\n• Conduct ad-hoc analysis to support commercial decisions\n• Present findings to non-technical stakeholders",
      requirements: "• Strong SQL skills (BigQuery)\n• Python or R for data analysis\n• Good data visualisation (Tableau, Looker)" },
    { companyId: companies['shopify'], title: 'Customer Success Manager', slug: 'customer-success-manager-shopify', salaryMin: 38000, salaryMax: 48000, location: 'Remote', remote: true, partTime: true, featured: false, sector: 'Operations', tags: ['JOB_SHARE', 'COMPRESSED_HOURS'],
      description: "Shopify is hiring a Customer Success Manager to work a 3-day week.\n\nResponsibilities:\n• Own a portfolio of 50–80 enterprise merchants\n• Onboard new customers and drive product adoption\n• Identify expansion opportunities",
      requirements: "• 3+ years in customer success or account management\n• Experience with SaaS or e-commerce\n• Strong empathy and communication skills" },
    { companyId: companies['canva'], title: 'Content Strategist', slug: 'content-strategist-canva', salaryMin: 48000, salaryMax: 62000, location: 'Remote', remote: true, partTime: false, featured: false, sector: 'Marketing', tags: ['ASYNC', 'FOUR_DAY_WEEK'],
      description: "Canva is hiring a Content Strategist for a fully async-first role — no set hours, no mandatory meetings.\n\nWhat you'll work on:\n• Develop quarterly content strategies for EMEA\n• Brief and edit content creators\n• Analyse performance and optimise",
      requirements: "• 3+ years in content strategy\n• Strong understanding of SEO\n• Experience managing content creators" },
    { companyId: companies['vs-media'], title: 'Social Media Manager (Part-Time)', slug: 'social-media-manager-vs-media', salaryMin: 22000, salaryMax: 28000, location: 'Manchester', remote: false, partTime: true, featured: false, sector: 'Marketing', tags: ['SCHOOL_HOURS'],
      description: "VS Media is looking for a Social Media Manager, 3 days per week, school hours.\n\nDay-to-day:\n• Plan and schedule content across platforms\n• Shoot and edit simple video content\n• Respond to comments and DMs\n• Produce monthly reports",
      requirements: "• Experience managing social media for brands\n• Creative eye and strong copywriting\n• Comfortable with Canva, CapCut" },
  ]

  let seeded = 0
  for (const { tags, ...job } of jobs) {
    await prisma.job.upsert({
      where: { slug: job.slug },
      update: {},
      create: { ...job, status: 'ACTIVE', flexible: true, closingDate: closing, tags: { create: tags.map(tag => ({ tag })) } },
    })
    seeded++
  }

  // Demo seeker account
  await getOrCreateUser('demo@worknest.co.uk', 'WorkNest Demo')

  return NextResponse.json({ success: true, jobsSeeded: seeded })
}
