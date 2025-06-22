import type { 
  ConsultingGroup, 
  MarketGap, 
  AudienceSignal, 
  IdeaIteration, 
  Competitor,
  TechStackRecommendation 
} from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getConsultingGroups(): Promise<ConsultingGroup[]> {
  await delay(800);
  
  return [
    {
      id: 'mckinsey',
      name: 'McKinsey & Company',
      reports: 847,
      description: 'Global management consulting firm',
    },
    {
      id: 'bcg',
      name: 'Boston Consulting Group',
      reports: 623,
      description: 'Strategic consulting and digital solutions',
    },
    {
      id: 'bain',
      name: 'Bain & Company',
      reports: 456,
      description: 'Management consulting and private equity',
    },
    {
      id: 'deloitte',
      name: 'Deloitte Consulting',
      reports: 1204,
      description: 'Professional services and consulting',
    },
    {
      id: 'pwc',
      name: 'PwC Strategy&',
      reports: 892,
      description: 'Strategy consulting and transformation',
    },
  ];
}

export async function startPdfCrawl(industry: string, groupId: string): Promise<void> {
  await delay(500);
  // This would initiate the PDF crawling process
  console.log(`Starting PDF crawl for ${industry} using ${groupId}`);
}

export async function getGapList(): Promise<MarketGap[]> {
  await delay(1200);
  
  return [
    {
      id: 'gap-1',
      description: 'SME Banking Infrastructure in Emerging Markets',
      marketSize: '$127B',
      opportunityScore: 94,
      severity: 'critical',
      category: 'Financial Infrastructure',
    },
    {
      id: 'gap-2',
      description: 'Cross-border Payment Solutions for Freelancers',
      marketSize: '$89B',
      opportunityScore: 87,
      severity: 'high',
      category: 'Digital Payments',
    },
    {
      id: 'gap-3',
      description: 'AI-Powered Personal Finance for Gen Z',
      marketSize: '$45B',
      opportunityScore: 82,
      severity: 'high',
      category: 'Personal Finance',
    },
    {
      id: 'gap-4',
      description: 'Micro-investment Platforms for Rural Areas',
      marketSize: '$34B',
      opportunityScore: 76,
      severity: 'medium',
      category: 'Investment Tech',
    },
    {
      id: 'gap-5',
      description: 'Insurance Tech for Gig Economy Workers',
      marketSize: '$67B',
      opportunityScore: 71,
      severity: 'medium',
      category: 'InsurTech',
    },
    {
      id: 'gap-6',
      description: 'B2B Buy-Now-Pay-Later Solutions',
      marketSize: '$156B',
      opportunityScore: 68,
      severity: 'medium',
      category: 'Credit Solutions',
    },
  ];
}

export async function streamAudienceSignals(): Promise<Record<string, AudienceSignal[]>> {
  await delay(1000);
  
  return {
    reddit: [
      {
        id: 'r1',
        platform: 'reddit',
        title: 'Small business banking is still broken in 2024',
        content: 'Trying to get a business account as a freelancer is nightmare. Why do banks make it so complicated?',
        sentiment: 'negative',
        timestamp: '2 hours ago',
        engagement: 45,
      },
      {
        id: 'r2',
        platform: 'reddit',
        title: 'Found an amazing fintech solution for SMEs',
        content: 'This new platform finally solved our payment processing issues. Game changer for small businesses.',
        sentiment: 'positive',
        timestamp: '4 hours ago',
        engagement: 23,
      },
      {
        id: 'r3',
        platform: 'reddit',
        title: 'Cross-border payments still expensive',
        content: 'Paying 3-5% fees for international transfers in 2024 feels outdated. There must be better solutions.',
        sentiment: 'negative',
        timestamp: '6 hours ago',
        engagement: 67,
      },
    ],
    meetup: [
      {
        id: 'm1',
        platform: 'meetup',
        title: 'FinTech Startup Pitch Night - SF',
        content: 'Looking for solutions to SME banking challenges. Great turnout with 200+ attendees interested in fintech innovation.',
        sentiment: 'positive',
        timestamp: '1 day ago',
        engagement: 120,
      },
      {
        id: 'm2',
        platform: 'meetup',
        title: 'Digital Banking Discussion Group',
        content: 'Discussed pain points in current banking infrastructure. Many entrepreneurs struggling with basic business banking.',
        sentiment: 'neutral',
        timestamp: '2 days ago',
        engagement: 85,
      },
    ],
    producthunt: [
      {
        id: 'p1',
        platform: 'producthunt',
        title: 'BankingX - Modern SME Banking Platform',
        content: 'Finally, a banking platform built for modern small businesses. Clean interface, fast setup, reasonable fees.',
        sentiment: 'positive',
        timestamp: '1 day ago',
        engagement: 234,
      },
      {
        id: 'p2',
        platform: 'producthunt',
        title: 'PayGlobal - Cross-border Payment Solution',
        content: 'Another payment processor entering the crowded market. Not sure what makes this different from others.',
        sentiment: 'neutral',
        timestamp: '3 days ago',
        engagement: 89,
      },
    ],
  };
}

