# Backend Dockerfile - InventoryMS API
# Multi-stage build for optimized production image

# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --production

# Copy source code
COPY . .

# Runtime stage
FROM oven/bun:latest

WORKDIR /app

# Install Node for compatibility (optional, bun is sufficient)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Set environment
ENV NODE_ENV=production

# Run the application
CMD ["bun", "run", "server.ts"]
