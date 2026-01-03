# Coolify Setup Guide

This guide covers setting up Coolify for the AI News Portal with PR preview deployments.

## Prerequisites

- Self-hosted Coolify instance
- GitHub repository with webhook access
- Docker registry (optional, for production)

## Coolify Project Setup

### 1. Create New Project

1. Log into your self-hosted Coolify instance
2. Click "New Project" 
3. Select "Git Repository"
4. Choose your GitHub repository
5. Select "Main" as the production branch

### 2. Production Applications

Create separate applications for each service:

#### Backend API
```
Name: ai-news-portal-backend
Type: Docker Compose
Source Path: /
Build Path: backend
Dockerfile: backend/Dockerfile
Port: 3000
Environment Variables:
- DATABASE_URL=postgresql://postgres:password@postgres:5432/ai_news_portal
- REDIS_URL=redis://redis:6379
- NODE_ENV=production
- JWT_SECRET=your-production-jwt-secret
- OPENAI_API_KEY=your-openai-api-key
```

#### Frontend Web
```
Name: ai-news-portal-frontend
Type: Docker Compose
Source Path: /
Build Path: frontend  
Dockerfile: frontend/Dockerfile
Port: 5173
Environment Variables:
- VITE_API_URL=https://your-backend-domain.com
```

#### Database (Optional - External Recommended)
```
Name: ai-news-portal-db
Type: PostgreSQL
Port: 5432
Environment Variables:
- POSTGRES_DB=ai_news_portal
- POSTGRES_USER=postgres
- POSTGRES_PASSWORD=secure-password
```

### 3. Preview Deployment Configuration

#### GitHub Webhook Setup
1. In Coolify project, go to "Webhooks"
2. Add webhook URL to your GitHub repository
3. Configure events: "Pull requests", "Pushes"

#### Preview App Template
Create a preview application template:

```
Template Name: PR Preview
Automatic Deployment: On PR Open
Stop on PR Close: Yes
Database Reset: Yes
Environment Variables:
- DATABASE_URL=postgresql://postgres:password@preview-db:5432/ai_news_portal_preview_{PR_NUMBER}
- REDIS_URL=redis://preview-redis:6379
- NODE_ENV=preview
- VITE_API_URL=https://preview-backend-{PR_NUMBER}.your-domain.com
```

### 4. Environment Management

#### Production Environment
```bash
# Required Production Variables
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=minimum-32-characters-long-secret
OPENAI_API_KEY=sk-...
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com

# Optional Production Variables
FRONTEND_URL=https://your-frontend-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

#### Preview Environment
```bash
# Auto-generated preview variables
DATABASE_URL=postgresql://postgres:password@postgres-preview:5432/ai_news_portal_preview_{PR_NUMBER}
REDIS_URL=redis://redis-preview:6379
NODE_ENV=preview
JWT_SECRET=preview-secret-{PR_NUMBER}
VITE_API_URL=https://preview-backend-{PR_NUMBER}.preview.your-domain.com
```

### 5. Deployment Script Configuration

Create `.coolify/` directory with deployment scripts:

```bash
mkdir -p .coolify/scripts
```

## GitHub Integration

### PR Workflow

1. **Developer creates branch** from GitHub issue
2. **Opens Pull Request** 
3. **Coolify auto-creates preview environment**
4. **Tests performed** in preview environment
5. **PR merged to main** triggers production deployment
6. **Preview environment automatically destroyed**

### Branch Protection Rules

Configure in GitHub repository settings:

```yaml
Required checks:
- coolify-preview-deployment
- coolify-production-build

Required status checks:
- "All checks must pass"

Branch protection rules:
- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
```

## Environment-Specific Configurations

### Production Docker Compose Override

Create `.coolify/docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  backend:
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    
  frontend:
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
```

### Preview Docker Compose Override

Create `.coolify/docker-compose.preview.yml`:

```yaml
version: '3.8'
services:
  postgres:
    environment:
      - POSTGRES_DB=ai_news_portal_preview_${PR_NUMBER}
    volumes:
      - preview_postgres_${PR_NUMBER}:/var/lib/postgresql/data
      
  backend:
    environment:
      - NODE_ENV=preview
      - LOG_LEVEL=debug
      
  frontend:
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://backend:3000
```

## Monitoring & Logging

### Application Health Checks

```yaml
# Add to Coolify application configuration
Health Check Path: /api/health
Health Check Interval: 30s
Health Check Timeout: 10s
Health Check Retries: 3
```

### Log Configuration

```yaml
# Production logging
LOG_LEVEL=info
LOG_FORMAT=json

# Preview logging  
LOG_LEVEL=debug
LOG_FORMAT=pretty
```

## Rollback Procedures

### Manual Rollback
1. Go to Coolify application
2. Click "Deployments" tab
3. Select previous deployment
4. Click "Redeploy"

### Emergency Rollback
```bash
# SSH into server
cd /var/www/ai-news-portal
git checkout previous-commit-tag
docker-compose up -d --force-recreate
```

## Security Considerations

### Secrets Management
- Store secrets in Coolify environment variables
- Never commit secrets to git
- Rotate secrets regularly
- Use different secrets for production/preview

### Network Security
```yaml
# Production firewall rules
- Only allow HTTP/HTTPS traffic to frontend
- Restrict backend API to internal network only
- Database only accessible from backend
- Redis only accessible from backend
```

## Troubleshooting

### Common Issues

1. **Preview environment not deploying**
   - Check webhook configuration
   - Verify GitHub permissions
   - Review Coolify logs

2. **Database connection errors**
   - Verify database environment variables
   - Check network connectivity
   - Review database service status

3. **Frontend build failures**
   - Check Vite API URL configuration
   - Verify environment variables
   - Review build logs in Coolify

### Debug Commands

```bash
# Check Coolify logs
docker logs coolify

# Check application logs
coolify app logs ai-news-portal-backend
coolify app logs ai-news-portal-frontend

# Manual deployment test
coolify deploy --app=ai-news-portal-backend --commit=sha
```

## Next Steps

1. Set up GitHub Actions for CI/CD
2. Configure monitoring and alerting
3. Set up automated testing
4. Configure backup and recovery
5. Set up production SSL certificates