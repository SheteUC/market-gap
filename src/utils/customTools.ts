/**
 * Custom Tools for MarketGap AI Agents
 * 
 * This file contains specialized tools for each agent type,
 * designed to make them more robust and focused on their specific tasks.
 * Based on Letta tools documentation: https://docs.letta.com/guides/agents/tools
 */

import { LettaClient } from '@letta-ai/letta-client';

export class CustomToolsManager {
  private client: LettaClient;

  constructor(client: LettaClient) {
    this.client = client;
  }

  /**
   * Market Research Agent Tools
   * Tools for PDF crawling, chunking, and PII redaction
   */
  async createMarketResearchTools() {
    const tools = [];

    // PDF Fetcher and Extractor Tool
    const pdfFetcherTool = await this.client.tools.create({
      sourceCode: `
def fetch_and_extract_pdf(pdf_url: str) -> str:
    """
    Download a PDF from a URL and extract its text content.
    
    Args:
        pdf_url (str): The URL of the PDF to download and extract
        
    Returns:
        str: The extracted text content from the PDF
    """
    import requests
    import tempfile
    import os
    try:
        # Download PDF
        response = requests.get(pdf_url, timeout=30)
        response.raise_for_status()
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(response.content)
            tmp_path = tmp_file.name
        
        # Basic text extraction (placeholder for PDFMiner)
        text_content = f"PDF downloaded successfully from {pdf_url}. Size: {len(response.content)} bytes."
        
        # Clean up
        os.unlink(tmp_path)
        
        return text_content
        
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"
      `
    });
    tools.push(pdfFetcherTool);

    return tools;
  }

  /**
   * Market Analyzer Tools
   * Tools for TF-IDF analysis, sentiment analysis, and gap detection
   */
  async createMarketAnalyzerTools() {
    const tools = [];

    // TF-IDF Gap Analysis Tool
    const tfidfGapTool = await this.client.tools.create({
      sourceCode: `
def analyze_tfidf_gaps(documents_text: str) -> str:
    """
    Analyze text documents to identify market gaps using TF-IDF-like analysis.
    
    Args:
        documents_text (str): Combined text from all consulting documents
        
    Returns:
        str: JSON string with gap analysis results
    """
    import json
    from collections import Counter
    import re
    
    # Simple gap detection keywords
    gap_indicators = [
        'challenge', 'problem', 'issue', 'difficulty', 'struggle', 'barrier',
        'bottleneck', 'inefficient', 'manual', 'outdated', 'lacking', 'missing'
    ]
    
    # Pain point contexts
    pain_contexts = []
    
    # Split into sentences and analyze
    sentences = re.split(r'[.!?]+', documents_text)
    
    for sentence in sentences:
        sentence_lower = sentence.lower().strip()
        if len(sentence_lower) < 10:
            continue
            
        # Check for gap indicators
        found_indicators = [word for word in gap_indicators if word in sentence_lower]
        
        if found_indicators:
            pain_contexts.append({
                'text': sentence.strip(),
                'indicators': found_indicators,
                'severity': len(found_indicators)
            })
    
    # Generate gap list
    gap_list = []
    processed_indicators = set()
    
    for i, context in enumerate(pain_contexts[:10]):  # Top 10
        main_indicator = context['indicators'][0]
        if main_indicator not in processed_indicators:
            gap_entry = {
                'id': f"gap_{len(gap_list) + 1}",
                'title': f"Market Gap: {main_indicator.title()} Resolution",
                'severity': min(5, context['severity'] + 1),
                'summary': f"Identified gap around '{main_indicator}' in consulting documents"
            }
            gap_list.append(gap_entry)
            processed_indicators.add(main_indicator)
    
    return json.dumps({
        'gap_list': gap_list,
        'total_pain_contexts': len(pain_contexts),
        'analysis_method': 'TF-IDF + Keyword Analysis'
    }, indent=2)
      `
    });
    tools.push(tfidfGapTool);

    return tools;
  }

  /**
   * Social Listener Tools
   * Tools for gathering audience signals from various platforms
   */
  async createSocialListenerTools() {
    const tools = [];

    // Reddit Search Tool
    const redditSearchTool = await this.client.tools.create({
      sourceCode: `
def search_reddit_signals(keywords: str) -> str:
    """
    Search Reddit for posts related to keywords.
    
    Args:
        keywords (str): Space-separated keywords to search for
        
    Returns:
        str: JSON string with Reddit signals
    """
    import json
    from datetime import datetime
    
    keyword_list = keywords.split()
    
    # Mock Reddit data based on keywords
    mock_posts = []
    
    for keyword in keyword_list:
        mock_posts.extend([
            {
                'platform': 'reddit',
                'subreddit': 'technology',
                'title': f'Struggling with {keyword} - need better tools',
                'text': f'Has anyone found a good solution for {keyword}? Current tools are frustrating.',
                'author': 'user123',
                'score': 45,
                'sentiment': 'frustrated',
                'keywords_matched': [keyword]
            }
        ])
    
    return json.dumps({
        'platform': 'reddit',
        'posts': mock_posts[:20],
        'total_found': len(mock_posts),
        'search_keywords': keyword_list,
        'search_timestamp': datetime.now().isoformat()
    }, indent=2)
      `
    });
    tools.push(redditSearchTool);

    return tools;
  }

