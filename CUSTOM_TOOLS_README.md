# Custom Tools System for MarketGap AI

This document explains the custom tools system that enhances each Letta agent with specialized capabilities for the MarketGap AI workflow.

## Overview

The custom tools system provides specialized tools for each agent type, making them more effective at their specific tasks. Each agent gets tools tailored to their role in the market gap analysis workflow.

## Architecture

```
src/utils/
├── customTools.ts          # Core tool definitions and creation logic
├── toolIntegration.ts      # Tool management and agent creation
└── agentManager.ts         # Existing agent management utilities
```

## Tool Categories

### Market Research Agent Tools

- **`fetch_and_extract_pdf`**: Downloads and extracts text from PDF URLs
- **Web search and code execution**: For finding PDFs and processing them

**Purpose**: Crawl consulting firm white papers and extract content for analysis.

### Market Analyzer Agent Tools

- **`analyze_tfidf_gaps`**: Analyzes documents using TF-IDF-like analysis to identify market gaps
- **Code execution**: For advanced text processing and analysis

**Purpose**: Process consulting documents to identify market gaps and opportunities.

### Social Listener Agent Tools

- **`search_reddit_signals`**: Search Reddit for posts related to keywords
- **Web search**: For finding additional social signals

**Purpose**: Gather audience insights from social platforms to understand target markets.

### Solution Generator Agent Tools

- **`generate_solution_ideas`**: Generate innovative solution ideas for market gaps
- **Memory management**: For storing and iterating on ideas

**Purpose**: Brainstorm and validate solution concepts based on identified gaps.

### Competitor Research Agent Tools

- **`search_competitors`**: Search for competitors for a given solution idea
- **Web search**: For comprehensive competitor analysis

**Purpose**: Validate solution novelty by finding and analyzing competitors.

### Hackathon Parser Agent Tools

- **`parse_hackathon_constraints`**: Extract constraints from hackathon pages
- **Web search**: For finding hackathon information

**Purpose**: Parse hackathon requirements to guide solution development.

### Tech Stack Advisor Agent Tools

- **`recommend_tech_stack`**: Recommend technology stacks for solutions
- **Memory management**: For storing recommendations

**Purpose**: Suggest appropriate technology stacks based on constraints and solution requirements.

## Usage

### 1. Initialize the Tool System

```typescript
import { ToolIntegrationManager } from './src/utils/toolIntegration';
import { LettaClient } from '@letta-ai/letta-client';

const client = new LettaClient({ baseUrl: 'http://localhost:8283' });
const toolManager = new ToolIntegrationManager(client);

// Initialize all tools
await toolManager.initializeAllTools();
```

### 2. Create Agents with Custom Tools

```typescript
// Create an agent with appropriate tools for its type
const agent = await toolManager.createAgentWithTools({
  name: 'MarketResearchAgent',
  agentType: 'marketResearch',
  memoryBlocks: [...],
  model: 'openai/gpt-4.1',
  embedding: 'openai/text-embedding-3-small'
});
```

### 3. Use Orchestrator for Multi-Agent Management

```typescript
import { OrchestratorAgent } from './src/agents/orchestrator';

const orchestrator = new OrchestratorAgent();
await orchestrator.initialize();

// Create worker agents
const marketAgentId = await orchestrator.createWorkerAgent('marketResearch', 'MarketResearchAgent');
const analyzerAgentId = await orchestrator.createWorkerAgent('marketAnalyzer', 'MarketAnalyzerAgent');

// Start workflow
await orchestrator.startWorkflow('Technology Industry');
```

## Custom Tool Development

### Creating New Tools

Tools are defined as Python functions with proper docstrings:

```python
def my_custom_tool(param1: str, param2: int) -> str:
    """
    Description of what the tool does.
    
    Args:
        param1 (str): Description of first parameter
        param2 (int): Description of second parameter
        
    Returns:
        str: Description of return value
    """
    # Tool implementation
    return f"Processed {param1} with value {param2}"
```

### Adding Tools to Agents

Update the `getToolsByAgentType` method in `CustomToolsManager`:

```typescript
getToolsByAgentType(agentType: string): string[] {
  const toolMap: Record<string, string[]> = {
    'myAgentType': [
      'my_custom_tool',
      'core_memory_append',
      'core_memory_replace'
    ],
    // ... other agent types
  };
  
  return toolMap[agentType] || [];
}
```

## Testing

Run the test script to verify the custom tools system:

```bash
npm run build
node dist/src/scripts/testCustomTools.js
```

The test script will:
1. Initialize all custom tools
2. Create orchestrator and worker agents
3. Test tool functionality
4. Verify inter-agent communication
5. Test workflow initialization

## Best Practices

1. **Keep tools focused**: Each tool should have a single, clear purpose
2. **Use proper error handling**: Tools should handle errors gracefully
3. **Document parameters**: Always provide clear docstrings
4. **Follow naming conventions**: Use descriptive, consistent tool names
5. **Test thoroughly**: Verify tools work correctly before deployment

## Troubleshooting

### Common Issues

- **Tool creation fails**: Check that tool Python code is valid
- **Agent creation fails**: Verify tool names match exactly
- **Tool execution fails**: Check tool parameters and error handling

### Debug Mode

Enable debug logging to see detailed tool execution:

```typescript
console.log('Available tools:', toolManager.getToolsForAgent('marketResearch'));
console.log('Created tools:', toolManager.getAllCreatedTools());
```

## Integration with MarketGap AI Workflow

The custom tools integrate seamlessly with the existing MarketGap AI workflow:

1. **Orchestrator** manages the workflow and creates worker agents
2. **Market Research** uses PDF extraction tools to gather data
3. **Market Analyzer** uses analysis tools to identify gaps
4. **Social Listener** uses social media tools for audience insights
5. **Solution Generator** uses ideation tools for brainstorming
6. **Competitor Research** uses search tools for validation
7. **Tech Stack Advisor** uses recommendation tools for implementation guidance

This system ensures each agent has the specialized tools needed for their role while maintaining the overall workflow coordination. 