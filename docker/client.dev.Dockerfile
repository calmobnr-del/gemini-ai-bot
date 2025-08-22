# This Dockerfile is ONLY for the development environment

# Start from a Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies inside the container
# This is important so the container has its own node_modules
COPY package*.json ./
RUN npm install

# Copy the rest of the source code to have a starting point
COPY . .

# The actual command to run the dev server will be provided by docker-compose
