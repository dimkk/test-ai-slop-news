# AI News Portal MVP - Todo Plan

## Phase 1: Project Setup & Infrastructure

### Repository & CI/CD
- [ ] Initialize GitHub repository with main branch
- [ ] Configure GitHub Actions for basic CI
- [ ] Set up Coolify account and project
- [ ] Create docker-compose.yml for local development
- [ ] Configure Coolify preview app template

### Project Structure
- [ ] Create monorepo structure with frontend/backend/database
- [ ] Initialize backend with Bun + TypeScript
- [ ] Initialize frontend with React + Vite
- [ ] Set up Tailwind CSS and shadcn/ui
- [ ] Configure React Query
- [ ] Set up Drizzle ORM for database

### Database Setup
- [ ] Create PostgreSQL schema for articles
- [ ] Create users table for authentication
- [ ] Set up Redis for caching
- [ ] Create database migration scripts
- [ ] Seed with test data

## Phase 2: Backend Core Services

### RSS Ingestion Service
- [ ] Create RSS parser utility
- [ ] Implement scheduled fetch service (Bun cron)
- [ ] Add article deduplication logic
- [ ] Create article storage service
- [ ] Add error handling and logging

### AI Analysis Service
- [ ] Integrate OpenAI API client
- [ ] Implement article summarization
- [ ] Add content categorization
- [ ] Create AI processing queue
- [ ] Add retry logic for API failures

### API Endpoints
- [ ] GET /api/articles (list with pagination)
- [ ] GET /api/articles/:id (single article)
- [ ] GET /api/articles/search (search by title)
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] GET /api/auth/me (current user)

### Authentication & Authorization
- [ ] Implement JWT token generation
- [ ] Create middleware for protected routes
- [ ] Add password hashing (bcrypt)
- [ ] Implement session management
- [ ] Add user profile endpoints

## Phase 3: Frontend Application

### Core Components
- [ ] Create layout components (Header, Footer, Sidebar)
- [ ] Implement ArticleCard component
- [ ] Create ArticleDetail component
- [ ] Build SearchBar component
- [ ] Add Loading/Spinner components

### Pages & Routing
- [ ] Home page with article list
- [ ] Article detail page
- [ ] Search results page
- [ ] Login page
- [ ] Register page
- [ ] User profile page

### State Management
- [ ] Configure React Query for articles
- [ ] Create auth context/user state
- [ ] Implement search state management
- [ ] Add pagination logic
- [ ] Handle loading/error states

### UI/UX
- [ ] Implement responsive design
- [ ] Add dark/light mode toggle
- [ ] Create article filtering options
- [ ] Add infinite scroll or pagination
- [ ] Implement bookmark/favorite functionality

## Phase 4: Integration & Testing

### End-to-End Integration
- [ ] Connect frontend to backend API
- [ ] Test RSS ingestion to database flow
- [ ] Verify AI analysis pipeline
- [ ] Test authentication flow
- [ ] Validate search functionality

### Testing Suite
- [ ] Write unit tests for backend services
- [ ] Create API integration tests
- [ ] Add frontend component tests
- [ ] Implement E2E tests with Playwright
- [ ] Set up test database fixtures

### Performance & Optimization
- [ ] Add Redis caching for articles
- [ ] Implement database indexing
- [ ] Optimize API response times
- [ ] Add frontend code splitting
- [ ] Configure image optimization

## Phase 5: Deployment & Monitoring

### Production Deployment
- [ ] Configure production Docker images
- [ ] Set up Coolify production app
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure domain and DNS

### Monitoring & Logging
- [ ] Add application logging
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Add database performance metrics
- [ ] Create health check endpoints

### Documentation
- [ ] Write API documentation
- [ ] Create deployment guide
- [ ] Document development setup
- [ ] Add contributing guidelines
- [ ] Create user manual

## Phase 6: MVP Validation

### Feature Validation
- [ ] Test RSS ingestion works every 30 minutes
- [ ] Verify AI summaries are generated
- [ ] Test user registration/login flow
- [ ] Validate search functionality
- [ ] Check mobile responsiveness

### Workflow Validation
- [ ] Test GitHub issue → branch flow
- [ ] Verify PR → preview deployment
- [ ] Test preview environment functionality
- [ ] Validate PR merge → main deployment
- [ ] Confirm rollback procedures

### Performance Benchmarks
- [ ] Measure page load times
- [ ] Test API response times
- [ ] Verify database query performance
- [ ] Check memory usage
- [ ] Validate concurrent user handling

## Success Criteria Checklist

- [ ] RSS articles appear in web portal within 30 minutes
- [ ] Users can register/login and view articles
- [ ] AI summaries generated and displayed
- [ ] Search functionality works across articles
- [ ] Preview environments deploy automatically for PRs
- [ ] Full stack works end-to-end through all layers
- [ ] Mobile responsive design works
- [ ] Authentication is secure
- [ ] Performance meets acceptable standards
- [ ] Deployment workflow is fully automated

## Timeline Estimate

- **Phase 1**: 2-3 days (Setup & Infrastructure)
- **Phase 2**: 4-5 days (Backend Services)
- **Phase 3**: 3-4 days (Frontend App)
- **Phase 4**: 2-3 days (Integration & Testing)
- **Phase 5**: 1-2 days (Deployment & Monitoring)
- **Phase 6**: 1-2 days (Validation)

**Total Estimated Time**: 13-19 days