# Use Node.js image for building
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Copy server files
COPY --from=build /app/server ./server

# Copy package.json for server dependencies
COPY --from=build /app/server/package.json ./server/

# Install only server dependencies
WORKDIR /app/server
RUN npm install --production

# Set working directory back to app
WORKDIR /app

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["node", "server/app.js"]