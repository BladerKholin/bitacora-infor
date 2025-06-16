# Etapa de build
FROM oven/bun:1 AS builder

WORKDIR /app
COPY . .
RUN bun install && bun run build

# Etapa de producción
FROM node:18-slim

WORKDIR /app

# Copia solo lo necesario desde la build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npx", "next", "start"]
