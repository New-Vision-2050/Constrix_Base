# Use an official Node runtime as a parent image
FROM node:22-alpine

RUN apk add --no-cache yarn

WORKDIR /app

# Declare build argument again for the runtime stage
ARG DEPLOYMENT_ID

# Set environment variable
ENV DEPLOYMENT_ID=${DEPLOYMENT_ID}
RUN ls -la
RUN pwd
# Copy built artifacts
COPY ./.next ./.next
COPY ./public ./public
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./node-modules ./
COPY ./.env ./


RUN rm -rf ./${DEPLOYMENT_ID}

# Install only production dependencies
#RUN yarn install --only=production

EXPOSE 3000

CMD ["yarn", "start"]