export async function iterateIdeas(problemId: string): Promise<IdeaIteration> {
  await delay(2000);
  
  const iterations = [
    {
      id: 'idea-1',
      title: 'NeoBank for SME Digital Infrastructure',
      description: 'A comprehensive digital banking platform specifically designed for small and medium enterprises in emerging markets, featuring multilingual support, local payment integrations, and simplified KYC processes.',
      features: [
        'Multi-currency account management',
        'Integrated payment processing',
        'AI-powered expense categorization',
        'Local regulatory compliance automation',
        'Mobile-first interface with offline capabilities',
      ],
      targetMarket: 'SMEs in Southeast Asia, Latin America, and Africa with 1-50 employees',
      businessModel: 'Freemium model with transaction fees (0.5-1.2%) and premium features subscription ($29-99/month)',
      viabilityScore: 84,
      technicalFeasibility: 8,
      marketPotential: 9,
      competitiveAdvantage: 7,
      timestamp: new Date().toLocaleString(),
    },
    {
      id: 'idea-2',
      title: 'SME Banking API Ecosystem',
      description: 'White-label banking infrastructure that enables local banks to quickly launch SME-focused digital services, reducing time-to-market from years to months.',
      features: [
        'Plug-and-play banking APIs',
        'Customizable SME dashboard',
        'Risk assessment algorithms',
        'Integration with local payment providers',
        'Regulatory compliance modules',
      ],
      targetMarket: 'Regional banks and credit unions in emerging markets',
      businessModel: 'B2B SaaS licensing ($50-200K setup) + revenue share (0.1-0.3% of processed volume)',
      viabilityScore: 91,
      technicalFeasibility: 9,
      marketPotential: 8,
      competitiveAdvantage: 9,
      timestamp: new Date().toLocaleString(),
    },
  ];
  
  return iterations[Math.floor(Math.random() * iterations.length)];
}

export async function getCompetitors(ideaId: string): Promise<Competitor[]> {
  await delay(1500);
  
  return [
    {
      id: 'comp-1',
      name: 'Wise Business',
      description: 'Multi-currency accounts and international payments for businesses',
      website: 'https://wise.com/business',
      stage: 'Mature',
      funding: '$1.3B',
      similarity: 72,
      differentiator: 'Strong in international transfers, weak in emerging market SME features',
    },
    {
      id: 'comp-2',
      name: 'Mercury',
      description: 'Digital banking for startups and growing businesses',
      website: 'https://mercury.com',
      stage: 'Growth',
      funding: '$120M',
      similarity: 68,
      differentiator: 'US-focused, excellent UX but limited international presence',
    },
    {
      id: 'comp-3',
      name: 'Revolut Business',
      description: 'Business accounts with global payment capabilities',
      website: 'https://revolut.com/business',
      stage: 'Mature',
      funding: '$916M',
      similarity: 75,
      differentiator: 'European focus, expanding globally but complex SME onboarding',
    },
    {
      id: 'comp-4',
      name: 'Brex',
      description: 'Corporate cards and spend management for growing companies',
      website: 'https://brex.com',
      stage: 'Growth',
      funding: '$742M',
      similarity: 45,
      differentiator: 'Focus on spend management vs comprehensive banking',
    },
    {
      id: 'comp-5',
      name: 'Payoneer',
      description: 'Global payment platform for businesses and professionals',
      website: 'https://payoneer.com',
      stage: 'Enterprise',
      funding: 'Public',
      similarity: 61,
      differentiator: 'Strong in freelancer payments, weaker in full banking services',
    },
    {
      id: 'comp-6',
      name: 'Ramp',
      description: 'Corporate cards and expense management with financial automation',
      website: 'https://ramp.com',
      stage: 'Growth',
      funding: '$750M',
      similarity: 38,
      differentiator: 'Expense management focus, limited international capabilities',
    },
  ];
}

