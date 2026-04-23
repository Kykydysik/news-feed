# 🔨 Этап 1: Сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY package*.json ./
RUN npm ci

# Копируем исходный код и собираем проект
COPY . .
RUN npm run build

# 🧰 Этап 1.5: Development-образ (для --watch, с devDependencies)
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000
ENV NODE_ENV=development

#CMD ["sh", "-c", "npm run migration:run && npm run db:seed && npx nest start --watch"]
CMD ["sh", "-c", "npx nest start --watch"]

# 📦 Этап 2: Production-образ (только скомпилированный код и prod-зависимости)
FROM node:20-alpine AS production

WORKDIR /app

# Копируем package.json и ставим только production-зависимости
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем скомпилированный JavaScript
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

# 🛡 Создаём непривилегированного пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3000
ENV NODE_ENV=production

CMD ["sh", "./docker-entrypoint.sh"]