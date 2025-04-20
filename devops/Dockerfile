# Use an official Node runtime as a parent image
FROM node:22-alpine AS builder
RUN apk add --no-cache yarn
COPY . .
RUN yarn install && yarn build
WORKDIR /app

# Declare build arguments
ARG DEPLOYMENT_ID
ARG CACHEBUST=1

# Set environment variable
ENV DEPLOYMENT_ID=${DEPLOYMENT_ID}

# Add cache busting argument - this will force Docker to rebuild from this point
# when the CACHEBUST value changes
RUN echo "Cache bust: ${CACHEBUST}"

# Copy only the necessary files from the build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
# Clean up any previous deployment artifacts
RUN rm -rf ../${DEPLOYMENT_ID}

ENV PORT 3000
EXPOSE 3000
CMD ["node", "server.js"]
