#!/bin/bash

# Pre-deployment script for Coolify
# This script runs before the actual deployment

set -e

echo "🚀 Starting pre-deployment for $COOLIFY_APP_NAME on branch $COOLIFY_BRANCH"

# Load environment variables
if [ -f ".env.$COOLIFY_BRANCH" ]; then
    echo "📝 Loading environment variables for branch: $COOLIFY_BRANCH"
    source ".env.$COOLIFY_BRANCH"
fi

# Database setup for preview environments
if [ "$COOLIFY_BRANCH" != "main" ]; then
    echo "🔧 Setting up preview environment for branch: $COOLIFY_BRANCH"
    
    # Extract PR number from branch name (format: pr-123 or feature/PR-123)
    PR_NUMBER=$(echo $COOLIFY_BRANCH | grep -o '[0-9]\+' | head -1)
    
    if [ ! -z "$PR_NUMBER" ]; then
        export DATABASE_URL="${DATABASE_URL/ai_news_portal/ai_news_portal_preview_$PR_NUMBER}"
        echo "🗄️ Preview database: ai_news_portal_preview_$PR_NUMBER"
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd backend
bun install
cd ../frontend
npm install
cd ..

# Run database migrations for production
if [ "$COOLIFY_BRANCH" == "main" ]; then
    echo "🗄️ Running database migrations for production..."
    cd backend
    bun run db:migrate
    cd ..
fi

echo "✅ Pre-deployment completed successfully"