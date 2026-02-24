import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding WorkNest database…')

  // Create demo employer user
  const hashedPw = await bcrypt.hash('demo1234', 12)
  const employer = await prisma.user.upsert({
    where: { email: 'demo@worknest.co.uk' },
    update: {},
    create: {
      name: 'WorkNest Demo',
      email: 'demo@worknest.co.uk',
      hashedPassword: hashedPw,
      role: 'EMPLOYER',
    },
  })

  // Create company-specific employer accounts
  async function getOrCreateEmployerUser(email: string, name: string) {
    return prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, hashedPassword: hashedPw, role: 'EMPLOYER' },
    })
  }

  const [u1, u2, u3, u4, u5, u6, u7] = await Promise.all([
    getOrCreateEmployerUser('monzo@demo.worknest.co.uk', 'Monzo Talent'),
    getOrCreateEmployerUser('octopus@demo.worknest.co.uk', 'Octopus Talent'),
    getOrCreateEmployerUser('bumble@demo.worknest.co.uk', 'Bumble Talent'),
    getOrCreateEmployerUser('deliveroo@demo.worknest.co.uk', 'Deliveroo Talent'),
    getOrCreateEmployerUser('shopify@demo.worknest.co.uk', 'Shopify Talent'),
    getOrCreateEmployerUser('canva@demo.worknest.co.uk', 'Canva Talent'),
    getOrCreateEmployerUser('vsmedia@demo.worknest.co.uk', 'VS Media Talent'),
  ])

  // Create companies
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { slug: 'monzo' },
      update: {},
      create: {
        userId: u1.id,
        name: 'Monzo',
        slug: 'monzo',
        description: 'Monzo is a digital bank built for mobile. We believe that banking should be simpler and more flexible, and we\'re working to make that a reality.',
        website: 'https://monzo.com',
        parentFriendlyBadge: true,
        plan: 'GROWTH',
      },
    }),
    prisma.company.upsert({
      where: { slug: 'octopus-energy' },
      update: {},
      create: {
        userId: u2.id,
        name: 'Octopus Energy',
        slug: 'octopus-energy',
        description: 'Octopus Energy is a UK energy supplier focused on renewable energy, great customer service, and flexible working.',
        website: 'https://octopusenergy.com',
        parentFriendlyBadge: true,
        plan: 'GROWTH',
      },
    }),
    prisma.company.upsert({
      where: { slug: 'bumble' },
      update: {},
      create: {
        userId: u3.id,
        name: 'Bumble',
        slug: 'bumble',
        description: 'Bumble is a social networking platform with products that span dating, friendship, and professional networking.',
        website: 'https://bumble.com',
        parentFriendlyBadge: true,
        plan: 'ENTERPRISE',
      },
    }),
    prisma.company.upsert({
      where: { slug: 'deliveroo' },
      update: {},
      create: {
        userId: u4.id,
        name: 'Deliveroo',
        slug: 'deliveroo',
        description: 'Deliveroo is an online food delivery company operating in the UK, Europe, and Asia.',
        website: 'https://deliveroo.co.uk',
        parentFriendlyBadge: false,
        plan: 'STARTER',
      },
    }),
    prisma.company.upsert({
      where: { slug: 'shopify' },
      update: {},
      create: {
        userId: u5.id,
        name: 'Shopify',
        slug: 'shopify',
        description: 'Shopify is a leading e-commerce platform that enables businesses of all sizes to sell online.',
        website: 'https://shopify.com',
        parentFriendlyBadge: true,
        plan: 'ENTERPRISE',
      },
    }),
    prisma.company.upsert({
      where: { slug: 'canva' },
      update: {},
      create: {
        userId: u6.id,
        name: 'Canva',
        slug: 'canva',
        description: 'Canva is a graphic design platform used to create social media graphics, presentations, posters and other visual content.',
        website: 'https://canva.com',
        parentFriendlyBadge: false,
        plan: 'GROWTH',
      },
    }),
    prisma.company.upsert({
      where: { slug: 'vs-media' },
      update: {},
      create: {
        userId: u7.id,
        name: 'VS Media',
        slug: 'vs-media',
        description: 'VS Media is a UK-based digital marketing agency specialising in content strategy and brand growth.',
        website: null,
        parentFriendlyBadge: false,
        plan: 'FREE',
      },
    }),
  ])

  const [monzo, octopus, bumble, deliveroo, shopify, canva, vsMedia] = companies

  // Jobs from the prototype
  const jobsData = [
    {
      companyId: monzo.id,
      title: 'Senior UX Designer',
      slug: 'senior-ux-designer-monzo',
      description: `We're looking for a Senior UX Designer to join Monzo's product design team, working on features that help parents and families manage their finances better.

You'll work on a 4-day week schedule, with Fridays off as standard. Our flexible culture means school runs, pediatric appointments, and family emergencies always come first.

What you'll do:
• Lead design on our family banking features (joint accounts, pots, spending controls)
• Run user research sessions with our parent customer segment
• Collaborate with product and engineering to ship high-quality experiences
• Mentor junior designers and contribute to our design system`,
      requirements: `• 5+ years of UX design experience, ideally in fintech or consumer apps
• Strong portfolio demonstrating end-to-end product design
• Experience with Figma and design systems
• Comfortable presenting to senior stakeholders`,
      salaryMin: 70000,
      salaryMax: 95000,
      location: 'London',
      remote: false,
      flexible: true,
      partTime: false,
      featured: true,
      status: 'ACTIVE',
      sector: 'Technology',
      tags: [{ tag: 'FOUR_DAY_WEEK' }, { tag: 'SCHOOL_HOURS' }],
    },
    {
      companyId: octopus.id,
      title: 'Product Marketing Manager',
      slug: 'product-marketing-manager-octopus',
      description: `Join Octopus Energy's marketing team as a Product Marketing Manager, working part-time school hours (9am–3pm) across all 5 days.

We're on a mission to make green energy affordable for everyone, and we need great storytellers to help us get there. This role is designed from the ground up to work around school pickup.

Responsibilities:
• Own go-to-market strategy for new tariff launches
• Write compelling copy for our app, website, and email campaigns
• Work with data teams to understand customer behaviour
• Develop customer case studies and success stories`,
      requirements: `• 4+ years in product marketing or content marketing
• Strong writing skills with experience in consumer brands
• Comfortable with data and A/B testing
• Familiarity with energy sector a bonus but not required`,
      salaryMin: 45000,
      salaryMax: 58000,
      location: 'London',
      remote: true,
      flexible: true,
      partTime: false,
      featured: false,
      status: 'ACTIVE',
      sector: 'Marketing',
      tags: [{ tag: 'SCHOOL_HOURS' }, { tag: 'ASYNC' }],
    },
    {
      companyId: bumble.id,
      title: 'Engineering Manager',
      slug: 'engineering-manager-bumble',
      description: `Bumble is hiring an Engineering Manager to lead two squads building our iOS and Android apps. We run a compressed 4-day week with Fridays off.

As an Engineering Manager at Bumble, you'll:
• Lead two squads of 6–8 engineers each
• Drive technical roadmap and architecture decisions
• Build an inclusive team culture that celebrates diverse life experiences
• Partner with Product and Design on our app experience`,
      requirements: `• 3+ years of engineering management experience
• Strong technical background in mobile (iOS or Android)
• Track record of hiring and developing great engineers
• Excellent communication skills`,
      salaryMin: 120000,
      salaryMax: 150000,
      location: 'London',
      remote: true,
      flexible: true,
      partTime: false,
      featured: true,
      status: 'ACTIVE',
      sector: 'Technology',
      tags: [{ tag: 'FOUR_DAY_WEEK' }, { tag: 'ASYNC' }],
    },
    {
      companyId: deliveroo.id,
      title: 'Data Analyst',
      slug: 'data-analyst-deliveroo',
      description: `Deliveroo is looking for a Data Analyst to join our Consumer Insights team on a term-time contract. This is ideal for parents who want a break over school holidays.

You'll use SQL, Python, and Tableau to help us understand rider behaviour, restaurant performance, and customer satisfaction across our markets.

Key responsibilities:
• Build and maintain dashboards tracking key business metrics
• Conduct ad-hoc analysis to support commercial decisions
• Work with engineering to improve our data pipelines
• Present findings to non-technical stakeholders`,
      requirements: `• Strong SQL skills (we use BigQuery)
• Experience with Python or R for data analysis
• Good data visualisation skills (Tableau, Looker, or similar)
• Ability to communicate complex findings simply`,
      salaryMin: 42000,
      salaryMax: 55000,
      location: 'London',
      remote: false,
      flexible: true,
      partTime: false,
      featured: false,
      status: 'ACTIVE',
      sector: 'Technology',
      tags: [{ tag: 'TERM_TIME' }],
    },
    {
      companyId: shopify.id,
      title: 'Customer Success Manager',
      slug: 'customer-success-manager-shopify',
      description: `Shopify is hiring a Customer Success Manager to work a 3-day week, supporting our enterprise merchant relationships.

We believe the best people have full lives outside work — and our job share culture reflects that. This role can be structured as either 3 days/week solo or as part of a job share pair.

Responsibilities:
• Own a portfolio of 50–80 enterprise merchants
• Onboard new customers and drive product adoption
• Identify expansion and upsell opportunities
• Advocate for merchant needs internally`,
      requirements: `• 3+ years in customer success, account management, or similar
• Experience with SaaS or e-commerce platforms
• Strong empathy and communication skills
• Comfortable with CRM tools (Salesforce preferred)`,
      salaryMin: 38000,
      salaryMax: 48000,
      location: 'Remote',
      remote: true,
      flexible: true,
      partTime: true,
      featured: false,
      status: 'ACTIVE',
      sector: 'Operations',
      tags: [{ tag: 'JOB_SHARE' }, { tag: 'COMPRESSED_HOURS' }],
    },
    {
      companyId: canva.id,
      title: 'Content Strategist',
      slug: 'content-strategist-canva',
      description: `Canva is hiring a Content Strategist to join our EMEA marketing team. This is a fully async-first role — no set working hours, no mandatory meetings, just results.

You'll own our content calendar for UK and European markets, creating strategies that help small business owners discover and use Canva.

What you'll work on:
• Develop quarterly content strategies for EMEA
• Brief and edit content creators and agencies
• Analyse content performance and optimise accordingly
• Work with SEO team on organic growth initiatives`,
      requirements: `• 3+ years in content strategy or content marketing
• Strong understanding of SEO and organic content
• Experience managing content creators and agencies
• Portfolio of content that drove measurable results`,
      salaryMin: 48000,
      salaryMax: 62000,
      location: 'Remote',
      remote: true,
      flexible: true,
      partTime: false,
      featured: false,
      status: 'ACTIVE',
      sector: 'Marketing',
      tags: [{ tag: 'ASYNC' }, { tag: 'FOUR_DAY_WEEK' }],
    },
    {
      companyId: vsMedia.id,
      title: 'Social Media Manager (Part-Time)',
      slug: 'social-media-manager-vs-media',
      description: `VS Media is looking for a creative Social Media Manager to run accounts for our growing portfolio of lifestyle and wellness brands. Part-time, 3 days per week, school-hours.

You'll manage Instagram, TikTok, and LinkedIn for 5–8 brands, creating content, scheduling posts, and growing engaged communities.

Day-to-day:
• Plan and schedule content across platforms
• Shoot and edit simple video content (training provided)
• Respond to comments and DMs
• Produce monthly reports on follower growth and engagement`,
      requirements: `• Experience managing social media for brands (in-house or agency)
• Creative eye and strong copywriting skills
• Comfortable with Canva, CapCut, or similar tools
• Organised and able to manage multiple brands simultaneously`,
      salaryMin: 22000,
      salaryMax: 28000,
      location: 'Manchester',
      remote: false,
      flexible: true,
      partTime: true,
      featured: false,
      status: 'ACTIVE',
      sector: 'Marketing',
      tags: [{ tag: 'SCHOOL_HOURS' }],
    },
  ]

  for (const jobData of jobsData) {
    const { tags, ...rest } = jobData
    await prisma.job.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        ...rest,
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        tags: { create: tags },
      },
    })
    console.log(`✓ Seeded job: ${rest.title}`)
  }

  // Newsletter subscribers
  for (const email of ['demo1@example.com', 'demo2@example.com']) {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })
  }

  console.log('\n✅ Seed complete!')
  console.log('Demo login: demo@worknest.co.uk / demo1234')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
