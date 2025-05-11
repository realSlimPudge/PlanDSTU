# Stage 1: Сборка приложения
FROM node:18-alpine AS builder
WORKDIR /app
# Копируем файлы с зависимостями и устанавливаем их
COPY package*.json ./
RUN npm ci --silent
# Копируем исходный код и строим приложение
COPY . .
RUN npm run build

# Stage 2: Запуск приложения
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Копируем необходимые файлы из стадии сборки
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
# Если вы используете standalone-режим, можно копировать соответствующие файлы:
# COPY --from=builder /app/.next/standalone ./
EXPOSE 3000
CMD ["npx","next", "start"]