export async function parseHackathon(url: string): Promise<any> {
  await delay(2000);
  
  // Mock hackathon parsing result
  return {
    name: 'FinTech Innovation Challenge 2024',
    description: 'Build the future of financial technology',
    deadline: '2024-03-15',
    categories: [
      { id: 'main', name: 'Grand Prize', prize: '$10,000' },
      { id: 'fintech', name: 'Best FinTech Solution', prize: '$5,000' },
      { id: 'sustainability', name: 'Sustainability Track', prize: '$3,000' },
    ],
    sponsors: ['Visa', 'Mastercard', 'Stripe'],
    requirements: ['Working prototype', 'Business plan', 'Demo video'],
  };
}

export async function getTechStack(ideaId: string): Promise<TechStackRecommendation[]> {
  await delay(1800);
  
  return [
    {
      id: 'frontend-rec',
      category: 'frontend',
      matchScore: 89,
      technologies: [
        { name: 'React', version: '18+', recommended: true },
        { name: 'Next.js', version: '14+', recommended: true },
        { name: 'TypeScript', version: '5+', recommended: true },
        { name: 'Tailwind CSS', version: '3+', recommended: false },
        { name: 'Ant Design', version: '5+', recommended: true },
      ],
      reasoning: [
        'React ecosystem provides excellent mobile-first responsive capabilities',
        'Next.js offers SSR for better SEO and performance in emerging markets',
        'TypeScript ensures code reliability for financial applications',
        'Ant Design provides enterprise-grade components perfect for banking UIs',
      ],
      resources: [
        { name: 'React Documentation', url: 'https://react.dev', type: 'docs' },
        { name: 'Next.js Learn', url: 'https://nextjs.org/learn', type: 'tutorial' },
        { name: 'TypeScript Handbook', url: 'https://typescriptlang.org/docs', type: 'docs' },
      ],
      estimatedLearningTime: '2-3 months for proficiency',
    },
    {
      id: 'backend-rec',
      category: 'backend',
      matchScore: 92,
      technologies: [
        { name: 'Node.js', version: '20+', recommended: true },
        { name: 'Express.js', version: '4+', recommended: true },
        { name: 'Fastify', version: '4+', recommended: false },
        { name: 'Prisma', version: '5+', recommended: true },
        { name: 'JWT', version: 'latest', recommended: true },
      ],
      reasoning: [
        'Node.js enables JavaScript across the full stack',
        'Express.js is battle-tested for banking applications',
        'Prisma provides type-safe database operations',
        'JWT handles secure authentication for financial services',
      ],
      resources: [
        { name: 'Node.js Guides', url: 'https://nodejs.org/en/docs/guides', type: 'docs' },
        { name: 'Express.js Guide', url: 'https://expressjs.com/en/guide', type: 'docs' },
        { name: 'Prisma Tutorials', url: 'https://prisma.io/docs', type: 'tutorial' },
      ],
      estimatedLearningTime: '3-4 months for banking-grade security',
    },
    {
      id: 'database-rec',
      category: 'database',
      matchScore: 86,
      technologies: [
        { name: 'PostgreSQL', version: '15+', recommended: true },
        { name: 'Redis', version: '7+', recommended: true },
        { name: 'MongoDB', version: '7+', recommended: false },
        { name: 'InfluxDB', version: '2+', recommended: false },
      ],
      reasoning: [
        'PostgreSQL offers ACID compliance required for financial transactions',
        'Redis provides fast caching for real-time banking operations',
        'Strong consistency guarantees essential for banking applications',
        'Excellent JSON support for flexible SME data structures',
      ],
      resources: [
        { name: 'PostgreSQL Tutorial', url: 'https://postgresql.org/docs', type: 'docs' },
        { name: 'Redis University', url: 'https://university.redis.com', type: 'course' },
      ],
      estimatedLearningTime: '2-3 months for financial data modeling',
    },
    {
      id: 'cloud-rec',
      category: 'cloud',
      matchScore: 78,
      technologies: [
        { name: 'AWS', version: 'latest', recommended: true },
        { name: 'Docker', version: '24+', recommended: true },
        { name: 'Kubernetes', version: '1.28+', recommended: false },
        { name: 'Terraform', version: '1.6+', recommended: true },
      ],
      reasoning: [
        'AWS provides comprehensive financial services compliance',
        'Docker ensures consistent deployments across regions',
        'Terraform enables infrastructure as code for compliance',
        'AWS has strong presence in emerging markets',
      ],
      resources: [
        { name: 'AWS Free Tier', url: 'https://aws.amazon.com/free', type: 'hands-on' },
        { name: 'Docker Getting Started', url: 'https://docker.com/get-started', type: 'tutorial' },
      ],
      estimatedLearningTime: '4-6 months for production deployment',
    },
  ];
}