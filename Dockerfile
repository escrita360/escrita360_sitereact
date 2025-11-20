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

# Create a simple entrypoint script to validate environment variables
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'echo "🔍 Checking environment variables..."' >> /app/entrypoint.sh && \
    echo 'if [ -z "$PAGBANK_TOKEN" ]; then' >> /app/entrypoint.sh && \
    echo '  echo "❌ ERROR: PAGBANK_TOKEN not set!"' >> /app/entrypoint.sh && \
    echo '  echo "Please configure environment variables in Easypanel"' >> /app/entrypoint.sh && \
    echo '  exit 1' >> /app/entrypoint.sh && \
    echo 'fi' >> /app/entrypoint.sh && \
    echo 'echo "✅ Environment variables validated"' >> /app/entrypoint.sh && \
    echo 'echo "   PAGBANK_ENV: $PAGBANK_ENV"' >> /app/entrypoint.sh && \
    echo 'echo "   PORT: $PORT"' >> /app/entrypoint.sh && \
    echo 'exec node server/app.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Expose port 5001
EXPOSE 5001

# Start the server with entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]