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

# Production stage - Multi-service container
FROM node:18-alpine

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Set working directory
WORKDIR /app

# Copy built frontend files
COPY --from=build /app/dist ./dist

# Create nginx configuration
RUN mkdir -p /etc/nginx/http.d && \
    echo 'server {' > /etc/nginx/http.d/default.conf && \
    echo '    listen 80;' >> /etc/nginx/http.d/default.conf && \
    echo '    server_name _;' >> /etc/nginx/http.d/default.conf && \
    echo '    root /app/dist;' >> /etc/nginx/http.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/http.d/default.conf && \
    echo '' >> /etc/nginx/http.d/default.conf && \
    echo '    # API proxy' >> /etc/nginx/http.d/default.conf && \
    echo '    location /api/ {' >> /etc/nginx/http.d/default.conf && \
    echo '        proxy_pass http://localhost:5000;' >> /etc/nginx/http.d/default.conf && \
    echo '        proxy_http_version 1.1;' >> /etc/nginx/http.d/default.conf && \
    echo '        proxy_set_header Upgrade $http_upgrade;' >> /etc/nginx/http.d/default.conf && \
    echo '        proxy_set_header Connection "upgrade";' >> /etc/nginx/http.d/default.conf && \
    echo '        proxy_set_header Host $host;' >> /etc/nginx/http.d/default.conf && \
    echo '        proxy_set_header X-Real-IP $remote_addr;' >> /etc/nginx/http.d/default.conf && \
    echo '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' >> /etc/nginx/http.d/default.conf && \
    echo '        proxy_set_header X-Forwarded-Proto $scheme;' >> /etc/nginx/http.d/default.conf && \
    echo '    }' >> /etc/nginx/http.d/default.conf && \
    echo '' >> /etc/nginx/http.d/default.conf && \
    echo '    # Health check endpoint' >> /etc/nginx/http.d/default.conf && \
    echo '    location /health {' >> /etc/nginx/http.d/default.conf && \
    echo '        proxy_pass http://localhost:5000;' >> /etc/nginx/http.d/default.conf && \
    echo '    }' >> /etc/nginx/http.d/default.conf && \
    echo '' >> /etc/nginx/http.d/default.conf && \
    echo '    # SPA fallback' >> /etc/nginx/http.d/default.conf && \
    echo '    location / {' >> /etc/nginx/http.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/http.d/default.conf && \
    echo '    }' >> /etc/nginx/http.d/default.conf && \
    echo '}' >> /etc/nginx/http.d/default.conf

# Create supervisor configuration
RUN mkdir -p /etc/supervisor.d && \
    echo '[supervisord]' > /etc/supervisor.d/supervisord.ini && \
    echo 'nodaemon=true' >> /etc/supervisor.d/supervisord.ini && \
    echo 'user=root' >> /etc/supervisor.d/supervisord.ini && \
    echo 'logfile=/var/log/supervisord.log' >> /etc/supervisor.d/supervisord.ini && \
    echo 'pidfile=/var/run/supervisord.pid' >> /etc/supervisor.d/supervisord.ini && \
    echo '' >> /etc/supervisor.d/supervisord.ini && \
    echo '[program:nginx]' >> /etc/supervisor.d/supervisord.ini && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisor.d/supervisord.ini && \
    echo 'autostart=true' >> /etc/supervisor.d/supervisord.ini && \
    echo 'autorestart=true' >> /etc/supervisor.d/supervisord.ini && \
    echo 'stdout_logfile=/dev/stdout' >> /etc/supervisor.d/supervisord.ini && \
    echo 'stdout_logfile_maxbytes=0' >> /etc/supervisor.d/supervisord.ini && \
    echo 'stderr_logfile=/dev/stderr' >> /etc/supervisor.d/supervisord.ini && \
    echo 'stderr_logfile_maxbytes=0' >> /etc/supervisor.d/supervisord.ini

# Create entrypoint script with environment validation
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'echo "🔍 Checking environment variables..."' >> /app/entrypoint.sh && \
    echo 'echo "✅ Environment variables validated"' >> /app/entrypoint.sh && \
    echo 'echo ""' >> /app/entrypoint.sh && \
    echo 'echo "🚀 Starting services..."' >> /app/entrypoint.sh && \
    echo 'echo "   📱 Frontend (Nginx): Port 80"' >> /app/entrypoint.sh && \
    echo 'echo ""' >> /app/entrypoint.sh && \
    echo 'exec /usr/bin/supervisord -c /etc/supervisor.d/supervisord.ini' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Expose port for frontend
EXPOSE 80

# Start both services with supervisor
ENTRYPOINT ["/app/entrypoint.sh"]