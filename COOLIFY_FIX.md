# Coolify Docker Compose Fix

## Issue Resolved
Coolify doesn't support `restart_policy` and `deploy` configuration in Docker Compose. Fixed with:

### Changes Made

1. **Removed unsupported `restart_policy`** and replaced with `restart: unless-stopped`
2. **Removed `deploy` section** with replicas/resources (Coolify handles this)
3. **Simplified healthchecks** by removing `start_period` 
4. **Created Coolify-specific configuration** in `docker-compose.coolify.yml`

### Updated Files

#### Production Override
- `.coolify/docker/docker-compose.prod.yml` - Fixed restart policies
- `.coolify/docker/docker-compose.coolify.yml` - Simplified version

#### Preview Override  
- `.coolify/docker/docker-compose.preview.yml` - Added restart policies

### Coolify Configuration

Use the simplified configuration:

```yaml
# Coolify application settings:
# Override File: .coolify/docker/docker-compose.coolify.yml
# Environment Variables: Configure in Coolify UI
# Resources: Set in Coolify application settings
# Health Checks: Configure in Coolify UI if needed
```

### Recommended Coolify Setup

1. **Main Application** → Backend API
   - Source Path: `backend/`
   - Dockerfile: `backend/Dockerfile`
   - Override File: `.coolify/docker/docker-compose.coolify.yml`
   - Environment: Set in Coolify UI

2. **Frontend Application**
   - Source Path: `frontend/`  
   - Dockerfile: `frontend/Dockerfile`
   - Override File: `.coolify/docker/docker-compose.coolify.yml`
   - Environment: Set API URL in Coolify UI

3. **Database Application** (optional)
   - Use Coolify's managed PostgreSQL service
   - Set connection string in backend environment

### Key Changes

**Before (Not Compatible):**
```yaml
deploy:
  replicas: 2
  resources:
    limits:
      memory: 512M
restart_policy:
  condition: on-failure
  delay: 5s
  max_attempts: 3
```

**After (Coolify Compatible):**
```yaml
restart: unless-stopped
# Resources and replicas configured in Coolify UI
```

Now you can redeploy with Coolify using the fixed configuration!