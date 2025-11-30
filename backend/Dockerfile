# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for potential build steps)
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Production
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from the dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY --chown=nodejs:nodejs . .

# Set environment to production
ENV NODE_ENV=production

# Expose the port (default 8080, can be overridden)
EXPOSE 8080

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8080) + '/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "index.js"]
