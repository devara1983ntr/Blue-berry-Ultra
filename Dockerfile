# Stage 1: builder
FROM node:20-slim AS builder
WORKDIR /app

# Copy lockfiles for reproducible install
COPY package.json package-lock.json ./

# Install full deps for build (including devDependencies like tsx, vite, esbuild)
RUN npm ci

# Copy source code
COPY . .

# Run build script (script/build.ts)
# This generates:
# - dist/index.cjs (Server bundle)
# - dist/public/ (Client static files, via Vite)
RUN npm run build

# Stage 2: runtime
FROM node:20-slim AS runtime
WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Copy package files to install production dependencies
COPY package.json package-lock.json ./

# Copy data directory (required for server startup)
COPY data ./data

# Install only production dependencies
# This is necessary because script/build.ts externalizes some dependencies
RUN npm ci --production

# Set environment variables
ENV NODE_ENV=production

# Expose port 5000 (default)
EXPOSE 5000

# Start the server
# Use shell form to allow PORT expansion with default fallback
# This ensures Railway's PORT env var is respected, falling back to 5000 locally
CMD ["sh", "-c", "PORT=${PORT:-5000} node dist/index.cjs"]
