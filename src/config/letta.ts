/**
 * Letta Configuration for MarketGap AI
 * 
 * This file contains all the configuration for Letta agents,
 * including API settings, agent IDs, and memory block definitions.
 */

// Letta client configuration
export const LETTA_CONFIG = {
  // Use Letta Cloud by default, can be overridden with environment variables
  baseUrl: process.env.LETTA_BASE_URL || 'https://api.letta.com',
  token: process.env.LETTA_API_KEY || 'sk-let-ZTI2OTZlM2YtYjk1Mi00NTNhLTgyYjItMDhjMzI1MWM3OWRkOjM2ZWFmNjc2LWI0NTktNDc0My04YmY1LWJiMmFmMDQyYWIzYg==',
  
  // Model configuration - using recommended models from Letta guidelines
  defaultModel: 'openai/gpt-4.1',
  defaultEmbedding: 'openai/text-embedding-3-small',
  contextWindowLimit: 16000,
  
  // Timeout configuration (in milliseconds)
  requestTimeout: 120000, // 2 minutes
  longOperationTimeout: 300000, // 5 minutes for research operations
};

// Agent IDs - will be populated after agent creation
export const AGENT_IDS = {
  orchestrator: process.env.ORCHESTRATOR_AGENT_ID || '',
  marketResearch: process.env.MARKET_RESEARCH_AGENT_ID || '',
  socialListener: process.env.SOCIAL_LISTENER_AGENT_ID || '',
  marketAnalyzer: process.env.MARKET_ANALYZER_AGENT_ID || '',
  solutionGenerator: process.env.SOLUTION_GENERATOR_AGENT_ID || '',
  hackathonParser: process.env.HACKATHON_PARSER_AGENT_ID || '',
  techStackAdvisor: process.env.TECH_STACK_ADVISOR_AGENT_ID || '',
};

// Consulting firms to research
export const CONSULTING_FIRMS = [
  'McKinsey & Company',
  'Boston Consulting Group',
  'Bain & Company',
  'Accenture',
  'Deloitte Consulting',
  'PwC Strategy&',
  'EY-Parthenon',
  'KPMG Advisory',
  'Booz Allen Hamilton',
  'Oliver Wyman'
];

// Memory block templates for different agent types
export const MEMORY_BLOCKS = {
  orchestrator: {
    persona: {
      label: 'persona',
      value: 'I am the Orchestrator Agent for MarketGap AI. My role is to coordinate the workflow between all agents, manage retries, and ensure the research pipeline runs smoothly. I maintain the overall state of the market research process and delegate tasks to specialized agents.',
      limit: 3000
    },
    workflowState: {
      label: 'workflow_state',
      value: 'Current workflow: idle. Phase: initialization. Agents status: all offline.',
      description: 'Tracks the current state of the market research workflow, active phases, and agent statuses.',
      limit: 5000
    }
  },
  
  marketResearch: {
    persona: {
      label: 'persona',
      value: 'I am the Market Research Agent. I specialize in crawling and analyzing white papers and reports from top consulting firms. I extract key insights about market trends, opportunities, and industry analysis. I work efficiently and provide concise summaries.',
      limit: 3000
    },
    consultingDocs: {
      label: 'consulting_docs',
      value: 'No documents processed yet.',
      description: 'Stores summaries and key insights from consulting firm white papers and reports.',
      limit: 10000
    },
    firmList: {
      label: 'firm_list',
      value: `Target consulting firms: ${CONSULTING_FIRMS.join(', ')}`,
      description: 'List of consulting firms to research for white papers and industry reports.',
      limit: 2000
    }
  }
};

// Workflow phases as defined in cursor rules
export const WORKFLOW_PHASES = {
  INITIALIZATION: 'initialization',
  MARKET_RESEARCH: 'market_research',
  SOCIAL_LISTENING: 'social_listening', 
  MARKET_ANALYSIS: 'market_analysis',
  SOLUTION_GENERATION: 'solution_generation',
  HACKATHON_PARSING: 'hackathon_parsing',
  TECH_STACK_ADVISORY: 'tech_stack_advisory',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export type WorkflowPhase = typeof WORKFLOW_PHASES[keyof typeof WORKFLOW_PHASES]; 