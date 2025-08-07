# Simple Frontend Dockerfile (no custom entrypoint)
# Multi-stage build for production React app

# Stage 1: Build the React app
FROM registry.access.redhat.com/ubi8/nodejs-16:latest AS builder

WORKDIR /opt/app-root/src

# Copy package files and install dependencies
COPY package*.json ./
USER 0
RUN npm ci --silent
USER 1001

# Copy source and build
COPY --chown=1001:0 . .
RUN npm run build

# Stage 2: Serve with nginx
FROM registry.access.redhat.com/ubi8/nginx-120:latest

# Copy built React app
COPY --from=builder /opt/app-root/src/build /opt/app-root/src/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create a simple environment config file at build time
RUN echo 'window.ENV = { REACT_APP_API_URL: "/api" };' > /opt/app-root/src/env-config.js

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]