# MarketGap AI - Production Frontend

A comprehensive market analysis platform that identifies gaps, analyzes opportunities, and provides actionable insights for building innovative solutions.

## Features

- **Industry Analysis**: Select and analyze specific industry verticals
- **Consulting Intelligence**: Leverage insights from top consulting firms
- **Document Research**: AI-powered analysis of industry reports and PDFs
- **Gap Identification**: Discover and rank market opportunities
- **Audience Insights**: Real-time sentiment analysis from social platforms
- **Solution Development**: Iterative solution generation and refinement
- **Competitor Analysis**: Comprehensive competitive landscape mapping
- **Technology Recommendations**: Personalized tech stack suggestions
- **Export & Summary**: Complete analysis reports and documentation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: Ant Design 5.x
- **Styling**: CSS-in-JS via @ant-design/cssinjs
- **State Management**: React Context + Zustand
- **Icons**: Ant Design Icons
- **Deployment**: Static export ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 10+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd marketgap-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── industry/          # Industry selection page
│   ├── consulting/        # Consulting group selection
│   ├── research/          # Document analysis
│   ├── gaps/             # Market gaps analysis
│   ├── audience/         # Audience insights
│   ├── problems/         # Problem selection
│   ├── solutions/        # Solution development
│   ├── competitors/      # Competitor analysis
│   ├── hackathon/        # Hackathon optimization
│   ├── tech-stack/       # Technology recommendations
│   └── summary/          # Export and summary
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/         # React Context providers
│   ├── utils/           # Utility functions and API mocks
│   └── types/           # TypeScript type definitions
└── public/              # Static assets
```

## Key Components

### Navigation & Layout
- `TopNav` - Main navigation with progress tracking
- `PhaseBreadcrumbs` - Contextual breadcrumb navigation
- `WebsocketStatus` - Real-time connection status

### Analysis Components
- `IndustrySelector` - Industry selection interface
- `GapTable` - Market gaps analysis table
- `AudienceInsights` - Social platform sentiment analysis
- `SolutionWorkbench` - Iterative solution development
- `CompetitorTable` - Competitive analysis interface

### Data Components
- `DocsCrawlerProgress` - PDF analysis progress tracking
- `StackRecommender` - Technology recommendations
- `ExportSummary` - Final report generation

## API Integration

The application uses mock API functions located in `src/utils/api.ts`. In production, replace these with actual API endpoints:

- `getConsultingGroups()` - Fetch consulting firm data
- `getGapList()` - Retrieve market gaps
- `streamAudienceSignals()` - Get social media insights
- `iterateIdeas()` - Generate solution iterations
- `getCompetitors()` - Fetch competitor data
- `getTechStack()` - Get technology recommendations

## Design System

The application uses Ant Design with a custom theme:

- **Primary Color**: `#1677ff` (Blue)
- **Success Color**: `#52c41a` (Green)  
- **Error Color**: `#ff4d4f` (Red)
- **Border Radius**: 8px
- **Typography**: System fonts with clear hierarchy
- **Spacing**: 8px grid system

## Responsive Design

The application is optimized for:
- **Desktop**: Full-featured interface with multi-column layouts
- **Tablet**: Adapted layouts with collapsible navigation
- **Mobile**: Single-column stacked layouts with touch-friendly controls

## Performance Features

- Static export for fast CDN deployment
- Component code splitting with Next.js
- Optimized Ant Design imports
- Lazy loading for heavy components
- Progressive enhancement for offline capabilities

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus management for complex interactions

## Development Guidelines

### Code Quality
- ESLint with Airbnb TypeScript configuration
- Pre-commit hooks with Husky
- TypeScript strict mode enabled
- 100% type coverage required

### Component Structure
- One component per file
- Clear prop interfaces
- Comprehensive error boundaries
- Consistent naming conventions

### State Management
- React Context for app-wide state
- Local state for component-specific data
- Zustand for complex global state (when needed)
- Immutable state updates

## Deployment

The application is configured for static export and can be deployed to any CDN or hosting service:

```bash
npm run build
```

The built files will be in the `out/` directory, ready for deployment.

## Contributing

1. Follow the established code style and conventions
2. Add tests for new functionality
3. Update documentation for API changes
4. Ensure accessibility compliance
5. Test across different screen sizes and devices

## License

This project is proprietary software. All rights reserved.