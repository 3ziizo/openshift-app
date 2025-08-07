# Save this as frontend/Dockerfile
# Multi-stage build for production React app

# Stage 1: Build the React app
FROM registry.access.redhat.com/ubi8/nodejs-16:latest AS builder

# Set working directory
WORKDIR /opt/app-root/src

# Copy package files
COPY package*.json ./

# Install dependencies
USER 0
RUN npm ci --silent
USER 1001

# Copy source code
COPY --chown=1001:0 . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve with nginx
FROM registry.access.redhat.com/ubi8/nginx-120:latest

# Copy built React app to nginx html directory
COPY --from=builder /opt/app-root/src/build /opt/app-root/src/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create startup script for environment variables
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port 8080
EXPOSE 8080

# Use custom entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
