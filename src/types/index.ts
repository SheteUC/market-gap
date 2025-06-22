export interface ConsultingGroup {
  id: string;
  name: string;
  reports: number;
  description: string;
}

export interface MarketGap {
  id: string;
  description: string;
  marketSize: string;
  opportunityScore: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
}

export interface AudienceSignal {
  id: string;
  platform: 'reddit' | 'meetup' | 'producthunt';
  title: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  engagement: number;
}

export interface IdeaIteration {
  id: string;
  title: string;
  description: string;
  features: string[];
  targetMarket: string;
  businessModel: string;
  viabilityScore: number;
  technicalFeasibility: number;
  marketPotential: number;
  competitiveAdvantage: number;
  timestamp: string;
}

export interface Competitor {
  id: string;
  name: string;
  description: string;
  website: string;
  stage: 'Early Stage' | 'Growth' | 'Mature' | 'Enterprise';
  funding: string;
  similarity: number;
  differentiator: string;
}

export interface TechStackRecommendation {
  id: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'mobile';
  matchScore: number;
  technologies: {
    name: string;
    version: string;
    recommended: boolean;
  }[];
  reasoning: string[];
  resources: {
    name: string;
    url: string;
    type: 'docs' | 'tutorial' | 'course' | 'hands-on';
  }[];
  estimatedLearningTime?: string;
}