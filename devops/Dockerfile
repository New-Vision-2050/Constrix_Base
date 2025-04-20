# Use an official Node runtime as a parent image
FROM node:22-alpine

RUN apk add --no-cache yarn

WORKDIR /app

# Declare build arguments
ARG DEPLOYMENT_ID
ARG CACHEBUST=1

# Set environment variable
ENV DEPLOYMENT_ID=${DEPLOYMENT_ID}

# Add cache busting argument - this will force Docker to rebuild from this point
# when the CACHEBUST value changes
RUN echo "Cache bust: ${CACHEBUST}"

# Copy built artifacts
COPY ./.next ./.next
COPY ./public ./public
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./.env ./.env

# Clean up any previous deployment artifacts
RUN rm -rf ../${DEPLOYMENT_ID}

# Install only production dependencies
RUN yarn install --only=production

# Add another cache busting step to ensure the final image is fresh
RUN echo "Final cache bust: ${CACHEBUST}"

EXPOSE 3000

CMD ["yarn", "start"]
