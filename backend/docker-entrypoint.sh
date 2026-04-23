#!/bin/sh
set -e

echo "⏳ Ожидание PostgreSQL..."
until pg_isready \
  -h "${POSTGRES_HOST:-postgres}" \
  -p "${POSTGRES_PORT:-5432}" \
  -U "${POSTGRES_USER:-postgres}" \
  -d "${POSTGRES_DB:-news_feed}"; do
  sleep 2
done

echo "База готова. Применяем миграции..."
npm run migration:run

echo "Запускаем сиды..."
npm run db:seed || true

echo "Запускаем NestJS..."
exec "$@"
