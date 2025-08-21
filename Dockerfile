# Stage 1: Build the application
# Use a specific version of Node.js for consistency
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install all dependencies needed for the build
COPY package*.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# Run your custom webpack build for the 'api' application
RUN npx webpack-cli build --node-env=production --config=apps/api/webpack.config.js

# ---

# Stage 2: Create the final, smaller production image
# Use a slim Node.js image for a smaller final size
FROM node:18-alpine

WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app/dist/api ./

# Copy package files again to install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Expose the port the app runs on
EXPOSE 3000

# The command to start the application
CMD ["node", "main.js"]
