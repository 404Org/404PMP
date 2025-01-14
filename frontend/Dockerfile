FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Update exposed port to 3000
EXPOSE 3000

# Add custom nginx configuration for port 3000
RUN echo 'server { listen 3000; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]