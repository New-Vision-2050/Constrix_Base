#!/bin/bash

set -e
set -x

# Generate a unique cache bust value using the current timestamp and a random string
CACHEBUST=$(date +%s)-$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 8)
echo "Cache bust value: $CACHEBUST"

# Export CACHEBUST as an environment variable so Docker Compose can use it
export CACHEBUST

DEPLOY_DIR=/home/deployer/nextjs/deployments/$DEPLOYMENT_ID

echo "Deployment ID: $DEPLOYMENT_ID"
echo "Deployment Directory: $DEPLOY_DIR"

# Navigate to deployment directory
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

PROJECT_NAME=nextjs-$DEPLOYMENT_ID

 if docker ps -a --filter "name=$PROJECT_NAME" | grep -w "$PROJECT_NAME"; then
            echo "Existing deployment found for $PROJECT_NAME. Removing..."
            docker rm -f $PROJECT_NAME
            yes|docker image prune
            echo "Existing deployment removed."
            else
            echo "No existing deployment found for $PROJECT_NAME."
            fi

# Create .env file
cat <<EOF > .env
NEXT_PUBLIC_API_BASE_URL=$BE_URL
NEXT_PUBLIC_API_PATH=api
NEXT_PUBLIC_API_VERSION=v1
NODE_ENV=$NODE_ENV
NEXT_PUBLIC_CACHE_BUST=$CACHEBUST
DEPLOYMENT_ID=$DEPLOYMENT_ID
EOF

cat .env

# Secure the .env file
chmod 600 .env

# Clean any previous build artifacts
echo "Cleaning previous build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies and build
echo "Installing dependencies..."
yarn install

echo "Building with cache bust: $CACHEBUST..."
# Add CACHEBUST to the build command to ensure it's used in the build process
NEXT_PUBLIC_CACHE_BUST=$CACHEBUST yarn build

cd "$DEPLOY_DIR/devops"

#RUN chmod +x entrypoint.sh
#
#ENTRYPOINT ["devops/entrypoint.sh"]

# Start the containers and remove any orphaned containers
echo "Starting Docker containers with cache bust: $CACHEBUST"
docker compose -p $PROJECT_NAME build --no-cache
docker compose -p $PROJECT_NAME up --force-recreate --remove-orphans -d

# Verify the container is running
echo "Verifying container is running..."
docker ps | grep $PROJECT_NAME
