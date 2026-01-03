# AI News Portal Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI NEWS PORTAL                            │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────┐    ┌─────────────────────────────────────┐
│   INFORMATION SOURCES  │    │          CORE ENGINE                 │
├───────────────────────┤    ├─────────────────────────────────────┤
│ • RSS Feeds           │    │ ┌─────────────┐  ┌─────────────────┐ │
│ • News APIs           │───▶│ │   Ingestion │─▶│   Processing   │ │
│ • Web Scraping        │    │ │   Service   │  │     Service     │ │
│ • Social Media        │    │ └─────────────┘  └─────────────────┘ │
│ • Custom Feeds        │    │         │                │           │
└───────────────────────┘    │         ▼                ▼           │
                             │ ┌─────────────┐  ┌─────────────────┐ │
                             │ │   Content   │  │   AI Analysis   │ │
                             │ │  Filtering  │  │   & Summarization│ │
                             │ │   Service   │  │     Service     │ │
                             │ └─────────────┘  └─────────────────┘ │
                             │         │                │           │
                             │         └────────┬───────┘           │
                             │                  ▼                   │
                             │ ┌─────────────────────────────────┐ │
                             │ │        Content Database         │ │
                             │ │    (PostgreSQL/MongoDB)         │ │
                             │ └─────────────────────────────────┘ │
                             └─────────────────────────────────────┘

                                      │
                                      ▼

┌─────────────────────────────────────────────────────────────────┐
│                      OUTPUT CHANNELS                             │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│ │     Web     │  │    Email    │  │   Telegram  │  │   Other     │ │
│ │   Portal    │  │  Newsletter │  │     Bot     │  │   Channels  │ │
│ │             │  │             │  │             │  │             │ │
│ │ • Frontend  │  │ • Daily     │  │ • Channel   │  │ • Slack     │ │
│ │ • REST API  │  │ • Weekly    │  │ • Personal  │  │ • Discord   │ │
│ │ • Real-time │  │ • Custom    │  │ • Groups    │  │ • Webhooks  │ │
│ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SUPPORTING SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│ • User Management      • Authentication & Authorization         │
│ • Content Categorization • Search & Indexing                      │
│ • Analytics & Metrics  • Caching Layer                          │
│ • Monitoring & Logging • Queue Management                       │
│ • Configuration Mgmt   • Backup & Recovery                      │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Ingestion**: Multiple sources are continuously scraped/pulled
2. **Processing**: Content is filtered, deduplicated, and categorized
3. **AI Analysis**: Articles are analyzed, summarized, and tagged
4. **Storage**: Processed content is stored in the database
5. **Distribution**: Content is pushed to various output channels
6. **Personalization**: Users receive customized content based on preferences

## Technology Stack

- **Backend**: Bun (TypeScript)
- **Database**: PostgreSQL + Redis (caching)
- **AI/ML**: OpenAI API, Hugging Face, spaCy
- **Queue**: RabbitMQ/Redis
- **Frontend**: React (vanilla) + React Query (state management) + Tailwind CSS + shadcn/ui
- **Mobile**: React Native/Flutter
- **Deployment**: Docker Compose + Coolify

## MVP Development Workflow

### Git Flow Process
1. **Issue → Branch**: Each GitHub issue creates a feature branch
2. **Branch → PR**: Feature branch creates Pull Request
3. **PR → Preview**: Coolify generates preview environment for PR
4. **Preview → Test**: Manual testing in preview environment
5. **Test → Merge**: Accept PR after testing
6. **Merge → Main**: Merge to main branch triggers production deployment

### MVP Features (Minimum Functional Through All Layers)

#### Information Sources (1 working source)
- **RSS Feed Ingestion**: Single tech news RSS feed (e.g., TechCrunch)
- **Basic Parser**: Extract title, content, publication date

#### Core Engine
- **Simple Ingestion Service**: Scheduled RSS fetch (every 30 min)
- **Basic Content Storage**: PostgreSQL with articles table
- **Minimal AI Analysis**: OpenAI API for 1-sentence summaries
- **Simple Filtering**: Remove duplicates by URL

#### Output Channels (1 working channel)
- **Web Portal**: 
  - Article list view
  - Article detail view
  - Basic search by title
  - Responsive design with Tailwind + shadcn

#### Supporting Services
- **User Management**: Basic auth (email/password)
- **Configuration**: Environment variables for RSS URL, API keys
- **Database Migrations**: Bun + Drizzle ORM

### Technical Implementation

#### Project Structure
```
ai-news-portal/
├── docker-compose.yml
├── frontend/
│   ├── package.json (React + React Query + Tailwind + shadcn)
│   └── src/
├── backend/
│   ├── package.json (Bun + TypeScript)
│   └── src/
└── database/
    └── migrations/
```

#### Docker Compose Services
- **frontend**: React dev server
- **backend**: Bun API server
- **postgres**: Database
- **redis**: Caching
- **ingestor**: Background RSS fetcher

#### Coolify Configuration
- **Preview Apps**: Auto-generated for each PR
- **Environment Variables**: Different per preview/production
- **Database**: Shared PostgreSQL with schema per preview

### MVP Success Criteria
- ✅ RSS articles appear in web portal within 30 minutes
- ✅ Users can register/login and view articles
- ✅ AI summaries generated and displayed
- ✅ Search functionality works
- ✅ Preview environments deploy automatically for PRs
- ✅ Full stack works end-to-end through all layers