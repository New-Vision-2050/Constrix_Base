# Use an official Node runtime as a parent image
FROM node:22-alpine

RUN apk add --no-cache yarn

WORKDIR /app

# Declare build argument again for the runtime stage
ARG DEPLOYMENT_ID
ARG DEPLOY_DIR

# Set environment variable
ENV DEPLOYMENT_ID=${DEPLOYMENT_ID}

# Copy built artifacts
COPY ${DEPLOYMENT_ID}/.next ./.next
COPY ${DEPLOYMENT_ID}/public ./public
COPY ${DEPLOYMENT_ID}/package.json ./
COPY ${DEPLOYMENT_ID}/yarn.lock ./
COPY ${DEPLOYMENT_ID}/node-modules ./
COPY ${DEPLOYMENT_ID}/.env ./


RUN rm -rf ./deployments/${DEPLOYMENT_ID}

# Install only production dependencies
#RUN yarn install --only=production

EXPOSE 3000

CMD ["yarn", "start"]
