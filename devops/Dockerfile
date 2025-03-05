# Use an official Node runtime as a parent image
FROM node:22-alpine

WORKDIR /app

# Declare build argument again for the runtime stage
ARG DEPLOYMENT_ID

# Set environment variable
ENV DEPLOYMENT_ID=${DEPLOYMENT_ID}

# Copy built artifacts
COPY ./deployments/${DEPLOYMENT_ID}/.next ./.next
COPY ./deployments/${DEPLOYMENT_ID}/public ./public
COPY ./deployments/${DEPLOYMENT_ID}/package.json ./
COPY ./deployments/${DEPLOYMENT_ID}/yarn.lock ./
COPY ./deployments/${DEPLOYMENT_ID}/node-modules ./
COPY ./deployments/${DEPLOYMENT_ID}/.env ./


RUN rm -rf ./deployments/${DEPLOYMENT_ID}

# Install only production dependencies
#RUN yarn install --only=production

EXPOSE 3000

CMD ["yarn", "start"]
