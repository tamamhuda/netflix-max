FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.15.0

# Copy only package files first for better caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/

# Install dependencies (only for API, skip web postinstall)
RUN pnpm install --frozen-lockfile --filter @netflix-max/api... --filter @netflix-max/types --filter @netflix-max/config

# Copy source code
COPY apps/api ./apps/api
COPY packages ./packages
COPY tsconfig.json ./

# Build API
RUN pnpm --filter @netflix-max/api build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built files
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/package.json ./apps/api/

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]
