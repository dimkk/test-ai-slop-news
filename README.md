# AI News Portal

An AI-powered news portal that aggregates content from multiple sources and distributes it through various output channels.

## Features

- 🔗 **Multiple Information Sources**: RSS feeds, news APIs, web scraping
- 🤖 **AI Analysis**: Automated summarization and categorization
- 📱 **Multiple Output Channels**: Web portal, email newsletters, Telegram bot
- ⚡ **Real-time Updates**: Scheduled content ingestion
- 🔍 **Smart Search**: Full-text search across articles
- 👤 **User Authentication**: Personalized content delivery

## Tech Stack

### Backend
- **Runtime**: Bun (TypeScript)
- **Framework**: Hono
- **Database**: PostgreSQL + Drizzle ORM
- **Cache**: Redis
- **AI**: OpenAI API

### Frontend
- **Framework**: React + Vite
- **State Management**: React Query
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router

### Infrastructure
- **Containerization**: Docker Compose
- **Deployment**: Coolify
- **CI/CD**: GitHub Actions
- **Development**: GitHub PR → Preview workflow

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Bun (for local development)
- Node.js (for frontend)

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-news-portal
```

2. Copy environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start with Docker Compose:
```bash
npm run docker:up
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Seed the database:
```bash
npm run db:seed
```

6. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Development Commands

```bash
# Start all services
npm run dev

# Start individual services
npm run dev:frontend
npm run dev:backend

# Database operations
npm run db:migrate
npm run db:seed

# Docker operations
npm run docker:up
npm run docker:down
```

## Project Structure

```
ai-news-portal/
├── frontend/           # React frontend application
├── backend/            # Bun backend API
├── database/           # Database migrations and seeds
├── docker-compose.yml  # Local development environment
├── ARCHITECTURE.md     # System architecture documentation
└── MVP_TODO.md        # MVP development roadmap
```

## Development Workflow

1. **Issue → Branch**: Create feature branch from GitHub issue
2. **Branch → PR**: Open Pull Request
3. **PR → Preview**: Automatic Coolify preview deployment
4. **Preview → Test**: Test in preview environment
5. **Test → Merge**: Merge to main after approval
6. **Merge → Production**: Automatic production deployment

## MVP Features

### Current Implementation (Phase 1)
- ✅ Project setup and infrastructure
- ✅ Database schema (users, articles, bookmarks)
- ✅ Redis caching layer
- ✅ Frontend with React + Tailwind + shadcn/ui
- ✅ React Query integration
- ✅ Docker Compose development environment

### Next Steps (Phase 2)
- 🔄 RSS ingestion service
- 🔄 AI analysis integration
- 🔄 Authentication system
- 🔄 API endpoints
- 🔄 Frontend components

## License

MIT License - see LICENSE file for details.