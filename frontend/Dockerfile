# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl and setup nginx user
RUN apk add --no-cache curl && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx

# Create nginx configuration
RUN echo ' \
server { \
    listen 80; \
    listen [::]:80; \
    server_tokens off; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Set permissions
RUN chown -R nginx:nginx /etc/nginx/conf.d/default.conf && \
    chown -R nginx:nginx /usr/share/nginx/html

# Copy built assets with correct permissions
COPY --from=build --chown=nginx:nginx /app/build /usr/share/nginx/html

USER nginx

# Add health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]