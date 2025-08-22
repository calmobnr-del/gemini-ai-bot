# docker/client.Dockerfile

# Stage 1: Build the Angular application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files from the project root
COPY package*.json ./
RUN npm install

# THIS IS THE MOST IMPORTANT STEP:
# Copy the ENTIRE project context into the container.
# This ensures Nx can find all its configuration files.
COPY . .

# Build the 'client' application for production
RUN npx nx build client --prod

# ---

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the built static files from the correct dist path
COPY --from=builder /app/dist/client/browser /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY docker/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
