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
COPY ${DEPLOY_DIR}/.next ./.next
COPY ${DEPLOY_DIR}/public ./public
COPY ${DEPLOY_DIR}/package.json ./
COPY ${DEPLOY_DIR}/yarn.lock ./
COPY ${DEPLOY_DIR}/node-modules ./
COPY ${DEPLOY_DIR}/.env ./


RUN rm -rf ${DEPLOY_DIR}

# Install only production dependencies
#RUN yarn install --only=production

EXPOSE 3000

CMD ["yarn", "start"]
