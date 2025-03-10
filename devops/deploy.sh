#!/bin/bash

set -e
set -x

# Generate a unique cache bust value using the current timestamp
CACHEBUST=$(date +%s)

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
EOF

cat .env

# Secure the .env file
chmod 600 .env

yarn install
yarn build

cd "$DEPLOY_DIR/devops"

RUN chmod +x devops/entrypoint.sh

ENTRYPOINT ["devops/entrypoint.sh"]

# Start the containers and remove any orphaned containers
docker compose -p $DEPLOYMENT_ID up --force-recreate --remove-orphans -d
