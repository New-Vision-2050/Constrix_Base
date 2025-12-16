# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies required for sharp and other native modules
RUN apk add --no-cache \
    libc6-compat \
    vips-dev \
    fftw-dev \
    build-base \
    gcc \
    g++ \
    make \
    python3

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies including sharp
# Set environment to tell sharp to download prebuilt binaries for Alpine Linux
RUN npm_config_platform=linuxmusl npm install --legacy-peer-deps

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

# Install runtime dependencies for sharp
RUN apk add --no-cache \
    libc6-compat \
    vips

# Copy built app from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