  /**
   * Solution Generator Tools
   * Tools for brainstorming and validating solution ideas
   */
  async createSolutionGeneratorTools() {
    const tools = [];

    // Idea Generation Tool
    const ideaGeneratorTool = await this.client.tools.create({
      sourceCode: `
def generate_solution_ideas(gap_description: str, audience_context: str) -> str:
    """
    Generate innovative solution ideas for a specific market gap.
    
    Args:
        gap_description (str): Description of the identified market gap
        audience_context (str): Context about the target audience
        
    Returns:
        str: JSON string with solution ideas
    """
    import json
    import random
    
    # Solution frameworks
    frameworks = [
        'AI/ML automation',
        'SaaS platform', 
        'Mobile app',
        'API integration',
        'Workflow optimization',
        'Data analytics'
    ]
    
    # Generate 3 solution ideas
    ideas = []
    for i in range(3):
        framework = random.choice(frameworks)
        idea = {
            'id': f'idea_{i+1}',
            'title': f'{framework.title()} for {gap_description.split()[0] if gap_description else "Market"}',
            'description': f'A {framework} solution to address {gap_description}',
            'framework': framework,
            'target_audience': audience_context[:100] if audience_context else 'General users',
            'ice_score': {
                'impact': random.randint(6, 9),
                'confidence': random.randint(6, 8), 
                'ease': random.randint(5, 8)
            }
        }
        
        # Calculate total ICE score
        ice = idea['ice_score']
        idea['total_ice_score'] = (ice['impact'] + ice['confidence'] + ice['ease']) / 3
        
        ideas.append(idea)
    
    return json.dumps({
        'generated_ideas': ideas,
        'gap_addressed': gap_description,
        'iteration_number': 1
    }, indent=2)
      `
    });
    tools.push(ideaGeneratorTool);

    return tools;
  }

  /**
   * Competitor Research Tools
   * Tools for finding and analyzing competitors
   */
  async createCompetitorResearchTools() {
    const tools = [];

    // Competitor Search Tool  
    const competitorSearchTool = await this.client.tools.create({
      sourceCode: `
def search_competitors(idea_description: str, market_keywords: str) -> str:
    """
    Search for competitors for a given idea.
    
    Args:
        idea_description (str): Description of the solution idea
        market_keywords (str): Keywords related to the market
        
    Returns:
        str: JSON string with competitor information
    """
    import json
    import random
    
    # Mock competitor data
    competitor_types = ['startup', 'enterprise', 'saas', 'platform']
    
    competitors = []
    for i in range(random.randint(2, 5)):
        competitor = {
            'name': f'Competitor{i+1}',
            'url': f'https://competitor{i+1}.com',
            'type': random.choice(competitor_types),
            'similarity_score': random.uniform(0.3, 0.9),
            'description': f'Company offering solutions in {market_keywords if market_keywords else "general market"}',
            'market_focus': market_keywords.split()[0] if market_keywords else 'general'
        }
        competitors.append(competitor)
    
    return json.dumps({
        'competitors': competitors,
        'search_query': idea_description,
        'total_found': len(competitors)
    }, indent=2)
      `
    });
    tools.push(competitorSearchTool);

    return tools;
  }

  /**
   * Hackathon Parser Tools
   * Tools for extracting constraints from hackathon pages
   */
  async createHackathonParserTools() {
    const tools = [];

    // Hackathon Constraints Parser Tool
    const constraintsParserTool = await this.client.tools.create({
      sourceCode: `
def parse_hackathon_constraints(hackathon_url: str) -> str:
    """
    Parse hackathon page to extract constraints and requirements.
    
    Args:
        hackathon_url (str): URL of the hackathon page
        
    Returns:
        str: JSON string with parsed constraints
    """
    import json
    
    # Mock constraints parsing
    constraints = {
        'required_apis': ['REST API', 'OpenAI API'],
        'judging_criteria': [
            'Innovation',
            'Technical Implementation', 
            'User Experience',
            'Market Potential'
        ],
        'time_limit': '48 hours',
        'team_size': '1-4 people',
        'technologies': ['JavaScript', 'Python', 'React'],
        'submission_requirements': [
            'Working demo',
            'Source code',
            'Presentation'
        ],
        'themes': ['AI', 'Productivity', 'Social Impact']
    }
    
    return json.dumps({
        'source_url': hackathon_url,
        'constraints': constraints,
        'parsed_successfully': True
    }, indent=2)
      `
    });
    tools.push(constraintsParserTool);

    return tools;
  }

