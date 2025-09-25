# Stage 1: Build the application
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
# Copy the entire project context
COPY . .

# Build the 'api' application from its root
RUN npx nx build api --prod

# ---

# Stage 2: Create the final, smaller production image
FROM node:22-alpine
WORKDIR /app

# The output path from your custom webpack is dist/api
# This COPY command is now correct for your structure
COPY --from=builder /app/dist/api ./

# Copy production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

EXPOSE 3005
CMD ["node", "main.js"]
