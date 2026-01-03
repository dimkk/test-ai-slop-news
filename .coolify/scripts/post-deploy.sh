#!/bin/bash

# Post-deployment script for Coolify
# This script runs after successful deployment

set -e

echo "🎉 Starting post-deployment for $COOLIFY_APP_NAME on branch $COOLIFY_BRANCH"

# Health check for backend
echo "🏥 Checking backend health..."
sleep 10  # Wait for services to start

BACKEND_URL="http://localhost:3000"
if [ "$COOLIFY_BRANCH" != "main" ]; then
    # Use preview URL for non-main branches
    BACKEND_URL="https://preview-backend-${COOLIFY_APP_NAME}.${COOLIFY_DOMAIN}"
fi

# Test backend health endpoint
if curl -f -s "$BACKEND_URL/api/health" > /dev/null; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Seed database for preview environments
if [ "$COOLIFY_BRANCH" != "main" ]; then
    echo "🌱 Seeding preview database..."
    cd backend
    bun run db:seed
    cd ..
fi

# Frontend health check
echo "🏥 Checking frontend health..."
FRONTEND_URL="http://localhost:5173"
if [ "$COOLIFY_BRANCH" != "main" ]; then
    FRONTEND_URL="https://preview-frontend-${COOLIFY_APP_NAME}.${COOLIFY_DOMAIN}"
fi

# Test frontend accessibility
if curl -f -s "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo "🎊 Post-deployment completed successfully"
echo "🌐 Frontend URL: $FRONTEND_URL"
echo "🔗 Backend URL: $BACKEND_URL"