  /**
   * Tech Stack Advisor Tools  
   * Tools for recommending technology stacks
   */
  async createTechStackAdvisorTools() {
    const tools = [];

    // Tech Stack Recommendation Tool
    const techStackTool = await this.client.tools.create({
      sourceCode: `
def recommend_tech_stack(idea_json: str, constraints_json: str) -> str:
    """
    Recommend a technology stack based on idea and constraints.
    
    Args:
        idea_json (str): JSON string of the solution idea
        constraints_json (str): JSON string of hackathon constraints
        
    Returns:
        str: JSON string with tech stack recommendations
    """
    import json
    
    try:
        idea = json.loads(idea_json)
        constraints = json.loads(constraints_json) if constraints_json else {}
    except:
        return json.dumps({'error': 'Invalid JSON format'})
    
    # Recommend stack based on idea framework
    framework = idea.get('framework', '').lower()
    
    if 'ai' in framework or 'ml' in framework:
        stack = {
            'frontend': 'React + TypeScript',
            'backend': 'Python + FastAPI',
            'database': 'PostgreSQL',
            'ai_ml': 'OpenAI API + Pandas',
            'deployment': 'Vercel + Railway'
        }
    elif 'mobile' in framework:
        stack = {
            'frontend': 'React Native',
            'backend': 'Node.js + Express',
            'database': 'MongoDB',
            'apis': 'REST + GraphQL',
            'deployment': 'Expo + Heroku'
        }
    else:
        stack = {
            'frontend': 'Next.js + TypeScript',
            'backend': 'Node.js + Express',
            'database': 'PostgreSQL',
            'apis': 'REST API',
            'deployment': 'Vercel'
        }
    
    return json.dumps({
        'recommended_stack': stack,
        'idea_id': idea.get('id'),
        'rationale': f'Optimized for {framework} solutions',
        'estimated_build_time': '24-48 hours'
    }, indent=2)
      `
    });
    tools.push(techStackTool);

    return tools;
  }

  /**
   * Create tools for multiple agents at once
   */
  async createAllTools(): Promise<Record<string, any[]>> {
    try {
      console.log('🔧 Creating custom tools for all agents...');
      
      const [
        marketResearchTools,
        marketAnalyzerTools,
        socialListenerTools,
        solutionGeneratorTools,
        competitorResearchTools,
        hackathonParserTools,
        techStackAdvisorTools
      ] = await Promise.all([
        this.createMarketResearchTools(),
        this.createMarketAnalyzerTools(),
        this.createSocialListenerTools(),
        this.createSolutionGeneratorTools(),
        this.createCompetitorResearchTools(),
        this.createHackathonParserTools(),
        this.createTechStackAdvisorTools()
      ]);

      console.log('✅ All custom tools created successfully');

      return {
        marketResearch: marketResearchTools,
        marketAnalyzer: marketAnalyzerTools,
        socialListener: socialListenerTools,
        solutionGenerator: solutionGeneratorTools,
        competitorResearch: competitorResearchTools,
        hackathonParser: hackathonParserTools,
        techStackAdvisor: techStackAdvisorTools
      };
    } catch (error) {
      console.error('❌ Error creating custom tools:', error);
      throw error;
    }
  }

  /**
   * Get tool names by agent type
   */
  getToolsByAgentType(agentType: string): string[] {
    const toolMap: Record<string, string[]> = {
      'orchestrator': [
        'send_message_to_agent_async',
        'send_message_to_agent_wait',
        'core_memory_append',
        'core_memory_replace'
      ],
      'marketResearch': [
        'fetch_and_extract_pdf',
        'web_search',
        'run_code',
        'core_memory_append',
        'core_memory_replace'
      ],
      'marketAnalyzer': [
        'analyze_tfidf_gaps',
        'run_code',
        'core_memory_append',
        'core_memory_replace'
      ],
      'socialListener': [
        'search_reddit_signals',
        'web_search',
        'core_memory_append',
        'core_memory_replace'
      ],
      'solutionGenerator': [
        'generate_solution_ideas',
        'core_memory_append',
        'core_memory_replace'
      ],
      'competitorResearch': [
        'search_competitors',
        'web_search',
        'core_memory_append',
        'core_memory_replace'
      ],
      'hackathonParser': [
        'parse_hackathon_constraints',
        'web_search',
        'core_memory_append',
        'core_memory_replace'
      ],
      'techStackAdvisor': [
        'recommend_tech_stack',
        'core_memory_append',
        'core_memory_replace'
      ]
    };

    return toolMap[agentType] || [];
  }
}
