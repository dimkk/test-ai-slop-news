#!/bin/bash

# Coolify deployment helper script
# This script helps manage Coolify deployments

set -e

# Configuration
COOLIFY_URL="${COOLIFY_URL:-https://your-coolify-instance.com}"
API_TOKEN="${COOLIFY_API_TOKEN}"
PROJECT_ID="${COOLIFY_PROJECT_ID}"
REPO_OWNER="${GITHUB_REPOSITORY_OWNER}"
REPO_NAME="${GITHUB_REPOSITORY_NAME:-ai-news-portal}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if [ -z "$API_TOKEN" ]; then
        log_error "COOLIFY_API_TOKEN environment variable is required"
        exit 1
    fi
    
    if [ -z "$PROJECT_ID" ]; then
        log_error "COOLIFY_PROJECT_ID environment variable is required"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Get application status
get_app_status() {
    local app_name=$1
    log_info "Getting status for application: $app_name"
    
    curl -s -H "Authorization: Bearer $API_TOKEN" \
         "$COOLIFY_URL/api/v1/projects/$PROJECT_ID/applications" | \
         jq -r ".[] | select(.name == \"$app_name\")"
}

# Trigger deployment
trigger_deployment() {
    local app_name=$1
    local branch=$2
    local commit_sha=$3
    
    log_info "Triggering deployment for $app_name on branch $branch"
    
    local response=$(curl -s -X POST \
         -H "Authorization: Bearer $API_TOKEN" \
         -H "Content-Type: application/json" \
         -d "{\"branch\": \"$branch\", \"commit_sha\": \"$commit_sha\"}" \
         "$COOLIFY_URL/api/v1/projects/$PROJECT_ID/applications/$app_name/deploy")
    
    if echo "$response" | jq -e '.deployment_id' > /dev/null; then
        local deployment_id=$(echo "$response" | jq -r '.deployment_id')
        log_success "Deployment started with ID: $deployment_id"
        echo "$deployment_id"
    else
        log_error "Failed to trigger deployment"
        echo "$response" | jq -r '.message // .error'
        exit 1
    fi
}

# Watch deployment progress
watch_deployment() {
    local deployment_id=$1
    local timeout=${2:-600}  # 10 minutes default timeout
    
    log_info "Watching deployment progress (timeout: ${timeout}s)..."
    
    local start_time=$(date +%s)
    local end_time=$((start_time + timeout))
    
    while [ $(date +%s) -lt $end_time ]; do
        local status=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
             "$COOLIFY_URL/api/v1/deployments/$deployment_id" | \
             jq -r '.status')
        
        case $status in
            "success")
                log_success "Deployment completed successfully!"
                return 0
                ;;
            "failed")
                log_error "Deployment failed!"
                return 1
                ;;
            "running")
                log_info "Deployment in progress... ($((($(date +%s) - start_time)))s elapsed)"
                sleep 10
                ;;
            *)
                log_warning "Unknown status: $status"
                sleep 5
                ;;
        esac
    done
    
    log_error "Deployment timeout after ${timeout}s"
    return 1
}

# List all applications
list_applications() {
    log_info "Listing all applications..."
    
    curl -s -H "Authorization: Bearer $API_TOKEN" \
         "$COOLIFY_URL/api/v1/projects/$PROJECT_ID/applications" | \
         jq -r '.[] | "\(.name) - \(.status) - \(.url // "N/A")"'
}

# Main script logic
main() {
    case "${1:-help}" in
        "status")
            check_prerequisites
            get_app_status "${2:-ai-news-portal-backend}"
            ;;
        "deploy")
            check_prerequisites
            app_name="${2:-ai-news-portal-backend}"
            branch="${3:-main}"
            commit_sha="${4:-$(git rev-parse HEAD)}"
            deployment_id=$(trigger_deployment "$app_name" "$branch" "$commit_sha")
            watch_deployment "$deployment_id"
            ;;
        "list")
            check_prerequisites
            list_applications
            ;;
        "health")
            check_prerequisites
            for app in ai-news-portal-backend ai-news-portal-frontend; do
                get_app_status "$app" | jq -r '.name + ": " + (.health_status // "unknown")'
            done
            ;;
        "help"|*)
            echo "Coolify Deployment Helper"
            echo ""
            echo "Usage: $0 <command> [options]"
            echo ""
            echo "Commands:"
            echo "  status [app]      Get status of specific application"
            echo "  deploy [app] [branch] [sha]  Trigger deployment"
            echo "  list              List all applications"
            echo "  health            Check health of all applications"
            echo "  help              Show this help message"
            echo ""
            echo "Environment variables:"
            echo "  COOLIFY_URL       Coolify instance URL"
            echo "  COOLIFY_API_TOKEN API token for authentication"
            echo "  COOLIFY_PROJECT_ID Project ID"
            echo ""
            echo "Examples:"
            echo "  $0 status ai-news-portal-backend"
            echo "  $0 deploy ai-news-portal-backend main $(git rev-parse HEAD)"
            echo "  $0 list"
            ;;
    esac
}

main "$@"