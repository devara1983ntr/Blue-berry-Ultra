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

# Install only production dependencies
# This is necessary because script/build.ts externalizes some dependencies
RUN npm ci --production

# Set environment variables
ENV NODE_ENV=production
# Set default PORT to 3000 as requested
ENV PORT=3000

# Expose port 3000
EXPOSE 3000

# Start the server
# The server code listens on process.env.PORT.
# If Railway provides a PORT env var, it will override the ENV PORT=3000.
CMD ["node", "dist/index.cjs"]
