# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Optional: build args
ARG DEPLOYMENT_ID
ARG CACHEBUST=1
ENV DEPLOYMENT_ID=${DEPLOYMENT_ID}
RUN echo "Cache bust: ${CACHEBUST}"

# Stage 2: Run
FROM node:22-alpine AS runner

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
